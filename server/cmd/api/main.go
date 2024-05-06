package main

import (
	"context"
	"database/sql"
	"flag"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/nhan10132020/imdb/server/internal/data"
	"github.com/nhan10132020/imdb/server/internal/jsonlog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	version string
)

type config struct {
	port int
	env  string
	db   struct {
		dsn          string
		maxOpenConns int
		maxIdleConns int
		maxIdleTime  string
	}
	limiter struct {
		rps     float64
		burst   int
		enabled bool
	}
	cors struct {
		trustedOrigins []string
	}
}

type application struct {
	config config
	logger *jsonlog.Logger
	wg     sync.WaitGroup
	models data.Models
}

func main() {
	var cfg config

	//port setting
	flag.IntVar(&cfg.port, "port", 4000, "API server port")

	// environment setting
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")

	// db setting
	flag.StringVar(&cfg.db.dsn, "db-dsn", "postgresql://root:password@imdb-postgres:5432/imdb-db?sslmode=disable", "PostgreSQL DSN")
	flag.IntVar(&cfg.db.maxOpenConns, "db-max-open-conns", 25, "PostgreSQL max open connections")
	flag.IntVar(&cfg.db.maxIdleConns, "db-max-idle-conns", 25, "PostgreSQL max idle connections")
	flag.StringVar(&cfg.db.maxIdleTime, "db-max-idle-time", "15m", "PostgreSQL max connection idle time")

	// rate-limiter setting
	flag.Float64Var(&cfg.limiter.rps, "limiter-rps", 2, "Rate limiter maximum requests per second")
	flag.IntVar(&cfg.limiter.burst, "limiter-burst", 4, "Rate limiter maximum burst")
	flag.BoolVar(&cfg.limiter.enabled, "limiter-enabled", true, "Enable rate limiter")

	// cors setting
	flag.Func("cors-trusted-origins", "Trusted CORS origins (space separated)", func(val string) error {
		cfg.cors.trustedOrigins = strings.Fields(val)
		return nil
	})

	flag.Parse()

	logger := jsonlog.New(os.Stdout, jsonlog.LevelInfo)

	db, postgresDB, err := openDB(cfg)
	if err != nil {
		logger.PrintFatal(err, nil)
	}
	defer postgresDB.Close()
	logger.PrintInfo("database connection pool established", nil)

	app := &application{
		config: cfg,
		logger: logger,
		models: data.NewModels(db),
	}

	err = app.serve()
	if err != nil {
		logger.PrintFatal(err, nil)
	}
}

func openDB(cfg config) (*gorm.DB, *sql.DB, error) {
	db, err := gorm.Open(postgres.Open(cfg.db.dsn), &gorm.Config{})
	if err != nil {
		return nil, nil, err
	}

	postgresDB, err := db.DB()
	if err != nil {
		return nil, nil, err
	}

	postgresDB.SetMaxOpenConns(cfg.db.maxOpenConns)
	postgresDB.SetMaxIdleConns(cfg.db.maxIdleConns)

	duration, err := time.ParseDuration(cfg.db.maxIdleTime)
	if err != nil {
		return nil, nil, err
	}
	postgresDB.SetConnMaxIdleTime(duration)

	// create a context with a 5-second timeout deadline
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Use PingContext() to establish a new connection to the database, with 5-second timeout
	err = postgresDB.PingContext(ctx)
	if err != nil {
		return nil, nil, err
	}

	return db, postgresDB, nil
}

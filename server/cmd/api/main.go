package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/joho/godotenv"
	"github.com/nhan10132020/imdb/server/internal/data"
	"github.com/nhan10132020/imdb/server/internal/jsonlog"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	version string
)

type config struct {
	port   int
	host   string
	aiPort int
	aiHost string
	env    string
	db     struct {
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
	err := godotenv.Load()
	if err != nil {
		if os.Getenv("SERVER_ENV") != "" {
			log.Println("server is running in docker container")
		} else {
			log.Fatal(err.Error())
		}
	}

	var cfg config

	// port setting
	cfg.port, _ = strconv.Atoi(os.Getenv("SERVER_PORT"))
	cfg.host = os.Getenv("SERVER_HOST")

	// ai service setting
	cfg.aiPort, _ = strconv.Atoi(os.Getenv("AI_PORT"))
	cfg.aiHost = os.Getenv("AI_HOST")

	// environment setting
	cfg.env = os.Getenv("SERVER_ENV")

	// db setting
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")
	dbName := os.Getenv("POSTGRES_DB")
	dbPort := os.Getenv("POSTGRES_PORT")
	dbHost := os.Getenv("POSTGRES_HOST")

	cfg.db.dsn = fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", dbUser, dbPassword, dbHost, dbPort, dbName)
	cfg.db.maxOpenConns, _ = strconv.Atoi(os.Getenv("SERVER_DB_MAX_OPEN_CONN"))
	cfg.db.maxIdleConns, _ = strconv.Atoi(os.Getenv("SERVER_DB_MAX_IDLE_CONN"))
	cfg.db.maxIdleTime = os.Getenv("SERVER_DB_MAX_IDLE_TIME")

	// rate-limiter setting
	cfg.limiter.rps, _ = strconv.ParseFloat(os.Getenv("SERVER_LIMITER_RPS"), 64)
	cfg.limiter.burst, _ = strconv.Atoi(os.Getenv("SERVER_LIMITER_BURST"))
	cfg.limiter.enabled, _ = strconv.ParseBool(os.Getenv("SERVER_LIMITER_ENABLED"))

	// cors setting
	clientPort := os.Getenv("CLIENT_PORT")
	cfg.cors.trustedOrigins = append(cfg.cors.trustedOrigins, fmt.Sprintf("http://localhost:%s", clientPort))

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

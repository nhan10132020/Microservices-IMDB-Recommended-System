.PHONY: run/api
run/api:
	go run ./cmd/api --db-dsn="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable" --port=4000 --cors-trusted-origins=http://localhost:3000
.PHONY: postgres
postgres:
	docker exec -it imdb-postgres-db-1 psql

.PHONY: createdb
createdb:
	docker exec -it imdb-postgres-db-1 createdb --username=root --owner=root imdb-db

.PHONY: dropdb
dropdb:
	docker exec -it imdb-postgres-db-1 dropdb imdb-db

.PHONY: mygrateup
mygrateup:
	migrate -path=migrations -database="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable" up

.PHONY: mygratedown
mygratedown:
	migrate -path=migrations -database="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable" down     

.PHONY: run/api
run/api:
	go run ./cmd/api --db-dsn="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable"
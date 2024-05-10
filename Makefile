.PHONY: server
server:
	make -C server run/api & make -C AI run/AI

.PHONY: client
client:
	make -C client run/client

.PHONY: docker-compose
docker-compose:
	docker compose --env-file ./.env.build up -d

.PHONY: postgres
postgres:
	docker exec -it imdb-postgres psql

.PHONY: createdb
createdb:
	docker exec -it imdb-postgres createdb --username=root --owner=root imdb-db

.PHONY: dropdb
dropdb:
	docker exec -it imdb-postgres dropdb imdb-db

.PHONY: mygrateup
mygrateup:
	migrate -path=migrations -database="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable" up

.PHONY: mygratedown
mygratedown:
	migrate -path=migrations -database="postgresql://root:password@localhost:5432/imdb-db?sslmode=disable" down     
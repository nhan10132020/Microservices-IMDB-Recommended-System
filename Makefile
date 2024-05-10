include .env.build

.PHONY: server
server:
	make -C server run/api & make -C AI run/AI

.PHONY: client
client:
	make -C client run/client

.PHONY: database-setup
database-setup:
	docker compose --env-file ./.env.build up -d imdb-postgres imdb-redis

.PHONY: environment
environment:
	cp ./client/.env.example ./client/.env ; cp ./server/.env.example ./server/.env ; cp ./AI/.env.example ./AI/.env

.PHONY: docker-compose-up
docker-compose-up:
	docker compose --env-file ./.env.build up -d

.PHONY: docker-compose-down
docker-compose-down:
	docker compose --env-file ./.env.build down

.PHONY: mygrateup
mygrateup:
	migrate -path=./server/migrations -database="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable" up

.PHONY: mygratedown
mygratedown:
	migrate -path=/server/migrations -database="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable" down     

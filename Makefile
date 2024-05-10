.PHONY: server
server:
	make -C server run/api & make -C AI run/AI

.PHONY: client
client:
	make -C client run/client

.PHONY: database-setup
database-setup:
	docker compose --env-file ./.env.build up -d imdb-postgres imdb-redis

.PHONY: docker-compose-up
docker-compose:
	docker compose --env-file ./.env.build up -d

.PHONY: docker-compose-down
docker-compose-down:
	docker compose --env-file ./.env.build down

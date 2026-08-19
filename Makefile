#!/usr/bin/make

SHELL = /bin/sh
DEV_COMPOSE = docker compose -f docker/docker-compose-dev.yml

.PHONY: help backend-up docker-up docker-down run-dev migration-create migration-generate migration-run migration-revert migration-show

UID := $(shell id -u)
GID := $(shell id -g)

export UID
export GID

help:                                                                    		       ## shows this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_\-\.]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup-ts-node-global: yarn global add ts-node
init: node-install docker-up 

node-install: npm install

migration-create: ## create an empty migration: make migration-create name=MyMigration
	npm run migration:create src/migrations/$(name)

migration-generate: ## generate a migration from entity diff: make migration-generate name=MyMigration
	npm run migration:generate src/migrations/$(name)

migration-run: ## run all pending migrations manually
	npm run migration:run

migration-revert: ## revert the latest migration
	npm run migration:revert

migration-show: ## show status of all migrations
	npm run migration:show

update-dump:
	docker exec backend-finanzdb-1 pg_dump -U admin finanz | gzip --stdout > dump.sql.gz

# nur ausführen wenn db komplett leer ist
load-dump:
	docker exec -i backend-finanzdb-1 psql -U admin -d finanz < dump.sql

# ausführen wenn relationen schon gesetzt sind
insert-data:
	docker exec -i backend-finanzdb-1 pg_restore -U admin -C -f dump.sql
	
init-frontend:
	npm install
	npm run build

backend-up:																			## start backend and its database
	$(DEV_COMPOSE) up -d backend

docker-up:																				## start all development containers
	$(DEV_COMPOSE) up -d

docker-down:
	$(DEV_COMPOSE) down

run-dev: backend-up

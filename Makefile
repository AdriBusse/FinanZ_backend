#!/usr/bin/make

SHELL = /bin/sh

UID := $(shell id -u)
GID := $(shell id -g)

export UID
export GID

help:                                                                    		       ## shows this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_\-\.]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup-ts-node-global: yarn global add ts-node
init: node-install docker-up 

node-install: yarn

create-migration: 
	yarn run typeorm migration:generate -d src/migrations -n migration

run-migrations: 
	yarn typeorm migration:run

update-dump:
	docker exec backend-finanzdb-1 pg_dump -U admin finanz | gzip --stdout > dump.sql.gz

# nur ausführen wenn db komplett leer ist
load-dump:
	docker exec -i backend-finanzdb-1 psql -U admin -d finanz < dump.sql


#ausführen wenn relationen schon gesetzt sind
insert-data:
	docker exec -i backend-finanzdb-1 pg_restore -U admin -C -f dump.sql
	
init-frontend:
	yarn install --force
	yarn build

docker-up:																				## create docker containers
	docker compose -f docker-compose-dev.yml up -d

docker-down:
	docker-compose -f docker-compose-dev.yml down

run-dev:
	make docker-up && yarn dev

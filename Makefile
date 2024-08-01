.PHONY: build-production
build-production: ## Build the production docker image.
	docker compose -f docker/docker-compose-with-postgresql.yml build

.PHONY: start-production
start-production: ## Start the production docker container.
	docker compose -f docker/docker-compose-with-postgresql.yml up -d

.PHONY: stop-production
stop-production: ## Stop the production docker container.
	docker compose -f docker/docker-compose-with-postgresql.yml down
PROJECT_NAME = file_share
DOCKER_COMPOSE = docker compose 

.PHONY: build run  

build:
	@go build -o cmd/$(PROJECT_NAME) ./cmd/main.go

run: build
	@./cmd/$(PROJECT_NAME)

docker-build:
	@$(DOCKER_COMPOSE) build

docker-up:
	@$(DOCKER_COMPOSE) up -d

docker-down:
	@$(DOCKER_COMPOSE) down

docker-clean:
	@$(DOCKER_COMPOSE) down --volumes --rmi all

docker-stop:
	@$(DOCKER_COMPOSE) stop

docker-restart:
	@$(DOCKER_COMPOSE) down && $(DOCKER_COMPOSE) up -d





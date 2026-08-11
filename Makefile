COMPOSE = docker compose

.PHONY: up build rebuild down stop restart refresh logs logs-backend logs-frontend logs-mysql ps shell-backend shell-frontend shell-mysql clean-volumes

up:
	$(COMPOSE) up -d

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

stop:
	$(COMPOSE) stop

restart:
	$(COMPOSE) restart

refresh:
	$(COMPOSE) down
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

logs-mysql:
	$(COMPOSE) logs -f mysql

ps:
	$(COMPOSE) ps

shell-backend:
	$(COMPOSE) exec backend sh

shell-frontend:
	$(COMPOSE) exec frontend sh

shell-mysql:
	$(COMPOSE) exec mysql mysql -uwedding_user -pwedding_password wedding_invitation

clean-volumes:
	$(COMPOSE) down -v

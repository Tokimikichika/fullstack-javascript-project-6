setup: prepare install db-migrate

install:
	npm install

db-migrate:
	npm run db-migrate

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	heroku local -f Procfile.dev

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

local-start:
	make start-backend & make start-frontend

lint:
	npx eslint .

test:
	npm test -s

test-coverage:
	npm test -- --coverage

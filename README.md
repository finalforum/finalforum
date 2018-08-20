# FinalForum

What?

* Just another forum
* Very early work in progress
* Monolithic for now (easy and cheap to install)
* It doesn't work yet!

Why?

* Because I want to
* Just scratching an itch
* It might be fun to build it
* Discourse can't have all the glory and money

## Table of Contents
1. [Setup](#1.-setup)
2. [Quick start](#2.-quick-start)
3. [API endpoints](#3.-api-endpoints)
4. [NPM scripts](#4.-npm-scripts)
5. [Environment variables](#5.-environment-variables)
  5.1 [Server](#5.1.-server)
  5.2 [Docker](#5.2.-docker)
  5.3 [Migration](#5.3.-migration)

## 1. Setup

* Install [Docker](https://docs.docker.com/install/)
* Install [Node.js](https://nodejs.org)
* Install project dependencies:
  ```sh
  npm ci
  ```

## 2. Quick start

```sh
npm start
```

This will
* Start a PostgreSQL database in a Docker container;
* Run a database initialization script (first time only);
* Wait until the database is ready to accept connections;
* Start the API server; and
* Watch for code changes, restarting the API server when changes are detected.

Use CTRL-C to stop.

Any database changes remain intact for subsequent runs.

## 3. API endpoints

*See [API.md](docs/API.md)*

## 4. NPM scripts

```sh
npm run <script-name>
```

| Name                        | Description                                                                     | Environment(s) | Required environment variables                                                                                                      |
|-----------------------------|---------------------------------------------------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------|
| start                       | Development quickstart - run everything and watch for changes.                  | Dev            |                                                                                                                                     |
| client:clean                | Delete the client build.                                                        |                |                                                                                                                                     |
| client:build                | Build the client.                                                               |                |                                                                                                                                     |
| client:watch                | Build the client and watch for changes.                                         |                |                                                                                                                                     |
| server:start                | Run the server.                                                                 |                | API_KEY, PORT, PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, SESSION_TTL, PASSWORD_RESET_TTL, SECURE_COOKIES                      |
| server:watch                | Run the server, restarting on code changes.                                     |                | API_KEY, PORT, PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, SESSION_TTL, PASSWORD_RESET_TTL, SECURE_COOKIES                      |
| server:healthcheck          | Wait until the server is ready to accept connections                            |                | API_KEY, PORT                                                                                                                       |
| dev:server:start            | Run the server.                                                                 | Dev            |                                                                                                                                     |
| dev:server:watch            | Run the server, restarting on code changes.                                     | Dev            |                                                                                                                                     |
| dev:server:healthcheck      | Wait until the server is ready to accept connections.                           | Dev            |                                                                                                                                     |
| dev:server:quickstart       | Run the server and a dev database, restarting the server on code changes.       | Dev            |                                                                                                                                     |
| test:server:start           | Run the server.                                                                 | Test, CI       |                                                                                                                                     |
| test:server:watch           | Run the server, restarting on code changes.                                     | Test           |                                                                                                                                     |
| test:server:healthcheck     | Wait until the server is ready to accept connections.                           | Test, CI       |                                                                                                                                     |
| test:run                    | Run tests. (Requires a running test server and test database.)                  | Test, CI       |                                                                                                                                     |
| test:integration:quickstart | Run the integration tests only.                                                 | Test           |                                                                                                                                     |
| test:quickstart             | Run all tests.                                                                  | Test           |                                                                                                                                     |
| db:start                    | Start or resume the database in the background.                                 |                | DB_PORT, DB_CONTAINER_NAME                                                                                                          |
| db:migrate                  | Perform database migrations to the latest version.                              |                | DB_HOST, DB_PORT, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, MIGRATION_USER, MIGRATION_PASSWORD, APP_DB, APP_USER, APP_PASSWORD |
| db:healthcheck              | Wait until the database is ready to accept connections.                         |                | DB_PORT, DB_CONTAINER_NAME                                                                                                          |
| db:pause                    | Stop the database, preserving its data for subsequent runs.                     |                | DB_PORT, DB_CONTAINER_NAME                                                                                                          |
| db:destroy                  | Stop and destroy the database.                                                  |                | DB_PORT, DB_CONTAINER_NAME                                                                                                          |
| dev:db:start                | Start or resume the database in the background.                                 | Dev            |                                                                                                                                     |
| dev:db:migrate              | Perform database migrations to the latest version.                              | Dev            |                                                                                                                                     |
| dev:db:healthcheck          | Wait until the database is ready to accept connections.                         | Dev            |                                                                                                                                     |
| dev:db:pause                | Stop the database, preserving its data for subsequent runs.                     | Dev            |                                                                                                                                     |
| dev:db:destroy              | Stop and destroy the database.                                                  | Dev            |                                                                                                                                     |
| test:db:start               | Start or resume the database in the background.                                 | Test           |                                                                                                                                     |
| test:db:migrate             | Perform database migrations to the latest version.                              | Test, CI       |                                                                                                                                     |
| test:db:healthcheck         | Wait until the database is ready to accept connections.                         | Test, CI       |                                                                                                                                     |
| test:db:pause               | Stop the database, preserving its data for subsequent runs.                     | Test           |                                                                                                                                     |
| test:db:destroy             | Stop and destroy the database.                                                  | Test           |                                                                                                                                     |
| lint                        | Run all the linters                                                             | Dev, CI        |                                                                                                                                     |

*NOTE: `:quickstart` scripts are all-in-one, setting up and tearing down the environment as required.

## 5. Environment variables

### 5.1. Server

These environment variables are required by the server. If any of them are not set, the server will abort.

| Name               | Description                      | Notes                                                              |
|--------------------|----------------------------------|--------------------------------------------------------------------|
| API_KEY            | API key                          | Shared secret to ensure private endpoints consumers are trusted    |
| PORT               | Server port                      | Sets the server's listening port                                   |
| PGHOST             | PostgreSQL instance host name    | Connects the server to the database (used by `node-postgres`)      |
| PGPORT             | PostgreSQL instance port         | Connects the server to the database (used by `node-postgres`)      |
| PGDATABASE         | PostgreSQL database              | Connects the server to the database (used by `node-postgres`)      |
| PGUSER             | PostgreSQL username              | Connects the server to the database (used by `node-postgres`)      |
| PGPASSWORD         | PostgreSQL password              | Connects the server to the database (used by `node-postgres`)      |
| SESSION_TTL        | User session TTL                 | Determines the lifespan, in minutes, of sessions and their cookies |
| PASSWORD_RESET_TTL | Password reset code TTL          | Determines the lifespan, in minutes, of password reset codes       |
| SECURE_COOKIES     | Cookie secure flag               | Secure cookie flag                                                 |

### 5.2. Docker

These environment variables are used inside [`docker-compose.yml`](.docker/docker-compose.yml).

| Name               | Description                      | Notes                                                              |
|--------------------|----------------------------------|--------------------------------------------------------------------|
| DB_CONTAINER_NAME  | PostgreSQL docker container name | Docker container name to identify PostgreSQL server                |
| POSTGRES_PASSWORD  | PostgreSQL password              | Admin password                                                     |

### 5.3. Migration

These environment variables are used by database migration scripts.

| Name               | Description                      | Notes                                                              |
|--------------------|----------------------------------|--------------------------------------------------------------------|
| DB_HOST            | PostgreSQL instance host name    | Database migrations hostname                                       |
| DB_PORT            | PostgreSQL instance port         | Database migrations port                                           |
| POSTGRES_DB        | PostgreSQL database name         | Main database                                                      |
| POSTGRES_USER      | PostgreSQL username              | Admin username (typically `postgres`)                              |
| POSTGRES_PASSWORD  | PostgreSQL password              | Admin username                                                     |
| MIGRATION_USER     | PostgreSQL username              | Migration script username (less privileged than admin)             |
| MIGRATION_PASSWORD | PostgreSQL password              | Migration script password                                          |
| APP_DB             | PostgreSQL database              | App database - contains all the app's data                         |
| APP_USER           | PostgreSQL username              | App database username (least privileged user)                      |
| APP_PASSWORD       | PostgreSQL password              | App database password                                              |

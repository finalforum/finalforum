#!/usr/bin/env bash

# NOTE: Run from project root, not this directory. Not used in CI.

export API_KEY=secret
export PORT=4000
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=apiauth
export PGUSER=apiauth
export PGPASSWORD=apiauth
export SESSION_TTL=44640
export PASSWORD_RESET_TTL=15
export SECURE_COOKIES=false

bold=$(tput bold)
red=$(tput setaf 1)
blue=$(tput setaf 4)
reset=$(tput sgr0)

# Start database
echo "${blue}Starting database${reset}"
npm run test:db:start

# Wait until database is accepting connections
echo "${blue}Waiting for database${reset}"
npm run test:db:healthcheck

# Configure database
echo "${blue}Performing database migrations${reset}"
npm run test:db:migrate

# Start server
echo "${blue}Starting server${reset}"
node index.js &
NODE_PROC_ID=$!

# Wait until the server is ready to accept connections
npm run test:server:healthcheck

# Run tests
echo "${blue}Running tests${reset}"
npm run test:run

# Stop server
echo "${blue}Stopping server${reset}"
kill -15 ${NODE_PROC_ID}
wait ${NODE_PROC_ID} > /dev/null 2>&1

# Stop databases
echo "${blue}Stopping databases${reset}"
npm run test:db:destroy

echo "${blue}Testing completed${reset}"

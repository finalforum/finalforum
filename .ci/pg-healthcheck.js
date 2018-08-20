#!/usr/bin/env node

const {Pool} = require('pg');
const checkEnv = require('../lib/check-env');
const promiseTimeout = require('../lib/promise-timeout');

const DEFAULT_INTERVAL = 1;
const DEFAULT_TIMEOUT = 30;

checkEnv({
    PGHOST:     'Database instance host',
    PGPORT:     'Database instance port',
    PGDATABASE: 'Database name',
    PGUSER:     'Database username',
    PGPASSWORD: 'Database password',
});

const {
    INTERVAL = DEFAULT_INTERVAL,
    TIMEOUT = DEFAULT_TIMEOUT,
} = process.env;

const start = Math.floor(Date.now() / 1000);

async function healthcheck() {
    do {
        try {
            const pool = new Pool();

            await pool.query('SELECT CURRENT_TIMESTAMP');
            pool.end();

            return true;
        } catch (err) {
            await promiseTimeout(INTERVAL);
        }
    } while (Math.floor(Date.now() / 1000) - start < TIMEOUT);

    return false;
}

healthcheck().then((success) => void process.exit(success ? 0 : 1));

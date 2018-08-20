const express = require('express');
const cookieParser = require('cookie-parser');
const {Pool} = require('pg');

const checkEnv = require('../../../lib/check-env');

// Required by pg
checkEnv({
    PGHOST:             'PostgreSQL instance host',
    PGPORT:             'PostgreSQL instance port',
    PGDATABASE:         'PostgreSQL database',
    PGUSER:             'PostgreSQL username',
    PGPASSWORD:         'PostgreSQL password',
});

const app = express();

app.use(express.json());
app.use(cookieParser());

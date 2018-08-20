const checkEnv = require('../../lib/check-env');

checkEnv({
    PGHOST:     'Database instance host',
    PGPORT:     'Database instance port',
    PGDATABASE: 'Database name',
    PGUSER:     'Database username',
    PGPASSWORD: 'Database password',
});

async function clearTables(pool) {
    const client = await pool.connect();

    // TODO: await client.query('DELETE FROM <table name>');

    client.release();
}

module.exports = clearTables;

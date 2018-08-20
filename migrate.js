const path = require('path');
const Postgrator = require('postgrator');

const checkEnv = require('./lib/check-env');

checkEnv({
    // Database connection details
    DB_HOST:            'Database instance hostname',
    DB_PORT:            'Database instance port',
    POSTGRES_DB:        'Main database',
    POSTGRES_USER:      'Database admin username',
    POSTGRES_PASSWORD:  'Database admin password',
    MIGRATION_USER:     'Database migration username',
    MIGRATION_PASSWORD: 'Database migration password',
    APP_DB:             'App database',
    APP_USER:           'Database app username',
    APP_PASSWORD:       'Database app password',
});

const {
    DB_HOST,
    DB_PORT,
    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    MIGRATION_USER,
    MIGRATION_PASSWORD,
    APP_DB,
} = process.env;

/**
 * Initial database setup: Create users.
 *
 * @returns {Promise.<Array>} a promise that resolves to the list of applied migrations
 */
function migrateUsers() {
    return new Postgrator({
        migrationDirectory: path.join(__dirname, 'migrations', 'admin-db'),
        driver:             'pg',
        host:               DB_HOST,
        port:               DB_PORT,
        database:           POSTGRES_DB,
        username:           POSTGRES_USER,
        password:           POSTGRES_PASSWORD,
        schemaTable:        'admin_schemaversion',
    })
        .migrate()
        .catch((error) => {
            console.error(error);
            console.error(error.appliedMigrations);
        });
}

/**
 * Initial database setup: Configure permissions.
 *
 * @returns {Promise.<Array>} a promise that resolves to the list of applied migrations
 */
function migratePermissions() {
    return new Postgrator({
        migrationDirectory: path.join(__dirname, 'migrations', 'app-db'),
        driver:             'pg',
        host:               DB_HOST,
        port:               DB_PORT,
        database:           APP_DB,
        username:           POSTGRES_USER,
        password:           POSTGRES_PASSWORD,
        schemaTable:        'admin_schemaversion',
    })
        .migrate('0001')
        .catch((error) => {
            console.error(error);
            console.error(error.appliedMigrations);
        });
}

/**
 * Migrate the schema up to the latest version.
 *
 * @returns {Promise.<Array>} a promise that resolves to the list of applied migrations
 */
function migrateSchema() {
    return new Postgrator({
        migrationDirectory: path.join(__dirname, 'migrations', 'app-db'),
        driver:             'pg',
        host:               DB_HOST,
        port:               DB_PORT,
        database:           APP_DB,
        username:           MIGRATION_USER,
        password:           MIGRATION_PASSWORD,
    })
        .migrate()
        .catch((error) => {
            console.error(error);
            console.error(error.appliedMigrations);
        });
}

(async function () {
    try {
        await migrateUsers();
        await migratePermissions();
        await migrateSchema();
        process.exit(0); // Seems to be necessary
    } catch (error) {
        console.error(error);
        console.error(error.appliedMigrations);
    }
})();

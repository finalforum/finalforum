const fs = require('fs');
const path = require('path');
const camelCase = require('lodash/camelCase');
const mapKeys = require('lodash/mapKeys');
const pick = require('lodash/pick');

const defaultMapRow = (row) => mapKeys(row, (v, k) => camelCase(k));

/**
 * Helper class to simplify creating DAOs.
 */
class Dao {
    /**
     * Create a new DAO.
     *
     * @param {Pool}     pool     - a PostgreSQL connection pool
     * @param {string}   baseDir  - the absolute base directory containing an sql directory with query files
     * @param {Function} [mapRow] - an optional function to map database rows to objects
     */
    constructor({pool, baseDir, mapRow = defaultMapRow}) {
        this.pool = pool;
        this.baseDir = baseDir;
        this.mapRow = mapRow;
    }

    /**
     * Create a function that executes an SQL select query defined in the specified filename.
     *
     * @param {string} sqlFilename - the name of the SQL file (without the .sql extension)
     * @param {Array.<string>} keys - the parameter object properties to use as SQL query parameters
     * @returns {Function} a query function that takes a params object and returns a promise
     */
    select(sqlFilename, keys) {
        const sql = fs.readFileSync(path.join(this.baseDir, 'sql', `${sqlFilename}.sql`)).toString();
        const {pool, mapRow} = this;

        return async (params = {}) => (await pool.query(sql, keys.map((key) => params[key]))).rows.map(mapRow);
    }

    /**
     * Create a function that executes an SQL insert, update or delete statement as defined in the specified filename.
     *
     * @param {string} sqlFilename - the name of the SQL file (without the .sql extension)
     * @param {Array.<string>} keys - the parameter object properties to use as SQL query parameters
     * @returns {Function} a data modifying function that takes a params object and returns a promise
     */
    update(sqlFilename, keys) {
        const sql = fs.readFileSync(path.join(this.baseDir, 'sql', `${sqlFilename}.sql`)).toString();
        const {pool} = this;

        // Returns {rows, rowCount}
        return async (params = {}) => {
            return pick(await pool.query(sql, keys.map((key) => params[key])), ['rows', 'rowCount']);
        };
    }
}

module.exports = Dao;

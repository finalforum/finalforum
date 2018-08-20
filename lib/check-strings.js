const {BAD_REQUEST} = require('./http-errors');

/**
 *
 * @param obj
 */
function checkStrings(obj) {
    if (!Object.values(obj).every((value) => value && typeof value === 'string' && value === value.trim())) {
        throw BAD_REQUEST;
    }
}

module.exports = checkStrings;

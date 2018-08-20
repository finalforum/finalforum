const BAD_REQUEST = {status: 400, message: 'Bad request'};
const NOT_AUTHORIZED = {status: 401, message: 'Not authorized'};
const NOT_FOUND = {status: 404, message: 'Not found'};
const INTERNAL_ERROR = {status: 500, message: 'Internal error'};

module.exports = {
    BAD_REQUEST,
    INTERNAL_ERROR,
    NOT_AUTHORIZED,
    NOT_FOUND,
};

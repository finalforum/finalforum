const crypto = require('crypto');
const cuid = require('cuid');

const uid = () => (
    crypto
        .createHash('sha256')
        .update(cuid())
        .digest('hex')
);

module.exports = uid;

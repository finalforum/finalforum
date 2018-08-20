// To be run by postgres user
module.exports.generateSql = () => `
    CREATE DATABASE ${process.env.APP_DB} OWNER ${process.env.MIGRATION_USER}
`;

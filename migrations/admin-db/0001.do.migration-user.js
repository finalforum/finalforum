// To be run by postgres user
module.exports.generateSql = () => `
    CREATE USER ${process.env.MIGRATION_USER} PASSWORD '${process.env.MIGRATION_PASSWORD}' CREATEDB
`;

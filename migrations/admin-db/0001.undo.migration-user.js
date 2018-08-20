// To be run by postgres user
module.exports.generateSql = () => `
    DROP USER ${process.env.MIGRATION_USER}
`;

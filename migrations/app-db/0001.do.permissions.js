// To be run by DDL_USER user
module.exports.generateSql = () => `
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ${process.env.APP_USER};
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ${process.env.APP_USER};
`;

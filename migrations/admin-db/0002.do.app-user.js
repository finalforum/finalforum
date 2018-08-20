// To be run by postgres user
module.exports.generateSql = () => `
    CREATE USER ${process.env.APP_USER} PASSWORD '${process.env.APP_PASSWORD}' CREATEDB
`;

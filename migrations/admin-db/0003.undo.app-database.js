// To be run by postgres user
module.exports.generateSql = () => `
    DROP DATABASE ${process.env.APP_DB}
`;

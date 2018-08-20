const Dao = require('../../../../../../lib/dao');

class PrincipalCredentialsDao {
    constructor({pool}) {
        const dao = new Dao({
            pool,
            baseDir: __dirname,
        });

        this.findByPrincipalId = dao.select(
            'findByPrincipalId',
            ['principalId']
        );

        this.findByUsername = dao.select(
            'findByUsername',
            ['username']
        );

        this.findByEmail = dao.select(
            'findByEmail',
            ['email']
        );

        this.findBySessionToken = dao.select(
            'findBySessionToken',
            ['sessionToken']
        );

        this.insert = dao.update(
            'insert',
            ['principalId', 'passwordHash', 'created']
        );

        this.updatePasswordHash = dao.update(
            'updatePasswordHash',
            ['id', 'passwordHash']
        );
    }
}

module.exports = PrincipalCredentialsDao;

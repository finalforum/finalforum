const Dao = require('../../../../../../lib/dao');

class PrincipalDao {
    constructor({pool}) {
        const dao = new Dao({
            pool,
            baseDir: __dirname,
        });

        this.findById = dao.select(
            'findById',
            ['id']
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
            ['username', 'email']
        );

        this.updateEmail = dao.update(
            'updateEmail',
            ['id', 'email']
        );

        this.updateUsername = dao.update(
            'updateUsername',
            ['id', 'username']
        );

        this.updateActive = dao.update(
            'updateActive',
            ['id', 'active']
        );

        this.deleteById = dao.update(
            'deleteById',
            ['id']
        );
    }
}

module.exports = PrincipalDao;

const Dao = require('../../../../../../lib/dao');

class PrincipalSession {
    constructor({pool}) {
        const dao = new Dao({
            pool,
            baseDir: __dirname,
        });

        this.findBySessionToken = dao.select(
            'findBySessionToken',
            ['sessionToken']
        );

        this.findOthersBySessionToken = dao.select(
            'findOthersBySessionToken',
            ['sessionToken']
        );

        this.findByPrincipalId = dao.select(
            'findByPrincipalId',
            ['principalId']
        );

        this.insert = dao.update(
            'insert',
            ['principalId', 'sessionToken', 'userAgent']
        );

        this.deleteBySessionToken = dao.update(
            'deleteBySessionToken',
            ['sessionToken']
        );

        this.deleteOtherByIdAndSessionToken = dao.update(
            'deleteOtherByIdAndSessionToken',
            ['id', 'sessionToken']
        );

        this.deleteOthersBySessionToken = dao.update(
            'deleteOthersBySessionToken',
            ['sessionToken']
        );

        this.deleteAllBySessionToken = dao.update(
            'deleteAllBySessionToken',
            ['sessionToken']
        );

        this.deleteByPrincipalId = dao.update(
            'deleteByPrincipalId',
            ['principalId']
        );

        this.deleteByCreatedBefore = dao.update(
            'deleteByCreatedBefore',
            ['created']
        );
    }
}

module.exports = PrincipalSession;

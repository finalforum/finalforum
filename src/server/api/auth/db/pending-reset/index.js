const Dao = require('../../../../../../lib/dao');

class PendingResetDao {
    constructor({pool}) {
        const dao = new Dao({
            pool,
            baseDir: __dirname,
        });

        this.findByEmailAndResetCode = dao.select(
            'findByEmailAndResetCode',
            ['email', 'resetCode']
        );

        this.insert = dao.update(
            'insert',
            ['principalId', 'resetCode']
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

module.exports = PendingResetDao;

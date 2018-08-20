const Dao = require('../../../../../../lib/dao');

class PendingActivationDao {
    constructor({pool}) {
        const dao = new Dao({
            pool,
            baseDir: __dirname,
        });

        this.findByEmailAndActivationCode = dao.select(
            'findByEmailAndActivationCode',
            ['email', 'activationCode']
        );

        this.insert = dao.update(
            'insert',
            ['principalId', 'activationCode']
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

module.exports = PendingActivationDao;

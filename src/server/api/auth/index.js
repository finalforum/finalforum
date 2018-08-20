const AuthController = require('./controller');
const passwordPolicy = require('./config/password-policy');
const PrincipalDao = require('./db/principal');
const PrincipalCredentialsDao = require('./db/principal-credentials');
const PendingActivationDao = require('./db/pending-activation');
const PendingResetDao = require('./db/pending-reset');
const PrincipalSessionDao = require('./db/principal-session');
const startPublicAuthEndpoints = require('./endpoints/public');
const startPrivateAuthEndpoints = require('./endpoints/private');

// Start the auth module
function init({pool, app}) {
    const authController = new AuthController({
        principalDao:                  new PrincipalDao({pool}),
        principalCredentialsDao:       new PrincipalCredentialsDao({pool}),
        pendingActivationDao:          new PendingActivationDao({pool}),
        pendingResetDao:               new PendingResetDao({pool}),
        principalSessionDao:           new PrincipalSessionDao({pool}),
        passwordPolicy,
    });

    startPublicAuthEndpoints({app, authController});
    startPrivateAuthEndpoints({app, authController});
}

module.exports = init;

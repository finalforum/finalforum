const checkEnv = require('../../../../../lib/check-env');
const httpMethods = require('../../../../../lib/http-methods');

checkEnv({
    API_KEY: 'Private API key',
});

function startPrivateAuthEndpoints({
    app,
    authController,
}) {
    const {GET} = httpMethods({
        app,
        path: '/api/v1/auth',
        apiKey: process.env.API_KEY,
    });

    GET('/sessions/:sessionToken/profile', async ({sessionToken}) => ({
        body: await authController.getProfile({sessionToken}),
    }));

    GET('/health', async () => ({
        body: {
            healthy: true,
        },
    }));
}

module.exports = startPrivateAuthEndpoints;

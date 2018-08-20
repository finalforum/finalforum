const checkEnv = require('../../../../../lib/check-env');
const httpMethods = require('../../../../../lib/http-methods');

checkEnv({
    SESSION_TTL:        'Session TTL in minutes',
    SECURE_COOKIES:     'Secure cookies setting (true: SSL only)',
});

function startPublicAuthEndpoints({
    app,
    authController,
}) {
    const {SESSION_TTL, SECURE_COOKIES} = process.env;
    const sessionTtlMins = parseInt(SESSION_TTL, 10);
    const secureCookies = SECURE_COOKIES === 'true';
    const {GET, POST, PATCH} = httpMethods({
        app,
        path: '/api/v1/auth',
        maxAge: sessionTtlMins * 60000,
        secure: secureCookies,
        sessionIdName: 'sessionToken',
        sessionIdCookieName: 'session_token',
    });

    POST('/username-available', async ({username}) => ({
        body: await authController.isUsernameAvailable({username}),
    }));

    POST('/register', async ({email, username}) => (
        void await authController.register({email, username})
    ));

    POST('/check-activation-code', async ({email, activationCode}) => ({
        body: await authController.isActivationCodeValid({email, activationCode}),
    }));

    POST('/activate', async ({email, activationCode, password}) => (
        void await authController.activate({email, activationCode, password})
    ));

    POST('/request-reset', async ({email}) => (
        void await authController.requestPasswordReset({email})
    ));

    POST('/check-reset-code', async ({email, resetCode}) => ({
        body: await authController.isResetCodeValid({email, resetCode}),
    }));

    POST('/reset', async ({email, resetCode, password}) => (
        void await authController.resetPassword({email, resetCode, password})
    ));

    POST('/login', async ({username, email, password}) => (
        await authController.login({username, email, password})
    ));

    GET('/profile', async ({sessionToken}) => ({
        body: await authController.getProfile({sessionToken}),
    }));

    PATCH('/profile/email', async ({sessionToken, email}) => (
        void await authController.updateEmail({sessionToken, email})
    ));

    PATCH('/profile/username', async ({sessionToken, username}) => (
        void await authController.updateUsername({sessionToken, username})
    ));

    POST('/change-password', async ({sessionToken, password, newPassword}) => (
        void await authController.changePassword({sessionToken, password, newPassword})
    ));

    GET('/sessions/current', async ({sessionToken}) => ({
        body: await authController.getSession({sessionToken}),
    }));

    GET('/sessions/other', async ({sessionToken}) => ({
        body: await authController.getOtherSessions({sessionToken}),
    }));

    POST('/logout/current', async ({sessionToken}) => (
        void await authController.logout({sessionToken})
    ));

    POST('/logout/others/:id', async ({sessionToken, id}) => (
        void await authController.logoutOther({sessionToken, id})
    ));

    POST('/logout/others', async ({sessionToken}) => (
        void await authController.logoutOthers({sessionToken})
    ));

    POST('/logout/all', async ({sessionToken}) => (
        void await authController.logoutAll({sessionToken})
    ));
}

module.exports = startPublicAuthEndpoints;

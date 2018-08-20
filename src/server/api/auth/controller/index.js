const bcrypt = require('bcrypt');
const omit = require('lodash/omit');
const checkStrings = require('../../../../../lib/check-strings');
const uid = require('../../../../../lib/uid');
const {NOT_AUTHORIZED, BAD_REQUEST} = require('../../../../../lib/http-errors');

const SALT_ROUNDS = 10;

const INCORRECT_ACTIVATION_CODE = {status: 400, message: 'Activation code invalid or expired'};
const INCORRECT_RESET_CODE = {status: 400, message: 'Reset code invalid or expired'};
const INCORRECT_LOGIN_CREDENTIALS = {status: 401, message: 'Incorrect username and/or password'};
const EMAIL_NOT_UNIQUE = {status: 400, message: 'Email address is already in use'};
const USERNAME_NOT_UNIQUE = {status: 400, message: 'Username is already in use'};
const INCORRECT_PASSWORD = {status: 401, message: 'Incorrect password'};

function ensureLoggedIn({sessionToken}) {
    if (!sessionToken) {
        throw NOT_AUTHORIZED;
    }
}

class AuthController {
    constructor({
        principalDao,
        principalCredentialsDao,
        pendingActivationDao,
        pendingResetDao,
        principalSessionDao,
        passwordPolicy,
    }) {
        this.principalDao = principalDao;
        this.principalCredentialsDao = principalCredentialsDao;
        this.pendingActivationDao = pendingActivationDao;
        this.pendingResetDao = pendingResetDao;
        this.principalSessionDao = principalSessionDao;
        this.passwordPolicy = passwordPolicy;
    }

    async isUsernameAvailable({username}) {
        checkStrings({username});

        return {
            available: !(await this.principalDao.findByUsername({username})).length,
        };
    }

    async register({email, username}) {
        checkStrings({email, username});

        // Ensure the email address isn't already used by an active user. Fail silently for privacy.
        if ((await this.principalCredentialsDao.findByEmail({email})).length) {
            return;
        }

        // Ensure the username isn't already used by an active user
        if ((await this.principalCredentialsDao.findByUsername({username})).length) {
            throw USERNAME_NOT_UNIQUE;
        }

        const [principal] = await this.principalDao.findByEmail({email});
        let id;

        if (!principal) {
            const {rows} = await this.principalDao.insert({username, email});

            ([{id}] = rows);
        } else if (username !== principal.username) {
            ({id} = principal);
            await this.principalDao.updateUsername({id, username});
        }

        const activationCode = uid();

        await this.pendingActivationDao.insert({
            principalId: id,
            activationCode,
        });

        // TODO: send email
    }

    async isActivationCodeValid({email, activationCode}) {
        checkStrings({email, activationCode});

        return {
            valid: !!(await this.pendingActivationDao.findByEmailAndActivationCode({email, activationCode})),
        };
    }

    async activate({email, activationCode, password}) {
        checkStrings({email, activationCode, password});

        const [pendingActivation] = await this.pendingActivationDao.findByEmailAndActivationCode({
            email,
            activationCode,
        });

        if (!pendingActivation) {
            throw INCORRECT_ACTIVATION_CODE;
        }

        if (!this.passwordPolicy.isValid(password)) {
            throw {status: 400, message: `Password requirements not met: ${this.passwordPolicy.text}`};
        }

        await Promise.all([
            this.principalCredentialsDao.insert({
                principalId: pendingActivation.principalId,
                passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
            }),
            this.pendingActivationDao.deleteByPrincipalId({
                principalId: pendingActivation.principalId,
            }),
        ]);
    }

    async requestPasswordReset({email}) {
        const [principal] = await this.principalDao.findByEmail({email});

        if (principal) {
            const resetCode = uid();

            await this.pendingResetDao.insert({
                principalId: principal.id,
                resetCode,
            });

            // TODO: send email
        }
    }

    async isResetCodeValid({email, resetCode}) {
        checkStrings({email, resetCode});

        return {
            valid: !!(await this.pendingResetDao.findByEmailAndResetCode({email, resetCode})),
        };
    }

    async resetPassword({email, resetCode, password}) {
        checkStrings({email, resetCode, password});

        const [pendingReset] = await this.pendingResetDao.findByEmailAndResetCode({
            email,
            resetCode,
        });

        if (!pendingReset) {
            throw INCORRECT_RESET_CODE;
        }

        if (!this.passwordPolicy.isValid(password)) {
            throw {status: 400, message: `Password requirements not met: ${this.passwordPolicy.text}`};
        }

        await Promise.all([
            this.principalCredentialsDao.updatePasswordHash({
                principalId: pendingReset.principalId,
                passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
            }),
            this.pendingResetDao.deleteByPrincipalId({
                principalId: pendingReset.principalId,
            }),
        ]);
    }

    async login({username, email, password, userAgent}) {
        checkStrings({password, userAgent});

        if (!(username || email)) {
            throw BAD_REQUEST;
        }

        const [principalCredentials] = await (
            username
                ? this.principalCredentialsDao.findByUsername({username})
                : this.principalCredentialsDao.findByEmail({email})
        );

        if (!principalCredentials) {
            throw INCORRECT_LOGIN_CREDENTIALS;
        }

        if (!(await bcrypt.compare(password, principalCredentials.passwordHash))) {
            throw INCORRECT_LOGIN_CREDENTIALS;
        }

        const sessionToken = uid();

        this.principalSessionDao.insert({
            principalId: principalCredentials.principalId,
            sessionToken,
            userAgent,
        });

        return {sessionToken};
    }

    async getProfile({sessionToken}) {
        ensureLoggedIn({sessionToken});
        const [principal] = await this.principalDao.findBySessionToken({sessionToken});

        if (!principal) {
            throw NOT_AUTHORIZED;
        }

        return omit(principal, ['id', 'active']);
    }

    async updateEmail({sessionToken, email}) {
        ensureLoggedIn({sessionToken});
        const [principal] = await this.principalDao.findBySessionToken({sessionToken});

        if (!principal) {
            throw NOT_AUTHORIZED;
        }

        const [otherPrincipal] = await this.principalDao.findByEmail({email});

        if (otherPrincipal && otherPrincipal.id !== principal.id) {
            throw EMAIL_NOT_UNIQUE;
        }

        await this.principalDao.updateEmail({
            id: principal.id,
            email,
        });
    }

    async updateUsername({sessionToken, username}) {
        ensureLoggedIn({sessionToken});
        const [principal] = await this.principalDao.findBySessionToken({sessionToken});

        if (!principal) {
            throw NOT_AUTHORIZED;
        }

        const [otherPrincipal] = await this.principalDao.findByUsername({username});

        if (otherPrincipal && otherPrincipal.id !== principal.id) {
            throw USERNAME_NOT_UNIQUE;
        }

        await this.principalDao.updateUsername({
            id: principal.id,
            username,
        });
    }

    async getSession({sessionToken}) {
        ensureLoggedIn({sessionToken});
        const [principalSession] = (await this.principalSessionDao.findBySessionToken({sessionToken}));

        if (!principalSession) {
            throw NOT_AUTHORIZED;
        }

        return omit(principalSession, ['sessionToken']);
    }

    async getOtherSessions({sessionToken}) {
        ensureLoggedIn({sessionToken});

        return this
            .principalSessionDao
            .findOthersBySessionToken({sessionToken})
            .map((principalSession) => omit(principalSession, ['sessionToken']));
    }

    async changePassword({sessionToken, password, newPassword}) {
        ensureLoggedIn({sessionToken});

        const [principalCredentials] = await this.principalCredentialsDao.findBySessionToken({sessionToken});

        if (!principalCredentials) {
            throw NOT_AUTHORIZED;
        }

        if (!(await bcrypt.compare(password, principalCredentials.passwordHash))) {
            throw INCORRECT_PASSWORD;
        }

        if (!this.passwordPolicy.isValid(newPassword)) {
            throw {status: 400, message: `Password requirements not met: ${this.passwordPolicy.text}`};
        }

        await this.principalCredentialsDao.updatePasswordHash({
            id: principalCredentials.id,
            passwordHash: await bcrypt.hash(newPassword, SALT_ROUNDS),
        });
    }

    async logout({sessionToken}) {
        await this.principalSessionDao.deleteBySessionToken({sessionToken});

        return {sessionToken: null};
    }

    async logoutOther({id, sessionToken}) {
        await this.principalSessionDao.deleteOtherByIdAndSessionToken({id, sessionToken});
    }

    async logoutOthers({sessionToken}) {
        await this.principalSessionDao.deleteOthersBySessionToken({sessionToken});
    }

    async logoutAll({sessionToken}) {
        await this.principalSessionDao.deleteAllBySessionToken({sessionToken});

        return {sessionToken: null};
    }
}

module.exports = AuthController;

const {BAD_REQUEST, INTERNAL_ERROR, NOT_AUTHORIZED} = require('./http-errors');

const endpoint = ({
    app,
    path,
    maxAge,
    secure,
    sessionIdName = 'sessionId',
    sessionIdCookieName = 'session_id',
    apiKeyHeader = 'x-api-key',
    apiKey,
    onApiKeyMissing = ({res}) => void res.status(BAD_REQUEST.status).send({message: BAD_REQUEST.message}),
    onApiKeyMismatch = ({res}) => void res.status(NOT_AUTHORIZED.status).send({message: NOT_AUTHORIZED.message}),
    onError = ({res, err}) => (
        void res
            .status(err.status || INTERNAL_ERROR.status)
            .send({message: err.status ? err.message || INTERNAL_ERROR.message : INTERNAL_ERROR.message})
    ),
}) => (method) => (subPath, action) => {
    app[method](`${path}${subPath}`, async (req, res) => {
        // Validate the API key if required
        if (apiKey) {
            if (!req.get(apiKeyHeader)) {
                onApiKeyMissing({res});

                return;
            }

            if (req.get(apiKeyHeader) !== apiKey) {
                onApiKeyMismatch({res});

                return;
            }
        }

        const sessionId = req.cookies[sessionIdCookieName];
        const userAgent = req.get('user-agent');

        try {
            const result = (await action({
                ...req.body,
                ...req.query,
                ...req.params,
                [sessionIdName]: sessionId,
                userAgent,
            })) || {};

            if (Object.prototype.hasOwnProperty.call(result, 'sessionId')) {
                if (result.sessionId) {
                    res.cookie(sessionIdName, result.sessionId, {maxAge, secure});
                } else {
                    res.clearCookie(sessionIdName, {secure});
                }
            }

            const {status, body} = result;

            if (body) {
                res.status(status || 200).send(body);
            } else {
                res.status(status || 204).end();
            }
        } catch (err) {
            onError({res, err});
        }
    });
};

module.exports = ({app, path, maxAge, secure, sessionIdName, apiKeyHeader, apiKey, onError}) => {
    const method = endpoint({app, path, maxAge, secure, sessionIdName, apiKeyHeader, apiKey, onError});

    return {
        GET: method('get'),
        POST: method('post'),
        PUT: method('put'),
        DELETE: method('delete'),
        PATCH: method('patch'),
    };
};

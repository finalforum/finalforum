const promiseTimeout = (timeout) => new Promise((resolve) => void setTimeout(resolve, timeout));

module.exports = promiseTimeout;

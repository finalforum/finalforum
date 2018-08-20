/**
 * Check that all the specified environment variables exist and, if one or more don't exist, print a report to stderr
 * and exit with an error code.
 *
 * @param {Object} environmentVariables - a map of environment variable names to their descriptions
 * @returns {undefined}
 */
function checkEnv(environmentVariables) {
    const missingVars = Object.entries(environmentVariables).filter(([name]) => !process.env[name]);

    if (missingVars.length) {
        console.error('Missing environment variables:\n');

        missingVars.forEach(([name, description]) => {
            console.error(` * ${name}`);
            console.error(`   ${description}\n`);
        });

        process.exit(1);
    }
}

module.exports = checkEnv;

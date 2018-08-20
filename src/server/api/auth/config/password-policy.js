const text = 'At least 6 characters, not beginning or ending with a space';

function isValid(password) {
    // Ensure password doesn't begin or end with a space
    if (password !== password.trim()) {
        return false;
    }

    // Ensure password is at least 6 characters long
    if (password.length < 6) {
        return false;
    }

    return true;
}

module.exports = {
    text,
    isValid,
};

import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

/**
 * Generates a JSON Web Token (JWT) for a user.
 * @param {Object} user - The user object containing payload data for the token.
 * @param {string} key - The secret key used to sign the token.
 * @returns {string} - A JWT prefixed with "Bearer ".
 */
export const getJWT = (user, key) => {
    // Sign the token with user data and key, set expiration time to 1 day (86400000 ms)
    return "Bearer " + sign(user, key, { expiresIn: '86400000' });
};
/**
 * Verifies a JSON Web Token (JWT) and returns the decoded payload.
 * @param {string} token - The JWT to be verified.
 * @returns {Object} - The decoded token payload.
 * @throws {JsonWebTokenError} - Throws an error if the token is invalid or expired.
 */

export const getJWTVerify = (token) => {
    // Verify the token with the secret key and return the decoded payload
    return verify(token, "zit");
};
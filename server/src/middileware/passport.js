import { ExtractJwt, Strategy } from "passport-jwt";
/**
 * Configures Passport.js to use JWT for authentication.
 * @param {Object} passport - The Passport.js instance to configure.
 */
const ownPassport = function (passport) {
    // Configuration options for the JWT strategy
    var opts = {};
    // Extract JWT from the Authorization header as a Bearer token
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    // Secret key used to verify the JWT
    opts.secretOrKey = 'zit';
    // Pass the request object to the verify callback function
    opts.passReqToCallback = true;
    // Configure Passport to use the JWT strategy
    passport.use(new Strategy(opts, async function (req, jwt_payload, done) {
        // If JWT payload is valid, return the payload
        if (jwt_payload)
            return done(null, jwt_payload)
        // If JWT payload is invalid, return false
        else
            return done(null, false)
    }));
}
export default ownPassport;

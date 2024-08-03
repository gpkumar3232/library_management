import { ExtractJwt, Strategy } from "passport-jwt";

const ownPassport = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'zit';
    opts.passReqToCallback = true;
    passport.use(new Strategy(opts, async function (req, jwt_payload, done) {
        if (jwt_payload)
            return done(null, jwt_payload)
        else
            return done(null, false)
    }));
}
export default ownPassport;

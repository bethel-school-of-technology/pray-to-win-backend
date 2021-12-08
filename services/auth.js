var passport = require("passport");
var passportJWT = require("passport-jwt");

var users = require("../mock-data/users.js");
var cfg = require("../config/passport.js");

var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
};

module.exports = function() {
    var strategy = new Strategy(params, function(payload, done) {
        console.log(payload);
        console.log("PAYLOAD FROM PASSPORT STRATEGY")
        var user = users[payload.id] || null;
        if (user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};
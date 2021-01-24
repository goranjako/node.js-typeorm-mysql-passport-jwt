"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User_1 = require("../entity/User");
const typeorm_1 = require("typeorm");
class passportManager {
    initialize() {
        var opts = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET_KEY,
        };
        passport_1.default.use(new passport_jwt_1.Strategy(opts, (payload, done) => {
            const userRepository = typeorm_1.getRepository(User_1.User);
            try {
                const user = userRepository.findOneOrFail({ where: {
                        email: payload.email
                    } });
                if (user) {
                    // note the return removed with passport JWT - add this return for passport local
                    done(null, user);
                }
                else {
                    console.log('user not found in db');
                    done(null, false);
                }
            }
            catch (err) {
                done(err);
            }
        }));
        return passport_1.default.initialize();
    }
    authenticate(req, res, next) {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Your token has expired." });
                }
                else {
                    return res.status(401).json({ success: false, msg: 'Unauthorized.' });
                }
            }
            req.body.user = user;
            return next();
        })(req, res, next);
    }
    ;
}
exports.default = new passportManager();
//# sourceMappingURL=passport.js.map
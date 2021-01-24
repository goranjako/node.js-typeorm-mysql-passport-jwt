"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const jwt = __importStar(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class Auth {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.password || !req.body.email) {
                    res.json({ success: false, msg: 'Please pass email and password.' });
                }
                else {
                    const user = new User_1.User();
                    user.fullName = req.body.fullName,
                        user.email = req.body.email,
                        user.password = req.body.password;
                    user.hashPassword();
                    yield typeorm_1.getRepository(User_1.User).save(user);
                    const token = jwt.sign({ userId: user.id, email: user.email, fullName: user.fullName, password: user.password }, process.env.SECRET_KEY, { expiresIn: "1h" });
                    //Send the jwt in the response
                    res.status(200).send({ success: true, msg: 'suseul register', token: token });
                }
            }
            catch (err) {
                return res.status(400).json({ success: false, msg: 'Costumer  Email already use' });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                if (!email || !password) {
                    res.json({ success: false, msg: 'Please pass email and password.' });
                }
                const userRepository = typeorm_1.getRepository(User_1.User);
                let user;
                try {
                    user = yield userRepository.findOne({ where: { email } });
                }
                catch (error) {
                    res.status(401).send({ error: 'User not found!' });
                    return;
                }
                if (!user.checkIfUnEncryptedPasswordIsValid(password)) {
                    return res.status(401).json({ msg: 'Unauthorized' });
                }
                const token = jwt.sign({ userId: user.id, email: user.email, fullName: user.fullName, password: user.password }, process.env.SECRET_KEY, { expiresIn: "1h" });
                //Send the jwt in the response
                res.status(200).send({ success: true, msg: 'suseul login', token: token });
            }
            catch (error) {
                res.status(401).send({ success: false, msg: 'Authentication failed' });
            }
        });
    }
}
;
exports.default = new Auth();
//# sourceMappingURL=auth.js.map
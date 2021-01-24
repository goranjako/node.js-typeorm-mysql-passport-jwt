"use strict";
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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
//getUsers
exports.getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        const users = yield userRepository.find();
        if (users) {
            return res.status(200).json(users);
        }
        else {
            return res.status(400).json({ success: false, msg: 'Not user found' });
        }
    }
    catch (error) {
        return res.send(error);
    }
});
//getUser
exports.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(User_1.User);
    try {
        const results = yield userRepository.findOneOrFail({ where: {
                id: req.params.id
            } });
        if (results) {
            res.status(200).json(results);
            return;
        }
        else {
            return res.status(400).json({ success: false, msg: 'Not user found' });
        }
    }
    catch (error) {
        return res.send(error);
    }
});
//createUser
exports.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.fullName || !req.body.email) {
            res.json({ success: false, msg: 'Please pass email and password.' });
        }
        else {
            var user = {
                fullName: req.body.fullName,
                email: req.body.email,
                password: req.body.password
            };
            const results = yield typeorm_1.getRepository(User_1.User).save(user);
            return res.status(200).json(results);
        }
    }
    catch (err) {
        return res.status(400).json({ success: false, msg: 'Costumer  Email already use' });
    }
});
//updateUser
exports.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield typeorm_1.getRepository(User_1.User).findOneOrFail({ where: {
                id: req.params.id
            } });
        if (user) {
            typeorm_1.getRepository(User_1.User).merge(user, req.body);
            const results = yield typeorm_1.getRepository(User_1.User).save(user);
            return res.status(200).json(results);
        }
    }
    catch (err) {
        return res.json({ msg: 'Not user found' });
    }
});
//deleteUser
exports.deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield typeorm_1.getRepository(User_1.User).findOneOrFail({ where: {
                id: req.params.id
            } });
        if (user) {
            const result = yield typeorm_1.getRepository(User_1.User).delete(user);
            return res.json({ msg: 'success delete user' });
        }
        else {
            return res.status(400).json({ success: false, msg: 'Not user found' });
        }
    }
    catch (error) {
        return res.send(error);
    }
});
//# sourceMappingURL=user.controller.js.map
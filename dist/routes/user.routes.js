"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { validateRegistrationBody, validateLoginBody, validate } = require('../middlewere/validation');
const router = express_1.Router();
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = __importDefault(require("../controllers/auth"));
const passport_1 = __importDefault(require("../middlewere/passport"));
router.post("/register", validateRegistrationBody(), validate, auth_1.default.register);
router.post("/login", validateLoginBody, validate, auth_1.default.login);
router.get("/users", passport_1.default.authenticate, user_controller_1.getUsers);
router.get("/users/:id", passport_1.default.authenticate, user_controller_1.getUser);
router.post("/users", passport_1.default.authenticate, user_controller_1.createUser);
router.put("/users/:id", passport_1.default.authenticate, user_controller_1.updateUser);
router.delete("/users/:id", passport_1.default.authenticate, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.routes.js.map
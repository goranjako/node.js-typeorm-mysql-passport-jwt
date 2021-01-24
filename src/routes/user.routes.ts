import { Router } from "express";
const {validateRegistrationBody,validateLoginBody, validate} = require('../middlewere/validation');
const router = Router();

import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "../controllers/user.controller";
import auth from '../controllers/auth';
import passportMenager from '../middlewere/passport';

router.post("/register", validateRegistrationBody(),validate, auth.register);
router.post("/login", validateLoginBody, validate,auth.login);
router.get("/users",passportMenager.authenticate, getUsers);
router.get("/users/:id",passportMenager.authenticate, getUser);
router.post("/users",passportMenager.authenticate,createUser);
router.put("/users/:id",passportMenager.authenticate, updateUser);
router.delete("/users/:id",passportMenager.authenticate, deleteUser);

export default router;


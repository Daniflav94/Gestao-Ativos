import express from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middlewares/handleValidation";
import { loginValidation, userCreateValidation } from "../middlewares/authValidation";
import { create } from "../controllers/organizationController";

const router = express.Router();

router.post("/", validate, create);

router.post("/login", loginValidation(), validate, login);
router.post("/register", userCreateValidation(), validate, register);

module.exports = router;

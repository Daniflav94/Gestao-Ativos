import express from "express";
import { register, login } from "../controllers/authController";
import { validate } from "../middlewares/handleValidation";
import { loginValidation, userCreateValidation } from "../middlewares/authValidation";

const router = express.Router();

router.post("/login", loginValidation(), validate, login);
router.post("/register", userCreateValidation(), validate, register);

module.exports = router;

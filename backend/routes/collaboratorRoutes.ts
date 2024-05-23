import express from "express";
import { authGuard } from "../middlewares/authGuard";
import { collaboratorValidation } from "../middlewares/collaboratorValidation";
import { validate } from "../middlewares/handleValidation";
import { listActiveCollaborators, listAllCollaborators, registerCollaborator, updateCollaborator } from "../controllers/collaboratorController";

const router = express.Router();

router.post("/", authGuard, collaboratorValidation(), validate, registerCollaborator);
router.get("/", authGuard, validate, listActiveCollaborators);
router.get("/list-all", authGuard, validate,listAllCollaborators);
router.put("/:id", authGuard, collaboratorValidation(), validate, updateCollaborator);

module.exports = router;

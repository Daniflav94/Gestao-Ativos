import express from "express";
import { authGuard } from "../middlewares/authGuard";
import { collaboratorValidation, updateCollaboratorValidation } from "../middlewares/collaboratorValidation";
import { validate } from "../middlewares/handleValidation";
import { listActiveCollaborators, listAllCollaborators, registerCollaborator, updateCollaborator } from "../controllers/collaboratorController";

const router = express.Router();

router.post("/", authGuard, collaboratorValidation(), validate, registerCollaborator);
router.get("/", authGuard, validate, listActiveCollaborators);
router.get("/list-all", authGuard, validate,listAllCollaborators);
router.patch("/:id", authGuard, updateCollaboratorValidation(), validate, updateCollaborator);

module.exports = router;

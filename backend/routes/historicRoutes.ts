import express from "express";
import { authGuard } from "../middlewares/authGuard";
import { validate } from "../middlewares/handleValidation";
import { historicValidation } from "../middlewares/historicValidation";
import { listAllHistoric, registerHistoric, updateAssetHistoric } from "../controllers/historicController";

const router = express.Router();

router.post("/", authGuard, historicValidation(), validate, registerHistoric);
router.get("/", authGuard, validate, listAllHistoric);
router.put("/:id", authGuard, historicValidation(), validate, updateAssetHistoric);

module.exports = router;

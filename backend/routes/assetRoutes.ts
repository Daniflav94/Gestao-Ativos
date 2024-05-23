import express from "express";
import { authGuard } from "../middlewares/authGuard";
import { validate } from "../middlewares/handleValidation";
import { listAllAssets, registerAsset, updateAsset } from "../controllers/assetController";
import { assetValidation } from "../middlewares/assetValidation";
import { fileUpload } from "../middlewares/fileUpload";

const router = express.Router();

router.post("/", authGuard, fileUpload.single("invoice") ,assetValidation(), validate, registerAsset);
router.get("/", authGuard, validate, listAllAssets);
router.put("/:id", authGuard, assetValidation(), validate, updateAsset);

module.exports = router;

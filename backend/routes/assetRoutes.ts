import express from "express";
import { authGuard } from "../middlewares/authGuard";
import { validate } from "../middlewares/handleValidation";
import { listAllAssets, registerAsset, updateAsset, updateFileAsset } from "../controllers/assetController";
import { assetValidation, updateAssetValidation } from "../middlewares/assetValidation";
import { fileUpload } from "../middlewares/fileUpload";

const router = express.Router();

router.post("/", authGuard, fileUpload.single("invoice"), assetValidation(), validate, registerAsset);
router.get("/", authGuard, validate, listAllAssets);
router.put("/:id", authGuard, updateAssetValidation(), validate, updateAsset);
router.patch("/file/:id", authGuard, fileUpload.single("invoice"), validate, updateFileAsset)

module.exports = router;

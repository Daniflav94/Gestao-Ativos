import express from "express";

export const router = express();

router.use("/api/auth", require("./authRoutes"));
router.use("/api/collaborators", require("./collaboratorRoutes"));
router.use("/api/assets", require("./assetRoutes"));

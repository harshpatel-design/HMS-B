import express from "express";
import { getDegrees } from "../controllers/degree.controller.js";

const router = express.Router();

router.get("/degrees", getDegrees);

export default router;

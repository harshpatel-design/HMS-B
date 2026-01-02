import express from "express";
import { getSpecializations } from "../controllers/specialization.controller..js";

const router = express.Router();

router.get("/specializations", getSpecializations);

export default router;

import express from "express";

import {
    createChargeMaster,
    getAllChargeMaster,
    getChargeMasterById,
    updateChargeMaster,
    deleteChargeMaster
} from "../controllers/chargemaster.controller.js"


import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";


import { chargeMasterSchema } from "../validation/chargeMaster.validation.js";

const router = express.Router();

router.post (
    "/",
    verifyToken,
    allowRoles("admin"),
    validateBody(chargeMasterSchema),
    createChargeMaster
);

router.get (
    "/",
    verifyToken,
    allowRoles('admin'),
    getAllChargeMaster
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  getChargeMasterById
);

router.patch(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  updateChargeMaster
);

router.delete(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  deleteChargeMaster
);

export default router;
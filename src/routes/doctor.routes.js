import express from "express";
import { verifyToken, allowRoles } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createDoctorSchema ,updateDoctorSchema  } from "../validation/doctor.validation.js";
import { uploadUserPhoto } from "../middlewares/uploadUserPhoto.js";

import {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
} from "../controllers/doctor.controller.js";
import { parseMultipartJSON } from "../middlewares/parseMultipartJSON.js";

const router = express.Router();

router.post(
    "/create-doctor",
    verifyToken,
    allowRoles("admin"),
    uploadUserPhoto.single("image"),
    parseMultipartJSON(["education", "schedule", "address", "awards", "certifications"]),
    validateBody(createDoctorSchema),
    createDoctor
);
router.get(
    "/doctors",
    verifyToken,
    allowRoles("admin"),
    getAllDoctors
);

router.get(
    "/doctors/:userId",
    verifyToken,
    allowRoles("admin"),
    getDoctorById
);
router.patch(
  "/doctors/:userId",
  verifyToken,
  allowRoles("admin"),
  uploadUserPhoto.single("image"),
  parseMultipartJSON([
    "education",
    "schedule",
    "address",
    "awards",
    "certifications",
  ]),
  validateBody(updateDoctorSchema),
  updateDoctor
);

router.delete(
    "/doctors/:userId",
    verifyToken,
    allowRoles("admin"),
    deleteDoctor
);

export default router;

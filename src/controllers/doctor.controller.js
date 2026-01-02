import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendSuccess, sendError } from "../utils/responses.js";
import { sendEmail } from "../utils/email.js";
import * as doctorService from "../services/doctor.service.js";
import { validationError } from "../middlewares/validate.middleware.js";

dotenv.config();

export const createDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.createDoctorService(req.body, req.file);

    const doctor = result.doctor;
    if (!doctor) {
      return sendError(next, new Error("Doctor creation failed"));
    }

    const resetToken = jwt.sign(
      { id: doctor.user._id.toString(), purpose: "reset_password" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailMessage = `
      <h2>Hello ${doctor.user.name}</h2>
      <p>Your doctor profile has been created.</p>
      <p>Please set your password using the link below:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link expires in 1 hour.</p>
    `;

    try {
      await sendEmail(
        doctor.user.email,
        "Set your hospital account password",
        emailMessage
      );
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr);
    }

    return sendSuccess(res, 201, {
      message: "Doctor created successfully",
      doctor,
      resetLink,
    });

  } catch (err) {
    if (err.code === 11000) {
      return sendError(
        next,
        validationError("Email already exists")
      );
    }
    return sendError(next, err);

  }
};

export const getAllDoctors = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const ordering = req.query.ordering || "-createdAt";


    const result = await doctorService.getAllDoctorsService(
      page,
      limit,
      search,
      ordering
    );

    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const result = await doctorService.getDoctorByIdService(req.params.id);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

export const updateDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.updateDoctorService(
      req.params._id,
      req.body,
      req.file
    );
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    const result = await doctorService.deleteDoctorService(req.params.userId);
    return sendSuccess(res, 200, result);
  } catch (err) {
    return sendError(next, err);
  }
};

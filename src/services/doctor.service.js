import mongoose from "mongoose";
import User from "../models/user.model.js";
import Doctor from "../models/doctor.model.js";
import Specialization from "../models/specialization.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createDoctorService = async (data, file) => {
  const {
    name,
    email,
    phone,
    gender,
    age,
    address,
    specialization,
    department,
    experience,
    bio,
    education,
    schedule,
    appointmentType,
    advanceBookingDays,
    slotDuration,
    consultationFee,
    maxBookingsPerSlot,
    awards,
    certifications,
  } = data;

  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.create({
    name,
    email,
    phone,
    gender,
    age,
    role: "doctor",
    password: null,
    image: file ? file.filename : null,
  });

  const doctor = await Doctor.create({
    user: user._id,
    address,
    specialization,
    department,
    experience,
    bio,
    education,
    schedule,
    appointmentType,
    advanceBookingDays,
    slotDuration,
    consultationFee,
    maxBookingsPerSlot,
    awards,
    certifications,
  });

  const populated = await Doctor.findById(doctor._id)
    .populate("user", "-password -refreshToken -__v")
    .lean();

  return {
    message: "Doctor created successfully",
    doctor: {
      doctorId: populated._id,
      ...populated,
      image: user.image
        ? `${process.env.API_URL}/uploads/users/${user.image}`
        : null,
    },
  };
};

export const getAllDoctorsService = async (
  page = 1,
  limit = 10,
  search = "",
  ordering = "createdAt"
) => {
  const skip = (page - 1) * limit;

  const searchFilter = {
    role: "doctor",
    ...(search && {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ],
    }),
  };

  const sortOrder = ordering.startsWith("-") ? -1 : 1;
  const sortField = ordering.replace("-", "");

  const users = await User.find(searchFilter)
    .select("_id")
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

  const doctors = await Doctor.find({ user: { $in: users.map((u) => u._id) } })
    .populate("user", "name _id image phone")
    .populate("specialization", "name")
    .select("user specialization schedule status ")
    .lean();

  const result = doctors.map((doc) => ({
    doctorid: doc.user._id,
    name: doc.user?.name,
    image: doc.user?.image ?? null,
    phone: doc.user?.phone ?? null,
    specialization: doc.specialization?.name ?? null,
    schedule: doc.schedule,
    status: doc.status,
  }));

  const total = await User.countDocuments(searchFilter);

  return {
    message: "Doctors fetched successfully",
    doctors: result,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getDoctorByIdService = async (id) => {
  console.log("iddddd", id);
  const user = await User.findOne({ id, role: "doctor" })
    .select("-password -refreshToken -__v")
    .lean();

  if (!user) {
    throw new Error("Doctor not found");
  }
  const doctor = await Doctor.findOne({ user: user._id })
    .populate("specialization", "name")
    .select("-__v")
    .lean();

  if (!doctor) {
    throw new Error("Doctor profile not found");
  }
  return {
    message: "Doctor fetched successfully",
    doctor: {
      doctorId: doctor._id,
      user: {
        ...user,
        image: user.image
          ? `${process.env.API_URL || ""}/uploads/users/${user.image}`
          : null,
      },

      profile: {
        address: doctor.address,
        specialization: doctor.specialization,
        department: doctor.department,
        experience: doctor.experience,
        bio: doctor.bio,
        education: doctor.education,
        schedule: doctor.schedule,

        appointmentType: doctor.appointmentType,
        advanceBookingDays: doctor.advanceBookingDays,
        slotDuration: doctor.slotDuration,
        consultationFee: doctor.consultationFee,
        maxBookingsPerSlot: doctor.maxBookingsPerSlot,

        awards: doctor.awards,
        certifications: doctor.certifications,

        status: doctor.status,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      },
    },
  };
};

export const updateDoctorService = async (id, updates, file) => {
  const userUpdates = {};
  const doctorUpdates = {};
  const userFields = ["name", "email", "phone", "gender", "age"];
  const doctorFields = [
    "address",
    "specialization",
    "department",
    "experience",
    "bio",
    "education",
    "schedule",
    "appointmentType",
    "advanceBookingDays",
    "slotDuration",
    "consultationFee",
    "maxBookingsPerSlot",
    "awards",
    "certifications",
    "status",
  ];

  for (const key in updates) {
    if (userFields.includes(key)) userUpdates[key] = updates[key];
    if (doctorFields.includes(key)) doctorUpdates[key] = updates[key];
  }


  if (file) {
    userUpdates.image = file.filename;
  }
const user = await User.findOneAndUpdate(
  { id, role: "doctor" },
  { $set: userUpdates },
  { new: true }
)
  .select("-password -refreshToken -__v")
  .lean();

if (!user) throw new Error("User not found");

  const doctor = await Doctor.findOneAndUpdate(
    { user: user._id },
    { $set: doctorUpdates },
    { new: true }
  ).lean();

  if (!doctor) throw new Error("Doctor profile not found");
  return {

    message: "Doctor updated successfully",
    doctor: {
      doctorId: doctor._id,
      ...doctor,
      user: {
        ...user,
        image: user.image
          ? `${process.env.API_URL}/uploads/users/${user.image}`
          : null,
      },
    },
  };
};

export const deleteDoctorService = async (userId) => {
  const user = await User.findOne({ userId, role: "doctor" });
  if (!user) throw new Error("Doctor not found");

  await Doctor.findOneAndDelete({ user: user._id });
  await User.findOneAndDelete({ _id: user._id });
  return { message: "Doctor deleted successfully" };
};

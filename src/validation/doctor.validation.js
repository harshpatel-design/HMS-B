import Joi from "joi";

export const createDoctorSchema = Joi.object({
  // ---------- USER FIELDS ----------
  name: Joi.string().trim().min(1).required().messages({
    "any.required": "Doctor name is required",
    "string.empty": "Doctor name cannot be empty",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
    "string.email": "Invalid email format",
  }),

  phone: Joi.string().optional(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .optional(),

  age: Joi.number().integer().min(0).optional(),

  // ---------- DOCTOR FIELDS ----------
  specialization: Joi.string().required().messages({
    "any.required": "Specialization is required",
  }),

  department: Joi.string().required().messages({
    "any.required": "Department is required",
  }),

  address: Joi.object({
    line1: Joi.string().allow("").optional(),
    line2: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    state: Joi.string().allow("").optional(),
    pincode: Joi.string().allow("").optional(),
    country: Joi.string().default("India"),
  }).optional(),

  experience: Joi.number().integer().min(0).default(0),

  bio: Joi.string().allow("").optional(),

  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institute: Joi.string().required(),
      year: Joi.number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required(),
    })
  ).optional(),

  schedule: Joi.array().items(
    Joi.object({
      day: Joi.string()
        .valid(
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY"
        )
        .required(),
      sessions: Joi.array()
        .items(
          Joi.object({
            sessionName: Joi.string()
              .valid("MORNING", "AFTERNOON", "EVENING")
              .required(),
            from: Joi.string().required(),
            to: Joi.string().required(),
          })
        )
        .min(1)
        .required(),
    })
  ).optional(),

  appointmentType: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .default("IN_PERSON"),

  advanceBookingDays: Joi.number().integer().min(0).default(7),
  slotDuration: Joi.number().integer().min(5).default(15),
  consultationFee: Joi.number().min(0).default(0),
  maxBookingsPerSlot: Joi.number().integer().min(1).default(1),

  awards: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      date: Joi.date().optional(),
    })
  ).optional(),

  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      date: Joi.date().optional(),
    })
  ).optional(),

  status: Joi.string().valid("active", "inactive").default("active"),
})

export const updateDoctorSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),

  email: Joi.string().email().optional(),

  phone: Joi.string().optional(),

  gender: Joi.string()
    .valid("male", "female", "other")
    .optional(),

  age: Joi.number().integer().min(0).optional(),

  specialization: Joi.string().optional(),

  department: Joi.string().optional(),

  address: Joi.object({
    line1: Joi.string().allow("").optional(),
    line2: Joi.string().allow("").optional(),
    city: Joi.string().allow("").optional(),
    state: Joi.string().allow("").optional(),
    pincode: Joi.string().allow("").optional(),
    country: Joi.string().optional(),
  }).optional(),

  experience: Joi.number().integer().min(0).optional(),

  bio: Joi.string().allow("").optional(),

  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institute: Joi.string().required(),
      year: Joi.number().integer().required(),
    })
  ).optional(),

  schedule: Joi.array().items(
    Joi.object({
      day: Joi.string().valid(
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
      ).required(),
      sessions: Joi.array().items(
        Joi.object({
          sessionName: Joi.string()
            .valid("MORNING", "AFTERNOON", "EVENING")
            .required(),
          from: Joi.string().required(),
          to: Joi.string().required(),
        })
      ).min(1).required(),
    })
  ).optional(),

  appointmentType: Joi.string()
    .valid("ONLINE", "IN_PERSON", "BOTH")
    .optional(),

  advanceBookingDays: Joi.number().integer().min(0).optional(),

  slotDuration: Joi.number().integer().min(5).optional(),

  consultationFee: Joi.number().min(0).optional(),

  maxBookingsPerSlot: Joi.number().integer().min(1).optional(),

  awards: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      date: Joi.date().optional(),
    })
  ).optional(),

  certifications: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      date: Joi.date().optional(),
    })
  ).optional(),

  status: Joi.string().valid("active", "inactive").optional(),
})
  .min(1) // 🔥 at least one field required for update
  .prefs({
    abortEarly: false,
    allowUnknown: true, // multipart safety
    convert: true,      // "12" → 12
  });

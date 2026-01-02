import Joi from "joi";

export const chargeMasterSchema = Joi.object({
  name: Joi.string().min(3).required(),
  code: Joi.string().uppercase().required(),
  chargeType: Joi.string()
    .valid(
      "OPD",
      "IPD",
      "EMERGENCY",
      "APPOINTMENT",
      "LAB",
      "PROCEDURE",
      "SERVICE"
    )
    .required(),

  amount: Joi.number().min(0).required(),
  currency: Joi.string().valid("INR").default("INR"),

  gstApplicable: Joi.boolean().default(false),
  gstRate: Joi.number().valid(0, 5, 12, 18).default(0),
  gstType: Joi.string().valid("CGST_SGST", "IGST"),

  hsnCode: Joi.string().optional(),
  taxInclusive: Joi.boolean(),

  labTest: Joi.string().optional(),
  doctor: Joi.string().optional(),
  department: Joi.string().optional(),

  effectiveFrom: Joi.date().optional(),
  effectiveTo: Joi.date().optional(),

  isActive: Joi.boolean(),
});

import mongoose from "mongoose";
import ChargeMaster from "../models/chargeMaster.model.js";

export const CreateChargeMasterService = async (payload, id) => {
  const {
    name,
    code,
    chargeType,
    amount,
    currency = "INR",
    gstApplicable = false,
    gstRate = 0,
    gstType = "CGST_SGST",
    hsnCode,
    taxInclusive = false,
    labTest,
    doctor,
    department,
    effectiveFrom,
    effectiveTo,
    isActive = true,
  } = payload;

  if (!name || !code || !chargeType || amount == null) {
    throw new Error("Required fields are missing");
  }
  const existingCharge = await ChargeMaster.findOne({
    code: code.toUpperCase(),
    doctor: doctor || null,
  });

  if (existingCharge) {
    throw new Error("Charge code already exists");
  }
  if (!gstApplicable && gstRate > 0) {
    throw new Error("GST rate must be 0 when GST is not applicable");
  }
  if (effectiveTo && effectiveFrom && effectiveTo < effectiveFrom) {
    throw new Error("effectiveTo cannot be earlier than effectiveFrom");
  }

  const charge = await ChargeMaster.create({
    name,
    code: code.toUpperCase(),
    chargeType,
    amount,
    currency,
    gstApplicable,
    gstRate,
    gstType,
    hsnCode,
    taxInclusive,
    labTest: labTest || null,
    doctor: doctor || null,
    department: department || null,
    effectiveFrom,
    effectiveTo,
    isActive,
    createdBy: id,
  });

  return {
    message: "Charge master created successfully",
    charge,
  };
};

export const GetAllChargeMasterService = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    ordering = "-createdAt",

    name,
    code,
    hsnCode,
    chargeType,
    doctor,
    department,
    labTest,
    effectiveFrom,
    effectiveTo,
    isActive,
  } = query;

  const filter = {};

  if (doctor) filter.doctor = doctor;
  if (department) filter.department = department;
  if (labTest) filter.labTest = labTest;
  if (chargeType) filter.chargeType = chargeType;

  if (isActive !== undefined) {
    filter.isActive = isActive === "true" || isActive === true;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
      { hsnCode: { $regex: search, $options: "i" } },
    ];
  }
  if (name) filter.name = { $regex: name, $options: "i" };
  if (code) filter.code = { $regex: code, $options: "i" };
  if (hsnCode) filter.hsnCode = { $regex: hsnCode, $options: "i" };

  if (effectiveFrom || effectiveTo) {
    filter.effectiveFrom = {};
    if (effectiveFrom) filter.effectiveFrom.$gte = new Date(effectiveFrom);
    if (effectiveTo) filter.effectiveFrom.$lte = new Date(effectiveTo);
  }


   let sortBy = "createdAt";
  let sortOrder = -1;

  if (ordering) {
    if (ordering.startsWith("-")) {
      sortBy = ordering.substring(1);
      sortOrder = -1;
    } else {
      sortBy = ordering;
      sortOrder = 1;
    }
  }

  const sort = { [sortBy]: sortOrder };
  const skip = (Number(page) - 1) * Number(limit);

  const [data, total] = await Promise.all([
    ChargeMaster.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    ChargeMaster.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const GetChargeMasterByIdService = async (id) =>{
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid charge id");
    }
    const charge  = await ChargeMaster.findById (id).lean();
    if (!charge) {
        throw new Error("Charge is not found")
    }
    return charge;
}

export const updateChargeMasterService = async (id, payload, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid charge id");
  }
  const charge = await ChargeMaster.findById(id);

  if (!charge) throw new Error("Charge not found");

  const allowedFields = [
    "name",
    "code",
    "chargeType",
    "amount",
    "currency",
    "gstApplicable",
    "gstRate",
    "gstType",
    "hsnCode",
    "taxInclusive",
    "labTest",
    "doctor",
    "department",
    "effectiveFrom",
    "effectiveTo",
    "isActive",
  ];

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      charge[key] = payload[key];
    }
  }

  if (payload.code) {
    const exists = await ChargeMaster.findOne({
      _id: { $ne: id },
      code: payload.code.toUpperCase(),
      doctor: payload.doctor || charge.doctor || null,
    });

    if (exists) {
      throw new Error("Charge code already exists");
    }

    charge.code = payload.code.toUpperCase();
  }

  if (!charge.gstApplicable && charge.gstRate > 0) {
    throw new Error("GST rate must be 0 when GST is not applicable");
  }

  if (
    charge.effectiveFrom &&
    charge.effectiveTo &&
    charge.effectiveTo < charge.effectiveFrom
  ) {
    throw new Error("effectiveTo cannot be earlier than effectiveFrom");
  }

  charge.updatedBy = userId;

  await charge.save();

  return {
    message: "Charge master updated successfully",
    charge,
  };
};

export const deleteChargeMasterService = async (id, userId) => {
    const charge = await ChargeMaster.findByIdAndDelete(id);
    if (!charge) throw new Error("charge not found");
    charge.updatedBy = userId;
    return { message: "Charge deleted successfully" };
};
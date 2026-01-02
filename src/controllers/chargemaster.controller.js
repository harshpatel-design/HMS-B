import {
  CreateChargeMasterService,
  GetAllChargeMasterService,
  GetChargeMasterByIdService,
  updateChargeMasterService,
  deleteChargeMasterService,
} from "../services/chargeMaster.service.js";



import { sendSuccess,sendError } from "../utils/responses.js";

export const createChargeMaster = async (req,res,next) => {
        try {
            const result = await CreateChargeMasterService (
                req.body,
                req.user.id
            );
            return sendSuccess(res,201,result)
        } catch (err) {
            return sendError(err,next)
        }
}

export const getAllChargeMaster = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      search = "",
      sortBy = "createdAt",
        ordering,
      sortOrder = "desc",

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
    } = req.query;

    const result = await GetAllChargeMasterService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
      sortBy,
      ordering,
      sortOrder,
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
    });

    return res.status(200).json({
      success: true,
      message: "Charge masters fetched successfully",
      ...result,
    });
  } catch (error) {
   return sendError(error,next)
  }
};








export const getChargeMasterById = async (req,res,next) =>{
  try {``
    const result = await GetChargeMasterByIdService(req.params.id);
    return sendSuccess(res, 200, result);
  } catch (error) {
    return sendError(error,next);
  }
}


export const updateChargeMaster = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const userId = req.user.id; // auth middleware se aata hai

    const result = await updateChargeMasterService(id, payload, userId);

    return sendSuccess(res, 200, result);
  } catch (error) {
   return sendError(error,next)
  }
};



export const deleteChargeMaster = async (req, res, next) => {
    try {
        const result = await deleteChargeMasterService(
            req.params.id,
            req.user.id
        );
        return sendSuccess(res, 200, result);
    } catch (err) {
        return sendError(err,next);
    }
};

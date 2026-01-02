import { getSpecializationsService } from "../services/specialization.service.js";

export const getSpecializations = async (req, res) => {
  try {
    const specializations = await getSpecializationsService();

    res.status(200).json({
      success: true,
      count: specializations.length,
      specializations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

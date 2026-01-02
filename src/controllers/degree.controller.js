import { getDegreesService } from "../services/degree.service.js";

export const getDegrees = async (req, res) => {
  try {
    const { search = "", sort = "asc", page, limit } = req.query;

    const result = await getDegreesService({
      search,
      sort,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch degrees",
      error: error.message,
    });
  }
};

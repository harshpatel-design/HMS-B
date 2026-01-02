import { getDepartmentsService } from "../services/department.service.js";

export const getDepartments = async (req, res) => {
  try {
    const { search = "", sort = "asc" } = req.query;

    const departments = await getDepartmentsService({ search, sort });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments,
    });
  } catch (error) {
    console.error("Department fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

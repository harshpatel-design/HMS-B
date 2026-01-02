import Department from "../models/department.model.js";

export const getDepartmentsService = async ({ search, sort }) => {
  const query = { isActive: true };

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  const departments = await Department.find(
    query,
    { name: 1 }
  ).sort({
    name: sort === "desc" ? -1 : 1,
  });

  return departments;
};

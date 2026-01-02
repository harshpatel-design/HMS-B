import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import Specialization from "../models/specialization.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSpecializationsService = async () => {
  const filePath = path.join(__dirname, "..", "data", "doctor_specializations.csv");

  const names = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.specialization) {
          names.push(row.specialization.trim());
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  const specializations = await Specialization.find(
    { name: { $in: names } },
    { name: 1 }
  );

  return specializations;
};

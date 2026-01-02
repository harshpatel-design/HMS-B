import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getDegreesService = ({ search, sort, page, limit }) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(
      __dirname,
      "..",
      "data",
      "all_doctor_degrees_expanded.csv"
    );

    const list = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name) {
          list.push(row.name.trim());
        }
      })
      .on("end", () => {
        let unique = [...new Set(list)];

        // 🔍 Search
        if (search) {
          const q = search.toLowerCase();
          unique = unique.filter((d) => d.toLowerCase().includes(q));
        }

        // ↕ Sort
        unique.sort((a, b) =>
          sort === "desc" ? b.localeCompare(a) : a.localeCompare(b)
        );

        // 📄 Pagination
        let paged = unique;
        const pageNum = page ? Math.max(1, parseInt(page, 10)) : null;
        const lim = limit ? Math.max(1, parseInt(limit, 10)) : null;

        if (pageNum && lim) {
          const start = (pageNum - 1) * lim;
          paged = unique.slice(start, start + lim);
        }

        resolve({
          total: unique.length,
          count: paged.length,
          degrees: paged,
        });
      })
      .on("error", reject);
  });
};

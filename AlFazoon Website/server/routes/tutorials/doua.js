import express from "express";


import {
  getDouaById,
  searchDoua,
  getDouas,
  addDoua,
  updateDoua,
  deleteDoua,
  getTotalDouaCount,
  getTypes,
  getDouasByType
} from "../../controllers/tutorials/doua.js";
import { upload } from "../../config/multer.js";


export const douasRoute = express.Router();
douasRoute.post("", upload.single('voice'), addDoua);
douasRoute.get("", getDouas);
douasRoute.get("/by-type/:type", getDouasByType);
douasRoute.get("/Count", getTotalDouaCount);
douasRoute.get("/types", getTypes);
douasRoute.post("/search", searchDoua);

douasRoute.get("/:id", getDouaById);
douasRoute.put("/:id", upload.single('voice'), updateDoua);
douasRoute.delete("/:id", deleteDoua);
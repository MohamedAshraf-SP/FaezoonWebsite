
import express from "express";


import {
  getAzkarById,
  searchAzkar,
  getAzkars,
  addAzkar,
  updateAzkar,
  deleteAzkar,
  getTotalAzkarCount,
  getTypes,
  getAzkarsByType
} from "../../controllers/tutorials/azkar.js";
import { upload } from "../../config/multer.js";



export const azkarsRoute = express.Router();
azkarsRoute.post("", upload.single('voice'), addAzkar);
azkarsRoute.get("", getAzkars);
azkarsRoute.get("/by-type", getAzkarsByType);
azkarsRoute.get("/Count", getTotalAzkarCount);
azkarsRoute.get("/types", getTypes);
azkarsRoute.post("/search", searchAzkar);
azkarsRoute.get("/:id", getAzkarById);
azkarsRoute.put("/:id", upload.single('voice'), updateAzkar);
azkarsRoute.delete("/:id", deleteAzkar);

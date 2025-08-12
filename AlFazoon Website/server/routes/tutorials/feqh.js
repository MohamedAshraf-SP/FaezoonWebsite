import express from "express";


import {
  getFeqhById,
  searchFeqh,
  getFeqhs,
  addFeqh,
  updateFeqh,
  deleteFeqh,
  getTotalFeqhCount,
} from "../../controllers/tutorials/feqh.js";
import { upload } from "../../config/multer.js";


export const feqhsRoute = express.Router();
feqhsRoute.post("", upload.single('voice'), addFeqh);
feqhsRoute.get("", getFeqhs);
feqhsRoute.get("/Count", getTotalFeqhCount);
feqhsRoute.post("/search", searchFeqh);

feqhsRoute.get("/:id", getFeqhById);
feqhsRoute.put("/:id", upload.single('voice'), updateFeqh);
feqhsRoute.delete("/:id", deleteFeqh);

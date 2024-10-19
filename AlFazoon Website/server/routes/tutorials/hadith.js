import express from "express";


import {
  getHadithById,
  searchHadith,
  getHadiths,
  addHadith,
  updateHadith,
  deleteHadith,
  getTotalHadithCount,
} from "../../controllers/tutorials/hadith.js";
import { upload } from "../../config/multer.js";


export const hadithsRoute = express.Router();
hadithsRoute.post("", upload.single('voice'), addHadith);
hadithsRoute.get("", getHadiths);
hadithsRoute.get("/Count", getTotalHadithCount);
hadithsRoute.post("/search", searchHadith);

hadithsRoute.get("/:id", getHadithById);
hadithsRoute.put("/:id", upload.single('voice'), updateHadith);
hadithsRoute.delete("/:id", deleteHadith);

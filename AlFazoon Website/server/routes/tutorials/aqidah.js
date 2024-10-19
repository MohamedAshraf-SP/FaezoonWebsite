import express from "express";


import {
  getAqidahById,
  searchAqidah,
  getAqidahs,
  addAqidah,
  updateAqidah,
  deleteAqidah,
  getTotalAqidahCount,
} from "../../controllers/tutorials/aqidah.js";
import { upload } from "../../config/multer.js";


export const aqidahsRoute = express.Router();
aqidahsRoute.post("", upload.single('voice'), addAqidah);
aqidahsRoute.get("", getAqidahs);
aqidahsRoute.get("/Count", getTotalAqidahCount);
aqidahsRoute.post("/search", searchAqidah);

aqidahsRoute.get("/:id", getAqidahById);
aqidahsRoute.put("/:id", upload.single('voice'), updateAqidah);
aqidahsRoute.delete("/:id", deleteAqidah);

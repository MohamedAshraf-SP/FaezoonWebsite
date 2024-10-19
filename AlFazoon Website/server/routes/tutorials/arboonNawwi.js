import express from "express";


import {
  getArboonNawwiById,
  searchArboonNawwi,
  getArboonNawwis,
  addArboonNawwi,
  updateArboonNawwi,
  deleteArboonNawwi,
  getTotalArboonNawwiCount,
} from "../../controllers/tutorials/ArboonNawwi.js";
import { upload } from "../../config/multer.js";


export const arboonNawwisRoute = express.Router();
arboonNawwisRoute.post("", upload.single('voice'), addArboonNawwi);
arboonNawwisRoute.get("", getArboonNawwis);
arboonNawwisRoute.get("/Count", getTotalArboonNawwiCount);
arboonNawwisRoute.post("/search", searchArboonNawwi);

arboonNawwisRoute.get("/:id", getArboonNawwiById);
arboonNawwisRoute.put("/:id", upload.single('voice'), updateArboonNawwi);
arboonNawwisRoute.delete("/:id", deleteArboonNawwi);

import express from "express";


import {
  getTawheedById,
  searchTawheed,
  getTawheeds,
  addTawheed,
  updateTawheed,
  deleteTawheed,
  getTotalTawheedCount,
} from "../../controllers/tutorials/tawheed.js";
import { upload } from "../../config/multer.js";


export const tawheedsRoute = express.Router();
tawheedsRoute.post("", upload.single('voice'), addTawheed);
tawheedsRoute.get("", getTawheeds);
tawheedsRoute.get("/Count", getTotalTawheedCount);
tawheedsRoute.post("/search", searchTawheed);

tawheedsRoute.get("/:id", getTawheedById);
tawheedsRoute.put("/:id", upload.single('voice'), updateTawheed);
tawheedsRoute.delete("/:id", deleteTawheed);

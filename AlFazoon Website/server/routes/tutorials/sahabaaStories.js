import express from "express";


import {
  getSahabaaStoriesById,
  searchSahabaaStories,
  getSahabaaStoriess,
  addSahabaaStories,
  updateSahabaaStories,
  deleteSahabaaStories,
  getTotalSahabaaStoriesCount,
} from "../../controllers/tutorials/sahabaaStories.js";
import { upload } from "../../config/multer.js";


export const sahabaaStoriessRoute = express.Router();
sahabaaStoriessRoute.post("", upload.single('voice'), addSahabaaStories);
sahabaaStoriessRoute.get("", getSahabaaStoriess);
sahabaaStoriessRoute.get("/Count", getTotalSahabaaStoriesCount);
sahabaaStoriessRoute.post("/search", searchSahabaaStories);

sahabaaStoriessRoute.get("/:id", getSahabaaStoriesById);
sahabaaStoriessRoute.put("/:id", upload.single('voice'), updateSahabaaStories);
sahabaaStoriessRoute.delete("/:id", deleteSahabaaStories);

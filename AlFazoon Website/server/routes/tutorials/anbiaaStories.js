import express from "express";


import {
  getAnbiaaStoriesById,
  searchAnbiaaStories,
  getAnbiaaStoriess,
  addAnbiaaStories,
  updateAnbiaaStories,
  deleteAnbiaaStories,
  getTotalAnbiaaStoriesCount,
} from "../../controllers/tutorials/anbiaaStories.js";
import { upload } from "../../config/multer.js";


export const anbiaaStoriessRoute = express.Router();
anbiaaStoriessRoute.post("", upload.single('voice'), addAnbiaaStories);
anbiaaStoriessRoute.get("", getAnbiaaStoriess);
anbiaaStoriessRoute.get("/Count", getTotalAnbiaaStoriesCount);
anbiaaStoriessRoute.post("/search", searchAnbiaaStories);

anbiaaStoriessRoute.get("/:id", getAnbiaaStoriesById);
anbiaaStoriessRoute.put("/:id", upload.single('voice'), updateAnbiaaStories);
anbiaaStoriessRoute.delete("/:id", deleteAnbiaaStories);

import { SahabaaStories, SahabaaStoriesVoice } from "../../models/tutorials/sahabaaStories.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search sahabaaStories in text
export const searchSahabaaStories = async (req, res) => {
  try {
    const searchWord = req.body.searchWord || "";
    let hID = Number(req.body.searchWord) || -1;
    // Initialize an empty array for query conditions
    const queryConditions = [];
    console.log(searchWord);
    // Check if hID is a valid number
    if (!isNaN(hID) && hID != -1) {
      // hID should be a positive number
      queryConditions.push({ hID: hID });
    } else if (searchWord) {
      queryConditions.push({ arabic: { $regex: searchWord, $options: "i" } });
      queryConditions.push({ name: { $regex: searchWord, $options: "i" } });
      queryConditions.push({
        arabicWithoutTashkit: { $regex: searchWord, $options: "i" },
      });
      queryConditions.push({ english: { $regex: searchWord, $options: "i" } });
    } else {
      queryConditions.push({ nothing: 0 });
    }

    // console.log(queryConditions)

    const sahabaaStoriess = await SahabaaStories.find(
      { $or: [...queryConditions] },
      { hID: 1, name: 1, arabic: 1, english: 1 }
    ).limit(10);
    console.log(sahabaaStoriess);
    if (!sahabaaStoriess) {
      return res.status(404).json({ message: "sahabaaStories not found" });
    }
    res.status(200).json(sahabaaStoriess);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get sahabaaStories by ID
export const getSahabaaStoriesById = async (req, res) => {
  try {
    const sahabaaStories = await SahabaaStories.findById(req.params.id).populate("voice");
    if (!sahabaaStories) {
      return res.status(404).json({ message: "sahabaaStories not found" });
    }

    res.status(200).json({
      _id: sahabaaStories._id,
      hID: sahabaaStories.hID,
      name: sahabaaStories.name,
      arabic: sahabaaStories.arabic,
      arabicWithoutTashkeel: sahabaaStories.arabicWithoutTashkit,
      english: sahabaaStories.english,
      voice: sahabaaStories.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all sahabaaStoriess
export const getSahabaaStoriess = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const sahabaaStoriesCount = await SahabaaStories.countDocuments();
  // console.log(sahabaaStoriesCount)

  const pagesCount = Math.ceil(sahabaaStoriesCount / limit) || 0;

  try {
    const sahabaaStoriess = await SahabaaStories.find(
      {},
      { hID: 1, name: 1, arabic: 1, english: 1, voice: 1 }
    )
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      sahabaaStoriess: sahabaaStoriess,
      sahabaaStoriesCount: sahabaaStoriesCount,
    });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// Add a new sahabaaStories
export const addSahabaaStories = async (req, res) => {
  try {
    const voice = req.file;
    //console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newSahabaaStoriesVoice = new SahabaaStoriesVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });
    await newSahabaaStoriesVoice.save();

    const arabicWithoutTashkit = removeDiacritics(req.body.arabic);
    console.log(arabicWithoutTashkit);
    // let cryptedPassword = req.body.password
    const newSahabaaStories = new SahabaaStories({
      hID: req.body.number,
      arabic: req.body.arabic,
      name: req.body.name,
      arabicWithoutTashkit: arabicWithoutTashkit,
      english: req.body.english,
      voice: newSahabaaStoriesVoice,
    });

    await newSahabaaStories.save();
    res.status(201).json({ message: "sahabaaStories added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update sahabaaStories by ID
export const updateSahabaaStories = async (req, res) => {
  try {
    const sahabaaStoriesToUpdate = await SahabaaStories.findById(req.params.id).select({
      hID: 1,
      name: 1,
      arabic: 1,
      english: 1,
      arabicWithoutTashkit: 1,
      voice: 1,
    });
    //to delete the uploded file if the documet not found
    if (!sahabaaStoriesToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "aqidah not found" });
    }

    const oldVoice = await SahabaaStoriesVoice.findById(sahabaaStoriesToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldSahabaaStoriesVoicePath;
    let newSahabaaStoriesVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldSahabaaStoriesVoicePath = oldVoice.path;
      //console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newSahabaaStoriesVoice = new SahabaaStoriesVoice(voiceData);
      await newSahabaaStoriesVoice.save();
    } else {
      voiceData = sahabaaStoriesToUpdate.voice;
    }

    //  console.log(req.body.arabic)
    const arabicWithoutTashkit = removeDiacritics(req.body.arabic || "");

    const updatedSahabaaStories = await SahabaaStories.findByIdAndUpdate(
      req.params.id,
      {
        hID: req.body.number || sahabaaStoriesToUpdate.number,
        arabic: req.body.arabic || sahabaaStoriesToUpdate.arabic,
        name: req.body.name || sahabaaStoriesToUpdate.name,
        arabicWithoutTashkit:
          arabicWithoutTashkit || sahabaaStoriesToUpdate.arabicWithoutTashkit,
        english: req.body.english || sahabaaStoriesToUpdate.english,
        voice: newSahabaaStoriesVoice || oldVoice,
      },
      {
        new: true,
        projection: {
          hID: 1,
          name: 1,
          arabic: 1,
          english: 1,
          voice: 1,
          arabicWithoutTashkit: 1,
        },
      }
    );

    if (oldSahabaaStoriesVoicePath) {
      deleteFileWithPath(oldSahabaaStoriesVoicePath);
    }

    res.status(200).json(updatedSahabaaStories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete sahabaaStories by ID
export const deleteSahabaaStories = async (req, res) => {
  try {
    // Find and delete the sahabaaStories with populated voice field
    const result = await SahabaaStories.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    if (!result) {
      return res.status(404).json({ message: "SahabaaStories not found" });
    }

    const voice = result.voice;

    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "SahabaaStories and associated voice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of sahabaaStoriess
export const getTotalSahabaaStoriesCount = async (req, res) => {
  try {
    const count = await SahabaaStories.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

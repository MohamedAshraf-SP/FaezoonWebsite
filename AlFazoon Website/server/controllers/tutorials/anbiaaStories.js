import { AnbiaaStories, AnbiaaStoriesVoice } from "../../models/tutorials/anbiaaStories.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search anbiaaStories in text
export const searchAnbiaaStories = async (req, res) => {
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

    const anbiaaStoriess = await AnbiaaStories.find(
      { $or: [...queryConditions] },
      { hID: 1, name: 1, arabic: 1, english: 1 }
    ).limit(10);
    console.log(anbiaaStoriess);
    if (!anbiaaStoriess) {
      return res.status(404).json({ message: "anbiaaStories not found" });
    }
    res.status(200).json(anbiaaStoriess);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get anbiaaStories by ID
export const getAnbiaaStoriesById = async (req, res) => {
  try {
    const anbiaaStories = await AnbiaaStories.findById(req.params.id).populate("voice");
    if (!anbiaaStories) {
      return res.status(404).json({ message: "anbiaaStories not found" });
    }

    res.status(200).json({
      _id: anbiaaStories._id,
      hID: anbiaaStories.hID,
      name: anbiaaStories.name,
      arabic: anbiaaStories.arabic,
      arabicWithoutTashkeel: anbiaaStories.arabicWithoutTashkit,
      english: anbiaaStories.english,
      voice: anbiaaStories.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all anbiaaStoriess
export const getAnbiaaStoriess = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const anbiaaStoriesCount = await AnbiaaStories.countDocuments();
  // console.log(anbiaaStoriesCount)

  const pagesCount = Math.ceil(anbiaaStoriesCount / limit) || 0;

  try {
    const anbiaaStoriess = await AnbiaaStories.find(
      {},
      { hID: 1, name: 1, arabic: 1, english: 1, voice: 1 }
    )
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      anbiaaStoriess: anbiaaStoriess,
      anbiaaStoriesCount: anbiaaStoriesCount,
    });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// Add a new anbiaaStories
export const addAnbiaaStories = async (req, res) => {
  try {
    const voice = req.file;
    //console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newAnbiaaStoriesVoice = new AnbiaaStoriesVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });
    await newAnbiaaStoriesVoice.save();

    const arabicWithoutTashkit = removeDiacritics(req.body.arabic);
    console.log(arabicWithoutTashkit);
    // let cryptedPassword = req.body.password
    const newAnbiaaStories = new AnbiaaStories({
      hID: req.body.number,
      arabic: req.body.arabic,
      name: req.body.name,
      arabicWithoutTashkit: arabicWithoutTashkit,
      english: req.body.english,
      voice: newAnbiaaStoriesVoice,
    });

    await newAnbiaaStories.save();
    res.status(201).json({ message: "anbiaaStories added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update anbiaaStories by ID
export const updateAnbiaaStories = async (req, res) => {
  try {
    const anbiaaStoriesToUpdate = await AnbiaaStories.findById(req.params.id).select({
      hID: 1,
      name: 1,
      arabic: 1,
      english: 1,
      arabicWithoutTashkit: 1,
      voice: 1,
    });
    //to delete the uploded file if the documet not found
    if (!anbiaaStoriesToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "aqidah not found" });
    }

    const oldVoice = await AnbiaaStoriesVoice.findById(anbiaaStoriesToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldAnbiaaStoriesVoicePath;
    let newAnbiaaStoriesVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldAnbiaaStoriesVoicePath = oldVoice.path;
      //console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newAnbiaaStoriesVoice = new AnbiaaStoriesVoice(voiceData);
      await newAnbiaaStoriesVoice.save();
    } else {
      voiceData = anbiaaStoriesToUpdate.voice;
    }

    //  console.log(req.body.arabic)
    const arabicWithoutTashkit = removeDiacritics(req.body.arabic || "");

    const updatedAnbiaaStories = await AnbiaaStories.findByIdAndUpdate(
      req.params.id,
      {
        hID: req.body.number || anbiaaStoriesToUpdate.number,
        arabic: req.body.arabic || anbiaaStoriesToUpdate.arabic,
        name: req.body.name || anbiaaStoriesToUpdate.name,
        arabicWithoutTashkit:
          arabicWithoutTashkit || anbiaaStoriesToUpdate.arabicWithoutTashkit,
        english: req.body.english || anbiaaStoriesToUpdate.english,
        voice: newAnbiaaStoriesVoice || oldVoice,
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

    if (oldAnbiaaStoriesVoicePath) {
      deleteFileWithPath(oldAnbiaaStoriesVoicePath);
    }

    res.status(200).json(updatedAnbiaaStories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete anbiaaStories by ID
export const deleteAnbiaaStories = async (req, res) => {
  try {
    // Find and delete the anbiaaStories with populated voice field
    const result = await AnbiaaStories.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    if (!result) {
      return res.status(404).json({ message: "AnbiaaStories not found" });
    }

    const voice = result.voice;

    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "AnbiaaStories and associated voice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of anbiaaStoriess
export const getTotalAnbiaaStoriesCount = async (req, res) => {
  try {
    const count = await AnbiaaStories.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

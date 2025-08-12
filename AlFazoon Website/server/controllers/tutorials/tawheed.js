import { Tawheed, TawheedVoice } from "../../models/tutorials/tawheed.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search tawheed in text
export const searchTawheed = async (req, res) => {
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

    const tawheeds = await Tawheed.find(
      { $or: [...queryConditions] },
      { hID: 1, name: 1, arabic: 1, english: 1 }
    ).limit(10);
    console.log(tawheeds);
    if (!tawheeds) {
      return res.status(404).json({ message: "tawheed not found" });
    }
    res.status(200).json(tawheeds);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get tawheed by ID
export const getTawheedById = async (req, res) => {
  try {
    const tawheed = await Tawheed.findById(req.params.id).populate("voice");
    if (!tawheed) {
      return res.status(404).json({ message: "tawheed not found" });
    }

    res.status(200).json({
      _id: tawheed._id,
      hID: tawheed.hID,
      name: tawheed.name,
      arabic: tawheed.arabic,
      arabicWithoutTashkeel: tawheed.arabicWithoutTashkit,
      english: tawheed.english,
      voice: tawheed.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tawheeds
export const getTawheeds = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const tawheedCount = await Tawheed.countDocuments();
  // console.log(tawheedCount)

  const pagesCount = Math.ceil(tawheedCount / limit) || 0;

  try {
    const tawheeds = await Tawheed.find(
      {},
      { hID: 1, name: 1, arabic: 1, english: 1, voice: 1 }
    )
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      tawheeds: tawheeds,
      tawheedCount: tawheedCount,
    });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// Add a new tawheed
export const addTawheed = async (req, res) => {
  try {
    const voice = req.file;
    //console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newTawheedVoice = new TawheedVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });
    await newTawheedVoice.save();

    const arabicWithoutTashkit = removeDiacritics(req.body.arabic);
    console.log(arabicWithoutTashkit);
    // let cryptedPassword = req.body.password
    const newTawheed = new Tawheed({
      hID: req.body.number,
      arabic: req.body.arabic,
      name: req.body.name,
      arabicWithoutTashkit: arabicWithoutTashkit,
      english: req.body.english,
      voice: newTawheedVoice,
    });

    await newTawheed.save();
    res.status(201).json({ message: "tawheed added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update tawheed by ID
export const updateTawheed = async (req, res) => {
  try {
    const tawheedToUpdate = await Tawheed.findById(req.params.id).select({
      hID: 1,
      name: 1,
      arabic: 1,
      english: 1,
      arabicWithoutTashkit: 1,
      voice: 1,
    });
    //to delete the uploded file if the documet not found
    if (!tawheedToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "aqidah not found" });
    }

    const oldVoice = await TawheedVoice.findById(tawheedToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldTawheedVoicePath;
    let newTawheedVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldTawheedVoicePath = oldVoice.path;
      //console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newTawheedVoice = new TawheedVoice(voiceData);
      await newTawheedVoice.save();
    } else {
      voiceData = tawheedToUpdate.voice;
    }

    //  console.log(req.body.arabic)
    const arabicWithoutTashkit = removeDiacritics(req.body.arabic || "");

    const updatedTawheed = await Tawheed.findByIdAndUpdate(
      req.params.id,
      {
        hID: req.body.number || tawheedToUpdate.number,
        arabic: req.body.arabic || tawheedToUpdate.arabic,
        name: req.body.name || tawheedToUpdate.name,
        arabicWithoutTashkit:
          arabicWithoutTashkit || tawheedToUpdate.arabicWithoutTashkit,
        english: req.body.english || tawheedToUpdate.english,
        voice: newTawheedVoice || oldVoice,
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

    if (oldTawheedVoicePath) {
      deleteFileWithPath(oldTawheedVoicePath);
    }

    res.status(200).json(updatedTawheed);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete tawheed by ID
export const deleteTawheed = async (req, res) => {
  try {
    // Find and delete the tawheed with populated voice field
    const result = await Tawheed.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    if (!result) {
      return res.status(404).json({ message: "Tawheed not found" });
    }

    const voice = result.voice;

    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "Tawheed and associated voice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of tawheeds
export const getTotalTawheedCount = async (req, res) => {
  try {
    const count = await Tawheed.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import { Feqh, FeqhVoice } from "../../models/tutorials/feqh.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search feqh in text
export const searchFeqh = async (req, res) => {
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

    const feqhs = await Feqh.find(
      { $or: [...queryConditions] },
      { hID: 1, name: 1, arabic: 1, english: 1 }
    ).limit(10);
    console.log(feqhs);
    if (!feqhs) {
      return res.status(404).json({ message: "feqh not found" });
    }
    res.status(200).json(feqhs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get feqh by ID
export const getFeqhById = async (req, res) => {
  try {
    const feqh = await Feqh.findById(req.params.id).populate("voice");
    if (!feqh) {
      return res.status(404).json({ message: "feqh not found" });
    }

    res.status(200).json({
      _id: feqh._id,
      hID: feqh.hID,
      name: feqh.name,
      arabic: feqh.arabic,
      arabicWithoutTashkeel: feqh.arabicWithoutTashkit,
      english: feqh.english,
      voice: feqh.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all feqhs
export const getFeqhs = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const feqhCount = await Feqh.countDocuments();
  // console.log(feqhCount)

  const pagesCount = Math.ceil(feqhCount / limit) || 0;

  try {
    const feqhs = await Feqh.find(
      {},
      { hID: 1, name: 1, arabic: 1, english: 1, voice: 1 }
    )
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      feqhs: feqhs,
      feqhCount: feqhCount,
    });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// Add a new feqh
export const addFeqh = async (req, res) => {
  try {
    const voice = req.file;
    //console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newFeqhVoice = new FeqhVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });
    await newFeqhVoice.save();

    const arabicWithoutTashkit = removeDiacritics(req.body.arabic);
    console.log(arabicWithoutTashkit);
    // let cryptedPassword = req.body.password
    const newFeqh = new Feqh({
      hID: req.body.number,
      arabic: req.body.arabic,
      name: req.body.name,
      arabicWithoutTashkit: arabicWithoutTashkit,
      english: req.body.english,
      voice: newFeqhVoice,
    });

    await newFeqh.save();
    res.status(201).json({ message: "feqh added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update feqh by ID
export const updateFeqh = async (req, res) => {
  try {
    const feqhToUpdate = await Feqh.findById(req.params.id).select({
      hID: 1,
      name: 1,
      arabic: 1,
      english: 1,
      arabicWithoutTashkit: 1,
      voice: 1,
    });
    //to delete the uploded file if the documet not found
    if (!feqhToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "aqidah not found" });
    }

    const oldVoice = await FeqhVoice.findById(feqhToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldFeqhVoicePath;
    let newFeqhVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldFeqhVoicePath = oldVoice.path;
      //console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newFeqhVoice = new FeqhVoice(voiceData);
      await newFeqhVoice.save();
    } else {
      voiceData = feqhToUpdate.voice;
    }

    //  console.log(req.body.arabic)
    const arabicWithoutTashkit = removeDiacritics(req.body.arabic || "");

    const updatedFeqh = await Feqh.findByIdAndUpdate(
      req.params.id,
      {
        hID: req.body.number || feqhToUpdate.number,
        arabic: req.body.arabic || feqhToUpdate.arabic,
        name: req.body.name || feqhToUpdate.name,
        arabicWithoutTashkit:
          arabicWithoutTashkit || feqhToUpdate.arabicWithoutTashkit,
        english: req.body.english || feqhToUpdate.english,
        voice: newFeqhVoice || oldVoice,
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

    if (oldFeqhVoicePath) {
      deleteFileWithPath(oldFeqhVoicePath);
    }

    res.status(200).json(updatedFeqh);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete feqh by ID
export const deleteFeqh = async (req, res) => {
  try {
    // Find and delete the feqh with populated voice field
    const result = await Feqh.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    if (!result) {
      return res.status(404).json({ message: "Feqh not found" });
    }

    const voice = result.voice;

    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "Feqh and associated voice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of feqhs
export const getTotalFeqhCount = async (req, res) => {
  try {
    const count = await Feqh.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import { Hadith, HadithVoice } from "../../models/tutorials/hadith.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search hadith in text
export const searchHadith = async (req, res) => {
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

    const hadiths = await Hadith.find(
      { $or: [...queryConditions] },
      { hID: 1, name: 1, arabic: 1, english: 1 }
    ).limit(10);
    console.log(hadiths);
    if (!hadiths) {
      return res.status(404).json({ message: "hadith not found" });
    }
    res.status(200).json(hadiths);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get hadith by ID
export const getHadithById = async (req, res) => {
  try {
    const hadith = await Hadith.findById(req.params.id).populate("voice");
    if (!hadith) {
      return res.status(404).json({ message: "hadith not found" });
    }

    res.status(200).json({
      _id: hadith._id,
      hID: hadith.hID,
      name: hadith.name,
      arabic: hadith.arabic,
      arabicWithoutTashkeel: hadith.arabicWithoutTashkit,
      english: hadith.english,
      voice: hadith.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all hadiths
export const getHadiths = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const hadithCount = await Hadith.countDocuments();
  // console.log(hadithCount)

  const pagesCount = Math.ceil(hadithCount / limit) || 0;

  try {
    const hadiths = await Hadith.find(
      {},
      { hID: 1, name: 1, arabic: 1, english: 1, voice: 1 }
    )
      .skip(skip)
      .limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      hadiths: hadiths,
      hadithCount: hadithCount,
    });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(500).json({ error: error.message });
  }
};

// Add a new hadith
export const addHadith = async (req, res) => {
  try {
    const voice = req.file;
    //console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newHadithVoice = new HadithVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });
    await newHadithVoice.save();

    const arabicWithoutTashkit = removeDiacritics(req.body.arabic);
    console.log(arabicWithoutTashkit);
    // let cryptedPassword = req.body.password
    const newHadith = new Hadith({
      hID: req.body.number,
      arabic: req.body.arabic,
      name: req.body.name,
      arabicWithoutTashkit: arabicWithoutTashkit,
      english: req.body.english,
      voice: newHadithVoice,
    });

    await newHadith.save();
    res.status(201).json({ message: "hadith added successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update hadith by ID
export const updateHadith = async (req, res) => {
  try {
    const hadithToUpdate = await Hadith.findById(req.params.id).select({
      hID: 1,
      name: 1,
      arabic: 1,
      english: 1,
      arabicWithoutTashkit: 1,
      voice: 1,
    });
    //to delete the uploded file if the documet not found
    if (!hadithToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "aqidah not found" });
    }

    const oldVoice = await HadithVoice.findById(hadithToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldHadithVoicePath;
    let newHadithVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldHadithVoicePath = oldVoice.path;
      //console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newHadithVoice = new HadithVoice(voiceData);
      await newHadithVoice.save();
    } else {
      voiceData = hadithToUpdate.voice;
    }

    //  console.log(req.body.arabic)
    const arabicWithoutTashkit = removeDiacritics(req.body.arabic || "");

    const updatedHadith = await Hadith.findByIdAndUpdate(
      req.params.id,
      {
        hID: req.body.number || hadithToUpdate.number,
        arabic: req.body.arabic || hadithToUpdate.arabic,
        name: req.body.name || hadithToUpdate.name,
        arabicWithoutTashkit:
          arabicWithoutTashkit || hadithToUpdate.arabicWithoutTashkit,
        english: req.body.english || hadithToUpdate.english,
        voice: newHadithVoice || oldVoice,
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

    if (oldHadithVoicePath) {
      deleteFileWithPath(oldHadithVoicePath);
    }

    res.status(200).json(updatedHadith);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete hadith by ID
export const deleteHadith = async (req, res) => {
  try {
    // Find and delete the hadith with populated voice field
    const result = await Hadith.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    if (!result) {
      return res.status(404).json({ message: "Hadith not found" });
    }

    const voice = result.voice;

    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "Hadith and associated voice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the total number of hadiths
export const getTotalHadithCount = async (req, res) => {
  try {
    const count = await Hadith.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

import { Aqidah, AqidahVoice } from "../../models/tutorials/aqidah.js";
import * as mm from "music-metadata";
import fs from "fs";
import { Console } from "console";
import mongoose from "mongoose";
import { type } from "os";
import { removeDiacritics } from "../../helpers/removeDiacritics.js";
import { deleteFileWithPath } from "../../helpers/deleteFile.js";

// Search aqidah in text
export const searchAqidah = async (req, res) => {
  try {
    const searchWord = req.body.searchWord || "";
    let aID = Number(req.body.searchWord) || -1;
    // Initialize an empty array for query conditions
    const queryConditions = [];
    console.log(searchWord, !isNaN(aID) && aID != -1);
    // Check if hID is a valid number
    if (!isNaN(aID) && aID != -1) {
      // hID should be a positive number
      queryConditions.push({ aID: aID });
    } else if (searchWord) {
      queryConditions.push({ arabicQ: { $regex: new RegExp(searchWord, "i") } });
      queryConditions.push({
        arabicQWithoutTashkit: { $regex: searchWord, $options: "i" },
      });
      queryConditions.push({ englishQ: { $regex: searchWord, $options: "i" } });


      queryConditions.push({ arabicA: { $regex: new RegExp(searchWord, "i") } });
      queryConditions.push({
        arabicAWithoutTashkit: { $regex: searchWord, $options: "i" },
      });
      queryConditions.push({ englishA: { $regex: searchWord, $options: "i" } });
    } else {
      queryConditions.push({ nothing: 0 });
    }

    console.log(queryConditions);

    const aqidahs = await Aqidah.find(
      { $or: [...queryConditions] }, // الشرط
      { aID: 1, arabicQ: 1, englishQ: 1 } // التوقعات
    ).limit(10);

    if (!aqidahs) {
      return res.status(404).json({ message: "aqidah not found" });
    }
    res.status(200).json(aqidahs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get aqidah by ID
export const getAqidahById = async (req, res) => {
  try {
    const aqidah = await Aqidah.findById(req.params.id).populate("voice");
    if (!aqidah) {
      return res.status(404).json({ message: "aqidah not found" });
    }

    res.status(200).json({
      _id: aqidah._id,
      aID: aqidah.aID,
      arabicQ: aqidah.arabicQ,
      englishQ: aqidah.englishQ,
      arabicA: aqidah.arabicA,
      englishA: aqidah.englishA,
      voice: aqidah.voice,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all aqidahs
export const getAqidahs = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;

  const aqidahCount = await Aqidah.countDocuments();
  //console.log(aqidahCount)

  const pagesCount = Math.ceil(aqidahCount / limit) || 0;

  try {
    const aqidahs = await Aqidah.find().skip(skip).limit(limit); // Skip the specified number of documents.limit(limit);;
    res.status(200).json({
      currentPage: page,
      pagesCount: pagesCount,
      aqidahs: aqidahs,
      aqidahCount: aqidahCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new aqidah
export const addAqidah = async (req, res) => {
  try {
    const voice = req.file;
    // console.log(voice)
    if (!voice) {
      return res.status(404).json({ error: "voice not found" });
    }

    const metadata = await mm.parseFile(voice.path);
    const duration = metadata.format.duration;

    // console.log (req.body)
    const newAqidahVoice = new AqidahVoice({
      filename: req.file.filename,
      path: req.file.path,
      duration: 1,
      type: req.file.mimetype,
      size: req.file.size,
    });

    const arabicQWithoutTashkit = removeDiacritics(req.body.arabicQ);
    const arabicAWithoutTashkit = removeDiacritics(req.body.arabicA);
    await newAqidahVoice.save();
    // let cryptedPassword = req.body.password
    const newAqidah = new Aqidah({
      aID: req.body.number,
      arabicQ: req.body.arabicQ,
      arabicQWithoutTashkit: arabicQWithoutTashkit,
      englishQ: req.body.englishQ,
      arabicA: req.body.arabicA,
      arabicAWithoutTashkit: arabicAWithoutTashkit,
      englishA: req.body.englishA,
      voice: newAqidahVoice,
    });

    await newAqidah.save();
    res.status(201).json({ message: "aqidah added successfully" });
  } catch (error) {
    deleteFileWithPath(req.file.path);
    res.status(400).json({ error: error.message });
  }
};

// Update aqidah by ID
export const updateAqidah = async (req, res) => {
  try {
    const aqidahToUpdate = await Aqidah.findById(req.params.id);

    if (!aqidahToUpdate) {
      deleteFileWithPath(req.file.path);
      return res.status(404).json({ message: "Aqidah Not Found!!" });
    }

    const oldVoice = await AqidahVoice.findById(aqidahToUpdate.voice);
    const newVoice = req.file;
    let voiceData = {};
    let oldAqidahVoicePath;
    let newAqidahVoice;

    if (newVoice) {
      const metadata = await mm.parseFile(newVoice.path);
      const duration = metadata.format?.duration || 0;

      oldAqidahVoicePath = oldVoice.path;
      // console.log(oldVoice)

      voiceData = {
        filename: req.file.filename,
        path: req.file.path,
        duration: duration,
        type: req.file.mimetype,
        size: req.file.size,
      };

      newAqidahVoice = new AqidahVoice(voiceData);
      await newAqidahVoice.save();
    } else {
      voiceData = aqidahToUpdate.voice;
    }
    //console.log(voiceData)

    const arabicQWithoutTashkit = removeDiacritics(req.body.arabicQ || "");
    const arabicAWithoutTashkit = removeDiacritics(req.body.arabicA || "");

    const updatedAqidah = await Aqidah.findByIdAndUpdate(
      req.params.id,
      {
        aID: req.body.number || aqidahToUpdate.number,
        arabicQ: req.body.arabicQ || aqidahToUpdate.arabicQ,
        arabicQWithoutTashkit: arabicQWithoutTashkit || aqidahToUpdate.arabicQWithoutTashkit,
        englishQ: req.body.englishQ || aqidahToUpdate.englishQ,
        arabicA: req.body.arabicA || aqidahToUpdate.arabicA,
        arabicAWithoutTashkit: arabicAWithoutTashkit || aqidahToUpdate.arabicAWithoutTashkit,
        englishA: req.body.englishA || aqidahToUpdate.englishA,
        voice: newAqidahVoice || oldVoice,
      },
      {
        new: true,
        projection: { aID: 1, arabicQ: 1, englishQ: 1 },
      }
    );

    if (oldAqidahVoicePath) {
      deleteFileWithPath(oldAqidahVoicePath);
    }

    res.status(200).json(updatedAqidah);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete aqidah by ID
export const deleteAqidah = async (req, res) => {
  try {
    // Find and delete the aqidah with populated voice field
    const result = await Aqidah.findByIdAndDelete(req.params.id).populate({
      path: "voice",
    });

    //await Aqidah.deleteMany()
    if (!result) {
      return res.status(404).json({ message: "Aqidah not found" });
    }

    const voice = result.voice; // The voice is already populated

    // Now, safely delete the voice file from the file system
    if (voice && voice.path) {
      deleteFileWithPath(voice.path);
    }

    res
      .status(200)
      .json({ message: "Aqidah and associated voice deleted successfully" });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};

// Get the total number of aqidahs

export const getTotalAqidahCount = async (req, res) => {
  try {
    const count = await Aqidah.countDocuments();
    const aqidahs = await Aqidah.find()
      .populate()
      .select("aID arabic voice type");
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTypes = async (req, res) => {
  const aqidahs = await Aqidah.find().populate().type;
};

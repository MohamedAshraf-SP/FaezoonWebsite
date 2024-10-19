
import { Aqidah, AqidahVoice } from '../../models/tutorials/aqidah.js';
import * as mm from 'music-metadata';
import fs from 'fs'
import { Console } from 'console';
import mongoose from 'mongoose';

// Search aqidah in text
export const searchAqidah = async (req, res) => {
    // try {
    //     const searchArabicWord = req.body.arabic || ""
    //     const searchEnglishWord = req.body.english || ""
    //     console.log(searchArabicWord, searchEnglishWord)


    //     const aqidahs = await Aqidah.find({
    //         $or: [
    //             {  aID: req.body.aID||-1},
    //             { arabic: { $regex: searchArabicWord, $options: 'i' } }, // Case-insensitive search in Arabic
    //             { english: { $regex: searchEnglishWord, $options: 'i' } }, // Case-insensitive search in English
    //         ]
    //     });

    try {
        const searchWord = req.body.searchWord || "";
        let hID = Number(req.body.searchWord) || -1;
        // Initialize an empty array for query conditions
        const queryConditions = [];

        // Check if hID is a valid number
        if (!isNaN(hID) && hID != -1) {  // hID should be a positive number
            queryConditions.push({ hID: hID });
        } else if (searchWord) {
            queryConditions.push({ arabic: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ english: { $regex: searchWord, $options: 'i' } });
        } else {
            queryConditions.push({ nothing: 0 });
        }




        const aqidahs = await Aqidah.find({ $or: [...queryConditions] }).limit(10)

        if (!aqidahs) {
            return res.status(404).json({ message: 'aqidah not found' });
        }
        res.status(200).json(aqidahs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get aqidah by ID
export const getAqidahById = async (req, res) => {
    try {
        const aqidah = await Aqidah.findById(req.params.id).populate('voice');;
        if (!aqidah) {
            return res.status(404).json({ message: 'aqidah not found' });
        }


        res.status(200).json({
            "_id": aqidah._id,
            "aID": aqidah.aID,
            "arabic": aqidah.arabic,
            "english": aqidah.english,
            "voice": aqidah.voice,
        }
        );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all aqidahs
export const getAqidahs = async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit

    const aqidahCount = await Aqidah.countDocuments()
    //console.log(aqidahCount)

    const pagesCount = Math.ceil(aqidahCount / limit) || 0

    try {
        const aqidahs = await Aqidah.find().skip(skip).limit(limit) // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            "currentPage": page,
            "pagesCount": pagesCount,
            "aqidahs": aqidahs,
            "aqidahCount": aqidahCount
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new aqidah
export const addAqidah = async (req, res) => {
    try {


        const voice = req.file
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
            size: req.file.size
        })
        await newAqidahVoice.save();
        // let cryptedPassword = req.body.password  
        const newAqidah = new Aqidah({
            aID: req.body.number,
            arabic: req.body.arabic,
            english: req.body.english,
            voice: newAqidahVoice
        });

        await newAqidah.save();
        res.status(201).json({ message: 'aqidah added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update aqidah by ID
export const updateAqidah = async (req, res) => {
    try {
        const aqidahToUpdate = await Aqidah.findById(req.params.id);
        if (!aqidahToUpdate) {

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('AqidahVoice file deleted:', req.file.path);
                }
            })

            return res.status(404).json({ message: 'aqidah not found' });
        }

        console.log(aqidahToUpdate.voice)

        const voice = req.file
        let voiceData = {}
        let oldAqidahVoicePath;

        if (voice) {
            const metadata = await mm.parseFile(voice.path);
            const duration = metadata.format?.duration || 0;
            const oldvoice = await AqidahVoice.findById(aqidahToUpdate.voice)
            oldAqidahVoicePath = oldvoice.path

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }

        } else {

            voiceData = aqidahToUpdate.voice

        }


        const newAqidahVoice = new AqidahVoice(voiceData)
        await newAqidahVoice.save();


        const updatedAqidah = await Aqidah.findByIdAndUpdate(
            req.params.id,
            {
                aID: req.body.number,
                arabic: req.body.arabic,
                english: req.body.english,
                voice: newAqidahVoice
            },
            { new: true }
        );


        if (oldAqidahVoicePath) {
            fs.unlink(oldAqidahVoicePath, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('Old voice file deleted:', oldAqidahVoicePath);
                }
            });
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
        const result = await Aqidah.findByIdAndDelete(req.params.id).populate({ path: "voice" });

        if (!result) {
            return res.status(404).json({ message: 'Aqidah not found' });
        }

        const voice = result.voice;  // The voice is already populated

        // Now, safely delete the voice file from the file system
        if (voice && voice.path) {
            fs.unlink(voice.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('AqidahVoice file deleted:', voice.path);
                }
            });
        }

        res.status(200).json({ message: 'Aqidah and associated voice deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get the total number of aqidahs
export const getTotalAqidahCount = async (req, res) => {
    try {
        const count = await Aqidah.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

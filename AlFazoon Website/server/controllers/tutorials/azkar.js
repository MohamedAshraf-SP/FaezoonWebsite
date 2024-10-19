
import { Azkar, AzkarVoice } from '../../models/tutorials/azkar.js';
import * as mm from 'music-metadata';
import fs from 'fs'
import { Console } from 'console';
import mongoose from 'mongoose';

// Search azkar in text
export const searchAzkar = async (req, res) => {
    // try {
    //     const searchArabicWord = req.body.arabic || ""
    //     const searchEnglishWord = req.body.english || ""
    //     console.log(searchArabicWord, searchEnglishWord)


    //     const azkars = await Azkar.find({
    //         $or: [
    //             {  zID: req.body.zID||-1},
    //             { arabic: { $regex: searchArabicWord, $options: 'i' } }, // Case-insensitive search in Arabic
    //             { english: { $regex: searchEnglishWord, $options: 'i' } }, // Case-insensitive search in English
    //         ]
    //     });

    try {

        const searchWord = req.body.searchWord || "";
        let zID = Number(req.body.searchWord) || -1;
        // Initialize an empty array for query conditions
        const queryConditions = [];

        // Check if zID is a valid number
        if (!isNaN(zID) && zID != -1) {  // zID should be a positive number
            queryConditions.push({ zID: zID });
        } else if (searchWord) {
            queryConditions.push({ arabic: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ english: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ type: { $regex: searchWord, $options: 'i' } });
        } else {
            queryConditions.push({ nothing: 0 });
        }

        // console.log(queryConditions)


        const azkars = await Azkar.find({ $or: [...queryConditions] })

        if (!azkars) {
            return res.status(404).json({ message: 'azkar not found' });
        }
        res.status(200).json(azkars);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get azkar by ID
export const getAzkarById = async (req, res) => {
    try {
        const azkar = await Azkar.findById(req.params.id).populate('voice');
        if (!azkar) {
            return res.status(404).json({ message: 'azkar not found' });
        }


        res.status(200).json({
            "_id": azkar._id,
            "zID": azkar.zID,
            "arabic": azkar.arabic,  
            "english": azkar.english,
            "type":azkar.type,
            "voice": azkar.voice,
        }
        );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all azkars
export const getAzkars = async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit

    const azkarCount = await Azkar.countDocuments()
    // console.log(azkarCount)

    const pagesCount = Math.ceil(azkarCount / limit) || 0

    try {
        const azkars = await Azkar.find().skip(skip).limit(limit) // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            "currentPage": page,
            "pagesCount": pagesCount,
            "azkars": azkars,
            "azkarCount": azkarCount
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new azkar
export const addAzkar = async (req, res) => {
    try {


        const voice = req.file
        //console.log(voice)
        if (!voice) {
            return res.status(404).json({ error: "voice not found" });
        }

        const metadata = await mm.parseFile(voice.path);
        const duration = metadata.format.duration;

        // console.log (req.body)
        const newAzkarVoice = new AzkarVoice({
            filename: req.file.filename,
            path: req.file.path,
            duration: 1,
            type: req.file.mimetype,
            size: req.file.size
        })
        await newAzkarVoice.save();
        // let cryptedPassword = req.body.password  
        const newAzkar = new Azkar({
            zID: req.body.number,
            type:req.body.type,
            arabic: req.body.arabic,
            english: req.body.english,
            voice: newAzkarVoice
        });

        await newAzkar.save();
        res.status(201).json({ message: 'azkar added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update azkar by ID
export const updateAzkar = async (req, res) => {
    try {
        const azkarToUpdate = await Azkar.findById(req.params.id);
        if (!azkarToUpdate) {

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('AzkarVoice file deleted:', req.file.path);
                }
            })

            return res.status(404).json({ message: 'azkar not found' });
        }

        //console.log(azkarToUpdate.voice)

        const voice = req.file
        let voiceData = {}
        let oldAzkarVoicePath;

        if (voice) {
            const metadata = await mm.parseFile(voice.path);
            const duration = metadata.format?.duration || 0;
            const oldvoice = await AzkarVoice.findById(azkarToUpdate.voice)
            oldAzkarVoicePath = oldvoice.path

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }

        } else {

            voiceData = azkarToUpdate.voice

        }


        const newAzkarVoice = new AzkarVoice(voiceData)
        await newAzkarVoice.save();


        const updatedAzkar = await Azkar.findByIdAndUpdate(
            req.params.id,
            {
                zID: req.body.number,
                type:req.body.type,
                arabic: req.body.arabic,
                english: req.body.english,
                voice: newAzkarVoice
            },
            { new: true }
        );


        if (oldAzkarVoicePath) {
            fs.unlink(oldAzkarVoicePath, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('Old voice file deleted:', oldAzkarVoicePath);
                }
            });
        }

        res.status(200).json(updatedAzkar);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




// Delete azkar by ID
export const deleteAzkar = async (req, res) => {
    try {
        // Find and delete the azkar with populated voice field
        const result = await Azkar.findByIdAndDelete(req.params.id).populate({ path: "voice" });

        if (!result) {
            return res.status(404).json({ message: 'Azkar not found' });
        }

        const voice = result.voice;  // The voice is already populated

        // Now, safely delete the voice file from the file system
        if (voice && voice.path) {
            fs.unlink(voice.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('AzkarVoice file deleted:', voice.path);
                }
            });
        }

        res.status(200).json({ message: 'Azkar and associated voice deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get the total number of azkars
export const getTotalAzkarCount = async (req, res) => {
    try {
        const count = await Azkar.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

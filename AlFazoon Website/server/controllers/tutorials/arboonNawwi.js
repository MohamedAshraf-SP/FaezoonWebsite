
import { ArboonNawwi, ArboonNawwiVoice } from '../../models/tutorials/arboonNawwi.js';
import * as mm from 'music-metadata';
import fs from 'fs'
import { Console } from 'console';
import mongoose from 'mongoose';
import { removeDiacritics } from '../../helpers/removeDiacritics.js';
import { deleteFileWithPath } from '../../helpers/deleteFile.js';

// Search arboonNawwi in text
export const searchArboonNawwi = async (req, res) => {
    // try {
    //     const searchArabicWord = req.body.arabic || ""
    //     const searchEnglishWord = req.body.english || ""
    //     console.log(searchArabicWord, searchEnglishWord)


    //     const arboonNawwis = await ArboonNawwi.find({
    //         $or: [
    //             {  nID: req.body.nID||-1},
    //             { arabic: { $regex: searchArabicWord, $options: 'i' } }, // Case-insensitive search in Arabic
    //             { english: { $regex: searchEnglishWord, $options: 'i' } }, // Case-insensitive search in English
    //         ]
    //     });

    try {

        const searchWord = req.body.searchWord || "";
        let nID = Number(req.body.searchWord) || -1;
        // Initialize an empty array for query conditions
        const queryConditions = [];

        // Check if nID is a valid number
        if (!isNaN(nID) && nID != -1) {  // nID should be a positive number
            queryConditions.push({ nID: nID });
        } else if (searchWord) {
            queryConditions.push({ arabic: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ arabicWithoutTashkit: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ english: { $regex: searchWord, $options: 'i' } });
        } else {
            queryConditions.push({ nothing: 0 });
        }

        // console.log(queryConditions)


        const arboonNawwis = await ArboonNawwi.find({ $or: [...queryConditions] }, { nID: 1, arabic: 1, english: 1 }).limit(10)

        if (!arboonNawwis) {
            return res.status(404).json({ message: 'arboonNawwi not found' });
        }
        res.status(200).json(arboonNawwis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get arboonNawwi by ID
export const getArboonNawwiById = async (req, res) => {
    try {
        const arboonNawwi = await ArboonNawwi.findById(req.params.id).populate('voice');
        if (!arboonNawwi) {
            return res.status(404).json({ message: 'arboonNawwi not found' });
        }


        res.status(200).json({
            "_id": arboonNawwi._id,
            "nID": arboonNawwi.nID,
            "arabic": arboonNawwi.arabic,
            "arabicWithoutTashkeel": arboonNawwi.arabicWithoutTashkit,
            "english": arboonNawwi.english,
            "voice": arboonNawwi.voice,
        }
        );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all arboonNawwis
export const getArboonNawwis = async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit

    const arboonNawwiCount = await ArboonNawwi.countDocuments()
    // console.log(arboonNawwiCount)

    const pagesCount = Math.ceil(arboonNawwiCount / limit) || 0

    try {
        const arboonNawwis = await ArboonNawwi.find({}, { nID: 1, arabic: 1, english: 1, voice: 1 }).skip(skip).limit(limit) // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            "currentPage": page,
            "pagesCount": pagesCount,
            "arboonNawwis": arboonNawwis,
            "arboonNawwiCount": arboonNawwiCount
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new arboonNawwi
export const addArboonNawwi = async (req, res) => {
    try {


        const voice = req.file
        //console.log(voice)
        if (!voice) {
            return res.status(404).json({ error: "voice not found" });
        }

        const metadata = await mm.parseFile(voice.path);
        const duration = metadata.format.duration;

        // console.log (req.body)
        const newArboonNawwiVoice = new ArboonNawwiVoice({
            filename: req.file.filename,
            path: req.file.path,
            duration: 1,
            type: req.file.mimetype,
            size: req.file.size
        })
        await newArboonNawwiVoice.save();
        // let cryptedPassword = req.body.password  

        const arabicWithoutTashkit = removeDiacritics(req.body.arabic)
        const newArboonNawwi = new ArboonNawwi({
            nID: req.body.number,
            arabic: req.body.arabic,
            arabicWithoutTashkit: arabicWithoutTashkit,
            english: req.body.english,
            voice: newArboonNawwiVoice
        });

        await newArboonNawwi.save();
        res.status(201).json({ message: 'arboonNawwi added successfully' });
    } catch (error) {
        deleteFileWithPath(req.file.path)
        res.status(400).json({ error: error.message });
    }
};


// Update arboonNawwi by ID
export const updateArboonNawwi = async (req, res) => {
    try {
        const arboonNawwiToUpdate = await ArboonNawwi.findById(req.params.id);

        if (!arboonNawwiToUpdate) {

            deleteFileWithPath(req.file.path)
            return res.status(404).json({ message: 'aqidah not found' });
        }

        const oldVoice = await ArboonNawwiVoice.findById(arboonNawwiToUpdate.voice)
        const newVoice = req.file
        let voiceData = {}
        let oldArboonNawwiVoicePath;
        let newArboonNawwiVoice


        if (newVoice) {
            const metadata = await mm.parseFile(newVoice.path);
            const duration = metadata.format?.duration || 0;

            oldArboonNawwiVoicePath = oldVoice.path
            //console.log(oldVoice)

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }


            newArboonNawwiVoice = new ArboonNawwiVoice(voiceData)
            await newArboonNawwiVoice.save();

        } else {

            voiceData = arboonNawwiToUpdate.voice

        }
      //  console.log(voiceData)



        const arabicWithoutTashkit = removeDiacritics(req.body.arabic||"")

        const updatedArboonNawwi = await ArboonNawwi.findByIdAndUpdate(
            req.params.id,
            {
                nID: req.body.number || arboonNawwiToUpdate.number,
                arabic: req.body.arabic || arboonNawwiToUpdate.arabic,
                arabicWithoutTashkit: arabicWithoutTashkit || arboonNawwiToUpdate.arabicWithoutTashkit,
                english: req.body.english || arboonNawwiToUpdate.english,
                voice: newArboonNawwiVoice || oldVoice
            },
            {
                new: true,
                projection: { nID: 1, arabic: 1, english: 1, voice: 1 }
            }
        );


        if (oldArboonNawwiVoicePath) {
            deleteFileWithPath(oldArboonNawwiVoicePath)
        }

        res.status(200).json(updatedArboonNawwi);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
    ;
/* {
    try {
        const arboonNawwiToUpdate = await ArboonNawwi.findById(req.params.id);
        if (!arboonNawwiToUpdate) {

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('ArboonNawwiVoice file deleted:', req.file.path);
                }
            })
                nID

            return res.status(404).json({ message: 'arboonNawwi not found' });
        }

        //console.log(arboonNawwiToUpdate.voice)

        const voice = req.file
        let voiceData = {}
        let oldArboonNawwiVoicePath;

        if (voice) {
            const metadata = await mm.parseFile(voice.path);
            const duration = metadata.format?.duration || 0;
            const oldvoice = await ArboonNawwiVoice.findById(arboonNawwiToUpdate.voice)
            oldArboonNawwiVoicePath = oldvoice.path

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }

        } else {

            voiceData = arboonNawwiToUpdate.voice

        }


        const newArboonNawwiVoice = new ArboonNawwiVoice(voiceData)
        await newArboonNawwiVoice.save();


        const updatedArboonNawwi = await ArboonNawwi.findByIdAndUpdate(
            req.params.id,
            {
                nID: req.body.number,
                arabic: req.body.arabic,
                english: req.body.english,
                voice: newArboonNawwiVoice
            },
            { new: true }
        );


        if (oldArboonNawwiVoicePath) {
            fs.unlink(oldArboonNawwiVoicePath, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('Old voice file deleted:', oldArboonNawwiVoicePath);
                }
            });
        }

        res.status(200).json(updatedArboonNawwi);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

*/


// Delete arboonNawwi by ID
export const deleteArboonNawwi = async (req, res) => {
    try {
        // Find and delete the arboonNawwi with populated voice field
        const result = await ArboonNawwi.findByIdAndDelete(req.params.id).populate({ path: "voice" });

        if (!result) {
            return res.status(404).json({ message: 'ArboonNawwi not found' });
        }

        const voice = result.voice;  // The voice is already populated

        // Now, safely delete the voice file from the file system
        if (voice && voice.path) {
            deleteFileWithPath(voice.path)
            
        }

        res.status(200).json({ message: 'ArboonNawwi and associated voice deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get the total number of arboonNawwis
export const getTotalArboonNawwiCount = async (req, res) => {
    try {
        const count = await ArboonNawwi.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

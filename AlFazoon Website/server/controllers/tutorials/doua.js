
import { Doua, DouaVoice } from '../../models/tutorials/doua.js';
import * as mm from 'music-metadata';
import fs from 'fs'
import { Console } from 'console';
import mongoose from 'mongoose';

// Search doua in text
export const searchDoua = async (req, res) => {
    // try {
    //     const searchArabicWord = req.body.arabic || ""
    //     const searchEnglishWord = req.body.english || ""
    //     console.log(searchArabicWord, searchEnglishWord)


    //     const douas = await Doua.find({
    //         $or: [
    //             {  dID: req.body.dID||-1},
    //             { arabic: { $regex: searchArabicWord, $options: 'i' } }, // Case-insensitive search in Arabic
    //             { english: { $regex: searchEnglishWord, $options: 'i' } }, // Case-insensitive search in English
    //         ]
    //     });

    try {

        const searchWord = req.body.searchWord || "";
        let dID = Number(req.body.searchWord) || -1;
        // Initialize an empty array for query conditions
        const queryConditions = [];

        // Check if dID is a valid number
        if (!isNaN(dID) && dID != -1) {  // dID should be a positive number
            queryConditions.push({ dID: dID });
        } else if (searchWord) {
            queryConditions.push({ arabic: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ english: { $regex: searchWord, $options: 'i' } });
            queryConditions.push({ type: { $regex: searchWord, $options: 'i' } });
        } else {
            queryConditions.push({ nothing: 0 });
        }

        // console.log(queryConditions)


        const douas = await Doua.find({ $or: [...queryConditions] })

        if (!douas) {
            return res.status(404).json({ message: 'doua not found' });
        }
        res.status(200).json(douas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get doua by ID
export const getDouaById = async (req, res) => {
    try {
        const doua = await Doua.findById(req.params.id).populate('voice');
        if (!doua) {
            return res.status(404).json({ message: 'doua not found' });
        }


        res.status(200).json({
            "_id": doua._id,
            "dID": doua.dID,
            "arabic": doua.arabic,
            "english": doua.english,
            "type": doua.type,
            "voice": doua.voice,
        }
        );
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Get all douas
export const getDouas = async (req, res) => {

    const page = req.query.page || 1
    const limit = req.query.limit || 10
    const skip = (page - 1) * limit

    const douaCount = await Doua.countDocuments()
    // console.log(douaCount)

    const pagesCount = Math.ceil(douaCount / limit) || 0

    try {
        const douas = await Doua.find().skip(skip).limit(limit) // Skip the specified number of documents.limit(limit);;
        res.status(200).json({
            "currentPage": page,
            "pagesCount": pagesCount,
            "douas": douas,
            "douaCount": douaCount
        })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add a new doua
export const addDoua = async (req, res) => {
    try {


        const voice = req.file
        //console.log(voice)
        if (!voice) {
            return res.status(404).json({ error: "voice not found" });
        }

        const metadata = await mm.parseFile(voice.path);
        const duration = metadata.format.duration;

        // console.log (req.body)
        const newDouaVoice = new DouaVoice({
            filename: req.file.filename,
            path: req.file.path,
            duration: 1,
            type: req.file.mimetype,
            size: req.file.size
        })
        await newDouaVoice.save();
        // let cryptedPassword = req.body.password  
        const newDoua = new Doua({
            dID: req.body.number,
            type: req.body.type,
            arabic: req.body.arabic,
            english: req.body.english,
            voice: newDouaVoice
        });

        await newDoua.save();
        res.status(201).json({ message: 'doua added successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Update doua by ID
export const updateDoua = async (req, res) => {
    try {
        const douaToUpdate = await Doua.findById(req.params.id);
        const oldVoice = await DouaVoice.findById(douaToUpdate.voice)
        const newVoice = req.file
        let voiceData = {}
        let oldDouaVoicePath;
        let newDouaVoice
        if (!douaToUpdate) {

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('DouaVoice file deleted:', req.file.path);
                }
            })

            return res.status(404).json({ message: 'aqidah not found' });
        }



        if (newVoice) {
            const metadata = await mm.parseFile(newVoice.path);
            const duration = metadata.format?.duration || 0;

            oldDouaVoicePath = oldVoice.path
            console.log(oldVoice)

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }

            newDouaVoice = new DouaVoice(voiceData)
            await newDouaVoice.save();

        } else {
            console.log("no new", oldVoice.filename)

            voiceData = douaToUpdate.voice

        }
        console.log(voiceData)





        const updatedDoua = await Doua.findByIdAndUpdate(
            req.params.id,
            {
                aID: req.body.number,
                arabic: req.body.arabic,
                english: req.body.english,
                voice: newDouaVoice || oldVoice
            },
            { new: true }
        );


        if (oldDouaVoicePath) {
            fs.unlink(oldDouaVoicePath, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('Old voice file deleted:', oldDouaVoicePath);
                }
            });
        }

        res.status(200).json(updatedDoua);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    /*
    try {
        const douaToUpdate = await Doua.findById(req.params.id);
        if (!douaToUpdate) {

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('DouaVoice file deleted:', req.file.path);
                }
            })

            return res.status(404).json({ message: 'doua not found' });
        }

        //console.log(douaToUpdate.voice)

        const voice = req.file
        let voiceData = {}
        let oldDouaVoicePath;

        if (voice) {
            const metadata = await mm.parseFile(voice.path);
            const duration = metadata.format?.duration || 0;
            const oldvoice = await DouaVoice.findById(douaToUpdate.voice)
            oldDouaVoicePath = oldvoice.path

            voiceData = {
                filename: req.file.filename,
                path: req.file.path,
                duration: duration,
                type: req.file.mimetype,
                size: req.file.size
            }

        } else {

            voiceData = douaToUpdate.voice

        }


        const newDouaVoice = new DouaVoice(voiceData)
        await newDouaVoice.save();


        const updatedDoua = await Doua.findByIdAndUpdate(
            req.params.id,
            {
                dID: req.body.number,
                type:req.body.type,
                arabic: req.body.arabic,
                english: req.body.english,
                voice: newDouaVoice
            },
            { new: true }
        );


        if (oldDouaVoicePath) {
            fs.unlink(oldDouaVoicePath, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('Old voice file deleted:', oldDouaVoicePath);
                }
            });
        }

        res.status(200).json(updatedDoua);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    */
};




// Delete doua by ID
export const deleteDoua = async (req, res) => {
    try {
        // Find and delete the doua with populated voice field
        const result = await Doua.findByIdAndDelete(req.params.id).populate({ path: "voice" });

        if (!result) {
            return res.status(404).json({ message: 'Doua not found' });
        }

        const voice = result.voice;  // The voice is already populated

        // Now, safely delete the voice file from the file system
        if (voice && voice.path) {
            fs.unlink(voice.path, (err) => {
                if (err) {
                    console.error('Failed to delete old voice file:', err);
                } else {
                    console.log('DouaVoice file deleted:', voice.path);
                }
            });
        }

        res.status(200).json({ message: 'Doua and associated voice deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get the total number of douas
export const getTotalDouaCount = async (req, res) => {
    try {
        const count = await Doua.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getTypes = async (req, res) => {
    try {


        const douas = await Doua.find().populate().select({ _id: 0, type: 1 })

        if (douas) {
            const typesArray = [...new Set(douas.map(doua => doua.type))]


            res.status(200).send(typesArray)
        } else {
            res.status(400).json("there are no types")
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
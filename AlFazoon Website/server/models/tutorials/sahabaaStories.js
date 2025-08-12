import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const sahabaaStoriesVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const SahabaaStoriesVoice = mongoose.model('SahabaaStoriesVoice', sahabaaStoriesVoiceSchema);
// create schema
const sahabaaStoriesSchema = new Schema({
    hID: { type: Number, required: true, unique: true },
    name: String,
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'SahabaaStoriesVoice', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

sahabaaStoriesSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const SahabaaStories = mongoose.model('SahabaaStories', sahabaaStoriesSchema);

//export default model("SahabaaStories", sahabaaStoriesSchema);
//export default { SahabaaStoriesVoice, SahabaaStories };
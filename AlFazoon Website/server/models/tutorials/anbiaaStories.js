import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const anbiaaStoriesVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const AnbiaaStoriesVoice = mongoose.model('AnbiaaStoriesVoice', anbiaaStoriesVoiceSchema);
// create schema
const anbiaaStoriesSchema = new Schema({
    hID: { type: Number, required: true, unique: true },
    name: String,
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'AnbiaaStoriesVoice', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

anbiaaStoriesSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const AnbiaaStories = mongoose.model('AnbiaaStories', anbiaaStoriesSchema);

//export default model("AnbiaaStories", anbiaaStoriesSchema);
//export default { AnbiaaStoriesVoice, AnbiaaStories };
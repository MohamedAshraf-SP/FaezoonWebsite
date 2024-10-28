import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const hadithVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const HadithVoice = mongoose.model('HadithVoice', hadithVoiceSchema);
// create schema
const hadithSchema = new Schema({
    hID: { type: Number, required: true, unique: true },
    name: String,
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'HadithVoice', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

hadithSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Hadith = mongoose.model('Hadith', hadithSchema);

//export default model("Hadith", hadithSchema);
//export default { HadithVoice, Hadith };
import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const azkarVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const AzkarVoice = mongoose.model('AzkarVoice', azkarVoiceSchema);
// create schema
const azkarSchema = new Schema({
    zID: { type: Number, required: true, unique: true },
    type: { type: String, required: true },
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'AzkarVoice', required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

azkarSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Azkar = mongoose.model('Azkar', azkarSchema);

//export default model("Azkar", azkarSchema);
//export default { AzkarVoice, Azkar };
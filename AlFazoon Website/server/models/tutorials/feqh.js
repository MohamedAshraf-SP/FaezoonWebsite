import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const feqhVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const FeqhVoice = mongoose.model('FeqhVoice', feqhVoiceSchema);
// create schema
const feqhSchema = new Schema({
    hID: { type: Number, required: true, unique: true },
    name: String,
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'FeqhVoice', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

feqhSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Feqh = mongoose.model('Feqh', feqhSchema);

//export default model("Feqh", feqhSchema);
//export default { FeqhVoice, Feqh };
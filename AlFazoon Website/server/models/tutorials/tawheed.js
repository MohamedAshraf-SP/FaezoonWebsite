import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const tawheedVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const TawheedVoice = mongoose.model('TawheedVoice', tawheedVoiceSchema);
// create schema
const tawheedSchema = new Schema({
    hID: { type: Number, required: true, unique: true },
    name: String,
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'TawheedVoice', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

tawheedSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Tawheed = mongoose.model('Tawheed', tawheedSchema);

//export default model("Tawheed", tawheedSchema);
//export default { TawheedVoice, Tawheed };
import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const douaVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const DouaVoice = mongoose.model('DouaVoice', douaVoiceSchema);
// create schema
const douaSchema = new Schema({
    dID: { type: Number, required: true },

    name: { type: String },
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    type: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'DouaVoice', required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

douaSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Doua = mongoose.model('Doua', douaSchema);

//export default model("Doua", douaSchema);
//export default { DouaVoice, Doua };
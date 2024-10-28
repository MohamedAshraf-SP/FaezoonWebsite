import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const arboonNawwiVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const ArboonNawwiVoice = mongoose.model('ArboonNawwiVoice', arboonNawwiVoiceSchema);
// create schema
const arboonNawwiSchema = new Schema({
    nID: { type: Number, required: true, unique: true },
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },
    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'ArboonNawwiVoice', required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

arboonNawwiSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const ArboonNawwi = mongoose.model('ArboonNawwi', arboonNawwiSchema);

//export default model("ArboonNawwi", arboonNawwiSchema);
//export default { ArboonNawwiVoice, arboonNawwi };
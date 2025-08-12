import { Schema, model } from "mongoose";
import mongoose from "mongoose";


const aqidahVoiceSchema = new Schema({
    filename: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    duration: { type: Number }, // Duration in seconds
    size: { type: Number, required: true },
    type: { type: String, required: true }
})
export const AqidahVoice = mongoose.model('AqidahVoice', aqidahVoiceSchema);
// create schema
const aqidahSchema = new Schema({
    aID: { type: Number, required: true, unique: true },
    arabic: { type: String, required: true },
    arabicWithoutTashkit: { type: String, required: true },
    english: { type: String, required: true },

    arabicA: { type: String, required: true },
    arabicAWithoutTashkit: { type: String, required: true },
    englishA: { type: String, required: true },

    voice: { type: mongoose.Schema.Types.ObjectId, ref: 'AqidahVoice', required: true },
    // type:{ type: String, required: true },
    name: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

aqidahSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});
export const Aqidah = mongoose.model('Aqidah', aqidahSchema);

//export default model("Aqidah", aqidahSchema);
//export default { AqidahVoice, aqidah };
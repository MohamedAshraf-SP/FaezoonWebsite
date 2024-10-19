import express from "express";
import { aqidahsRoute } from "./aqidah.js";
import { arboonNawwisRoute } from "./arboonNawwi.js";
import { hadithsRoute } from "./hadith.js";
import { douasRoute } from "./doua.js";
import { azkarsRoute } from "./azkar.js";


const tutorialsRoute = express.Router();

tutorialsRoute.use("/azkars", azkarsRoute);
tutorialsRoute.use("/douas", douasRoute);
tutorialsRoute.use("/aqidahs", aqidahsRoute);
tutorialsRoute.use("/hadiths", hadithsRoute);
tutorialsRoute.use("/arboonNawwis", arboonNawwisRoute);


export default tutorialsRoute;

// module.exports=router

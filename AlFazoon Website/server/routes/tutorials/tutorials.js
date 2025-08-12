import express from "express";
import { aqidahsRoute } from "./aqidah.js";
import { arboonNawwisRoute } from "./arboonNawwi.js";
import { hadithsRoute } from "./hadith.js";
import { tawheedsRoute } from "./tawheed.js";
import { feqhsRoute } from "./feqh.js";
import { douasRoute } from "./doua.js";
import { azkarsRoute } from "./azkar.js";
import { anbiaaStoriessRoute } from "./anbiaaStories.js";
import { sahabaaStoriessRoute } from "./sahabaaStories.js";


const tutorialsRoute = express.Router();

tutorialsRoute.use("/azkars", azkarsRoute);
tutorialsRoute.use("/douas", douasRoute);
tutorialsRoute.use("/aqidahs", aqidahsRoute);
tutorialsRoute.use("/anbiaaStories", anbiaaStoriessRoute);
tutorialsRoute.use("/sahabaaStories", sahabaaStoriessRoute);
tutorialsRoute.use("/aqidahs", aqidahsRoute);
tutorialsRoute.use("/feqhs", feqhsRoute);
tutorialsRoute.use("/tawheeds", tawheedsRoute);
tutorialsRoute.use("/hadiths", hadithsRoute);
tutorialsRoute.use("/arboonNawwis", arboonNawwisRoute);


export default tutorialsRoute;

// module.exports=router

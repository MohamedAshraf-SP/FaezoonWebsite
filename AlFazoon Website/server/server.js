import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDB } from "./config/databaseConnection.js";
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get the filename and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 3000; // Default to 3000 if not set
const host = process.env.HOST || 'localhost'; // Default to 'localhost' if not set
const ORIGIN = process.env.ORIGIN;
const dbURI = process.env.DB_URI;

const app = express();

const corsOptions = {
  origin: '*', // Replace with your client origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

connectToDB(dbURI)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Set up body parsers for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up API routes
app.use("/api/v1", router);
// app.use("/api/v1", 
app.use("*", (req, res) => {
  res.status(404).send("ERROR  404   Page not found!!")
});


// Start the server
app.listen(port, host, () => {
  console.log(`Server running on Host ${host} Port ${port}...\n`);
});

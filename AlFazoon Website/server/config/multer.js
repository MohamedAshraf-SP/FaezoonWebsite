
import multer from 'multer'
import path from 'path'
import fs from "fs"


// const ensureDirectoryExistence = (dir) => {
//     if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true }); // Create the directory recursively
//     }
// };

const urlParsingLastWord = (url) => {
    const match = url.match(/\/([^\/]+)\/?$/);
    const lastWord = match ? match[1] : 'default';
    return lastWord
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.lastword = urlParsingLastWord(req.baseUrl)
        const uploadPath = `uploads/${req.lastword}`

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Create the directory recursively
        }


        cb(null, uploadPath); // Folder where files will be saved
    },
    filename: (req, file, cb) => {

        const uniqueSuffix = req.body.number + '_' + Date.now();
        cb(null, 'Voice_' + req.lastword + "_" + uniqueSuffix + path.extname(file.originalname)); // Preserve original file extension
    }
});

export const upload = multer({ storage: storage });
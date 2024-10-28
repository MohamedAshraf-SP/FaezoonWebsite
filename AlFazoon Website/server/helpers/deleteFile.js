import fs from 'fs'

export function deleteFileWithPath(path) {
    fs.unlink(path, (err) => {
        if (err) {
            // console.error('Failed to delete old voice file:', err);
        } else {
            //  console.log(' File deleted:',path);
        }
    })
}
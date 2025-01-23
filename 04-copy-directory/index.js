const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function deleteFolderContents(folder) {
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading folder contents:', err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(folder, file.name);
      if (file.isDirectory()) {
        fs.rm(filePath, { recursive: true, force: true }, (err) => {
          if (err) {
            console.error(`Error removing directory ${filePath}:`, err);
          }
        });
      } else {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error removing file ${filePath}:`, err);
          }
        });
      }
    });
  });
}

function copyDir(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating destination directory:', err);
      return;
    }

    // Delete contents of the destination directory
    deleteFolderContents(destination);

    // Copy contents from the source directory
    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error('Error reading source directory:', err);
        return;
      }

      files.forEach((file) => {
        const sourceFile = path.join(source, file.name);
        const destFile = path.join(destination, file.name);

        if (file.isDirectory()) {
          copyDir(sourceFile, destFile);
        } else {
          fs.copyFile(sourceFile, destFile, (err) => {
            if (err) {
              console.error(`Error copying file ${file.name}:`, err);
            }
          });
        }
      });
    });
  });
}

copyDir(sourceDir, destDir);

module.exports = copyDir;

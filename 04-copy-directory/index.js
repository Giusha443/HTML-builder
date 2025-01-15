const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function copyDir(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating destination directory:', err);
      return;
    }
  });

  fs.readdir(source, { withFileTypes: true }, (_, files) => {
    files.forEach((file) => {
      const sourceFile = path.join(source, file.name);
      const destFile = path.join(destination, file.name);

      if (file.isDirectory()) {
        copyDir(sourceFile, destFile);
      } else {
        fs.copyFile(sourceFile, destFile, (err) => {
          if (err) {
            console.error(`Error copying file ${file.name}:`, err);
            return;
          }
        });
      }
    });
  });
}

copyDir(sourceDir, destDir);
module.exports = copyDir;

const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

function deleteFolderContents(folder) {
  return new Promise((resolve, reject) => {
    fs.readdir(folder, { withFileTypes: true }, (err, files) => {
      if (err) {
        // If folder doesn't exist, resolve immediately
        if (err.code === 'ENOENT') return resolve();
        return reject(`Error reading folder contents: ${err}`);
      }

      const deletions = files.map((file) => {
        const filePath = path.join(folder, file.name);
        return new Promise((resolve, reject) => {
          if (file.isDirectory()) {
            fs.rm(filePath, { recursive: true, force: true }, (err) => {
              if (err) reject(`Error removing directory ${filePath}: ${err}`);
              else resolve();
            });
          } else {
            fs.unlink(filePath, (err) => {
              if (err) reject(`Error removing file ${filePath}: ${err}`);
              else resolve();
            });
          }
        });
      });

      Promise.all(deletions).then(resolve).catch(reject);
    });
  });
}

function copyDir(source, destination) {
  return new Promise((resolve, reject) => {
    fs.mkdir(destination, { recursive: true }, (err) => {
      if (err) return reject(`Error creating destination directory: ${err}`);

      fs.readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) return reject(`Error reading source directory: ${err}`);

        const copies = files.map((file) => {
          const sourceFile = path.join(source, file.name);
          const destFile = path.join(destination, file.name);

          if (file.isDirectory()) {
            return copyDir(sourceFile, destFile);
          } else {
            return new Promise((resolve, reject) => {
              fs.copyFile(sourceFile, destFile, (err) => {
                if (err) reject(`Error copying file ${file.name}: ${err}`);
                else resolve();
              });
            });
          }
        });

        Promise.all(copies).then(resolve).catch(reject);
      });
    });
  });
}

if (require.main === module) {
  deleteFolderContents(destDir)
    .then(() => copyDir(sourceDir, destDir))
    .then(() => console.log('Directory copied successfully!'))
    .catch((err) => console.error(err));
}

module.exports = copyDir;

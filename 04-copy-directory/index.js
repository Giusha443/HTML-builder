const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

/* 1)create directories if not exist, if exists recursive :true will help us to avoid errors
   2)read sourceDir and for all files make their pathes
   3)copy each files to new directory
*/
function copyDir() {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating destination directory:', err);
      return;
    }
  });

  fs.readdir(sourceDir, (_, files) => {
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const destFile = path.join(destDir, file);

      fs.copyFile(sourceFile, destFile, (err) => {
        if (err) {
          console.error(`Error copying file ${file}:`, err);
          return;
        }
        console.log(`Copied ${sourceFile} to ${destFile}`);
      });
    });
  });
}

copyDir();

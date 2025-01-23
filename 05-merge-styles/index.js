// 05/index.js

const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function mergeStyles(stylesDir, outputDir, outputFile) {
  fs.mkdir(outputDir, { recursive: true }, () => {
    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Error reading styles directory:', err);
        return;
      }
      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      const writableStream = fs.createWriteStream(outputFile);

      cssFiles.forEach((file) => {
        const filePath = path.join(stylesDir, file.name);
        const readableStream = fs.createReadStream(filePath);
        readableStream.on('data', (styles) => {
          writableStream.write(styles);
        });
      });
    });
  });
}

if (require.main === module) {
  mergeStyles(stylesDir, outputDir, outputFile); // Call the function
}

module.exports = mergeStyles; // Export the function

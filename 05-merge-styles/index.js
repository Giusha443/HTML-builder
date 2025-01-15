const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

function mergeStyles() {
  fs.mkdir(outputDir, { recursive: true }, () => {
    fs.readdir(stylesDir, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.log('Error reading styles directory:', err);
        return;
      }
      //array of css files
      const cssFiles = files.filter(
        (file) => file.isFile() && path.extname(file.name) === '.css',
      );

      const writableStream = fs.createWriteStream(outputFile);

      cssFiles.forEach((file) => {
        const filePath = path.join(stylesDir, file.name);

        // Read each CSS file and append its content to the bundle
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.pipe(writableStream, { end: false });

        // Log the progress
        readableStream.on('end', () => {
          console.log(`Merged: ${file.name}`);
        });

        readableStream.on('error', (err) => {
          console.error(`Error reading file ${file.name}:`, err);
        });
      });

      writableStream.on('finish', () => {
        console.log(`CSS bundle created: ${outputFile}`);
      });
    });
  });
}

// Execute the function
mergeStyles();

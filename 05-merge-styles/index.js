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

      //stream to write to the output file
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

mergeStyles();

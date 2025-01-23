const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (_, files) => {
  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);

      fs.stat(filePath, (_, stats) => {
        const fileName = path.parse(file.name).name;

        const extname = path.extname(file.name).slice(1); // Remove the dot
        console.log(`${fileName} - ${extname} - ${stats.size / 1024}kb`);
      });
    }
  });
});

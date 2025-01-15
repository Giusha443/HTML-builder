const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

const mergeStyles = require('../05-merge-styles/index.js');
const copyDir = require('../04-copy-directory/index.js');

function buildPage() {
  fs.mkdir(projectDist, { recursive: true }, () => {
    buildHtml();
    mergeStyles(stylesDir, projectDist, outputCss);
    copyDir(assetsDir, outputAssets);
  });
}

function buildHtml() {
  fs.readFile(templateFile, 'utf-8', (err, content) => {
    if (err) {
      console.log('Error reading template file:', err);
      return;
    }

    // Find all template tags in the form {{tag}}
    const tags = content.match(/{{\s*[\w-]+\s*}}/g);

    if (!tags) {
      // Write the template content directly if no tags exist
      fs.writeFile(outputHtml, content, () => {});
      return;
    }

    // Replace each tag with corresponding component content
    let completedReplacements = 0;

    tags.forEach((tag) => {
      const componentName = tag.replace(/[{}]/g, '').trim();
      const componentFile = path.join(componentsDir, `${componentName}.html`);

      fs.readFile(componentFile, 'utf-8', (err, componentContent) => {
        if (!err) {
          content = content.replace(new RegExp(tag, 'g'), componentContent);
        }

        completedReplacements++;

        // After all replacements are complete, write to index.html
        if (completedReplacements === tags.length) {
          fs.writeFile(outputHtml, content, (err) => {
            if (err) console.log('Error writing index.html:', err);
          });
        }
      });
    });
  });
}

buildPage();

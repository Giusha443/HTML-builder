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

async function buildPage() {
  try {
    // Create the project-dist directory
    await fs.promises.mkdir(projectDist, { recursive: true });

    await buildHtml();
    await mergeStyles(stylesDir, projectDist, outputCss);
    await deleteFolderContents(outputAssets);
    await copyDir(assetsDir, outputAssets);

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Error building the page:', error);
  }
}

async function buildHtml() {
  try {
    const templateContent = await fs.promises.readFile(templateFile, 'utf-8');

    // Find all template tags in the form {{tag}}
    const tags = templateContent.match(/{{\s*[\w-]+\s*}}/g) || [];

    let htmlContent = templateContent;

    for (const tag of tags) {
      const componentName = tag.replace(/[{}]/g, '').trim();
      const componentFile = path.join(componentsDir, `${componentName}.html`);

      try {
        const componentContent = await fs.promises.readFile(
          componentFile,
          'utf-8',
        );
        htmlContent = htmlContent.replace(
          new RegExp(tag, 'g'),
          componentContent,
        );
      } catch {
        console.warn(`Component ${componentName} not found, skipping.`);
      }
    }

    await fs.promises.writeFile(outputHtml, htmlContent);
    console.log('HTML built successfully!');
  } catch (error) {
    console.error('Error building HTML:', error);
  }
}

async function deleteFolderContents(folder) {
  try {
    const files = await fs.promises.readdir(folder, { withFileTypes: true });

    const deletions = files.map((file) => {
      const filePath = path.join(folder, file.name);
      return file.isDirectory()
        ? fs.promises.rm(filePath, { recursive: true, force: true })
        : fs.promises.unlink(filePath);
    });

    await Promise.all(deletions);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`Error clearing folder ${folder}:`, error);
    }
  }
}

buildPage();

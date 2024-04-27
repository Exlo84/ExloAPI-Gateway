const fs = require('fs');
const path = require('path');

console.log('Starting to list project files...');

// Function to recursively list all files and directories
const listFilesRecursively = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = listFilesRecursively(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

// Function to write the list of files to projectFilesList.txt
const writeToFile = (files) => {
  const outputPath = path.resolve('./projectFilesList.txt');
  fs.writeFile(outputPath, files.join('\n'), 'utf8', (error) => {
    if (error) {
      console.error("Error writing to projectFilesList.txt:", error);
      return;
    }
    console.log(`Project files listed successfully in projectFilesList.txt. Total files listed: ${files.length}`);
  });
};

// Main function
const main = () => {
  try {
    const projectRoot = path.resolve('.');
    const filesList = listFilesRecursively(projectRoot);
    writeToFile(filesList);
  } catch (error) {
    console.error("An error occurred during the listing process:", error);
  }
};

main();
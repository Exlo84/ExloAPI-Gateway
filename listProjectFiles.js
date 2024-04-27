const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to read .gitignore and convert its patterns to glob format
const readGitignore = () => {
  return fs.readFileSync('./.gitignore', 'utf8').split('\n').filter(pattern => pattern && !pattern.startsWith('#')).map(pattern => {
    // Convert to glob pattern
    const globPattern = pattern.endsWith('/') ? `${pattern}**/*` : pattern;
    return globPattern;
  });
};

// Function to list all files excluding those matched by .gitignore patterns
const listFiles = async (gitignorePatterns) => {
  glob("**/*", { ignore: gitignorePatterns, nodir: true }, (err, files) => {
    if (err) {
      console.error("Error listing files:", err);
      return;
    }
    // Write to file
    fs.writeFileSync('./projectFilesList.txt', files.join('\n'), 'utf8');
    console.log('Project files listed successfully in projectFilesList.txt');
  });
};

// Main function
const main = async () => {
  const gitignorePatterns = readGitignore();
  await listFiles(gitignorePatterns);
};

main();
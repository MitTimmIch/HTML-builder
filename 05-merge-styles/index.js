const fs = require('fs/promises');
const path = require('path');
const projectPath = path.resolve(__dirname);
const pathToFolder = path.join(projectPath, 'styles');

async function redDir(pathtoDir) {
  try {
    let filesFromDir = [];
    const files = await fs.readdir(pathtoDir, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        filesFromDir.push(file);
      }
    }
    console.log(filesFromDir);
    return filesFromDir;
  } catch (error) {
    console.log(error);
  }
}

async function readFiles(array) {
  const fileContent = [];

  try {
    if (array) {
      for (let file of array) {
        const pathToFile = path.join(pathToFolder, file.name);
        const content = await fs.readFile(pathToFile, 'utf-8');
        fileContent.push(content);
      }
      console.log(fileContent);
      return fileContent;
    } else {
      console.log('No such file');
    }
  } catch (error) {
    console.log(error);
  }
}

async function createBundle(content) {
  const outputPath = path.join(projectPath, 'project-dist', 'bundle.css');
  const bundleStyles = content.join('\n');
  try {
    await fs.writeFile(outputPath, bundleStyles);
    const bundleFile = await fs.readFile(outputPath, 'utf-8');
    console.log('Bundle create!', bundleFile)
    return bundleFile;
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const DirContent = await redDir(pathToFolder);
  const contentFromFile = await readFiles(DirContent);
  //console.log(contentFromFile);
  const resultCreateBundle = await createBundle(contentFromFile);
  console.log(resultCreateBundle);
})();

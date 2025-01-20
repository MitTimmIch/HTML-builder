const fs = require('fs/promises');
const path = require('path');



async function getDir() {
  let queryFolderName = ''; //for one folder only
  //let queryFolderName = []; if you have some folders.
  try {
    const dirPath = await fs.readdir(__dirname, { withFileTypes: true });
    let isFolder = false;
    for (const folder of dirPath) {
      if (folder.isDirectory() && folder.name === 'secret-folder') {
        //queryFolderName.push(file.name); if you have some folders.
        queryFolderName = folder.name;
        isFolder = true;
      }
    }
    if (!isFolder) {
      console.log(
        'In this directory only files or it is empty or dir name is not secret-folder',
      );
    }
  } catch (error) {
    console.log(error);
  }
  return queryFolderName;
}

async function getFilesFromFolder(pathToFile) {
  const DirFilesPath = path.resolve(__dirname, pathToFile);
  let queryFiles = [];
  try {
    const FilesPath = await fs.readdir(DirFilesPath, { withFileTypes: true });
    let isFile = false;
    for (const file of FilesPath) {
      if (file.isFile()) {
        isFile = true;
        const pathFile = path.join(DirFilesPath, file.name);
        const stats = await fs.stat(pathFile);
        const extantion = path.extname(file.name);
        const fileName = path.basename(file.name, extantion);
        const sizeKb = (stats.size / 1024).toFixed(2);
        queryFiles.push(`${fileName} - ${extantion.slice(1)} - ${sizeKb} Kb`);
      }
    }
    if (!isFile) {
      console.log('In this directory not files or it is empty');
    }
  } catch (error) {
    console.log(error);
  }
  return queryFiles;
}

(async () => {
  try {
    const findFolders = await getDir();
    console.log(findFolders);
    if (findFolders) {
      const findFiles = await getFilesFromFolder(findFolders);
      console.log(findFiles.join('; '));
    } else {
      console.log('wooops, look you are not have a folder');
    }
  } catch (error) {
    console.log(error);
  }
})();

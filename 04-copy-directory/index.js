const fs = require('fs/promises');
const path = require('path');
const projectDir = path.resolve(__dirname);

async function getDir() {
  let chekFolder = ''; //for one folder only
  //let queryFolderName = []; if you have some folders.
  try {
    let isFolder = false;
    const items = await fs.readdir(projectDir, { withFileTypes: true });
    for (const item of items) {
      if (item.isDirectory() && item.name === 'files-copy') {
        await fs.rm(path.join(projectDir, 'files-copy'), {
          recursive: true,
          force: true,
        });
        console.log(
          'Folder copy-files already exist and will be overwrite and update',
        );
      }
      if (item.isDirectory() && item.name === 'files') {
        //queryFolderName.push(file.name); if you have some folders.
        chekFolder = item.name;
        isFolder = true;
      }
    }
    if (!isFolder) {
      chekFolder = null;
      console.log('In this directory dont have folders');
    }
  } catch (error) {
    console.log(error);
  }
  return chekFolder;
}

async function createDir(DirIsReal, projectPath) {
  let creationDir = '';
  const pathToCreatedDir = path.join(projectPath, 'files-copy');
  try {
    if (DirIsReal) {
      creationDir = await fs.mkdir(pathToCreatedDir, { recursive: true });
    }
    //console.log(creationDir);
    return creationDir;
  } catch (error) {
    console.log(error);
  }
}

async function copyFiles(src, des) {
  try {
    const srcPath = path.join(projectDir, src);
    const files = await fs.readdir(srcPath, { withFileTypes: true });
    await fs.mkdir(des, { recursive: true });
    for (let file of files) {
      const srcFilePath = path.join(srcPath, file.name);
      const desFilePath = path.resolve(des, file.name);

      if (file.isFile()) {
        await fs.copyFiles(srcFilePath, desFilePath);
        console.log(`File copied: ${file.name}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const folderCopy = await getDir();
  if (!folderCopy) {
    console.log('No folders in project dir');
  }
  const newDir = await createDir(folderCopy, projectDir);
  console.log('Dir for copy created: ', newDir);
  await copyFiles(folderCopy, newDir);
})();

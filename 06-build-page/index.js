const { access } = require('fs');
const fs = require('fs/promises');
const path = require('path');

const projectPath = path.resolve(__dirname);

async function createBuildFolder(destination) {
  try {
    const folderBildPath = path.join(destination, 'project-dist');
    try {
      await fs.access(folderBildPath);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.mkdir(folderBildPath, {
          recursive: true,
        });
      } else {
        throw error;
      }
    }
    await fs.rm(folderBildPath, {
      recursive: true,
      force: true,
    });
    await fs.mkdir(folderBildPath, {
      recursive: true,
    });
    console.log('Folder build has update');

    await fs.mkdir(path.join(folderBildPath), {
      recursive: true,
    });
    console.log('Build folder has created');
    return folderBildPath;
  } catch (error) {
    console.log(error);
  }
}

async function redDirCss(pathtoDir) {
  try {
    let filesFromDirCss = [];
    const pathStyles = path.join(pathtoDir, 'styles');
    const files = await fs.readdir(pathStyles, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        filesFromDirCss.push(file);
      }
    }
    //console.log(filesFromDirCss);
    return filesFromDirCss;
  } catch (error) {
    console.log(error);
  }
}

async function readHTML(pathtoDir) {
  try {
    const pathHtmlTemplate = path.join(pathtoDir, 'template.html');
    const componentsFolder = path.join(pathtoDir, 'components');
    let templateContent = await fs.readFile(pathHtmlTemplate, 'utf-8');
    const componentsFiles = await fs.readdir(componentsFolder, {
      withFileTypes: true,
    });
    for (let file of componentsFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.basename(file.name, '.html');
        const componentPath = path.join(componentsFolder, file.name);
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        const tag = `{{${componentName}}}`;
        templateContent = templateContent.replace(
          new RegExp(tag, 'g'),
          componentContent,
        );
      }
    }
    return templateContent;
  } catch (error) {
    console.log(error);
  }
}

async function readFilesCSS(array) {
  const fileContent = [];
  const pathToFileCss = path.join(projectPath, 'styles');

  try {
    if (array) {
      for (let file of array) {
        const fileCss = path.join(pathToFileCss, file.name);
        const content = await fs.readFile(fileCss, 'utf-8');
        fileContent.push(content);
      }
      //console.log(fileContent);
      return fileContent;
    } else {
      console.log('No such file');
    }
  } catch (error) {
    console.log(error);
  }
}

async function createBundle(contentCss, contentHtml) {
  const outputPathCss = path.join(projectPath, 'project-dist', 'style.css');
  const outputPathHtml = path.join(projectPath, 'project-dist', 'index.html');
  const bundleStyles = contentCss.join('\n');
  try {
    await fs.writeFile(outputPathCss, bundleStyles);
    const bundleCSS = await fs.readFile(outputPathCss, 'utf-8');
    await fs.writeFile(outputPathHtml, contentHtml);
    const bundleHTML = await fs.readFile(outputPathHtml, 'utf-8');
    console.log('Bundle created');
    return;
  } catch (error) {
    console.log(error);
  }
}

async function copyDirAndFiles(source, target) {
  try {
    try {
      await fs.access(target);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.rm(target, {
          recursive: true,
          force: true,
        });
      } else {
        throw error;
      }
    }
    await fs.mkdir(target, { recursive: true });
    const opirginFleis = await fs.readdir(source, { withFileTypes: true });
    for (let item of opirginFleis) {
      const srcFilePath = path.join(source, item.name);
      const trgFilePath = path.join(target, item.name);

      if (item.isDirectory()) {
        await copyDirAndFiles(srcFilePath, trgFilePath);
      } else {
        await fs.copyFile(srcFilePath, trgFilePath);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

(async () => {
  const build = await createBuildFolder(projectPath);
  const DirContentCss = await redDirCss(projectPath);
  const contentFromFileCSS = await readFilesCSS(DirContentCss);
  const contentFromFileHTML = await readHTML(projectPath);
  const resultCreateBundle = await createBundle(
    contentFromFileCSS,
    contentFromFileHTML,
  );
  const srcAssets = path.join(projectPath, 'assets');
  const trgAssets = path.join(build, 'assets');
  await copyDirAndFiles(srcAssets, trgAssets);
})();

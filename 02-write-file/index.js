const fs = require('fs');
const path = require('path');

const readLine = require('readline');

const process = require('process');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Enter your text for write in the file, for exit type exit or ctrl + c ',
);

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Goodbye!');
    writeStream.end();
    process.exit();
  }
  writeStream.write(input + '\n');
  console.log('text write, go on or exit');
});

rl.on('close', () => {
  console.log('Goodbye!');
  writeStream.end();
  process.exit();
});

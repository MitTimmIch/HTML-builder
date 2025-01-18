const fs = require('fs');
const path = require('path');

const readLine = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// eslint-disable-next-line prettier/prettier
console.log('Enter your text for write in the file, for exit type exit or ctr + c ');

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    closeInput();
  }
  writeStream.write(input + '\n');
  console.log('text write, go on or exit');
});

process.on('SIGINT', () => {
  closeInput();
});

function closeInput() {
  console.log('Goodbye!');
  writeStream.end();
  rl.close();
  process.exit();
};

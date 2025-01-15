const process = require('node:process');
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const stream = fs.createWriteStream(path.join(__dirname, 'output.txt'), {
  flags: 'a',
});

console.log(
  "Welcome! Enter some text to write to 'output.txt'. Type 'exit' or press 'Ctrl+C' to stop.",
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Exit command received. Goodbye!');
    process.exit();
  } else {
    stream.write(`${input}\n`);
  }
});

process.stdin.on('keypress', (_, key) => {
  if (key.ctrl && key.name === 'c') {
    console.log('Ctrl+C pressed, stopping input. Goodbye!');
    process.exit();
  }
});

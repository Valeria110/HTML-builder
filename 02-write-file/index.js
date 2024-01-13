const path = require('path');
const fs = require('fs');
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);
const { stdout, stdin } = process;

stdout.write(
  'Hey there! Write any text that will be added to the text.txt file\n',
);

stdin.on('data', (data) => {
  const str = data.toString().trim();

  if (str.indexOf('exit') === -1) {
    writableStream.write(data);
  } else {
    process.exit();
  }
});

process.on('exit', () => stdout.write('Bye and have a good day!'));
process.on('SIGINT', () => process.exit());

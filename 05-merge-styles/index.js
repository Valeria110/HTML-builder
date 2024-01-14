const path = require('path');
const fs = require('fs');
const writableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf-8',
);

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
        const readableStream = fs.createReadStream(
          path.join(__dirname, 'styles', file.name),
          'utf-8',
        );
        readableStream.pipe(writableStream);
      }
    });
  },
);

const path = require('path');
const fs = require('fs');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile() === true) {
        const fileExtension = path.extname(file.name).slice(1);
        const fileName = file.name.split('.')[0];

        fs.stat(
          path.join(__dirname, 'secret-folder', file.name),
          (err, stats) => {
            if (err) throw err;
            console.log(
              `${fileName} - ${fileExtension} - ${stats.size / 1024}kB`,
            );
          },
        );
      }
    });
  },
);

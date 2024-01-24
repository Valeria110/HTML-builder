const path = require('path');
const fs = require('fs');

fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
  if (err) throw err;
});

fs.readdir(
  path.join(__dirname, 'files'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file.name),
        path.join(__dirname, 'files-copy', file.name),
        (err) => {
          if (err) throw err;
        },
      );
    });
  },
);

fs.readdir(path.join(__dirname, 'files-copy'), (err, filesCopy) => {
  if (err) throw err;

  filesCopy.forEach((fileCopy) => {
    fs.readdir(path.join(__dirname, 'files'), (err, files) => {
      if (err) throw err;
      if (!files.includes(fileCopy))
        fs.unlink(path.join(__dirname, 'files-copy', fileCopy), (err) => {
          if (err) console.log(err);
        });
    });
  });
});

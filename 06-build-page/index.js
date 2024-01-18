const path = require('path');
const fs = require('fs');
const readableStream = fs.createReadStream(
  path.join(__dirname, 'template.html'),
  'utf-8',
);
fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  if (err) throw err;
});

// Create index.html file in the project-dist folder after replacing all the template tags with the components:
let data = '';
const componentsArr = [];

fs.readdir(
  path.join(__dirname, 'components'),
  { withFileTypes: true },
  (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name).slice(1) === 'html') {
        componentsArr.push(file.name.slice(0, -5));
      }
    });
  },
);

readableStream.on('data', (chunk) => (data += chunk));
readableStream.on('end', () => {
  componentsArr.forEach((component) => {
    if (data.indexOf(component) !== -1) {
      fs.readFile(
        path.join(__dirname, 'components', `${component}.html`),
        'utf-8',
        (err, compData) => {
          if (err) throw err;
          data = data.replaceAll(`{{${component}}}`, compData);
          fs.writeFile(
            path.join(__dirname, 'project-dist', 'index.html'),
            data,
            (err) => {
              if (err) throw err;
            },
          );
        },
      );
    }
  });
});

// Compile css files from the folder styles into a single file in the project-dist folder:
const cssWritableStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
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
        readableStream.pipe(cssWritableStream);
      }
    });
  },
);

// Copy all the files from the assets folder into the project-dist folder:
fs.mkdir(
  path.join(__dirname, 'project-dist', 'assets'),
  { recursive: true },
  (err) => {
    if (err) throw err;
  },
);

fs.readdir(
  path.join(__dirname, 'assets'),
  { withFileTypes: true },
  (err, folders) => {
    if (err) throw err;

    folders.forEach((folder) => {
      if (folder.isDirectory()) {
        fs.mkdir(
          path.join(__dirname, 'project-dist', 'assets', folder.name),
          { recursive: true },
          (err) => {
            if (err) throw err;
          },
        );

        fs.readdir(
          path.join(__dirname, 'assets', folder.name),
          { withFileTypes: true },
          (err, files) => {
            if (err) throw err;

            files.forEach((file) => {
              fs.copyFile(
                path.join(__dirname, 'assets', folder.name, file.name),
                path.join(
                  __dirname,
                  'project-dist',
                  'assets',
                  folder.name,
                  file.name,
                ),
                (err) => {
                  if (err) throw err;
                },
              );
            });
          },
        );
      } else {
        folders.forEach((folder) => {
          fs.copyFile(
            path.join(__dirname, 'assets', folder.name),
            path.join(__dirname, 'project-dist', 'assets', folder.name),
            (err) => {
              if (err) throw err;
            },
          );
        });
      }
    });
  },
);

const path = require('path');

module.exports = {
  entry: {
    index:'./static/js/index.js',
    mylearning:'./static/js/mylearning.js',
    myprofile:'./static/js/myprofile.js',
    search:'./static/js/search.js',
  },
  output: {
    path: path.resolve(__dirname, './static/dist'),
    filename: '[name].bundle.js',
  },
};

// apps
// ├── dir1
// │   └── js
// │       ├── main.js [entry 1]
// │       └── bundle.js [output 1]
// └── dir2
//     ├── index.js [entry 2]
//     └── foo.js [output 2]
// Then try this in your module.exports:
//
// {
//   entry: {
//     'dir1/js/bundle': path.resolve(__dirname, '/apps/dir1/js/main.js'),
//     'dir2/foo' : path.resolve(__dirname, '/apps/dir2/index.js')
//   },
//   output: {
//     path: path.resolve(__dirname, '/apps'),
//     filename: '[name].js'
//   },
//   ...
// }

// entry: {
//   app: './src/app.js',
//   contact: './src/contact.js'
// },
// output: {
//   path: path.resolve(__dirname, 'dist'),
//   filename: '[name].bundle.js'
// },

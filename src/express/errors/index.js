const fs     = require('fs');
const path   = require('path');
const errors = {};

fs.readdirSync(__dirname)
.filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (path.extname(file) === '.js'))
.forEach(file => {
  const error          = require(path.join(__dirname, file));
  errors[error.name] = error;
});

module.exports = errors;

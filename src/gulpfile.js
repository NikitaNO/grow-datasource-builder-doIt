const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const path = require('path');

gulp.task('default', () => {
  return true;
});

gulp.task('start:dev', done => {
  let started = false;
  nodemon({
    script: path.join(__dirname, 'index.js'),
    ext: 'js json',
    nodeArgs: ['--debug=0.0.0.0:9229'],
    watch: path.join(__dirname, 'express'),
    legacyWatch: true
  })
  .on('start', () => {
    // to avoid nodemon being started multiple times
    if (!started) {
      setTimeout(() => done(), 100);
      started = true;
    }
  });
});

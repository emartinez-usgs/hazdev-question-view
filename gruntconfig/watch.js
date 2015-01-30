'use strict';

var config = require('./config');

var watch = {
  scripts: {
    files: [
      config.src + '/**/*.js',
      config.test + '/**/*.js'
    ],
    tasks: ['jshint:scripts', 'browserify', 'mocha_phantomjs']
  },
  html: {
    files: [
      config.test + '/*.html'
    ],
    tasks: [ 'copy:example', 'copy:test']
  },
  scss: {
    files: [
      config.src + '/**/*.scss'
    ],
    tasks: [
      'compass:dev',
      'compass:test'
    ]
  },
  reload: {
    files: [
      config.build + '/**/*'
    ],
    options: {
      livereload: true
    }
  },
  gruntfile: {
    files: [
      'Gruntfile.js',
      'gruntconfig/**/*.js'
    ],
    tasks: ['jshint:gruntfile']
  }
};

module.exports = watch;

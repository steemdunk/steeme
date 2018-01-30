#!/usr/bin/env node

const gulp = require('gulp');
const path = require('path');
require(path.join(__dirname, '..', 'gulpfile.js'));

gulp.start('build');

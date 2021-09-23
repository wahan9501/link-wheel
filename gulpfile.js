const gulp = require("gulp");
const path = require("path");

const rootDir = path.resolve(".");
const outputDir = path.resolve(rootDir, "./build");

/* Task: Build Wheel Injection Script */
function buildWheelInjectionScript(cb) {
  gulp.src("./src/pages/wheel.js").pipe(gulp.dest(outputDir));

  cb();
}

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

exports.build = buildWheelInjectionScript;
exports.default = defaultTask;

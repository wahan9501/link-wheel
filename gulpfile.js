const fs = require("fs");
const gulp = require("gulp");
const esbuild = require("esbuild");

function copyManifest() {
  return gulp.src("src/assets/manifest.json").pipe(gulp.dest("dist/"));
}

function buildWheel() {
  return esbuild.build({
    entryPoints: ["src/pages/wheel/wheel.js"],
    bundle: true,
    inject: ["src/pages/wheel/chromeStorage.js"],
    loader: { ".html": "text" },
    outdir: "dist",
  });
}

function buildWheelDev() {
  esbuild.buildSync({
    entryPoints: ["src/pages/wheel/wheel.js"],
    bundle: true,
    inject: ["src/pages/wheel/localStorage.js"],
    loader: { ".html": "text" },
    outdir: "dist",
  });

  return gulp.src("src/pages/wheel/wheelDev.html").pipe(gulp.dest("dist/"));
}

function buildScripts() {
  return esbuild.build({
    entryPoints: ["src/scripts/background.js"],
    outdir: "dist",
  });
}

const buildAll = gulp.parallel(buildScripts, buildWheel, copyManifest);

function watchAll() {
  gulp.watch(["src/**/*"], buildAll);
}

exports.copyManifest = copyManifest;
exports.buildScripts = buildScripts;
exports.buildWheel = buildWheel;
exports.buildWheelDev = buildWheelDev;
exports.watchAll = watchAll;
exports.default = buildAll;

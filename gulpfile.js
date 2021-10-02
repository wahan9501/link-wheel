const gulp = require("gulp");
const esbuild = require("esbuild");
var del = require("del");

function copyManifest() {
  return gulp.src("src/assets/manifest.json").pipe(gulp.dest("dist/"));
}

function buildWheel() {
  esbuild.buildSync({
    entryPoints: ["src/pages/wheel/wheel.js"],
    bundle: true,
    inject: ["src/pages/storage/chromeStorage.js"],
    loader: { ".html": "text" },
    outdir: "dist",
  });

  return gulp.src("src/pages/wheel/wheel.html").pipe(gulp.dest("dist/"));
}

function buildWheelDev() {
  esbuild.buildSync({
    entryPoints: ["src/pages/wheel/wheel.js"],
    bundle: true,
    inject: ["src/pages/storage/localStorage.js"],
    loader: { ".html": "text" },
    outdir: "dist",
  });

  return gulp.src("src/pages/wheel/wheelDev.html").pipe(gulp.dest("dist/"));
}

function buildWheelSettings() {
  esbuild.buildSync({
    entryPoints: ["src/pages/wheelSettings/wheelSettings.js"],
    bundle: true,
    inject: ["src/pages/storage/chromeStorage.js"],
    loader: { ".svg": "text" },
    outdir: "dist",
  });

  return gulp.src("src/pages/wheelSettings/wheelSettings.html").pipe(gulp.dest("dist/"));
}

function buildWheelSettingsDev() {
  esbuild.buildSync({
    entryPoints: ["src/pages/wheelSettings/wheelSettings.js"],
    bundle: true,
    inject: ["src/pages/storage/localStorage.js"],
    loader: { ".svg": "text" },
    outdir: "dist",
  });

  return gulp.src("src/pages/wheelSettings/wheelSettings.html").pipe(gulp.dest("dist/"));
}

function buildScripts(cb) {
  const buildBackgroundScript = esbuild.buildSync({
    entryPoints: ["src/scripts/background.js"],
    outdir: "dist",
  });

  const buildInjectWheelScript = esbuild.buildSync({
    entryPoints: ["src/scripts/injectWheel.js"],
    loader: { ".html": "text" },
    bundle: true,
    outdir: "dist",
  });

  return Promise.all([buildBackgroundScript, buildInjectWheelScript]);
}

const build = gulp.parallel(buildScripts, copyManifest, buildWheel, buildWheelSettings);

function watch() {
  clean();
  gulp.watch(["src/**/*"], { ignoreInitial: false }, build);
}

function watchWheelDev() {
  clean();
  gulp.watch(["src/pages/**/*"], { ignoreInitial: false }, buildWheelDev);
}

function watchWheelSettingsDev() {
  clean();
  gulp.watch(["src/pages/**/*"], { ignoreInitial: false }, buildWheelSettingsDev);
}

function clean() {
  return del(["dist/"]);
}

exports.clean = clean;
exports.copyManifest = copyManifest;
exports.buildScripts = buildScripts;
exports.buildWheel = buildWheel;
exports.buildWheelSettings = buildWheelSettings;

exports.buildWheelSettingsDev = buildWheelSettingsDev;
exports.buildWheelDev = buildWheelDev;
exports["start:wheel"] = watchWheelDev;
exports["start:wheelSettings"] = watchWheelSettingsDev;

exports.watch = watch;
exports.build = build;
exports.default = build;

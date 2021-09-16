const gulp = require("gulp");
const replace = require("gulp-replace");
const fs = require("fs");

function buildWheelInject() {
  // console.log("Build Inject Wheel...");
  var wheel_html_string = fs.readFileSync("./src/common/wheel.html", "utf8");
  wheel_html_string.pipe(replace("<!---- inject:css ---->"));

  const src = gulp.src("./src/wheel-inject/wheel-inject.js");
  const dst = gulp.dest("build/");
  var wheel_html_string = fs.readFileSync("./src/common/wheel.html", "utf8");
  var constants_js = fs.readFileSync("./src/common/constants.js", "utf8");
  var wheel_js = fs.readFileSync("./src/common/wheel.js", "utf8");

  return src
    .pipe(replace("/**** replace with wheel.html ****/", `const wheelHtml = \`${wheel_html_string}\`;`))
    .pipe(replace("/**** replace with constants.js ****/", constants_js))
    .pipe(replace("/**** replace with wheel.js ****/", wheel_js))
    .pipe(dst);
}

function buildManifest() {
  return gulp.src("./src/assets/manifest.json").pipe(gulp.dest("build/"));
}

gulp.task("build:wheel-inject", buildWheelInject);
gulp.task("build:manifest", buildManifest);

// series(buildWheelInject);

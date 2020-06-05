"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore")
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var babel = require('gulp-babel');
var concat = require('gulp-concat');

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
/*    .pipe(csso())
    .pipe(rename("style.min.css"))*/
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task('concat', function() {
  return gulp.src('source/js/chunks/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('source/js'));
});

gulp.task('babel', () =>
  gulp.src('source/js/main.js')
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ["@babel/plugin-proposal-class-properties"]
      // presets: ["@babel/preset-es2015"]
    }))
    .pipe(gulp.dest('build/js'))
);

gulp.task('js', () => {
    return gulp.src("source/js/*.js")
      .pipe(gulp.dest('build/js'))
  }
);

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", {usePolling: true}, gulp.series("css"));
  gulp.watch("source/js/chunks/*.js", gulp.series("concat", "refresh"));
  gulp.watch("source/js/main.js", gulp.series("babel", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("img", function() {
  return gulp.src("source/img/**/*.{png,jpg,svg}", {
    base: "source"
  })
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest("source"));

});

gulp.task("webp", function () {
  return gulp.src("source/img/1/*.{png,jpg}", {
    base: "source"
  })
    .pipe(webp({quality: 75}))
    .pipe(gulp.dest("source"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/*.svg")
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest("source/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/*.{js, min.js}",
    "source//*.ico"
    ], {
      base: "source"
    })
  .pipe(gulp.dest("build"));
});

gulp.task("copy-img", function () {
  return gulp.src([
    "source/img/**",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});


gulp.task("build", gulp.series("clean", "copy", "css", 'babel', "html"));
gulp.task("start", gulp.series("build", "server"));

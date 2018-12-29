var gulp = require("gulp"),
    del = require("del"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify");
    // eventStream = require("event-stream");


var config = {
  src_dir: "src",
  dist: {
    dir: "dist",
    css_dir: "dist/css"
  }
};

gulp.task("default", function() {
  console.log("Available tasks:");
  console.log([
    "------------------------------------------------------------------------",
    "build           Build stage in the dist directory",
    "clean           Clean the dest directory",
    "-------------------------------------------------------------------------"
  ].join("\n"));
});


gulp.task("clean", function(cb) {
  del([
    config.dist.dir
  ], cb);
});


gulp.task("build", function() {
   // do other build things
   // gulp.start("jshint");

   // return eventStream.merge(
    return gulp.src(["src/gauge.js"]/*, {debug: true}*/)
        .pipe(concat("gauge.js"))
        .pipe(gulp.dest(config.dist.dir))
        .pipe(concat("gauge.min.js"))
        .pipe(gulp.dest(config.dist.dir))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist.dir))
   // );
});
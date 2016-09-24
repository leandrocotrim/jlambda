var version = '-1.0.1';
var gulp = require('gulp');
var minify = require('gulp-minify');
 
gulp.task('compress', function() {
  gulp.src('jlambda.js')
    .pipe(minify({
        ext:{
            src: version + '.js',
            min: version + '.min.js'
        },
        exclude: ['tasks']//,
        //ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest('dist'))
});
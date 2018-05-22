 /* Define some plugins */
const gulp = require('gulp');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const eslint = require('gulp-eslint');
const { Src: Src } = require('./config/Src.js');

/* Tasks getter */

const getTask = (task) => {

	const get = require(`./config/gulp-tasks/${task}.js`);
	
	return get;
	
};

/* Error Handler */

const plumberErrorHandler = { errorHandler: function(err) {    // Catch error.
    
    notify.onError({                                           // Notify for error.
        
        title: err.plugin,
        
        message:  '\n<%= error.message %>'
        
    })(err);
    
}};

/* Compile sass. */

gulp.task('sass', getTask('sass'));

/* Compile es6 to es5. */

gulp.task('babel', getTask('babel'));

/* Run eslint */

gulp.task('lint', getTask('lint'));

/* Optimize Images */

gulp.task('img', getTask('img'));

/* Watch the directory for changes. */

gulp.task('watch', function () {
    
    livereload.listen();                                      // Start listen for live reload.
    
    gulp.watch(Src.input('css'), ['sass']);                   // If a file changes, re-run 'sass'.
    
    gulp.watch(Src.input('js'), ['lint', 'babel']);           // If a file changes, re-run 'lint', 'babel'.
    
    gulp.watch(Src.input('img'), ['img']);                    // If a file changes, re-run 'img'.
    
    gulp.watch('./*.php', livereload.reload);                 // If a file changes, reload page.
    
});

/* Gulp default */

gulp.task('default', ['sass', 'lint', 'babel', 'img']);
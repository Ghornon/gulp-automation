 /* Define some plugins */
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const Stream = require('./modules/Stream.js');
const Logger = require('./modules/Logger.js');

/* Error Handler */

const plumberErrorHandler = { errorHandler: function(err) {    // Catch error.
    
    plugins.notify.onError({                                   // Notify for error.
        
        title: err.plugin,
        
        message: Logger.error(err.message)
        
    })(err);
    
}};

/* Tasks getter */

const getTask = (task) => {

	const get = require(`./config/gulp-tasks/${task}.js`)(gulp, plugins, Stream, plumberErrorHandler);
	
	return get;
	
};

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
    
    plugins.livereload.listen();                                      // Start listen for live reload.
    
    gulp.watch(Stream.input('css'), ['sass']);            // If a file changes, re-run 'sass'.
    
    gulp.watch(Stream.input('js'), ['lint', 'babel']);    // If a file changes, re-run 'lint', 'babel'.
    
    gulp.watch(Stream.input('img'), ['img']);             // If a file changes, re-run 'img'.
    
    gulp.watch(Stream.input('html'), plugins.livereload.reload);                 // If a file changes, reload page.
    
});

/* Gulp default */

gulp.task('default', ['sass', 'lint', 'babel', 'img']);
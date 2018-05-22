module.exports = () => {
	
	return () => {
    
		return gulp.src(Src.input('js'))                            // Create a stream in the directory where our js files are located.

			.pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.

			.pipe(eslint())                                         // Initialize eslint.

			.pipe(eslint.format())                                  // Write errors in console.

			.pipe(eslint.failAfterError());                         // Write errors count in console.
		
	};
	
};
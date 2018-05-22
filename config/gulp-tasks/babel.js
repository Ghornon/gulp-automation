module.exports = () => {
	
	return () => {
    
		return gulp.src(Src.input('js'))                            // Create a stream in the directory where our js files are located.
    
			.pipe(sourcemaps.init())                                // Initialize source map.

			.pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.

			.pipe(babel({                                           // Compile es6 to es5.
				presets: ['es2015']
			}))

			.pipe(concat('bundle.js'))                              // Concatenate all js files into bundle.js.

			.pipe(uglify())                                         // Minify and optimize.

			.pipe(sourcemaps.write('.'))                            // Write source map.

			.pipe(gulp.dest(Src.output('js')))                      // Write bundle.js to the project output directory.

			.pipe(livereload());
		
	};
	
};
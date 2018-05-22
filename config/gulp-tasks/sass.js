module.exports = () => {
	
	return () => {
    
		return gulp.src(Src.input('css'))                           // Create a stream in the directory where our Sass files are located.

			.pipe(sourcemaps.init())                                // Initialize source map.

			.pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.

			.pipe(sass())                                           // Compile Sass into style.css.

			.pipe(autoprefixer({                                    // Add css prefixes.
				browsers: ['last 2 versions'],
				cascade: true
			}))

			.pipe(cssnano({discardComments: {removeAll: true}}))    // Minify and optimize.

			.pipe(concat('styles.css'))                             // Concatenate all css files into styles.css. 

			.pipe(sourcemaps.write('.'))                            // Write source map.

			.pipe(gulp.dest(Src.output('css')))                     // Write styles.css to the project output directory.

			.pipe(livereload());
	};
	
};
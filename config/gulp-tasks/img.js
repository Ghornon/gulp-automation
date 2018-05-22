module.exports = () => {
	
	return () => {
    
		return gulp.src(Src.input('img'))                           // Create a stream in the directory where our img files are located.
    
			.pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.

			.pipe(imagemin({                                        // Optimize images.

				optimizationLevel: 7,

				progressive: true

			}))

			.pipe(gulp.dest(Src.output('img')));                    // Write images to the project output directory.
		
	};
	
};
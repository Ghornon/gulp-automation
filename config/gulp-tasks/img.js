module.exports = (gulp, plugins, Stream, exception) => {

	return () => {

		gulp.src(Stream.input('img')) // Create a stream in the directory where our img files are located.

			.pipe(plugins.plumber(exception)) // Throw exception if exist.

			.pipe(plugins.imagemin({ // Optimize images.

				optimizationLevel: 7,

				progressive: true

			}))

			.pipe(gulp.dest(Stream.output('img'))); // Write images to the project output directory.

	};

};
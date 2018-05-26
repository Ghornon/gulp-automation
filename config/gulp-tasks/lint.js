const eslintrc = require('../.eslintrc.json');

module.exports = (gulp, plugins, Stream, exception) => {

	return () => {

		gulp.src(Stream.input('js')) // Create a stream in the directory where our js files are located.

			.pipe(plugins.plumber(exception)) // Throw exception if exist.

			.pipe(plugins.eslint(eslintrc)) // Initialize eslint.

			.pipe(plugins.eslint.format()) // Write errors in console.

			.pipe(plugins.eslint.failAfterError()); // Write errors count in console.

	};

};
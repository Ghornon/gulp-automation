module.exports = (gulp, plugins, Stream, exception, Workspace) => {

	const condition = Workspace.bundler;
	const bundle = Workspace.bundle.css;

	return () => {

		gulp.src(Stream.input('css')) // Create a stream in the directory where our Sass files are located.

			.pipe(plugins.sourcemaps.init()) // Initialize source map.

			.pipe(plugins.plumber(exception)) // Throw exception if exist.

			.pipe(plugins.sass()) // Compile Sass into style.css.

			.pipe(plugins.autoprefixer({ // Add css prefixes.
				browsers: ['last 2 versions'],
				cascade: true
			}))

			.pipe(plugins.cssnano({
				discardComments: {
					removeAll: true
				}
			})) // Minify and optimize.

			.pipe(plugins.if(condition, plugins.concat(bundle))) // Concatenate all css files into bundle if bundler is on

			.pipe(plugins.sourcemaps.write('.')) // Write source map.

			.pipe(gulp.dest(Stream.output('css'))) // Write styles.css to the project output directory.

			.pipe(plugins.livereload());
	};

};
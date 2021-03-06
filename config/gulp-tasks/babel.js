module.exports = (gulp, plugins, Stream, exception, Workspace) => {

	const condition = Workspace.bundler;
	const bundle = Workspace.bundle.js;

	return () => {
		
		gulp.src(Stream.input('js')) // Create a stream in the directory where our js files are located.

			.pipe(plugins.sourcemaps.init()) // Initialize source map.

			.pipe(plugins.plumber(exception)) // Throw exception if exist.

			.pipe(plugins.babel({

				presets: ['babel-preset-es2015'].map(require.resolve)

			})) // Compile es6 to es5.

			.pipe(plugins.if(condition, plugins.concat(bundle))) // Concatenate all js files into bundle if bundler is on

			.pipe(plugins.uglify()) // Minify and optimize.

			.pipe(plugins.sourcemaps.write('.')) // Write source map.

			.pipe(gulp.dest(Stream.output('js'))) // Write bundle.js to the project output directory.

			.pipe(plugins.livereload());

	};

};
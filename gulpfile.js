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
const fs = require('fs');
const eslint = require('gulp-eslint');

/* Config */

const Path = {                                                 // Default paths in your project.
    
    __SRC: './src',                                            // Sources directory.
    __DIST: './assets',                                        // Distribution directory.

    src: {
        js: '/js/',
        css: '/css/',
        img: '/img/'
    },

    dist: {
        js: '/',
        css: '/',
        img: '/img/'
    }
    
};

const Files = {                                                 // Watched files.
    js: ['*.js', '!_*.js'],
    css: ['*.scss', '!_*.scss'],
    img: ['*.png', '*.jpg', '*.jpeg', '*.gif']
};

/* Sources input/output method */

const Src = (() =>{
    
    const input = (type) => {                                   // Return inputs files array.                           
        
        return Files[type].map((item)=>{
            return Path.__SRC + Path.src[type] + item;
        });
        
    };
    
    const output = (type) => {                                  // Return outputs directory.
        
        const dir = Path.__DIST + Path.dist[type];
        
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        
        return dir;
        
    };
    
    return {
        input: input,
        output: output
    }
    
})();

/* Error Handler */

const plumberErrorHandler = { errorHandler: function(err) {    // Catch error.
    
    notify.onError({                                           // Notify for error.
        
        title: err.plugin,
        
        message:  '\n<%= error.message %>'
        
    })(err);
    
}};

/* Compile sass. */

gulp.task('sass', () => {
    
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
});

/* Compile es6 to es5. */

gulp.task('babel', () => {
    
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
});

/* Run eslint */

gulp.task('lint', () => {
    
    return gulp.src(Src.input('js'))                            // Create a stream in the directory where our js files are located.
    
        .pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.
        
        .pipe(eslint())                                         // Initialize eslint.
    
        .pipe(eslint.format())                                  // Write errors in console.
    
        .pipe(eslint.failAfterError());                         // Write errors count in console.
    
});

/* Optimize Images */

gulp.task('img', () => {

    return gulp.src(Src.input('img'))                           // Create a stream in the directory where our img files are located.
    
        .pipe(plumber(plumberErrorHandler))                     // Throw exception if exist.

        .pipe(imagemin({                                        // Optimize images.

            optimizationLevel: 7,

            progressive: true

        }))

        .pipe(gulp.dest(Src.output('img')));                    // Write images to the project output directory.

});

/* Reload html */

/* Watch the directory for changes. */

gulp.task('watch', function () {
    
    livereload.listen();                                      // Start listen for live reload.
    
    gulp.watch(Src.input('css'), ['sass']);                   // If a file changes, re-run 'sass'.
    
    gulp.watch(Src.input('js'), ['lint', 'babel']);           // If a file changes, re-run 'babel'.
    
    gulp.watch(Src.input('img'), ['img']);                    // If a file changes, re-run 'img'.
    
    gulp.watch('./*.php', livereload.reload);                 // If a file changes, reload page.
    
});

/* Gulp default */

gulp.task('default', ['sass', 'lint', 'babel', 'img']);
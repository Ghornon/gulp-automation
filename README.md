# Gulp-automation
### Tasks ruiner for wordpress theme development

## # Content
1. Live reload
2. CSS: SASS to css converter, autoprefixer, minification, sourcemaps
3. JavaScript: ES6 to ES5 converter, minification, sourcemaps, pluggable linting utility for JavaScript (Eslint)
4. IMG: minification
5. Error handler
6. Easy config

### #1: Download
Clone files to your computer. If you want to use wordpress, use the "/wp-contentt/themes" dir. Next install node dependencies.
```bash
$ git clone https://github.com/Ghornon/wp-gulp-automation.git dirName
$ cd dirName
$ npm install
$ npm link
```

### #2: Create new project
Create and select project using cli application.
```bash
$ automation project
```

```bash
# ? What do you want to do with the project? (Use arrow keys)
# > Select project
#   Create new project
#   Edit project
#   Remove project
```

### #3: Run gulp
Run tasks ruiner.
```bash
$ gulp
# Or start watching files
$ gulp watch
# To stop gulp press CTRL + C
```
### #4: Create!
    "Creativity is intelligence having fun" 
        - Albert Einstein

### #5: Optional Step
You can create, modify sources file by adding/modifying json files to "/config/sources/".

## Dev dependencies (included in package.json)
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "chalk": "^2.4.1",
    "commander": "^2.15.1",
    "eslint": "^4.19.1",
    "eslint-config-google": "^0.9.1",
    "figlet": "^1.2.0",
    "gulp": "^3.9.1",
    "gulp-autoprefixer": "^5.0.0",
    "gulp-babel": "^7.0.1",
    "gulp-concat": "^2.6.1",
    "gulp-cssnano": "^2.1.2",
    "gulp-eslint": "^4.0.2",
    "gulp-imagemin": "^4.1.0",
    "gulp-livereload": "^3.8.1",
    "gulp-load-plugins": "^1.5.0",
    "gulp-notify": "^3.2.0",
    "gulp-plumber": "^1.2.0",
    "gulp-sass": "^3.1.0",
    "gulp-sourcemap": "^1.0.1",
    "gulp-sourcemaps": "^2.6.4",
    "gulp-uglify": "^3.0.0",
    "inquirer": "^5.2.0",
    "mkdirp": "^0.5.1",
    "shelljs": "^0.8.2"
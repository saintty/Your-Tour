import browserSync from 'browser-sync';
import del from 'del';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import rename from 'gulp-rename';

// SASS, CSS
import autoPrefixer from 'gulp-autoprefixer';
import dartSass from "sass";
import gulpSass from 'gulp-sass';
import gcmq from "gulp-group-css-media-queries";
import csso from "gulp-csso";

// JavaScript
import uglify from 'gulp-uglify-es';

const scss = gulpSass(dartSass);
export const styles = () => {
    return gulp.src('./src/scss/style.scss')
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(gcmq())
        .pipe(autoPrefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(csso())
        .pipe(gulp.dest('./src/css'));
}

export const scripts = () => {
    return gulp.src('./src/js/main.js')
        .pipe(uglify.default())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest('./src/js'))
        .pipe(browserSync.stream());
}

export const bsync = () => {
    browserSync.create().init({
        server: {
            baseDir: './src'
        },
        port: 3000,
        notify: false,
        files: [
            './src/*.html',
            './src/css/style.css',
            './src/js/main.js',
        ]
    });
}

export const images = () => {
    return gulp.src('./src/images/**/*')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.mozjpeg({quality: 75, progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist/imgPreSet'));
}

export const watching = () => {
    gulp.watch('./src/scss/**/*.scss', styles);
    gulp.watch('./src/js/main.js', scripts);
}

export const cleanDist = () => {
    return del('./dist');
}

export const buildHtml = () => {
    return gulp.src('./src/*.html', {base: './src'})
        .pipe(gulp.dest('./dist'));
}

export const buildCss = () => {
    return gulp.src('./src/css/style.css', {base: './src'})
    .pipe(gulp.dest('./dist'));
}

export const buildJs = () => {
    return gulp.src('./src/js/main.min.js', {base: './src'})
    .pipe(gulp.dest('./dist'));
}

export const build = gulp.series(cleanDist, buildHtml, buildCss, buildJs, images);

export const run = gulp.parallel(styles, scripts, bsync, watching);


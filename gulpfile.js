var gulp    = require('gulp'),
    x       = require('gulp-load-plugins')(),
    opn     = require('opn');

var server = {
    host: 'localhost',
    port: '9876'
}

var srcpath = {
    js: {
        app: [
            '!node_modules/**', 
            '!vendor/**', 
            '*.js',
            '**/*.js',
            '**/**/.js'
        ],
        vendor: [
            'vendor/angular/angular.js',
            'vendor/angular-ui-router/release/angular-ui-router.js',
            'vendor/angular-resource/angular-resource.js',
            'vendor/angular-animate/angular-animate.js',
            'vendor/modernizr/modernizr.js'
        ],
        angular: [
            'angular/app.js', 
            'angular/routes.js', 
            '**/frontend/*.factory.js', 
            '**/frontend/*.controller.js',
            '**/frontend/*.directive.js'
        ]
    },
    css: {
        app: ['!node_modules/**', '!vendor/**', '**/frontend/*.scss'],
        vendor: [
            'vendor/foundation/css/normalize.css',
            'vendor/foundation/css/foundation.css'        
        ]
    },
    views: ['**/views/*.html', '**/partials/*.html'],
    imgs: {
        def: ['./imgs/**/*.{jpg,png,gif}', './imgs/*.{jpg,png,gif}'],
        svg: ['./imgs/*.svg']
    } 
        
}

gulp.task('browser', function() {
    return opn('http://' + server.host + ':' + server.port);
})

gulp.task('clean', function() {
    return gulp.src('dist')
        .pipe(x.clean({ force: true }));
}) 

gulp.task('copy-views', function() {
    return gulp.src(srcpath.views)
        .pipe(x.flatten())
        .pipe(gulp.dest('dist/views'))
})

gulp.task('build-views', function() {
    return gulp.src('index/index.html')
        .pipe(gulp.dest('dist/'))
})

gulp.task('linting', function() {
    return gulp.src(srcpath.js.app)
        .pipe(x.jshint())
        .pipe(x.jshint.reporter('jshint-stylish'));
})

gulp.task('concat-vendor', function() {
    return gulp.src(srcpath.js.vendor)
        .pipe(x.flatten())
        .pipe(x.concat('vendor.js'))
        .pipe(gulp.dest('dist/assets/js'))
})

gulp.task('concat-angular', function() {
    return gulp.src(srcpath.js.angular)
        .pipe(x.flatten())
        .pipe(x.concat('app.js'))
        .pipe(gulp.dest('dist/assets/js'))
})

gulp.task('build-js', ['concat-vendor', 'concat-angular'] , function() {
    return gulp.src(['./dist/assets/**/*.js'])
        .pipe(x.rename({ suffix: '.min' }))
        .pipe(x.uglify({ mangle: false }))
        .pipe(gulp.dest('dist/assets'))
})

gulp.task('css-vendor', function() {
    return gulp.src(srcpath.css.vendor)
        .pipe(x.flatten())
        .pipe(x.concat('vendor.css'))
        .pipe(gulp.dest('dist/assets/css'))
})

gulp.task('css-app', function() {
    return gulp.src(srcpath.css.app)
        .pipe(x.sass({ style: 'expanded' }))
        .pipe(x.autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(x.flatten())
        .pipe(x.concat('style.css'))
        .pipe(gulp.dest('dist/assets/css'));
})

gulp.task('build-css', ['css-vendor', 'css-app'], function() {
    return gulp.src(['./dist/assets/css/*.css'])
        .pipe(x.rename({ suffix: '.min' }))
        .pipe(x.minifyCss())
        .pipe(gulp.dest('dist/assets/css'))
})

gulp.task('images', function() {
    return gulp.src(srcpath.imgs.def)
        .pipe(x.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/assets/imgs'))
})

gulp.task('svg', function() {
    return gulp.src(srcpath.imgs.svg)
        .pipe(gulp.dest('dist/assets/imgs'))
})

gulp.task('watching', function() {
    gulp.watch(srcpath.css.app, ['css-app']);
    gulp.watch(srcpath.js.angular, ['concat-angular']);
    gulp.watch(srcpath.views, ['copy-views']);
    gulp.watch('index/index.html', ['build-views']);
    gulp.watch(srcpath.imgs.def, ['images']);
    
    x.livereload.listen();
    gulp.watch(['dist/**']).on('change', x.livereload.changed);
})

gulp.task('run-server', function() {
    return x.nodemon({
        'script' : 'server.js'
    })
        .on('start', ['watching'])
        .on('change', ['watching'])
        .on('restart', ['watching'])
})

gulp.task('lint', ['linting']);
gulp.task('dist', ['clean'], function() {
    return gulp.start(['build-views', 'build-css', 'build-js', 'images', 'svg']);
});
gulp.task('default', ['watching', 'browser']);
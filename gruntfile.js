module.exports = function(grunt) {
    require('time-grunt')(grunt);
    //require('load-grunt-tasks')(grunt);
    require('jit-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

    // SOURCE PATH
        srcpath: {
            js: {
                all: [
                    '*.js',
                    '**/*.js',
                    '**/**/.js',
                    '!node_modules/**',
                    '!vendor/**'
                ],
                vendor: [
                    'vendor/angular/angular.js',
                    'vendor/angular-ui-router/release/angular-ui-router.js',
                    'vendor/angular-resource/angular-resource.js',
                    'vendor/angular-animate/angular-animate.js',
                    'vendor/angular-storage/dist/angular-storage.js',
                    'vendor/modernizr/modernizr.js',
                    'vendor/jquery/dist/jquery.js',
                    'vendor/foundation/js/foundation.js',
                    'vendor/foundation/js/foundation/foundation.topbar.js'
                ],
                app: [
                    'angular/app.js',
                    'angular/routes.js',
                    'angular/*.factory.js',
                    '**/frontend/*.factory.js',
                    '**/frontend/*.controller.js',
                    '**/frontend/*.directive.js'
                ]
            },
            css: {
                app: {
                    publics: [
                        '**/frontend/*.p.scss',
                        '!node_modules/**',
                        '!vendor/**'
                    ],
                    member: [
                        '**/frontend/*.scss',
                        '!**/frontend/*.p.scss',
                        '!node_modules/**',
                        '!vendor/**'
                    ],
                    css_publics: [
                        '**/frontend/*.p.css',
                        '!node_modules/*',
                        '!vendor/*'
                    ],
                    css_member: [
                        '**/frontend/*.css',
                        '!**/frontend/*.p.css',
                        '!node_modules/**',
                        '!vendor/**'
                    ]
                },
                vendor: [
                    'vendor/foundation/css/normalize.css',
                    'vendor/foundation/css/foundation.css'
                ]
            },
            views: {
                index: ['./index/index.html'],
                full: [
                    '**/views/*.html',
                    '!vendor/**',
                    '!dist/**'
                ],
                partial: [
                    '**/partials/*.html',
                    '!vendor/**',
                    '!dist/**'
                ]
            },
            imgs: {
                def: [
                    './imgs/**/*.{jpg,png,gif}',
                    './imgs/*.{jpg,png,gif}'
                ],
                svg: [
                    './imgs/*.svg'
                ]
            }
        },

    // LINTING SERVICE
        jshint: {
          options: {
            reporter: require('jshint-stylish'),
            force: true
          },
          dev: ['gruntfile.js', '<%= srcpath.js.app %>']
        },

    // CSS STUFFs
        sass: {
            publics: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['**/frontend/*.p.scss'],
                    dest: '.',
                    ext: '.p.css'
                }]
            },
            member: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '.',
                    src: ['**/frontend/*.scss', '!**/frontend/*.p.scss'],
                    dest: '.',
                    ext: '.css'
                }]
            },
            dev: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: '.',
                    src: ['**/frontend/*.scss'],
                    dest: './dist/assets/css/dev/',
                    ext: '.css'
                }]
            }
        },

        autoprefixer: {
            prefix_css: {
                expand: true,
                src: '**/frontend/*.css',
                dest: '.'
            }
        },

        concat: {
            js_vendor: {
                src: '<%= srcpath.js.vendor %>',
                dest: 'dist/assets/js/vendor.js'
            },
            js_app: {
                src: '<%= srcpath.js.app %>',
                dest: 'dist/assets/js/app.js'
            },
            css_vendor: {
                src: '<%= srcpath.css.vendor %>',
                dest: 'dist/assets/css/vendor.css'
            },
            css_publics: {
                src: '<%= srcpath.css.app.css_publics %>',
                dest: 'dist/assets/css/public.css'
            },
            css_member: {
                src: '<%= srcpath.css.app.css_member %>',
                dest: 'dist/assets/css/member.css'
            }
        },

    // MINIFY STUFFs
        cssmin: {
            minify_css: {
                expand: true,
                src: 'dist/assets/css/*.css',
                dest: '.',
                ext: '.min.css'
            }
        },

        uglify: {
            options: {
                mangle: false
            },
            minify_js: {
                files: {
                    'dist/assets/js/app.min.js' : 'dist/assets/js/app.js',
                    'dist/assets/js/vendor.min.js' : 'dist/assets/js/vendor.js'
                }
            }
        },

        imagemin: {
            minify_imgs: {
                expand: true,
                flatten: true,
                src: '<%= srcpath.imgs.def %>',
                dest: 'dist/assets/imgs'
            }
        },

    // COPY STUFFs
        copy: {
            index_html: {
                expand: true,
                flatten: true,
                src: 'index/index.html',
                dest: 'dist/'
            },
            views_files: {
                expand: true,
                flatten: true,
                src: '<%= srcpath.views.full %>',
                dest: 'dist/views/'
            },
            partial_files: {
                expand: true,
                flatten: true,
                src: '<%= srcpath.views.partial %>',
                dest: 'dist/views/partial/'
            },
            svg_files: {
                expand: true,
                flatten: true,
                src: '<%= srcpath.imgs.svg %>',
                dest: 'dist/assets/imgs/'
            },
            ckeditor: {
                expand: true,
                src: ['vendor/ckeditor/**'],
                dest: 'dist/assets/'
            }
        },

    // CLEANING SERVICE!
        clean: {
            css_files: ['dist/assets/css/.css'],
            js_files: ['dist/assets/js/app.js'],
            index_files: 'dist/index.html',
            views_files: 'dist/views/*.html',
            partial_files: 'dist/views/partial/*.html',
            all_files: 'dist'
        },

    // SPYING SERVICE!
        watch: {
            css_public: {
                files: '<%= srcpath.css.app.publics %>',
                tasks: ['newer:sass:publics', 'concat:css_public'],
                options: {
                    livereload: true
                }
            },
            css_member: {
                files: '<%= srcpath.css.app.member %>',
                tasks: ['newer:sass:member', 'concat:css_member'],
                options: {
                    livereload: true
                }
            },
            js_files: {
                files: '<%= srcpath.js.app %>',
                tasks: ['clean:js_files', 'concat:js_app'],
                options: {
                    livereload: true
                }
            },
            index_files: {
                files: '<%= srcpath.views.index %>',
                tasks: ['copy:index_html'],
                options: {
                    livereload: true
                }
            },
            views_files: {
                files: '<%= srcpath.views.full %>',
                tasks: ['newer:copy:views_files'],
                options: {
                    livereload: true
                }
            },
            partial_files: {
                files: '<%= srcpath.views.partial %>',
                tasks: ['newer:copy:partial_files'],
                options: {
                    livereload: true
                }
            },
            img_files: {
                files: ['<%= srcpath.imgs.def %>'],
                tasks: ['newer:imagemin'],
                options: {
                    livereload: true
                }
            },
            svg_files: {
                files: ['<%= srcpath.imgs.svg %>'],
                tasks: ['newer:copy:svg_files'],
                options: {
                    livereload: true
                }
            }
        },

    // SERVER SERVICE
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ignore: [
                        '.git',
                        'node_modules/**',
                        'vendor/**',
                        '.sass-cache'
                    ]
                }
            }
        },

        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dev: ['nodemon', 'watch'],
            task1: [
                'copy',
                'sass',
                'concat:js_vendor',
                'concat:js_app',
                'concat:css_vendor',
                'imagemin'
            ],
            task2: ['concat:css_publics', 'concat:css_member', 'uglify']
        }
    });


    // load grunt plugin from package.json
    /*
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-sass');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-imagemin');
        grunt.loadNpmTasks('grunt-newer');
        grunt.loadNpmTasks('grunt-autoprefixer');
        grunt.loadNpmTasks('grunt-concurrent');
        grunt.loadNpmTasks('grunt-nodemon');
        grunt.loadNpmTasks('grunt-contrib-watch');
    */

// tasks
    grunt.registerTask('default', ['concurrent']);
    //grunt.registerTask('build', ['clean', 'copy', 'sass', 'autoprefixer', 'concat', 'cssmin', 'uglify', 'newer:imagemin']);
    grunt.registerTask('build', ['clean', 'concurrent:task1', 'concurrent:task2', 'autoprefixer', 'cssmin']);

    grunt.registerTask('dev', ['concurrent']);

};

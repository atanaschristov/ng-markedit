'use strict';
module.exports = function (grunt) {
	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	var config = {
		app: 'src/demo',
		module: 'src/module',
		tests: 'test',
		dist: 'dist',
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: config,
		// Empties folders to start fresh
		clean: {
			options: {
				force: true
			},
			// demo: {
			// 	files: [{
			// 		dot: true,
			// 		src: [
			// 			'<%= config.app %>/images',
			// 		]
			// 	}]
			// },
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			}
		},
		copy: {
			// demo: {
			// 	files: [{
			// 		expand: true,
			// 		dot: true,
			// 		cwd: 'bower_components/emojify.js/dist',
			// 		src: ['images/**/*.*'],
			// 		dest: '<%= config.app %>',
			// 		// flatten: true
			// 	}]
			// },
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: 'bower_components/emojify.js/dist/css',
					src: ['./**/*.*'],
					dest: '<%= config.dist %>/styles/emojify',
					// flatten: true
				}, {
					expand: true,
					dot: true,
					cwd: 'bower_components/highlightjs/styles',
					// use just some chosen fonts
					src: [
						'xcode.css',
						'sunburst.css',
						'school_book.*',
						'monokai_sublime.css',
						'magula.css',
						'ir_black.css',
						'idea.css',
						'googlecode.css',
						'github.css',
						'foundation.css',
						'docco.css',
						'color-brewer.css',
						'agate.css',
						'default.css',
						'ascetic.css'
					],
					dest: '<%= config.dist %>/styles/highlightjs',
					flatten: true
				}]
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			demo: ['Gruntfile.js, <%= config.app %>/**/*.js'],
			dist: ['Gruntfile.js, <%= config.tests %>/**/*.js, <%= config.module %>/**/*.js'],
			// all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
		},

		concat: {
			dist: {
				files: {
					'<%= config.dist %>/ng-markedit.js': [
						// 'bower_components/emojify.js/dist/js/emojify.min.js',
						// 'bower_components/markdown-it/dist/markdown-it.min.js',
						// 'bower_components/markdown-it-footnote/dist/markdown-it-footnote.min.js',
						// 'bower_components/highlightjs/highlight.pack.min.js',
						'<%= config.module %>/ng-markedit.js',
					]
				},
			},
		},
		uglify: {
			dist: {
				files: {
					'<%= config.dist %>/ng-markedit.min.js': ['<%= config.dist %>/ng-markedit.js']
				}
			}
		},

		// karma: {
		// 	unit: {
		// 		options: {
		// 			frameworks: ['jasmine'],
		// 			singleRun: true,
		// 			browsers: ['PhantomJS'],
		// 			files: [
		// 				'node_modules/jasmine-expect/dist/jasmine-matchers.js',
		// 				'bower_components/angular/angular.js',
		// 				'bower_components/angular-mocks/angular-mocks.js',
		// 				'bower_components/lodash/lodash.js',
		// 				'bower_components/moment/moment.js',
		// 				'src/**/*.js',
		// 				'test/**/*.js'
		// 			]
		// 		}
		// 	}
		// },
		// The actual grunt server settings
		// Watches files for changes and runs tasks based on the changed files
		connect: {
			options: {
				port: 9000,
				// open: true,
				livereload: 35729,
				// Change this to '0.0.0.0' to access the server from outside
				hostname: '0.0.0.0',
				// keepalive: true,
			},
			demo: {
				options: {
					middleware: function (connect) {
						return [
							connect().use('/data', connect.static('./')),
							connect().use('/dist', connect.static('./' + config.dist)),
							connect().use('/module', connect.static('./' + config.module)),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static(config.app)
						];
					}
				}
			},
			test: {
				options: {
					open: false,
					port: 9001,
					middleware: function (connect) {
						return [
							connect.static('tests'),
							connect().use('/bower_components', connect.static('./bower_components')),
							connect.static(config.app)
						];
					}
				}
			}
		},
		// Automatically inject Bower components into the HTML file
		wiredep: {
			demo: {
				ignorePath: /^\/|\.\.\/|\.\.\/\.\.\//,
				devDependencies: true,
				src: ['<%= config.app %>/index.html']
			},
			sass: {
				src: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			demo: {
				files: [
					'<%= config.app %>/**/*.js',
					'<%= config.app %>/**/*.html'
				],
				tasks: ['jshint:demo'],
				options: {
					livereload: true,
					interrupt: true
				}
			},
			module: {
				files: [
					'<%= config.module %>/**/*.js',
				],
				tasks: ['build'],
				options: {
					livereload: true,
					interrupt: true
				}
			},
			config: {
				files: ['Gruntfile.js'],
				options: {
					reload: true
				}
			}
		},
	});

	grunt.registerTask('demo', [
		'jshint:demo',
		// 'clean:demo',
		// 'copy:demo',
		'wiredep',
		'connect:demo',
		'watch'
	]);

	grunt.registerTask('build', [
		'jshint:dist',
		'clean:dist',
		'concat:dist',
		'uglify:dist',
		// 'copy:dist',						// 'bower_components/emojify.js/dist/js/emojify.min.js',
		// 'bower_components/markdown-it/dist/markdown-it.min.js',
		// 'bower_components/markdown-it-footnote/dist/markdown-it-footnote.min.js',
		// 'bower_components/highlightjs/highlight.pack.min.js',

	]);

	grunt.registerTask('default', ['build', 'demo']);
};
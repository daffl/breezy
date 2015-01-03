'use strict';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    simplemocha: {
      lib: {
        src: ['test/**/*.test.js']
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      lib: ['lib/**/*.js', '!lib/expression/parser.js', 'Gruntfile.js'],
      test: ['test/**/*.js']
    },
    peg: {
      expression: {
        options: {
          allowedStartRules: ['start', 'expression']
        },
        src: "lib/expression/grammar.pegjs",
        dest: "lib/expression/parser.js"
      }
    },
    release: {},
    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'breezy'
        }
      },

      dist: {
        src: 'lib/breezy.js',
        dest: 'dist/breezy.js'
      }
    },
    watch: {
      scripts: {
        files: ['lib/**/*.js'],
        tasks: ['browserify:dist']
      }
    }
  });

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', [ 'jshint', 'simplemocha' ]);

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-browserify');
};

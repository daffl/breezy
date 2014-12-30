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
        src: "lib/expression/grammar.pegjs",
        dest: "lib/expression/parser.js"
      }
    },
    release: {}
  });

  grunt.registerTask('default', 'test');
  grunt.registerTask('test', [ 'jshint', 'simplemocha' ]);

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-peg');
};

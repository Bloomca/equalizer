module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/*! Created at <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      my_target: {
        files: [{
          expand: true,
          cwd: 'app/js',
          src: '**/*.js',
          dest: 'build/js'
        }]
      }
    },
    copy: {
      main: {
        src: 'app/*',
        dest: 'build/'
      },
      backbone: {
        src: 'bower_components/backbone/backbone.js',
        dest: 'app/vendor/backbone.js'
      },
      jquery: {
        src: 'bower_components/jquery/dist/jquery.min.js',
        dest: 'app/vendor/jquery.min.js'
      },
      underscore: {
        src: 'bower_components/underscore/underscore-min.js',
        dest: 'app/vendor/underscore-min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['copy','uglify']);

};

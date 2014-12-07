module.exports = function (config) {
  config.set({
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-junit-reporter'
    ],
    frameworks: ['mocha'],
    singleRun: false,
    autoWatch: true,
    colors: true,
    reporters: ['dots'],
    browsers: ['PhantomJS'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',

      'node_modules/chai/chai.js',

      'angular-fidem.js',
      'test/*.js'
    ],
    logLevel: config.LOG_ERROR
  });
};
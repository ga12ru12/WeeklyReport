global.Promise = require('promise');


var gulp         = require('gulp');
var browserify   = require('gulp-browserify');
var react        = require('gulp-react');
var babel        = require('gulp-babel');
var babelify     = require('babelify');
var plumber      = require('gulp-plumber');
var less         = require('gulp-less');
var uglify       = require('gulp-uglify');
var minifycss    = require('gulp-clean-css');
var rename       = require('gulp-rename');
var replace      = require('gulp-replace');
var clean        = require('gulp-clean');
var concat       = require('gulp-concat');
var stripDebug   = require('gulp-strip-debug');
var autoprefixer = require('gulp-autoprefixer');
var underscore   = require('underscore');

/***************** CONFIGURATION *****************/
var
  $version = '2.20.0',
  $src = 'source',
  $dst = {
    debug: {
      cfg:    '/config.debug.js',
      dst:    'build/debug',
      locale: 'en-US',
      minify: false
    }
  }
  ;
var $path = {
  babelrc: $src + '/.babelrc',
  css     : [
    $src + '/css/*.css'
  ],
  img     : $src + '/img/**/*',
  html    : $src + '/index.html',
  js      : [
    $src + '/**/*.js',
    $src + '/**/*.jsx',
    '!' + $src + '/config.*.js'
  ],
  removeFiles: [
    '/**/*.js',
    '/**/*.jsx'
  ]
};


/***************** TASK RUN *****************/
var tasks = {
  clean: function( $target ) {
    return gulp.src( $target.dst, {read: false} )
      .pipe(plumber())
      .pipe(clean())
      ;
  },

  makeCss: function( $target ) {
    return gulp.src( $target.css )
      .pipe(plumber())
      .pipe(autoprefixer())
      .pipe(concat('index.css'))
      .pipe(gulp.dest( $target.dst+'/css/' ))
      ;
  },

  copyImage: function( $target ) {
    return gulp.src( $target.img )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst + '/img' ))
      ;
  },

  copyHtml: function( $target ) {
    return gulp.src( $target.html )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  copyScript: function( $target ) {
    return gulp.src( $target.js )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  copyHtaccess: function( $target ) {
    return gulp.src( $target.babelrc )
      .pipe(plumber())
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  makeConfig: function( $target ) {
    return gulp.src( $src + $target.cfg )
      .pipe(plumber())
      .pipe(replace('{{{gulp-version}}}', $version))
      .pipe(replace('{{{gulp-default-locale}}}', $target.locale))
      .pipe(rename({basename: 'config'}))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  makeVersion: function( $target ) {
    return gulp.src($target.dst + '/index.html')
      .pipe(plumber())
      .pipe(replace('{{{gulp-version}}}', $version))
      .pipe(gulp.dest( $target.dst ))
      ;
  },

  react: function( $target ) {
    return gulp.src( $target.dst + '/js/*.jsx' )
      .pipe(plumber())
      .pipe(react({harmony: false, es6module: true}))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  babel: function( $target ) {
    return gulp.src( $target.dst + '/js/*.js' )
      .pipe(plumber())
      .pipe(babel({
        presets: ['es2015', "stage-2"]
      }))
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  browserify: function( $target ) {
    return gulp.src( $target.dst + '/js/index.js' )
      .pipe(plumber())
      .pipe(browserify())
      .pipe(gulp.dest( $target.dst + '/js' ))
      ;
  },

  removeFiles: function( $target ) {
    var removes = [];
    for(var i=0,l=$target.removeFiles.length; i<l; i++) {
      removes.push( $target.dst + $target.removeFiles[i] );
    }
    removes.push( '!' + $target.dst + '/js/index.js' );
    return gulp.src( removes, {read: false} )
      .pipe(plumber())
      .pipe(clean())
      ;
  },

  minifyCss: function( $target ) {
    return gulp.src( $target.dst + '/css/index.css' )
      .pipe(plumber())
      .pipe(minifycss())
      .pipe(gulp.dest( $target.dst + '/css/' ))
      ;
  },

  minifyJs: function( $target ) {
    return gulp.src( $target.dst + '/js/index.js' )
      .pipe(plumber())
      .pipe(uglify())
      .pipe(gulp.dest( $target.dst + '/js/' ))
      ;
  },

  stripDebug: function( $target ) {
    return gulp.src( $target.dst + '/js/index.js' )
      .pipe(plumber())
      .pipe(stripDebug())
      .pipe(gulp.dest( $target.dst + '/js/' ))
      ;
  }
};



/***************** TASK DEFINATION *****************/
underscore.each($dst, function(config, name){
  var target = underscore.extend( $dst[name], $path );
  gulp.task('clean-' + name, function(){
    return tasks.clean(target);
  });
  gulp.task('make-css-' + name, ['clean-' + name], function(){
    return tasks.makeCss(target);
  });
  gulp.task('copy-image-' + name, ['clean-' + name], function(){
    return tasks.copyImage(target);
  });
  gulp.task('copy-html-' + name, ['clean-' + name], function(){
    return tasks.copyHtml(target);
  });
  gulp.task('copy-script-' + name, ['clean-' + name], function(){
    return tasks.copyScript(target);
  });
  gulp.task('copy-htaccess-' + name, ['clean-' + name], function(){
    return tasks.copyHtaccess(target);
  });
  gulp.task('make-config-' + name, ['copy-script-' + name], function(){
    return tasks.makeConfig(target);
  });
  gulp.task('make-version-' + name, ['copy-html-' + name, 'copy-script-' + name], function(){
    return tasks.makeVersion(target);
  });
  gulp.task('react-' + name, ['make-version-' + name], function(){
    return tasks.react(target);
  });
  gulp.task('babel-' + name, ['react-' + name], function(){
    return tasks.babel(target);
  });
  gulp.task('browserify-' + name, ['babel-' + name], function(){
    return tasks.browserify(target);
  });
  gulp.task('clean-tmp-' + name, ['browserify-' + name], function(){
    return tasks.removeFiles(target);
  });

  if(target.minify) {
    gulp.task('minify-css-' + name, ['make-css-' + name], function(){
      return tasks.minifyCss(target);
    });
    gulp.task('minify-js-' + name, ['browserify-' + name], function(){
      return tasks.minifyJs(target);
    });
    gulp.task('strip-debug-' + name, ['minify-js-' + name], function(){
      return tasks.stripDebug(target);
    });
  }
});

var cleanTasks = [];
var makeCssTasks = [];
var copyImageTasks = [];
var copyHtmlTasks = [];
var copyScriptTasks = [];
var copyHtaccessTasks = [];
var makeConfigTasks = [];
var makeVersionTasks = [];
var reactTasks = [];
var babelTasks = [];
var browserifyTasks = [];
var cleanTmpTasks = [];
var minifyCssTasks = [];
var minifyJsTasks = [];
var stripDebugTasks = [];

var MODES = {};
for( var name in $dst ) {
  if(typeof MODES[name] == 'undefined')
    MODES[name] = [];

  cleanTasks.push('clean-' + name);
  MODES[name].push('clean-' + name);

  makeCssTasks.push('make-css-' + name);
  MODES[name].push('make-css-' + name);

  copyImageTasks.push('copy-image-' + name);
  MODES[name].push('copy-image-' + name);

  copyHtmlTasks.push('copy-html-' + name);
  MODES[name].push('copy-html-' + name);

  copyScriptTasks.push('copy-script-' + name);
  MODES[name].push('copy-script-' + name);

  copyHtaccessTasks.push('copy-htaccess-' + name);
  MODES[name].push('copy-htaccess-' + name);

  makeConfigTasks.push('make-config-' + name);
  MODES[name].push('make-config-' + name);

  makeVersionTasks.push('make-version-' + name);
  MODES[name].push('make-version-' + name);

  reactTasks.push('react-' + name);
  MODES[name].push('react-' + name);

  babelTasks.push('babel-' + name);
  MODES[name].push('babel-' + name);

  browserifyTasks.push('browserify-' + name);
  MODES[name].push('browserify-' + name);

  cleanTmpTasks.push('clean-tmp-' + name);
  MODES[name].push('clean-tmp-' + name);

  if($dst[name].minify) {
    minifyCssTasks.push('minify-css-' + name)
    MODES[name].push('minify-css-' + name);

    minifyJsTasks.push('minify-js-' + name)
    MODES[name].push('minify-js-' + name);

    stripDebugTasks.push('strip-debug-' + name)
    MODES[name].push('strip-debug-' + name);
  }
}
gulp.task('clean', cleanTasks);
gulp.task('make-css', makeCssTasks);
gulp.task('copy-image', copyImageTasks);
gulp.task('copy-html', copyHtmlTasks);
gulp.task('copy-script', copyScriptTasks);
gulp.task('copy-htaccess', copyHtaccessTasks);
gulp.task('make-config', makeConfigTasks);
gulp.task('make-version', makeVersionTasks);
gulp.task('react', reactTasks);
gulp.task('babel', babelTasks);
gulp.task('browserify', browserifyTasks);
gulp.task('clean-tmp', cleanTmpTasks);
gulp.task('minify-css', minifyCssTasks);
gulp.task('minify-js', minifyJsTasks);
gulp.task('strip-debug', stripDebugTasks);

for(var name in MODES) {
  gulp.task('build-' + name, MODES[name]);
  gulp.task(name, MODES[name]);
}

gulp.task('build', [
  'clean',
  'make-css', 'copy-image', 'copy-html', 'copy-script', 'copy-htaccess',
  'make-config', 'make-version',
  'react',
  'babel',
  'browserify',
  'minify-css',
  'minify-js',
  'strip-debug',
  'clean-tmp'
]);
gulp.task('default', [
  'clean',
  'make-css', 'copy-image', 'copy-html', 'copy-script', 'copy-htaccess',
  'make-config', 'make-version',
  'react',
  'babel',
  'browserify',
  'minify-css',
  'minify-js',
  'strip-debug',
  'clean-tmp'
]);
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import ScriptTasks from './gulp-tasks/scripts';
import CssTasks from './gulp-tasks/css';
import DevTasks from './gulp-tasks/dev';
import AssetTasks from './gulp-tasks/assets';

let plugins = gulpLoadPlugins({
	pattern: [
		'gulp-*',
		'gulp.*',
		'webpack*',
    'karma'
	]
});

// Script Tasks
let scriptTasks = new ScriptTasks(gulp, plugins);
gulp.task('lint', scriptTasks.lint());
gulp.task('angularLib', scriptTasks.angularLib());
gulp.task('scriptCompile', scriptTasks.scriptCompile());
gulp.task('angularPartials', scriptTasks.angularPartials());
gulp.task('jsTest', scriptTasks.jsTest());

// Css Tasks
let cssTasks = new CssTasks(gulp, plugins);
gulp.task('libCss', cssTasks.libraryCSSDependencies());
gulp.task('sass', ['libCss'], cssTasks.sass());


// Dev Tasks
let devTasks = new DevTasks(gulp, plugins);
gulp.task('watch', devTasks.watch());

// Asset Tasks
let assetTasks = new AssetTasks(gulp, plugins);
gulp.task('icons', assetTasks.icons());

gulp.task('default',
  [
    'lint',
    'angularLib',
    'scriptCompile',
    'jsTest',
    'angularPartials',
    'sass',
    'icons',
    'watch',
  ]
);

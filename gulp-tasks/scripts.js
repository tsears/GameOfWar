export default class ScriptTasks {
  constructor(gulp, plugins) {
    this.gulp = gulp;
    this.plugins = plugins;
  }

  lint() {
    const self = this;
  	return () => {
      return self.gulp.src([
  			'*.js',
  			'js/**/*.js',
        'gulp-tasks/*.js',
        'test/**/*.js',
  			'!**/*.min.js',
  		])
  		.pipe(self.plugins.eslint())
  		.pipe(self.plugins.eslint.format());
    };
  }

  angularLib() {
    const self = this;
    return () => {
    	return self.gulp.src([
  			'node_modules/angular/angular.min.js',
  		])
  		.pipe(self.plugins.concat('nglib.js'))
  		.pipe(self.plugins.uglify({
        preserveComments: 'license'
      }))
  		.pipe(self.gulp.dest('www/js/lib'));
    };
  }

  angularPartials() {
    const self = this;
    return () => {
      return self.gulp.src(['Frontend/**/*.html'])
		  .pipe(self.gulp.dest('wwwroot/ng-partials'));
    };
  }

  scriptCompile() {
    const self = this;
    return () => {
    	return self.gulp.src('js/War.js')
    		.pipe(self.plugins.webpackStream({
            entry: { War: './js/War.js' },
    				module: {
    					loaders: [{
    						loader: 'babel-loader',
    					}]
    				},
    				output: {
    					filename: '[name].js',
              libraryTarget: 'var',
              library: '[name]'
    				},
    				devtool: 'source-map',
    				// plugins: [
    				// 	new self.plugins.webpack.optimize.UglifyJsPlugin({
    				// 		compress: {
    				// 			drop_debugger: false // the linter will warn about the debugger statement, assume it's there intentionally
    				// 		}
    				// 	})
    				// ]
    		}))
    		.pipe(self.plugins.sourcemaps.init())
    		.pipe(self.gulp.dest('dist'))
        .pipe(self.gulp.dest('www/js'))
    		.pipe(self.plugins.sourcemaps.write('.'));
    };
  }

	jsTest() {
		const self = this;

		return (done) => {
			new self.plugins.karma.Server (
				{
					configFile: __dirname + '/../karma.conf.js',
					singleRun: true
				}, (err) => {
					if (!err) {
						done();
					} else {
						done(new self.plugins.util.PluginError('karma', {
							message: `Tests failed (${err})`
						}));
					}
				}).start();
		};
	}
}

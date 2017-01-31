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
  		.pipe(self.plugins.jshint({
  			'esversion': 6
  		}))
  		.pipe(self.plugins.jshint.reporter('default'));
    };
  }

  scriptCompile() {
    const self = this;
    return () => {
    	return self.gulp.src('js/war.js')
    		.pipe(self.plugins.webpackStream({
    				module: {
    					loaders: [{
    						loader: 'babel-loader'
    					}]
    				},
    				output: {
    					filename: 'war.min.js'
    				},
    				devtool: 'source-map',
    				plugins: [
    					new self.plugins.webpack.optimize.UglifyJsPlugin({
    						compress: {
    							drop_debugger: false // the linter will warn about the debugger statement, assume it's there intentionally
    						}
    					})
    				]
    		}))
    		.pipe(self.plugins.sourcemaps.init())
    		.pipe(self.gulp.dest('dist'))
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

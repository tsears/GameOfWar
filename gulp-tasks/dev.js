export default class DevTasks {
  constructor(gulp, plugins) {
    this.gulp = gulp;
    this.plugins = plugins;
  }

  watch() {
    let self = this;
    return () => {
      self.gulp.watch(['js/**/*.js', 'test/**/*.js'], ['lint', 'scriptCompile', 'jsTest']);
      self.gulp.watch(['*.js', 'gulp-tasks/*.js'], ['lint']);
      self.gulp.watch('Frontend/**/*.scss', ['sass']);
      //self.gulp.watch('Frontend/**/*.html', ['angularPartials']);
    };
  }
}

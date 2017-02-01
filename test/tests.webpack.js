var testsContext = require.context('../test', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);

var srcContext = require.context('../js', true, /\.js$/);
srcContext.keys().forEach(srcContext);

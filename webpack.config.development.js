var webpack = require('webpack');
var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

var definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"development"',//process模块用来与当前进程互动，可以通过全局变量process访问
  __DEV__  : true,
  __PROD__ : false,
  __ROOTPATH__: '"/index.php/manage/"'
  //__ROOTPATH__: '"/"'
});

var config= {
  entry:[
  'webpack-dev-server/client?http://localhost:9090', // WebpackDevServer host and port，相当于命令中的--inline
  'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors，相当于命令--hot
  './src/dev-index.js' // Your appʼs entry point
  ],
  output: {
    path: __dirname + '/static/bulid/',
    filename: 'bundle.js',
    publicPath: "http://localhost:9090/assets/",
    chunkFilename: "[name].chunk.js"
  },
  module:{
    noParse: [],
    loaders: [
      { test: /\.jsx?$/,
        exclude: node_modules_dir, 
        loaders: ['react-hot','babel'],//put react-hot before other loader(s)
      },//同时匹配js，jsx
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, loader: 'style!css!less' },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      { test: /\.(png|jpe?g)$/, loader: 'url-loader?limit=8192'}//inline base64 URLs for <=8k images,
    ]
  },
  resolve: {
      root:path.resolve('src'),
      extensions: ['', '.js', '.json', '.jsx'] ,//开启后缀名的自动补全
      alias: {//把用户的一个请求重定向到另一个路径,这样待打包的脚本中的 require('moment'); 其实就等价于 require('moment/min/moment-with-locales.min.js'); 。通过别名的使用在本例中可以减少几乎一半的时间。
        //moment: "moment/min/moment-with-locales.min.js",
        //semantic:"semantic-ui/dist/semantic.min.js"
      }
  },
  externals:{//排除要打包的js，在页面上直接使用script的方式引入
      
  },
  /* webpack官方提供了七种sourceMap模式
   * 具体各自的区别请参考 https://github.com/webpack/docs/wiki/configuration#devtool ，我们这里推荐使用 cheap-source-map
   */
  devtool :'cheap-eval-source-map',//浏览器调试时用,

  plugins: [
    /*new webpack.DllReferencePlugin({
      context: __dirname,//context 需要跟dll中的保持一致，这个用来指导 Webpack 匹配 manifest 中库的路径；
      manifest: require('./manifest.json')
    }),*/
    new webpack.HotModuleReplacementPlugin(),//热部署
    new webpack.ProvidePlugin({//使变量变成全局变量，各个不用单独import
      _: 'lodash',
      //$: "jquery",
      //jQuery: "jquery",
      //"window.jQuery": "jquery",
      Immutable : 'immutable'
    }),
    definePlugin
  ]
};

module.exports = config;



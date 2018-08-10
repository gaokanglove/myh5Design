const webpack = require('webpack');
const path = require('path'); 
const node_modules_dir = path.join(__dirname, 'node_modules');

console.log(path.resolve('./dist'));
// definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
//在控制台里用 NODE_ENV=development webpack 编译
//在代码中, 引用全局变量__DEV__来判断环境
const env = process.env.NODE_ENV || 'production';
const definePlugin = new webpack.DefinePlugin({
  "process.env": { NODE_ENV: JSON.stringify(env)},//process模块用来与当前进程互动，可以通过全局变量process访问
  __DEV__  : false,
  __PROD__ : true,
  __ROOTPATH__: '"/manage/"'
});

//导出css文件
//var extractPlugin=new ExtractTextPlugin('[name].[contenthash].css');

/*主要针对webpack构建任务中有多个入口文件时，
 *而这些文件都require了相同的模块，如果你不做任何事情，webpack 会为每个入口文件引入一份相同的模块，
 *显然这样做，会使得相同模块变化时，所有引入的 entry 都需要一次 rebuild，造成了性能的浪费，
 *CommonsChunkPlugin 可以将相同的模块提取出来单独打包，进而减小 rebuild 时的性能消耗。
 *同时将多个入口文件相同的js打包处一个共同的后，也可以利用缓存，使加载第二页面的时候不需要再加载共同文件
 */
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common', 'common.[hash].js');

/*
const minSize={
    compress: {
        warnings: false
    }
}
var minChunkPlugin=new webpack.optimize.MinChunkSizePlugin(minSize);
*/

module.exports = {
  entry:{ 
    bundle:'./src/index.js'//入口文件
    //vendor: ['jquery','moment','lodash'] //第三方库
  },
  output: {
    path:  './dist',//编译文件输出位置
    filename: '[name].[hash].js',
    publicPath: "static.g.jiaxunyouneng.com/",
    chunkFilename: "chunk.[chunkhash].js"
  },
  module:{
    loaders: [
      { 
        test: /\.jsx?$/,//同时匹配js，jsx
        include: [
          path.join(process.cwd(), './src') // 只去解析运行目录下的src
        ],
        //exclude: /node_modules/, 
        loader: 'babel'
      },
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
  resolve: {//开启后缀名的自动补全
    //root:path.resolve('./dist'),
    //modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.json', '.jsx'], // 现在可以写 require('file') 代替 require('file.coffee')
    alias: {//把用户的一个请求重定向到另一个路径,这样待打包的脚本中的 require('moment'); 其实就等价于 require('moment/min/moment-with-locales.min.js'); 。通过别名的使用在本例中可以减少几乎一半的时间。
      //moment: "moment/min/moment-with-locales.min.js"
    }
  },
  noParse: [/moment-with-locales/],
  /*
  //使用externals，是要再html中使用script标签导入对应的js文件，例如react.min.js，react-dom.min.js
  externals: {
    'react': 'React',// 当代码中使用require('react')时，会使用window.React
    'react-dom': 'ReactDOM'  // 当代码中使用require('react-dom')时，会使用window.ReactDOM
  },
  */
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,//context 需要跟dll中的保持一致，这个用来指导 Webpack 匹配 manifest 中库的路径；
      manifest: require('./manifest.json')
    }),
    new webpack.optimize.OccurenceOrderPlugin(),//它会按引用频度来排序 ID，以便达到减少文件大小的效果。
    new webpack.ProvidePlugin({//使变量变成全局变量，各个不用单独import
      _: 'lodash',
      Immutable : 'immutable'
    }),
    definePlugin
    //commonsPlugin
    //extractPlugin,
    //minChunkPlugin
  ]
};




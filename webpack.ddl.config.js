/*
动态链接库dll的思想，这在 windows 系统下面是一种很常见的思想。一个dll包，就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app 或者业务代码引用的。
Webpack 最近也新加入了这个功能：webpack.DllPlugin。使用这个功能需要把打包过程分成两步：
打包ddl包,引用ddl包，打包业务代码
*/
const path = require('path'); 
const webpack=require('webpack');

const vendors=[
	'react',
	'react-dom',
	'react-router',
	'history',
	'immutable',
	'redux',
	'react-redux',
	'redux-router',
	'redux-thunk',
	'moment',
	'es6-promise',
	'whatwg-fetch',
	'lodash'
];

module.exports={
	entry:{
	    'vendor':vendors,
	},
	output:{
		path:path.join(__dirname, 'dist'),
		filename:'[name].dll.js',//[name]的部分由entry的名字替换
		/**
	     * output.library
	     * 将会定义为 window.${output.library}
	     * 在这次的例子中，将会定义为`window.vendor_library`
	     */
		library:'[name]_library',
	},
	plugins:[
		new webpack.DllPlugin({
			/**
	         * path 定义 manifest 文件生成的位置
	         */
			path:'manifest.json',
			/**
	         * name 是dll暴露的对象名，要跟 output.library 保持一致；
	         * dll bundle 输出到那个全局变量上
	         */
            name: '[name]_library',
			context:__dirname //是解析包路径的上下文，这个要跟接下来配置的 webpack.config.js 一致。
		})
	]
}
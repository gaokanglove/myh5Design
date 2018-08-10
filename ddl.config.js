/*
动态链接库dll的思想，这在 windows 系统下面是一种很常见的思想。一个dll包，就是一个很纯净的依赖库，它本身不能运行，是用来给你的 app 或者业务代码引用的。
Webpack 最近也新加入了这个功能：webpack.DllPlugin。使用这个功能需要把打包过程分成两步：
打包ddl包
引用ddl包，打包业务代码
*/
const webpack=require('Webpack');

const vendors=[
	'react',
	'react-dom',
	'react-router',
	'history',
	'immutable',
	'redux',
	'react-redux',
	'redux-thunk',
	'moment'
];

module.exports={
	output:{
		path:'dist',
		filename:'[name].js',
		library:'[name]',
	},
	entry:{
		'lib':vendors,
	},
	plugins:[
		new webpack.DllPlugin({
			path:'manifest.json',
			name:'[name]',
			context:__dirname,
		})
	]
}
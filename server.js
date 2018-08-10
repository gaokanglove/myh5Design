'use strict'
var express = require('express');
var path = require('path');

//http请求模块
var request= require('request');
request=request.defaults({jar: true});//启用全局cookie

var app = express();
//解析post请求的参数，使用req.body必须要加载该模块
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


//配置静态文件路径,/static表示虚拟路径
app.use('/assets',express.static('src/static'));

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

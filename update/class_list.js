var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update');

debug('读取博文列表');

request('http://blog.sina.com.cn/u/1776757314',function(err,res){
	//console.log(res.body.toString());
	var $ = cheerio.load(res.body);
	var classList = [];
	$('.classList li a').each(function(){
		var $me = $(this);
		var item = {
			name:$me.text(),
			URL:$me.attr('href')
		};
		var s = item.URL.match(/articlelist_\d+_(\d+)_\d\.html/);
		//console.log(s);
		if( Array.isArray(s) ){
			//console.log();
			item.id = s[1];
			classList.push(item);
		}
	});
	console.log(classList);
})

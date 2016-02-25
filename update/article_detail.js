var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update');

debug('读取博客文章内容');

request('http://blog.sina.com.cn/s/blog_69e72a420101gvec.html',function(err,res){
	if( err )
		return console.error(err);
	var $ = cheerio.load(res.body);
	var tags = [];

	$('.articalTag .blog_tag h3 a').each(function(){
		var tag = $(this).text();
		if( tag ){
			tags.push(tag);
		};
	});

	var content = $('.articalContent').html().trim();
	
	console.log({
		tags:tags,
		content:content
	});
})

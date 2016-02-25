var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update');

debug('读取博客文章列表');

function readArticleList(url, cb) {
	request(url, function(err, res) {
		if (err) {
			cb(err);
		} else {
			var $ = cheerio.load(res.body);
			var articleList = [];
			$('.articleList .articleCell').each(function() {
				var $me = $(this);
				var item = {
					title: $me.find('.atc_title a').text(),
					URL: $me.find('.atc_title a').attr('href'),
					time: $me.find('.atc_tm').text()
				};
				var s = item.URL.match(/blog_([a-zA-Z0-9]+)\.html/);
				if (Array.isArray(s)) {
					item.id = s[1];
					console.log(s);
					articleList.push(item);
				}
			});
			var nextPage = $('.SG_pgnext a').attr('href');
			if( nextPage ){
				readArticleList(nextPage,function (err,articleListOther){
					if( err )
						return console.error(err);
					cb(null,articleList.concat(articleListOther));
				})
			} else {
				cb(null,articleList);
			}
		}
	})
}

readArticleList('http://blog.sina.com.cn/s/articlelist_1776757314_0_1.html', function(err, articleList) {
	if (err) {
		console.error(err.stack);
	} else {
		console.log(articleList);
	}
})
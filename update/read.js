var request = require('request');
var cheerio = require('cheerio');
var debug = require('debug')('blog:update:read');
exports.getClassList = function(url, cb) {
	request(url, function(err, res) {
		debug('获取博客目录列表:%s', url);
		if (err)
			cb(err);
		var $ = cheerio.load(res.body);
		var classList = [];
		$('.classList li a').each(function() {
			var $me = $(this);
			var item = {
				name: $me.text(),
				URL: $me.attr('href')
			};
			var s = item.URL.match(/articlelist_\d+_(\d+)_\d\.html/);
			//console.log(s);
			if (Array.isArray(s)) {
				//console.log();
				item.id = s[1];
				classList.push(item);
			}
		});
		cb(null, classList);
	})
};

exports.getArticleList = function(url, cb) {
	var that = this;
	request(url, function(err, res) {
		debug('获取博客文章列表:%s', url);
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
					//console.log(s);
					articleList.push(item);
				}
			});
			var nextPage = $('.SG_pgnext a').attr('href');
			if (nextPage) {
				that.getArticleList(nextPage, function(err, articleListOther) {
					if (err)
						return console.error(err);
					cb(null, articleList.concat(articleListOther));
				})
			} else {
				cb(null, articleList);
			}
		}
	})
}
exports.getArticleDetail = function(url, cb) {
	request(url, function(err, res) {
		debug('获取博客文章内容:%s', url);
		if (err)
			console.log('连接时间超时');
		else {
			var $ = cheerio.load(res.body);
			var tags = [];

			$('.articalTag .blog_tag h3 a').each(function() {
				var tag = $(this).text();
				if (tag) {
					tags.push(tag);
				};
			});

			var content = $('.articalContent').html();
			var a = {
				tags: tags,
				content: content
			};
			//console.log('1111aaa', a);
			cb(null, {
				tags: tags,
				content: content
			});
		}

	})
}
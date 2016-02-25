var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var debug = require('debug')('blog:update');

function readArticleList(url, cb) {
	debug('读取博客文章列表:%s', url);

	request(url, function(err, res) {
		if (err)
			return cb(new Error(err));
		var $ = cheerio.load(res.body.toString());
		var articleList = [];
		$('.articleList .articleCell').each(function() {
			var $me = $(this);
			var item = {
				title: $me.find('.atc_title a').text().trim(),
				time: $me.find('.atc_tm').text().trim(),
				URL: $me.find('.atc_title a').attr('href')
			};
			var s = item.URL.match(/blog_([a-zA-Z0-9]+)\.html/);
			if (Array.isArray(s)) {
				item.id = s[1];
				articleList.push(item);
			};
		});

		var nextPage = $('.SG_pgnext a').attr('href');

		if (nextPage) {
			readArticleList(nextPage, function(err, articleListOther) {
				if (err)
					return console.error(err);
				cb(null, articleList.concat(articleListOther));
			})
		} else {
			cb(null, articleList);
		}
	})
}

function readArticleDetail(url, cb) {
	debug('读取博客文章内容:%s', url);
	request(url, function(err, res) {
		if (err)
			return console.error(err);
		var $ = cheerio.load(res.body.toString());
		var tags = [];
		var content = '';
		$('.blog_tag h3 a').each(function() {
			var tag = $(this).text();
			if (tag) {
				tags.push(tag);
			}
		})
		content = $('.articalContent').html().trim();

		cb(null, {
			tags: tags,
			content: content
		});
	})
}

var url = 'http://blog.sina.com.cn/s/articlelist_1776757314_0_4.html'
readArticleList(url, function(err, articleLists) {
	var a = 0;
	async.eachSeries(articleLists, function(article,next) {
		readArticleDetail(article.URL, function(err, detail) {
			if (err)
				return console.error(err);
			console.log(detail);
			a++
			next();
		})
	}, function(err) {
		if (err)
			return console.error(err);
		console.log(a);
		console.log('完成');
	})
})
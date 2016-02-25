var async = require('async');
var debug = require('debug')('bolg:update:all');
var read = require('./read');
var save = require('./db');
var config = require('./../config');

var classLists;
var articleList = {};
async.waterfall([
	function(callback) {
		//console.log(1);
		read.getClassList(config.sinaBlog.url, function(err, lists) {
			classLists = lists;
			callback(err);
		})
	},
	function(callback) {
		//console.log(2);
		save.saveClassList(classLists, function() {});
		callback(null);
	},
	function(callback) {
		//console.log(3);
		async.eachSeries(classLists, function(item, next) {
			read.getArticleList(item.URL, function(err, list) {
				articleList[item.id] = list;
				//console.log('bb');
				next(err);
			})
		}, function(err) {
			if (err) {
				debug('访问博客列表url失败');
				callback(err);
			} else {
				callback(null);
			}
		})

	},
	function(callback) {
		//console.log('articleLista',articleList);
		async.eachSeries(Object.keys(articleList), function(classId, next) {
			save.saveArticleList(articleList[classId], function() {});
			next();
		}, function(err) {
			if (err) {
				debug('访问博客文章列表url失败');
				callback(err);
			} else {
				callback(null);
			}
		})
	},
	function(callback) {
		async.forEachOf(articleList, function(val, key, cb) {
			console.log(val);
			async.eachSeries(val, function(item, next) {
				read.getArticleDetail(item.URL, function(err, detial) {
					save.saveArticleDetail(detial, function() {});
				})
				next();
			}, function(err) {
				if (err) {
					debug('文章内容存入数据库失败');
					callback(err);
				} else {
					//console.log();
					callback(null);
				}
			})
		}, function(err) {
			if (err) {
				debug('文章列表获取文章url出错');
			}
		})
	}
], function(err) {
	if (err) {
		console.log(err);
	}
})
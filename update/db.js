var mongoose = require('mongoose');
var debug = require('debug')('blog:save');
var config = require('../config.js');
var async = require('async');

var Schema = mongoose.Schema;
var db = mongoose.connect(config.dbSetting.url);
var dbModels = config.dbModels;

db.connection.on('open',function(){
	debug('数据库连接成功');
})

db.connection.on('error',function(err){
	debug('数据库连接失败:%s',err);
})

for( var model in dbModels ){
	mongoose.model(model,new Schema(dbModels[model]));
}

function _getModels (type){
	return mongoose.model(type);
}

//存取博客列表
exports.saveClassList = function(classList,cb){
	debug('保存文章分类列表到数据库中: %d', classList.length);
	async.eachSeries(classList,function(item,next){
		var ClassList = _getModels('classList');
		var classListItem = {
			'classList':item
		};
		ClassList.findOne(classListItem,function(err,doc){
			if( err ){
				cb('查找博客列表出错');
			} else if (!doc){
				ClassList.create(classListItem,function(err,docs){
					if( err )
						cb('存取博客列表失败');
					debug('存取博客列表成功');
					cb(null,docs);
					next();
				})
			} else {
				debug('博客列表重复项未保存');
			}
		})
	},function(err){
		cb(err);
	})
};
//存取文章列表
exports.saveArticleList = function(articleList,cb){
	debug('保存文章列表到数据库中: %d',articleList.length);
	async.eachSeries(articleList,function(item,next){
		var ArticleList = _getModels('articleList');
		var articleListItem = {
			'title':item.title,
			'url':item.url,
			'time':item.time,
			'id':item.id
		};
		ArticleList.findOne(articleListItem,function(err,doc){
			if( err ){
				cb('获取文章列表出错');
			} else if (!doc){
				ArticleList.create(articleListItem,function(err,docs){
					if( err )
						cb('存取章列表失败');
					debug('存取文章列表成功');
					cb(null,docs);
					next();
				})
			} else {
				debug('文章列表重复项未保存');
			}
		})
	},function (err){
		cb(err);
	})
}
//存取文章具体内容
exports.saveArticleDetail = function(articleDetails,cb){
	debug('保存文章具体内容到数据库中');
	var ArticleList = _getModels('articleDetail');
	if( !articleDetails ){
		articleDetails.tags = [];
		articleDetails.content = '';
	}
	var articleDetailItem = {
		'tags': articleDetails.tags,
		'content': articleDetails.content
	};
	ArticleList.findOne(articleDetailItem, function(err, doc) {
		if (err) {
			cb('获取文章内容出错');
		} else if (!doc) {
			//console.log(1);
			ArticleList.create(articleDetailItem, function(err, docs) {
				if (err)
					cb('存取文章内容失败');
				debug('存取文章内容成功');
				cb(null, docs);
			})
		} else {
			debug('文章内容重复项未保存');
		}
	})
}










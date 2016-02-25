var r = require('./read');
var save = require('./db');

r.getArticleDetail('http://blog.sina.com.cn/s/blog_69e72a420102v27c.html',function(err,data){
	//console.log(data.tags);
	save.saveArticleDetail(data, function() {});
})
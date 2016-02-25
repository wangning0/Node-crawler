exports.dbSetting = {
	url:'mongodb://localhost:27017/crawler'
};
exports.sinaBlog = {
	url:'http://blog.sina.com.cn/u/1776757314'
};
exports.dbModels = {
	classList:{
		list:{type:String}
	},
	articleList:{
		title:{type:String},
		url:{type:String},
		time:{type:Date},
		id:{type:String}
	},
	 articleDetail:{
	 	tags:{type:Array},
	 	content:{type:String}
	 }
}
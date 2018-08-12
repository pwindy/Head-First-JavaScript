//Date对象的类实例方法
Date.prototype.dateFormat = function() {
	var month = this.getMonth()+1;
	month = month>=10? month:'0' + month;
	return  month  + '/' + this.getDate() + '/' + this.getFullYear();		
}
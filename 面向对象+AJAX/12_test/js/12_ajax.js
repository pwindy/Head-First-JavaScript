//ajax请求对象  构造函数
function AjaxRequest() {
	if( window.XMLHttpRequest ){
		try{
			this.xml = new XMLHttpRequest();
		}catch(e){
			this.xml = null;
		}
	}else if( window.ActiveXObject ){		
		try{			
			this.xml = new ActiveXObject( 'Msxml2.XMLHTTP.6.0');
		}catch(e){
			try{
				this.xml = new ActiveXObject( 'Msxml2.XMLHTTP.3.0');
			}catch(e){
				this.xml = null;
			}
		}
	}

	if (this.xml == null){
		alert("Ajax error creating the request.\n" + "Details: " + e);
	}
	
}


//ajax请求对象 构造函数的原型
AjaxRequest.prototype.getData = function(type,url,asy,hanleFunction,postData) {
	if(this.xml!=null){
		//清除之前的请求对象
		this.xml.abort();

		//附加一个虚拟参数以覆盖浏览器缓存
		url += "?dummy=" + new Date().getTime();
		console.log(url);
		
		//对象重新请求
		try{
			this.xml.open(type,url,asy);
			this.xml.onreadystatechange = hanleFunction;
			if(type.toLowerCase()=='get'){
				this.xml.send( null );
			}else if(type.toLowerCase()=='post') {		
				this.xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');//请求头	
				this.xml.send( postData );
			}
		}catch(e){
			alert('ajax请求失败！');
		}
	}
}

AjaxRequest.prototype.readyState = function() {
	return this.xml.readyState;
}
AjaxRequest.prototype.status = function() {
	return this.xml.status;
}
AjaxRequest.prototype.responseXML = function() {
	return this.xml.responseXML;
}
AjaxRequest.prototype.responseTEXT = function() {
	return this.xml.responseText;
}

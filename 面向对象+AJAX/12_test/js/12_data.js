	var search = document.getElementById('search');
	var search_go = document.getElementById('search_go');
	var blog = document.getElementById('blog');
	var show_all1 = document.getElementById('showall1');
	var show_all2 = document.getElementById('showall2');
		
	var ajaxRequest = new AjaxRequest();
	var arr_blog = new Array();

	window.onload = function() {
		blog.innerHTML = "<img src='wait.gif' alt='Loading...' />";
		ajaxRequest.getData('GET','ajax/blog.xml',true,hanleFunction);		
	}

	function Blog(body,date,image){
		//Blog对象的实例特性
		this.body = body;
		this.date = date;
		this.image = image;		
	}

	function hanleFunction() {
		if( ajaxRequest.readyState()==4&&ajaxRequest.status()==200 ){
			var xmlData = ajaxRequest.responseXML();
			var name = xmlData.getElementsByTagName('author')[0].firstChild.nodeValue;
			var entry_arr = xmlData.getElementsByTagName('entry');

			//Blog对象的类特性
			Blog.prototype.sign = 'by  ' + name;

			for(var i=0;i<entry_arr.length;i++) {
				var entry = entry_arr[i];
				var body_con = entry.getElementsByTagName('body')[0];
				var date_con = entry.getElementsByTagName('date')[0];
				var image = entry_arr[i].getElementsByTagName('image')[0];
				var image_con = '';
				if(image){
					image_con = image.firstChild.nodeValue;
				}
				arr_blog.push(
					new Blog( getText(body_con),new Date( getText(date_con) ),image_con )
				);
			}	
			show_blog(4);
			show_all1.removeAttribute('disabled');
			show_all2.removeAttribute('disabled');
			search_go.removeAttribute('disabled');			
		}
	}
	//读取标签中的文本内容，标签中的标签的文本内容
	function getText(elem) {
		var text = "";
		if(elem) {
			if(elem.childNodes) {
				for(var i=0;i<elem.childNodes.length;i++){ 
					var child = elem.childNodes[i];
					if (child.nodeValue){
						text += child.nodeValue;
					}else {
						for(var j=0;j<child.childNodes.length;j++) {
							var child_child = child.childNodes[j];
							if(child_child.nodeValue){
								text +=	child_child.nodeValue;
							}else{
								text +=	child_child.childNodes[0].nodeValue;
							}
						}
					}
				}
			}
		}
		return text;	
	}

	//Blog对象的类实例方法
	Blog.prototype.showHTML = function(data) {
		var show_text = '';
		if(data){
			show_text += '<div style="background:#aaa;color:#666">';
		}else{
			show_text += '<div>';
		}
		if(this.image){
			show_text += '<b>' + this.date.dateFormat() +'</b>' + '<img src="' + this.image + '" alt=""/>' + '<p>'+this.body+'</p>' + '<i>'+this.sign+'</i></div>';
		}else{
			show_text += '<b>' + this.date.dateFormat() +'</b>' + '<p>'+this.body+'</p>' + '<i>'+this.sign+'</i></div>';
		}
		return show_text;
	}

	//Blog对象的类实例方法
	Blog.prototype.showOneBlog = function() {
		var show_alert = this.date.dateFormat()  +'     ' + this.body ;
		return show_alert;
	}

	Blog.prototype.toString = function() {
		return "[" + this.date.shortFormat() + "] " + this.body;
	};

	//Blog对象的类方法(只能访问类特性,不能访问类实例方法和实例特性)
	Blog.blogSort = function(x,y) {
		return y.date - x.date;
	}

	//搜索功能
	function search_f() {
		if(search.value==''){
			alert('请在搜索框中输入非空内容');
			return;
		}
		while(blog.firstChild){
			blog.removeChild(blog.firstChild);
		}
		var onoff = false;
		for(var i=0;i<arr_blog.length;i++) {
			var str = arr_blog[i].body.toLocaleLowerCase();
			am = str.indexOf( search.value.toLocaleLowerCase() );
			if( am != -1 ){	
				onoff = true;	
				var show_blog = arr_blog[i].showOneBlog();		
				var p = document.createElement('p');
				p.appendChild( document.createTextNode(show_blog) );			
				blog.appendChild( p );
				continue;
			}
		}
		//搜索失败的情况
		if(!onoff){
			var show_blog = '没有搜索到相关内容。请重新输入搜索内容。';
			blog.appendChild( document.createTextNode(show_blog) );
		}
	}

	//展示内容
	function show_blog(blog_num) {
		arr_blog.sort( Blog.blogSort );//调用Blog.blogSort类方法

		if( !blog_num ){//点击按钮展示全部信息
			blog_num = arr_blog.length;
		}
		var i = 0,show_Text = '';
		while(i<arr_blog.length&&i<blog_num){//i<blog_num只展示部分信息
			show_Text += arr_blog[i].showHTML(i%2==0);//构造函数的方法
			i++;
		}
		blog.innerHTML = decodeURIComponent(show_Text);
	}

	//随机排列
	function random_blog() {
		var random_i = Math.floor( Math.random()*arr_blog.length );
		alert( arr_blog[random_i].showOneBlog() );//构造函数的方法
	}

	show_all1.onclick = function() {show_blog();}
	show_all2.onclick = function() {random_blog();}
	search_go.onclick = function() {search_f();}


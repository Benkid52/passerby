var pagenum=1;
var nowpage=1;
var which = 0;
//兼容浏览器获取非行内样式
function getStyle(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
} 

//管理员登录界面
//ajax判断账号存在，可登录时，将id=container的display改成block
$("#manager_text").blur(function(){
 if($("#manager_text").val() == ""){
  $("#number_warning").html("*账号不能为空"); 
 }
});

$("#manager_in").click(function(){
 if($("#manager_password").val() == ""){
  $("#password_warning").html("*密码不能为空");
 } else if($("#manager_password").val() == "admin" || $("#manager_text").val() == "admin") {
  $("#manager_sign").hide();
  $("#container").show();
 } else {
	$("#password_warning").html("*账号或密码错误");
 }
});


$("#manager_in").click(function(){
	$("#manager_sign").hide();
	$("#container").show();
})
//举报信息处理的显示
$("#report_manager").click(function() {
	which = 1;
	var table = document.getElementById("verbal_abuse");
	table.innerHTML = "";
	nowpage = 1;
	$("#report_page").show();
	$("#imformation_page").hide();
	$("#linechart_show").hide();
	$("#ciclechart_show").hide();
	showIllegal();
})

function showIllegal() {
	$.ajax({
		type:"post",
		url:"/passerby/StatisticsController.do",
		data:{
			"behaviour":4,
			"nowpage":nowpage,
			"num":10
		},
		dataType:"json",
		success:function(data) {
			var table = document.getElementById("verbal_abuse");
			
			pagenum=parseInt(data[0].nums / 10)+1;
			
			var tr = document.createElement("tr");
			var th = document.createElement("th");
			th.innerHTML = "聊天号";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "发送方";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "接收方";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "聊天记录";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "时间";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "原因";
			th.setAttribute("width", "100px");
			tr.appendChild(th);
			th = document.createElement("th");
			th.innerHTML = "操作";
			th.setAttribute("width", "200px");
			tr.appendChild(th);
			
			table.appendChild(tr);
			
			for(var i = 1; i < data.length; i++) {
				var temp = data[i].chatId;
				
				var ad = document.getElementById("outrecord");
				var adi = document.getElementById("report_page");
				
				var div = document.createElement("div");
				div.setAttribute("class","seal");
				div.setAttribute("id","seal" + temp);
				var p = document.createElement("p");
				p.setAttribute("class", "seal_tile");
				p.setAttribute("id","seal_title" + temp);
				p.innerHTML = "您确定要封号吗，请思考清楚!!!"; 
				div.appendChild(p);
				var button = document.createElement("button");
				button.setAttribute("class","seal_submit");
				button.setAttribute("id","seal_submit" + temp);
				button.innerHTML="确定";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","seal_cancel");
				button.setAttribute("id","seal_cancel" + temp);
				button.setAttribute("value","取消"); 
				button.innerHTML="取消";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","seal_close");
				button.setAttribute("id","seal_close" + temp); 
				button.setAttribute("value","关闭");
				button.innerHTML="关闭";
				div.appendChild(button);
				adi.insertBefore(div,ad); 
				
				div = document.createElement("div");
				div.setAttribute("class","warning");
				div.setAttribute("id","warning" + temp);
				p = document.createElement("p");
				p.setAttribute("class", "warning_tile");
				p.setAttribute("id","warning_title" + temp);
				p.innerHTML = "要现在发送警告信息吗？"; 
				div.appendChild(p);
				button = document.createElement("button");
				button.setAttribute("class","warning_submit");
				button.setAttribute("id","warning_submit" + temp);
				button.setAttribute("value","确定");
				button.innerHTML="确定";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","warning_cancel");
				button.setAttribute("id","warning_cancel" + temp);
				button.setAttribute("value","取消");
				button.innerHTML="取消";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","warning_close");
				button.setAttribute("id","warning_close" + temp);
				button.setAttribute("value","关闭");
				button.innerHTML="关闭";
				div.appendChild(button);
				adi.insertBefore(div,ad);
				
				var div = document.createElement("div");
				div.setAttribute("class","seal");
				div.setAttribute("id","delete" + temp);
				var p = document.createElement("p");
				p.setAttribute("class", "seal_tile");
				p.setAttribute("id","delete_title" + temp);
				p.innerHTML = "您确定要删除吗？"; 
				div.appendChild(p);
				var button = document.createElement("button");
				button.setAttribute("class","seal_submit");
				button.setAttribute("id","delete_submit" + temp);
				button.setAttribute("value","确定");
				button.innerHTML="确定";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","seal_cancel");
				button.setAttribute("id","delete_cancel" + temp);
				button.setAttribute("value","取消"); 
				button.innerHTML="取消";
				div.appendChild(button);
				var button = document.createElement("button");
				button.setAttribute("class","seal_close");
				button.setAttribute("id","delete_close" + temp); 
				button.setAttribute("value","关闭");
				button.innerHTML="关闭";
				div.appendChild(button);
				adi.insertBefore(div,ad); 
				
				var tr = document.createElement("tr");
				 
				var td = document.createElement("td");
				td.innerHTML = data[i].chatId;
				tr.appendChild(td);
				
				td = document.createElement("td");
				td.innerHTML = data[i].from_;
				tr.appendChild(td);
				
				td= document.createElement("td");
				td.innerHTML = data[i].to_;
				tr.appendChild(td); 
				
				td= document.createElement("td");
				p = document.createElement("p");
				p.innerHTML = data[i].msg;
				p.setAttribute("title",data[i].msg);
				p.setAttribute("class", "noname");
				td.appendChild(p);
				tr.appendChild(td);  
				
				td= document.createElement("td");
				var year = data[i].date.substr(0,4);
				var month = data[i].date.substr(4,2);
				var day = data[i].date.substr(6,2);
				var date2 = year + "年" + month + "月" + day + "日";
				td.innerHTML = date2;
				tr.appendChild(td);
				
				td= document.createElement("td");
				td.innerHTML = data[i].illegal;
				tr.appendChild(td);
				
				td = document.createElement("td");
				var ntd = document.createElement("td");
				ntd.innerHTML = "封号";
				ntd.setAttribute("class","handle_seal");
				ntd.setAttribute("id", "handle_seal" + temp);
				ntd.setAttribute("chatId", temp);
				ntd.setAttribute("width","65px");
				ntd.onclick = function() {
					var temp2 = this.getAttribute("chatId");
					$("#outrecord").hide();
					$("#seal" + temp2).show();
					$("#seal_submit" + temp2).click(function(){
						$.ajax({
								type:"post",
								url:"/passerby/UserController.do",
								data:{ 
									"behaviour":11,
									"chatId":temp2
								},
								dataType:"json",
								success:function(data) { 
									if(data == true)
										$("#seal_title").html("您已将其封号");
									//else 
									//DOIT *
									$("#report_manager").click();
								}
							})
							// $("#handle_seal").css({"color":"red","font-weight":"600"});
							$("#seal_cancel" + temp2).hide();
							$("#seal_submit" + temp2).hide();
							$("#seal_close" + temp2).show();
						})
					$("#seal_cancel" + temp2).click(function(){
						$("#seal" + temp2).hide();
					})
					$("#seal_close" + temp2).click(function(){
						$("#seal_title" + temp2).html("您确定要封号吗，请思考清楚!!!");
						$("#seal_cancel" + temp2).show();
						$("#seal_submit" + temp2).show();
						$("#seal_close" + temp2).hide();
						$("#seal" + temp2).hide();
					})
					// if($("#handle_seal").attr("color") == "red"){
					// 	return false;
					// }
				}
				td.appendChild(ntd);
				
				var ntd = document.createElement("td");
				ntd.innerHTML = "警告";
				ntd.setAttribute("class","handle_warning");
				ntd.setAttribute("id", "handle_warning" + temp);
				ntd.setAttribute("chatId", temp);
				ntd.setAttribute("width","65px");
				ntd.onclick = function() {
					var temp2 = this.getAttribute("chatId"); 
					$("#outrecord").hide();
					$("#warning" + temp2).show();
					$("#warning_submit" + temp2).click(function(){
						$.ajax({
							type:"post",
							url:"/passerby/UserController.do",
							data:{
								"behaviour":10,
								"chatId":temp2
							},
							dataType:"json",
							success:function(data) {
								if(data == true)
									$("#warning_title").html("您已成功发送警告信息"); 
								//else
								//DOIT *
								$("#report_manager").click();
							}
						})
						// $("#handle_warning").css({"color":"green","font-weight":"600"});
						$("#warning_cancel" + temp2).hide();
						$("#warning_submit" + temp2).hide();
						$("#warning_close" + temp2).show();
					})
					$("#warning_cancel" + temp2).click(function(){
						$("#warning" + temp2).hide();
					})
					$("#warning_close" + temp2).click(function(){
						$("#warning_title" + temp2).html("要现在发送警告信息吗？");
						$("#warning_cancel" + temp2).show();
						$("#warning_submit" + temp2).show();
						$("#warning_close" + temp2).hide();
						$("#warning" + temp2).hide();
					})
					// if($("#handle_warning").attr("color") == "green"){
					// 	return false;
					// }
				}
				td.appendChild(ntd);
				
				
				var ntd = document.createElement("td");
				ntd.innerHTML = "删除";
				ntd.setAttribute("class","handle_delete");
				ntd.setAttribute("id", "handle_delete" + temp);
				ntd.setAttribute("chatId", temp);
				ntd.setAttribute("width","65px");
				ntd.onclick = function() {
					var temp2 = this.getAttribute("chatId");
					$("#outrecord").hide();
					$("#delete" + temp2).show();
					$("#delete_submit" + temp2).click(function(){
						$.ajax({
								type:"post",
								url:"/passerby/UserController.do",
								data:{ 
									"behaviour":12, 
									"chatId":temp2
								}, 
								dataType:"json", 
								success:function(data) { 
									if(data == true)
										$("#delete_title").html("成功");
									//else 
									//DOIT *
									$("#report_manager").click();
								}
							})
							// $("#handle_seal").css({"color":"red","font-weight":"600"});
							$("#delete_cancel" + temp2).hide();
							$("#delete_submit" + temp2).hide();
							$("#delete_close" + temp2).show();
						})
					$("#delete_cancel" + temp2).click(function(){ 
						$("#delete" + temp2).hide();
					})
					$("#delete_close" + temp2).click(function(){
						$("#delete_title" + temp2).html("您确定要封号吗，请思考清楚!!!");
						$("#delete_cancel" + temp2).show();
						$("#delete_submit" + temp2).show();
						$("#delete_close" + temp2).hide();
						$("#delete" + temp2).hide();
					})
				}
				td.appendChild(ntd);
				
				tr.appendChild(td);
				
				table.appendChild(tr);
			}
		}
	})
}
$("#statistics_manager").click(function() {
	setTimeout("showSta()", 10);
	$(".statistics li").click(function() {
		return false;
	})
})
//显示隐藏二级导航栏的函数
function showSta() {
	$(".statistics").show();
}

function hideSta() {
	$(".statistics").hide();
}
function showinfo(){
	$.ajax({
		type: "GET",
		url: "/passerby/StatisticsController.do",
		data: {
			"behaviour": 3,
			"nowpage":nowpage,
			"num":10
		},
		dataType: "json",
		success: function(data) {
			var imfo=document.getElementById("imformation_check");
			pagenum=parseInt(data[0].nums / 10)+1;
			$("#page_total").html(pagenum);
			//首行
			var tr = document.createElement("tr");
			
			var th = document.createElement("th");
			th.innerHTML = "账号";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="昵称";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="性别";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="注册时间";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="学校";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="学院";
			tr.appendChild(th);
			
			var th= document.createElement("th");	
			th.innerHTML ="专业";
			tr.appendChild(th);
			imfo.appendChild(tr);
			
			for(var i = 1; i < data.length; i++){
				var tr = document.createElement("tr");
				
				var td = document.createElement("th");
				td.setAttribute("id", "account_");
				td.innerHTML = data[i].account;
				tr.appendChild(td);
				
				var td= document.createElement("td");	
				td.setAttribute("id", "nickname");
				td.innerHTML =data[i].fakename;
				tr.appendChild(td);
				
				var td= document.createElement("td");
				td.setAttribute("id", "check_sex" );
				td.innerHTML =data[i].sex;
				tr.appendChild(td);
				
				var td= document.createElement("td");
				td.setAttribute("id", "updatetime");
				td.innerHTML =data[i].redate;
				tr.appendChild(td);
				
				var td= document.createElement("td");
				td.setAttribute("id", "check_school" );
				td.innerHTML =data[i].school;
				tr.appendChild(td);
				
				var td= document.createElement("td");
				td.setAttribute("id", "check_college");
				td.innerHTML =data[i].college;
				tr.appendChild(td);
				
				var td= document.createElement("td");
				td.setAttribute("id", "check_major" );
				td.innerHTML =data[i].major;
				tr.appendChild(td);
				
				imfo.appendChild(tr);
			}
			
		},error: function(err) {
			alert(err.status);
		}
	});
}
//showinfo();
//换页
$("#left_arrow").click(function() {
	var imfo=document.getElementById("imformation_check");
	imfo.innerHTML="";
	if(1<nowpage){
		nowpage--;
	}
	if(which == 2) showinfo();
	else showIllegal();
})
$("#right_arrow").click(function() {
	var imfo=document.getElementById("imformation_check");
	imfo.innerHTML="";
	if(nowpage<pagenum){
		nowpage++;
	}
	if(which == 2) showinfo();
	else showIllegal();
})

//跳转
$("#page_jump").click(function() {
	var imfo=document.getElementById("imformation_check");
	imfo.innerHTML="";
	var page=document.getElementById("page_text1").value;
	if(0<page&&page<=pagenum){
		nowpage=page;
	}
	if(which == 2) showinfo();
	else showIllegal();
})

//显示和隐藏个人信息界面
$("#personal_imformation").click(function() {
	which = 2;
	var imfo=document.getElementById("imformation_check");
	imfo.innerHTML = "";
	nowpage = 1;
	$("#imformation_page").show();
	$("#report_page").hide();
	$("#linechart_show").hide();
	$("#ciclechart_show").hide();
	showinfo();
})


$("#record_cancel").click(function() {
	$("#outrecord").hide();
})

$(document).ready(function() {
	var reportChat = document.querySelectorAll("#report_chat");
	var handelSeal = document.querySelectorAll("#handle_seal");
	var handelWarning = document.querySelectorAll("#handle_warning");
	var handleDelete=document.querySelectorAll("#handle_delete");
	for(var i = 0;i <= $("#report_page tr").length -2;i++){
		reportChat[i].onclick = function(){
			$("#outrecord").show();
		}
		handleDelete[i].onclick = function(){
			$(this).parent().remove();
		}
	
		handelWarning[i].onclick = function(){

		}
	}
})



//折线统计图
$("#brokenLine").click(function() {
	$(".statistics").hide();
	$("#linechart_show").show();
	$("#ciclechart_show").hide();
	$("#imformation_page").hide();
	$("#report_page").hide();
	$.ajax({   
				type: "GET",
				url: "/passerby/StatisticsController.do",
				data: {
					"behaviour": 0
				},
				dataType: "json",
				success: function(data) {
					//假数据
					//x表示标签名字,每四十就是一个新标签,y代表选择该标签的人数
					//后台给数据y就可以
					var TagData = [{ 
						   tagName: "学习",
						   x: 40,
						   y: data.study* 50
						  },
						  {
						   tagName: "健身",
						   x: 80,
						   y: data.bodybuilding * 50
						  },
						  {
						   tagName: "唱歌",
						   x: 120,
						   y: data.sing * 50
						  },
						  {
						   tagName: "听歌",
						   x: 160,
						   y: data.listing * 50
						  },
						  {
						   tagName: "舞蹈",
						   x: 200,
						   y: data.dance * 50
						  },
						  {
						   tagName: "吃鸡",
						   x: 240,
						   y: data.eatchicken * 50
						  },
						  {
						   tagName: "考研",
						   x: 280,
						   y: data.graduate * 50
						  },
						  {
						   tagName: "王者",
						   x: 320,
						   y: data.king * 50
						  },
						  {
						   tagName: "漫画",
						   x: 360,
						   y: data.carton * 50
						  },
						  {
						   tagName: "动漫",
						   x: 400,
						   y: data.animation * 50
						  },
						  {
						   tagName: "电影",
						   x: 440,
						   y: data.movie * 50
						  },
						  {
						   tagName: "cosplay",
						   x: 440,
						   y: data.cosplay * 50
						  },
						  {
						   tagName: "电视剧",
						   x: 480,
						   y: data.television * 50
						  },
						  {
						   tagName: "看书",
						   x: 520,
						   y: data.book * 50
						  },
						  {
						   tagName: "绘画",
						   x: 560,
						   y: data.paint * 50
						  },
						  {
						   tagName: "摄影",
						   x: 600,
						   y: data.shotshadow * 50
						  },
						  {
						   tagName: "吃货",
						   x: 640,
						   y: data.eatgood * 50
						  },
						  {
						   tagName: "手工",
						   x: 680,
						   y: data.handattack * 50
						  },
						  {
						   tagName: "追星",
						   x: 720,
						   y: data.runstar * 50
						  },
						  {
						   tagName: "旅行",
						   x: 760,
						   y: data.travel * 50
						  },
						  {
						   tagName: "羽毛球",
						   x: 800,
						   y: data.birdball * 50
						  },
						  {
						   tagName: "夜跑",
						   x: 840,
						   y: data.nightrun * 50
						  },
						  {
						   tagName: "足球",
						   x: 880,
						   y: data.soccer * 50
						  },
						  {
						   tagName: "撸猫",
						   x: 920,
						   y: data.neco * 50
						  },
						  {
						   tagName: "文学",
						   x: 960,
						   y: data.artstudy * 50
						  },
						  {
						   tagName: "K歌",
						   x: 1000,
						   y: data.ksing * 50
						  },
						  {
						   tagName: "养植物",
						   x: 1040,
						   y: data.plant * 50
						  },
						  {
						   tagName: "养生",
						   x: 1080,
						   y: data.alive * 50
						  },
						 ];
					var lineChart = new LineChart();
					lineChart.init(TagData);
					
				},
				error: function(err) {
					alert(err.status);
				}
			})
	
})

//构造折线图函数
var LineChart = function(ctx) {
	//获取工具
	this.ctx = ctx || document.querySelector("#linechart").getContext("2d");
	this.canvasWidth = this.ctx.canvas.width;
	this.canvasHeight = this.ctx.canvas.height;
	//网格的大小
	this.gridSize = 20;
	//箭头的大小
	this.arrowSize = 10;
	//坐标间距
	this.space = 20;
	//绘制点大小
	this.dottedSize = 6;
	//坐标原点
	this.x0 = this.space;
	this.y0 = this.canvasHeight - this.space;
}
//行为方法
LineChart.prototype.init = function(TagData) {
	this.drawGrid();
	this.drawAxis();
	this.drawDotteds(TagData);
};
LineChart.prototype.drawGrid = function() {
	//x方向的线
	var xLineTotal = Math.floor(this.canvasHeight / this.gridSize);
	for (var i = 0; i < xLineTotal; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(0, i * this.gridSize);
		this.ctx.lineTo(this.canvasWidth, i * this.gridSize);
		this.ctx.strokeStyle = "#aaa";
		this.ctx.stroke();
	}
	//y方向的线
	var yLineTotal = Math.floor(this.canvasWidth / this.gridSize);
	for (var i = 0; i < yLineTotal; i++) {
		this.ctx.beginPath();
		this.ctx.moveTo(i * this.gridSize, 0);
		this.ctx.lineTo(i * this.gridSize, this.canvasHeight);
		this.ctx.strokeStyle = "#aaa";
		this.ctx.stroke();
	}
};
LineChart.prototype.drawAxis = function() {
	//x轴
	this.ctx.beginPath();
	this.ctx.strokeStyle = "black";
	this.ctx.moveTo(this.x0, this.y0);
	this.ctx.lineTo(this.canvasWidth - this.space, this.y0);
	this.ctx.lineTo(this.canvasWidth - this.space - this.arrowSize, this.y0 + this.arrowSize / 2);
	this.ctx.lineTo(this.canvasWidth - this.space - this.arrowSize, this.y0 - this.arrowSize / 2);
	this.ctx.lineTo(this.canvasWidth - this.space, this.y0);
	this.ctx.stroke();
	this.ctx.fill();
	//y轴
	this.ctx.beginPath();
	this.ctx.strokeStyle = "black";
	this.ctx.moveTo(this.x0, this.y0);
	this.ctx.lineTo(this.space, this.space);
	this.ctx.lineTo(this.space + this.arrowSize / 2, this.arrowSize + this.space);
	this.ctx.lineTo(this.space - this.arrowSize / 2, this.arrowSize + this.space);
	this.ctx.lineTo(this.space, this.space);
	this.ctx.stroke();
	this.ctx.fill();
};
//绘制点的函数
LineChart.prototype.drawDotteds = function(TagData) {
	var that = this;
	//记录当前坐标
	var prevCanvasX = 0;
	var prevCanvasY = 0;
	TagData.forEach(function(item, i) {
		//数据在canvas上的坐标
		var canvasX = that.x0 + item.x;
		var canvasY = that.y0 - item.y;
		//给点加上标签名字
		that.ctx.textAlign = "left";
		that.ctx.stroke();
		that.ctx.textBaseline = "top";
		that.ctx.font = "16px mictosoft YaHei"
		that.ctx.fillStyle = "black";
		that.ctx.fillText(item.tagName, canvasX, canvasY - 10);
		//绘制点
		that.ctx.beginPath();
		that.ctx.moveTo(canvasX - that.dottedSize / 2, canvasY - that.dottedSize / 2);
		that.ctx.lineTo(canvasX + that.dottedSize / 2, canvasY - that.dottedSize / 2);
		that.ctx.lineTo(canvasX + that.dottedSize / 2, canvasY + that.dottedSize / 2);
		that.ctx.lineTo(canvasX - that.dottedSize / 2, canvasY + that.dottedSize / 2);
		that.ctx.closePath();
		that.ctx.fill();
		//点的连线
		if (i == 0) {
			that.ctx.beginPath();
			that.ctx.moveTo(that.x0, that.y0);
			that.ctx.lineTo(canvasX, canvasY);
			that.ctx.stroke();
		} else {
			that.ctx.beginPath();
			that.ctx.moveTo(prevCanvasX, prevCanvasY);
			that.ctx.lineTo(canvasX, canvasY);
			that.ctx.stroke();
		}
		//每次给当前点重新赋值
		prevCanvasX = canvasX;
		prevCanvasY = canvasY;
	})
};




//绘制饼状图函数
var CicleChart = function(ctx) {
	//获取工具
	this.ctx = ctx || document.querySelector("#ciclechart").getContext("2d");
	this.w = this.ctx.canvas.width;
	this.h = this.ctx.canvas.height;
	//圆心
	this.x0 = this.w / 2;
	this.y0 = this.h / 2;
	//圆的半径
	this.radius = 150;
	//确定圆多出的线的长度
	this.outline = 20;
};
//饼状图的行为方法
CicleChart.prototype.init = function(reportData) {
	this.drawCicle(reportData);
	this.CicleTitle();
	this.CicleTranslte();
};
//画圆方法
CicleChart.prototype.drawCicle = function(reportData) {
	var that = this;
	var angleList = that.transformAngle(reportData);
	//记录起始弧度
	var startAngle = 0;
	angleList.forEach(function(item, i) {
		var endAngle = startAngle + item.angle;
		that.ctx.beginPath();
		that.ctx.moveTo(that.x0, that.y0);
		that.ctx.arc(that.x0, that.y0, that.radius, startAngle, endAngle);
		var color = that.ctx.fillStyle = that.getRandomColor();
		that.ctx.fill();
		that.CicleTitle(startAngle, item.angle, color, item.title);
		that.CicleTranslte(startAngle, endAngle);
		startAngle = endAngle;
	})
};
//画标题方法
CicleChart.prototype.CicleTitle = function(startAngle, angle, color, title) {
	//绘制指向线
	var edge = this.radius + this.outline;
	var edgeX = Math.cos(startAngle + angle / 2) * edge;
	var edgeY = Math.sin(startAngle + angle / 2) * edge;
	var outX = this.x0 + edgeX;
	var outY = this.y0 + edgeY;
	this.ctx.beginPath();
	this.ctx.moveTo(this.x0, this.y0);
	this.ctx.lineTo(outX, outY);
	this.ctx.strokeStyle = color;
	this.ctx.stroke();
	//测量文字长度
	this.ctx.font = "16px Microsoft YaHei";
	var textWidth = this.ctx.measureText(title).width;
	//画文字和下划线
	if (outX > this.x0) {
		this.ctx.lineTo(outX + textWidth, outY);
		this.ctx.textAlign = "left";
	} else {
		this.ctx.lineTo(outX - textWidth, outY);
		this.ctx.textAlign = "right";
	}
	this.ctx.stroke();
	this.ctx.textBaseline = "bottom";
	this.ctx.fillStyle = "black";
	this.ctx.fillText(title, outX, outY);
};
//给每一块扇形加事件
CicleChart.prototype.CicleTranslte = function(starAngle, endAngle) {
	$("#ciclechart_show").hover(function() {
		var x = event.offsetX;
		var y = event.offsetY;
	});

};
//转换弧度
CicleChart.prototype.transformAngle = function(reportData) {
	var total = 0;
	//计算总人数
	reportData.forEach(function(item, i) {
		total += item.number;
	})
	//计算弧度
	reportData.forEach(function(item, i) {
		var angle = item.number / total * (Math.PI * 2);
		//再将装换好的弧度给reportData方便调用
		item.angle = angle;
	})
	return reportData;
};

//生成随机颜色的方法
CicleChart.prototype.getRandomColor = function() {
	var r = Math.floor(Math.random() * 255);
	var g = Math.floor(Math.random() * 255);
	var b = Math.floor(Math.random() * 255);
	return "rgb(" + r + "," + g + "," + b + ")";
};

//饼状统计图
$("#reportCicle").click(function() {
	$(".statistics").hide();
	$("#ciclechart_show").show();
	$("#linechart_show").hide();
	$("#imformation_page").hide();
	$("#report_page").hide();
	 $.ajax({
	 			type: "GET",
	 			url: "/passerby/StatisticsController.do",
	 			data: {
	 				"behaviour": 1
	 			},
	 			dataType: "json",
	 			success: function(data) {
	 				//举报的数据，number是该举报类型的人数
	 				var reportData = [{
								 		title: "言语辱骂",
								 		number: data.speakfuck
								 	},
								 	{
								 		title: "挑逗信息",
								 		number: data.speaksex
								 	},
								 	{
								 		title: "海王",
								 		number: data.findgirls
								 	},
								 	{
								 		title: "垃圾广告",
								 		number: data.rubbish
								 	},
								 	{
								 		title: "恶意骚扰",
								 		number: data.youaresao
								 	},
								 	{
								 		title: "信息咋骗",
								 		number: data.cheat
								 	}];
	 				var cicleChart = new CicleChart();
	 				cicleChart.init(reportData);
	 			},
	 			error: function(err) {
	 				//alert(err.status);
	 			}
	 		})
})





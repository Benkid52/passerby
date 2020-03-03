var option = 0; //选择  0表示个人  1表示交友
var account = $.cookie("socialUtilAccount"); //账号
var tagnum=-1;//标签个数
var tagtime=0;//标签轮数
var ntags="";//传送标签
var grade; //入学年份
var email = ""; //邮箱
var age; //年龄
var friendaccount=""//朋友的id
var signature = ""; //修改签名 
var birthday = ""; //生日 
var chataccount="";
var host = document.location.host; //地址
var taghaving=0;
var which = 0;		//聊天 
var fromwho;  
var mesnum=0;  //接受的请求
var chat_having;
var warnnum = 0;
var chatTime = "";
//未登录时返回登录页面
 if(account == "" || account == null) {  
		window.location.href = "/passerby/matching.html"; 
 } else {
	 getPage();
	 friends();
	 /*聊天部分*/
	 if ("WebSocket" in window) { 
	 	websocket = new WebSocket("ws://" + host + "/passerby/Chat/" + account);
	 } else {
	 	alert("不支持websocket");
	 }
	 websocket.onerror = function() {
	 	alert("错误");
	 }
	 websocket.onopen = function() {}
	 websocket.onmessage = function(e) {
	 	var message = e.data;
	 	temp = message.split(",",5);
		
	 	if (temp[0] == "admin") {
	 		if (temp[1] == "举报成功") { //举报
	 			alert(temp[1]);
	 		} else if(temp[1]=="同意与否") { //加时
	 			if (temp[2] =="同意") {
	 				addtime();
	 			} else {
	 				
	 			}
	 		}else{
	 			if(temp[1]=="对方已下线"){
	 				alert("对方已下线");
	 			}else{
	 				$("#add_time_request").show();
	 				
	 			}
	 		}
	 	} else if(temp[0] =="chat_request"){ 
			if(temp[1]=="对方已下线"){
				alert("对方已下线");
			}else if(temp[2]=="申请聊天"){//申请聊天	
				take(temp[1]);
				$("#remind").show();
				$id("remind_name").innerHTML=temp[3];
				$("#chat_about").children("#friend_name_show").children("#show_name").html($("#remind_name").html());
				$("#remind_talk").show();
				$("#remind_number").html(++mesnum);
				$("#remind_title").hide();
				$("#friend_photo").attr("src","data:img/png;base64,"+temp[4]);
				having(temp[1]);
			}else if(temp[1]=="同意与否") { //聊天
	 			if (temp[2] == "同意") {
					$("#chat_request").show();
					$("#request").html("对方接受了你的聊天请求");
					$("#request_submit").hide();
					$("#request_cancel").hide();
					$("#request_close").show();
					
	 				$("#chat_about").show();
	 				if (interval) {
	 					clearInterval(interval);
	 				}
	 				interval = setInterval("timeLow()", 1000);
					$("#chat_about").children("#friend_name_show").children("#show_name").text($("#another_message" + which).children("#friend_message").children("#friend_introduce").children("#friend_name").html());
	 			} else {
					$("#chat_request").show();
					$("#request").html("对方拒绝了您的聊天");
					$("#request_submit").hide();
					$("#request_cancel").hide();
					$("#request_close").show();
					
	 			}
			}
		}else if (temp[0] == "friend") {
	 		if (temp[1] == "对方已下线") { //加好友
	 			alert(temp[1]);
	 		}else if(temp[2]=="申请好友") { //申请
				$("#add_friend_request").show();
	 		}else if(temp[1]=="同意与否"){
	 			if(temp[2]=="同意"){
					$("#chat_request").show();
					$("#request").html("你和对方已成为好友");
					$("#request_submit").hide();
					$("#request_cancel").hide();
					$("#request_close").show();
					friends();
				}else{
					$("#chat_request").show();
					$("#request").html("对方拒绝了你的好友请求");
					$("#request_submit").hide();
					$("#request_cancel").hide();
					$("#request_close").show();
				}if(temp[2]=="我同意"){
					$("#chat_request").show();
					$("#request").html("你和对方已成为好友");
					$("#request_submit").hide();
					$("#request_cancel").hide();
					$("#request_close").show();
					friends();
				}
	 		}else{
				$("#add_friend").hide();
				$("#chat_request").show();
				$("#request").html("对方已是你的好友");
				$("#request_submit").hide();
				$("#request_cancel").hide();
				$("#request_close").show();
			}
	 	}else if(temp[0] =="chat_no"){
			if(temp[1]=="对方已下线"){
				alert("对方已下线");
			}else if(temp[1]=="关闭聊天"){//申请聊天	
				having(temp[2]);
				$("#chat_about").hide();
				$id("chat_warning").style.display = "none";
				$id("time_chat").style.color = "grey"
				var timeChat = document.getElementById("time_chat");
				chat_about.style.display = "none";
				clearInterval(interval);
				time = 300;
				timeChat.innerHTML = time;
				$("#chat_request").show();
				$("#request").html("对方结束了与您的聊天");
				$("#request_submit").hide();
				$("#request_cancel").hide();
				$("#request_close").show();
				getfriend();
			}
		} else if(temp[0] == "warn") {		//警告
			var time = "";
			time = temp[1].substr(0,4) + "年" + temp[1].substr(5,2) + "月" + temp[1].substr(8,2) + "日";
			var warnEmail = $id("black_dashed");
			var ndiv = document.createElement("div");
			ndiv.setAttribute("height","100px");
			ndiv.setAttribute("class","email_look");
			ndiv.setAttribute("id","email_look" + warnnum);
			var np = document.createElement("p");
			np.setAttribute("class","look_hello");
			np.setAttribute("id","look_hello" + warnnum);
			np.innerHTML = "违规通知";
			ndiv.appendChild(np);
			np = document.createElement("p");
			np.setAttribute("class","email_content");
			np.setAttribute("id","email_content" + warnnum);
			np.innerHTML = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp你于" + time + "被举报，在此警告，请注意自身言行，多谢配合。";
			np.setAttribute("style","word-wrap:break-word;");
			ndiv.appendChild(np);
			var img = document.createElement("img");
			img.setAttribute("class","icon_emailmore");
			img.setAttribute("id","icon_emailmore" + warnnum);
			img.src = "../img/more.png";
			img.setAttribute("title","点击显示更多内容");
			var temp = warnnum;
			img.onclick = function() {
				$("#email_look" + temp).css("height","300px");
				$("#icon_emailmore" + temp).hide();
				$("#email_content" + temp).css({
					"overflow": "visible",
					"overflow-X": "hidden",
					"white-space":"normal",
					"width":"400px"
				});
				$("#email_back").show();
				$("#email_close").hide(); 
			} 
			ndiv.appendChild(img); 
			warnEmail.appendChild(ndiv);  
			warnnum++;
		} else { 
	 		var date = temp[0];
	 		var fromwho = temp[1];
	 		var to = temp[2];
	 		var msg = temp[3];
	 		//发送到屏幕
	 		if (fromwho == account) { //发送方
				var myImg = document.createElement("img");
				var newTxt = document.createElement("p");
				var myDIV=document.createElement("div");
				newTxt.setAttribute("class", "my_content");
				newTxt.setAttribute("chatTime",date);
				myImg.setAttribute("class", "my_photo"); 
				myDIV.setAttribute("class", "my");
	 			var stringFilter = StringFilter(msg);
	 			newTxt.innerHTML = stringFilter;
	 			myDIV.appendChild(myImg);
				myDIV.appendChild(newTxt);
				talk_contact.appendChild(myDIV);
				$(".my_photo").attr("src",$id("head_show").src);
				$id("txt").value=""; 
	 			newTxt.scrollIntoView();				
	 		} else { //接收方
	 			$("#empty_warning").hide();
	 			//个人头像
				var friendDIV=document.createElement("div");
	 			var personPhoto = document.createElement("img");
	 			var personContent = document.createElement("p");
	 			personPhoto.setAttribute("class", "friend_photo");
	 			personContent.setAttribute("class", "person_content");
				personContent.setAttribute("chatTime",date);
				personContent.ondblclick = function() {
					    $("#report_choose").show();
						chatTime = this.getAttribute("chatTime");
				}
				friendDIV.setAttribute("class", "friend");
	 			$("#empty_warning").hide();
				var stringFilter = StringFilter(msg);
				personContent.innerHTML = stringFilter;
	 			friendDIV.appendChild(personPhoto);
				friendDIV.appendChild(personContent);
				talk_contact.appendChild(friendDIV);
				$(".friend_photo").attr("src",$id("friend_photo").src);
				personContent.scrollIntoView();
	 		}
	 	}
	 }
	 websocket.onclose = function() {}
	 //窗口关闭
	 window.onbeforeunload = function() {
	 	websocket.close();
	 }

	 //按enter+ctrl发送消息
	 $id("txt").onkeydown=function enterCtrl(event){
	 	if (event.ctrlKey && event.keyCode == 13)
	 		give();
	 }

	 $id("sendMsg").onclick=give;
 }


//获取ID所对应的元素
function $id(id) {
	return document.getElementById(id);
}

function take(who){
	fromwho=who;
}
function having(who){
	chat_having=who;
}
function addtime(){
	time=time+300;
}

//让所有点击显示的图层都隐藏
function divNone() {
	$("#set_1").hide();
	$("#set_2").hide();
	$("#set_3").hide();
	$("#change_photo").hide();
	$("#chat_about").hide();
	$("#choose_friend").hide();
	$("#self_tag").hide();
	$("#save_tag").hide();
	$("#cover_scroll1").hide();
	$("#cover_scroll2").hide();
	$("#cover_scroll3").hide();
	$("#friend_list").hide();
	$("#email_contact").hide();
}
//获取好友信息
function friends(){
	$.ajax({
		type: "GET",
		url: "/passerby/UserController.do",
		data: {
			"behaviour": 5,
			"account": account
		},
		dataType: "json",
		success: function(data) {
			for(var i=0;i<data.length;i++){
				var head=data[i].head;
				var friend_list=document.getElementById("friend_list");
				var list_show=document.createElement("div");
				list_show.setAttribute("id","list_show");
				
				var list_photo = document.createElement("img");
				list_photo.setAttribute("id","list_photo");
				list_photo.setAttribute("title",data[i].friendid);
				
				var list_name = document.createElement("p");
				list_name.setAttribute("id","list_name");
				list_name.setAttribute("title",data[i].fakename);
				list_photo.setAttribute("src", "data:img/png;base64," + head);
				list_name.innerHTML=data[i].fakename;
				
				
				
				list_show.appendChild(list_photo);
				list_show.appendChild(list_name);
				
				friend_list.appendChild(list_show);
			}
		},
			error: function(err) {
				//alert(err.status);
			}
		})
}
//获取页信息
function getPage() {
	var school_name = $("#school_name"); //学校
	var college_name = $("#college_name"); //学院
	var major_name = $("#major_name"); //专业
	var sex_img = $id("sex_img"); //性别
	var personal = $id("personal"); //个性签名
	var name = $("#name"); //昵称
	var head_show = $("#head_show"); //头像
	var sex = "";
	var all_dynamic = $("#all_dynamic");
	var ID= $("#ID");
	$.ajax({
		type: "GET",
		url: "/passerby/UserController.do",
		data: {
			"behaviour": 1,
			"account": account
		},
		dataType: "json",
		success: function(data) {
			if (data.result == "true") {
				name.html(data.fakename);
				head_show.attr("src", "data:img/png;base64," + data.head);
				head_show.attr("src", "data:img/png;base64," + data.head);
				school_name.html(data.school);
				college_name.html(data.college);
				major_name.html(data.major);
				personal.value=data.singlesex;
				ntags = data.tags;
				sex = data.sex;
				ID.html("ID:"+account);
				
				$id("set_name").value=data.fakename;
				$id("school").value=data.school;
				$id("college").value=data.college;
				$id("major").value=data.major;
				if (ntags != "" && taghaving==0) {
					var begintag = new Array();
					begintag = ntags.split("&"); 
					$("#personal_tag").remove();
					for (i = 0; i < begintag.length; i++) {
						tagnum = tagnum + 1;
						var tagDiv = document.createElement("div");
						var tagShow = document.getElementById("tag_show");
						var divVal = document.createTextNode(begintag[i]);
						tagDiv.appendChild(divVal);
						tagShow.appendChild(tagDiv);
						var newTag = tagShow.getElementsByTagName("div");
						newTag[tagnum].setAttribute("id", "other_tag" + tagnum);
						taghaving++;
						var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
						for(var n=0;n<tagLi.length;n++){
							if(tagLi[n].innerHTML==$id("other_tag"+i).innerHTML)
							{
								tagLi[n].style.display="none";
							}								
						}
					}
				}else{
					var begintag = new Array();
					begintag = ntags.split("&");
					for (i = 0; i < begintag.length; i++) {
						$("#other_tag"+i).html(begintag[i]);
					}	
				}
				if (sex == "男") {
					sex_img.src="../img/man.png";
					
				} else if(sex == "女"){
					sex_img.src="../img/woman.png";
				}

				$("#time").html(data.redate);
				var circle_info = data.info;
				if (circle_info != "") {
					$id("dynamic_text").innerHTML = circle_info;
					var s = "";
					var date = new Date();
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					if(month < 10) month = "0" + month;
					var day = date.getDay();
					if(day < 10) day = "0" + day;
					var hour = date.getHours();
					if(hour < 10) hour = "0" + hour;
					var min = date.getMinutes();
					if(min < 10) min = "0" + min;
					var seconds = date.getSeconds();
					if(seconds < 10) seconds = "0" + seconds;
					s = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seconds;
					$id("time").innerHTML = s;
					$id("contact").value = circle_info;
				}
				$.ajax({
					type: "GET",
					url: "/passerby/UserController.do",
					data: {
						"behaviour": 2,
						"account": account
					},
					dataType: "json",
					success: function(data) {
						for (var i = 0; i < data.length; i++) {
							var circle_img = $id("dynamic_photoshow" + i);
							circle_img.setAttribute("src", "data:img/png;base64," + data[i].picture);
							//show_dynamic.appendChild(dynamic_photo);
						}
					},
					error: function(err) {
						
					}
				})
			}
		},
		error: function(err) {
		}
	});
}


//兼容浏览器获取非行内样式
function getStyle(obj, attr) {
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}


//出场动画
function load() {
	$(".board").css("display", "none");
	resize();
	$id("single").src = "../img/ourself_2.png";
	$id("make_friend").src = "../img/make_friend.png";
	$("#make_friend").animate({
		marginTop: "550px",
		marginLeft: "280px"
	}, 2000);
	$("#single").animate({
		marginTop: "300px",
		marginLeft: "250px"
	}, 2000);
	$("#arrow").animate({
		left: "130px",
		top: "580px"
	}, 2000);
}
load();

//重置大小
function resize() {
	$(".board").css("height", parseInt($(".board").css("width")) * 9 / 10 + "px");
}

//更改选择图标
function changeIcon() {
	if (option == 0) {
		$id("single").src = "../img/ourself_2.png"; 
		$id("make_friend").src = "../img/make_friend.png";
	} else {
		$id("single").src = "../img/ourself.png";
		$id("make_friend").src = "../img/make_friend2.png";
	}
}

//切换个人
$id("single").onclick = function changeSingle() {
	option = 0;
	changeIcon();
	$id("main_message").style.display = "block";
	$id("main_friend").style.display = "none";
	divNone();
}

//切换交友
$id("make_friend").onclick = function changeDouble() {
	option = 1;
	changeIcon();
	$id("main_message").style.display = "none";
	$id("main_friend").style.display = "block";
	divNone();
	$("#arrow").hide();
}

//三个图标点击显示设置框
document.getElementById("dynamic").onclick = function() {
	$(".addImg").show();
	$("#set_1").show();
	$("#set_2").hide();
	$("#set_3").hide();
	$("#email_contact").hide();
}
document.getElementById("modify_contact").onclick = function() {
	$("#set_2").show();
	$("#set_1").hide();
	$("#set_3").hide();
	$("#email_contact").hide();
}
document.getElementById("self").onclick = function() {
	$("#set_3").show();
	$("#set_1").hide();
	$("#set_2").hide();
	$("#email_contact").hide();
}



function blobToDataURL(blob, callback) {
    let a = new FileReader();
	a.readAsDataURL(blob);
    a.onload = function (e) { 
		callback(e.target.result);
	}
}
var imgi;
var imgtext;
//设置框点击确定
$id("dynamic_submit").onclick = function() {
	$("#loading").show();
	var base64;
	var pic = document.getElementById("picture_choose").getElementsByTagName("div");
	
	imgtext=$id("contact").value;
	if (imgtext.length > 20) {
        imgtext = imgtext.substring(0,20);
    }
	$.ajax({
		type:"post",
		url:"/passerby/UserController.do",
		data:{
			"account":account,
			"behaviour":9, 
			"info":imgtext
		},
		typeData:"json",
		success:function(data) {
		}
	})

	var j = 0;
	
	//图片上传
	for(var i=1;i<allfiles_img.length;i++){			
			var reader = new FileReader();
			reader.readAsDataURL(allfiles_img[i]);
			reader.onload = function (e) { 
				j++;
				base64=e.target.result.split(",", 2)[1];
				var json = {
						"behaviour": 2,
						"account": account,
						"picture":base64,
						"ify":j
					};
				$.ajax({
					type: "post",
					url: "/passerby/UserController.do",
					data: json,
					typeData: "json",
					success: function(data) {
						if(j == allfiles_img.length - 1) {
							getPage();
							$("#loading").hide(); 
							window.location.reload();
						}
					},
					error: function(err) {
						
					}
				})
				
			}
		
	}	
	$id("set_1").style.display = "none";
	$id("contact").value = "";
	//清空个人圈上传里面的图片
	$(".image_container").remove();
}
var allfiles_img=new Array();
//个人圈发布的图片添加，预览和删除
$(function() {
	var picId = 0;
	var pictureUploading = false;
	$("#form1").delegate(".addImg", "click", function () {
		if (pictureUploading) return;
		pictureUploading = true;
		if(picId < 4){
			picId++;
			$(".addImg").display="block";
			$(this).attr("data-picId", picId + 1);
			$(this).before("<div class=\"image_container\" data-picId=\"" + picId + "\">"
							+ "<input id=\"image_file" + picId + "\" name=\"image_file" + picId + "\" type=\"file\" accept=\"image/jpeg,image/png,image/gif\" style=\"display: none;\" />"
							+ "<input id=\"picture_input" + picId + "\" name=\"picture_input" + picId + "\" type=\"hidden\" value=\"0\" />"
							+ "<a href=\"javascript:;\" id=\"previewBox" + picId + "\" class=\"previewBox\">"
								+ "<div class=\"delImg\">&times;</div>"
								+ "<img id=\"preview" + picId + "\" style=\"height:70px;width:70px;border-width:0px;\" />"
							+ "</a>"
						+ "</div>");
			$("#image_file" + picId).change(function () {
				var $file = $(this);
				var fileObj = $file[0];
				allfiles_img[picId]=fileObj.files[0];
				var windowURL = window.URL || window.webkitURL;
				var dataURL;
				$("#previewBox" + picId).css("display", "inline-block");
				var $img = $("#preview" + picId);
				if (fileObj && fileObj.files && fileObj.files[0]) {
					dataURL = windowURL.createObjectURL(fileObj.files[0]);
					$img.attr('src', dataURL);
					
				} else {
					dataURL = $file.val();
					var imgObj = $img;
					// 在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
					imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
					imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
				}
				if (0 == picId) {
					defaultImg(picId, true);
				}
				pictureUploading = false;
				
			});
		}
		$("#image_file" + picId).click();
		//预览图片
		$(".previewBox").click(function () {
			var _picId = parseInt($(this).parent(".image_container").attr("data-picId"));
			$(".image_container").each(function () {
				var i = parseInt($(this).attr("data-picId"));
				if (i == _picId)
					defaultImg(i, true);
				else
					defaultImg(i, false);
			});
		});
		//删除上传的图片
		$(".delImg").click(function () {
			picId--;
			var _picId = parseInt($(this).parent().parent(".image_container").attr("data-picId"));
			var pic = document.getElementById("picture_choose").getElementsByTagName("div");
			var imagecontainer=$(".image_container");
			$(".image_container[data-picid='" + _picId + "']").remove();
			$("#preview" + _picId).attr("src","null");
			for(var i = 1;i<pic.length;i++){
				if(i<_picId){
					imagecontainer[i].setAttribute("data-picId", i);	
				}else{
					imagecontainer[i].setAttribute("data-picId", i-1);
				}
			}	
			if ($(".image_container").length > 0 && $(".defaultImg").length < 1) {
				$(".image_container").each(function () {
					
					var i = parseInt($(this).attr("data-picId"));
					defaultImg(i, true);
					return false;
				});
			}
			
		});
	});
	function defaultImg(picId, selected) {
		if (!picId) return;
		if (!!selected) {
			$("#picture_input" + picId).val(1);
			$("#previewBox" + picId).addClass("defaultImg");
		}
		else {
			$("#picture_input" + picId).val(0);
			$("#previewBox" + picId).removeClass("defaultImg");
		}
	}
});

//展开修改邮箱或者密码内容
$("#icon_emailchange").click(function() {
	$("#change_email").show();
	$("#change_emailmore").hide();
	$("#change_passwordmore").show();
	$("#change_password").hide();
})
$("#icon_passwordchange").click(function() {
	$("#change_password").show();
	$("#change_passwordmore").hide();
	$("#change_email").hide();
	$("#change_emailmore").show();
})


$id("email_submit").onclick = function() {	
	var change;
	if(getStyle(change_email, "display")=="block")
	{
		$.ajax({
			type: "GET",
			url: "/passerby/SendEmailController.do",
			data: {
				"behaviour": 1,
				"input":$id("get_code_email").value
			},
			dataType: "json",
			success: function(data) {
				if (data.msg == true) {
					$.ajax({
						type: "POST",
						url: "/passerby/UserController.do",
						data: {
							"behaviour": 4,
							"account":account,
							"email":$id("new_email").value
						},
						dataType: "json",
						success: function(data) {
							if(data.result==true){
								alert("邮箱修改成功");
								$id("time_get").innerHTML = "获取验证码";
								clearInterval(interval);
								click = false;
								
								$id("new_email").value = "";
								$id("get_code_email").value = "";
								$id("email_warning").innerHTML = "";
								$("#set_2").hide();
							}else{
								alert("邮箱修改失败");
							}
						},
						error: function(err) {
							//alert(err.status);
						}
					})
					$id("set_2").style.display = "none";
				} else {
					alert("验证码错误");
				}
			},
			error: function(err) {
				//alert(err.status);
			}
		})
		
	}else if(getStyle(change_password, "display")=="block"){
		$.ajax({
			type: "POST",
			url: "/passerby/UserController.do",
			data: {
				"behaviour": 5,
				"account": account,
				"password": $id("new_password").value,
				"oldpassword": $id("old_password").value
			},
			dataType: "json",
			success: function(data) {
				if (data.result == true) {
					alert("更改成功");
					$id("old_password").value = "";
					$id("new_password").value = "";
					$id("confirm_password").value = "";
					$("#set_2").hide();
				} else {
					alert("更改失败");
					
				}
			},
			error: function(err) {
				//alert(err.status);
			}
		})
	}else{
		alert("请进行选择");
	}
	if(change){
		
		
		
	}
}



//第二个设置中获取验证码
var click = false; //验证是否点击
var countTime = 60; //时间为60秒
function setTime() {
	var time_get = document.getElementById("time_get");
	var interval;
	if (countTime > 0) {
		countTime--;
		time_get.innerHTML = countTime + "秒后重新发送";
	} else if (countTime == 0) {
		time_get.innerHTML = "获取验证码";
		clearInterval(interval);
		click = false;
	}
}

document.getElementById("time_get").onclick = function() {
	//点击获取发送验证码到邮箱
	var email_warning = document.getElementById("email_warning");
	var new_email = document.getElementById("new_email").value;
	if(new_email!=""){
		if(email_warning.innerHTML==""){
			//获取验证码后改变字体
			if (!click) {
				interval = setInterval("setTime()", 1000);
				click = true;
				var json = {
					"behaviour": 0,
					"email": new_email
				};
				$.ajax({
					type: "GET",
					url: "/passerby/SendEmailController.do",
					data: json,
					typeData: "json",
					success: function(data) {},
					error: function(err) {
						
					}
				})
			} else {
				clearInterval(interval);
			}
		}	
	}
	
}

//检验邮箱的格式是否正确
function emailConfirm() {
	var new_email = document.getElementById("new_email");
	var email_warning = document.getElementById("email_warning");
	new_email.onblur = function() {
		var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
		if (new_email.value == "") {
			email_warning.innerHTML = "*邮箱不能为空";
		} else if (!reg.test(new_email.value)) {
			email_warning.innerHTML = "*请输入正确的邮箱地址";
		} else {
			email_warning.innerHTML = "";
		}
	}
}
emailConfirm();

//检验两次密码输入是否一致
document.getElementById("confirm_password").onblur = function() {
	if (document.getElementById("new_password").value != document.getElementById("confirm_password").value) {
		input_warning.innerHTML = "*前后两次密码不一致，请重写输入";
		document.getElementById("confirm_password").value = "";
	} else if (document.getElementById("new_password").value == "" || document.getElementById("confirm_password").value =="") {
		input_warning.innerHTML = "*你还没输入或确认密码";
	} else {
		input_warning.innerHTML = "";
	}
}


$id("self_submit").onclick = function() {
	
	var birthday= $(".years").val()+"-"+$(".months").val()+"-"+$(".days").val();
	$.ajax({
		type: "POST",
		url: "/passerby/UserController.do",
		data: {
			"behaviour": 3,
			"account":account,
			"sex": $("input[name='sex']:checked").val(),
			"fakename":$id("set_name").value,
			"birthday": birthday,
			"school":$id("school").value,
			"college":$id("college").value,
			"major":$id("major").value
		},
		dataType: "json",
		success: function(data) {
			if (data.result == true) {
				alert("修改成功");
				getPage();
				// $id("set_name").value = "";
				// $id("school").value = "";
				// $id("college").value = "";
				// $id("major").value = "";
				$id("set_3").style.display = "none";
			} else {
				alert("修改失败");
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
}



//个人信息框的填写设置
$(function() {
	$.ms_DatePicker({
		YearSelector: ".years",
		MonthSelector: ".months",
		DaySelector: ".days"
	});
});
(function($) {
	$.extend({
		ms_DatePicker: function(options) {
			var defaults = {
				YearSelector: ".years",
				MonthSelector: ".months",
				DaySelector: ".days",
				FirstText: "--",
				FirstValue: 0
			};
			var opts = $.extend({}, defaults, options);
			var $YearSelector = $(opts.YearSelector);
			var $MonthSelector = $(opts.MonthSelector);
			var $DaySelector = $(opts.DaySelector);
			var FirstText = opts.FirstText;
			var FirstValue = opts.FirstValue;

			// 初始化
			var str = "<option value=\"" + FirstValue + "\">" + FirstText + "</option>";
			$YearSelector.html(str);
			$MonthSelector.html(str);
			$DaySelector.html(str);

			// 年份列表
			var yearNow = new Date().getFullYear();
			var yearSel = $YearSelector.attr("rel");
			for (var i = yearNow; i >= 1900; i--) {
				var sed = yearSel == i ? "selected" : "";
				var yearStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
				$YearSelector.append(yearStr);
			}

			// 月份列表
			var monthSel = $MonthSelector.attr("rel");
			for (var i = 1; i <= 12; i++) {
				var sed = monthSel == i ? "selected" : "";
				var monthStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
				$MonthSelector.append(monthStr);
			}

			// 日列表(仅当选择了年月)
			function BuildDay() {
				if ($YearSelector.val() == 0 || $MonthSelector.val() == 0) {
					// 未选择年份或者月份
					$DaySelector.html(str);
				} else {
					$DaySelector.html(str);
					var year = parseInt($YearSelector.val());
					var month = parseInt($MonthSelector.val());
					var dayCount = 0;
					switch (month) {
						case 1:
						case 3:
						case 5:
						case 7:
						case 8:
						case 10:
						case 12:
							dayCount = 31;
							break;
						case 4:
						case 6:
						case 9:
						case 11:
							dayCount = 30;
							break;
						case 2:
							dayCount = 28;
							if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
								dayCount = 29;
							}
							break;
						default:
							break;
					}

					var daySel = $DaySelector.attr("rel");
					for (var i = 1; i <= dayCount; i++) {
						var sed = daySel == i ? "selected" : "";
						var dayStr = "<option value=\"" + i + "\" " + sed + ">" + i + "</option>";
						$DaySelector.append(dayStr);
					}
				}
			}
			$MonthSelector.change(function() {
				BuildDay();
			});
			$YearSelector.change(function() {
				BuildDay();
			});
			if ($DaySelector.attr("rel") != "") {
				BuildDay();
			}
		}
	});
})(jQuery);

//点击头像更改头像
$id("photo").onclick = function() {
	$id("change_photo").style.display = "block";
	$("#set_1").hide();
	$("#set_2").hide();
	$("#set_3").hide();
}
var base64;
$id("photo_submit").onclick = function() {
	$id("change_photo").style.display = "none";
	//文件数据转化为base64
	var choose_file = $("#avatar")[0].files[0];
	var reader = new FileReader();
	reader.onload = function (e) { 
		base64=e.target.result.split(",", 2)[1];
		var json = {
				"behaviour": 1,
				"account": account,
				"head": base64
			};
			//头像更改ajax
			$.ajax({
				type: "post",
				url: "/passerby/UserController.do",
				data: json,
				typeData: "json",
				success: function(data) {
					if (data.result == true) {
						alert("头像修改成功");
						getPage();
					} else {
						alert("头像修改失败");
					}
				},
				error: function(err) {
					
				}
			})
	}
	reader.readAsDataURL(choose_file);
}
$("#avatar").change(function() {
	$("#photo_warning").html("");
	//拿到文件数据
	var choose_file = $(this)[0].files[0];
	//截取图片名称小数点后的字符串
	var ftype = choose_file.name.substring(choose_file.name.lastIndexOf(".") + 1);
	//校验格式是否是图片类型
	if (ftype == "jpg" || ftype == "png" || ftype == "jpeg" || ftype == "JPG") {
		$("#preview").attr("src", URL.createObjectURL($(this)[0].files[0]));
		$("#head_show").attr("src", URL.createObjectURL($(this)[0].files[0]));
		//限制大小，照片大小不能超过1M
		var size = choose_file.size / 1024 / 1024;
		if (size > 1) {
			$("#photo_warning").html("*图片太大了，请重新选择");
			return false;
		}
	} else {你
		$("#photo_warning").html("*图片格式好像不对，请重新选择");
		return false;
	}
});



//获取图片的url地址
function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}


//点击tag打开输入框
//点击Tag标签出显示框和保存按钮
document.getElementById("title").onclick = function() {
	var self_tag = document.getElementById("self_tag");
	var delete_tag = document.getElementById("delete_tag");
	var tag = document.getElementById("tag");
	var chooseTag = document.getElementById("choose_tag");
	var tagWarning = document.getElementById("tag_warning");
	//确认标签数量,标签数量最多五个
	var tagNum = 0;
	if (getStyle(self_tag, "display") == "block") {
		self_tag.style.display = "none";
		save_tag.style.display = "none";
	} else {
		self_tag.style.display = "block";
		save_tag.style.display = "block";
	}
	//确认标签预览数量,标签数量最多五个
	let tagNum2 = -1;
	//将标签放在预选栏
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	for (var i = 0; i < tagLi.length; i++) {
		tagLi[i].onclick = function() {
			tagNum2++;
			this.style.display = "none";
			if (tagNum2 >= 0 && tagNum2 < 5) {
				var newLi = document.createElement("div");
				newLi.setAttribute("id", "choose_class");
				var liVal = document.createTextNode(this.innerHTML);
				newLi.appendChild(liVal);
				chooseTag.appendChild(newLi);
				//点击去除选定的标签
				var chooseLi = chooseTag.getElementsByTagName("div");
				for (let j = 0; j < chooseLi.length; j++) {
					chooseLi[j].onclick = function() {
						for (var n = 0; n < tagLi.length; n++) {
							if (tagLi[n].innerHTML == chooseLi[j].innerHTML) {
								tagLi[n].style.display = "block";
							}
						}
						chooseTag.removeChild(chooseLi[j]);
						tagNum2--;
					};

				}
				tagWarning.innerHTML = "";
			} else if (tagNum2 >= 5) {
				tagWarning.innerHTML = "*最对只能放五个标签，请先删除在添加";
				this.style.display = "block";
			}
		};
	}
}

//点击保存将标签放在tag中
//tag_show中的标签超过五个的时候把第六个生成的将第一个给替换

$id("save_tag").onclick = function() {
	var tagWarning = document.getElementById("tag_warning");
	tagWarning.innerHTML = "";
	
	$id("save_tag").style.display = "none";
	$("#self_tag").hide();
	
	var chooseLi = $id("choose_tag").getElementsByTagName("div");
	var tagLi = document.getElementById("tag_choose").getElementsByTagName("li");
	var tags="";
	
	for(var i = 0;i < chooseLi.length; i++){	
		$("#personal_tag").remove();
		tagnum=tagnum+1;
		if(tagnum>=5){
			if(tagnum%5==0){
				tagtime=tagtime+1;			
				for(var n=0;n<tagLi.length;n++){
					if(tagLi[n].innerHTML==$id("other_tag"+(tagnum-(5*tagtime))).innerHTML)
					{
						tagLi[n].style.display="block";
					}								
				}
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}else{
				for(var n=0;n<tagLi.length;n++){
					if(tagLi[n].innerHTML==$id("other_tag"+(tagnum-(5*tagtime))).innerHTML)
					{
						tagLi[n].style.display="block";
					}								
				}
				$("#other_tag"+(tagnum-(5*tagtime))).html(chooseLi[i].innerHTML);
			}
			
		}else{
			var tagDiv = document.createElement("div");
			var tagShow = document.getElementById("tag_show");
			var divVal = document.createTextNode(chooseLi[i].innerHTML);
			tagDiv.appendChild(divVal);
			tagShow.appendChild(tagDiv);
			var newTag = tagShow.getElementsByTagName("div");
			newTag[tagnum].setAttribute("id","other_tag" + tagnum);
		}
	}
	ntags = "";
	for(var i =0; i<5; i++){
		var temp = $id("other_tag" + i);
		if(temp) {
			if(ntags==""){  
				ntags=temp.innerHTML;
			}else{
				ntags+="&"+temp.innerHTML;
			}
		}
	}
	var chooseLi_length=chooseLi.length-1;
	for(var i =chooseLi_length; i>=0; i--){
		chooseLi[i].remove();
	}
	$.ajax({
		type:"post", 
		url:"/passerby/UserController.do",
		data:({
			"behaviour":7, 
			"account":account,
			"tags":ntags
		}),
		dataType:"json",
		success:function(data) {
			if(data.result == true) {
				alert("更改成功");
			} else {
				getPage();
			}
		}
	})
}

//删除提示标签
$id("delete_tag").onclick = function() {
	$("#personal_tag").remove();
}


//交友页面的动画滚动效果
//点击左按钮
document.getElementById("prev").onclick = function() {
	var another_message0 = document.getElementById("another_message0");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(another_message0, "left") == "15px") {
		which = 1;
		$("#another_message0").animate({
			left: "-342px"
		});
		$("#another_message0").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		$("#another_message1").css({
			"left": "372px"
		});
		$("#another_message2").animate({
			left: "-15px"
		});
		$("#another_message2").animate({
			left: "15px"
		});
		another_message2.style.right = "";
		$("#another_message2").css({
			"left": "15px",
			"filter": "none"
		});
		getfriend();
	} else if (getStyle(another_message2, "left") == "15px") {
		which = 0;
		$("#another_message1").animate({
			left: "-15px"
		});
		$("#another_message1").animate({
			left: "15px"
		});
		$("#another_message1").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message2").animate({
			left: "-342px"
		});
		$("#another_message2").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		another_message0.style.left = "";
		$("#another_message0").css({
			"left": "372px"
		});
		getfriend();
	} else if (getStyle(another_message1, "left") == "15px") {
		which = 2;
		$("#another_message0").animate({
			left: "-15px"
		});
		$("#another_message0").animate({
			left: "15px"
		});
		$("#another_message0").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message1").animate({
			left: "-342px"
		});
		$("#another_message1").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		another_message2.style.left = "";
		$("#another_message2").css({
			"right": "-342px"
		});
		getfriend();
	}
	divNone();
}
//点击右按钮
document.getElementById("next").onclick = function() {
	var another_message0 = document.getElementById("another_message0");
	var another_message1 = document.getElementById("another_message1");
	var another_message2 = document.getElementById("another_message2");
	if (getStyle(another_message0, "left") == "15px") {
		which = 1;
		$("#another_message0").animate({
			left: "372px"
		});
		$("#another_message0").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#another_message1").animate({
			left: "30px"
		});
		$("#another_message1").animate({
			left: "15px",
		});
		$("#another_message1").css({
			"left": "15px",
			"filter": "none"
		});
		$("#another_message2").css({
			"left": "-342px"
		});
		getfriend();
	} else if (getStyle(another_message1, "left") == "15px") {
		which = 2;
		$("#another_message2").animate({
			left: "30px"
		});
		$("#another_message2").animate({
			left: "15px"
		});
		$("#another_message2").css({
			"left": "15px",
			"filter": "none"
		});
		another_message1.style.left = "";
		$("#another_message1").animate({
			left: "372px"
		});
		$("#another_message1").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#another_message0").css({
			"left": "-342px"
		});
		getfriend();
	} else if (getStyle(another_message2, "left") == "15px") {
		which = 0;
		$("#another_message1").css({
			"left": "-342px",
			"filter": "blur(3px)"
		});
		$("#another_message2").animate({
			left: "372px"
		});
		$("#another_message2").css({
			"left": "372px",
			"filter": "blur(3px)"
		});
		$("#another_message0").animate({
			left: "30px"
		});
		$("#another_message0").animate({
			left: "15px"
		});
		$("#another_message0").css({
			"left": "15px",
			"filter": "none"
		});
		getfriend();
	}
	divNone();
}

//对筛选的对象进行存储
var school_condition = "";
var college_condition = "";
var sex_condition = "";
var tag_condition = "";

function getfriend(){
	time=300;
	$.get("/passerby/UserController.do", {
		behaviour: 3,
		account:account,
		tags: tag_condition,
		sex: sex_condition,
		school: school_condition,
		college: college_condition
		
	}, function(data) {
		if (data.result == "true") {
			chataccount = data.friendaccount;
			//for (var j = 0; j < 3; j++) {
				var friend_name = $("#another_message" + which).children("#friend_message").children("#friend_introduce").children("#friend_name");
				var friend_school = $("#another_message" + which).children("#friend_message").children("#friend_introduce").children("#friend_school");
				var friend_college = $("#another_message" + which).children("#friend_message").children("#friend_introduce").children("#friend_college");
				var friend_personal = $("#another_message" + which).children("#friend_message").children("#friend_signature").children("#friend_personal");
				var head_portrait = $("#another_message" + which).children("#friend_message").children("#head_portrait");
				var friend_photo = $("#friend_photo");
				//if ($id("another_message" + j).style.left == "15px") {
					friend_name.html(data.fakename);
					friend_school.html(data.school);
					friend_college.html(data.major);
					friend_personal.text(data.singlesex);
					
					var tags = data.tags;
					if (tags != "") {
						var friendtag = new Array();
						friendtag = tags.split("&");
						$("#personal_tag").remove();
						for (i = 0; i < friendtag.length; i++) {
							$("#another_message" + which).children("#friend_tag").children("#friend_tag"+i).html(friendtag[i]);
						} 
					}
					head_portrait.html("<img src='data:img/png;base64," + data.head +"' style='width:60px;height:60px;border-radius:50%;'/>");
					friend_photo.attr("src", "data:img/png;base64," + data.head);
					//if (circle_info != "") {
					if(data.info != "") {
						var all_dynamic=document.getElementById("all_dynamic");
						var show_dynamic = document.createElement("div");
						var dynamic_line = document.createElement("hr");
						var time = document.createElement("div");
						var dynamic_contact = document.createElement("div");
						var dynamic_text = document.createElement("div");
						var dynamic_photo = document.createElement("div");
						
						show_dynamic.setAttribute("id", "show_dynamic");
						dynamic_line.setAttribute("id", "dynamic_line");
						time.setAttribute("id", "time");
						dynamic_text.setAttribute("id", "dynamic_text");
						dynamic_contact.setAttribute("id", "dynamic_contact");
						dynamic_photo.setAttribute("id", "dynamic_photo");
						
						time.innerHTML=getNowDate();
						dynamic_text.innerHTML=data.info;
						
						show_dynamic.appendChild(time);
						show_dynamic.appendChild(dynamic_contact);
						$.ajax({
							type: "GET",
							url: "/passerby/UserController.do",
							data: {
								"behaviour": 2,
								"account": account
							},
							dataType: "json",
							success: function(data) {
								for (var i = 0; i < data.picture.length; i++) {
									var circle_img = document.createElement("img");
									circle_img.attr("id","dynamic_photoshow");
									circle_img.src = "data:img/png;base64," + data.picture[i];
									dynamic_photo.appendChild(circle_img);
									show_dynamic.appendChild(dynamic_photo);
								}
						
							},
							error: function(err) {
								//alert(err.status);
							}
						})
						$("#another_message" + which).children("#friend_dynamic").appendChild(show_dynamic);
					}
				//}
			//} 
		} else { 
			alert("该筛选条件找不到人");  
		}
	});
}
//筛选框
document.getElementById("icon_choose").onclick = function() {
	var choose_friend = document.getElementById("choose_friend");
	if (choose_friend.style.display == "block") {
		choose_friend.style.display = "none";
	} else {
		choose_friend.style.display = "block";
	} 
	//只要选完了点击筛选就用Ajax刷新main_show的内容
	document.getElementById("choose_submit").onclick = function() {
		choose_friend.style.display = "none";
		//筛选数据的传输
		getfriend();
	} 

	//性别 
	var man = document.getElementById("man");
	var woman = document.getElementById("woman");  
	man.onclick = function() {
		man.style.background = "lightblue";
		woman.style.background = "white"; 
		sex_condition = man.innerHTML; 
	}  
	woman.onclick = function() {
		man.style.background = "white"; 
		woman.style.background = "pink";
		sex_condition = woman.innerHTML;
	}
	document.getElementById("more_school").onclick = function() {
		document.getElementById("more_school").style.display = "none";
		document.getElementById("school_choose").style.height = "80px";
	}
	document.getElementById("more_college").onclick = function() {
		document.getElementById("more_college").style.display = "none";
		document.getElementById("college_choose").style.height = "210px"; 
	}
	document.getElementById("more_other").onclick = function() {
		document.getElementById("more_other").style.display = "none";
		document.getElementById("other_choose").style.height = "310px";
	}
}

function selection() {
	//选择学校部分
	var school_choose = document.getElementById("school_choose");
	var schoolLi = school_choose.getElementsByTagName("li");
	//学校只能选一个
	var schoolNum = 0;
	for (let i = 0; i < schoolLi.length; i++) { 
		schoolLi[i].onclick = function() {
			for (let j = 0; j < schoolLi.length; j++) {
				schoolLi[j].style.background = "#FFF";
			}
			var newSchoolLi = new Array();
			newSchoolLi[0] = schoolLi[0].innerHTML;  
			schoolLi[0].innerHTML = schoolLi[i].innerHTML; 
			schoolLi[i].innerHTML = newSchoolLi[0]; 
			schoolLi[0].style.background = "#eeee9e";
			school_condition = schoolLi[0].innerHTML;  
			school_choose.style.height = "35px";
			schoolNum++;  
			if (schoolNum >= 1) {
				school_choose.style.height = "35px";
				document.getElementById("more_school").style.display = "block"; 
			}
		}
	}

	// //对选择的学校进行存储
	// for (let i = 0; i < schoolLi.length; i++) {
	// 	if (schoolLi[i].style.background == "#eeee9e") {
	// 		school_condition = schoolLi[i].val;
	// 	}
	// }


	//学院选择部分
	var college_choose = document.getElementById("college_choose");
	var collegeLi = college_choose.getElementsByTagName("li");
	//学院只能选一个
	var collegeNum = 0;
	for (let i = 0; i < collegeLi.length; i++) {
		collegeLi[i].onclick = function() {
			for (let j = 0; j < collegeLi.length; j++) {
				collegeLi[j].style.background = "#FFF";
			}
			var newCollegeLi = new Array;
			newCollegeLi[0] = collegeLi[0].innerHTML;
			collegeLi[0].innerHTML = collegeLi[i].innerHTML;
			collegeLi[i].innerHTML = newCollegeLi[0];
			collegeLi[0].style.background = "#f0aec7";
			college_condition = collegeLi[0].innerHTML;
			college_choose.style.height = "35px";
			collegeNum++;
			if (collegeNum >= 1) {
				college_choose.style.height = "35px";
				document.getElementById("more_college").style.display = "block";
			}
		}
	}


	//标签选择部分
	var other_choose = document.getElementById("other_choose");
	var otherLi = other_choose.getElementsByTagName("li");
	//标签只能选一个
	var tagNum = 0;
	for (let i = 0; i < otherLi.length; i++) {
		otherLi[i].onclick = function() {
			for (let j = 0; j < otherLi.length; j++) {
				otherLi[j].style.background = "#FFF";
			}
			var newTagLi = new Array();
			newTagLi[0] = otherLi[0].innerHTML;
			otherLi[0].innerHTML = otherLi[i].innerHTML;
			otherLi[i].innerHTML = newTagLi[0];
			otherLi[0].style.background = "#ead3ac";
			tag_condition = otherLi[0].innerHTML;
			other_choose.style.height = "35px";
			tagNum++;
			if (tagNum >= 1) {
				other_choose.style.height = "35px";
				document.getElementById("more_other").style.display = "block";
			}	
		}
	}
}
selection();


//点击显示聊天界面，筛选框和个人圈以及关闭
var interval;
var chat = document.querySelectorAll("#chat");
for (var i = 0; i < chat.length; i++) {
	chat[i].onclick = function() {
		
		if($id("friend_name").innerHTML=="昵称"){
			$("#chat_request").show();
			$("#request_submit").hide();
			$("#request_cancel").hide();
			$("#request_close").show();
			$("#request").html("请筛选一个对象进行聊天");
			
		}else if(chataccount==chat_having){
			$("#chat_request").show();
			$("#request_submit").hide();
			$("#request_cancel").hide();
			$("#request_close").show();
			$("#request").html("与该好友聊天已结束");
			
		}else{
			$("#chat_request").show();
			$("#request_submit").show();
			$("#request_cancel").show();
			$("#request_close").hide();
			$("#request").html("向"+$id("friend_name").innerHTML+"发送聊天请求");
		}
	}
}
//聊天请求
$("#request_submit").click(function() {
	var target = chataccount;
	websocket.send("chat"+ ","+account + "," + target );
	$("#request").html("您已成功发送聊天请求，请耐心等待");
	$("#request_submit").hide();
	$("#request_cancel").hide();
	$("#request_close").show();
	having(target);
})
$("#request_cancel").click(function() {
	$("#chat_request").hide();
})
$("#request_close").click(function() {
	$("#chat_request").hide();
})
//聊天接受
$("#remind_agree").click(function() {
	$("#remind").hide();
	$("#remind_title").show();
	$("#remind_talk").hide();
	mesnum=mesnum-1;
	chatok();
	$("#chat_about").show();
	if (interval) {
		clearInterval(interval);
	}
	interval = setInterval("timeLow()", 1000);
})

$("#remind_reject").click(function() {
	$("#remind").hide();
	$("#remind_title").show();
	$("#remind_talk").hide();
	mesnum=mesnum-1;
	chatno();
})
//加时接受
$("#time_request_submit").click(function() {
	timeupok();
	time=time+300;
	$("#add_time_request").hide();
	
})
$("#time_request_cancel").click(function() {
	timeupno();
	$("#add_time_request").hide();
})
//好友接受
$("#friend_request_submit").click(function() {
	addok();
	$("#add_friend_request").hide();
	
})
$("#friend_request_cancel").click(function() {
	addno();
	$("#add_friend_request").hide();
})

//时间递减函数
//点开聊天框后的倒计时，当时间停止到30秒时提醒，为0时关闭聊天界面
var time = 300;

function timeLow() {
	var timeChat = document.getElementById("time_chat");
	if (time > 0) {
		time--;
		timeChat.innerHTML = time;
		
	} else if (time == 0) {
		clearInterval(interval);
		chat_about.style.display = "none";
		clearInterval(interval);
		time = 300;
		timeChat.innerHTML = time;
	}
	var chatWarning = document.getElementById("chat_warning");
	if (time <= 30) {
		chatWarning.style.display = "block";
		chatWarning.innerHTML = "聊天时间快结束了，还不快向他要其他的聊天方式吗，聊的开心就快问吧！！";
		chatWarning.style.color = "red";
		timeChat.style.color = "red";
	}else{
		timeChat.style.color = "grey";
	}
	if (time <= 25) {
		chatWarning.style.display = "none";
	}
}

//点击关闭按钮退出聊天框，并在对面的id = chat_warnig中提示对方退出
//ajax的内容,只要聊天框关闭，刷新main_show的内容

document.getElementById("icon_close").onclick = function() {
	var target = chataccount; //目标   *
	if(target==""){
		target=fromwho;
	}
	websocket.send("chat_no"+ ","+account + "," + target );
	$id("chat_warning").style.display = "none";
	$id("time_chat").style.color = "grey"
	var timeChat = document.getElementById("time_chat");
	chat_about.style.display = "none";
	clearInterval(interval);
	time = 300;
	timeChat.innerHTML = time;
	having(target);
}

//改变聊天框的大小
$("#icon_change").click(function() {
	if ($("#icon_change img").attr("src") == "../img/small.png") {
		$("#chat_about").css({
			"height": "75px",
			"overflow": "hidden"
		});
		$("#icon_change img").attr("src", "../img/big.png");
		$("#icon_samll")
	} else if ($("#icon_change img").attr("src") == "../img/big.png") {
		$("#chat_about").css({
			"height": "560px",
			"overflow": "visible"
		});
		$("#icon_change img").attr("src", "../img/small.png");
	}
})


//举报内容的显和隐藏
$("#icon_report").click(function() {
	$("#report_tips").show();
})
$("#report_tip_submit").click(function() {
	$("#report_tips").hide();
})
$(function() {
	//点击选中或取消checkbox
	for (var i = 1; i < $("#report_introduce input").lengt + 1; i++) {
		$("#report_introduce")[i].click(function() {
			if ($("#check" + i).checked = true) {
				$("#check" + i).checked = false;
			} else {
				$("#check" + i).checked = true;
			}
		})
	}
})
$("#report_submit").click(function() {
	$("#report_choose").hide();
	illegal();
	for (var i = 0; i < $("#report_choose #report_introduce").length; i++) {
		if ($("#report_introduce input")[i].checked) {
			$("#report_introduce input")[i].checked = false;
		}
	}
})

$("#report_cancel").click(function() {
	$("#report_choose").hide();
	for (var i = 0; i < $("#report_choose #report_introduce").length; i++) {
		if ($("#report_introduce input")[i].checked) {
			$("#report_introduce input")[i].checked = false;
		}
	}
})

//加好友的请求
$("#icon_friend").click(function() {
	$("#add_friend").show();
	$("#add_title").html("向"+$id("show_name").innerHTML+"发送好友请求");
	
})

//点击确定向对方发送信息
$("#add_submit").click(function() {
	$("#add_submit").hide();
	$("#add_cancel").hide();
	$("#add_close").show();
	$("#add_title").html("您已成功发送加好友请求，请耐心等待");
	add_friend();
})
$("#add_cancel").click(function() {
	$("#add_friend").hide();
})
$("#add_close").click(function() {
	$("#add_friend").hide();
	$("#add_close").hide();
	$("#add_submit").show();
	$("#add_cancel").show();
})


//加时请求
$("#icon_time").click(function() {
	$("#add_time").show();
	$("#time_title").html("向"+$id("show_name").innerHTML+"发送加时请求");
	timeup();
})

//加时的确定和取消的切换
$("#time_submit").click(function() {
	$("#time_submit").hide();
	$("#time_cancel").hide();
	$("#time_close").show();
	$("#time_title").html("您已成功加时请求，请等待对方同意");
})
$("#time_cancel").click(function() {
	$("#add_time").hide();
})
$("#time_close").click(function() {
	
	$("#add_time").hide();
	$("#time_close").hide();
	$("#time_submit").show();
	$("#time_cancel").show();
})


//聊天框的拖动
function MoveChat() {
	var chat_about = document.getElementById("chat_about");

	function drag(ele) {
		ele.onmousedown = function(e) {
			var e = e || window.event;
			//此处是为了兼容IE，因为IE中事件对象是作为全局对象( window.event )存在的；
			var pageX = e.pageX || e.clientX + document.documentElement.scrollLeft; 
			var pageY = e.pageY || e.clientY + document.documentElement.scrollTop;
			//获取鼠标相对盒子的位置；
			var chat_aboutX = pageX - chat_about.offsetLeft;
			var chat_aboutY = pageY - chat_about.offsetTop;
			document.onmousemove = function(e) {
				var e = e || window.event;
				var pageX = e.pageX || e.clientX + document.documentElement.scrollLeft;
				var pageY = e.pageY || e.clientY + document.documentElement.scrollTop;
				//将鼠标当前的坐标值减去鼠标相对盒子的位置，得到盒子当时的位置并将其赋值给盒子，实现移动效果
				chat_about.style.left = pageX - chat_aboutX + 'px';
				chat_about.style.top = pageY - chat_aboutY + 'px';
			}
		};
		document.onmouseup = function() { 
			//清除盒子的移动事件;
			document.onmousemove = null;
		};
	};
	drag(chat_about);
}
MoveChat();






/*特殊字符转义 防止XSS攻击 用于特殊字符正常显示*/

function StringFilter(str) {
	var s = "";
	if (str.length == 0) {
		return "";
	}
	s = str.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/ /g, "&nbsp;");
	s = s.replace(/\'/g, "&#39;");
	s = s.replace(/\"/g, "&quot;");
	return s;
}

/*转义字符还原成html字符*/
function StringValFilter(str) {
	var s = "";
	if (str.length == 0) {
		return "";
	}
	s = str.replace(/&amp;/g, "&");
	s = s.replace(/&lt;/g, "<");
	s = s.replace(/&gt;/g, ">");
	s = s.replace(/&nbsp;/g, " ");
	s = s.replace(/&#39;/g, "\'");
	s = s.replace(/&quot;/g, "\"");
	return s;
}





//发送消息
function give() {
	//获取发送的目标和要发送的消息
	var target = chataccount; //目标   *
	if(target==""){
		target=fromwho;
	}
	var msg = $id("txt").value; //要说的话  *
	if (target == "") {
		alert("无效用户");
	} else if (msg == "") {
		alert("消息不能为空");
	} else {
		websocket.send(account + "," + target + "," + msg);
	}
}

//举报
	
function illegal() {
	var chooseIllegal = document.getElementsByName("illegal");
	var s = "";
	var first = true;
	for(var i = 0; i < chooseIllegal.length; i++) {
		if(chooseIllegal[i].checked) {
			if(first) {
				first = false;
			} else {
				s += "&";
			}
			s += chooseIllegal[i].value;
		}
	}
	var target = chataccount; //目标  *
	if(target==""||target==undefined){
		target=fromwho;
	}
	var illegalReason = s; //原因  *
	if (target == "") {
		alert("无效用户");
	} else if (illegalReason == "") {
		alert("举报原因不能为空");
	} else {
		websocket.send("illegal," + chatTime + "," + target + "," + account + "," + illegalReason);
	}
}

//加时
function timeup() {
	//获取加时对象
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	if (target == "") {
		alert("无效用户");
	} else {
		websocket.send("timeup," + account + "," + target);
	}
}
//同意加时
function timeupok(){
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	websocket.send("restimeup,"+target+",同意");
}
//拒绝加时
function timeupno(){
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	websocket.send("restimeup,"+target+",拒绝");
}
//同意加为好友
function add_friend() {
	//获取加好友对象
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	if (target == "") {
		alert("无效用户");
	} else {
		websocket.send("add_friend," + account + "," + target);
	}
}
//同意加好友
function addok(){
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	websocket.send("add_answer,"+account+","+target+",同意");
}
//拒绝加好友
function addno(){
	var target =chataccount;//目标
	if(target==""||target==undefined){
		target=fromwho;
	}
	websocket.send("add_answer,"+account+","+target+",拒绝");
}
//聊天请求
function chatok(){
	websocket.send("chat_answer,"+fromwho+",同意");
}
function chatno(){
	websocket.send("chat_answer,"+fromwho+",拒绝");
}
//好友列表的显示
document.getElementById("icon_list").onclick = function() {
	var friend_list = document.getElementById("friend_list");
	if (friend_list.style.display == "block") {
		friend_list.style.display = "none";
	} else {
		friend_list.style.display = "block";
	}
}
//好友列表的头像点开开始聊天

$(function(){
	var list_show = document.querySelectorAll("#list_show");
	for(var i=0;i<list_show.length;i++){
		list_show[i].onclick = function(){
			$("#chat_page").show();
			$("#friend_list").hide();
			$(".friend_photo2").attr("src",$id("list_photo").src);
			$("#chat_page").children("#friend_name_show").children("#show_name").text($("#list_name").html());
			chataccount=$id("list_photo").title;
		}
	}
})


//好友的聊天界面的显示
$("#icon_page_close").click(function() {
	$("#chat_page").hide();
})
//好友聊天界面的举报
$("#icon_page_report").click(function() {
	$("#report_tips").show();
})


//好友的信息发送
$("#page_sendMsg").click(function() {
	var txt = document.getElementById("page_txt");
	var talk_contact = document.getElementById("talk_page_contact");
	if (txt.value == "") {
		$("#chat_empty_warning").html("不能发送空内容");
		$("#chat_empty_warning").show();
	} else {
		$("#chat_empty_warning").hide();
		//个人头像
		var myImg = document.createElement("img");
		var newTxt = document.createElement("p");
		newTxt.setAttribute("class", "my_content");
		myImg.setAttribute("class", "my_photo"); 
		newTxt.style.lineHeight = "20px";
		newTxt.style.padding = "5px";
		newTxt.style.borderRadius = "5px";
		newTxt.style.backgroundColor = "yellowgreen";
		newTxt.style.float = "right";
		newTxt.style.fontSize = "15px";
		myImg.style.float = "right";
		myImg.style.height = "40px";
		myImg.style.width = "40px";
		myImg.style.borderRadius = "50%";
		myImg.style.border = "2px solid rgba(0,0,0,.3)";
		myImg.style.clear = "both";
		myImg.style.position = "relative";
		myImg.style.top = "0";
		myImg.style.margin = "8px 10px 0 10px";
		var stringFilter = StringFilter(txt.value);
		newTxt.innerHTML = stringFilter;
		talk_contact.appendChild(myImg);
		talk_contact.appendChild(newTxt);
		txt.value = "";
		$(".my_photo").attr("src",$id("head_show").src);
		newTxt.scrollIntoView();
	}
})
	
//删好友通知
$("#icon_delete").click(function() {
	$("#delete_contact").show();
})

//删除好友的提示确定的切换
$("#delete_submit").click(function() {
	deletefriend();

})
//删除好友
function deletefriend(){
	$.ajax({
		type: "post",
		url: "/passerby/UserController.do",
		data:{
			"behaviour":13,
			"account": account,
			"friend":chataccount
		},
		dataType: "json",
		success: function(data) {
			if(data.result){
				$("#delete_submit").hide();
				$("#delete_cancel").hide();
				$("#delete_close").show();
				$("#delete_title").html("您已成功删除对方");
				friends();
			}else{
				$("#delete_submit").hide();
				$("#delete_cancel").hide();
				$("#delete_close").show();
				$("#delete_title").html("删除失败");
				friends();
			}
		},
		error: function(err) {
			//alert(err.status);
		}
	})
	$.ajax({
		type: "post",
		url: "/passerby/UserController.do",
		data:{
			"behaviour":13,
			"account":chataccount,
			"friend":account
		},
		dataType: "json",
		success: function(data) {
			
		},
		error: function(err) {

		}
	})
}

$("#delete_cancel").click(function() {
	$("#delete_contact").hide();
})
$("#delete_close").click(function() {
	$("#delete_title").html("确认删除对方吗？？");
	$("#add_delete").hide();
	$("#delete_close").hide();
	$("#delete_submit").show();
	$("#delete_cancel").show();
	$("#chat_page").hide();
	$("#list_show").remove();
})




//这是个人圈显示的时间数据
function getNowDate() {
	var myDate = new Date();
	//获取当前年
	var year = myDate.getFullYear();
	//获取当前月
	var month = myDate.getMonth() + 1;
	//获取当前日
	var date = myDate.getDate();
	//获取当前时间
	var now = (year.toString() + "-" + month.toString() + "-" + date.toString());
	return now;
}


//退出登录和进入管理院界面
$("#manager_main").click(function() {
	divNone();
})
$("#back_main").click(function() {
	//divNone();
	websocket.close();
})

//收邮件的页面显示
$("#email_main").click(function() {
	$("#email_contact").show();
})

$("#email_close").click(function() {
	$("#email_contact").hide();
	$("#email_look").css({
		"height": "100px"
	});
	$(".email_content").css({
		"overflow-Y": "hidden",
	});
	$("#email_back").hide();
	$("#email_close").show();
})
$("#email_back").click(function() {
	$(".email_look").css("height","100px");
	$(".icon_emailmore").show();
	$("#email_back").hide();
	$("#email_close").show();
	$(".email_content").css({
		"overflow": "hidden",
		"white-space":"nowrap",
		"width":"100px"
	});
})

document.getElementById("personal").onblur = function() {
	signature = $id("personal").value;
	$.ajax({
		type:"post",
		url:"/passerby/UserController.do",
		data:{
			"behaviour":6,
			"account":account,
			"singlesex":signature
		},
		dataType:"json",
		success:function(data) {
		},
		error:function(err) {
		}
	})
}
//设置框中点击取消让页面隐藏
$("#dynamic_cancel").click(function(){
	$(".image_container").remove();
	$("#set_1").hide();
})
$("#self_cancel").click(function(){
 $("#set_3").hide();
})
$("#email_cancel").click(function(){
 $("#set_2").hide();
})
//消息提醒
$("#chat_remind").click(function(){
 $("#remind_contact").show();
})
$("#chat_submit").click(function(){
 $("#remind_contact").hide();
})

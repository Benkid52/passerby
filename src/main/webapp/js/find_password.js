function $id(id){
	return document.getElementById(id);
}

//检测账号是否有注册过,如果没有,就让他回到注册页面
$id("number").onblur=function(){
	if($id("number").value == ""){
		$id("warning1").innerHTML = "*学号不能为空";
		$("#warning1").css("color","red");
	}else{
		var json={"behaviour":0,"account":$id("number").value};
		$.ajax({
			type:"GET",
			url:"/passerby/UserController.do",
			data:json,
			dataType:"json",
			success:function(data) {
				if(data.result==true){
					$id("warning1").innerHTML = "*学号存在";
					$("#warning1").css("color","green");
				}else{
					$id("warning1").innerHTML = "*学号不存在";
					$("#warning1").css("color","red");
				}
			},
			error:function(err) {
				
			}
		})
	}
}
$id("next1").onclick = function(){
	if($id("number").value == ""){
		$id("warning1").innerHTML = "*学号不能为空";
	}else{
		var json={"behaviour":0,"account":$id("number").value};
		$.ajax({
			type:"GET",
			url:"/passerby/UserController.do",
			data:{"behaviour":0,"account":$id("number").value},	
			dataType:"json",
			success:function(data) {
				if(data.result==true){
					$id("Box2").style.display = "block";
					$id("Box1").style.display = "none";
				}else{
					$id("warning1").innerHTML = "*学号不存在";
				}
			},
			error:function(err) {
				
			}
		})
		
	}
}
//下一步点击换内容,并且验证内容输入是否正确
$id("email").onblur = function(){
	var email =$id("email");
	var account=$id("number");
	var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	
	if(email.value == ""){
		$id("warning2").innerHTML = "*邮箱不能为空";
		$("#warning2").css("color","red");
		
	}else if(! reg.test(email.value)){
		$id("warning2").innerHTML = "*请输入正确的邮箱地址";
		$("#warning2").css("color","red");
	}else{
		$.ajax({
			type:"POST",
			url:"/passerby/UserController.do",
			data:{"behaviour":8,"account":account.value,"email":email.value},
			dataType:"json",
			success:function(data) {
				if(data.result == true) {
					$id("warning2").innerHTML = "邮箱匹配正确";
					$("#warning2").css("color","green");
				} else {
					$id("warning2").innerHTML = "非本人绑定邮箱";
					$("#warning2").css("color","red");
				}
			},
			error:function(err) {
				//alert(err.status);
			}
		})
	}
}
$id("next2").onclick = function(){
	var email =$id("email");
	var account=$id("number");
	var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
	
	if(email.value == ""){
		$id("warning2").innerHTML = "邮箱不能为空";
		
	}else if(! reg.test(email.value)){
		$id("warning2").innerHTML = "请输入正确的邮箱地址";
	}else{
		$.ajax({
			type:"POST",
			url:"/passerby/UserController.do",
			data:{"behaviour":8,"account":account.value,"email":email.value},
			dataType:"json",
			success:function(data) {
				if(data.result ==true) {
					$id("Box2").style.display = "none";
					$id("Box3").style.display = "block";
				} else {
					$id("warning2").innerHTML = "非本人绑定邮箱";
				}
			},
			error:function(err) {
				//alert(err.status);
			}
		})
	}
}


//获取验证码
//Ajax发送邮箱验证码,检验验证码是否正确
var get_code = document.getElementById("get_code");
var countTime = 60;//时间为60秒
var interval;
var click = false;//验证是否点击
function setTime() {
	if(countTime > 0){
		countTime--;
		get_code.innerHTML = countTime + "秒后重新发送";
	}else if(countTime == 0){
		countTime = 60;
		get_code.innerHTML = "获取验证码";
		clearInterval(interval);
		click = false;
	}
}

//获取验证码后改变字体
get_code.onclick = function() {
	if(!click) {
		interval = setInterval("setTime()", 1000);
		click = true;
		var email = document.getElementById("email").value;
		var json = {"behaviour":0,"email":email};
		$.ajax({
			type:"GET",
			url:"/passerby/SendEmailController.do",
			data:json,
			typeData:"json",
			success:function(data) {
				//alert(data.status);
			},
			error:function(err) {
				//alert(err.status);
			}
		})
	}
}

$id("next3").onclick = function(){
	var input = document.getElementById("check_code").value;
	var json = {"behaviour":1,"input":parseInt(input)};
	$.ajax({
		type:"POST",
		 url:"/passerby/SendEmailController.do",
		 data:json,
		 typeData:"json",
		 success:function(data) {
			if(data.msg){
				$id("Box4").style.display = "block";
				$id("Box3").style.display = "none";
			}else{
				$id("warning3").html("验证码错误");
				$("#warning3").css("color","red");
				input.html("");
			}
			
		 },
		 error:function(err) {
			//alert(err.status);
		 }
	})
}


//点击输入更换图标
var icon_phone = document.getElementById("icon_phone");
var icon_password_secret = document.getElementById("icon_password_secret");
var icon_password_confirm = document.getElementById("icon_password_confirm");
var text = document.getElementById("text");
var change = document.getElementById("change");

text.onclick = function(){
	icon_password_secret.setAttribute("id","icon_password_secret_2");
	icon_password_confirm.setAttribute("id","icon_password_confirm");
}
change.onclick = function(){
	icon_password_secret.setAttribute("id","icon_password_secret");
	icon_password_confirm.setAttribute("id","icon_password_confirm_2");
}

var password_warning = document.getElementById("password_warning");


$id("last").onblur = function(){
	var email =$id("email");
	var account=$id("number");
	var password=$id("text");
	if(text.value != change.value){
		password_warning.innerHTML = "*前后两次密码不一致，请重写输入";
		change.value = "";
		$("#password_warning").css("color","red");
	}else if(text.value == "" || change.value ==""){
		password_warning.innerHTML = "*你还没输入或确认密码";
		$("#password_warning").css("color","red");
	}else{
		password_warning.innerHTML = "*该密码可使用";
		$("#password_warning").css("color","green");
	}
}
$id("last").onclick = function(){
	var email =$id("email");
	var password=$id("text");
	var account=$id("number");
	if(text.value != change.value){
		$("#password_warning").html("前后两次密码不一致，请重写输入");
		change.value = "";
	}else if(text.value == "" || change.value ==""){
		$("#password_warning").html("你还没输入或确认密码");
	}else{
		$.ajax({
			type:"POST",
			 url:"/passerby/UserController.do",
			 data:{"behaviour":0,"account":account.value,"password":password.value},
			 typeData:"json",
			 success:function(data) {
				if(data.result="true"){
					password_warning.innerHTML = "";
					alert("您的密码已重置，点击确定退出页面重新登录");
					window.location.href = "../matching.html";
				}else if(data.result="database"){
					$id("password_warning").html("数据库写入失败");
				}
			 },
			 error:function(err) {
				alert(err.status);
			 }
		})
	}
}
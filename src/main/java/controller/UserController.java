package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.alibaba.fastjson.JSONObject;
import dao.UserDao;

/**
 * 
 * @author ylr
 *
 */
public class UserController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public UserController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
		//检查账号是否存在
		case 0:
			json.put("result", UserDao.isExist(reqJson.getString("account")));
			break;
		//获取信息
		case 1:
			json = UserDao.getInfo(reqJson.getString("account"));
			break;
		//获取个人圈图片
		case 2:
			Jsonarray = UserDao.getOwnPic(reqJson.getString("account"));
			break;
		//筛选
		case 3:
			json = UserDao.reacher(reqJson.getString("account"), reqJson.getString("tags"),reqJson.getString("sex"),reqJson.getString("school"),reqJson.getString("college"));
			break;
		//密码验证
		case 4:
			json = UserDao.passwordConfirm(reqJson.getString("account"), reqJson.getString("password"));
			break;
		//获取好友信息
		case 5:
			Jsonarray = UserDao.find_Friend(reqJson.getString("account"));
			break;
		
		}
	
		PrintWriter out = response.getWriter();
		if(behaviour != 2 && behaviour != 5) out.write(json.toString());
		else out.write(Jsonarray.toString());
		out.close();
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject json = new JSONObject();
		//执行操作
		int behaviour = reqJson.getInteger("behaviour");
		switch(behaviour) {
		//忘记密码
		case 0:
			json = UserDao.forgetPassowrd(reqJson.getString("account"), reqJson.getString("password"));
			break;
		//更改头像
		case 1:
			json.put("result", UserDao.changeHead(reqJson.getString("account"), reqJson.getString("head")));
			break;
		//更改个人圈图片
		case 2:
			json.put("result", UserDao.changeOwn(reqJson.getString("account"), reqJson.getString("picture"), reqJson.getInteger("ify")));
			break;
		//修改个人信息
		case 3:
			json.put("result", UserDao.changePersonal(reqJson.getString("account"), reqJson.getString("sex"), reqJson.getString("fakename"), reqJson.getString("birthday"), reqJson.getString("school"), reqJson.getString("college"), reqJson.getString("major")));
			break;
		//修改邮箱
		case 4:
			json.put("result", UserDao.changeEmail(reqJson.getString("account"), reqJson.getString("email")));
			break;
		//修改密码
		case 5:
			json.put("result", UserDao.changePassword(reqJson.getString("account"), reqJson.getString("password"), reqJson.getString("oldpassword")));
			break;
		//修改个性签名
		case 6:
			json.put("result", UserDao.changeSinglesex(reqJson.getString("account"), reqJson.getString("singlesex")));
			break;
		//修改标签
		case 7:
			json.put("result", UserDao.changeTags(reqJson.getString("account"), reqJson.getString("tags")));
			break;
		//账号邮箱匹配
		case 8:
			json.put("result", UserDao.isEmail(reqJson.getString("account"), reqJson.getString("email")));
			break;
		//更改个人圈信息
		case 9:
			json.put("result", UserDao.changeOwn(reqJson.getString("account"), reqJson.getString("info")));
			break;
		//律师函
		case 10:
			json.put("result", UserDao.warning(reqJson.getInteger("chatId")));
			break;
		//封号
		case 11:
			json.put("result", UserDao.ban(reqJson.getInteger("chatId")));
			break;
		//没错
		case 12:
			json.put("result", UserDao.unMis(reqJson.getInteger("chatId")));
			break;
		//删除好友
		case 13:
			json.put("result", UserDao.deleteFriend(reqJson.getString("account") ,reqJson.getString("friend")));
			break;
		}
		
		PrintWriter out = response.getWriter();
		out.write(json.toString());
		out.close();
	}

}

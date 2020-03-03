package dao;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.alibaba.fastjson.JSONObject;
import util.C3P0;
import util.MD5;
import util.StaticData;

/**
 * 
 * @author ylr
 *
 */
public class RegisterDao {
	public static JSONObject register(JSONObject json) {
		try {
			String address0 = null;		//学校教务系统
			if(json.getString("school").equals("广东金融学院")) {
				address0 = "http://jwxt.gduf.edu.cn/app.do";
			} else if(json.getString("school").equals("深圳技术大学")) {
				address0 = "http://isea.sztu.edu.cn/app.do";
			}
			String address = address0 + "?method=" + json.getString("method") + "&xh=" + json.getString("xh") + "&pwd=" + json.getString("pwd");
			URL url = new URL(address);
			HttpURLConnection connection = (HttpURLConnection)url.openConnection();
			connection.setRequestMethod("GET");
			connection.setDoInput(true);
			connection.setDoOutput(false);
			connection.setUseCaches(false);
			connection.setConnectTimeout(5000);
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			StringBuffer sb = new StringBuffer();
			String temp = "";
			while((temp = reader.readLine()) != null) {
				sb.append(temp);
			}
			JSONObject resJson = JSONObject.parseObject(sb.toString());
			createAccount(resJson,json.getString("xh"),json.getString("password"),json.getString("pwd"));
			return resJson;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	//创建账号
	private static void createAccount(JSONObject json, String account, String password, String edupassword) {
		try {
			if(json.getString("flag").equals("1")) {
				Connection conn = C3P0.getConnection();
				int id = StaticData.getNextId(0);
				//user表
				PreparedStatement ps = conn.prepareStatement("INSERT INTO user(id, account, password, edupassword, state) values(?,?,?,?,?)");
				ps.setInt(1, id);
				ps.setString(2, account);
				ps.setString(3, MD5.getMD5(password));
				ps.setString(4, MD5.getMD5(edupassword));
				ps.setInt(5, 0);
				ps.execute();
				//school表
				ps = conn.prepareStatement("INSERT into school(id,account,school,college,major,email,phone,sex,name) values(?,?,?,?,?,?,?,?,?)");
				ps.setInt(1, id);
				ps.setString(2, account);
				for(int i = 3; i <= 9; i++) {
					ps.setString(i, "");
				}
				ps.execute();
				//own表
				String path = StaticData.class.getClassLoader().getResource("./").getPath().substring(1);
				//头像	
				String headDir = path + "head/";		//文件夹路径
				String head = (headDir + account + ".png").replace("\\", "/");
				//个人圈图片
				String picture = (path + "ownPicture/" + account + "/").replace("\\", "/");	//文件夹路径
				File tempf = new File(picture);
				if(!tempf.exists()) tempf.mkdir();
				ps = conn.prepareStatement("INSERT INTO own(id,head,good,picture,info,tags,fakename,birthday,friendid,singlesex,redate) values(?,?,?,?,?,?,?,?,?,?,?)");
				ps.setInt(1, id);
				ps.setString(2,head);
				ps.setInt(3, 0);
				ps.setString(4, picture);
				for(int i = 5; i <= 10; i++) {
					ps.setString(i, "");
				}
				//创建时间
				//设置日期格式  
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");           
				// new Date()为获取当前系统时间
				String dateTime=df.format(new Date());
				ps.setString(11,dateTime);
				ps.execute();
				ps.close();
				conn.close();
				json.put("result",true);
			} else {
				json.put("result",false);
			}
		} catch(Exception e) {
			e.printStackTrace();
			json.put("result",false);
		}
	}
}

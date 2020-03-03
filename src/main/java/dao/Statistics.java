package dao;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import com.alibaba.fastjson.JSONObject;
import util.C3P0;

/**
 * 
 * @author ylr
 *
 */
public class Statistics {
	public static void getTagsNums(JSONObject resJson) throws Exception {
		PreparedStatement ps;
		ResultSet rs = null;
		Connection conn = C3P0.getConnection();
		ps = conn.prepareStatement("SELECT * FROM tags WHERE tag=?");
		tagsDoIt(ps, rs, "学习", resJson, "study",true); //学习
		tagsDoIt(ps, rs, "健身", resJson, "bodybuilding",true); //健身
		tagsDoIt(ps, rs, "唱歌", resJson, "sing",true); //唱歌
		tagsDoIt(ps, rs, "听歌", resJson, "listing",true); //听歌
		tagsDoIt(ps, rs, "跳舞", resJson, "dance",true); //跳舞
		tagsDoIt(ps, rs, "吃鸡", resJson, "eatchicken",true); //吃鸡
		tagsDoIt(ps, rs, "考研", resJson, "graduate",true); //考研
		tagsDoIt(ps, rs, "王者", resJson, "king",true); //王者
		tagsDoIt(ps, rs, "漫画", resJson, "carton",true); //漫画
		tagsDoIt(ps, rs, "动漫", resJson, "animation",true); //动漫
		tagsDoIt(ps, rs, "电影", resJson, "movie",true); //电影
		tagsDoIt(ps, rs, "cosplay", resJson, "cosplay",true); //cosplay
		tagsDoIt(ps, rs, "电视", resJson, "television",true); //电视
		tagsDoIt(ps, rs, "看书", resJson, "book",true); //看书
		tagsDoIt(ps, rs, "绘画", resJson, "paint",true); //绘画
		tagsDoIt(ps, rs, "摄影", resJson, "shotshadow",true); //摄影
		tagsDoIt(ps, rs, "吃货", resJson, "eatgood",true); //吃货
		tagsDoIt(ps, rs, "手工", resJson, "handattack",true); //手工
		tagsDoIt(ps, rs, "追星", resJson, "runstar",true); //追星
		tagsDoIt(ps, rs, "旅行", resJson, "travel",true); //旅行
		tagsDoIt(ps, rs, "羽毛球", resJson, "birdball",true); //羽毛球
		tagsDoIt(ps, rs, "夜跑", resJson, "nightrun",true); //夜跑
		tagsDoIt(ps, rs, "足球", resJson, "soccer",true); //足球
		tagsDoIt(ps, rs, "撸猫", resJson, "neco",true); //撸猫
		tagsDoIt(ps, rs, "文学", resJson, "artstudy",true); //文学
		tagsDoIt(ps, rs, "k歌", resJson, "ksing",true); //k歌
		tagsDoIt(ps, rs, "养植物", resJson, "plant",true); //养植物
		tagsDoIt(ps, rs, "养生", resJson, "alive",true); //养生
		conn.close();
	}
	
	private static void tagsDoIt(PreparedStatement ps, ResultSet rs, String tag, JSONObject json, String key,boolean flag) throws Exception {
		int count=0;
		ps.setString(1, tag);
		rs = ps.executeQuery();
		if(flag)
			while(rs.next()) {
				if(rs.getString("tag").equals(tag)) {
					count=count+1;
				}	
			}
		else
			while(rs.next()) {
				if(rs.getString("illegal").equals(tag)) {
					count=count+1;
				}	
			}
		json.put(key,count);
	}
	
	public static void getIllegalNums(JSONObject resJson) throws Exception {
		PreparedStatement ps;
		ResultSet rs = null;
		Connection conn = C3P0.getConnection();
		ps = conn.prepareStatement("SELECT * FROM chat WHERE illegal=?");
		tagsDoIt(ps, rs, "言语辱骂", resJson, "speakfuck",false); //言语辱骂
		tagsDoIt(ps, rs, "挑逗信息", resJson, "speaksex",false); //挑逗信息
		tagsDoIt(ps, rs, "海王", resJson, "findgirls",false); //海王
		tagsDoIt(ps, rs, "垃圾广告", resJson, "rubbish",false); //垃圾广告
		tagsDoIt(ps, rs, "恶意骚扰", resJson, "youaresao",false); //恶意骚扰
		tagsDoIt(ps, rs, "信息诈骗", resJson, "cheat",false); //信息诈骗
		conn.close();
	}
	//聊天记录查询
		public static List<JSONObject> findChat(String account, String friendaccount ) {
			try {
				Connection conn = C3P0.getConnection();
				PreparedStatement ps  = conn.prepareStatement("SELECT chatid,msg,state,date FROM chat WHERE (from_=? and to_=?)or(to_=? and from_=?)");
				ps.setString(1, account);
				ps.setString(2, friendaccount);
				ps.setString(3, friendaccount);
				ps.setString(4, account);
				ResultSet rs = ps.executeQuery();
				String msg="";
				String data="";
				List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
				while(rs.next()){
	            	//读取数据
					JSONObject json = new JSONObject();
	            	msg=rs.getString("msg");
	            	data=rs.getString("data");
	            	json.put("msg",msg);
					json.put("data",data);
					Jsonarray.add(json);
				}
				
				ps.execute();
				ps.close();
				rs.close();
				conn.close();
				return Jsonarray;
			} catch(Exception e) {
				e.printStackTrace();
				List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
				JSONObject json = new JSONObject();
				json.put("result","false");
				Jsonarray.add(json);
				return Jsonarray;
			}
		}
	//个人信息的查看
		public static List<JSONObject> allInfo(int nowpage, int num) {
			try {
				
				Connection conn = C3P0.getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT user.account, fakename, redate,school, college, major, sex FROM user, school, own WHERE user.id = school.id AND school.id = own.id");
				ResultSet rs = ps.executeQuery();
				List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
				String fakename="";
				String redate="";
				String school="";
				String college="";
				String sex="";
				String major="";
				String account = "";
				rs.last();
				int nums = rs.getRow();
				JSONObject json = new JSONObject();
				json.put("nums", nums);
				Jsonarray.add(json);
				if(nums == 0) return Jsonarray;
				rs.absolute(num * (nowpage - 1)+1);
				json = new JSONObject();
            	//读取数据
				account = rs.getString("user.account");
				fakename=rs.getString("fakename");
				redate=rs.getString("redate");
				school=rs.getString("school");
				college=rs.getString("college");
				major=rs.getString("major");
				sex=rs.getString("sex");
				json.put("account", account);
            	json.put("fakename",fakename);
            	json.put("redate",redate);
				json.put("school",school);
				json.put("college",college);
				json.put("major",major);
				if(sex.equals("m")) json.put("sex", "男");
				else json.put("sex", "女");
				Jsonarray.add(json);
				num--;
				while(rs.next()){
					if(num == 0) break;
					json = new JSONObject();
	            	//读取数据
					account = rs.getString("user.account");
					fakename=rs.getString("fakename");
					redate=rs.getString("redate");
					school=rs.getString("school");
					college=rs.getString("college");
					major=rs.getString("major");
					sex=rs.getString("sex");
					json.put("account", account);
	            	json.put("fakename",fakename);
	            	json.put("redate",redate);
					json.put("school",school);
					json.put("college",college);
					json.put("major",major);
					if(sex.equals("m")) json.put("sex", "男");
					else json.put("sex", "女");
					Jsonarray.add(json);
					num--;
				}
				
				ps.execute();
				ps.close();
				rs.close();
				conn.close();
				return Jsonarray;
			} catch(Exception e) {
				e.printStackTrace();
				List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
				JSONObject json = new JSONObject();
				json.put("result","false");
				Jsonarray.add(json);
				return Jsonarray;
			}
		}
		
		//获取未处理的举报信息
		public static List<JSONObject> unDoIllegal(int nowpage, int num) {
			List<JSONObject> jsonarray = new ArrayList<JSONObject>();
			try {
				Connection conn = C3P0.getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT * FROM chat WHERE state = 1");
				ResultSet rs = ps.executeQuery();
				JSONObject json = new JSONObject();
				rs.last();
				int nums = rs.getRow();
				json.put("nums", nums);
				jsonarray.add(json);
				rs.absolute(num * (nowpage - 1)+1);
				json = new JSONObject();
				json.put("chatId", rs.getInt(1));
				json.put("from_", rs.getString(2));
				json.put("to_", rs.getString(3));
				json.put("msg", rs.getString(4));
				json.put("state", rs.getInt(5));
				json.put("date", rs.getString(6));
				json.put("illegal", rs.getString(7));
				jsonarray.add(json);
				num--;
				while(rs.next()) {
					if(num == 0) break;
					json = new JSONObject();
					json.put("chatId", rs.getInt(1));
					json.put("from_", rs.getString(2));
					json.put("to_", rs.getString(3));
					json.put("msg", rs.getString(4));
					json.put("state", rs.getInt(5));
					json.put("date", rs.getString(6));
					json.put("illegal", rs.getString(7));
					jsonarray.add(json);
					num--;
				}
				ps.close();
				rs.close();
				conn.close();
			} catch(Exception e) {
				e.printStackTrace();
			}
			return jsonarray;
		}
}

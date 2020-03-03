package dao;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
import util.C3P0;
import util.MD5;

/**
 * 
 * @author ylr
 *
 */
public class UserDao {
	//检查账号是否存在
	public static boolean isExist(String account) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT account FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			boolean result = rs.last();
			rs.close();
			ps.close();
			conn.close();
			return result;
		} catch (SQLException e) {
			e.printStackTrace();
			return true;
		}
	}
	//检查账号邮箱是否匹配
		public static boolean isEmail(String account,String email) {
			try {
				Connection conn = C3P0.getConnection();
				PreparedStatement ps = conn.prepareStatement("SELECT email FROM school WHERE account=?");
				ps.setString(1, account);
				ResultSet rs = ps.executeQuery();
				rs.first();
				String dbemail = rs.getString(1);				
				rs.close();
				ps.close();
				conn.close();
				return email.equals(dbemail);
			} catch (SQLException e) {
				e.printStackTrace();
				return false;
			}
		}
	//获取信息
	public static JSONObject getInfo(String account) {
		JSONObject json = new JSONObject();
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT fakename, head, school, college, major, singlesex, tags, info, sex, redate,birthday FROM user, school, own WHERE user.id = school.id AND school.id = own.id AND user.account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			json.put("friendaccount", account);
			json.put("fakename", rs.getString(1));
			json.put("birthday", rs.getString(11));
			//头像
			File f = new File(rs.getString(2));
			if(f.exists()) {
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] head = new byte[in.available()];
				in.read(head);
				in.close();
				String base64 = new BASE64Encoder().encode(head);
				json.put("head",base64);
			} else {		//无头像
				json.put("head", "");
			}
			json.put("school", rs.getString(3));
			json.put("college",rs.getString(4));
			json.put("major",rs.getString(5));
			json.put("singlesex",rs.getString(6));
			json.put("tags", rs.getString(7));
			json.put("info", rs.getString(8));
			String sex = rs.getString(9);
			if(sex.equals("m")) json.put("sex", "男");
			else json.put("sex", "女");
			json.put("result", "true");
			json.put("redate", rs.getString(10));
			rs.close();
			ps.close();
			conn.close();
		} catch(Exception e) {
			e.printStackTrace();
			json.put("result","false");
		}
		return json;
	}
	
	//获取个人圈图片
	public static List<JSONObject> getOwnPic(String account) {
		List<JSONObject> arr = new ArrayList<JSONObject>();
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT picture FROM own, user WHERE account=? AND own.id = user.id");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String path = rs.getString(1);
			File dir = new File(path);
			File[] pictures = dir.listFiles();
			JSONArray jsonArr = new JSONArray();
			for(File ftemp : pictures) {
				JSONObject json = new JSONObject();
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(ftemp));
				byte[] picture = new byte[in.available()];
				in.read(picture);
				in.close();
				String base64 = new BASE64Encoder().encode(picture);
				json.put("picture", base64);
				arr.add(json);
			}
			conn.close();
		} catch(Exception e) {
			e.printStackTrace();
		}
		return arr;
	}
	
	//筛选
	public static JSONObject reacher(String account, String tags,String sex,String school,String college) {
		JSONObject json = new JSONObject();
		try {
			Connection conn = C3P0.getConnection();
			Statement stmt = conn.createStatement();
			StringBuffer tempTags = new StringBuffer();
			tempTags.append("select account from tags, school where tags.id=school.id ");
			if(tags!="") {
				tempTags.append("AND tag='" + tags + "' ");
			}

			//性别
				String reacherSex =sex;
				if(reacherSex!="") {
					if(reacherSex.equals("男"))
						tempTags.append("AND sex=" + "'m'" + " ");
					else
						tempTags.append("AND sex=" + "'f'" + " ");
				}
				
			//学校
				String reacherSchool = school;
				if(reacherSchool!="") {
					tempTags.append("AND school='" + reacherSchool + "' ");
				}
				
			//学院
				String reacherCollege = college;
				if(reacherCollege!="") {
					tempTags.append("AND college='" + reacherCollege + "' ");
				}
			ResultSet rs = stmt.executeQuery(tempTags.toString());
			rs.last();
			int rows = rs.getRow();
			if(rows != 0) {
				String targetAccount;
				boolean flag = true;
				
				int rand = new Random().nextInt(rows);
				rs.absolute(rand+1);
				targetAccount = rs.getString(1);
				Map<String, Chat> map = Chat.getMap();
				while(map.get(targetAccount) == null || targetAccount.equals(account)) {
					if(rs.next()) {
						if(rs.getRow() == rand + 1) {
							flag = false;
							break;
						}
					} else {
						if(rows == 1) {
							flag = false;
							break;
						}
						rs.first();
					}
					targetAccount = rs.getString(1);
				}		
				rs.close();
				stmt.close();
				if(flag) json = getInfo(targetAccount);
				conn.close();
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		return json;
	}
	
	//密码验证
	public static JSONObject passwordConfirm(String account, String password) {
		String dbpassword = null;
		JSONObject json = new JSONObject();
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT password, state FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			dbpassword = rs.getString(1);
			if(rs.getInt(2) == 2) json.put("state", false);
			else json.put("state", true);
			conn.close();
			if(MD5.getMD5(password).equals(dbpassword)) json.put("result",true);
			else json.put("result",false);
		} catch(Exception e) {
			e.printStackTrace();
			json.put("result",false);
			return json;
		}
		return json;
	}
	
	//忘记密码
	public static JSONObject forgetPassowrd(String account, String password) {
		JSONObject json = new JSONObject();
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE user SET password=? WHERE account=?");
			ps.setString(1, MD5.getMD5(password));
			ps.setString(2, account);
			if(!ps.execute()) json.put("result", "database");
			else json.put("result","true");
			ps.close();
			conn.close();
		} catch(Exception e) {
			json.put("result", "database");
			e.printStackTrace();
		}
		return json;
	}
	
	//更改头像
	public static boolean changeHead(String account, String headBase64) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT head FROM user, own WHERE user.id = own.id AND account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			File f = new File(rs.getString(1));
			BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(f));
			String head0 = headBase64.replaceAll("%2F","/").replaceAll("%2B", "+");
			byte[] head = new BASE64Decoder().decodeBuffer(head0);
			out.write(head);
			out.close();
			rs.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//更改个人圈图片
	public static boolean changeOwn(String account, String pictureBase64, int ify) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT picture FROM user,own WHERE user.id = own.id AND account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String path = rs.getString(1);
			rs.close();
			ps.close();
			for(int i = ify + 1; i <= 4; i++) {
				File temp = new File(path + account + i + ".png");
				if(!temp.exists()) break; 
				temp.delete();
			}
			path = path + account + ify + ".png";
			File picture = new File(path);
			BufferedOutputStream outPicture = new BufferedOutputStream(new FileOutputStream(picture));
			String picture0 = pictureBase64.replaceAll("%2F","/").replaceAll("%2B", "+");
			byte[] pictureBin = new BASE64Decoder().decodeBuffer(picture0);
			outPicture.write(pictureBin);
			outPicture.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//更改个人圈信息
	public static boolean changeOwn(String account, String info) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE own, user SET info=? WHERE account=? AND user.id = own.id");
			ps.setString(1, info);
			ps.setString(2, account);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改邮箱
	public static boolean changeEmail(String account, String email) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE school SET email=? WHERE account=?");
			ps.setString(1, email);
			ps.setString(2, account);
			ps.execute();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改密码
	public static boolean changePassword(String account, String password, String oldpassword) {
		try {
			Connection conn = C3P0.getConnection();
			String md5password = MD5.getMD5(password);
			String md5oldpassword = MD5.getMD5(oldpassword);
			PreparedStatement ps = conn.prepareStatement("SELECT password FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			if(rs.getString(1).equals(md5oldpassword)) {
				PreparedStatement ps1 = conn.prepareStatement("UPDATE user SET password=? WHERE account=?");
				ps1.setString(1, md5password);
				ps1.setString(2, account);
				ps1.execute();
				ps1.close();
				rs.close();
				ps.close();
				conn.close();
				return true;
			} else {
				rs.close();
				ps.close();
				conn.close();
				return false;
			}
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改个人信息
	public static boolean changePersonal(String account, String sex, String fakename, String birthday, String school, String college, String major) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE school, own SET sex=?, fakename=?, birthday=?, school=?, college=?, major=? WHERE school.id = own.id AND account=?");
			if(sex.equals("男")) ps.setString(1, "m");
			else ps.setString(1, "f");
			ps.setString(2, fakename);
			ps.setString(3, birthday);
			ps.setString(4, school);
			ps.setString(5, college);
			ps.setString(6, major);
			ps.setString(7,account);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改个性签名
	public static boolean changeSinglesex(String account, String singlesex) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE own, user SET singlesex=? WHERE own.id = user.id AND account=?");
			ps.setString(1, singlesex);
			ps.setString(2, account);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//修改标签
	public static boolean changeTags(String account, String tags) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM user WHERE account=?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			int id = rs.getInt(1);
			rs.close();
			ps.close();
			ps = conn.prepareStatement("DELETE FROM tags WHERE id=?");
			ps.setInt(1, id);
			ps.execute();
			ps.close();
			ps = conn.prepareStatement("UPDATE own SET tags=? WHERE id=?");
			ps.setString(1, tags);
			ps.setInt(2, id);
			ps.execute();
			ps.close();
			String[] tagsArr = tags.split("&");
			ps = conn.prepareStatement("INSERT INTO tags(id,tag) VALUES(?,?)");
			ps.setInt(1, id);
			for(String tag : tagsArr) {
				ps.setString(2, tag);
				ps.execute();
			}
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//警告
	public static boolean warning(int chatId) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE chat, user SET chat.state = ?, user.state = ? WHERE chatid = ? AND from_ = user.account");
			ps.setInt(1, 2);
			ps.setInt(2, 1);
			ps.setInt(3, chatId);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	//封号
	public static boolean ban(int chatId) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE chat, user SET chat.state = ?, user.state = ? WHERE chatid = ? AND from_ = user.account");
			ps.setInt(1, 4);
			ps.setInt(2, 2);
			ps.setInt(3, chatId);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//添加好友
	public static boolean add_Friend(String friendid,String account) {
		try {
			
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT friendid from own,user WHERE user.id = own.id AND user.account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String friendids=rs.getString(1);
			if(friendids.equals("")) {
				friendids=friendid;
			}else {
				friendids=friendids+","+friendid;
			}
			ps.close();
			rs.close();
			
			PreparedStatement ps1 = conn.prepareStatement("UPDATE own,user SET own.friendid = ? WHERE user.id = own.id AND user.account = ?");
			ps1.setString(1, friendids);
			ps1.setString(2, account);
			ps1.execute();
			ps1.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//查找好友
	public static List<JSONObject> find_Friend(String account) {
		JSONObject json = new JSONObject();
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT friendid from own , user WHERE user.id = own.id AND user.account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String friendid= rs.getString(1);
			List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
			rs.close();
			ps.close();
			if(!friendid.equals("")) {
				String[] friends=friendid.split(",");
				for(int i=0;i<friends.length;i++) {
					//每位好友的昵称头像
					PreparedStatement ps1 = conn.prepareStatement("SELECT fakename,head from own,user WHERE user.id = own.id AND user.account = ?");
					ps1.setString(1, friends[i]);
					ResultSet rs1 = ps1.executeQuery();
					rs1.first();
					String fakename= rs1.getString(1);
					json.put("friendid", friends[i]);//id
					json.put("fakename", fakename);//昵称
					//头像
					File f = new File(rs1.getString(2));
					if(f.exists()) {
						BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
						byte[] head = new byte[in.available()];
						in.read(head);
						in.close();
						String base64 = new BASE64Encoder().encode(head);
						json.put("head",base64);
					} else {		//无头像
						json.put("head", "");
					}
					Jsonarray.add(json);
					ps1.close();
					rs1.close();
				}
			}
			conn.close();
			return Jsonarray;
		} catch(Exception e) {
			e.printStackTrace();
			List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
			return Jsonarray;
		}
	}
	//删除好友
	public static boolean deleteFriend(String account,String friend) {
		try {
			
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT friendid from own , user WHERE user.id = own.id AND user.account = ?");
			ps.setString(1, account);
			ResultSet rs = ps.executeQuery();
			rs.first();
			String friendid= rs.getString(1);
			rs.close();
			ps.close();
			String after="";
			if(!friendid.equals("")) {
				String[] friends=friendid.split(",");
				for(int i=0;i<friends.length;i++) {
					if(friends[i].equals(friend)) {
						after=after;
					}else {
						if(after.equals("")) {
							after=friends[i];
						}else {
							after=after+","+friends[i];
						}
					}
					
				}
			}
			ps.close();
			rs.close();
			
			PreparedStatement ps1 = conn.prepareStatement("UPDATE own,user SET own.friendid = ? WHERE user.id = own.id AND user.account = ?");
			ps1.setString(1, after);
			ps1.setString(2, account);
			ps1.execute();
			ps1.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//没错
	public static boolean unMis(int chatId) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("SELECT user.state FROM user, chat WHERE chatid = ? AND from_ = user.account");
			ps.setInt(1, chatId);
			ResultSet rs = ps.executeQuery();
			rs.next();
			int state = rs.getInt(1); 
			rs.close(); 
			ps.close();
			ps = conn.prepareStatement("UPDATE chat, user SET chat.state = ?, user.state = ? WHERE chatid = ? AND from_ = user.account");
			ps.setInt(1, 0);
			ps.setInt(2, state);
			ps.setInt(3, chatId);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
}

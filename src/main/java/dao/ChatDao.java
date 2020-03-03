package dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import util.C3P0;

/**
 * 
 * @author ylr
 *
 */
public class ChatDao {
	//聊天举报
	public static boolean illegal(String account, String date, String illegal) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps = conn.prepareStatement("UPDATE chat SET illegal=?, state=1 WHERE from=? AND date=?");
			ps.setString(1, illegal);
			ps.setString(2, account);
			ps.setString(3, date);
			ps.execute();
			ps.close();
			conn.close();
			return true;
		} catch(Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	//聊天记录查询
	public static String findInfo(String account, String friendaccount ) {
		try {
			Connection conn = C3P0.getConnection();
			PreparedStatement ps  = conn.prepareStatement("SELECT from,to,msg,data FROM chat WHERE from=? and to=?");
			ps.setString(1, account);
			ps.setString(2, friendaccount);
			ResultSet rs = ps.executeQuery();
			String msg="";
			String data="";
			
			while(rs.next()){
            	//读取数据
            	msg=rs.getString("chatinfo");
            	data=rs.getString("data");
			}
			String allmsg=account+","+friendaccount+","+msg+","+data;
			ps.execute();
			ps.close();
			conn.close();
			return allmsg;
		} catch(Exception e) {
			e.printStackTrace();
			return "noinfo";
		}
	}
	
	
}

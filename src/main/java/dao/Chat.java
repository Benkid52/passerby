package dao;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.*;
import javax.websocket.server.*;

import com.alibaba.fastjson.JSONObject;

import sun.misc.BASE64Encoder;
import util.C3P0;
import util.StaticData;

/**
 * 
 * @author ylr
 *
 */
@ServerEndpoint(value = "/Chat/{account}")
public class Chat {
	//连接数
	private static long onlineCount = 0;
	//记录用户对应的对象
	private static Map<String, Chat> clients = new ConcurrentHashMap<String, Chat>();
	//账号
	private String account;
	//会话
	private Session session;
	//是否在线
	boolean online = true;
	
	public static Map<String, Chat> getMap() {
		return clients;
	}
	
	@OnOpen
	public void onOpen(Session session, @PathParam("account") String account) throws IOException, SQLException {
		//建立连接
		this.session = session;
		this.account = account;
		onlineCount++;
		clients.put(account, this);
		Connection conn = C3P0.getConnection();
		//查询是否有未发送的信息
		PreparedStatement ps = conn.prepareStatement("SELECT * FROM chat WHERE to_=? AND state=?");
		ps.setString(1, account);
		ps.setInt(2, 3);	//3表示未发送的消息
		ResultSet rs = ps.executeQuery();
		rs.beforeFirst();
		while(rs.next()) {
			this.session.getBasicRemote().sendText(rs.getString(6) + "," + rs.getString(2) + "," + rs.getString(3) + "," + rs.getString(4));
		}
		rs.close();
		ps.close();
		//查询是否被警告
		ps = conn.prepareStatement("SELECT date FROM chat WHERE from_=? AND state=?");
		ps.setString(1, account);
		ps.setInt(2, 2);
		rs = ps.executeQuery();
		rs.beforeFirst();
		while(rs.next()) {
			this.session.getBasicRemote().sendText("warn," + rs.getString("date"));
		}
		rs.close();
		ps.close();
		conn.close();
	}
	
	@OnClose
	public void onClose() {
		online = false;
		clients.remove(account);
	}
	
	@OnMessage
	public void onMessage(String message) throws IOException, SQLException {
		PreparedStatement ps;
		String[] msgs = message.split(",",3);
		String from, to, msg;		
		Connection conn = C3P0.getConnection();
		if(msgs[0].equals("illegal")) {		//举报   illegal,date,from,to,why
			msgs = message.split(",",5);
			String date = msgs[1];
			from = msgs[2];
			to = msgs[3];
			msg = msgs[4];		
			ps = conn.prepareStatement("UPDATE chat SET state=?, illegal=? WHERE from_=? AND to_=? AND date=?");
			ps.setInt(1, 1);
			ps.setString(2, msg);
			ps.setString(3, from);
			ps.setString(4, to);
			ps.setString(5, date);
			ps.execute();
			ps.close();
			this.session.getBasicRemote().sendText("admin,举报成功");
		} else if(msgs[0].equals("timeup")) {	//加时  timeup,from,to
			msgs = message.split(",",3);
			from = msgs[1];
			to = msgs[2];
			Chat client = clients.get(to);
			if(client == null) {
				this.session.getBasicRemote().sendText("admin,对方已下线");
			} else {
				client.session.getBasicRemote().sendText("admin," + from + ",申请加时");
			}
		} else if(msgs[0].equals("restimeup")) {	//是否同意加时 restimeup,from,answer
			msgs = message.split(",",3);
			from = msgs[1];
			Chat client = clients.get(from);
			if(client == null) {
				this.session.getBasicRemote().sendText("admin,对方已下线");
			} else {
				client.session.getBasicRemote().sendText("admin,同意与否,"+msgs[2]);
			}
		} else if(msgs[0].equals("add_friend")) {	//添加好友  add_friend,from,to
			msgs = message.split(",",3);
			from = msgs[1];
			to = msgs[2];
			boolean flag=false;
			conn = C3P0.getConnection();
			PreparedStatement ps1 = conn.prepareStatement("SELECT friendid from own , user WHERE user.id = own.id AND user.account = ?");
			ps1.setString(1, account);
			ResultSet rs = ps1.executeQuery();
			rs.first();
			String friendid= rs.getString(1);
			if(!friendid.equals("")) {
				String[] friends=friendid.split(",");
				for(int i=0;i<friends.length;i++) {
					if(to.equals(friends[i])) flag=true;
				}
			}
			if(!flag) {
				Chat client = clients.get(to);
				if(client == null) {
					this.session.getBasicRemote().sendText("friend,对方已下线");
				}else {
					client.session.getBasicRemote().sendText("friend," + from + ",申请好友");
				}
			}else {
				this.session.getBasicRemote().sendText("friend,对方已是你的好友");
			}
			ps1.close();
			rs.close();
		} else if(msgs[0].equals("add_answer")) {	//是否同意添加为好友 add_answer,to,from,answer
			msgs = message.split(",",4);
			to=msgs[1];
			from = msgs[2];
			Chat client1 = clients.get(to);
			Chat client2 = clients.get(from);
			if(client1 == null) {
				this.session.getBasicRemote().sendText("friend,对方已下线");
			} else {
				if(msgs[3].equals("同意")) {
					boolean result=UserDao.add_Friend(msgs[1],msgs[2]);
					result=UserDao.add_Friend(msgs[2],msgs[1]);
					if(result) {
						client1.session.getBasicRemote().sendText("friend,同意与否,"+msgs[3]);
						client2.session.getBasicRemote().sendText("friend,同意与否,我"+msgs[3]);
					}
				}
			}
		}else if(msgs[0].equals("chat_answer")) {	//是否同意聊天 chat_answer,from,answer
			from = msgs[1];
			Chat client = clients.get(from);
			if(client == null) {
				this.session.getBasicRemote().sendText("chat_request,对方已下线");
			} else {
				client.session.getBasicRemote().sendText("chat_request,同意与否,"+msgs[2]);
			}
		}  else if(msgs[0].equals("chat_no")) {	//是否同意聊天 chat_no,from,answer
			from = msgs[1];
			to= msgs[2];
			Chat client = clients.get(to);
			if(client == null) {
				this.session.getBasicRemote().sendText("chat_no,对方已下线");
			} else {
				client.session.getBasicRemote().sendText("chat_no,关闭聊天,"+msgs[1]);
			}
		} else if(msgs[0].equals("chat")) {	//申请聊天 chat,from,to
			from = msgs[1];
			to = msgs[2];
			ps = conn.prepareStatement("SELECT fakename,head FROM user, own WHERE user.id = own.id AND account = ?");
			ps.setString(1, from);
			ResultSet rs = ps.executeQuery();
			rs.first();
			Chat client = clients.get(to);
			//头像
			String base64;
			File f = new File(rs.getString(2));
			if(f.exists()) {
				BufferedInputStream in = new BufferedInputStream(new FileInputStream(f));
				byte[] head = new byte[in.available()];
				in.read(head);
				in.close();
				base64 = new BASE64Encoder().encode(head);
			} else {		//无头像
				base64="";
			}
			if(client == null) {
				this.session.getBasicRemote().sendText("chat_request,对方已下线");
			} else {
				client.session.getBasicRemote().sendText("chat_request," + from + ",申请聊天"+","+rs.getString(1)+","+base64);
			}
			ps.close();
			rs.close();
		} else {	//信息交互
			//发送信息   from,to,flag,msg  接收信息  date,from,to,flag,msg
			ps = conn.prepareStatement("INSERT INTO chat(chatid,from_,to_,msg,state,date) VALUES(?,?,?,?,?,?)");
			ps.setInt(1, StaticData.getNextId(1));
			from = msgs[0];
			to = msgs[1];
			msg = msgs[2];
			ps.setString(2, from);
			ps.setString(3, to);
			ps.setString(4, msg);
			Date date = new Date();
			DateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
			String sdate = format.format(date);
			ps.setString(6, sdate);
			Chat client = clients.get(to);		//目标
			if(client == null) ps.setInt(5, 3);
			else {
				ps.setInt(5, 0);
				client.session.getBasicRemote().sendText(sdate+","+message);
			}
			this.session.getBasicRemote().sendText(sdate+","+message);
			ps.execute();
			ps.close();
		}
		conn.close();
	}
	
	@OnError
	public void onError(Session session, Throwable error) {
		error.printStackTrace();
	}
}

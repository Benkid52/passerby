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

import dao.Statistics;

/**
 * 
 * @author ylr
 *
 */
public class StatisticsController extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public StatisticsController() {
        super();
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONObject reqJson = (JSONObject)request.getAttribute("json");
		JSONObject resJson = new JSONObject();
		List<JSONObject> Jsonarray=new ArrayList<JSONObject>();
		try {
			switch(reqJson.getInteger("behaviour")) {
			//标签
			case 0:
				Statistics.getTagsNums(resJson);
				break;
			//举报
			case 1:
				Statistics.getIllegalNums(resJson);
				break;
			//查询
			case 2:
				Jsonarray=Statistics.findChat(reqJson.getString("account"),reqJson.getString("friendaccount"));
				break;
			//信息
			case 3:
				Jsonarray=Statistics.allInfo(reqJson.getInteger("nowpage"),reqJson.getInteger("num"));
				break;
			//未处理举报信息
			case 4:
				Jsonarray = Statistics.unDoIllegal(reqJson.getInteger("nowpage"),reqJson.getInteger("num"));
				break;
			}
			if(reqJson.getInteger("behaviour")==0||reqJson.getInteger("behaviour")==1) {
				PrintWriter out = response.getWriter();
				out.write(resJson.toString());
				out.close();
			}else {
				PrintWriter out = response.getWriter();
				out.write(Jsonarray.toString());
				out.close();
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}

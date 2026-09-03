package com.auction.controller;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.xml.bind.JAXBException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.auction.model.Auction;
import com.auction.model.Player;
import com.auction.model.Team;
import com.auction.service.AuctionService;
import com.auction.util.AuctionUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.auction.util.AuctionFunctions;

@Controller
public class IndexController 
{
	@Autowired
	AuctionService auctionService;

	public static String expiry_date = "2026-12-31";
	public static String current_date = "";
	public static String error_message = "";
	public static Auction session_auction;
	public static long last_match_time_stamp = 0;
	public static Auction session_current_bid;
	public static String session_selected_broadcaster;
	public static boolean is_this_updating = false;
	public static ObjectMapper objectMapper = new ObjectMapper();
	List<Team> session_team = new ArrayList<Team>();
	List<Player> session_player = new ArrayList<Player>();
	
	@RequestMapping(value = {"/","/initialise"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String initialisePage(ModelMap model) throws JAXBException, IOException, ParseException 
	{
		if(current_date == null || current_date.isEmpty()) {
			current_date = AuctionFunctions.getOnlineCurrentDate();
		}
		
		return "initialise";
	}
	@RequestMapping(value = {"/auction"}, method={RequestMethod.GET,RequestMethod.POST}) 
	public String auctionPage(ModelMap model,
			@RequestParam(value = "selectedBroadcaster", required = false, defaultValue = "") String selectedBroadcaster) 
					throws JAXBException, IOException, ParseException 
	{
		if(current_date == null || current_date.isEmpty()) {
			current_date = AuctionFunctions.getOnlineCurrentDate();
		}
		if(current_date == null || current_date.isEmpty()) {
			model.addAttribute("error_message","You must be connected to the internet online");
			return "error";
		} else if(new SimpleDateFormat("yyyy-MM-dd").parse(expiry_date).before(new SimpleDateFormat("yyyy-MM-dd").parse(current_date))) {
			model.addAttribute("error_message","This software has expired");
			return "error";
		}else {
			session_selected_broadcaster = selectedBroadcaster;
			model.addAttribute("session_selected_broadcaster", session_selected_broadcaster);
			
			session_current_bid = new Auction();
			session_auction = new Auction();
			
			return "auction";
		}
	}
	
	@RequestMapping(value = {"/processAuctionProcedures.html"}, method={RequestMethod.GET,RequestMethod.POST})    
	public @ResponseBody String processAuctionProcedures(
			@RequestParam(value = "whatToProcess", required = false, defaultValue = "") String whatToProcess,
			@RequestParam(value = "valueToProcess", required = false, defaultValue = "") String valueToProcess)
					throws JAXBException, IllegalAccessException, InvocationTargetException, IOException, 
					NumberFormatException, InterruptedException
	{	
		switch (whatToProcess.toUpperCase()) {
	    case "READ-MATCH-AND-POPULATE":
	        
	        session_auction = new ObjectMapper().readValue(
	                new File(AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.AUCTION_JSON), 
	                Auction.class
	        );

	        session_auction = AuctionFunctions.populateMatchVariables(session_auction, session_player, session_team);

	        last_match_time_stamp = new File(
	                AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.AUCTION_JSON
	        ).lastModified();

	        if (new File(AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.CURRENT_BID_JSON).exists()) {
	            session_current_bid = new ObjectMapper().readValue(
	                    new File(AuctionUtil.AUCTION_DIRECTORY + AuctionUtil.CURRENT_BID_JSON), 
	                    Auction.class
	            );
	        }
       
	        Map<String, Object> response = new HashMap<>();
	        response.put("auction", session_auction);
	        response.put("currentBid", session_current_bid);

	        return objectMapper.writeValueAsString(response);

	    default:
	    	
	    	Map<String, Object> defaultResponse = new HashMap<>();
	    	defaultResponse.put("auction", session_auction);
	    	defaultResponse.put("currentBid", session_current_bid);

	        return defaultResponse.toString();
	}
	
		
	}
}
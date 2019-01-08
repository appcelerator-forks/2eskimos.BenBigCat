/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

// Creating TableRow

//1.9 SDK7 - Replaced include with require
/*Ti.include(
	'/MainMiscue/ui/Apifile.js'
	);*/
	
var r_Apifile = require('/MainMiscue/ui/Apifile');

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue.js'); 

//V1.9 SDK7 - Added require for loadingScreen
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen');

//V1.9 SDK7 - Added require for styles
var r_styles = require('/MainMiscue/ui/styles');
	
		
(function() 
{
	//1.9 SDK7 - Added r_miscue as tt is undefined
	//tt.ui.createLearnerWindow = function(usrname,groupname,token,button_Id,user_Id,menuItemKey) {
	r_miscue.tt.ui.createLearnerWindow = function(usrname,groupname,token,button_Id,user_Id,menuItemKey) 
	{
		// Getting windows width and height
		var pWidth = Ti.Platform.displayCaps.platformWidth;
    	//Opens the database
		var db = Titanium.Database.open('Miscue');
		var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',user_Id);
		// Extracting the usersetting values from local database
		var schoolnames = homerow.fieldByName('schoolName');
		var backpage = homerow.fieldByName('backPage');
		var backcolour = homerow.fieldByName('backgroundColor');
		var fontcolour = homerow.fieldByName('fontColor');
		var pagefontfamily = homerow.fieldByName('charFont');
		var learnerWindowBackgroundImage = homerow.fieldByName('selectionPagebackgroundURL');
		var dec = Ti.Utils.base64decode(schoolnames);
		//BackButton
		//V1.9 SDK7 - Added r_loadingScreen
    	var backView = r_loadingScreen.createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
		homerow.close();
		homerow = null;
		db.close();
		db = null;
		//V1.9 SDK7 - Added r_loadingScreen
		var iOS7 = r_loadingScreen.isiOS7Plus();
		//Creating learner window
	
		var learnerWind = Ti.UI.createWindow(
		{
			fullscreen:true, //mal
			navBarHidden:true,
			title:'Miscue',
			tabBarHidden:true,
			backgroundColor:'white'
		});
	      
		if(iOS7 >= 7)
    	{
    		learnerWind.top = '20dp';
    	}
    
    	//V1.9 SDK7 - Added r_loadingScreen
    	var Inch = r_loadingScreen.screenInch();    
    	//var Inch = screenInch();
    	//V1.9 SDK7 - Added r_loadingScreen
    	var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(learnerWindowBackgroundImage);
    	//var screenBackgroundImage = mainBackgroundImage(learnerWindowBackgroundImage);
	    
    	//V1.9 SDK7 - Added r_loadingScreen
    	var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
    	//var screenRes = backgroundImageHeightWidthPxToDp();
    	var osname = Ti.Platform.osname;
    	Ti.API.info('osname: '+osname);
    	
    	if (osname == 'iphone' || osname == 'ipad') 
    	{
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
		}
		else
		{
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
		}          
    
	    screenBackgroundImage[1].width = screenRes[0];
	          
	    if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
	    {
	    	backView.height = 70;
	        backView.width = 135;
	        screenBackgroundImage[1].height = screenRes[1];
			Ti.API.info('Initial height for landscape '+screenBackgroundImage[1].height);
	    }
	    else
	    {
	    	if (osname == 'ipad' || osname == 'iphone') 
	    	{
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
				Ti.API.info('Initial height for portrait ipad and iPhone '+screenBackgroundImage[1].height);
			}
			else
			{
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
				Ti.API.info('Initial height for portrait android'+screenBackgroundImage[1].height);	
			}
	        
	        if(Inch >= InchValue)
	        {
	       		if (osname == 'iphone' || osname == 'ipad') 
	       		{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
					Ti.API.info('Inch Height for iphone or ipad(portrait)'+screenBackgroundImage[1].height);
				}
				else
				{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 100));
					Ti.API.info('Inch Height for android(portrait)'+screenBackgroundImage[1].height);	
				}
	            
	            backView.height = 80;
	            backView.width = 145;
	        }
	    }
	    
	    learnerWind.add(screenBackgroundImage[0]);
	      
		if(osname == 'iphone')
	    {
	        backView.height = 48;
	        backView.width = 78;
	    }
		  
		if(Inch < InchValue && osname == 'android')
		{
			backView.height = 50;
	        backView.width = 80;
		  	learnerWind.orientationModes = [Titanium.UI.PORTRAIT];
		}
		else if(osname == 'android')
		{
			learnerWind.orientationModes = [Titanium.UI.PORTRAIT];
		}      
		 
		//Oreintation changes event listner
	    Ti.Gesture.addEventListener('orientationchange',  orientionChangeMode);
	    function orientionChangeMode(e) 
	    {
	    	//V1.9 SDK7 - Added r_loadingScreen
	      	var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
	        //var screenRes = backgroundImageHeightWidthPxToDp();          
	        screenBackgroundImage[1].width = screenRes[0];
	     	//V1.9 SDK7 - isLandscape is no longer a function
			//if (Ti.Gesture.isLandscape()) {
			if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) 
			{
	      		if (Inch >= InchValue || osname=='ipad') 
	      		{
	      			screenBackgroundImage[1].height = screenRes[1];
					Ti.API.info('or change landscape'+screenBackgroundImage[1].height);
	                backView.height = 70;
	                backView.width = 135;	
	      		}      	
	      	}
	   		else
	   		{
	   			if (osname == 'ipad'  || osname == 'iphone') 
	   			{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
					Ti.API.info('or change portrair ipad and iPhone'+screenBackgroundImage[1].height);
				}
				else
				{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
					Ti.API.info('or change portrair android'+screenBackgroundImage[1].height);	
				}
	            if(Inch >= InchValue)
	            {
	            	if (osname == 'iphone' || osname == 'ipad') 
	            	{
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
						Ti.API.info('or change inch > value portrair iphone or ipad'+screenBackgroundImage[1].height);
					}
					else
					{
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 100));
						Ti.API.info('or change inch > value portrair android'+screenBackgroundImage[1].height);	
					}
	                backView.height = 80;
	                backView.width = 145;
	            }
	   		}   
	   	    //V1.9 SDK7 - Added r_loadingScreen
	        var portraitval = r_loadingScreen.dptopixel();
	        //var portraitval = dptopixel();
		}   
		
		//V1.9 SDK7 - Added r_loadingScreen
	    var top = r_loadingScreen.titleLabeltop();
	    //var top = titleLabeltop();
	     
	    learnerWind.addEventListener('close',function(e)
	    {
	    	Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode);
	   	});
	     
	    //Back button functionality     
	    backView.addEventListener('click', function (e) 
	    {
	  	 	tableView.removeEventListener('click', tableViewClickEvent); //Removing clickEvent listner
		 	learnerWind.remove(selectStudentLabel);
		 	learnerWind.remove(backView);
		 	tableView.removeAllChildren();
		 	learnerWind.remove(tableView);
		 	learnerWind.remove(screenBackgroundImage[0]);
	     	screenBackgroundImage[0] = null;
		 	selectStudentLabel = null;
		 	backView = null;
		 	tableView = null;
		 	iOS7 = null;
		 	//1.9 SDK7 - Added r_miscue as tt is undefined
		 	//var groupWindow = tt.ui.createGroupWindow(usrname,token,user_Id,button_Id,menuItemKey);
		 	var groupWindow = r_miscue.tt.ui.createGroupWindow(usrname,token,user_Id,button_Id,menuItemKey);
		 	groupWindow.open();
		 	learnerWind.close();
		 	learnerWind = null;
	  	});
	     
	   	if(Ti.Platform.osname == 'android')
	    {   
	     	learnerWind.addEventListener('android:back', function()
	     	{
	        	tableView.removeEventListener('click', tableViewClickEvent); //Removing clickEvent listner
	        	learnerWind.remove(selectStudentLabel);
	        	learnerWind.remove(backView);
	        	tableView.removeAllChildren();
		    	learnerWind.remove(tableView);
		    	learnerWind.remove(screenBackgroundImage[0]);
		        screenBackgroundImage[0] = null;
		    	selectStudentLabel = null;
		        backView = null;
		        tableView = null;
		        iOS7 = null;
		        //1.9 SDK7 - Added r_miscue as tt is undefined
		        //var groupWindow = tt.ui.createGroupWindow(usrname,token,user_Id,button_Id,menuItemKey);
		    	var groupWindow = r_miscue.tt.ui.createGroupWindow(usrname,token,user_Id,button_Id,menuItemKey);
			    groupWindow.open();
			    learnerWind.close();
			    learnerWind = null;
		    });
		}     
    
		// Creating label 
     	var  selectStudentLabel = Ti.UI.createLabel(
     	{
            color:fontcolour,
            //top:top[1],
            top : '5%', // solved title issue
            width:'100%',
            font:{fontSize:(Inch >= InchValue)?'28dp':'18dp',fontWeight:'bold',fontFamily:pagefontfamily},
            textAlign:'center',
            text:groupname,
            touchEnabled:false
        });
	  
	  	//1.9 SDK7 - Added r_miscue as tt is undefined & r_styles because $$ was undefined
	  	//var tableView = Ti.UI.createTableView(tt.combine($$.TableView,{
		var tableView = Ti.UI.createTableView(r_miscue.tt.combine(r_styles.$$.TableView,
		{
			top:top[2],
			separatorColor: 'transparent',
			backgroundColor:'transparent',
		 	left:'5%',
         	right:'5%'
	 	}));
   
   		learnerWind.add(selectStudentLabel);
   		learnerWind.add(backView);
   		learnerWind.add(tableView);
	 
	 	//Creating Student function
	 	var db = Titanium.Database.open('Miscue');
	 
   	  	var holddatavar = db.execute("SELECT * FROM Learner T1  WHERE userId = ? AND deleted = ? AND groupGuid = (SELECT groupGuid FROM LearnerGroup T2 WHERE groupName = ? AND loginUserId = ?)",user_Id,'no',groupname,user_Id);
   	
   		if(osname == 'iphone' || osname == 'ipad')
   		{
   			var footerView = Ti.UI.createView(
   			{
				height : 0
			});
									 
			tableView.footerView = footerView; //Adding footer to tableview
			tableView.footerTitle = '';
   		}	
   	
   	    tvData = [];
	    for (var i = 0;i < holddatavar.rowCount;i++) 
	    {
			var learnername = holddatavar.fieldByName('learnerName');	
			 	
			//mal 175
			var learnernamelabel  = learnername.replace("&quot;", "'");
			 	
			var learnerimg = holddatavar.fieldByName('learnerImage');
			var learnerGuID = holddatavar.fieldByName('learnerguid');
			 	
			//alert(learnerimg);
			 	
			Ti.API.info('learnername '+learnername);
			Ti.API.info('learnerimg '+ learnerimg);
			Ti.API.info('learnerGuID '+learnerGuID);
				
			//1.9 SDK7 - Added r_miscue as tt is undefined & r_styles because $$ is undefined
			//var row = Ti.UI.createTableViewRow(tt.combine($$.TableViewRow,{
			var row = Ti.UI.createTableViewRow(r_miscue.tt.combine(r_styles.$$.TableViewRow,
			{
				height:top[3],
				backgroundColor:'transparent',
				id:learnerGuID
			})),
				
			spacing = '8dp',
			imgDimensions = top[4];
					
			//Creating view
	        var thisView = Ti.UI.createView(
	        {
	           	backgroundColor:'transparent',
	           	bottom:'1dp',
	    	    left:spacing,
	    		height:imgDimensions,
	    		width:top[6],
			});
			 
			//Creating Imageview
			var learnerImage = Ti.UI.createImageView(
			{
				defaultImage:'/images/phase5/NOIMAGE.png',
				bottom:'1dp',
				left:'0dp',
				height:'auto',
				width:'auto',
				image:learnerimg,
				//borderRadius:5,
			});
					
			//Creating Label(Student name)
			//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles because $$ was undefined
			//var learnerLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
			var learnerLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,
			{
				text:learnernamelabel,
				left:top[5],
				color:fontcolour,
				// bottom:(Inch < 4.5)?'20dp':'30dp',
				font:{fontSize:(Inch >= InchValue)?'28dp':'18dp',fontWeight:'bold',fontFamily:pagefontfamily},
			}));
				
		 	var separatorLine = Ti.UI.createView(
		 	{
			 	bottom:'1%',
			 	backgroundColor:'#A9A9A9',
			 	height:'3dp',
			 	width:'100%'
			});
				
			//Adding labels and imageview to view
			thisView.add(learnerImage);
			row.add(learnerLabel);//Adding view to table view row
			row.add(thisView);
			row.add(separatorLine);
	    
	        tvData.push(row);
	        holddatavar.next();
		}
	    db.close();
	   	holddatavar.close();
    	
		//Adding table view row values to table view
		tableView.setData(tvData);
		var clickCount;
		learnerWind.addEventListener('focus',function(e){clickCount = 0;});
		tableView.addEventListener('click', tableViewClickEvent);
		function tableViewClickEvent(e)
    	{
      		Ti.API.log("Learner X1 sessionLearnerPage.js called","Learner X1 sessionLearnerPage.js called");
	  		var rowid = e.rowData.id;
	  		clickCount++;
	  		var db = Titanium.Database.open('Miscue');
	  	
	  		var Bookcontentcheckrow = db.execute('SELECT * FROM UserBook WHERE userId = ? AND deleted = ?',user_Id,'no');
		  	if(Bookcontentcheckrow.rowCount >= 1)
		  	{
		  		db.close();
		  		if(clickCount == 1)
		  		{
		  			//1.9 SDK7 - Added r_miscue as tt is undefined
		  			//var sessionWindow = tt.ui.createBookNameWindow(usrname,rowid,learnername,token,groupname,button_Id,user_Id,menuItemKey);
		  	 		var sessionWindow = r_miscue.tt.ui.createBookNameWindow(usrname,rowid,learnername,token,groupname,button_Id,user_Id,menuItemKey);
			 		sessionWindow.open();
			   		learnerWind.remove(screenBackgroundImage[0]);
	          		screenBackgroundImage[0] = null;
			 		learnerWind.close();
			 	}
			}
			else
			{
				db.close();
				var labelArray = new Array();
				labelArray['title']=['Alert','Alert'];
				labelArray['message']=['no_Book_Message','There is no Book is assigned for this user'];
				labelArray[1]=['Ok','Ok'];
				//V1.9 SDK7 - Added r_HomeScreen
				var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, usrname);
				//var dialog = createLocalizedAlertDialog(labelArray, usrname);
				dialog.show();
			}
			tableView.removeEventListener('click', tableViewClickEvent);
		}   
		  
		return learnerWind;
 	};
 })();
 
 //1.9 SDK7 replaced include with require
 /*Ti.include(
	'/MainMiscue/ui/sessionBookPage.js'
 );*/

var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage');


		

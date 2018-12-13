/**
 * Appcelerator Titanium Platform
 * Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 **/

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue.js'); 

//1.9 SDK7 - Added 'require' for loadingScreen
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen'); 

//1.9 SDK7 - Added 'require' for styles
var r_styles = require('/MainMiscue/ui/styles'); 

//1.9 SDK7 - Added 'require' for HomeScreen
var r_HomeScreen = require('/MainMiscue/ui/HomeScreen'); 

//V1.9 SDK7 - Added require for searchSession
var r_searchSession = require('/MainMiscue/ui/searchSession');

(function() {
	//1.9 SDK7 - Added r_miscue as tt is undefined 
	//tt.ui.createGroupWindow = function(usrname, token, user_Id, button_Id, menuItemKey) {
	r_miscue.tt.ui.createGroupWindow = function(usrname, token, user_Id, button_Id, menuItemKey) {
		// Getting the window width and height
		var pWidth = Ti.Platform.displayCaps.platformWidth;
		//Opening the database
		var db = Titanium.Database.open('Miscue');
		var homerow = db.execute('SELECT * FROM UserSetting where loginId =?', user_Id);
		var osname = Ti.Platform.osname;
		//Extracting the Usersetting values from local database
		var schoolnames = homerow.fieldByName('schoolName');
		var backpage = homerow.fieldByName('backPage');
		var backcolour = homerow.fieldByName('backgroundColor');
		var fontcolour = homerow.fieldByName('fontColor');
		var pagefontfamily = homerow.fieldByName('charFont');
		var groupWindowBackgroundImage = homerow.fieldByName('selectionPagebackgroundURL');
		var dec = Ti.Utils.base64decode(schoolnames);
		//BackButton
		//V1.9 SDK7 - Added r_loadingScreen
		var backView = r_loadingScreen.createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
		//var backView = createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
		homerow.close();
		homerow = null;
		db.close();
		db = null;
		//V1.9 SDK7 - Added r_loadingScreen
		var iOS7 = r_loadingScreen.isiOS7Plus();
		//var iOS7 = isiOS7Plus();

		// Creating Group window
		var groupWind = Ti.UI.createWindow({
			navBarHidden : true,
			tabBarHidden : true,
			backgroundColor : 'white',
			fullscreen : true //mal
			//backgroundImage:groupWindowBackgroundImage
		});
		
		//V1.9 SDK7 - Added r_loadingScreen
		var Inch = r_loadingScreen.screenInch();
		//var Inch = screenInch();
		
		//V1.9 SDK7 - Added r_loadingScreen
		var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(groupWindowBackgroundImage);
		//var screenBackgroundImage = mainBackgroundImage(groupWindowBackgroundImage);
		groupWind.add(screenBackgroundImage[0]);
		
		//V1.9 SDK7 - Added r_loadingScreen
		var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
		//var screenRes = backgroundImageHeightWidthPxToDp();
		
		if (osname == 'iphone' || osname == 'ipad') {
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
		}else{
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
		}
		
		screenBackgroundImage[1].width = screenRes[0];

		if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
			backView.height = 70;
			backView.width = 135;
			screenBackgroundImage[1].height = screenRes[1];
			Ti.API.info('Initial height for landscape '+screenBackgroundImage[1].height);
		} else {
			if (osname == 'ipad' || osname == 'iphone') {
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
				Ti.API.info('Initial height for portrait ipad and iPhone '+screenBackgroundImage[1].height);
			}
			else{
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
				Ti.API.info('Initial height for portrait android'+screenBackgroundImage[1].height);	
			}
			if (Inch >= InchValue) {	
				if (osname == 'iphone' || osname == 'ipad') {
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
					Ti.API.info('Inch Height for iphone or ipad(portrait)'+screenBackgroundImage[1].height);
				}else{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 100));
					Ti.API.info('Inch Height for android(portrait)'+screenBackgroundImage[1].height);	
				}	
				backView.height = 80;
				backView.width = 145;
			}
		}

		if (iOS7 >= 7) {
			groupWind.top = '20dp';
		}

		if (osname == 'iphone') {
			backView.height = 48;
			backView.width = 78;
		}
		if (Inch < InchValue && osname == 'android') {
			backView.height = 50;
			backView.width = 80;
			groupWind.orientationModes = [Titanium.UI.PORTRAIT];
		}else if(osname == 'android'){
			groupWind.orientationModes = [Titanium.UI.PORTRAIT];
		}

		//Oreintation changes
		 Ti.Gesture.addEventListener('orientationchange', orientionChangeMode);
		function orientionChangeMode(e) {		
			//V1.9 SDK7 - Added r_loadingScreen
				var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
			//var screenRes = backgroundImageHeightWidthPxToDp();						
			screenBackgroundImage[1].width = screenRes[0];
			//V1.9 SDK7 - isLandscape is no longer a function
		//if (Ti.Gesture.isLandscape()) {
			if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
				if (Inch >= InchValue || osname=='ipad') {
					screenBackgroundImage[1].height = screenRes[1];
					Ti.API.info('or change landscape'+screenBackgroundImage[1].height);
					backView.height = 70;
					backView.width = 135;	
				}					
			} else {	
				if (osname == 'ipad'  || osname == 'iphone') {
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
					Ti.API.info('or change portrair ipad and iPhone'+screenBackgroundImage[1].height);
				}else{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
					Ti.API.info('or change portrair android'+screenBackgroundImage[1].height);	
				}					
				if (Inch >= InchValue) {	
					if (osname == 'iphone' || osname == 'ipad') {
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
						Ti.API.info('or change inch > value portrair iphone or ipad'+screenBackgroundImage[1].height);
					}else{
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 100));
						Ti.API.info('or change inch > value portrair android'+screenBackgroundImage[1].height);	
					}	
					backView.height = 80;
					backView.width = 145;
				}
			}
		}
		
		//V1.9 SDK7 - Added r_loadingScreen
		var top = r_loadingScreen.titleLabeltop();
		//var top = titleLabeltop();
		var networkCheck = function(e) {
			if (e.online == true || e.online == 1) {
				var db = Titanium.Database.open('Miscue');
				var miscueSavePendingSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)', user_Id, 'null');
				var interval = 1500 * miscueSavePendingSessionToServerRow.rowCount;
				if (miscueSavePendingSessionToServerRow.rowCount > 0) {
					db.close();
					groupWind.touchEnabled = false;
					var labelArray = new Array();
					labelArray['message'] = ['loading_Indicator', 'Please wait..'];
					//V1.9 SDK7 - Added r_loadingScreen
					r_loadingScreen.showActivity(labelArray['message'], username);
					//showActivity(labelArray['message'], username);
					//V1.9 SDK7 - Added r_searchSession
					r_searchSession.createSubmitPendingSessionToServer(user_Id, token, groupWind);
					//createSubmitPendingSessionToServer(user_Id, token, groupWind);
				} else {
					db.close();
				}
			}
		};

		groupWind.addEventListener('close', function(e) {
			 Ti.Gesture.removeEventListener('orientationchange', orientionChangeMode);
		});

		//Back button functionality
		backView.addEventListener('click', function(e) {
			tableView.removeEventListener('click', tableViewClickEvent);
			//Removing clickEvent listner
			groupWind.remove(selectGroupLabel);
			tableView.removeAllChildren();
			groupWind.remove(backView);
			groupWind.remove(tableView);
			groupWind.remove(screenBackgroundImage[0]);
			screenBackgroundImage[0] = null;
			selectGroupLabel = null;
			backView = null;
			tableView = null;
			//1.9 SDK7 - Added r_miscue as tt is undefined 
			//var miscueWin = tt.ui.createmiscueMenuPage(usrname, token, menuItemKey, user_Id);
			var miscueWin = r_miscue.tt.ui.createmiscueMenuPage(usrname, token, menuItemKey, user_Id);
			miscueWin.open();
			groupWind.close();
			groupWind = null;
		});

		if (Ti.Platform.osname == 'android') {
			groupWind.addEventListener('android:back', function() {
				tableView.removeEventListener('click', tableViewClickEvent);
				//Removing clickEvent listner
				groupWind.remove(selectGroupLabel);
				tableView.removeAllChildren();
				groupWind.remove(backView);
				groupWind.remove(tableView);
				groupWind.remove(screenBackgroundImage[0]);
				screenBackgroundImage[0] = null;
				//1.9 SDK7 - Added r_miscue as tt is undefined 
				//var miscueWin = tt.ui.createmiscueMenuPage(usrname, token, button_Id, user_Id);
				var miscueWin = r_miscue.tt.ui.createmiscueMenuPage(usrname, token, button_Id, user_Id);
				miscueWin.open();
				groupWind.close();
				selectGroupLabel = null;
				backView = null;
				tableView = null;
				groupWind = null;
			});
		}

		// Creating label
		var selectGroupLabel = Ti.UI.createLabel({
			color : fontcolour,
			// top:top[1],
			top : '5%', // solved title issue
			width : '100%',
			font : {
				fontSize : (Inch >= InchValue) ? '28dp' : '18dp',
				fontWeight : 'bold',
				fontFamily : pagefontfamily
			},
			textAlign : 'center',
			text : 'SELECT CLASS',
			touchEnabled : false
		});

		//Creating table view
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles as $$ was undefined
		//var tableView = Ti.UI.createTableView(tt.combine($$.TableView, {
		var tableView = Ti.UI.createTableView(r_miscue.tt.combine(r_styles.$$.TableView, {
			top : top[2],
			separatorColor : 'transparent',
			backgroundColor : 'transparent',
			left : '5%',
			right : '5%'

		}));

		if (osname == 'iphone' || osname == 'ipad') {
			var footerView = Ti.UI.createView({
				height : 0
			});

			tableView.footerView = footerView;
			//Adding footer to tableview
			tableView.footerTitle = '';
		}

		groupWind.add(selectGroupLabel);
		groupWind.add(backView);
		groupWind.add(tableView);

		var db = Titanium.Database.open('Miscue');
		var holddatavar = db.execute('SELECT * FROM LearnerGroup WHERE loginUserId = ? AND deleted = ?', user_Id, 'no');
		tvData = [];
		//tableView.height = holddatavar.rowCount*50;
		for (var i = 0; i < holddatavar.rowCount; i++) {
			var groupname = holddatavar.fieldByName('groupName');
			
		
			
			var groupids = holddatavar.fieldByName('groupGuid');
			Ti.API.log("Group name sessionGroupPage.js is :: ", groupname);
			Ti.API.log("Group ids sessionGroupPage.js are :: ", groupids);

			// Creating Table view row
			//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles as && is undefined
			//var row = Ti.UI.createTableViewRow(tt.combine($$.TableViewRow, {
			var row = Ti.UI.createTableViewRow(r_miscue.tt.combine(r_styles.$$.TableViewRow, {
				height : '65dp',
				id : groupname
			}));


			//mal 175
			groupnamelabel = groupname.replace("&quot;", "'");

			spacing = '8dp',
			imgDimensions = '50dp';
			//Creating labels(Group name)
			var groupLabel = Ti.UI.createLabel({
				bottom : '10dp',
				text : groupnamelabel,
				color : fontcolour,
				//backgroundColor:'transparent',
				font : {
					fontSize : (Inch >= InchValue) ? '28dp' : '18dp',
					fontWeight : 'bold',
					fontFamily : pagefontfamily
				},
				left : spacing
			});

			var separatorLine = Ti.UI.createView({
				bottom : '1%',
				backgroundColor : '#A9A9A9',
				height : '3dp',
				width : '100%'

			});

			row.add(groupLabel);
			row.add(separatorLine);
			tvData.push(row);
			holddatavar.next();
		}
		db.close();
		tableView.setData(tvData);
		var clickCount;
		groupWind.addEventListener('focus', function(e) {
			clickCount = 0;
		});

		//Adding tableview event listner
		tableView.addEventListener('click', tableViewClickEvent);
		function tableViewClickEvent(e) {
			Ti.API.log("Chatteboxes sessionGroupPage.js called", "Chatterboxes sessionGroupPage.js called");
			// var activity = groupWind.activity;
			var rowid = e.rowData.id;
			clickCount++;
			var db = Titanium.Database.open('Miscue');
			var learnercheckrow = db.execute("SELECT * FROM Learner T1  WHERE userId = ? AND deleted = ? AND groupGuid = (SELECT groupGuid FROM LearnerGroup T2 WHERE groupName = ? AND loginUserId = ?)", user_Id, 'no', rowid, user_Id);
			if (learnercheckrow.rowCount >= 1) {
				db.close();
				if (clickCount == 1) {
					//1.9 SDK7 - Added r_miscue as tt is undefined
					//var learnerwindow = tt.ui.createLearnerWindow(usrname, rowid, token, button_Id, user_Id, menuItemKey);
					var learnerwindow = r_miscue.tt.ui.createLearnerWindow(usrname, rowid, token, button_Id, user_Id, menuItemKey);
					learnerwindow.open();
				}
				setTimeout(function() {
					clickCount = 0;
					groupWind.remove(screenBackgroundImage[0]);
					screenBackgroundImage[0] = null;
				}, 500);
				//activity.finish();
				groupWind.close();
				tableView.removeEventListener('click', tableViewClickEvent);
			} else {
				db.close();
				var labelArray = new Array();
				labelArray['title'] = ['Alert', 'Alert'];
				labelArray['message'] = ['no_Learner_Message', 'There are no learners in this class'];
				labelArray[1] = ['Ok', 'Ok'];
				//V1.9 SDK7 - Added r_HomeScreen
				var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, usrname);
				//var dialog = createLocalizedAlertDialog(labelArray, usrname);
				dialog.show();
				setTimeout(function() {
					clickCount = 0;
				}, 500);
			}			
		}

		return groupWind;
	};
})();

//1.9 SDK7 - Changed from include to require
//Ti.include('/MainMiscue/ui/sessionLearnerPage.js');
var r_sessionLearnerPage = require('/MainMiscue/ui/sessionLearnerPage');


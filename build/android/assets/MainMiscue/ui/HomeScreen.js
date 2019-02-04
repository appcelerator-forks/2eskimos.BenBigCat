/**
 * Appcelerator Titanium Platform
 * Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 **/

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue');
//1.9 SDK7 - Required styles because it is used on this page
var r_styles = require('/MainMiscue/ui/styles');
//V1.9 SDK7 - Required loadingScreen because it is used on this page
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen');
//V1.9 SDK7 - Required Apifile because it is used on this page
var r_Apifile = require('/MainMiscue/ui/Apifile');
//V1.9 SDK7 - Required sessionBookPage because it is used on this page
var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage');
//V1.9 SDK7 - Required searchSession because it is used on this page
var r_searchSession = require('/MainMiscue/ui/searchSession');

var myUserId;

(function() {
	//1.9 SDK7 - Added r_miscue as tt is undefined 
	//ui.createHomeScreen = function(userName, token, refCheck) {
	r_miscue.tt.ui.createHomeScreen = function(userName, token, refCheck) {

		//Getting OS name
		var osname = Ti.Platform.osname;
		// Getting the window width
		Ti.API.info('home screen page');
		var pWidth = Ti.Platform.displayCaps.platformWidth;
		//Open the database
		var db = Titanium.Database.open('Miscue');
		var homelog = db.execute('SELECT * FROM Login WHERE username =?', userName);
		
		
		var userId = homelog.fieldByName('userid');
		myUserId = userId;
		var logflag = homelog.fieldByName('logoutFlag');
		homelog.close();
		homelog = null;
		Ti.App.Properties.setString('isConvertedToDP', 'true');
		//Setstring
		var logout_title = 'LOG OUT';
		var language_labelname_row = db.execute('SELECT * FROM Language WHERE userId =? AND labelId = ?', userName, 'LOG OUT');
		if (language_labelname_row.rowCount > 0) {
			logout_title = language_labelname_row.fieldByName('label');
		}
		
		var homerow = db.execute('SELECT * FROM UserSetting where loginId =?', userId);

		if (!Ti.Network.online) {
			db.execute('UPDATE Language SET isLastUsedLang=? WHERE userId = ?', 'true', userName);
			////updating language table
		}
		
		
		
		//Extracting the usersetting datas from local database
		var schoolnames = homerow.fieldByName('schoolName');
		var pagebackground = homerow.fieldByName('backPage');
		var backgroundcolor = homerow.fieldByName('backgroundColor');
		var fontcolour = homerow.fieldByName('fontColor');
		var pagefontfamily = homerow.fieldByName('charFont');
		var pagelogo = homerow.fieldByName('logos');
		var homeWindowBackgroundImage = homerow.fieldByName('homePageBackgroundImage');

		var dec = Ti.Utils.base64decode(schoolnames);
		var logoutImage = homerow.fieldByName('logoutImageURL');
		db.execute('UPDATE UserSetting SET islastUsedBrandLogo=? WHERE loginId = ?', 'true', userId);
		//updating lastusedbrand logo

		var isLandscape = 'false';
		homerow.close();
		db.close();
		
		//V1.9 SDK7 - Added r_loadingScreen
		var iOS7 = r_loadingScreen.isiOS7Plus();
		//var iOS7 = isiOS7Plus();

		// Creating window
		var homeWin = Ti.UI.createWindow({
			navBarHidden : true,
			backgroundColor : backgroundcolor,
			tabBarHidden : true,
		});

		var homeScreenBackgroundImageView = Ti.UI.createView({
			backgroundColor : 'transparent',
			height : Titanium.UI.FILL,
			width : Titanium.UI.FILL,
		});

		homeWin.add(homeScreenBackgroundImageView);

		var homeScreenBackgroundImage = Ti.UI.createImageView({
			top : '0dp',
			defaultImage : '/images/default.png',
			image : homeWindowBackgroundImage
		});

		homeScreenBackgroundImageView.add(homeScreenBackgroundImage);

		//V1.9 SDK7 - Added r_loadingScreen
		var Inch = r_loadingScreen.screenInch();
		//var Inch = screenInch();
		
		//V1.9 SDK7 - Added r_loadingScreen
		var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
		//var screenRes = backgroundImageHeightWidthPxToDp();
		
		
		homeScreenBackgroundImage.height = screenRes[1];
		homeScreenBackgroundImage.width = screenRes[0];

		var this_logoutButton = Ti.UI.createView({
			backgroundColor : 'transparent',
			top : (Ti.Platform.osname == 'iphone') ? 4 : 10,
			height : 80,
			width : 145,
			right : '10dp',
			id : 'home_logout',
		});

		var this_logoutButtonIcon = Ti.UI.createImageView({
			defaultImage : '/images/LOGOUT.png',
			height : Titanium.UI.SIZE,
			width : Titanium.UI.SIZE,
			image : logoutImage
		});

		var logoutLabel = Ti.UI.createLabel({
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : '15dp',
				fontWeight : 'bold',
				fontFamily : 'Roboto',
				fontSize : '15dp',
				fontWeight : 'bold'
			},
			text : logout_title,
			color : fontcolour,
			width : '100%',
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
		});
		// -Lee added Roboto for Android

		this_logoutButton.add(this_logoutButtonIcon);

		// check device is ios7 or greater.
		if (iOS7 >= 7) {
			homeWin.top = '20dp';
		}

		if (osname == 'iphone') {
			this_logoutButton.height = 48;
			this_logoutButton.width = 78;
		}
		if (Inch < InchValue && osname == 'android') {
			this_logoutButton.height = 50;
			this_logoutButton.width = 80;
			// restricting orientation mode for smaller screen(iphone and android smartphone) to only portrait
			homeWin.orientationModes = [Titanium.UI.PORTRAIT];
		}else if(osname == 'android'){
			homeWin.orientationModes = [Titanium.UI.PORTRAIT];
		}

		var titleLabel = Ti.UI.createLabel({
			color : '#CEDEE6',
			width : pWidth,
			font : {
				fontSize : (Inch < InchValue) ? '15dp' : '30dp',
				fontWeight : 'bold'
			},
			textAlign : 'center',
			text : dec,
			touchEnabled : false
		});

		screenHeaderLabel();

		function screenHeaderLabel() {
			//V1.9 SDK7 - isLandscape is no longer a function! 
			//if (Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)// orientation mode is landscape
			if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)// orientation mode is landscape
			{
				titleLabel.top = this_logoutButton.height + this_logoutButton.top - 20;
			} else {
				titleLabel.top = this_logoutButton.height + this_logoutButton.top + 10;
			}
		}


		homeWin.add(titleLabel);

		// check for outstanding sessions
		var pendingSessionLabelArray = new Array();
		pendingSessionLabelArray['title'] = ['Alert', 'Alert'];
		pendingSessionLabelArray['message'] = ['confirm_upload', 'There are outstanding sessions that have not been uploaded. Do you want to upload these session now?'];
		pendingSessionLabelArray[1] = ['Upload', 'Upload'];
		pendingSessionLabelArray[2] = ['Cancel', 'Cancel'];
		var submissionVerficatioDialog = createLocalizedAlertDialog(pendingSessionLabelArray, userName);
		var onlineValue = 1;
		
		//V1.9 SDK7 - This never seems to be fired? Leaving it in just in case
		var networkCheck = function(e) {
			if (e.online == true || e.online == 1) {
				var db = Titanium.Database.open('Miscue');
				var miscueSavePendingSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)', userId, 'null');
				var interval = 2000 * miscueSavePendingSessionToServerRow.rowCount;
				//alert(miscueSavePendingSessionToServerRow.rowCount);   // TODO removed alert that only has a number, no text? 
				if (miscueSavePendingSessionToServerRow.rowCount > 0) {
					db.close();
					miscueSavePendingSessionToServerRow.close();
					miscueSavePendingSessionToServerRow = null;
						onlineValue = e.online;	
					
					
						submissionVerficatioDialog.show();	
					
				} else {
					miscueSavePendingSessionToServerRow.close();
					miscueSavePendingSessionToServerRow = null;
					db.close();
					db = null;
				}
			}
		};

		submissionVerficatioDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				homeWin.touchEnabled = false;
				var labelArray = new Array();
				labelArray['message'] = ['loading_Indicator', 'Please wait..'];
				//V1.9 SDK7 - Added r_loadingScreen
				r_loadingScreen.showActivity(labelArray['message'], userName);
				//showActivity(labelArray['message'], userName);
				//V1.9 SDK7 - Added r_searchSession
				r_searchSession.createSubmitPendingSessionToServer(userId, token, homeWin, onlineValue);
				//createSubmitPendingSessionToServer(userId, token, homeWin, onlineValue);
			}
		});

		// Event listner for network get change
		Ti.Network.addEventListener('change', networkCheck);

		//V1.9 SDK7 - Enabling this on android as the 'upload' dialog was not being shown
		//if (Ti.Platform.name === 'iPhone OS') {
			if (Ti.Network.online) {
				var db = Titanium.Database.open('Miscue');
				var miscueSavePendingSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)', userId, 'null');
				var interval = 2000 * miscueSavePendingSessionToServerRow.rowCount;
				if (miscueSavePendingSessionToServerRow.rowCount > 0) {
					miscueSavePendingSessionToServerRow.close();
					miscueSavePendingSessionToServerRow = null;
					db.close();
					//V1.9 SDK7 - Added timeout for android because the dialog was being hidden under the UI
					setTimeout(function(){
						submissionVerficatioDialog.show();	
					}, Ti.Platform.name === 'iPhone OS' ? 0 : 1000);
					
				} else {
					db.close();
					miscueSavePendingSessionToServerRow.close();
					miscueSavePendingSessionToServerRow = null;
				}
			}
		//}
		
		
		
		homeWin.addEventListener('close', function(e) {
			Ti.Network.removeEventListener('change', networkCheck);
		});
		
		//V1.9 SDK7 added r_loadingScreen
		var top = r_loadingScreen.titleLabeltop();
		//var top = titleLabeltop();
		
		homeWin.add(this_logoutButton);
		//Adding back button to window
		var isProcessInProgress = true;

		//Logout button functionality
		this_logoutButton.addEventListener('click', function(e) {
			if (isProcessInProgress == true) {
				Ti.Gesture.removeEventListener('orientationchange', orientionChangeMode);
				isProcessInProgress = false;
				homeWin.touchEnabled = false;
				var labelArray = new Array();
				labelArray['message'] = ['pleasewait_Indicator', 'Please wait..'];
				//V1.9 SDK7 - Added r_loadingScreen
				r_loadingScreen.showActivity(labelArray['message'], userName);
				//showActivity(labelArray['message'], userName);
				var db = Titanium.Database.open('Miscue');
				var homelogs = db.execute('SELECT * FROM Login WHERE logoutFlag = ? AND userid=?', 2, userId);
				db.execute('UPDATE Login SET logoutFlag=? WHERE userid=?', 2, userId);
				db.close();
				setTimeout(function() {
					tableView.removeAllChildren();
					homeWin.remove(tableView);
					this_logoutButton.remove(this_logoutButtonIcon);
					this_logoutButton.remove(logoutLabel);
					homeWin.remove(this_logoutButton);
					this_logoutButtonIcon = null;
					logoutLabel = null;
					this_logoutButton = null;
					top = null;
					//1.9 SDK7 - Added r_miscue as tt is undefined 
					//var loginWin = tt.ui.createLoginPage();
					var loginWin = r_miscue.tt.ui.createLoginPage();
					loginWin.open();
					//V1.9 SDK7 - Added r_loadingScreen
					r_loadingScreen.hideActivity();
					//hideActivity();
					homeWin.close();
					homeWin = null;
					Inch = null;
				}, 500);
			}
		});

		if (Ti.Platform.osname == 'android') {
			var back_Count = 0;
			homeWin.addEventListener('android:back', function() {
				if (isProcessInProgress == true) {
					isProcessInProgress = false;
					homeWin.touchEnabled = false;
					var labelArray = new Array();
					labelArray['title'] = ['Logout', 'Logout'];
					labelArray['message'] = ['home_logout_confirmation_message', 'Are you sure you want to logout?'];
					labelArray[1] = ['Confirm', 'Confirm'];
					labelArray[2] = ['Cancel', 'Cancel'];

					var dialog = createLocalizedAlertDialog(labelArray, userName);
					dialog.show();
					dialog.addEventListener('click', function(e) {
						if (e.index == 0) {
							Ti.Gesture.removeEventListener('orientationchange', orientionChangeMode);
							var labelArray = new Array();
							labelArray['message'] = ['pleasewait_Indicator', 'Please wait..'];
							//V1.9 SDK7 - Added r_loadingScreen
							r_loadingScreen.showActivity(labelArray['message'], userName);
							//showActivity(labelArray['message'], userName);
							var logFalgs = 2;
							logFalgs = logFalgs.toString();
							var db = Titanium.Database.open('Miscue');
							db.execute('UPDATE Login SET logoutFlag=? WHERE userid=?', logFalgs, userId);
							db.close();
							setTimeout(function() {
								tableView.removeAllChildren();
								homeWin.remove(tableView);
								this_logoutButton.remove(this_logoutButtonIcon);
								this_logoutButton.remove(logoutLabel);
								homeWin.remove(this_logoutButton);
								this_logoutButtonIcon = null;
								logoutLabel = null;
								this_logoutButton = null;
								top = null;
								//1.9 SDK7 - Added r_miscue as tt is undefined 
								//var loginWin = tt.ui.createLoginPage();
								var loginWin = r_miscue.tt.ui.createLoginPage();
								loginWin.open();
								//V1.9 SDK7 - Added r_loadingScreen
								r_loadingScreen.hideActivity();
								//hideActivity();
								homeWin.close();
								homeWin = null;
								Inch = null;
							}, 500);
						}
						if (e.index != 0) {
							isProcessInProgress = true;
							homeWin.touchEnabled = true;
						}
					});

					dialog.show();
					setTimeout(function() {
						back_Count = 0;
					}, 500);
				}//Closing if condition for isProcessisProgree
			});
		}

		// Creating Table view
		var tableView,
		    clickCount;
		var tableDataValue;

		if (Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
			tableDataValue = createMenupage(pWidth, userId);
		} else {
			tableDataValue = createMenupage(pWidth, userId);
		}

		function createMenupage(winWidth, userId) {
			var menuitemKey = 'mainmenu';
			//Opening the database
			var db = Titanium.Database.open('Miscue');
			var holddatavar = db.execute('SELECT * FROM UserMenuItem WHERE userId = ? AND menuKey = ? ', userId, menuitemKey);
			var i = 0,
			    j = 0;
			var m = 0;

			var tableData = [];
			var colorSetIndex = 0;
			var cellIndex = 0;

			if (osname == 'android') {
				var tableHeight = (Ti.Platform.displayCaps.platformHeight / 2);
				tableHeight = (tableHeight / (Titanium.Platform.displayCaps.dpi / 160));
				var tableWidth = (Ti.Platform.displayCaps.platformWidth - 25);
				tableWidth = (tableWidth / (Titanium.Platform.displayCaps.dpi / 160));

			} else {
				var tableHeight = (Ti.Platform.displayCaps.platformHeight / 2);
				var tableWidth = (Ti.Platform.displayCaps.platformWidth - 25);
				if (osname == 'ipad' && Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
					var tableWidth = (Ti.Platform.displayCaps.platformWidth - 60);
				}
			}

			if (Inch < InchValue || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
				tableHeight = tableHeight - 15;
			}

			var homeScreenMenuWidth;

			tableView = Ti.UI.createTableView({
				id : 10,
				bottom : '1%',
				left : 10,
				right : 10,
				width : tableWidth,
				height : tableHeight,
				style : Ti.UI.iPhone.TableViewStyle.PLAIN,
				separatorColor : 'transparent',
				backgroundColor : 'transparent',
				scrollable : false
			});
			if (osname == 'ipad' && Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight) {
				tableView.left = 60;
			}
			var count = 0;

			//Creating table rows
			for (var y = 1; y <= 2; y++) {
				var thisRow = Ti.UI.createTableViewRow({
					className : "grid",
					id : y,
					layout : 'horizontal',
					height : tableView.height / 2,
					backgroundColor : 'transparent',
					backgroundSelectedColor : "transparent", //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
					separatorColor : 'transparent',

				});

				//Creating Table columns
				for (var x = 1; x <= 3; x++) {

					if (m < holddatavar.rowCount) {
						//var ids = holddatavar.fieldByName('homeid');
						var imgData = holddatavar.fieldByName('Image');
						var Labelname = holddatavar.fieldByName('label_name');
						Ti.API.log("Label name HomeScreen.js is : ", Labelname);
						var buttonPosition = holddatavar.fieldByName('Position');
						Ti.API.log("Button position HomeScreen.js is : ", buttonPosition);

						//Creating view
						var thisView = Ti.UI.createView({
							top : '3dp',
							backgroundColor : 'transparent',
							left : '20dp',
							right : '10dp',
							height : thisRow.height - 5,
							width : tableView.width / 3 - 35,
							buttonid : buttonPosition,
							idss : Labelname,
						});

						homeScreenMenuHeight = thisView.height - 65;
						homeScreenMenuWidth = thisView.height - 58;
						if (Ti.Platform.name == 'iPhone OS') {
							if (osname == 'ipad') {
								homeScreenMenuHeight = thisView.height - 75;
								homeScreenMenuWidth = thisView.height - 32;
							}
						} else if (Ti.Platform.name == 'android' && Inch >= InchValue) {
							homeScreenMenuHeight = thisView.height - 65;
							homeScreenMenuWidth = thisView.height - 32;
							//V1.9 SDK7 - isLandscape is no longer a function! 
							//if (Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
							if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
								homeScreenMenuWidth = thisView.height - 50;
							}
						}

						if (osname == 'ipad') {
							thisView.width = 180;
						}

						if (Titanium.Platform.displayCaps.dpi == 320 && Inch >= InchValue) {
							thisView.width = 150;
						}

						if (thisView.height < (tableView.width / 3 - 35)) {
							thisView.width = thisRow.height - 5;
						}
						
						//V1.9 SDK7 - Ti.Gesture.isLandscape is no longer a function.
						//if (Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
							if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
							if ((x == 1 && y == 1) || (x == 1 && y == 2)) {
								thisView.left = tableView.width / 3 - (thisView.width - 40);
								thisView.right = '15dp';
							}
							if ((holddatavar.rowCount == 2 && (x == 1 && y == 1))) {
								thisView.left = thisView.left + thisView.width / 2 + 20;
								thisView.right = '15dp';
							}

							if (holddatavar.rowCount == 4 && (x == 1 && y == 2)) {
								thisView.left = thisView.left + thisView.width + 35;
								thisView.right = '15dp';
							}

							if (holddatavar.rowCount == 5 && (x == 1 && y == 2)) {
								thisView.left = thisView.left + thisView.width / 2 + 15;
								thisView.right = '15dp';
							}
						} else {
							if ((holddatavar.rowCount == 2 && (x == 1 && y == 1))) {
								thisView.left = thisView.width / 2 + 15;
								thisView.right = '15dp';
							}

							if (holddatavar.rowCount == 4 && (x == 1 && y == 2)) {
								thisView.left = thisView.width + 35;
								thisView.right = '15dp';
							}

							if (holddatavar.rowCount == 5 && (x == 1 && y == 2)) {
								thisView.left = thisView.width / 2 + 20;
								thisView.right = '15dp';
							}
						}

						// Creating icon image
						//1.9 SDK7 - Added r_styles $$ are undefined 
						//var thisButtonIcon = Ti.UI.createImageView(tt.combine($$.boldHeaderText, {
						var thisButtonIcon = Ti.UI.createImageView(r_miscue.tt.combine(r_styles.$$.boldHeaderText, {
							width : homeScreenMenuWidth,
							height : homeScreenMenuHeight,
							bottom : (Inch >= InchValue) ? '66dp' : '55dp',
							idss : Labelname,
							// defaultImage : '/images/phase5/NOIMAGE.png',
							buttonid : buttonPosition,
							idss : Labelname,
							backgroundColor : 'transparent',
							style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
							image : imgData,
							touchEnabled : false
						}));

						if (thisButtonIcon.height > 120) {
							thisButtonIcon.height = (osname == 'android') ? '120dp' : '130dp';
						}
						if (thisButtonIcon.width > 130) {
							thisButtonIcon.width = (osname == 'android') ? '130dp' : '140dp';
						}

						if (thisButtonIcon.width > thisView.width) {
							thisButtonIcon.width = thisView.width;
						}

						//Creating text label
						thisLabel = Ti.UI.createLabel({
							color : fontcolour,
							backgroundColor : 'transparent',
							left : '0dp',
							textAlign : 'center',
							font : {
								fontSize : (Inch >= InchValue) ? '20dp' : '12dp',
								fontWeight : 'bold',
								fontFamily : pagefontfamily
							},
							text : Labelname,
							height : '74dp',
							touchEnabled : false,
							width : '96%',
							buttonid : buttonPosition,
							idss : Labelname,
							bottom : '0dp',
						});

						if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
							thisButtonIcon.bottom = '63dp';
							thisButtonIcon.width = thisButtonIcon.width - 20;
							thisLabel.font = {
								fontSize : '18dp',
								fontWeight : 'bold',
								fontFamily : pagefontfamily
							};
						}

						thisButtonIcon.height = thisButtonIcon.width;

						if (thisLabel.text.length > 26) {
							thisLabel.text = thisLabel.text.substring(0, 24) + '..';
						}

						thisButtonIcon.borderWidth = 0;

						//Adding button, Label and view

						thisView.add(thisButtonIcon);
						thisView.add(thisLabel);
						thisRow.add(thisView);
						cellIndex++;
						colorSetIndex++;
						count++;
						holddatavar.next();

						m++;
					}

				}
				tableData.push(thisRow);
			}

			db.close();
			tableView.data = tableData;
			///Adding button image and menu label to table view
			homeWin.add(tableView);
			homeWin.addEventListener('focus', function(e) {
				clickCount = 0;
			});

			//Table view event listner
			tableView.addEventListener('click', tableViewClickEvent);
			return tableData;
		}//close function

		function tableViewClickEvent(e) {
			Ti.Gesture.removeEventListener('orientationchange', orientionChangeMode);

			var index = e.index;
			var row = e.source.ids;
			var buttonPositionValue = e.source.buttonid;
			var labelText = e.source.idss;
			clickCount++;
			var closeWindow = true;
			if (buttonPositionValue != null) {
				var db = Titanium.Database.open('Miscue');
				var homescrn = db.execute('SELECT * FROM UserMenuItem WHERE Position = ? AND userId = ? AND menuKey = ?', buttonPositionValue, userId, 'mainmenu');
				if (homescrn.rowCount > 0) {
					var hmvalue = homescrn.fieldByName('Type');
					var buttonId = homescrn.fieldByName('menuItemKey');
				}
				homescrn.close();
				db.close();
			}

			if (hmvalue == 'standard') {
				if (clickCount == 1) {
					if (buttonId == 'miscueanalysis') {
						var base_URL = "https://www.miscue.co.uk/iglooapi/apirequest.aspx";
						// Assigning the Getclass input to variable
						var classStr = ('<request><requesttype>GETCLASSES</requesttype><accesstoken>') + token + ('</accesstoken></request>');
						var flg = 2;

						Ti.API.log("Miscue analysis Called HomeScreen.js:: ", "Miscue analysis Called");
						//Sending accesstoken as a input to apifile and calling a api file
						if (Ti.Network.online) {
							homeWin.touchEnabled = false;
							var labelArray = new Array();
							labelArray['message'] = ['loading_Indicator', 'Loading...'];
							// -Lee changed text to see which Loading message doesn't go away on intermittant WIFI
							// MAL - removed 657 message
							//V1.9 SDK7 - addded r_loadingScreen
							r_loadingScreen.showActivity(labelArray['message'], userName);
							
							
							//V1.9 SDK7 - Added r_Apifile
							r_Apifile.createApi(base_URL, classStr, userName, token, flg, homeWin, buttonId);
							//createApi(base_URL, classStr, userName, token, flg, homeWin, buttonId);
							
							
							homeWin.touchEnabled = true;
						} else if (!Ti.Network.online) {
							//1.9 SDK7 - Added r_miscue as tt is undefined 
							//var miscuewindow = tt.ui.createmiscueMenuPage(userName, token, buttonId);
							var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(userName, token, buttonId);
							miscuewindow.open();
							homeWin.close();
						}
					}

				}
				setTimeout(function() {
					clickCount = 0;

				}, 500);

			} else if (hmvalue == 'webview') {
				Ti.API.log("WebView Called HomeScreen.js :: ", "WebView Called");
				Ti.App.Properties.setString('isConvertedToDP', 'false');
				if (clickCount == 1) {
					
					//MAL v172 - open in external browser
					 closeWindow=false;
					 var db = Titanium.Database.open('Miscue');
					 var homescrn = db.execute('SELECT * FROM UserMenuItem where menuItemKey = ? AND userId = ?',buttonId, userId);
     				 var hmlink = homescrn.fieldByName('Link');
					 Ti.Platform.openURL(hmlink);
					/*
					var webViewWind = tt.ui.createHomeWebview(buttonId, userName, osname, labelText, token, buttonId, userId);
					webViewWind.open();
					homeWin.close();
					*/
				}
				setTimeout(function() {
					clickCount = 0;
				}, 500);
			}
			//MAL - don't remove event listener cos this screen stays open - 
			if (closeWindow){
					tableView.removeEventListener('click', tableViewClickEvent);
			}
			
		
			//Removing clickEvent listner
		}

		var orientCount = 6;

		function createChangeAlignmentPositions(orientVal, orientationVal) {
			Ti.API.log("createChangeAlignmentPositions() called :: ", orientVal + " :: " + orientationVal);
			
			//V1.9 SDK7 - Added r_loadingScreen
			var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
			//var screenRes = backgroundImageHeightWidthPxToDp();
			homeScreenBackgroundImage.height = screenRes[1];
			homeScreenBackgroundImage.width = screenRes[0];
			//V1.9 SDK7 - isLandscape is no longer a function! 
			//if (Ti.Gesture.isLandscape()) {
			if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) {
				titleLabel.top = this_logoutButton.height + this_logoutButton.top - 10;

			} else {
				titleLabel.top = this_logoutButton.height + this_logoutButton.top + 10;
			}
			orientCount = orientationVal;
			//V1.9 SDK7 - Added r_loadingScreen
			var portraitval = r_loadingScreen.dptopixel();
			//var portraitval = dptopixel();
			var lwidth = Ti.Platform.displayCaps.platformWidth;
			clickCount = 0;
			tableView.removeEventListener('click', tableViewClickEvent);
			for (var x in homeWin.children ) {
				if (homeWin.children.length >= 3) {
					tableDataValue = null;
					homeWin.remove(tableView);
					break;
				}
			}
			tableDataValue = createMenupage(lwidth, userId);
			screenHeaderLabel();
		}

		function getOrientation(orientVal) {
			var value;
			switch (orientVal) {
			case 1:
				value = 1;
				break;
			case 4:
				value = 2;
				break;
			case 2:
				value = 3;
				break;
			case 3:
				value = 4;
				break;
			default:
				value = 0;
				break;
			}
			Ti.API.log("getOrientation() called :: ", value);
			return value;
		}

		function orientionChangeMode(e) {
			var orientVal = e.source.orientation;
			var orientationVal = getOrientation(orientVal);
			if(Inch >= InchValue || osname=='ipad'){
				if (osname == 'android') {
					Ti.API.log("orientionChangeMode() called :: ", "orientionChangeMode() called");
					createChangeAlignmentPositions(orientVal, orientationVal);
				} else {
					if (orientationVal != orientCount && orientationVal != 0) {
						createChangeAlignmentPositions(orientVal, orientationVal);
					}
				}	
			}			
		}
	//mal 175
	if (Ti.App.Properties.getString("doNetworkCheck")=="1" && Ti.Network.online==true && 1==0 ){
		alert('check');
		networkCheck(1);
		
		
	}
	
		// Closing loading activity
		Ti.Gesture.addEventListener('orientationchange', orientionChangeMode);
		
		
		
		
		return homeWin;
	};
})();

//1.9 SDK7 - Changed includes to requires
//Ti.include('/MainMiscue/ui/miscueMenuPage.js', '/MainMiscue/ui/HomeWebview.js');
var r_miscueMenuPage = require('/MainMiscue/ui/miscueMenuPage');
var r_HomeWebView = ('/MainMiscue/ui/HomeWebview');

// method to create a localized alert dialog
/*Label arrays structure --
 [["title"][<titel labelId>,<default english title Text>],
 ["message"][<message labelId>,<default english message Text>],
 [1][<button1 labelId>,<default english button labelText>],
 [2][<button1 labelId>,<default english button labelText>],
 ........
 ]*/
function createLocalizedAlertDialog(labelArray, userId) {
	var labelIdList = new Array();
	var buttonLabelArray = new Array();
	labelIdList[0] = labelArray["title"][0];
	labelIdList[1] = labelArray['message'][0];
	var inPlaceholder = '( ?,?';
	var j = 1;
	//building the array of label ids to pass to database query
	while (true) {
		if (labelArray[j] == null) {
			break;
		} else {
			inPlaceholder = inPlaceholder + ',';
		}
		labelIdList[j + 1] = labelArray[j][0];
		inPlaceholder = inPlaceholder + '?';
		j++;
	}
	inPlaceholder = inPlaceholder + ')';
	//Fetching localized text for all the titles,message and button names
	var db = Titanium.Database.open('Miscue');
	var paramList = [userId];
	paramList = paramList.concat(labelIdList);

	var localizedAlertLabelnamerow = db.execute('SELECT * FROM Language WHERE userId =? AND labelId IN ' + inPlaceholder, paramList);

	if (localizedAlertLabelnamerow.rowCount > 0) {

		for (var i = 0; i < localizedAlertLabelnamerow.rowCount; i++) {
			var labelName = localizedAlertLabelnamerow.fieldByName('label');
			var labelId = localizedAlertLabelnamerow.fieldByName('labelId');
			//Replacing the default values fetch from database
			if (labelArray["title"][0] == labelId) {
				labelArray["title"][1] = labelName;
			}
			if (labelArray["message"][0] == labelId) {
				labelArray['message'][1] = labelName;
			}
			var j = 1;
			//Replacing default values with db text  for  button names
			while (true) {
				if (labelArray[j + 1] == null) {
					break;
				}
				if (labelArray[j+1][0] == labelId) {
					labelArray[j + 1][1] = labelName;
				}
				j++;
			}
			localizedAlertLabelnamerow.next();
		}
		db.close();
	} else {
		db.close();
	}
	//Creating button name labels
	var j = 1;
	while (true) {
		if (labelArray[j] == null) {
			break;
		}
		buttonLabelArray.push(labelArray[j][1]);
		j++;
	}

	var dialog = Ti.UI.createAlertDialog({
		message : labelArray['message'][1],
		buttonNames : buttonLabelArray,
		title : labelArray['title'][1]
	});
	return dialog;
}
//V1.9 SDK7 Added export for createLocalizedAlertDialog
exports.createLocalizedAlertDialog = createLocalizedAlertDialog;

// method to create a localized Toast message
/*Label arrays structure --
 ["message"][<message labelId>,<default english message Text>],
 ]*/
function createLocalizedShowToastMessage(labelArray, userId) {
	var labelIdList = new Array();
	labelIdList = labelArray[0];
	//Fetching localized text for all the titles,message and button names
	var db = Titanium.Database.open('Miscue');
	var paramList = [userId];
	paramList = paramList.concat(labelIdList);
	var localizedAlertLabelnamerow = db.execute("SELECT * FROM Language WHERE userId = ? AND labelId IN (?)", userId, labelIdList);

	if (localizedAlertLabelnamerow.rowCount > 0) {

		for (var i = 0; i < localizedAlertLabelnamerow.rowCount; i++) {
			var labelName = localizedAlertLabelnamerow.fieldByName('label');
			var labelId = localizedAlertLabelnamerow.fieldByName('labelId');
			//Replacing the default values fetch from database
			if (labelArray[0] == labelId) {

				labelArray[1] = labelName;
			}
			localizedAlertLabelnamerow.next();
		}
		db.close();
	} else {
		db.close();
	}
	// window container
	indWin = Titanium.UI.createWindow({
		top : '200dp'
	});

	//  view
	var indView = Titanium.UI.createView({
		height : '60dp',
		width : '180dp',
		borderRadius : 10,
		backgroundColor : '#aaa',
		opacity : .7
	});
	indWin.add(indView);
	// message
	var message = Titanium.UI.createLabel({
		text : labelArray[1],
		color : 'black',
		width : indView.width,
		height : indView.height,
		textAlign : 'center',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : 15,
			fontWeight : 'bold',
			fontFamily : 'Roboto',
			fontSize : 15,
			fontWeight : 'bold'
		}
	});
	//-Lee added Roboto for Android

	indView.add(message);
	indWin.open();

	var interval = 1000;
	setTimeout(function() {

		indWin.close({
			opacity : 0,
			duration : 2000
		});
	}, interval);

}
//V1.9 SDK7 - Added exports
exports.createLocalizedShowToastMessage = createLocalizedShowToastMessage;

function createActivityIndicator(message) {
	var indView = Titanium.UI.createView({
		height : '65dp',
		width : '160dp',
		borderWidth : 2,
		borderRadius : 10,
		borderColor : '#aaa',
		backgroundColor : 'black',
	});

	var activityIndicator = Ti.UI.createActivityIndicator({
		color : 'white',
		height : 'auto',
		width : 'auto',
		//backgroundColor:'black',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '15dp',
			fontWeight : 'bold',
			fontFamily : 'Roboto',
			fontSize : 15,
			fontWeight : 'bold'
		},
		message : message,
		style : Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
	});
	//-Lee added Roboto for Android
	indView.add(activityIndicator);
	return [indView, activityIndicator];
}

// Function to submit miscue session to server
//1.9 SDK7 - Changed duplicate 'token' parameter to 'tokenDuplicate'
function createSubmitMiscueSession(userId, sessionGuid, token, sessionWindow, isSessionBookPage, tokenDuplicate, file, sliderValue) {
	Ti.API.info('slider value got here '+sliderValue);
	var newSessionStatus,
	    miscueDataXml;
	var db = Titanium.Database.open('Miscue');
	var checkEditSessionRow = db.execute('SELECT * FROM MiscueSession WHERE sessionGuid = ?', sessionGuid);	
	if (checkEditSessionRow.rowCount > 0) {
		var isModified = checkEditSessionRow.fieldByName('isSessionModified');
		var modifiedDate = checkEditSessionRow.fieldByName('lastModifiedDate');
		var sessionstatus = checkEditSessionRow.fieldByName('sessionStatus');
		var lastSavedToServer = checkEditSessionRow.fieldByName('lastSavedToServerDate');
		var sessionNote = checkEditSessionRow.fieldByName('sessionNotes');
		var bookguid = checkEditSessionRow.fieldByName('bookGUID');
		var sliderValueLocal = checkEditSessionRow.fieldByName('sliderValue');
		var learnerGuid = checkEditSessionRow.fieldByName('learnerGuid');
		Ti.API.info('slider value got from db at submit '+sliderValueLocal+' :bookguid '+bookguid+ ' user id '+userId+ ' learner guid'+learnerGuid);
		if (isModified == 'true' || sessionstatus == 'DRAFT' || lastSavedToServer == 'null' || (modifiedDate > lastSavedToServer)) {
			if (sessionstatus == 'DRAFT') {
				newSessionStatus = 'CREATED';
			} else if (sessionstatus == 'CREATED') {
				newSessionStatus = 'CREATED';
				if (lastSavedToServer != 'null') {
					newSessionStatus = 'EDITED';
				}
			} else if (sessionstatus == 'EDITED') {
				newSessionStatus = 'EDITED';
			}
			db.execute('UPDATE MiscueSession SET isLastEditedSession = ? WHERE userId = ?', 'false', userId);
			Ti.API.info('new trace slider value change here for db '+sliderValueLocal);
			
			//V1.9 SDK7 - Added r_sessionBookPage
			db.execute('UPDATE MiscueSession SET isSessionModified = ?,isLastEditedSession = ?,lastModifiedDate = ?,sessionStatus = ?,sliderValue = ? WHERE sessionGuid = ? AND userId = ? AND learnerGuid = ?', 'false', 'true', r_sessionBookPage.createDate(), newSessionStatus, sliderValueLocal,sessionGuid, userId, learnerGuid);
			//db.execute('UPDATE MiscueSession SET isSessionModified = ?,isLastEditedSession = ?,lastModifiedDate = ?,sessionStatus = ?,sliderValue = ? WHERE sessionGuid = ? AND userId = ? AND learnerGuid = ?', 'false', 'true', createDate(), newSessionStatus, sliderValueLocal,sessionGuid, userId, learnerGuid);
			db.close();
			if (Ti.Network.online) {
				createSaveMiscueSessionToServer(userId, sessionGuid, token, sessionWindow, isSessionBookPage, file, sliderValue);
			}
		}
	} else {
		db.close();
	}
}
//V1.9 SDK7 - Added exports
exports.createSubmitMiscueSession = createSubmitMiscueSession;

// Function to create xml data
function createMiscueXmlData(sessionGuid, userId) {
	var temp = '';
	var db = Titanium.Database.open('Miscue');
	var miscueSessionItemRow = db.execute('SELECT * FROM MiscueSessionItem WHERE miscueSessionId = ?', sessionGuid);
	if (miscueSessionItemRow.rowCount > 0) {
		for (var i = 0; i < miscueSessionItemRow.rowCount; i++) {
			var note = miscueSessionItemRow.fieldByName('noteText');
			var miscuemenu = miscueSessionItemRow.fieldByName('miscueMenu');
			miscuemenu = miscuemenu.split('"');
			miscuemenu = miscuemenu[0];
			var startcharVal = miscueSessionItemRow.fieldByName('startChar');
			var endcharVal = miscueSessionItemRow.fieldByName('endChar');
			var additionalInfo = miscueSessionItemRow.fieldByName('additionalInfo');
			var apiRef = miscueSessionItemRow.fieldByName('apiRef');
			if (miscuemenu == 'miscue_reversal') {
				miscuemenu = 'REVERSAL';
				note = additionalInfo;
			}
			if (note == 'undefined') {
				note = ' ';
			}
			if (note != ' ') {
				note = note.replace(/&/gi, '&amp;');
				note = note.replace(/</gi, '&lt;');
				note = note.replace(/>/gi, '&gt;');
				note = note.replace(/"/gi, '&quot;');
			}
			miscuemenu = miscuemenu.toUpperCase();
			miscueDataXml = '<miscue type=' + '"' + apiRef + '"' + ' ' + 'startchar=' + '"' + startcharVal + '"' + ' ' + 'endchar=' + '"' + endcharVal + '"' + '>' + note + '</miscue>';
			miscueDataXml = temp + miscueDataXml;
			temp = miscueDataXml;
			miscueSessionItemRow.next();
		}
	} else {
		miscueDataXml = ' ';
	}
	db.close();
	return miscueDataXml;
}
//V1.9 SDK7 - Added exports
exports.createMiscueXmlData = createMiscueXmlData;

function createSaveMiscueSessionToServer(userId, sessionGuid, token, sessionWindow, isSessionBookPage, file, sliderValue) 
{
	Ti.API.info('slider value got to save miscue sesison'+sliderValue);
	var cnt = 0,
	flag = 7;
	var sessionGUID = new Array();
	var sessionDate = new Array();
	var miscuesessionDate = new Array();
	var learnerGUID = new Array();
	var bookGUID = new Array();
	var miscues = new Array();
	var session_Id = new Array();
	var sessionNotes = new Array();
	var modalId = new Array();
	var sessionStatus = new Array();	
	var saveMiscue;
	var db = Titanium.Database.open('Miscue');
	var loginUserNameRow = db.execute('SELECT * FROM Login WHERE userid = ?', userId);
	var loginUserName = loginUserNameRow.fieldByName('username');
	loginUserNameRow.close();
	var base_URL = 'https://www.miscue.co.uk/iglooapi/apirequest.aspx';
	var miscueSaveSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid = ? AND (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)', userId, sessionGuid, 'null');
	var rowCount = miscueSaveSessionToServerRow.rowCount;
	Ti.API.info('row count at save session '+rowCount);
	// -Lee added a Try.. block here, to try to stop ugly code crash
	try 
	{
		if (rowCount > 0) 
		{
			while (miscueSaveSessionToServerRow.isValidRow()) 
			{
				sessionStatus[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionStatus');
				sessionGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionGuid');

				if (sessionStatus[cnt] == 'CREATED') 
				{
					sessionDate[cnt] = miscueSaveSessionToServerRow.fieldByName('sessiondate');
				} 
				else if (sessionStatus[cnt] == 'EDITED' || sessionStatus[cnt] == 'DELETED') 
				{
					sessionDate[cnt] = miscueSaveSessionToServerRow.fieldByName('lastModifiedDate');
				}
				learnerGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('learnerGuid');
				bookGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('bookGUID');
				sessionNotes[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionNotes');
				sessionNotes[cnt] = sessionNotes[cnt].replace(/&/gi, '&amp;');
				sessionNotes[cnt] = sessionNotes[cnt].replace(/</gi, '&lt;');
				sessionNotes[cnt] = sessionNotes[cnt].replace(/>/gi, '&gt;');
				sessionNotes[cnt] = sessionNotes[cnt].replace(/"/gi, '&quot;');				
				miscues[cnt] = createMiscueXmlData(sessionGUID[cnt], userId);
				cnt++;
				miscueSaveSessionToServerRow.next();
			}
			db.close();
			for (var x = 0; x < rowCount; x++) 
			{
				//saveMiscueXML = '<request><requesttype>SAVEMISCUE</requesttype><status>' + sessionStatus[x] + '</status><accesstoken>' + token + '</accesstoken>' + '<sessionGUID>' + sessionGUID[x] + '</sessionGUID>' + '<sessionDate>' + sessionDate + '</sessionDate><learnerGUID>' + learnerGUID[x] + '</learnerGUID><bookGUID>' + bookGUID[x] + '</bookGUID><notes>' + sessionNotes[x] + '</notes><miscues>' + miscues[x] + '</miscues> </request>';
				saveMiscueXML = '<request><requesttype>SAVEMISCUE</requesttype><status>' + sessionStatus[x] + '</status><accesstoken>' + token + '</accesstoken>' + '<sessionGUID>' + sessionGUID[x] + '</sessionGUID>' + '<sessionDate>' + sessionDate + '</sessionDate><learnerGUID>' + learnerGUID[x] + '</learnerGUID><bookGUID>' + bookGUID[x] + '</bookGUID><notes>' + sessionNotes[x] + '</notes><sliderValue>' +sliderValue+'</sliderValue><miscues>' + miscues[x] + '</miscues> </request>';
				
				//V1.9 SDK7 - Added r_Apifile
				Ti.API.info("---------- BEN - doing createApi");
				r_Apifile.createApi(base_URL, saveMiscueXML, loginUserName, userId, flag, sessionWindow, sessionGuid, isSessionBookPage, token, file);
				Ti.API.info("---------- BEN - TEST COMPLETE");
				//createApi(base_URL, saveMiscueXML, loginUserName, userId, flag, sessionWindow, sessionGuid, isSessionBookPage, token, file);
			}
		} // if
	}//try
/*
	catch (error) {
		//Mal - userName is out of scope here, so added a dummy
		var userName = 'dummyUserName';
		// -Lee are errors logged anywhere?
		var pendingSessionLabelArray = new Array();
		pendingSessionLabelArray['title'] = ['Alert', 'Alert'];
		pendingSessionLabelArray['message'] = ['confirm_upload', 'Upload does not appear to have been fully successful, there are still outstanding sessions. Do you want to upload these session now?'];
		pendingSessionLabelArray[1] = ['Upload', 'Upload'];
		pendingSessionLabelArray[2] = ['Cancel', 'Cancel'];
		var submissionVerficatioDialog = createLocalizedAlertDialog(pendingSessionLabelArray, userName);
		submissionVerficatioDialog.addEventListener('click', function(e) {
			if (e.index == 0) {
				homeWin.touchEnabled = false;
				var labelArray = new Array();
				labelArray['message'] = ['loading_Indicator', 'Please wait..'];
				showActivity(labelArray['message'], userName);
				createSubmitPendingSessionToServer(userId, token, homeWin, onlineValue);
			} //if
		});
		//submissionverification

	}//catch
	*/
	
	finally {
	}
	

} 
// function	//V1.9 SDK7 - Added exports
exports.createSaveMiscueSessionToServer = createSaveMiscueSessionToServer;
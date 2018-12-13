/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue'); 

//1.9 SDK7 - Added 'require' for loadingScreen
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen'); 

//1.9 SDK7 - Added 'require' for styles
var r_styles = require('/MainMiscue/ui/styles');

//V1.9 SDK7 - Added 'require' for Miscuedb
var r_Miscuedb = require('/MainMiscue/model/Miscuedb');

//V1.9 SDK7 - Added 'require' for searchSession
var r_searchSession = require('/MainMiscue/ui/searchSession');

(function() {
	//1.9 SDK7 - Added r_miscue as tt is undefined
	//tt.ui.createBookNameWindow = function(usrname,learnerGuid,learnername,token,groupname,button_Id,user_Id,menuItemKey) {
    r_miscue.tt.ui.createBookNameWindow = function(usrname,learnerGuid,learnername,token,groupname,button_Id,user_Id,menuItemKey) {

    	Ti.API.info('coming to session book screen');

    // Getting the window width and height
       var pWidth = Ti.Platform.displayCaps.platformWidth;
       //Opening the database
     var db = Titanium.Database.open('Miscue');
       var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',user_Id);
        //Extracting the Usersetting values from local database
     var schoolnames = homerow.fieldByName('schoolName');
     var backpage = homerow.fieldByName('backPage');
     var backcolour = homerow.fieldByName('backgroundColor');
     var fontcolour = homerow.fieldByName('fontColor');
     var pagefontfamily = homerow.fieldByName('charFont');
     var bookWindowBackgroundImage = homerow.fieldByName('selectionPagebackgroundURL');
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
    var bookTitleWind = Ti.UI.createWindow({
        fullscreen:true, //mal
        navBarHidden:true,
        backgroundColor:'white'
      });

//V1.9 SDK7 - Added r_loadingScreen
     var Inch = r_loadingScreen.screenInch();
     //var Inch = screenInch();
     
     //V1.9 SDK7 - Added r_loadingScreen
     var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(bookWindowBackgroundImage);
    //var screenBackgroundImage = mainBackgroundImage(bookWindowBackgroundImage);
    var osname = Ti.Platform.osname;
//V1.9 SDK7 - Added r_loadingScreen
var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
     //var screenRes = backgroundImageHeightWidthPxToDp();
     	if (osname == 'iphone' || osname == 'ipad') {
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
		}else{
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
         	if (osname == 'ipad' || osname == 'iphone') {
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
				Ti.API.info('Initial height for portrait ipad and iPhone '+screenBackgroundImage[1].height);
			}
			else{
				screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
				Ti.API.info('Initial height for portrait android'+screenBackgroundImage[1].height);
			}
             if(Inch >= InchValue)
              {
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


    bookTitleWind.add(screenBackgroundImage[0]);

     if(iOS7 >= 7)
      {
         bookTitleWind.top = '20dp';
      }

      if(osname == 'iphone')
     {
        backView.height = 48;
        backView.width = 78;
     }
      if(Inch < InchValue && osname == 'android')
      {
        backView.height = 50;
        backView.width = 80;
        bookTitleWind.orientationModes = [Titanium.UI.PORTRAIT];
      }else if(osname == 'android'){
      	bookTitleWind.orientationModes = [Titanium.UI.PORTRAIT];
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
         }
           else
           {
           		if (osname == 'ipad'  || osname == 'iphone') {
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight)-(Titanium.Platform.displayCaps.platformHeight/2.5);
					Ti.API.info('or change portrair ipad and iPhone'+screenBackgroundImage[1].height);
				}else{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
					Ti.API.info('or change portrair android'+screenBackgroundImage[1].height);
				}
                   if(Inch >= InchValue)
                      {
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
           //V1.9 SDK7 - Added r_loadingScreen
         var portraitval = r_loadingScreen.dptopixel();
         //var portraitval = dptopixel();
    }
	//V1.9 SDK7 - Added r_loadingScreen
	var top = r_loadingScreen.titleLabeltop();
     //var top = titleLabeltop();

    //Back button functionality
   backView.addEventListener('click', function (e) {
       tableView.removeEventListener('click', tableViewClickEvent);
         bookTitleWind.remove(selectBookLabel);
         tableView.removeAllChildren();
         bookTitleWind.remove(backView);
         bookTitleWind.remove(tableView);
         bookTitleWind.remove(screenBackgroundImage[0]);
         screenBackgroundImage[0] = null;
         selectBookLabel = null;
         backView = null;
         tableView = null;
        iOS7 = null;
        //1.9 SDK7 - Added r_miscue as tt is undefined
        //var learnerwindow = tt.ui.createLearnerWindow(usrname,groupname,token,button_Id,user_Id,menuItemKey);
         var learnerwindow = r_miscue.tt.ui.createLearnerWindow(usrname,groupname,token,button_Id,user_Id,menuItemKey);
         learnerwindow.open();
        bookTitleWind.close();
        bookTitleWind = null;
        // }
      });

    if(Ti.Platform.osname == 'android')
    {
        bookTitleWind.addEventListener('android:back', function(){
          tableView.removeEventListener('click', tableViewClickEvent);
          bookTitleWind.remove(selectBookLabel);
          tableView.removeAllChildren();
          bookTitleWind.remove(backView);
          bookTitleWind.remove(tableView);
          bookTitleWind.remove(screenBackgroundImage[0]);
         screenBackgroundImage[0] = null;
          selectBookLabel = null;
         backView = null;
         tableView = null;
         //1.9 SDK7 - Added r_miscue as tt is undefined
         //var learnerwindow = tt.ui.createLearnerWindow(usrname,groupname,token,button_Id,user_Id,menuItemKey);
         var learnerwindow = r_miscue.tt.ui.createLearnerWindow(usrname,groupname,token,button_Id,user_Id,menuItemKey);
         learnerwindow.open();
           bookTitleWind.close();
           bookTitleWind = null;
      });
    }

     // Creating label
     var  selectBookLabel = Ti.UI.createLabel({
            color:fontcolour,
            //top:top[1],
            top : '5%', // solved title issue
            width:'100%',
            font:{fontSize:(Inch >= InchValue)?'28dp':'18dp',fontWeight:'bold',fontFamily:pagefontfamily},
            textAlign:'center',
            text:'SELECT BOOK',
            touchEnabled:false
       });

    //Creating table view
    //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
      //var tableView = Ti.UI.createTableView(tt.combine($$.TableView,{
      var tableView = Ti.UI.createTableView(r_miscue.tt.combine(r_styles.$$.TableView,{
         top:top[2],
         separatorColor: 'transparent',
         backgroundColor:'transparent',
         left:'5%',
         right:'5%'
      }));

       //Adding view to window
      bookTitleWind.add(selectBookLabel);
      bookTitleWind.add(backView);
      bookTitleWind.add(tableView);

     bookTitleWind.addEventListener('close',function(e){
       Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode);
   });

      var db = Titanium.Database.open('Miscue');
      var holddatavar = db.execute('SELECT * FROM UserBook WHERE userId = ? AND deleted = ?',user_Id,'no');
        tvData = [];

    if(osname == 'iphone' || osname == 'ipad')
    {
        var footerView = Ti.UI.createView({
                height : 0
            });

            tableView.footerView = footerView; //Adding footer to tableview
            tableView.footerTitle = '';
    }

    for (var i = 0;i < holddatavar.rowCount;i++) {
      var bookname = holddatavar.fieldByName('bookName');
        bookname = bookname.replace(/&quot;/gi,"'");
      var bookguid = holddatavar.fieldByName('bookGuid');
      var bkImage= holddatavar.fieldByName('bookImage') ;

      Ti.API.log("bookname sessionBookPage.js called :: ", bookname);
      Ti.API.log("bookguid sessionBookPage.js called :: ", bookguid);
      Ti.API.log("bookImage sessionBookPage.js called :: ", bookImage);

       // Creating Table view row
       //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
       //var row = Ti.UI.createTableViewRow(tt.combine($$.TableViewRow,{
          var row = Ti.UI.createTableViewRow(r_miscue.tt.combine(r_styles.$$.TableViewRow,{
             height:top[3],
             id:bookguid
           }));

            spacing = '8dp',
            imgDimensions = top[4];

        //Creating labels(Group name)
           var thisView = Ti.UI.createView({
                backgroundColor:'transparent',
                bottom:'1dp',
                left:spacing,
                // height:imgDimensions,
                // width:top[6],
                height:Ti.UI.FILL,
                width:(Inch >= InchValue || osname=='ipad')?'250dp':'120dp'
                });

         //Creating Imageview
         var bookImage = Ti.UI.createImageView({
            backgroundColor:'transparent',
            left:'0dp',
            defaultImage:'/images/phase5/NOBOOKIMAGE.png',
            bottom:'1dp',
            // height:'auto',
            // width:'auto',
            height:Ti.UI.SIZE,
            width:Ti.UI.SIZE,
            //MAL
            //re-inserted bookimage
            image:bkImage
            //image:'/images/noBookImage.png',
            //borderRadius:5,
          });

        //Creating Label(Student name)
        //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
        //var bookLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
        var bookLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
              text:bookname,
              left:'50%',
              color:fontcolour,
              font:{fontSize:(Inch >= InchValue)?'28dp':'18dp',fontWeight:'bold',fontFamily:pagefontfamily},
            }));

     var separatorLine = Ti.UI.createView({
            bottom:'1%',
            backgroundColor:'#A9A9A9',
            height:'3dp',
            width:'100%'
         });

         thisView.add(bookImage);
         row.add(bookLabel);
         row.add(thisView);
          row.add(separatorLine);
         tvData.push(row);
          holddatavar.next();
          }
          holddatavar.close();
          db.close();


      tableView.setData(tvData);

      var clickCount = 0;

      var dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      function createDayMonthYear()
      {
          var dateValue = new Date();

        return dayNames[dateValue.getDay()] + ' '+  dateValue.getDate() + ' ' + monthNames[dateValue.getMonth()];
      }

      function createTime()
      {
                   var currentTime = new Date();
            var hours = currentTime.getHours();
            var minutes = currentTime.getMinutes();

            if (minutes < 10)
                minutes = "0" + minutes;

            var suffix = "AM";
            if (hours >= 12) {
                suffix = "PM";
                hours = hours - 12;
            }
            if (hours == 0) {
                hours = 12;
            }
            return  hours + ":" + minutes + " " + suffix;
      }

      //Adding tableview event listner
      tableView.addEventListener('click', tableViewClickEvent);
      function tableViewClickEvent(e)
         {
        var book_GUID = e.rowData.id;

        var db = Titanium.Database.open('Miscue');
        var notesTemplateRow = db.execute('SELECT * FROM UserBook WHERE bookGuid = ? AND userId = ?', e.rowData.id, user_Id);
        if(notesTemplateRow.rowCount > 0)
        {
         notesTemplateValue = notesTemplateRow.fieldByName('notesTemplate');
         }
         notesTemplateRow.close();
         notesTemplateRow = null;
         db.close();
         db = null;

        var isSessionBookPage = 'book';
        var session_Guid = Ti.Platform.createUUID();
        var msicue_DataXml = '',session_Status = 'DRAFT',accuaracy_Value = '100.00', lastmodified_Date = '',lastSavedServer_Date = null,isLastEdited_Session = 'true', isSession_Modified = 'true';
           var session_Date = new Date();
           session_Date = session_Date.toISOString();
           //V1.9 SDK7 - Added r_Miscuedb
           r_Miscuedb.insertMiscueSession (session_Guid,user_Id,msicue_DataXml,session_Date,book_GUID,session_Status,learnerGuid,accuaracy_Value,notesTemplateValue,lastmodified_Date,lastSavedServer_Date,isLastEdited_Session,isSession_Modified,'null',createDayMonthYear(), createTime());
        //insertMiscueSession (session_Guid,user_Id,msicue_DataXml,session_Date,book_GUID,session_Status,learnerGuid,accuaracy_Value,notesTemplateValue,lastmodified_Date,lastSavedServer_Date,isLastEdited_Session,isSession_Modified,'null',createDayMonthYear(), createTime());
        clickCount++;
        if(clickCount == 1)
            {

		//1.9 SDK7 - Added r_miscue as tt is undefined
		//var sessionwindow = tt.ui.createSessionWindow(usrname,session_Guid,user_Id,token,book_GUID,isSessionBookPage,menuItemKey,button_Id); //V1.8 BEN UPDATE - Added button_Id as a parameter so that it can be used in 'miscueSessionPage' to create a new instance of this page.
        var sessionwindow = r_miscue.tt.ui.createSessionWindow(usrname,session_Guid,user_Id,token,book_GUID,isSessionBookPage,menuItemKey,button_Id); //V1.8 BEN UPDATE - Added button_Id as a parameter so that it can be used in 'miscueSessionPage' to create a new instance of this page.
         sessionwindow.open();
          bookTitleWind.remove(screenBackgroundImage[0]);
         screenBackgroundImage[0] = null;
         bookTitleWind.close();
        }
       tableView.removeEventListener('click', tableViewClickEvent);
      }
     return bookTitleWind;
 };
 })();


//1.9 SDK7 - Changed include to require
 /*Ti.include(
    '/MainMiscue/ui/miscueSessionPage.js'
     );*/
    var r_miscueSesionPage = require('/MainMiscue/ui/miscueSessionPage.js');
    
function createDate() {
     var lastSavedServerDate = new Date();
     var lastSavedServerDate = lastSavedServerDate.toISOString();
    return lastSavedServerDate;
  }
  //V1.9 SDK7 - Added exports
  exports.createDate = createDate;

//Function for submition of pending sessions to server
function createSavePendingMiscueSessionToServer (xmlSync,userId,sessionGuid,closeWindow,apiCount,sessionCount,token,HomeMenuItemKey,fontcolour,backcolour,pagefontfamily,isPageName,tableView,userName, loopEnds, submitSession)
{      
    var docData = Ti.XML.parseString(xmlSync);
	var responses = docData.getElementsByTagName("response");
	//V1.9 SDK7 - Changed text to textContent as text is deprecated
	var responseResult =  responses.item(0).getElementsByTagName("result").item(0).textContent;
    //var responseResult =  responses.item(0).getElementsByTagName("result").item(0).text;

    if(responseResult == 'REQUEST_OK')
    {  
        var db = Titanium.Database.open('Miscue');
        //If sesssion status is "DELETED", Delete audio file from device
        var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ? AND sessionStatus = ?",userId,sessionGuid,'DELETED');
        if(audioFileExistCheckRow.rowCount > 0)
        {   
        	var file = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
         	if(file != 'null')
           	{     
                if(Ti.Platform.osname != 'android')
                {   
                	file = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,file);
                }
                else
                {   
					var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
                    file = Ti.Filesystem.getFile(audioDir.resolve(), file);
                }
                file.deleteFile();
            }
        }    
        audioFileExistCheckRow.close();
        //If sesssion status is "DELETED"
        db.execute('DELETE FROM MiscueSession WHERE userId = ? AND sessionGuid = ? AND sessionStatus = ?',userId,sessionGuid,'DELETED');
        //If sesion status is "CREATED or EDITED"
        db.execute('UPDATE MiscueSession SET lastSavedToServerDate = ? WHERE userId = ? AND sessionGuid = ?',createDate(),userId,sessionGuid);
        db.close();
        if(isPageName != 'searchSession')
        {   
      	    //V1.9 SDK7 - Added r_loadingScreen
      	    r_loadingScreen.hideActivity();
      	    //hideActivity();
        }
        closeWindow.touchEnabled = true;
      	if(isPageName == 'searchSession')
       	{      
            if(apiCount == sessionCount)
        	{   
            	submitSession.visible = false;
             	closeWindow.remove(tableView);
             	//V1.9 SDK7 - Added r_searchSession
             	r_searchSession.createSearchFeild(tableView,userId,closeWindow,userName,token,HomeMenuItemKey,fontcolour,backcolour,pagefontfamily);
             	//createSearchFeild(tableView,userId,closeWindow,userName,token,HomeMenuItemKey,fontcolour,backcolour,pagefontfamily);
             	//V1.9 SDK7 - Added r_loadingScreen
      		 	r_loadingScreen.hideActivity();
      		 	//hideActivity();
            }
        }      
    }   
    else if(responseResult == 'REQUEST_FAIL')
    {   
        if(loopEnds == 'true')
        {   
        	var responseResults =  docData.getElementsByTagName("response").item(0).text;
         	if(responseResults.length > 49)
            {
            	responseResults = responseResults.substring(49, responseResults.length);
            }
         	var dialog = Ti.UI.createAlertDialog({
        	buttonNames: ['Ok'],
        	message: 'Failed to save miscue session on server. Please try later from miscue search page. Server Response:' + '\n' + responseResults ,
        	title: 'Warning'
      		});
        	dialog.show();
      		dialog.addEventListener('click',function(e)
      		{
           		if(e.index == 0)
            	{
            		if(isPageName != 'searchSession')
              		{
              			//V1.9 SDK7 - Added r_loadingScreen
      					r_loadingScreen.hideActivity();
      	        		//hideActivity();
              		}
              		closeWindow.touchEnabled = true;
                	if(isPageName == 'searchSession')
                	{
	                	if(apiCount == sessionCount)
    	               	{
        	         		closeWindow.remove(tableView);
        	         		//V1.9 SDK7 - Added r_searchSession
        	         		r_searchSession.createSearchFeild(tableView,userId,closeWindow,userName,token,HomeMenuItemKey,fontcolour,backcolour,pagefontfamily);
            	       		//createSearchFeild(tableView,userId,closeWindow,userName,token,HomeMenuItemKey,fontcolour,backcolour,pagefontfamily);
                	    	//V1.9 SDK7 - Added r_loadingScreen
      						r_loadingScreen.hideActivity();
      						//hideActivity();
                   		}
                	}
         		}   
        	});
    	}  
	}   
	//else if(responseResult != 'REQUEST_OK'){
	else
	{   
        if(apiCount == 1)
        {
        	var db = Titanium.Database.open('Miscue');
        	var grouploginrow = db.execute('SELECT * FROM Login  WHERE userid=?',userId);
        	var groupuserName = grouploginrow.fieldByName('username');
        	grouploginrow.close();
            db.close();
            
            
            Ti.API.info("----------BEN!!! - xmlSync = " + xmlSync);//TODO Delete me
            Ti.API.info("----------BEN!!! - xmlSync.toString() = " + xmlSync.toString());//TODO Delete me
            
            Ti.API.info("----------BEN!!! - docData = " + docData);//TODO Delete me
            
            //Ti.API.info("----------BEN!!! - docData.get = " + docData.get);
            //Ti.API.info("----------BEN!!! - docData.toString() = " + docData.toString());
            //Ti.API.info("----------BEN!!! - docData.valueOf() = " + docData.valueOf());
            
        	var error =  docData.getElementsByTagName("error");
        
        	Ti.API.info("----------BEN!!! - error = " + error);//TODO Delete me
        
        
        
        	Ti.API.info("----------BEN!!! - error.length = " + error.length);//TODO Delete me
        
        
        	//Ti.API.info("----------BEN!!! - error.toString() = " + error.toString());
        	//Ti.API.info("----------BEN!!! - error.localName = " + error.item(0).localName);
        	//Ti.API.info("----------BEN!!! - error.nodeName = " + error.item(0).nodeName);
        	//Ti.API.info("----------BEN!!! - error.nodeValue = " + error.item(0).nodeValue);
        	//Ti.API.info("----------BEN!!! - error.parentNode = " + error.item(0).parentNode);
        
	        //V1.9 SDK7 - Changed text to textContent as text is deprecated
    	    var message = error.item(0).getElementsByTagName("message").item(0).textContent;
        	//var message = error.item(0).getElementsByTagName("message").item(0).text;
         	var labelArray = new Array();
            labelArray['title']=['Alert','Alert'];
            labelArray['message']=['invalid_Session_Message',message];
            labelArray[1]=['Ok','OK'];
			//V1.9 SDK7 - Added r_HomeScreen
			var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, groupuserName);
            //var dialog = createLocalizedAlertDialog(labelArray, groupuserName);
            dialog.show();
        	dialog.addEventListener('click',function(e)
        	{
            	if(e.index == 0)
            	{
            		if(message == 'Invalid or expired session ID')
                	{
                		var db = Titanium.Database.open('Miscue');
                 		db.execute('UPDATE Login SET logoutFlag=? WHERE userid=?',2,userId);
                 		db.close();
                 		//1.9 SDK7 - Added r_miscue as tt is undefined
                 		//var loginWin =  tt.ui.createLoginPage();
                 		var loginWin =  r_miscue.tt.ui.createLoginPage();
                		loginWin.open();
                    	closeWindow.close();
                	}
            	}     
        	});
    	}
	}
}   

//V1.9 SDK7 - added exports
exports.createSavePendingMiscueSessionToServer = createSavePendingMiscueSessionToServer;

 //Function for sessions submition to server in online
 function SaveMiscueSessionToServer (xmlSync,userId,sessionGuid,sessionWindow,userName,menuItemKey,token)
 {
     var docData = Ti.XML.parseString(xmlSync);
      var responses = docData.getElementsByTagName("response");
      //V1.9 SDK7 - Changed text to textContent as text is deprecated
      var responseResult =  responses.item(0).getElementsByTagName("result").item(0).textContent;
      //var responseResult =  responses.item(0).getElementsByTagName("result").item(0).text;
      if(responseResult == 'REQUEST_OK')
      {
        Ti.App.Properties.setString('offline','false');
      var db = Titanium.Database.open('Miscue');
     //If sesssion status is "DELETED", Delete audio file from device
     var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ? AND sessionStatus = ?",userId,sessionGuid,'DELETED');
       if(audioFileExistCheckRow.rowCount > 0)
       {
       var file = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
         if(file != 'null')
           {
               if(Ti.Platform.osname != 'android')
                   {
                        file = Titanium.Filesystem.getFile(Ti.Filesystem.tempDirectory,file);
                    }
               else
                    {
                        var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
                         file = Ti.Filesystem.getFile(audioDir.resolve(), file);
                     }
                  file.deleteFile();
              }
        }
        audioFileExistCheckRow.close();

      //If sesssion status is "DELETED"

      db.execute('DELETE FROM MiscueSession WHERE userId = ? AND sessionGuid = ? AND sessionStatus = ?',userId,sessionGuid,'DELETED');

      //If sesion status is "CREATED or EDITED"
      db.execute('UPDATE MiscueSession SET lastSavedToServerDate = ? WHERE userId = ? AND sessionGuid = ?',createDate(),userId,sessionGuid);
      db.close();
          if(menuItemKey == 'book')
          {
          	//V1.9 SDK7 - Added r_loadingScreen
            r_loadingScreen.hideActivity();
            //hideActivity();
            var menuItemKeys = 'miscueanalysis';
            //1.9 SDK7 - Added r_miscue as tt is undefined
            //var miscuewindow = tt.ui.createmiscueMenuPage(userName,token,menuItemKeys);
            var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(userName,token,menuItemKeys);
            miscuewindow.open();
            sessionWindow.close();
          }
          else if(menuItemKey == 'search')
          {
             //V1.9 SDK7 - Added r_loadingScreen
      		r_loadingScreen.hideActivity();
      		//hideActivity();
             var menuItemKeys = 'miscueanalysis';
             //1.9 SDK7 - Added r_miscue as tt is undefined
             //var searchSession =  tt.ui.createsearchSession(userName,userId,token,menuItemKeys);
             var searchSession =  r_miscue.tt.ui.createsearchSession(userName,userId,token,menuItemKeys);
             searchSession.open();
             sessionWindow.close();
          }
      }

    else if(responseResult != 'REQUEST_OK'){
	 
	 //V1.9 SDK7 - Changed text to textContext as text is deprecated
	 var responseResults =  docData.getElementsByTagName("response").item(0).textContent;
     //var responseResults =  docData.getElementsByTagName("response").item(0).text;
     if(responseResults.length > 49)
     {
          responseResults = responseResults.substring(49, responseResults.length);
     }
      var dialog = Ti.UI.createAlertDialog({
            buttonNames: ['Ok'],
            message: 'Failed to save miscue session on server. Please try later from miscue search page. Server Response:' + '\n' + responseResults ,
            title: 'Warning'
         });
       dialog.show();
       dialog.addEventListener('click',function(e){
        if(e.index == 0)
         {
         	//V1.9 SDK7 - Added r_loadingScreen
         	r_loadingScreen.hideActivity();
             //hideActivity();
            if(menuItemKey == 'book')
             {
                var menuItemKeys = 'miscueanalysis';
                //1.9 SDK7 - Added r_miscue as tt is undefined
                //var miscuewindow = tt.ui.createmiscueMenuPage(userName,token,menuItemKeys);
                var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(userName,token,menuItemKeys);
                miscuewindow.open();
                sessionWindow.close();
             }
           else if(menuItemKey == 'search')
            {
            // hideActivity();
             var menuItemKeys = 'miscueanalysis';
             //1.9 SDK7 - Added r_miscue as tt is undefined
             //var searchSession =  tt.ui.createsearchSession(userName,userId,token,menuItemKeys);
             var searchSession =  r_miscue.tt.ui.createsearchSession(userName,userId,token,menuItemKeys);
             searchSession.open();
             sessionWindow.close();
             }
          }
     });
  }
 }
//V1.9 SDK7 - Added exports
exports.SaveMiscueSessionToServer = SaveMiscueSessionToServer;


/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//V1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue'); 

var r_loadingScreen = require('/MainMiscue/ui/loadingScreen');

//V1.9 SDK7 - Added require for r_Miscuedb
var r_Miscuedb = require('/MainMiscue/model/Miscuedb');

//V1.9 SDK7 - Added require for r_Apifile
var r_Apifile = require('/MainMiscue/ui/Apifile');

//V1.9 SDK7 - Added require for r_styles
var r_styles = require('/MainMiscue/ui/styles');

//V1.9 SDK7 - Added require for r_HomeScreen
var r_HomeScreen = require('/MainMiscue/ui/HomeScreen');


(function() {
    //1.9 SDK7 - Added r_miscue as tt is undefined 
    //tt.ui.createmiscueMenuPage = function(userName,token,menuItemKey) {
    r_miscue.tt.ui.createmiscueMenuPage = function(userName,token,menuItemKey) {
          //Getting OS name     
     var osname = Ti.Platform.osname;   
     Ti.API.info('miscue menu page');
     // Getting the window width and height
     var pWidth = Ti.Platform.displayCaps.platformWidth;
     //Open the database 
      var db = Titanium.Database.open('Miscue');
     var homelog = db.execute('SELECT * FROM Login WHERE username =?',userName);
       var userId = homelog.fieldByName('userid');
       var userlang = homelog.fieldByName('userLanguage');
       homelog.close();
     var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',userId);
     
       //Extracting the usersetting datas from local database 
     var schoolnames = homerow.fieldByName('schoolName');
     var backpage = homerow.fieldByName('backPage');
     var backcolour = homerow.fieldByName('backgroundColor');
     var fontcolour = homerow.fieldByName('fontColor');
     var pagefontfamily = homerow.fieldByName('charFont');
     var miscueMenuWindowBackgroundImage = homerow.fieldByName('miscueMenuPageBackgroundImage');     
     var dec = Ti.Utils.base64decode(schoolnames);
     Ti.API.info('dec string '+dec);
     //BackButton
     //V1.9 SKD7 - Added r_loadingScreen
     //var backView = createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
     var backView = r_loadingScreen.createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
     homerow.close();
     db.close();
     //V1.9 SDK7 - Added r_loadingScreen
        var iOS7 = r_loadingScreen.isiOS7Plus();
        //var iOS7 = isiOS7Plus();
     // Creating window 
    var miscueMenuWin = Ti.UI.createWindow({
        navBarHidden:true,
        title:'Miscue',
        backgroundColor:'white',
     });
    
    Ti.App.Properties.setString('isConvertedToDP', 'true'); // setString
    
     
    if(iOS7 >= 7)
         {
          miscueMenuWin.top = '20dp';
         }
         
      var miscueMenuBackgroundImageView = Ti.UI.createView({
                backgroundColor:'transparent',
                height:Titanium.UI.FILL,
                width:Titanium.UI.FILL,
            });

    
    var miscueMenuBackgroundImage = Ti.UI.createImageView({
            top:'0dp',
            //defaultImage:'/images/default.png',
            backgroundColor:'#D8E028',
            image:miscueMenuWindowBackgroundImage,
         });
         
    miscueMenuBackgroundImageView.add(miscueMenuBackgroundImage);   
    miscueMenuWin.add(miscueMenuBackgroundImageView);
   
    //V1.9 SDK7 - added r_loadingScreen
    var Inch = r_loadingScreen.screenInch();
    //var Inch = screenInch();
    
    //V1.9 SDK7 - added r_loadingScreen     
    var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
    //var screenRes = backgroundImageHeightWidthPxToDp();
    miscueMenuBackgroundImage.height = screenRes[1];
    miscueMenuBackgroundImage.width = screenRes[0];
     
     if(osname == 'iphone')
     {
        backView.height = 48;
        backView.width = 78;
     }
      if(Inch < InchValue && osname == 'android')
      {
        miscueMenuWin.orientationModes = [Titanium.UI.PORTRAIT];
        backView.height = 50;
        backView.width = 80;
        
      }
      else if(Inch >= InchValue)
      {
          miscueMenuWin.orientationModes = [Titanium.UI.PORTRAIT];
      }else if(osname == 'android'){
      	miscueMenuWin.orientationModes = [Titanium.UI.PORTRAIT];
      }
      
     var  titleLabel = Ti.UI.createLabel({
         color:'#CEDEE6',
         width:pWidth,
         font:{fontSize:(Inch < InchValue)?'15dp':'30dp',fontWeight:'bold'},
         textAlign:'center',
         text:dec,
         touchEnabled:false                  
   });
   
   screenHeaderLabel();
   
     function screenHeaderLabel()
     {
     	//V1.9 SDK7 - isLandscape is no longer a function
         //if(Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
      {
          titleLabel.top = backView.height + backView.top - 10;
           if(osname == 'android')
           {
               titleLabel.top = backView.height + backView.top  - 60;
           }
      }
       else
       {
           titleLabel.top = backView.height + backView.top + 10;
           if(Inch < InchValue)
           {
               titleLabel.top = backView.height + backView.top;
           }
          
        }
     }
     
   miscueMenuWin.add(titleLabel);
    miscueMenuWin.add(backView);
        //V1.9 SDK7 - Added r_loadingScreen
		var top = r_loadingScreen.titleLabeltop();
		//var top = titleLabeltop();

      var isProcessInProgress = true; 
      //Logout button functionality     
    backView.addEventListener('click', function (e) {
        if(isProcessInProgress == true)
        {
            isProcessInProgress = false;
            miscueMenuWin.touchEnabled = false;
            var labelArray = new Array();
            labelArray['message']=['loading_Indicator','Loading..'];
            //V1.9 SDK7 - added r_loadingScreen
            r_loadingScreen.showActivity(labelArray['message'], userName);
            //showActivity(labelArray['message'], userName);
            setTimeout(function()
            {
                    miscueMenuWin.remove(backView);
                    backView = null;
                     Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode); ///Removing the orientationchange event listner
                    var refcheck = 2;
                    //1.9 SDK7 - Added r_miscue as tt is undefined 
                    //var homeScreenWind = tt.ui.createHomeScreen(userName,token,refcheck);
                    var homeScreenWind = r_miscue.tt.ui.createHomeScreen(userName,token,refcheck);
                homeScreenWind.open();
                //V1.9 SDK7 - Added r_loadingScreen
    			r_loadingScreen.hideActivity();
    			//hideActivity();
                miscueMenuWin.close();
                miscueMenuWin = null;
                isProcessInProgress = null;
                Inch = null;
               miscueMenuBackgroundImageView.remove(miscueMenuBackgroundImage);  
               miscueMenuBackgroundImageView = null;
               miscueMenuBackgroundImage = null; 
            },500);
          }
        });
        
    if(Ti.Platform.osname == 'android')
    {
        miscueMenuWin.addEventListener('android:back', function(){
        if(isProcessInProgress == true)
        {
            isProcessInProgress = false;
            miscueMenuWin.touchEnabled = false;
            var labelArray = new Array();
            labelArray['message']=['loading_Indicator','Loading..'];
            //V1.9 SDK7 - Added r_loadingScreen
            r_loadingScreen.showActivity(labelArray['message'], userName);
            //showActivity(labelArray['message'], userName);
            setTimeout(function()
            {
                miscueMenuWin.remove(backView);
                backView = null;
                Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode); ///Removing the orientationchange event listner
                var refcheck = 2;
                //1.9 SDK7 - Added r_miscue as tt is undefined 
                //var homeScreenWind = tt.ui.createHomeScreen(userName,token,refcheck);
                var homeScreenWind = r_miscue.tt.ui.createHomeScreen(userName,token,refcheck);
                homeScreenWind.open();
                //V1.9 SDK7 - Added r_loadingScreen
    			r_loadingScreen.hideActivity();
    			//hideActivity();
                miscueMenuWin.close();
                miscueMenuWin = null;
                isProcessInProgress = null;
                Inch = null;
                miscueMenuBackgroundImageView.remove(miscueMenuBackgroundImage);  
                  miscueMenuBackgroundImageView = null;
                  miscueMenuBackgroundImage = null;
            },500);
        }
        });
    }
    
    
     // Creating Table view
      var tableView,tableDataValue;
   
  if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
    {
       tableDataValue = createMiscueMenupages(pWidth,userId,menuItemKey);
    }
  else
    {
       tableDataValue = createMiscueMenupages(pWidth,userId);
    }
  var isProcessInProgress = true; 
  function createMiscueMenupages(winWidth,userId,menuItemKey)
   {
      
    var labelname,miscueMenu_ButtonId,imgData,position;
          
    //Opening the database
    
    var db = Titanium.Database.open('Miscue');
    var holddatavar = db.execute('SELECT * FROM UserMenuItem WHERE userId = ? AND menuKey =?',userId,'miscueanalysismenu');
    var i=0,j=0;
    var m = 0;
    var tableData = [];
    var colorSetIndex = 0;
    var cellIndex = 0;
     
     if(osname == 'android')
     {
      var tableHeight = (Ti.Platform.displayCaps.platformHeight /2);
      //Converting tableHeight pixel value to dp value
     tableHeight = (tableHeight / (Titanium.Platform.displayCaps.dpi / 160));
     var tableWidth = (Ti.Platform.displayCaps.platformWidth - 25);
     //Converting tableWidth pixel value to dp value
      tableWidth = (tableWidth / (Titanium.Platform.displayCaps.dpi / 160));
     
     }
     else
     {
          var tableHeight = (Ti.Platform.displayCaps.platformHeight /2);
          var tableWidth = (Ti.Platform.displayCaps.platformWidth - 25);
            if(osname == 'ipad' && Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
             {
                  var tableWidth = (Ti.Platform.displayCaps.platformWidth - 60);
              }
     }
     
      if(Inch < InchValue || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         {
             tableHeight = tableHeight - 15;
         }
     
      var miscueMenuScreenIconWidth ,miscueMenuScreenIconHeight;
            
      tableView = Ti.UI.createTableView({
      id:10,
      bottom:'1%',
      left:10,
      right:10,
      width:tableWidth,
      height:tableHeight,
      style:Ti.UI.iPhone.TableViewStyle.PLAIN,
      separatorColor:'transparent',
      backgroundColor:'transparent',
      scrollable : false
       });
       if(osname == 'ipad' && Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
      {
          tableView.left = 60;
        }
      var count = 0;
         
       //Creating table rows
        for (var y=1; y<=2; y++)
         {
            
         var thisRow = Ti.UI.createTableViewRow({
                className: "grid",
                id:y,
                layout: 'horizontal',
                 height:tableView.height/2,
                backgroundColor:'transparent',
                backgroundSelectedColor:"transparent", //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
                separatorColor:'white'
            });
         
         //Creating Table columns  
       for (var x = 1; x <= 3; x++)
        {
          if (count < holddatavar.rowCount)
           {
            if(holddatavar.rowCount > 0)
            {
             imgData = holddatavar.fieldByName('Image');
              labelname = holddatavar.fieldByName('label_name');
               miscueMenu_ButtonId = holddatavar.fieldByName('menuItemKey');
             position = holddatavar.fieldByName('Position');
             }
            //Creating view
          var thisView = Ti.UI.createView({
            backgroundColor:'transparent',
            viewid :x+1,
            left:'20dp',
             right:'10dp',
             height:thisRow.height - 5,
             width:tableView.width/3 - 35,
           });
         
         miscueMenuScreenIconHeight = thisView.height - 65;
         miscueMenuScreenIconWidth = thisView.height - 58;
        if(Ti.Platform.name == 'iPhone OS')
        {
           if(osname == 'ipad')
            {
             miscueMenuScreenIconHeight = thisView.height - 75;
             miscueMenuScreenIconWidth = thisView.height - 32;
            }
         }
       else if(Ti.Platform.name == 'android' && Inch >= InchValue)
       {
            miscueMenuScreenIconHeight = thisView.height - 65;
            miscueMenuScreenIconWidth = thisView.height - 32;
            //V1.9 SDK7 - isLandscape is no longer a function
         //if(Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
             {
               miscueMenuScreenIconWidth = thisView.height - 50;
             }
        }
   
         if(osname == 'ipad')
          {
             thisView.width = 180;
          }
        
         if(Titanium.Platform.displayCaps.dpi == 320 && Inch >= InchValue)
          {
             thisView.width = 150;
          }
     
         if(thisView.height <  (tableView.width/3 - 35))
          {
            thisView.width = thisRow.height - 5;
          }
        
         //V1.9 SDK7 - isLandscape is no longer a function
         //if(Ti.Gesture.isLandscape() || Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         {
             if((x == 1 && y == 1) || (x == 1 && y == 2))
               { 
                  thisView.left = tableView.width /3 - (thisView.width - 40);
                  thisView.right = '15dp';
               }
             if(( holddatavar.rowCount == 2 && (x == 1 && y == 1)))
               {
                  thisView.left = thisView.left  + thisView.width/2 + 20;
                  thisView.right = '15dp';
               }
             if( holddatavar.rowCount == 4 && (x == 1 && y == 2))
               {
                  thisView.left = thisView.left  + thisView.width + 35;
                  thisView.right = '15dp';
               }
             if( holddatavar.rowCount == 5 && (x == 1 && y == 2))
               {
                  thisView.left = thisView.left  + thisView.width/2  + 15;
                  thisView.right = '15dp';
               }
         }
        else
        {
            if(( holddatavar.rowCount == 2 && (x == 1 && y == 1)))
            {
                thisView.left = thisView.width/2 + 15;
                thisView.right = '15dp';
            }
            
            if( holddatavar.rowCount == 4 && (x == 1 && y == 2))
            {
                thisView.left = thisView.width + 35;
                thisView.right = '15dp';
            }
            
            if( holddatavar.rowCount == 5 && (x == 1 && y == 2))
            {
                thisView.left = thisView.width/2 + 20;
                thisView.right = '15dp';
            }
        }
         
      // Creating icon image
      //1.9 SDK7 - Added r_miscue as tt is undefined & r_styles as $$ is undefined
      //var thisButtonIcon= Ti.UI.createImageView(tt.combine($$.boldHeaderText,{
      	var thisButtonIcon= Ti.UI.createImageView(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
            width:miscueMenuScreenIconWidth,
            height:miscueMenuScreenIconHeight,
            bottom:(Inch >= InchValue)?'65dp':'55dp',
            // defaultImage:'/images/phase5/NOIMAGE.png',
            buttonid :position,
            backgroundColor:'transparent',
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
            image:imgData,
            iconid:miscueMenu_ButtonId,
            labelId:labelname
       }));
      
       if(thisButtonIcon.height > 120)
           {
               thisButtonIcon.height = (osname == 'android')?'120dp':'130dp';
           }
           
       if(thisButtonIcon.width > 130)
           {
              thisButtonIcon.width = (osname == 'android')?'130dp':'140dp';
           }
           
       if(thisButtonIcon.width > thisView.width)
           {
               thisButtonIcon.width = thisView.width;
           }
           
       if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
           {
               thisButtonIcon.bottom = '63dp';
               thisButtonIcon.width = thisButtonIcon.width - 20;
           }
     
       thisButtonIcon.height = thisButtonIcon.width;
      //Creating text label
        var thisLabel = Ti.UI.createLabel({
            backgroundColor:'transparent',
            color:fontcolour,
            left:'0dp',
            textAlign:'center',
            font:{fontSize:(Inch >= InchValue)?'20dp':'12dp',fontWeight:'bold',fontFamily:pagefontfamily},
            text:labelname,
            height:'68dp',
            iconid:miscueMenu_ButtonId,
            labelId:labelname,
            width:'96%',
            buttonid :position,
            bottom:'0dp'
         });
      
        if(thisLabel.text.length > 26)
          {
              thisLabel.text = thisLabel.text.substring(0, 24) + '..';
          }
          thisButtonIcon.borderWidth = 0;
          m++;
       
        //Adding button, Label and view
         thisView.add(thisButtonIcon);
         thisView.add(thisLabel);
         thisRow.add(thisView);
         cellIndex++;
         colorSetIndex++;
         holddatavar.next();
       }
       count++;
     }
    
     tableData.push(thisRow);
     }
       db.close();
      tableView.data = tableData;
   ///Adding button image and menu label to table view
    miscueMenuWin.add(tableView);
    
    db.close();
      
     //Table view event listner
     tableView.addEventListener('click', tableViewClickEvent);         
    return tableData;
     }   //close function
     
          
       
       function tableViewClickEvent(e)
         {
         var index = e.index;
       var row = e.source.ids;
       var positionValue = e.source.buttonid;
       var buttonId = e.source.iconid;
       var labelTextName = e.source.labelId;
       
       if(buttonId != null)
        {
            var db = Titanium.Database.open('Miscue');
         var userMenuItemRow = db.execute('SELECT * FROM UserMenuItem WHERE userId = ? AND menuKey =? AND Position = ?',userId,menuItemKey,positionValue);
         if(userMenuItemRow.rowCount > 0)
         {
            var hmvalue = userMenuItemRow.fieldByName('Type');
             var buttonId = userMenuItemRow.fieldByName('menuItemKey');
         }
         userMenuItemRow.close();
         db.close();
          Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode);
         }
         Ti.App.Properties.setString('isConvertedToDP', 'false');
           switch (buttonId) 
              {
                case 'start':
                    if(isProcessInProgress == true)
                {
                    isProcessInProgress = false;
                    var db = Titanium.Database.open('Miscue');
                        var groupcheckrow = db.execute ('SELECT * FROM LearnerGroup WHERE loginUserId = ? AND deleted = ?',userId,'no');
                        if(groupcheckrow.rowCount > 0)
                        {   
                          db.close();
                          //1.9 SDK7 - Added r_miscue as tt is undefined 
                          //var groupwindow = tt.ui.createGroupWindow(userName,token,userId,buttonId,menuItemKey);
                          var groupwindow = r_miscue.tt.ui.createGroupWindow(userName,token,userId,buttonId,menuItemKey);
                          groupwindow.open();
                          miscueMenuWin.close();
                          tableView.removeEventListener('click', tableViewClickEvent);
                          miscueMenuBackgroundImageView.remove(miscueMenuBackgroundImage);  
                          miscueMenuBackgroundImageView = null;
                          miscueMenuBackgroundImage = null;
                        }
                       else
                        {
                           db.close();
                           var labelArray = new Array();
                           labelArray['title']=['Alert','Alert'];
                           labelArray['message']=['no_Group_Message','No Groups are assigned for this user'];
                           labelArray[1]=['Ok','Ok'];
                           //V1.9 SDK7 - Added r_HomeScreen
                           var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
                           //var dialog = createLocalizedAlertDialog(labelArray, userName);
                           dialog.show();
                           isProcessInProgress = true;
                         }
                         groupcheckrow.close();
                       }
                        break;
                  case 'resume':
                    if(isProcessInProgress == true)
                      {
                            isProcessInProgress = false;
                            var db = Titanium.Database.open('Miscue');
                            var resumerow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND isLastEditedSession  = ? AND sessionStatus != ? ",userId,'true','DELETED');
                            var resumeRowCount = resumerow.rowCount;
                            if(  resumeRowCount > 0)
                             {
                                var session_Guid = resumerow.fieldByName('sessionGuid');
                                var bookGuid = resumerow.fieldByName('bookGUID');
                                var miscueAccuracy = resumerow.fieldByName('accuracyValue');
                                var learnerGuid = resumerow.fieldByName('learnerGuid'); 
                                resumerow.close();
                                db.close();
                                // var db = Titanium.Database.open('Miscue');
                                // db.execute('UPDATE MiscueSession SET isSessionModified = ? WHERE bookGUID = ? AND userId = ? AND learnerGuid = ?', 'true', bookGuid, userId,learnerGuid);
                                // db.close();
                                var isSessionBookPage = 'book';
                                //1.9 SDK7 - Added r_miscue as tt is undefined 
                                //var sessionwindow = tt.ui.createSessionWindow(userName,session_Guid,userId,token,bookGuid,isSessionBookPage,menuItemKey);
                                var sessionwindow = r_miscue.tt.ui.createSessionWindow(userName,session_Guid,userId,token,bookGuid,isSessionBookPage,menuItemKey);
                                sessionwindow.open();
                                miscueMenuWin.close();
                                tableView.removeEventListener('click', tableViewClickEvent);
                                miscueMenuBackgroundImageView.remove(miscueMenuBackgroundImage);  
                                miscueMenuBackgroundImageView = null;
                                miscueMenuBackgroundImage = null;
                             }
                            else if(resumeRowCount == 0)
                             {
                                var labelArray = new Array();
                                labelArray['title']=['Alert','Alert'];
                                labelArray['message']=['no_Resume_Last_Message','User has not created any sessions or has deleted the last modified session'];
                                labelArray[1]=['Ok','Ok'];
                                //V1.9 SDK7 - Added r_HomeScreen
                                var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
                                //var dialog = createLocalizedAlertDialog(labelArray, userName);
                                dialog.show();
                                isProcessInProgress = true;
                             }
                            break;
                         }
                   case 'search':
                        if(isProcessInProgress == true)
                         {
                             isProcessInProgress = false;
                             var db = Titanium.Database.open('Miscue');
                             var searchrow =  db.execute("SELECT * FROM MiscueSession WHERE userId=? AND sessionStatus != ?",userId,'DELETED');
                             if(searchrow.rowCount > 0 ) 
                               {
                                  var bookGuid = searchrow.fieldByName('bookGUID');
                                  var learnerGuid = searchrow.fieldByName('learnerGuid');
                                  db.close();                                  
                                  // var db = Titanium.Database.open('Miscue');
                                  // db.execute('UPDATE MiscueSession SET isSessionModified = ? WHERE bookGUID = ? AND userId = ? AND learnerGuid = ?', 'true', bookGuid, userId,learnerGuid);
                                  // db.close();
                                  var focusval = 1;
                                  //1.9 SDK7 - Added r_miscue as tt is undefined 
                                  //var searchsessionwin = tt.ui.createsearchSession(userName,userId,token,menuItemKey);
                                  var searchsessionwin = r_miscue.tt.ui.createsearchSession(userName,userId,token,menuItemKey);
                                  searchsessionwin.open();
                                  miscueMenuWin.close();
                                  tableView.removeEventListener('click', tableViewClickEvent);
                                  miscueMenuBackgroundImageView.remove(miscueMenuBackgroundImage);  
                                  miscueMenuBackgroundImageView = null;
                                  miscueMenuBackgroundImage = null;
                               } 
                            else
                              {
                                 db.close();
                                 var labelArray = new Array();
                                 labelArray['title']=['Alert','Alert'];
                                 labelArray['message']=['no_Session_Message','User has not created any sessions'];
                                 labelArray[1]=['Ok','Ok'];
                                 //V1.9 SDK7 - Added r_HomeScreen
                                 var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
                                 //var dialog = createLocalizedAlertDialog(labelArray, userName);
                                 dialog.show();
                                 isProcessInProgress = true;
                               }
                         }
                  }
                 
            }
    
       
       
 function getOrientation(orientVal) {
    var value;
    switch (orientVal) {
    
    case 1:  value = 1;
          break;
    
    case 4:  value = 2;break;
    
    case 2:  value = 3;break;
    
    case 3:
     value = 4;break;
    
    default:  value = 0;break;
    
    }
    return value;
    }

     var orientCount = 6;
   
     // Closing loading activity
       
      function orientionChangeMode(e)
      { 
           var orientVal = e.source.orientation;
           var orientationVal = getOrientation(orientVal);
           // if(Inch >= InchValue || osname=='ipad'){// after changing the portrait only support for all devices
           if(Inch >= InchValue){
           	if(orientationVal != orientCount && orientationVal != 0)
            {
                orientCount = orientationVal;
                //V1.9 SDK7 - Added r_loadingScreen
                var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
                //var screenRes = backgroundImageHeightWidthPxToDp();
                miscueMenuBackgroundImage.height = screenRes[1];
                miscueMenuBackgroundImage.width = screenRes[0];
                //V1.9 SDK7 - Added r_loadingScreen
                var portraitval = r_loadingScreen.dptopixel();
                //var portraitval = dptopixel();
                screenHeaderLabel();
                var lwidth = Ti.Platform.displayCaps.platformWidth;
                tableView.removeEventListener('click', tableViewClickEvent);  
                for ( var x in miscueMenuWin.children ) 
                  {
                     if(miscueMenuWin.children.length >= 3)
                        {
                            tableDataValue = null;
                            miscueMenuWin.remove(tableView);
                            break;
                         }
                    }
                tableDataValue = createMiscueMenupages(lwidth,userId,menuItemKey);
            }
           }
           
      }
      Ti.Gesture.addEventListener('orientationchange', orientionChangeMode); 
     return miscueMenuWin;
      };
    })();
    
    //1.9 SDK7 - Changed includes to requires
    /*Ti.include(
    '/MainMiscue/ui/sessionGroupPage.js',
    '/MainMiscue/ui/searchSession.js'
    );*/
   
   var r_sessionGroupPage = require('/MainMiscue/ui/sessionGroupPage');
   var r_searchSession = require('/MainMiscue/ui/searchSession');

 
//Function to recieve learner details from server and database integration
function getGroupLearner(xmlSync,userName,token,menuItemKey,homeWind)
    {   
   	
        // Check learner details is deleted from server or not
        // by default 'Deleted' = no.
        var i,j,isDeleted = 'no';
    
        var docData = Ti.XML.parseString(xmlSync);
       var responses = docData.getElementsByTagName("response");
       //V1.9 SDK7 changed to textContent as text is deprecated
       var result = docData.getElementsByTagName("result").item(0).textContent;
       //var result = docData.getElementsByTagName("result").item(0).text;
       
        
      if(result == 'REQUEST_OK')
      {
      var datas = docData.getElementsByTagName("data");
      var groups = datas.item(0).getElementsByTagName("groups");
      var group = groups.item(0).getElementsByTagName("group");
      
      Ti.API.info('group at miscue menu page returned from server');
     
       //Opening the database
      var db = Titanium.Database.open('Miscue');
      var grouploginrow = db.execute('SELECT * FROM Login  WHERE username=?',userName);
      var loginUserId = grouploginrow.fieldByName('userid');
      grouploginrow.close();
       var groupUpdateRowCount =  db.execute('SELECT * FROM LearnerGroup  WHERE loginUserId=?',loginUserId);
       if(groupUpdateRowCount.rowCount > 0)
       {
        //updating learnergroup table and updating deleted column to 'yes'.
       db.execute('UPDATE LearnerGroup SET deleted = ? WHERE loginUserId=? ','yes',loginUserId);        
      }
      groupUpdateRowCount.close();
     db.close();
       if (group.length >= 1 )
       {
        
        for (i=0; i < group.length; i++)
         {
           var groupname =  responses.item(0).getElementsByTagName("group").item(i).getAttribute("name");
          groupname = groupname.replace(/'/gi,'&quot;');
           var groupguid =  responses.item(0).getElementsByTagName("group").item(i).getAttribute("guid");
            var learner =  group.item(i).getElementsByTagName("learners");
           var learnercount =  group.item(i).getElementsByTagName("learner");
           var db = Titanium.Database.open('Miscue');
            db.execute('UPDATE Learner SET deleted = ? WHERE groupGuid=? AND userId =? ','yes',groupguid,loginUserId);//Updating learner table and updating the deleted column to 'YES".    
          var groupRowCount =  db.execute('SELECT * FROM LearnerGroup  WHERE groupGuid=? AND loginUserId=?',groupguid,loginUserId);
                    if(groupRowCount.rowCount > 0)
                 {
                    groupRowCount.close();
            db.execute('UPDATE LearnerGroup SET groupName=?, deleted = ? WHERE groupGuid=? AND loginUserId=? ',groupname,'no',groupguid,loginUserId);   
                 db.close();
                 }
                 else{
                 db.close();
                 //V1.9 SDK7 - Added r_Miscuedb
           r_Miscuedb.InsertGroup(groupguid,groupname, isDeleted,loginUserId);
           //InsertGroup(groupguid,groupname, isDeleted,loginUserId);
          }
           if(learnercount.length >= 1)
            {   
             for (j=0; j < learnercount.length; j++)
              {
              //V1.9 SDK7 - Changed text to textContent as text is deprecated
               var learnername =  group.item(i).getElementsByTagName("learner").item(j).textContent;
               //var learnername =  group.item(i).getElementsByTagName("learner").item(j).text;
               learnername = learnername.replace(/'/gi,'&quot;');
               var learnerimage =  group.item(i).getElementsByTagName("learner").item(j).getAttribute("portraitURL");
               Ti.API.info('learner image at miscue menu screen response from server '+learnerimage);
                var learnerguid =  group.item(i).getElementsByTagName("learner").item(j).getAttribute("guid");
                var db = Titanium.Database.open('Miscue');
                var learnerRowcount =  db.execute('SELECT * FROM Learner  WHERE learnerGuid=? AND groupGuid=? AND userId = ?',learnerguid,groupguid,loginUserId);
                      if(learnerRowcount.rowCount > 0)
                 {
                    learnerRowcount.close();
                 db.execute('UPDATE Learner SET learnerName=?,learnerImage =?,deleted = ? WHERE groupGuid=? AND  learnerGuid = ? AND userId =? ',learnername,learnerimage,'no',groupguid,learnerguid,loginUserId);  
                 db.close();
                 }
                 else{
                 db.close();
                 //V1.9 SDK7 - Added r_Miscuedb
               r_Miscuedb.Insertlearner(learnerguid,groupguid,learnername,learnerimage,isDeleted,loginUserId);
               //Insertlearner(learnerguid,groupguid,learnername,learnerimage,isDeleted,loginUserId);
              }
              }//for
            }//if
           
          }//for
        }//if
         var base_URL = "https://www.miscue.co.uk/iglooapi/apirequest.aspx";
       var getbook = '<request><requesttype>GETBOOKS</requesttype><accesstoken>'+token+'</accesstoken></request>';
        var flg = 4;
        //Added r_Apifile
        r_Apifile.createApi(base_URL,getbook,userName,token,flg,homeWind,loginUserId,menuItemKey);
        //createApi(base_URL,getbook,userName,token,flg,homeWind,loginUserId,menuItemKey);
        
        }
        else if(result != 'REQUEST_OK')
        {
            //V1.9 SDK7 - Added r_loadingScreen
    		r_loadingScreen.hideActivity();
    		//hideActivity();
            var error =  docData.getElementsByTagName("error");
            
            
            var MyNodeList = docData.childNodes;
            
            Ti.API.info("docData has " + MyNodeList.length + " node(s)");
            
            for(var i = 0; i < MyNodeList.length; i++){
            	Ti.API.info("Node " + i + " is " + MyNodeList[i]);
            }
            
            for(var i = 0; i < MyNodeList.length; i++){
            	Ti.API.info("Node " + i + " is called " + MyNodeList[i].nodeName);
            }
            
            for(var i = 0; i < MyNodeList.length; i++){
            	Ti.API.info("Node " + i + " has a value of " + MyNodeList[i].nodeValue);
            }
            
            
        var message = error.item(0).getElementsByTagName("message").item(0).text;
        var labelArray = new Array();
             labelArray['title']=['Alert','Alert'];
             labelArray['message']=['invalid_Session_Message',message];
             labelArray[1]=['Ok','OK'];
             //V1.9 SDK7 - Added r_HomeScreen
             var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
             //var dialog = createLocalizedAlertDialog(labelArray, userName);
            dialog.show();
            
             dialog.addEventListener('click',function(e){
             if(e.index == 0)
             {
                var db = Titanium.Database.open('Miscue');
                 db.execute('UPDATE Login SET logoutFlag=? WHERE userid=?',2,loginUserId);
                 db.close();
                 //1.9 SDK7 - Added r_miscue as tt is undefined 
                 //var loginWin =  tt.ui.createLoginPage();
                 var loginWin =  r_miscue.tt.ui.createLoginPage();
                loginWin.open();
                      homeWind.close();
                 }
             });
            }
      }
      //V1.9 SDK7 - Added exports
      exports.getGroupLearner = getGroupLearner;
      
    function createBooksTest(xmldata,userName,token,miscueWind,userId,menuItemKey)
    {
   /// Add CDATA to book details     
    var xmldata1 = xmldata.replace(/"  >/g, '" ><![CDATA[');
    var xmldata2 = xmldata1.replace(/<\/book>/gi, ']]></book>');
    var xmldata3 = xmldata2.replace(/<br/gi,' <br');
    xmldata3 = xmldata3.replace(/\/>/gi,'/> ');
  
  
    var i,j,isDeleted = 'no',status = 'null';
    var xmlSync = xmldata3;
    var docData = Ti.XML.parseString(xmlSync);
    var responses = docData.getElementsByTagName("response");
    var datas = docData.getElementsByTagName("data");
    //V1.9 SDK7 - Changed text to textContent as text is deprecated
    var result = docData.getElementsByTagName("result").item(0).textContent;
       
            
      if(result == 'REQUEST_OK')
      {
      var books = datas.item(0).getElementsByTagName("books");
     
     if(books.length > 0)
     {
      var book = books.item(0).getElementsByTagName("book");
      if(book.length > 0)
      {
       var db = Titanium.Database.open('Miscue');
      var grouploginrow = db.execute('SELECT * FROM Login  WHERE username=?',userName);
      var userId = grouploginrow.fieldByName('userid');
      grouploginrow.close();
      var bookRowCheck = db.execute('SELECT * FROM UserBook WHERE userId = ?',userId);
      if(bookRowCheck.rowCount > 0)
      {
      db.execute('UPDATE UserBook SET deleted = ? WHERE userId = ? AND bookType = ?','yes',userId,'R');
      }
      bookRowCheck.close();
      db.close();
       var bookImage = ''; //bookImage tag is not available
       var date = '',lastSavedServerDate = null,lastmodifiedDate = '',isManuallyAdded = 'false';                
               for(var i = 0; i < book.length;i++)
               {
                   
                 var notesTemplate =  books.item(0).getElementsByTagName("book").item(i).getAttribute("notesTemplate").toString();
                 var sliderValues = books.item(0).getElementsByTagName("book").item(i).getAttribute("sliderValues").toString();
                 Ti.API.info('Slider Values for book: '+i+' : '+sliderValues);
                 notesTemplate = notesTemplate.replace(/\\n/gi,"\n");
                 //V1.9 SDK7 - Changed text to textContent as text is deprecated
                 var bookContent =  books.item(0).getElementsByTagName("book").item(i).textContent;
                 //var bookContent =  books.item(0).getElementsByTagName("book").item(i).text;
                 if(Ti.Platform.osname == 'android')
                {
                    bookContent = bookContent.replace(/\r\n/gi," ");
                }
                else
                {
                    bookContent = bookContent.replace(/\n/gi," ");
                }
                
               var checkString = bookContent.substring((bookContent.length - 8), bookContent.length);
                if(checkString.trim() == '<br />')
               {
                   bookContent = bookContent.substring(0, (bookContent.length - 8));
                   bookContent = bookContent.replace(/<br ?\/?>  <br ?\/?>/gi, "<br />");
                }
                var bookGuid =  books.item(0).getElementsByTagName("book").item(i).getAttribute("guid");
                  var extraHTML = books.item(0).getElementsByTagName("book").item(i).getAttribute("extraHTML");
                   extraHTML = extraHTML.replace(/%3c/gi,'<');
                 extraHTML = extraHTML.replace(/%2f/gi,'/');
                 extraHTML = extraHTML.replace(/%3e/gi,'>');
                  extraHTML = extraHTML.replace(/\+/g, " ");
                  extraHTML = extraHTML.replace(/%3d/gi,'=');
                 extraHTML = extraHTML.replace(/%27/gi,"'"); 
                 extraHTML = extraHTML.replace(/%3a/gi,':'); 
                 extraHTML = extraHTML.replace(/%3a/gi,':'); 
                Ti.API.info('extraHTMLMAL ');  
             Ti.API.info('extraHTML '+extraHTML);
                  extraHTML = Ti.Utils.base64encode(extraHTML);
                  
                var bookName =  books.item(0).getElementsByTagName("book").item(i).getAttribute("name");
                 bookName = bookName.replace(/'/gi,'&quot;');
                var bookType =  books.item(0).getElementsByTagName("book").item(i).getAttribute("type");
                
                //MAL
                bookImage = books.item(0).getElementsByTagName("book").item(i).getAttribute("pictureURL");
                
                var bookContent = Ti.Utils.base64encode(bookContent);
                var db = Titanium.Database.open('Miscue');
                var bookRow = db.execute('SELECT * FROM UserBook WHERE bookGuid=? AND userId = ?',bookGuid,userId);
                if(bookRow.rowCount > 0)
                {
                    bookRow.close();
                 db.execute('UPDATE UserBook SET  deleted = ?, bookName = ?, bookContents = ?, notesTemplate = ?, extraHTML = ?, sliderValues = ? WHERE userId=? AND bookGuid = ? ','no', bookName, bookContent, notesTemplate, extraHTML,sliderValues, userId,bookGuid);  
                 db.close();
                }
                else{
                db.close();
                Ti.API.info('book contents from server '+bookContent);
                Ti.API.info('book name from server '+bookName);
                //V1.9 SDK7 - Added r_Miscuedb
                r_Miscuedb.insertBook(bookContent,bookName,bookGuid,bookImage,bookType,isDeleted,status,date,lastmodifiedDate,isManuallyAdded,lastSavedServerDate,userId, notesTemplate, extraHTML, sliderValues);
                //insertBook(bookContent,bookName,bookGuid,bookImage,bookType,isDeleted,status,date,lastmodifiedDate,isManuallyAdded,lastSavedServerDate,userId, notesTemplate, extraHTML, sliderValues);
                
                }
            }
        }
    }
    //V1.9 SDK7 - Added r_loadingScreen
    r_loadingScreen.hideActivity();
    //hideActivity();
    miscueWind.touchEnabled = true;
    //1.9 SDK7 - Added r_miscue as tt is undefined 
    //var miscuewindow = tt.ui.createmiscueMenuPage(userName,token,menuItemKey);
     var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(userName,token,menuItemKey);
                         miscuewindow.open();
                        miscueWind.close();
     
    }
       else if(result != 'REQUEST_OK')
        {
            //V1.9 SDK7 - Added r_loadingScreen
    		r_loadingScreen.hideActivity();
    		//hideActivity();
            miscueWind.touchEnabled = true;
            var error =  docData.getElementsByTagName("error");
            //V1.9 SDK7 - Changed text to textContent as text is deprecated
            var message = error.item(0).getElementsByTagName("message").item(0).textContent;
    //var message = error.item(0).getElementsByTagName("message").item(0).text;
    
    var labelArray = new Array();
             labelArray['title']=['Alert','Alert'];
             labelArray['message']=['invalid_Session_Message',message];
             labelArray[1]=['Ok','OK'];
             //V1.9 SDK7 - Added r_HomeScreen
             var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
             //var dialog = createLocalizedAlertDialog(labelArray, userName);
             dialog.show();
             dialog.addEventListener('click',function(e){
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
                      miscueWind.close();
                     }
                     else{
                        message = 'Continuing with local data';
                        showToastMessage(message);
                        
                     }
             }
             });
            
        }
    }
    //V1.9 SDK7 - Added export
    exports.createBooksTest = createBooksTest;
    
    

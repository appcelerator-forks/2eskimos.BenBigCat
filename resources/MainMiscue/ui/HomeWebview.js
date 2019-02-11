/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

(function() {
	//1.9 SDK7 - Changed duplicate 'menuItem_key' parameter to 'menuItem_keyDuplicate'
     tt.ui.createHomeWebview = function(menuItem_key,userName,osname,textValue,token,menuItem_keyDuplicate,user_Id) {
            //Getting Screen width and height
            Ti.API.info('home web view');
     var pWidth = Ti.Platform.displayCaps.platformWidth;
       // database open
       var db = Titanium.Database.open('Miscue');
      var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',user_Id);
     //Extracting the Usersetting datas from local database 
     var schoolnames = homerow.fieldByName('schoolName');
     var backpage = homerow.fieldByName('backPage');
     var backcolour = homerow.fieldByName('backgroundColor');
     var fontcolour = homerow.fieldByName('fontColor');
     var pagefontfamily = homerow.fieldByName('charFont');
     var webViewWindowBackgroundImage = homerow.fieldByName('selectionPagebackgroundURL');
     var dec = Ti.Utils.base64decode(schoolnames);
       //BackButton
       //V1.9 SDK7 - Added r_loadingScreen
       var backView = r_loadingScreen.createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
      //var backView = createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
     homerow.close();
    homerow = null;
     var homescrn = db.execute('SELECT * FROM UserMenuItem where menuItemKey = ? AND userId = ?',menuItem_key, user_Id);
     var hmlink = homescrn.fieldByName('Link');
    
     var hmimg = homescrn.fieldByName('label_name');
     homescrn.close();
     homescrn = null;
     db.close();
     db = null;
     //V1.9 SDK7 - Added r_loadingScreen
     var iOS7 = r_loadingScreen.isiOS7Plus();
     //var iOS7 = isiOS7Plus();
     //Creating Window
      var homeWebWin = Ti.UI.createWindow({
        fullscreen:false,
        navBarHidden:true,
        backgroundColor:'white',
        title:''
       });
       
       if(iOS7 >= 7)
         {
          homeWebWin.top = '20dp';
         }
         
         //V1.9 SDK7 - Added r_loadingScreen
         var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(webViewWindowBackgroundImage);
         //var screenBackgroundImage = mainBackgroundImage(webViewWindowBackgroundImage);
         
         //V1.9 SDK7 - Added r_loadingScreen
         var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
         //var screenRes = backgroundImageHeightWidthPxToDp();
         if (osname == 'iphone' || osname == 'ipad') {
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
		}else{
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
		}
         
            screenBackgroundImage[1].width = screenRes[0];
            
         homeWebWin.add(screenBackgroundImage[0]);
         //V1.9 SDK7 - added r_loadingScreen
         var Inch = r_loadingScreen.screenInch();
       //var Inch = screenInch();
        if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         {
             if(Inch >= InchValue)
              {
                backView.height = 70;
                backView.width = 135;
                }
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
          if(osname == 'iphone')
         {
               backView.height = 48;
               backView.width = 78;
         }
          if(Inch < InchValue && osname == 'android')
          {
             backView.height = 50;
             backView.width = 80;
            homeWebWin.orientationModes = [Titanium.UI.PORTRAIT];
       }else if(osname == 'android'){
       	 	homeWebWin.orientationModes = [Titanium.UI.PORTRAIT];
       }
       
    
       
      var isProcessInProgress = true; 
    //Back button functionality     
   backView.addEventListener('click', function (e) {
    if(isProcessInProgress == true)
    {
        isProcessInProgress = false;
         var labelArray = new Array();
        labelArray['message']=['loading_Indicator','Loading..'];
        //V1.9 SDK7 - Added r_loadingScreen
        r_loadingScreen.showActivity(labelArray['message'], userName);
        //showActivity(labelArray['message'], userName);
        refreshButton.removeEventListener('click', function(e){ });
        backButton.removeEventListener('click', function() { });
        forwardButton.removeEventListener('click', function() { });
         Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode); 
        setTimeout(function()
         {
         homeWebWin.remove(webViewContainer);
         homeWebWin.remove(view);
         homeWebWin.remove(backView);
         homeWebWin.remove(webViewLabel);
         webViewContainer.remove(borderLineViewContainer);
         webViewContainer.remove(backButton);
         webViewContainer.remove(forwardButton);
         webViewContainer.remove(refreshButton);
          homeWebWin.remove(webViewContainer);
          homeWebWin.remove(screenBackgroundImage[0]);
          screenBackgroundImage[0] = null;
          borderLineViewContainer = null;
          backButton = null;
          refreshButton = null;
          forwardButton = null;
         view = null;
         webViewContainer = null;
         webView = null;
         backView = null;
         top = null;
         Inch = null;
         var refcheck = 2;
         var wind = tt.ui.createHomeScreen(userName,token,refcheck);
         wind.open();
         //V1.9 SDK7 - Added r_loadingScreen
         r_loadingScreen.hideActivity();
        //hideActivity();
         homeWebWin.close();
         homeWebWin = null;
           },500);
    }
   });
    
    if(Ti.Platform.osname == 'android')
    {
    homeWebWin.addEventListener('android:back', function(){
       if(isProcessInProgress == true)
        {
            isProcessInProgress = false;
             refreshButton.removeEventListener('click', function(e){ });
            backButton.removeEventListener('click', function() { });
            forwardButton.removeEventListener('click', function() { });
             Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode); 
              homeWebWin.remove(view);
              homeWebWin.remove(webView);
              homeWebWin.remove(backView);
              homeWebWin.remove(webViewLabel);
              webViewContainer.remove(borderLineViewContainer);
              webViewContainer.remove(backButton);
              webViewContainer.remove(forwardButton);
              webViewContainer.remove(refreshButton);
              homeWebWin.remove(webViewContainer);
              
              homeWebWin.remove(screenBackgroundImage[0]);
              screenBackgroundImage[0] = null;
              borderLineViewContainer = null;
              backButton = null;
              refreshButton = null;
              forwardButton = null;
             view = null;
             webViewContainer = null;
             webView = null;
             backView = null;
              var refcheck = 2;
              var wind = tt.ui.createHomeScreen(userName,token,refcheck);
              wind.open();
              homeWebWin.close();
              homeWebWin = null;
              top = null;
              Inch = null;
         }
      });
    }
     
     //V1.9 SDK7 - Added r_loadingScreen
    var top = r_loadingScreen.titleLabeltop();
    //var top = titleLabeltop();   
  
        // Creating label 
     var  webViewLabel = Ti.UI.createLabel({
            color:'#CEDEE6',
            backgroundColor:'transparent ',
            top:'5%',
            width:'100%',
            font:{fontSize:(Inch >= InchValue)?'28dp':'18dp',fontWeight:'bold',fontFamily:pagefontfamily},
            textAlign:'center',
            text: textValue,
          });
          
        
          
    homeWebWin.add(webViewLabel);
   
   homeWebWin.add(backView);
   
       var webViewContainer = Ti.UI.createView({
        backgroundColor:'#2F9DCF',
        bottom:'0dp',
        width:'100%',
        height:'5%',
       });
     
      var borderLineViewContainer = Ti.UI.createView({
        backgroundColor:'#aaa',
        top:'0dp',
        width:'100%',
        height:'5%',
        });
       var backButton = Titanium.UI.createButton({
         backgroundColor:'NONE',
        bottom : 0,
        left : '1%',
        verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        height : '90%',
        width:'7%',
         backgroundImage:'/images/phase5/BACKWARDSPURPLE.png',
    });
    
    var refreshButton = Titanium.UI.createButton({
        backgroundColor:'NONE',
        backgroundImage:'/images/phase5/PAGEREFRESHPURPLE.png',
        bottom : 0,
        left : '11%',
        verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        height : '89%',
        width:'7%',
    });
    
    var forwardButton = Titanium.UI.createButton({
        backgroundColor:'NONE',
        bottom : 0,
        left : '21%',
        verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        height : '90%',
        width:'7%',
        backgroundImage:'/images/phase5/FORWARDSPURPLE.png',
    });
    
     if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
    {
        backButton.width = '86%';
        backButton.width = '2%';
        refreshButton.width = '86%';
        refreshButton.width = '2%';
        refreshButton.left =  '4.5%';
        forwardButton.width = '86%';
        forwardButton.width = '2%';
        forwardButton.left =  '8%';
    }
    
    refreshButton.addEventListener('click', function() {
        webView.reload();
    });
    
    backButton.addEventListener('click', function() {
        webView.goBack();
    });
    forwardButton.addEventListener('click', function() {
        webView.goForward();
    });
    webViewContainer.add(borderLineViewContainer);
    webViewContainer.add(backButton);
    webViewContainer.add(forwardButton);
    webViewContainer.add(refreshButton);
    
    
     
    
      //Creating view
    var view = Ti.UI.createView({
        top:top[2],
        left:0,backgroundColor:'transparent',height:'80%'});

     var webView = Titanium.UI.createWebView({
        backgroundColor:'white',
        hideLoadIndicator :true,
        canGoBack : true,
        canGoForward : true,
        url:hmlink,
        height:'100%',
        width:'100%'
      }); 
    
    view.add(webView); //Adding webview to view
    homeWebWin.add(view);   //Adding view to window
    
    //Creating Load activity indicator
    
        var style;
        if (Ti.Platform.name === 'iPhone OS'){
          style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
        }
        else {
          style = Titanium.UI.ActivityIndicatorStyle.DARK;
        }
        var activityIndicator = Ti.UI.createActivityIndicator({
          color: '#aaa',
          font: {fontFamily:'Helvetica Neue', fontSize:'21dp', fontWeight:'bold', fontFamily:'Roboto',fontSize:'21dp', fontWeight:'bold' },
          style:style,
          height:'auto',
          width:'auto',
          indicatorColor:'#0000FF',
          indicatorDiameter:70
        }); //-Lee added Roboto for Android
          
    homeWebWin.add(webViewContainer);
    
     //Webview before loading eventlistner
     view.addEventListener('beforeload',function(){
          view.add(activityIndicator);
          activityIndicator.show();
      });
         
       //Webview loading eventlistner
       webView.addEventListener('load',function(){ 
         activityIndicator.hide();
       });
     
     
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
     
function orientionChangeMode(e) {
	//V1.9 SDK7 - Rotation event handlers cause screen flicker and are otherwise pointless.
			return;
       var orientVal = e.source.orientation;
       var orientationVal = getOrientation(orientVal);
    if(orientationVal != orientCount && orientationVal != 0)
    {
         if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         {
                backView.height = 70;
                backView.width = 135;
         }
         else
         {
             if(Inch >= InchValue)
              {
                backView.height = 80;
                backView.width = 145;
                }
         }
         //V1.9 SDK7 - Added r_loadingScreen
         var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
        //var screenRes = backgroundImageHeightWidthPxToDp();
         //screenBackgroundImage[1].height = screenRes[1];
         screenBackgroundImage[1].width = screenRes[0];
      //V1.9 SDK7 - isLandscape is no longer a function
      //if(Ti.Gesture.isLandscape())
      if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) 
      {
         backButton.width = '86%';
        backButton.width = '2%';
        refreshButton.width = '86%';
        refreshButton.width = '2%';
        refreshButton.left =  '4.5%';
        forwardButton.width = '86%';
        forwardButton.width = '2%';
        forwardButton.left =  '8%';
        if(Inch >= InchValue){
	        screenBackgroundImage[1].height = screenRes[1];
			Ti.API.info('or change landscape'+screenBackgroundImage[1].height);	
        }        
      }
       else
       {
         refreshButton.width = '89%';
        refreshButton.width = '7%';
        backButton.width = '89%';
        backButton.width = '7%';
         refreshButton.left =  '11%';
        forwardButton.width = '89%';
        forwardButton.width = '7%';
         forwardButton.left =  '21%';
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
		}
       }
     }
}
     
     
         // Closing loading activity
     Ti.Gesture.addEventListener('orientationchange', orientionChangeMode);
       
          return homeWebWin;
   };
 })();

 
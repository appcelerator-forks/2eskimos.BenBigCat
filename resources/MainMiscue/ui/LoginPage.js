/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//1.9 SDK7 - Changed includes to requires
/*Ti.include(
    '/MainMiscue/ui/styles.js',
    '/MainMiscue/ui/Apifile.js',
    '/MainMiscue/model/Miscuedb.js'
  );*/
 var r_styles = require('/MainMiscue/ui/styles');
 var r_Apifile = require('/MainMiscue/ui/Apifile');
 var r_Miscuedb = require('/MainMiscue/model/Miscuedb');
 //1.9 SDK7 - Added reference to miscue page (this screen would have been able to access miscue.js when includes were used)
 var r_miscue = require('/MainMiscue/miscue.js');
 //1.9 SDK7 added reference to loadingScreen as it's functions
 //are used multiple times in this page.
 var r_loadingScreen = require('/MainMiscue/ui/loadingScreen');

(function() {
    
     //create the main application window function
     //1.9 SDK7 - Added r_miscue as tt is undefined 
    //tt.ui.createLoginPage = function(_args) {
    	r_miscue.tt.ui.createLoginPage = function(_args) {
    var username,password,cookie=null;  
    var osname = Ti.Platform.osname;
    // opening the database
    var db = Titanium.Database.open('Miscue');
    var usrcach = 'User Name';
    //Caching the username
    var cacherow = db.execute('SELECT * FROM Login WHERE cachevalue=?',1);
    if (cacherow.rowCount >=1)
     {
      var usrcach = cacherow.fieldByName('username');
     }
    cacherow.close();
    db.close();
    //Getting window width and height
    var pWidth = Ti.Platform.displayCaps.platformWidth;
     var pHeight = Ti.Platform.displayCaps.platformHeight;
      
      var devicemodel = Titanium.Platform.model; ///Getting device model
      var devosversion = Titanium.Platform.version;  ///Getting OS version
      var deviceinstalid = Ti.Platform.createUUID();  ////Creating uniques deviceID
      //Store the deviceID into database 
      var db = Titanium.Database.open('Miscue');
    //Caching the username
    var deviceidrow = db.execute('SELECT * FROM DeviceID');
    ///Inserting the deviceID to DeviceID table
    ///Inserting only one UniqueID  becuase deviceID is unique identifier
    if(deviceidrow.rowCount == 0)
    {
     db.close();
       r_Miscuedb.insertDeviceinstalID(deviceinstalid);
      }
      else{
      db.close();
      }
      deviceidrow.close();
     
    //Creating login window 
    var loginWin = Ti.UI.createWindow({
        fullscreen:false,
        navBarHidden:true,
         exitOnClose:true,
        backgroundColor:'white',
        tabBarHidden:true,
        height:'100%',
        width:'100%',
        titleControl:false
    });
        
    Ti.App.Properties.setString('isConvertedToDP', 'true');
        
        
        //1.9 SDK7 added referemce tp r_loadingScreen
        //var Inch = screenInch();
        var Inch = r_loadingScreen.screenInch();
      
      if(Inch < InchValue && osname == 'android')
      {
        loginWin.orientationModes = [Titanium.UI.PORTRAIT];
      }
      else if(Inch >= InchValue && osname == 'android'){
    loginWin.orientationModes = [Titanium.UI.PORTRAIT];
    }     
    
    var loginBackgroundImageView = Ti.UI.createView({
        backgroundColor:'transparent',
        height:Titanium.UI.FILL,
        width:Titanium.UI.FILL,
     });

 
    var loginBackgroundImage = Ti.UI.createImageView({
        top:'0dp',
        //defaultImage:'/images/login_bigger.png',
        backgroundColor:'#D8E028',
        center:{x:Ti.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi / 160)/2, y:Ti.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 160)/2},
     });
    
         if(osname == 'android')
         {
               loginWin.add(loginBackgroundImageView);      
               loginBackgroundImageView.add(loginBackgroundImage); 
         }
    
         //1.9 SDK7 - Added requires.
         //var screenRes = backgroundImageHeightWidthPxToDp();
         var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
         loginBackgroundImage.height = screenRes[1];
         loginBackgroundImage.width = screenRes[0];
                                  
        /*
        loginBackgroundImage.height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi/ 160));
                loginBackgroundImage.width = (Titanium.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi/ 160));
                
                Ti.API.log("Height is :: ", loginBackgroundImage.height);
                Ti.API.log("Width is :: ", loginBackgroundImage.width);
                        */
        
         /*
             
         */
        
       // Adding scroll bar
    var scrollView = Ti.UI.createScrollView({
          contentHeight:'auto',
          showVerticalScrollIndicator: true,
          showHorizontalScrollIndicator: true,
          height: 'auto',
          width: 'auto',
          backgroundColor:'transparent'
    });
       
       // Adding View 
    var container = Ti.UI.createView({          
        backgroundColor:'transparent',
        top:'1dp',
        
      });
       
    function GetHeight(value) {
        var temp = (value * 100) / 480;
        return parseInt((Ti.Platform.displayCaps.platformHeight * temp) / 100);
    }
     
    var userNameView = Ti.UI.createView({
           backgroundColor:'black',
           opacity:0.3,
           borderWidth : '2dp',
           borderColor : '#aaa',
           borderRadius : 8,
           height: 100 //V1.9 SDK7 - usrName (below) fills whole screen on iconia without this. Doesn't affect other devices for some reason //TODO BEN - USERNAME VIEW HEIGHT 
    });
                
      var leftUserIcon = Titanium.UI.createButton({
            backgroundImage:'/images/userIcon.png',
            left:'3%',
            opacity:0.3,
    });
    
      // Adding TextField  
    var usrName = Ti.UI.createTextField({
    	//V1.9 SDK7 - FIRE - Can't change font size. Can't change field height.
    	//font : {fontSize : '5dp'},
            backgroundColor:'transparent',
            value:usrcach,
            returnKeyType: Titanium.UI.RETURNKEY_NEXT,
            autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
            color:'white',
           height:Titanium.UI.FILL,
           right:0,
           focusable:true,
           height:50 //V1.9 SDK7 - usrName fills whole screen on iconia without this. Doesn't affect other devices for some reason //TODO BEN - USERNAME HEIGHT
           
            });
            
     
           
           
    
           
           /*var usrName = Ti.UI.createTextField({
    	//V1.9 SDK7 - FIRE - Can't change font size. Can't change field height.
    	//font : {fontSize : '5dp'},
            backgroundColor:'pink',
            //value:usrcach,
            value : "User Name",
            //returnKeyType: Titanium.UI.RETURNKEY_NEXT,
            //autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
            color:'white',
           height:Titanium.UI.FILL,
           //right:0,
           //focusable:true,
           height:100 //V1.9 SDK7 - usrName fills whole screen on iconia without this. Doesn't affect other devices for some reason //TODO BEN - USERNAME HEIGHT
           
            });*/
            
       userNameView.add(usrName);
       userNameView.add(leftUserIcon);
       //V1.9 SDK7 - Fix for flashing text
       
       
    
    var passwordView = Ti.UI.createView({
           backgroundColor:'black',
           opacity:0.3,
           borderWidth: '2dp',
           borderColor : '#aaa',
           borderRadius : 8,
           height: 50 //psw (below) fills whole screen on iconia without this. Doesn't affect other devices for some reason
    });
    
         var leftPadlockIcon = Titanium.UI.createButton({
            backgroundImage:'/images/padlockIcon.png',
            left:'3%',
           opacity:0.3,
       });
   
    
     // Adding TextField    
    var psw = Ti.UI.createTextField({
            //passwordMask:true,
            returnKeyType:Titanium.UI.RETURNKEY_DONE,
            autocapitalization:Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
            backgroundColor:'transparent',
            color:'white',
           height:Titanium.UI.FILL,
           right:0,
           
           //V1.9 SDK7 - psw fills whole screen on iconia without this. Doesn't affect other devices for some reason
           height : 50
    });
    
    passwordView.add(psw);
    passwordView.add(leftPadlockIcon);  
    
    //V1.9 SDK7 - Fix for flashing text
    //A textbox is placed ontop of each of the existing text boxes
    //A listner is added to each of the NEW text boxes
    //The listener updates the existing text boxes when the text in the new boxes is changed
    var newUsrName;
    var newPsw;
    if(Ti.Platform.name == 'android'){
    	if(Ti.Platform.Android.API_LEVEL < 23){
    		
    		newUsrName = Ti.UI.createTextField(
    		{   
    			backgroundColor:'transparent',
    			text: usrName.value, 
    			color: 'white', 
    			//touchEnabled : true, 
    			font:{fontSize:'30dp'},
    			left: "35%", 
    			top: '56.5%', 
    			width : '35%', 
    			height: 60,
    			zIndex : 100, 
    			textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT
    		});
    	
    		usrName.visible = false;
	    	
	    	newUsrName.addEventListener('change', function(e){
	    		Ti.API.info("----------newUsrName text was changed!");
	    		usrName.value = newUsrName.value;
	    	});
	    	
	    	newPsw = Ti.UI.createTextField(
	    	{   
	    		backgroundColor:'transparent',
	    		text: psw.value, 
	    		color: 'white', 
	    		//touchEnabled : true,
	    		passwordMask: true,
	    		font:{fontSize:'30dp'},
	    		left: "35%", 
	    		top: '65.5%', 
	    		width : '35%', 
	    		height: 60, 
	    		zIndex : 100, 
	    		textAlign:Titanium.UI.TEXT_ALIGNMENT_LEFT
	    	});
	    	
	    	newPsw.addEventListener('change', function(e){
	    		Ti.API.info("----------newPsw text was changed to = " + psw.value + "! Length = " + psw.value.length);
	    		psw.value = newPsw.value;
	    	});
	    	
	    	psw.visible = false;
	    	
	    	container.add(newUsrName);
	    	container.add(newPsw);
	    }
    }
    
    
            
    
    
    usrName.addEventListener('focus', function(e) {
    if ( this.value == 'User Name' ) {
        this.value = '';
    }
    });
     
    usrName.addEventListener('blur', function(e) {
        if ( !this.value) this.value = 'User Name';
    });
    
      psw.addEventListener('focus', function(e) {
    if ( this.value == 'Password' ) {
        this.value = '';
        psw.passwordMask = true;
    }
    });
     
    psw.addEventListener('blur', function(e) {
        if ( !this.value){ this.value = 'Password';
        this.passwordMask = false;
    }
    });
    
    leftUserIcon.addEventListener('click', function(e){
          usrName.focus();
           if(osname == 'android')
           {
               usrName.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
           }
          
       });
    
       leftPadlockIcon.addEventListener('click', function(e){
        psw.focus();
        if(osname == 'android')
           {
               psw.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
           }
        });
      
    if(Ti.Platform.name == 'iPhone OS')
    {
         usrName.addEventListener('return',function(){
            usrName.blur();
            psw.focus();
        });
    }
    //Adding Login Button   
    //1.9 SDK7 - Added r_miscue as tt & $$ are undefined 
    //var loginButton = Ti.UI.createButton(tt.combine($$.Button,{
    	var loginButton = Ti.UI.createButton(r_miscue.tt.combine(r_styles.$$.Button,{
            width:'95dp',
            style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
            backgroundColor:'black',
            my_id:'login_loginbutton',
            opacity:0.3,
             borderRadius : 5,
             font:{fontSize:(Inch >= InchValue)?'26dp':'15dp'},
           }));
            
             // Adding Remember me checkbox label   
     var  remember = Ti.UI.createLabel({
                 color:'white',
                 width:'200dp',
                 font:{fontSize:(Inch >= InchValue)?'26dp':'15dp'},
                 my_id:'login_remember',
                 touchEnabled:false,
             });
                    
        //Creating switch
    var typeCheckBox = Titanium.UI.createImageView({
             image:'/images/unchecked.png',
            width:(Inch >= InchValue)?'35dp':'15dp',
            height:(Inch >= InchValue)?'35dp':'15dp',
            backgroundColor:'black',
            opacity:0.3,
           });
      
            // Adding Register button       
            //1.9 SDK7 - Added r_miscue as tt & $$ are undefined 
            //var registrationButton = Ti.UI.createButton(tt.combine($$.boldHeaderText,{
    var registrationButton = Ti.UI.createButton(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
             color:(Inch >= InchValue)?'#88609B':'#88609B',
             width:'100%',
             height:'40dp',
             font: {
                fontFamily:'Helvetica Neue',
                fontSize:(Inch >= InchValue)?'84dp':'58dp',
                fontWeight:'bold'
            },
             backgroundColor:'white',
             style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
             my_id:'login_register',
             textAlign:Titanium.UI.TEXT_ALIGNMENT_CENTER,
        }));
   
    
                // -Lee: 10 December 2015 inserting version number
                      // Adding version number label   
     var  version = Ti.UI.createLabel({
                 color:'lightgray',
                 width:'200dp',
                 font:{fontSize:(Inch >= InchValue)?'26dp':'12dp'},
                 my_id:'version_number',
                 touchEnabled:false,
             }); 
   
   if(usrName.value != 'User Name')     
   {
      var db = Titanium.Database.open('Miscue');
      var loginInfoRow = db.execute('SELECT * FROM Login where username =?',usrName.value); 
      var loginUserId = loginInfoRow.fieldByName('userid');
      loginInfoRow.close();
      loginInfoRow = null;
      var userSettingRow = db.execute('SELECT * FROM UserSetting where loginId =?',loginUserId); 
      //V1.9 SDK7 - Changed this to local resource as 2ERA is now on a different platform and downloading images was causing issues on older devices
      var loginBackImage = '/images/V1.9/LOGIN_BG.png';
      //var loginBackImage = userSettingRow.fieldByName('backPage');
      if(loginBackImage == '')
      {
          if(Inch < InchValue || osname == 'ipad')
         {
             //MAL loginBackgroundImage.image = 'https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png'; //-Lee 10 December 2015 Default background image enabled and changed from (/images/login_smaller.png)
             //loginBackgroundImage.backgroundColor = '#D8E028';
         }
         else
         {
             //MAL loginBackgroundImage.image = 'https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png'; //-Lee 10 December 2015 Default background image enabled and changed from (/images/login_bigger.png)
             //loginBackgroundImage.backgroundColor = '#D8E028';
         }
         
                         

               
                
      }
      else
      {
         loginBackgroundImage.image = loginBackImage;
      }
      userSettingRow.close();
      userSettingRow = null;  
      db.close();
      db = null;  
   }
   else
   {
        if(Inch < InchValue || osname == 'ipad')
         {
             //MAL loginBackgroundImage.image = 'https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png'; //-Lee 10 December 2015 Default background image enabled and changed from (/images/login_smaller.png)
             //loginBackgroundImage.backgroundColor = '#D8E028';
         }
         else
         {
             //MAL loginBackgroundImage.image = 'https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png'; //-Lee 10 December 2015 Default background image enabled and changed from (/images/login_bigger.png)
             //loginBackgroundImage.backgroundColor = '#D8E028';
         }
   }
 
 		//V1.9 SDK7 - Hard coding background image instead as 2ERA is no longer on this platform and there were some issues downloading the images on older devices due to security
         //MAL 3/10/16
         /*if (Ti.App.Properties.getString("currentAppID")=="ESKIMO"){
                	Ti.API.log("setting ESKIMO background");
                	//hard code the images for now
                	loginBackgroundImage.image  = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/LOGIN_BG.png";
             
          }
                   //MAL 3/10/16
         if (Ti.App.Properties.getString("currentAppID")=="COLLINS"){
                	Ti.API.log("setting COLLINS background");
                	//hard code the images for now
                	
                	loginBackgroundImage.image  = "https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png";
             
          }*/
         Ti.API.info("----------BEN!!! Background is being set!"); //TODO Delete Me
      loginBackgroundImage.image  = "/images/V1.9/LOGIN_BG.png";
      var xCenterValue;
        
    function orientationChangeMode()
      { 
      pWidth = Ti.Platform.displayCaps.platformWidth;
      pHeight = Ti.Platform.displayCaps.platformHeight;      
      
      if(osname == 'android')
      {
          loginBackgroundImage.center = {x:Ti.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi / 160)/2, y:Ti.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 160)/2};
      }
     else
     {
         loginBackgroundImage.center = {x:Ti.Platform.displayCaps.platformWidth /2, y:Ti.Platform.displayCaps.platformHeight /2};
     }        
        
        //1.9 SDK7 added 'r_loadingScreen'
        //var screenRes = backgroundImageHeightWidthPxToDp();    
        var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
        loginBackgroundImage.height = screenRes[1];
        loginBackgroundImage.width = screenRes[0]; 
               
       /*
        loginBackgroundImage.height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi/ 160));
               loginBackgroundImage.width = (Titanium.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi/ 160)); 
               
               Ti.API.log("Height orientation is :: ", loginBackgroundImage.height);
               Ti.API.log("Width orientation is :: ", loginBackgroundImage.width);*/
       
                
     //1.9 SDK7 aparrently this is not a function anymore                
     //if (Ti.Gesture.isLandscape()) {
       if(Ti.Platform.displayCaps.platformHeight < Ti.Platform.displayCaps.platformWidth){ 
     	if(Inch >= InchValue || osname == 'ipad'){
     		Ti.API.info('do not vome hete');
	      	registrationButton.font = {fontSize:'26dp'};
	        if(osname != 'android')
	        {
	           container.height = pHeight;
	           container.width = pWidth;
	           registrationButton.font = {fontSize:'34dp'};
	        }
	      
	       userNameView.bottom = (osname == 'android')?'40%':'38%';
	       userNameView.left = '32%';
	       userNameView.right = '32%';
	       userNameView.height = (osname == 'android')?'50dp':'60dp';
	       
	        leftUserIcon.height = (osname != 'android')?'30dp':'25dp';
	       leftUserIcon.width = (osname != 'android')?'30dp':'25dp';
	       
	       leftPadlockIcon.height = (osname != 'android')?'30dp':'25dp';
	       leftPadlockIcon.width = (osname != 'android')?'30dp':'25dp';
	       
	       usrName.left = '15%';
	       usrName.font = {fontSize:'22dp'}; //Username fontsize set AGAIN TODO DELETE ME
	       psw.left = '15%';
	       psw.font = {fontSize:'22dp'};
	       
	       passwordView.bottom = (osname == 'android')?'29%':'28%';
	       passwordView.left = '32%';
	       passwordView.right = '32%';
	       passwordView.height = (osname == 'android')?'50dp':'60dp';
	       
	        remember.bottom = '21%';
	        remember.left = '36.5%';
	        
	        typeCheckBox.bottom = '21%';
	        typeCheckBox.left = (Inch >= InchValue)?'32%':'18%';
	        
	         loginButton.bottom = '13%';
	        loginButton.right = (Inch >= InchValue)?'32%':'18%';
	        loginButton.height = '50dp';
	        registrationButton.bottom = (Inch >= InchValue)?'3%':'1%';
	         if(osname == 'android')
	        {
	            loginButton.height = '35dp';
	            loginButton.bottom = '11%';
	            registrationButton.bottom = ' 1%';
	            typeCheckBox.height = '25dp';
	            typeCheckBox.bottom = '17%';
	            remember.bottom = '17%';
	            remember.font = {fontSize:'20dp'};
	            passwordView.bottom = '24.5%';
	            userNameView.bottom = '35.5%';
	        }
	       	if(osname == 'ipad'){
	        		typeCheckBox.left = (Inch >= InchValue)?'32%':'32%';
	        		loginButton.right = (Inch >= InchValue)?'32%':'32%';
	        	} 
	      	}else{
	      		Ti.API.info('come here');
	      	}       
          } 
          else {
      //MAL - text size - not landscape
        registrationButton.font = {fontSize:(Inch >= InchValue)?'44dp':'28dp'};
        if(osname == 'android'){
        	
        	registrationButton.font = {fontSize:'28dp'};
        }
        if(osname != 'android')
         {
            container.height = pHeight;
            container.width = pWidth;
          }
      userNameView.bottom = (Inch >= InchValue)?'37%':'38%';
       if(osname == 'ipad')
       {
           userNameView.bottom = '36%';           
       }
       userNameView.left = (Inch >= InchValue)?'28%':'18%';
       userNameView.right = (Inch >= InchValue)?'28%':'18%';
       
       //Ben Test TODO DELETE ME
       //userNameView.height = (osname != 'android')?((Inch >= InchValue)?'65dp':'35dp'):((Inch >= InchValue)?'100dp':/*Titanium.UI.SIZE*/ '100dp'); //BEN - userNameView.height TODO - DELETE ME
       //Original below TODO DELETE ME
       userNameView.height = (osname != 'android')?((Inch >= InchValue)?'65dp':'35dp'):((Inch >= InchValue)?'65dp':Titanium.UI.SIZE); //BEN - userNameView.height TODO - DELETE COMMENT ONLY.
       
       leftUserIcon.height = (Inch >= InchValue)?'30dp':'15dp';
       leftUserIcon.width = (Inch >= InchValue)?'30dp':'15dp';
       
       leftPadlockIcon.height = (Inch >= InchValue)?'30dp':'15dp';
       leftPadlockIcon.width = (Inch >= InchValue)?'30dp':'15dp';
       
      
      usrName.left = (Inch >= InchValue)?'15%':'15%';
      psw.left = (Inch >= InchValue)?'15%':'15%';
      usrName.font = {fontSize:(Inch >= InchValue)?'26dp':'18dp'}; //Username font!!! TODO DELETE ME!!!
      psw.font = {fontSize:(Inch >= InchValue)?'26dp':'18dp'};
       
       passwordView.bottom = '28%';
       passwordView.left = (Inch >= InchValue)?'28%':'18%';
       passwordView.right = (Inch >= InchValue)?'28%':'18%';
        passwordView.height = (osname != 'android')?((Inch >= InchValue)?'65dp':'35dp'):((Inch >= InchValue)?'65dp':Titanium.UI.SIZE);

        remember.bottom = (Inch >= InchValue)?'22%':'21.5%';
        remember.left = (Inch >= InchValue)?'34%':'25%';
        remember.font = {fontSize:(Inch >= InchValue)?'26dp':'15dp'};
        
        typeCheckBox.bottom = '22%';
        typeCheckBox.left = (Inch >= InchValue)?'28%':'18%';
        typeCheckBox.height = (Inch >= InchValue)?'35dp':'15dp';
        
         loginButton.bottom = '14%';
        loginButton.right = (Inch >= InchValue)?'28%':'18%';
        loginButton.height = (Inch >= InchValue)?'50dp':'30dp';
        registrationButton.bottom = (Inch >= InchValue)?'3%':'1%';
        
        if(osname == 'android' && Inch < InchValue)
        {
            loginButton.bottom = '11.5%';
            typeCheckBox.bottom = '19.5%';
            remember.bottom = '19%';
            passwordView.bottom = '25.5%';
            userNameView.bottom = '35.5%';
        }
          }
     
       }
       

    // Calling orientation change mode function
    orientationChangeMode();
    
    
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
       var orientVal = e.source.orientation;
       var orientationVal = getOrientation(orientVal);
    if(orientationVal != orientCount && orientationVal != 0)
    {
        orientationChangeMode();
      }
}
    

    //Adding orientation change mode event listner
    
    Ti.Gesture.addEventListener('orientationchange', orientionChangeMode); 
    loginWin.addEventListener('close',function(e){
        usrName.removeEventListener('focus', function(e) { });
        usrName.removeEventListener('blur', function(e) { });
        psw.removeEventListener('focus', function(e) { });
        psw.removeEventListener('blur', function(e) { });
        leftPadlockIcon.removeEventListener('click', function(e){ });
        leftUserIcon.removeEventListener('click', function(e){ });
         Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode); 
         userNameView.remove(usrName);
         passwordView.remove(psw);
         container.remove(userNameView);
         container.remove(passwordView);
         container.remove(loginButton);
         container.remove(typeCheckBox);
         container.remove(remember);
         container.remove(registrationButton);
         container.remove(version); //-Lee 10 December 2015 added version number
         loginBackgroundImageView.remove(loginBackgroundImage);
         loginWin.remove(loginBackgroundImageView);
         if(osname == 'android')
            {
                loginWin.remove(container);
            }
            else
            {
                //Adding view to window
            scrollView.remove(container);
            loginWin.remove(scrollView);
            }
    
         usrName = null;
         psw = null;
         userNameView = null;
         passwordView = null;
         loginBackgroundImageView = null;
         loginBackgroundImage = null;
         loginButton = null;
         typeCheckBox = null;
         remember = null;
         registrationButton = null;
         version = null; //-Lee 10 December 2015 added version number
         container = null;
         scrollView = null;
    });
    //Checkbox eventlistner     
    typeCheckBox.addEventListener('click',function(e) {
      var val;
      if(typeCheckBox.image== '/images/unchecked.png')
       {
             typeCheckBox.image = '/images/checked.png';
              val = 1;
       } 
      else
       {
         typeCheckBox.image = '/images/unchecked.png';
           val = 0;
          }
     });
        
     //Adding textboxes, labels and buttons to views
    if(osname != 'android')
    {
         container.add(loginBackgroundImage); 
    }
    container.add(remember);
    container.add(typeCheckBox);
    container.add(userNameView);
    container.add(passwordView);
    container.add(loginButton);
    
    if (Ti.App.Properties.getString("registerLink")=="1"){
    	//mal 176 - optional registration link
    	   container.add(registrationButton);
    }
 
    container.add(version); //-Lee 10 December 2015 added version number
    if(osname == 'android')
    {
        loginWin.add(container);
    }
    else
    {
     //Adding view to window
     scrollView.add(container);
     loginWin.add(scrollView);
    }
    
    usrName.addEventListener('change' , function(e) 
     {
        ///While changing the username gets focused here
        validLogs = false;
        var db = Titanium.Database.open('Miscue');
        var textchange = db.execute('SELECT * FROM Login');
        while (textchange.isValidRow())
            {
              //extracts the data and puts in a variable
              var user_name = textchange.fieldByName('username');
              var user_checkval = textchange.fieldByName('checkvalue');
              
              if(user_name == usrName.value && user_checkval == 1)
               {
                var changeName = usrName.value;
                validLogs = true;
                 var user_pas = textchange.fieldByName('getP');
                break;
               }
              textchange.next();
            }
            if(validLogs == true)
            {
                psw.passwordMask = true;
                typeCheckBox.image = '/images/checked.png';
                passwordMask:true;
                psw.value = user_pas;
            }
            else if(validLogs == false){
                 typeCheckBox.image = '/images/unchecked.png';
                
               //    if(usrName.value != 'User Name' || usrName.value == null)
                if(usrName.value != '')
                 {
                     if(usrName.value != 'User Name')
                     {
                    psw.passwordMask = false;
                    psw.value = 'Password';
                    }
                 }
                 
            }
            db.close();
        });
            
        //loginButton.touchEnabled = true;
       var db = Titanium.Database.open('Miscue');
    
       ///Caching the userID
       var cachcheck = db.execute('SELECT * FROM Login WHERE cachevalue=?',1);
        if(cachcheck.rowCount >=1)
          {
           var chkvalue = cachcheck.fieldByName('username');
          }
           if(cachcheck.rowCount >= 1)
            {
                cachcheck.close();
                ///Check box 
                var chkrows = db.execute('SELECT * FROM Login WHERE username=?',usrName.value);
                 if (chkrows.rowCount >=1)
                 {
                   var chkvalue = chkrows.fieldByName('checkvalue');
                   var pwd = chkrows.fieldByName('getP');
                  }
             chkrows.close();
            }
          
          db.close();
       typeCheckBox.image = '/images/unchecked.png';
       psw.value = 'Password';
         if(chkvalue == 1)
        {
            psw.passwordMask = true;
           typeCheckBox.image = '/images/checked.png';  
           psw.value = pwd; 
         }
         var db = Titanium.Database.open('Miscue');
    
          if(usrName.value == 'User Name')
           {
            loginButton.title = 'Login';
            remember.text = 'Remember me';
            registrationButton.title = 'Get started'; //-Lee 10 December 2015 - changed click here... to tap here...
        }
        else 
        {
            var login_flag = 'true';
             var refer_Language = db.execute('SELECT * FROM Language WHERE isLastUsedLang = ?',login_flag);
             if(refer_Language.rowCount > 0)
             {
               while (refer_Language.isValidRow())
                  {
                    var langparamPosId = refer_Language.fieldByName('labelId');
                    var langparamPosValue = refer_Language.fieldByName('label');
                    switch(langparamPosId)
                    {
                         case 'login_loginbutton':
                                    loginButton.title = langparamPosValue;
                                     break;
                        case 'login_remember':
                                     remember.text = langparamPosValue;
                                     break;
                        case 'login_register':
                                    registrationButton.title  = langparamPosValue;
                                     break;
                       default:
                                    //Please_Login_Label.text = 'MISCUE ANALYSIS';
                                     break;
                    }
                      refer_Language.next();
                 }
                }
                else{
                    loginButton.title = 'Login';
                    remember.text = 'Remember me';
                    registrationButton.title = 'Get started'; //-Lee 10 December 2015 - changed click here... to tap here...
                }
        }
        db.close();
        
    	version.text = Titanium.App.version; //-Lee 10 December 2015 add version number
	    version.left = '85%';
		version.bottom =' 1%';  
	      	
         // Login click function    
         
       loginButton.addEventListener('click', function() {
        usrName.blur();
        psw.blur();
        loginWin.touchEnabled = false;
        if (Ti.Network.online)///Online mode
           {
           
            if ((usrName.value != 'User Name' && psw.value != 'Password') || (usrName.value != '' && psw.value != '') || (usrName.value != '' && psw.value != 'Password') || (usrName.value != 'User Name' && psw.value != ''))
             {  
             	
             	
             	
             	
            var message; 
            var db = Titanium.Database.open('Miscue');
            var labelArray = new Array();
            labelArray['message']=['loading_Indicator','Loading...']; 
            r_loadingScreen.showActivity(labelArray['message'], usrName.value);
              var base_URL = 'https://www.miscue.co.uk/iglooapi/apirequest.aspx';
              var URL1 = "http://mahitiin.pairserver.com/demo/miscue/login.php";
              username = usrName.value;  
              
              //MAL - check for test server
              if (username.substring(0,1)=="*" ){
              	username = username.substring(1,99);
              	Ti.App.Properties.setString("apiURL",Ti.App.Properties.getString("apiTestURL") );
              	alert("Using API: "+Ti.App.Properties.getString("apiURL") );
              }
              else
              {
              	Ti.App.Properties.setString("apiURL",Ti.App.Properties.getString("apiLiveURL") );
              }
              
                password = psw.value;
                var username1 = username.substring(username.length-2, username.length);
                var urltesting = (username1 == -1 || username1 == -2 || username1 == -3)? URL1:base_URL; 
                Ti.API.info("-------- urltesting = " + urltesting);//TODO remove this
                if (username1 == -1 || username1 == -2 || username1 == -3)
                {
                     username = username1.substring(1, username1.length);
                }
                var db = Titanium.Database.open('Miscue');
                var devcidrow = db.execute('SELECT * FROM DeviceID');
                var InputdeviceID = devcidrow.fieldByName('DeviceInstallID');
                db.close();
                devcidrow.close();
                //var deviceResolution = BackgroundImageCenterValue();
                var devicedpi = Ti.Platform.displayCaps.dpi;
                var deviceOs = Ti.Platform.osname;
                var deviceHorizontalRes = Ti.Platform.displayCaps.platformWidth;
                var deviceVerticalRes = Ti.Platform.displayCaps.platformHeight;
                var str1=('<request><requesttype>LOGIN</requesttype><userID>')+username+('</userID><pwd>')+password+('</pwd><deviceinstallid>')+InputdeviceID+('</deviceinstallid><devicemodel>')+devicemodel+('</devicemodel><deviceosversion>')+devosversion+('</deviceosversion><devicehres>') + deviceHorizontalRes + ('</devicehres><devicevres>') + deviceVerticalRes + ('</devicevres><devicedpi>') + devicedpi + ('</devicedpi><deviceos>') + deviceOs + ('</deviceos></request>');
                if(typeCheckBox.image == '/images/checked.png')
                 { 
                     val = 1;
                 } 
               else if(typeCheckBox.image == '/images/unchecked.png')
                {
                   val = 0;
                 }
              var flag = 1;
              var apifile = r_Apifile.createApi(urltesting,str1,username,password,flag,loginWin,val);
               
              loginWin.touchEnabled = true;
             }
           else
            {
             var labelArray = new Array();
           labelArray['title']=['Alert','Alert'];
           labelArray['message']=['Empty_Login_Field_Message','Please enter UserId and password'];
           labelArray[1]=['Ok','Ok'];
           //V1.9 SDK7 - Added r_HomeScreen
           var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray,usrName.value);
           //var dialog = createLocalizedAlertDialog(labelArray,usrName.value);
           dialog.show();
           loginWin.touchEnabled = true;
             
        }   
          }
          else //Offline mode
            {   
           var validLog = false;
           if ((usrName.value == 'User Name' && psw.value == 'Password') || (usrName.value == '' && psw.value == '') || (usrName.value == '' && psw.value == 'Password') || (usrName.value == 'User Name' && psw.value == ''))
            { 
                loginWin.touchEnabled = true;
                alert('Please enter UserId and password');
            
            }
           else
           {
            var db = Titanium.Database.open('Miscue');
            
             var holddatavar = db.execute('SELECT * FROM Login');
                  while (holddatavar.isValidRow())
            {
              //extracts the data and puts in a variable
              var app_name = holddatavar.fieldByName('username');
              var app_psw = holddatavar.fieldByName('getP');
              if(app_name == usrName.value && app_psw == psw.value)
               {
                var offlineusername = usrName.value;
                
                validLog = true;
                break;
               }
              holddatavar.next();
            }
             holddatavar.close();
             var holddatavar1 = db.execute('SELECT * FROM Login');
            //Updating caching and checktype
                  if(holddatavar1.rowCount >= 1)
                {
                 var cachig = 0;
                 while (holddatavar1.isValidRow())
                  {     
                       var cachid = holddatavar1.fieldByName('userid');
                       db.execute('UPDATE Login SET cachevalue=? WHERE userid=? AND cachevalue = ?',cachig,cachid,1);
                           holddatavar1.next();
                        }
                       }
             holddatavar1.close();
             db.close();
             if(typeCheckBox.image == '/images/checked.png')
                   { 
                     val = 1;
                 } 
              else if(typeCheckBox.image == '/images/unchecked.png')
                 {
                   val = 0;
                   }
                   
                if(validLog == true)
             {
                var db = Titanium.Database.open('Miscue');
                var sessioncheck = db.execute('SELECT * FROM Login');
                    if(sessioncheck.rowCount > 0)
                    {
                   db.execute('UPDATE Login SET logoutFlag=? WHERE username=?',1,usrName.value);
                   }
                   sessioncheck.close();
                     var logcach = db.execute('SELECT * FROM Login WHERE username =?',offlineusername);
                
               if(logcach.rowCount >= 1)
                      {
                        var labelArray = new Array();
                labelArray['message']=['loading_Indicator','Loading...']; 
                //V1.9 SDK7 - Added r_loadingScreen
                r_loadingScreen.showActivity(labelArray['message'], usrName.value);
                //showActivity(labelArray['message'], usrName.value);
                        var cachval = 1;
                        var cachlogid = logcach.fieldByName('userid');
                         db.execute('UPDATE Login SET cachevalue=?,checkvalue=? WHERE userid=?',cachval,val,cachlogid);
                        var cachidss = logcach.fieldByName('cachevalue');
                    }
                    logcach.close();
                     db.execute('UPDATE UserSetting SET islastUsedBrandLogo=? ','false');//Updating the last brand logo from true to false
                 
                    var flag = 'false';
                 var languageRow = db.execute('SELECT * FROM Language');
                 if(languageRow.rowCount > 0)
                 {
                     while (languageRow.isValidRow())
                    {
                    db.execute('UPDATE Language SET isLastUsedLang=?',flag);
                          languageRow.next();
                    }
                }
                languageRow.close();
                db.close();
                //1.9 SDK7 - Added r_miscue as tt is undefined 
                //var w1 = tt.ui.createHomeScreen(offlineusername);
               var w1 = r_miscue.tt.ui.createHomeScreen(offlineusername);
               w1.open();
               loginWin.close();
             }
            else
             {
                loginWin.touchEnabled = true;
                  var labelArray = new Array();
                 labelArray['title']=['Alert','Alert'];
                 labelArray['message']=['offline_Invalid_Login_Message','You are not connected to the internet. Please connect to internet and try again'];
                 labelArray[1]=['Ok','Ok'];
                 //V1.9 SDK7 - Added r_HomeScreen
                 var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, usrName.value);
                 //var dialog = createLocalizedAlertDialog(labelArray, usrName.value);
                dialog.show();
                typeCheckBox.image = '/images/unchecked.png';
              psw.value = '';
               if(typeCheckBox.image == '/images/checked.png')
                     { 
                       typeCheckBox.image = '/images/unchecked.png';
                     }
                   }
           } 
          
          }///Offline close
       });
       
       
    // Register button event listner
    registrationButton.addEventListener('click', function() {
	if (Ti.Network.online)///Online mode
	{
    //Creating modelwindow  
    var tweetWindow = Titanium.UI.createWindow({
           height:'80%',
            width:'80%',
            backgroundColor:'white',
            borderWidth:'3dp',
            borderColor:'black',
            layout:'vertical',
            navBarHidden:true,
            opacity:1,
     });
    
    //Creating Close button
      var closeButton= Ti.UI.createImageView({
        title: 'Close',
        backgroundColor: 'white',
        height:'30dp',
        width:'30dp',
        image:'/images/close.png',
        right:'1dp',
        style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
        top:0
    });
   
    //Close button eventlistner   (MAL moved)
     closeButton.addEventListener('click', function() {
     tweetWindow.close();
     });
                 
    //Creating Webview      
      var webView = Titanium.UI.createWebView({
              top:0,
              url: Ti.App.Properties.getString("registerURL")
              //url:'https://bigcatassessment.collins.co.uk/register/'
              /*url:'http://ra.2eskimos.com/register/'*/
     }); 
        
     tweetWindow.add(closeButton);
     tweetWindow.add(webView);
     tweetWindow.open({
        modal:false
       });
    
    //Webview eventlistner
    webView.addEventListener('load',function(e) {
        var re = /(google.co.in\/imghp)/;
        
            //alert('Now on page ' + e.url);
         // alert('match? ' + Boolean(e.url.match(re)) + e.url + "  "  + re);
         if (Boolean(e.url.match(re)) == true)
          {
              tweetWindow.close();
            }
      });

	} //offline
	else
	{
		alert('An Internet connection is required for this');
	}
  });       
    return loginWin;
  };
})();

	function getLanguage (xmlSync,userName) 
	{   
		var login_Flag = 'true';
		var flag = 'false';
   	    var db = Titanium.Database.open('Miscue');
		var language_row = db.execute('SELECT * FROM Language');
		if(language_row.rowCount > 1)
		   	 {
		   	     while (language_row.isValidRow())
				{
				      db.execute('UPDATE Language SET isLastUsedLang=?',flag);
			     	  language_row.next();
				}
			}
  	   var homelog = db.execute('SELECT * FROM Login WHERE username =?',userName);
       var uids = homelog.fieldByName('userid');
       var langCheck = db.execute('SELECT * FROM Language WHERE userId =?',userName);
       var docData = Ti.XML.parseString(xmlSync);
       var responses = docData.getElementsByTagName("response");
       var data = docData.getElementsByTagName("data");
       var result = docData.getElementsByTagName("result").item(0).text;
       if(langCheck.rowCount > 0)
         {	
          	db.execute('DELETE FROM Language WHERE userId =?',userName);
         }
        homelog.close();
        langCheck.close();
        db.close();
        if(result == 'GETLANGUAGE_OK')
         {
          	 var labelName,labelId,langCount = 0;
             var label = data.item(0).getElementsByTagName("label");
             for(var i = 0; i < label.length; i++)
              {
           	      labelName = data.item(0).getElementsByTagName("label").item(i).text;
           	      labelId = data.item(0).getElementsByTagName("label").item(i).getAttribute("id");
           	      insertLanguage(labelId,labelName,userName,login_Flag);
               }
          }
       }	
	//V1.9 SDK7 - Added exports
	exports.getLanguage = getLanguage;
	
	//Extracting API values and save it in database
	//var y,xmldatas,txt1,txt2,vals;
	function callback(xmlSync,txt1,txt2,rememberMeCheckValue,loginWin)
    {   
	    xmlSync = xmlSync.replace(/&/g,'&amp;');
	    xmlSync = xmlSync.replace(/'/g,'&apos;');
	    xmlSync = xmlSync.replace(/'/g,'&quot;');
	    
	    Ti.API.info("---------------BEN!!! End of xmlSync = " + xmlSync.toString().substr(xmlSync.toString().length - 51, 50)); //TODO Delete this 
	    
	    var docData = Ti.XML.parseString(xmlSync);
        
        var responses = docData.getElementsByTagName("response");
        var apconf = docData.getElementsByTagName("appconfig"); 
        var menusitems = docData.getElementsByTagName("menuitem");
        var menus = docData.getElementsByTagName("menu");
        var menusitm = docData.getElementsByTagName("menus");
        var miscueMenu = docData.getElementsByTagName("Menu");
        var miscueTypes = docData.getElementsByTagName("MiscueTypes"); //Extracting miscue types
        var sql = docData.documentElement.getElementsByTagName("SQL").length;
        
        /*
        if(sql != null || sql != ''){
          sql = responses.item(0).getElementsByTagName("SQL").item(0).text;
          sql = sql.split(';');
        }*/
     
        var data = docData.getElementsByTagName("data");
        //V1.9 SDK7 - Changed from 'text' to 'textContent'
        var result = responses.item(0).getElementsByTagName("result").item(0).textContent;
        //var result = responses.item(0).getElementsByTagName("result").item(0).text;
        
        if(result == 'LOGIN_FAIL')
        {   
        	//V1.9 SDK7 - Changed from 'text' to 'textContent'
        	var message = responses.item(0).getElementsByTagName("code").item(0).textContent;
            //var message = responses.item(0).getElementsByTagName("code").item(0).text;
        }
        
        
        
        if( message == 2)
        {      
            var errormsg = docData.getElementsByTagName("error");
            //V1.9 SDK7 - Changed from 'text' to 'textContent'
        	var errormessage = errormsg.item(0).getElementsByTagName("message").item(0).textContent;
        	//var errormessage = errormsg.item(0).getElementsByTagName("message").item(0).text;
        	alert(errormessage);
        	var txt1 = 'user2',txt2 = 'user2';
        	var db = Titanium.Database.open('Miscue');
        	var databaseerror = db.execute('SELECT * FROM Login WHERE username = ? AND getP = ?', txt1,txt2);
        }
        
        
        
        if(result === 'LOGIN_OK')
        {   
            var user = txt1, password = txt2;
   		    var cachval = 1,userlanguage = 'English';
   		    var logoutflag = 1;
   		    logoutflag = logoutflag.toString();
   		    //V1.9 SDK7 - Changed from 'text' to 'textContent'
   		    var acstkn = data.item(0).getElementsByTagName("accesstoken").item(0).textContent;
   		    //var acstkn = data.item(0).getElementsByTagName("accesstoken").item(0).text;
            //After successful login the login data will save it in database
   		    //Calling insert login function
   		    //V1.9 SDK7 - Added r_Miscuedb
   		    r_Miscuedb.insertLogin(user,password,rememberMeCheckValue,cachval,userlanguage,1,acstkn);
   		    //insertLogin(user,password,rememberMeCheckValue,cachval,userlanguage,1,acstkn);
          
            if (apconf.length > 0)
            {      
                for (var i = 0; i < apconf.length; i++) 
		        {   
		        	//V1.9 SDK7 - Changed from 'text' to 'textContent'
		        	var school = apconf.item(i).getElementsByTagName("schoolname").item(0).textContent;
		        	//var school = apconf.item(i).getElementsByTagName("schoolname").item(0).text;
		        	
		        	
                    Ti.API.info('school name at login page '+school);
                    school = school.replace(/&apos;/gi,"'");
                    
                    
                    
                    //V1.9 SDK7 - Changed to local asset
                    var backimage = '/images/V1.9/MAIN_BG.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var backimage = apconf.item(i).getElementsByTagName("pagebackground").item(0).textContent;
                    //var backimage = apconf.item(i).getElementsByTagName("pagebackground").item(0).text;
                    Ti.API.info("----------BEN!!! backimage = " + backimage);
                    
                    
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    var backcolour = apconf.item(i).getElementsByTagName("backgroundcolor").item(0).textContent;
                    //var backcolour = apconf.item(i).getElementsByTagName("backgroundcolor").item(0).text;
                    
                    
                    var lang = apconf.item(i).getElementsByTagName("primarylanguage");
                    
                    
                    //Extracting miscueMenu page backgroundImage
                    //V1.9 SDK7 - Changed to local asset
                    var miscueMenuPageBackgroundImage = '/images/V1.9/MISCUEMENU_BG.png';
                    //var miscueMenuPageBackgroundImage =  menusitm.item(0).getElementsByTagName("Menu").item(0).getAttribute("menuBGURL");
                    
                    
                    //Extracting HomeScreen page backgroundImage
                    //V1.9 SDK7 - Changed to local asset
                    var homePageBackgroundImage = '/images/V1.9/MAINMENU_BG.png';
                    //var homePageBackgroundImage =  menusitm.item(0).getElementsByTagName("menu").item(0).getAttribute("menuBGURL");
                    
                    
                    //Extracting Select group, learner and book page backgroundImage
                    //V1.9 SDK7 - Changed to local asset
                    var selectionPagebackgroundURL = '/images/V1.9/MAIN_BG.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var selectionPagebackgroundURL = responses.item(0).getElementsByTagName("selectionpagebackgroundURL").item(0).textContent;
                    //var selectionPagebackgroundURL = responses.item(0).getElementsByTagName("selectionpagebackgroundURL").item(0).text;
                    
                    
                    //Extracting miscueSession page backgroundImage
                    //V1.9 SDK7 - Changed to local asset
                    var sessionPagebackgroundURL = '/images/V1.9/MAIN_BG.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var sessionPagebackgroundURL = responses.item(0).getElementsByTagName("sessionpagebackgroundURL").item(0).textContent;
                    //var sessionPagebackgroundURL = responses.item(0).getElementsByTagName("sessionpagebackgroundURL").item(0).text;
                    
                    
                    //Extracting backimage for back button
                    //V1.9 SDK7 - Changed to local asset
                    var backImageURL = '/images/V1.9/BACK_BUTTON.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var backImageURL = responses.item(0).getElementsByTagName("backimageURL").item(0).textContent;
                    //var backImageURL = responses.item(0).getElementsByTagName("backimageURL").item(0).text;
                    
                    
                    //Extracting saveimage for save button in miscuesession page
                    //V1.9 SDK7 - Changed to local asset
                    var saveImageURL = '/images/MISCUE_SAVE.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var saveImageURL = responses.item(0).getElementsByTagName("saveimageURL").item(0).textContent;
                    //var saveImageURL = responses.item(0).getElementsByTagName("saveimageURL").item(0).text;
                    
                    
                    //Extracting logoutimage for logout button in homePage page
                    //V1.9 SDK7 - Changed to local asset
                    var logoutImageURL = '/images/V1.9/LOGOUT.png';
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    //var logoutImageURL = responses.item(0).getElementsByTagName("logoutimageURL").item(0).textContent;
                    //var logoutImageURL = responses.item(0).getElementsByTagName("logoutimageURL").item(0).text;
          
          
                
                    //MAL 3/10/16
                    //V1.9 SDK7 - Removed this as 2ERA has moved to new platform
                    /*
                    if (Ti.App.Properties.getString("currentAppID")=="ESKIMO")
                    {   
           	            Ti.API.log("setting ESKIMO branding");
                        //hard code the images for now
                        //V1.9 SDK7 - Using local image instead as loading from server was causing security issues on older devices
                        backimage = "/images/LOGIN_BG.png";
                        //backimage = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/LOGIN_BG.png";
                        miscueMenuPageBackgroundImage = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/MISCUEMENU_BG.png"; 
                        //Extracting HomeScreen page backgroundImage
                        homePageBackgroundImage =  "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/MISCUEMENU_BG.png"; 
                        //Extracting Select group, learner and book page backgroundImage
                        selectionPagebackgroundURL = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/MAIN_BG.png"; 
                        //Extracting miscueSession page backgroundImage
                        sessionPagebackgroundURL = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/MAIN_BG.png"; 
                        //Extracting backimage for back button
                        backImageURL = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/BACK_BUTTON.png";
                        //Extracting saveimage for save button in miscuesession page
                        saveImageURL = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/MISCUE_SAVE.png";
                        //Extracting logoutimage for logout button in homePage page
                        logoutImageURL = "https://www.miscue.co.uk/iglooAPI/images/appimagesESKV1/LOGOUT.png";   	
                    }
                    */
                    
                    
                    if(lang.length >= 1)
                    {   
                    	//V1.9 SDK7 - Changed from 'text' to 'textContent'
                        var languages = apconf.item(i).getElementsByTagName("primarylanguage").item(0).textContent;
                        //var languages = apconf.item(i).getElementsByTagName("primarylanguage").item(0).text;
                        if (languages == '')
                        {
                            languages = 'English';
       	                }
                    }         
                    else
                    {   
                        var languages = 'English';
                    }
                    var db = Titanium.Database.open('Miscue');
                    var updateid = db.execute('UPDATE Login SET userLanguage =? WHERE  username =?',languages,user);///Updating language table based on xml API
                    
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    var fontcolour = apconf.item(i).getElementsByTagName("color").item(0).textContent;
  	                //var fontcolour = apconf.item(i).getElementsByTagName("color").item(0).text;
  	                
  	                //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    var charfont = apconf.item(i).getElementsByTagName("font").item(0).textContent;
                    //var charfont = apconf.item(i).getElementsByTagName("font").item(0).text;
                    
                    //V1.9 SDK7 - Changed from 'text' to 'textContent'
                    var xmlLogo = apconf.item(i).getElementsByTagName("mainlogo").item(0).textContent;
                    //var xmlLogo = apconf.item(i).getElementsByTagName("mainlogo").item(0).text;
                    
                    var encr = Ti.Utils.base64encode(school);
                    var logrows = db.execute('SELECT * FROM Login  WHERE username=?',txt1);
                    var user_Login_id = logrows.fieldByName('userid');
                    db.execute('UPDATE UserSetting SET islastUsedBrandLogo=?','false');//updating lastusedbrand logo
	                var desrows = db.execute('SELECT * FROM UserSetting WHERE loginId=?',user_Login_id);
	                if(desrows.rowCount >= 1)
	                {      
                        db.close();
                        //V1.9 SDK7 - Added r_Miscuedb
                        r_Miscuedb.userSettingDelete(user_Login_id);
                        //userSettingDelete(user_Login_id);
                    }
                    else
                    {   
                        db.close();
                    }
                    var islastUsedLogo = 'false';
                    //Calling user setting database table for inserting user setting data
                    //V1.9 SDK7 - Added r_Miscuedb
                    r_Miscuedb.insertUserSetting (encr,backcolour, fontcolour, charfont,backimage,xmlLogo,islastUsedLogo, homePageBackgroundImage, miscueMenuPageBackgroundImage, selectionPagebackgroundURL, sessionPagebackgroundURL, backImageURL, saveImageURL, logoutImageURL, user_Login_id);
                    //insertUserSetting (encr,backcolour, fontcolour, charfont,backimage,xmlLogo,islastUsedLogo, homePageBackgroundImage, miscueMenuPageBackgroundImage, selectionPagebackgroundURL, sessionPagebackgroundURL, backImageURL, saveImageURL, logoutImageURL, user_Login_id);	
                }      
            }          
        	if (menus.length > 0)
        	{        
                var db = Titanium.Database.open('Miscue');
                var hmrows = db.execute('SELECT * FROM UserMenuItem WHERE userId=?',user_Login_id);
                if(hmrows.rowCount >= 1)
                {
                    //Deleting old data based on login user	
                    db.execute('DELETE from UserMenuItem WHERE userId=?',user_Login_id);
                }
                hmrows.close();
  	            db.close();
  			 
  			
                //Extracting miscue menu item 
  	            for(var k = 0; k < miscueMenu.length; k++)
                {   
                    var miscueMenuItemCount =  miscueMenu.item(k).getElementsByTagName("MenuItem");
                    var miscueMenuId =  menusitm.item(k).getElementsByTagName("Menu").item(0).getAttribute("id");
                	for(var l = 0; l < miscueMenuItemCount.length; l++)
            		{
            			var miscueMenuItemId = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("id");
            			var miscueMenuButtonTitle = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("title");
            			//V1.9 SDK7 - Changed to local assets
            			//var MiscueMenuIcon = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("icon");
            			
            			var MiscueMenuIcon;
            			switch(miscueMenuItemId){
            				case 'start':
            					MiscueMenuIcon = '/images/V1.9/MISCUEMENU_STARTSESSION.png';
            					break;
            				case 'resume':
            					MiscueMenuIcon = '/images/V1.9/resume_last_session.png';
            					break;
            				case 'search':
            					MiscueMenuIcon = '/images/V1.9/review_sessions.png';
            					break;
            			}
            			
            			var miscueMenuButtonType = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("type");
            			var miscueMenuButtonposition = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("position");
            			if (miscueMenuButtonType == 'webview')
            			{   
                			var miscueMenuButtonlink = miscueMenu.item(k).getElementsByTagName("MenuItem").item(l).getAttribute("link");
            			}
            			else if(miscueMenuButtonType == 'standard')
            			{   
                			var miscueMenuButtonlink = 'nulls';
            			}
            			// Inserting user home screen data to database  
            			//V1.9 SDK7 - Added r_Miscuedb
            			r_Miscuedb.insertUserMenuItem(miscueMenuButtonTitle,MiscueMenuIcon,miscueMenuButtonlink,miscueMenuButtonType,miscueMenuButtonposition,user_Login_id,miscueMenuId,miscueMenuItemId);
            			//insertUserMenuItem(miscueMenuButtonTitle,MiscueMenuIcon,miscueMenuButtonlink,miscueMenuButtonType,miscueMenuButtonposition,user_Login_id,miscueMenuId,miscueMenuItemId);
        			}      
				}       
    			//Extracting homescreen menu types  
    			var menuId = menusitm.item(0).getElementsByTagName("menu").item(0).getAttribute("id");
         		
    			for(var j = 0; j < menus.length; j++)
    			{
  	    			var menu_Key = menusitm.item(j).getElementsByTagName("menu").item(0).getAttribute("id");
        			var menuitemscount =  menus.item(j).getElementsByTagName("menuitem");
        			for ( var i = 0; i < menuitemscount.length; i++) 
        			{   
  	        			var Buttontitle = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("title");
            			//V1.9 SDK7 - Changed to local assets
            			//var Buttonicon = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("icon");
            			var Buttontype = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("type");
            			var Buttonposition = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("position");
            			var menuItemKey = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("id");
            			
            			//V1.9 SDK7 - Changed to local assets
            			var Buttonicon;
            			switch(menuItemKey)
            			{
            				case 'miscueanalysis':
            					Buttonicon = '/images/V1.9/assess.png';
            					break;
            				case 'miscuehelpv2':
            					Buttonicon = '/images/V1.9/MAINMENU_HELP.png';
            					break;
            				case 'aboutus1':
            					Buttonicon = '/images/V1.9/about_us_button.png';
            					break;
            				default:
            					Ti.API.info("----------BEN!!! Menu key ''" + menu_Key + "'does not have an image!");
            					break;
            			}
            			
            			if (Buttontype == 'webview')
            			{
                			var Buttonlink = menus.item(j).getElementsByTagName("menuitem").item(i).getAttribute("link");
            			}
            			else if(Buttontype == 'standard')
            			{
                			var Buttonlink = 'nulls';
            			}
            			// Inserting user home screen data to database  
            			//V1.9 SDK7 - Added r_Miscuedb
            			r_Miscuedb.insertUserMenuItem(Buttontitle,Buttonicon,Buttonlink,Buttontype,Buttonposition,user_Login_id,menu_Key,menuItemKey);
            			//insertUserMenuItem(Buttontitle,Buttonicon,Buttonlink,Buttontype,Buttonposition,user_Login_id,menu_Key,menuItemKey);
        			}      
    			}       
			}
			// Extracting miscueType data and saving into local db
			if (miscueTypes.length > 0)
			{
    			var db = Titanium.Database.open('Miscue');
    			var miscueTypeDeleteRowCount = db.execute('SELECT * FROM miscueType WHERE userId =? ', user_Login_id);
    			if(miscueTypeDeleteRowCount.rowCount > 0)
    			{   
        			db.execute('UPDATE miscueType SET isDeleted = ? WHERE userId =? ','yes',user_Login_id);
    			}   
    			miscueTypeDeleteRowCount.close();
    			db.close();
    			var miscueType = miscueTypes.item(0).getElementsByTagName("MiscueType");
		    	for(var k = 0; k < miscueType.length; k++)
    			{   
	        		var miscueId = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("id");
 					var miscueText = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("text");
        			var position = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("position");
        			var requireNotes = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("requirenotes");
        			var apiRef = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("apiref");
        			var colour = miscueTypes.item(0).getElementsByTagName("MiscueType").item(k).getAttribute("colour");
        			var db = Titanium.Database.open('Miscue');
		        		   
        			miscueTypeDeleteRowCount = null;
        			var miscueTypeRowCount =  db.execute('SELECT * FROM miscueType WHERE id=? AND userId=?',miscueId,user_Login_id);
        			if(miscueTypeRowCount.rowCount > 0)
        			{
            			db.execute('UPDATE miscueType SET isDeleted = ? WHERE id = ? AND userId =? ','no',miscueId,user_Login_id);
            			db.close();
        			}
        			else
        			{
            			miscueTypeRowCount.close();
   	        			miscueTypeRowCount = null;
   	   	    			db.close();
            			var deleted = 'no';
            			//V1.9 SDK7 - Added r_Miscuedb
            			r_Miscuedb.insertUserMiscueType(miscueId,miscueText,position,requireNotes,apiRef,colour,deleted,user_Login_id);
            			//insertUserMiscueType(miscueId,miscueText,position,requireNotes,apiRef,colour,deleted,user_Login_id);
        			}   
    			}      
			}   
      
     		//Language API
     		var base_URL = 'https://www.miscue.co.uk/iglooapi/apirequest.aspx';
	 		// Assigning the Getclass input to variable
	 		var flg = 3,  text2 = 0;
	 		var classStr = '<request><requesttype>GETLANGUAGE</requesttype><accesstoken>' +acstkn+ '</accesstoken></request>';
	 		
	 		
	 		//V1.9 SDK7 - Added r_Apifile
	 		r_Apifile.createApi(base_URL,classStr,txt1,text2,flg);
	 		//createApi(base_URL,classStr,txt1,text2,flg);
	 		
	 		
	 		var db = Titanium.Database.open('Miscue');
     		var homescreencheckrow = db.execute('SELECT * FROM UserMenuItem WHERE userId=?',user_Login_id);
     		if(homescreencheckrow.rowCount > 0)
     		{
       			db.close();
       			//1.9 SDK7 - Added r_miscue as tt is undefined 
       			//var homewinds = tt.ui.createHomeScreen(txt1,acstkn,flg,backimage);
       			var homewinds = r_miscue.tt.ui.createHomeScreen(txt1,acstkn,flg,backimage);
	   			homewinds.open();
	   			loginWin.close();
	 		}
	 		else
	 		{
	   			db.close();
	   			//V1.9 SDK7 - Added r_loadingScreen
	   			r_loadingScreen.hideActivity();
	   			//hideActivity();
	   			alert('There are no menu items for this user');
	  		}
		}
		//1.9 SKD7 - "01" on it's own caused a parsing error in strict mode
		//Changed to "'01'"	
    	else if(message == '01')
    	{
      		var db = Titanium.Database.open('Miscue');
      		db.execute('UPDATE Login SET checkvalue=? WHERE username=?',0,txt1);	
      		db.close();
      		var errormsg = docData.getElementsByTagName("error");
      		//V1.9 SDK7 - Changed from 'text' to 'textContent'
      		var errormessage = errormsg.item(0).getElementsByTagName("message").item(0).textContent;
      		//var errormessage = errormsg.item(0).getElementsByTagName("message").item(0).text;
      		//V1.9 SDK7 - Added r_loadingScreen
      		r_loadingScreen.hideActivity();
      		//hideActivity();
      		loginWin.touchEnabled = true;
      		var labelArray = new Array();
      		labelArray['title']=['Alert','Alert'];
      		labelArray['message']=['invalid_Login',errormessage];
      		labelArray[1]=['Ok','OK'];
      		
      		//V1.9 SDK7 - Added r_HomeScreen
      		var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray,txt1);
      		//var dialog = createLocalizedAlertDialog(labelArray,txt1);
      		dialog.show();
    	}   
    	
    	//Ben's comments / notes
    	
    	//Delete comment below this BEN
    	//(result === 'LOGIN_OK') = FALSE
    	//(message == '01') = FALSE
    	//var result = responses.item(0).getElementsByTagName("result").item(0).text;
    	//var responses = docData.getElementsByTagName("response");
    	//var docData = Ti.XML.parseString(xmlSync);
    	//xmlSync = xmlSync.replace(/&/g,'&amp;');
	    //xmlSync = xmlSync.replace(/'/g,'&apos;');
	    //xmlSync = xmlSync.replace(/'/g,'&quot;');
	    //xmlSync is a parameter
	    //responses.item(0).getElementsByTagName("result").item(0).text = undefined
	    //<request><requesttype>LOGIN</requesttype><userID>coleskimo</userID><pwd>mal22</pwd><deviceinstallid>7d4b595a-bc4b-483b-a0af-af3f05482b05</deviceinstallid><devicemodel>B1-780</devicemodel><deviceosversion>6.0</deviceosversion><devicehres>720</devicehres><devicevres>1216</devicevres><devicedpi>213</devicedpi><deviceos>android</deviceos></request>
	    
	    //var message = responses.item(0).getElementsByTagName("code").item(0).text;
	    
	    //Apifile l 153
	    //r_LoginPage.callback(xmldata, text1, text2, apiCount, modal);
	    //122
	    //xmldata = this.responseText;
	    
	    //var urltesting = (username1 == -1 || username1 == -2 || username1 == -3)? URL1:base_URL; 
		//var base_URL = 'https://www.miscue.co.uk/iglooapi/apirequest.aspx';
		//var URL1 = "http://mahitiin.pairserver.com/demo/miscue/login.php";
	    
	    //chris@2eskimos.com mal22 
	    //xmlSync = <?xml version="1.0" ?>
		//<response>
	    //<apiservice>Igloo API v1.01</apiservice>
		//<timestamp>2018-11-06T14:15:59</timestamp>
		//<result>LOGIN_FAIL</result>
		//<error><code>01</code><message>Invalid user ID or password</message></error>
		//</response>
		
		//coleskimo mal22 - Got response but still failed
		//xmlSync = <?xml version="1.0" ?>
		//<response>
		//<apiservice>Igloo API v1.01</apiservice>
		//<timestamp>2018-11-06T14:19:04</timestamp>
		//<data>
		//<appconfig>
		//<mainlogo>DEPRICATED_DO_NOT_USE</mainlogo>
		//<pagebackground>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGIN_BG.png</pagebackground>
		//<backgroundcolor>#FFFFFF</backgroundcolor>
		//<color>#000000</color>
		//<font>Arial</font>
		//<schoolname> </schoolname>
		//</appconfig>
		//<SQL>BBBBGSGSGSG update MiscueSession set recordedAudioFilename=null</SQL>
		//<menus>
		//<menu id="mainmenu"  menuBGURL="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MAINMENU_BG.png"   >
		//<menuitem id="miscueanalysis" type="standard" position="1" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/assess.png"></menuitem>
		//<menuitem id="miscuehelpv2" type="webview" position="2" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MAINMENU_HELP.png" link="https://www.miscue.co.uk/iglooapi/function.aspx?f=help&amp;sessionid=91DD9BE9-565F-4F74-8E6A-5D3FEF2BA9BD"></menuitem>
		//<menuitem id="aboutus1" type="webview" position="3" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/about_us_button.png" link="https://www.miscue.co.uk/iglooapi/function.aspx?f=about&amp;sessionid=91DD9BE9-565F-4F74-8E6A-5D3FEF2BA9BD"></menuitem>
		//</menu>
		//<Menu id="miscueanalysismenu"  menuBGURL="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MISCUEMENU_BG.png"    >
		//<MenuItem id="start" type="standard" position="1" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MISCUEMENU_STARTSESSION.png" />
		//<MenuItem id="resume" type="standard" position="2" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/resume_last_session.png" />
		//<MenuItem id="search" type="standard" position="3" title=" " icon="https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/review_sessions.png"  />
		//</Menu>
		//</menus>
		//<selectionpagebackgroundURL>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MAIN_BG.png</selectionpagebackgroundURL>
		//<sessionpagebackgroundURL>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MAIN_BG.png</sessionpagebackgroundURL>
		//<topbuttonimageURL>https://www.miscue.co.uk/iglooapi/resources/DEPRICATED_USE_BACK_SAVE_OR_LOGOUT_IMAGE_bg_150_150.png</topbuttonimageURL>
		//<backimageURL>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/BACK_BUTTON.png</backimageURL>
		//<saveimageURL>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/MISCUE_SAVE.png</saveimageURL>
		//<logoutimageURL>https://www.miscue.co.uk/iglooAPI/images/appimagesCOLV1/LOGOUT.png</logoutimageURL>
		//<MiscueTypes>
		//<MiscueType id="miscue_omission" text="Omission" requirenotes="false" position="1" apiref="OMISSION" colour="#0000FF"  />
		//<MiscueType id="miscue_selfcorrection" text="Self-correction" requirenotes="false" position="2" apiref="SELFCORRECTION" colour="#00FFFF"  />
		//<MiscueType id="miscue_insertionafter" text="Insertion after [word]" requirenotes="true" position="3" apiref="INSERTION" colour="#00FF00" />
		//<MiscueType id="miscue_insertionbefore" text="Insertion before [word]" requirenotes="true" position="4" apiref="INSERTION"  colour="#FFFF00"  />
		//<MiscueType id="miscue_reversal_prev" text="reversal of [word] &amp; [prevword]" requirenotes="false" position="5" apiref="REVERSAL" colour="#FF0000"  />
		//<MiscueType id="miscue_reversal_next" text="reversal of [word] &amp; [nextword]" requirenotes="false" position="6" apiref="REVERSAL" colour="#FF00FF"  />
		//<MiscueType id="miscue_substitution" text="Substitution" requirenotes="true" position="7" apiref="SUBSTITUTION" colour="#008000"  />
		//<MiscueType id="miscue_hesitiation" text="Hesitation" requirenotes="false" position="8" apiref="HESITATION" colour="#800080"  />
		//<MiscueType id="miscue_repitition" text="Repetition" requirenotes="false" position="9" apiref="REPITITION" colour="#800000"  />
		//<MiscueType id="miscue_other" text="Other" requirenotes="true" position="10" apiref="OTHER" colour="#FF0011"  />
		//</MiscueTypes>
		
		//There is no Data close tag
		//There is no response close tag
		//There is no result tag at all
		
		
		else
		{
			//V1.9 SDK7 - Changed from 'text' to 'textContent'
			var message =   'Server is down. Please try again later.' + '' + responses.item(0).getElementsByTagName("result").item(0).textContent;
      		//var message =   'Server is down. Please try again later.' + '' + responses.item(0).getElementsByTagName("result").item(0).text;
      		
      		
      		/*
      		  
      		  Just copied these for reference
      		  
      		 var docData = Ti.XML.parseString(xmlSync);
        	 var responses = docData.getElementsByTagName("response");
      		  
      		 */
      		Ti.API.info("-------------------- BEN!!! apiservice = " +  responses.item(0).getElementsByTagName("apiservice").item(0).textContent);
      		Ti.API.info("-------------------- BEN!!! Font = " +  docData.getElementsByTagName("font").item(0).textContent);
      		
      		/*for(var i = 0; i < docData.getElementsByTagName("MenuItem").length; i++)
      		{
      			var MyItem = docData.getElementsByTagName("MenuItem").item(i).textContent;
      			Ti.API.info("------------------- MenuItem" + i + "MyItem = " + MyItem);
      			Ti.API.info(docData.getElementsByTagName("MenuItem").item(i).id);
      			Ti.API.info(docData.getElementsByTagName("MenuItem").item(0).textContent);
      		}*/
      		
	  		var dialog = Ti.UI.createAlertDialog({
      		message: message,
      		ok: 'Ok',
      		title: 'Server error'
      		});
      		dialog.show();
	  		dialog.addEventListener('click',function(e)
	  		{
	  			if(e.index == 0)
	  			{
	    			//1.9 SDK7 added r_loadingScreen
					r_loadingScreen.hideActivity();
					//hideActivity();
	  			}
      		});	   
  		}      
        return result;
    }   
    //1.9 SDK7 - Exported for use on Apifile.js
    exports.callback = callback;
    //1.9 SDK7 - Changed include to require
    /*Ti.include(
	'/MainMiscue/ui/HomeScreen.js'
	);*/
	
	var r_HomeScreen = require('/MainMiscue/ui/HomeScreen.js');
	
	

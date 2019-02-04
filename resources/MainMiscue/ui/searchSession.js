//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue.js'); 

//1.9 SDK7 - Added 'require' for loadingScreen
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen'); 

//1.9 SDK7 - Added 'require' for HomeScreen
var r_HomeScreen = require('/MainMiscue/ui/HomeScreen'); 

//1.9 SDK7 - Added 'require' for styles
var r_styles = require('/MainMiscue/ui/styles'); 

//1.9 SDK7 - Added 'require' for sessionBookPage
var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage'); 

//1.9 SDK7 - Added 'require' for Apifile
var r_Apifile = require('/MainMiscue/ui/Apifile');

	(function() {
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.ui.createsearchSession = function(userName,userId,token,menuItemKey) {
		r_miscue.tt.ui.createsearchSession = function(userName,userId,token,menuItemKey) {
		var  now = new Date();
		Ti.API.info('serach session');
		var minutes = now.getMinutes();
		var sec = now.getSeconds();
		var labelName,deleteLabelName;
		//Getting OS name	
		var osname = Ti.Platform.osname;	
		// Getting the window width and height
		var pWidth = Ti.Platform.displayCaps.platformWidth;
		//Open the database 
		var db = Titanium.Database.open('Miscue');
		var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',userId);
		//Extracting the usersetting datas from local database 
		var schoolnames = homerow.fieldByName('schoolName');
		var backpage = homerow.fieldByName('backPage');
		var backcolour =  homerow.fieldByName('backgroundColor');
		var fontcolour = homerow.fieldByName('fontColor');
		var pagefontfamily = homerow.fieldByName('charFont');
		var browseWindowBackgroundImage = homerow.fieldByName('selectionPagebackgroundURL');
		var dec = Ti.Utils.base64decode(schoolnames);
		 //BackButton
		 //V1.9 SDK7 - Added r_loadingScreen
      var backView = r_loadingScreen.createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
      //var backView = createBackButton(fontcolour, homerow.fieldByName('backImageURL'));
		homerow.close();
		homerow = null;
		var localizedAlertLabelnamerow = db.execute("SELECT * FROM Language WHERE userId =? AND labelId IN ('search_Submit_Pending_Session','Delete')",userName);
		if(localizedAlertLabelnamerow.rowCount > 0)
		{
		   while (localizedAlertLabelnamerow.isValidRow())
		   { 	
			  var labelId = localizedAlertLabelnamerow.fieldByName('labelId');
			  var LocalizedLabelName = localizedAlertLabelnamerow.fieldByName('label');
			  if(labelId == 'search_Submit_Pending_Session')
			  {
			  	labelName = LocalizedLabelName;
			  }
			   if(labelId == 'Delete')
			  {
			  	deleteLabelName = LocalizedLabelName;
			  }
			  localizedAlertLabelnamerow.next();
		  }
		}
		else{
		labelName = 'Submit pending session';
		
		deleteLabelName = 'Delete';
		}
		db.close();
		db = null;
		//V1.9 SDK7 - Added r_loadingScreen
		 var iOS7 = r_loadingScreen.isiOS7Plus();
		 //var iOS7 = isiOS7Plus();
       
		// Creating window 
		var miscueSearchWin = Ti.UI.createWindow({
			fullscreen:false,
			navBarHidden:true,
			tabBarHidden:true,
			backgroundColor:'white'
		});
		  if(iOS7 >= 7)
         {
             miscueSearchWin.top = '20dp';
         }
       //V1.9 SDK7 - added r_loadingScreen
       var Inch = r_loadingScreen.screenInch();
       //var Inch = screenInch();
       
       //V1.9 SDK7 - Added r_loadingScreen
       var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(browseWindowBackgroundImage);
       //var screenBackgroundImage = mainBackgroundImage(browseWindowBackgroundImage);
       miscueSearchWin.add(screenBackgroundImage[0]);
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
    		miscueSearchWin.orientationModes = [Titanium.UI.PORTRAIT]; //Assigning orientation modes to small screen windows
		}else if(osname == 'android'){
			miscueSearchWin.orientationModes = [Titanium.UI.PORTRAIT]; //Assigning orientation modes to small screen windows
		}	
		//V1.9 SDK7 - Added r_loadingScreen
		var top = r_loadingScreen.titleLabeltop();
		//var top = titleLabeltop();
		
		//V1.9 SDK7 - Added r_loadingScreen
		var iOS7 = r_loadingScreen.isiOS7Plus();
		//var iOS7 = isiOS7Plus();
 
		//MAL - new label
 
		var webLabelName = Ti.App.Properties.getString("readingResultsMessage");
 
		var WebLabel = Ti.UI.createLabel({
			objName:'weblabel',
			//id:'WebLabelMsg',
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			visible:true,
			top:'12%',
			//touchEnabled: true,
			text:webLabelName,
			height:'35dp',
			width:'90%',
			textAlign:'center',
			borderWidth:2,
			borderRadius:10,
			font:{fontSize:'12dp',fontWeight:'bold'},
			borderColor:'black',
			color:'white',
			backgroundColor:'#88609b',
		});
	

	
		WebLabel.addEventListener('click', function(e) {
		//open link in safari 		
		Titanium.Platform.openURL('http//www.bigcatassessment.com');
		});


	miscueSearchWin.add(backView);//Adding back button to window
		 
		 //Back button functionality     
		backView.addEventListener('click', function (e) {
			miscueSearchWin.remove(backView);
			miscueSearchWin.remove(PendingSessionButton);
			miscueSearchWin.remove(searchTextField);
			miscueSearchWin.remove(searchImageButton);
			miscueSearchWin.remove(screenBackgroundImage[0]);
            screenBackgroundImage[0] = null;
			if(miscueSearchWin.children.length > 5)
			{
			miscueSearchWin.remove(tableView);
			}
			var refcheck = 2;
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//var wind = tt.ui.createmiscueMenuPage(userName,token,menuItemKey,userId);
			var wind = r_miscue.tt.ui.createmiscueMenuPage(userName,token,menuItemKey,userId);
			wind.open();
			miscueSearchWin.close();
			backView = null;
			PendingSessionButton = null;
			searchTextField = null;
			searchImageButton = null;
			miscueSearchWin = null;
		  });
		  
		///Android default back button functionality
		if(Ti.Platform.osname == 'android')
		{
		 miscueSearchWin.addEventListener('android:back', function(){
			miscueSearchWin.remove(backView);
			miscueSearchWin.remove(PendingSessionButton);
			miscueSearchWin.remove(searchTextField);
            miscueSearchWin.remove(searchImageButton);
            miscueSearchWin.remove(searchTextField);
            miscueSearchWin.remove(searchImageButton);
            miscueSearchWin.remove(screenBackgroundImage[0]);
            screenBackgroundImage[0] = null;
			if(miscueSearchWin.children.length > 5)
			{
			miscueSearchWin.remove(tableView);
			}
			var refcheck = 2;
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//var wind = tt.ui.createmiscueMenuPage(userName,token,menuItemKey,userId); //opening the miscue menu page
			var wind = r_miscue.tt.ui.createmiscueMenuPage(userName,token,menuItemKey,userId); //opening the miscue menu page
			wind.open();
			miscueSearchWin.close();
			backView = null;
            PendingSessionButton = null;
            searchTextField = null;
            searchImageButton = null;
            miscueSearchWin = null;
		 });
		}
		  
		var deleteLabel;
		if(Ti.Network.online) // checking intenet is available or not
		{
		}
		
		if(miscueSearchWin.children.length == 5)
		{	  	
		 miscueSearchWin.remove(tableView);
		}
		//V1.9 SDK7 - added r_loadingScreen
		var maxInch = r_loadingScreen.screenInch();
		//var maxInch = screenInch();
		var pending_Button_Top,tableView_top;
		 if(Inch >= InchValue)
		 {
		  pending_Button_Top = '110dp';		  
		  tableView_top = '150dp';
		 }
		 else{
		  pending_Button_Top = '85dp'; //BCE-9 Resolved		  
		  tableView_top = '130dp'; ////BCE-9 Resolved
		  if(osname == 'ipad'){ //bce-19 resolved and bce-8 
		  	pending_Button_Top = '120dp';
		  	tableView_top = '165dp';
		  }
		 }
		 
		//Creating tableview
		var tableView = Ti.UI.createTableView({
    		top:tableView_top,
    		 minRowHeight: 70,
            selectionStyle: 'NONE',
    		//moveable:true,
    		separatorColor: 'transparent',
    		backgroundColor:'transparent',
    		objName : 'table'
		});
		if(Ti.Platform.osname != 'android')
		{
		//Creating footer and add to table view	
		var footerView = Ti.UI.createView({
		height : 0
		});
		tableView.footerView = footerView; //Adding footer to tableview
		tableView.footerTitle = '';
		}
	
	
		var PendingSessionButton = Ti.UI.createLabel({
			text:labelName,
			right:10,
			labelid:'search_Submit_Pending_Session',
			textAlign:'center',
			backgroundColor:'transparent',
			top:pending_Button_Top,
			width:'200dp',
			color:fontcolour,
			borderWidth:2,
			     borderRadius:10,
			     borderColor:'#888',
			     font:{fontSize:'16dp',fontWeight:'bold',fontFamily:pagefontfamily},
			height:'40dp',
		});
		
		 var db = Titanium.Database.open('Miscue');
          var miscueSavePendingSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,'null'); 
          if(miscueSavePendingSessionToServerRow.rowCount == 0)
          {
              PendingSessionButton.visible = false;
          }
         miscueSavePendingSessionToServerRow.close();
         miscueSavePendingSessionToServerRow = null;
         db.close();   
         db = null;
		 
		miscueSearchWin.add(PendingSessionButton);
		
         miscueSearchWin.addEventListener('close',function(e){
		    Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode);
		 });
		var isSumbitionInProgress  = 'false';
		//Event listner for pending session
		PendingSessionButton.addEventListener('click',function(e){
			if(Ti.Network.online)
			{
			if(isSumbitionInProgress == 'false')
			{
			isSumbitionInProgress = 'true';
			 var db = Titanium.Database.open('Miscue');
			 var miscueSavePendingSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,'null'); 
			var interval = 4000 * miscueSavePendingSessionToServerRow.rowCount;
			if(miscueSavePendingSessionToServerRow.rowCount > 0)
			{
			var pendingSessionRowCount = miscueSavePendingSessionToServerRow.rowCount;
			db.close();
			var isPageName = 'searchSession';
			miscueSearchWin.touchEnabled = false;
			var labelArray = new Array();
			labelArray['message']=['loading_Indicator','Please wait..'];
			//V1.9 SDK7 - Added r_loadingScreen
			r_loadingScreen.showActivity(labelArray['message'],userName);
			//showActivity(labelArray['message'],userName);
			 Ti.App.Properties.setString('isSearchImageButtonIsClicked', 'false'); 
			 searchTextField.value = '';
			createSubmitPendingSessionToServer(userId,token,miscueSearchWin,userName,menuItemKey,fontcolour,backcolour,pagefontfamily,isPageName,tableView, PendingSessionButton);
			isSumbitionInProgress = 'false';
			}
			else{
			isSumbitionInProgress = 'false';
			db.close();
			var labelArray = new Array();
			  labelArray['title']=['Alert','Alert'];
			  labelArray['message']=['no_Pending_Sessions','User has not created any sessions'];
			  labelArray[1]=['Ok','OK'];
			  //V1.9 SDK7 - Added r_HomeScreen
			  var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
			  //var dialog = createLocalizedAlertDialog(labelArray, userName);
			 dialog.show();
			}
			}
			else{
			return;
			}
			}
			//If no internet connectivity
			else{
				if(isSumbitionInProgress == 'false')
			  {
			  	isSumbitionInProgress = 'true';
			 var labelArray = new Array();
			  labelArray['message']=['no_Internet_Connection','No internet connection'];
			  //V1.9 SDK7 - Added HomeScreen requires
			  r_HomeScreen.createLocalizedShowToastMessage(labelArray['message'], userName);
			 //createLocalizedShowToastMessage(labelArray['message'], userName);
			 isSumbitionInProgress = 'false';
			 }
			}
		});
		  
		 var searchTextField = Ti.UI.createTextField({
                hintText:'learner name',
                color:'black',
                font:{fontSize:(Inch < InchValue) ?'12dp':'18dp'},
                borderColor:'#aaa',
                top:'3%',
                height:(Inch >= InchValue)?'40dp':'35dp',
                width:'26%',
                right:'10%',
                backgroundColor:'white',
                paddingLeft:3
        });
         searchTextField.blur();
        
        if(osname == 'android')
        {
             miscueSearchWin.addEventListener('focus',function(e){
             Ti.UI.Android.hideSoftKeyboard();
             });
        }
      
        
        var searchImageButton = Ti.UI.createImageView({
            top:'3%',
            image:'/images/phase5/LEARNERSEARCH.png',
            right:'2.3%',
            height:'35dp',
            width:'7%'
        });
        
        if(Inch >= InchValue)
        {
            searchImageButton.height = '42dp';
            searchImageButton.width = '6%';
        }
        
        miscueSearchWin.add(searchImageButton);
        miscueSearchWin.add(searchTextField);

		
		
	    Ti.App.Properties.setString('isSearchImageButtonIsClicked', 'false'); 
	   createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily); ///calling function to show miscue session
        
       
        
	               //Event listner for search session based on learner
       searchImageButton.addEventListener('click',function(e){
               if(searchTextField.value != '')
               {
                    var db = Titanium.Database.open('Miscue');
                    var searchSessionResult =  db.execute("SELECT  * FROM MiscueSession M, Learner L WHERE M.userId = ? AND M.sessionStatus != ? AND M.learnerGuid = L.learnerGuid AND L.learnerName LIKE \'%" + searchTextField.value + "%\'", userId,'DELETED');
                   if(searchSessionResult.rowCount > 0)
                   {
                       searchSessionResult.close();
                       db.close();
                     Ti.App.Properties.setString('isSearchImageButtonIsClicked', 'true');
                      searchTextField.blur();
                    if(osname == 'android')
                    {
                         miscueSearchWin.addEventListener('focus',function(e){
                         Ti.UI.Android.hideSoftKeyboard();
                        });
                    }
                     createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextField.value);
                   }
                   else
                   {
                        searchSessionResult.close();
                       db.close();
                       var SearchResultArray = new Array();
                      SearchResultArray['title']=['Alert','Alert'];
                      SearchResultArray['message']=['no_Sessions','This learner has not created any session'];
                      SearchResultArray[1]=['Ok','OK'];
                      //V1.9 SDK7 - Added r_HomeScreen
                                            var dialog = r_HomeScreen.createLocalizedAlertDialog(SearchResultArray, userName);
                      //var dialog = createLocalizedAlertDialog(SearchResultArray, userName);
                     dialog.show();
                          
                     }
                searchSessionResult = null;
                db = null;
            }
            else
            {
                     var SearchTextFieldEmptyArray = new Array();
                      SearchTextFieldEmptyArray['title']=['Alert','Alert'];
                      SearchTextFieldEmptyArray['message']=['empty_search_textField','Enter learner name'];
                      SearchTextFieldEmptyArray[1]=['Ok','OK'];
                      //V1.9 SDK7 - Added r_HomeScreen
                      var dialog = r_HomeScreen.createLocalizedAlertDialog(SearchTextFieldEmptyArray, userName);
                      //var dialog = createLocalizedAlertDialog(SearchTextFieldEmptyArray, userName);
                     dialog.show();
            }
        }); 
	
	   searchTextField.addEventListener('change', function(e){
	       if(searchTextField.value == '')
	       {
	            Ti.App.Properties.setString('isSearchImageButtonIsClicked', 'false'); 
               createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily); ///calling function to show miscue session
	       }
	   });
	
		//Orientation change listner
		Ti.Gesture.addEventListener('orientationchange', orientionChangeMode);
		
		function orientionChangeMode(e) {
			//V1.9 SDK7 - Added r_loadingScreen
			var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
		//var screenRes = backgroundImageHeightWidthPxToDp();       
       screenBackgroundImage[1].width = screenRes[0];
       
       if(Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
         {
         		screenBackgroundImage[1].height = screenRes[1];
				Ti.API.info('or change landscape'+screenBackgroundImage[1].height);
                backView.height = 70;
                backView.width = 135;
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
				//V1.9 SDK7 - This property could not be set. Seemed random, could not reproduce. Added check to see if backView exists
				if(backView){
					backView.height = 80;
                	backView.width = 145;	
				}
                
                }
         }
 		//V1.9 SDK7 - Added r_loadingScreen
		var portraitval = r_loadingScreen.dptopixel();
		//var portraitval = dptopixel();
		var lwidth = Ti.Platform.displayCaps.platformWidth;
		var dpVal = 115;	
		//V1.9 SDK7 - Added r_loadingScreen
		var pxlvalsearchsession = r_loadingScreen.dptopixel(dpVal);
		//var pxlvalsearchsession = dptopixel(dpVal);
		}
		
			//MAL

		if (Ti.App.Properties.getString("currentAppID")=="COLLINS")
		{
					miscueSearchWin.add(WebLabel);
		}
		
		return miscueSearchWin;
		};
	})();
		
		//creating a function for purpose of reloading the tableview	
		function createSearchFeild (tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue) 
		{
		    
		var currentVisibleDeleteView = 'NOT-DEFINED';
		//Getting OS name	
		var osname = Ti.Platform.osname;	
		//V1.9 SDK7 - Added r_loadingScreen
		var top = r_loadingScreen.titleLabeltop();
		//var top = titleLabeltop();
		//V1.9 SDK7 - added r_loadingScreen
       var Inch = r_loadingScreen.screenInch();
       //var Inch = screenInch();
		var lWidth = Ti.Platform.displayCaps.platformWidth;
		var lHeight = Ti.Platform.displayCaps.platformHeight;
		var marginViewWidth,deleteLabelName;
		var db = Titanium.Database.open('Miscue');
		var localizedAlertLabelnamerow = db.execute("SELECT * FROM Language WHERE userId =? AND labelId IN ('Delete')",userName);
		if(localizedAlertLabelnamerow.rowCount > 0)
		{
		   	  var labelId = localizedAlertLabelnamerow.fieldByName('labelId');
			  var LocalizedLabelName = localizedAlertLabelnamerow.fieldByName('label');
			   if(labelId == 'Delete')
			  {
			  	deleteLabelName = LocalizedLabelName;
			  }
			 
		}
		else{
		deleteLabelName = 'Delete';
		}
		db.close();	
		if(osname == 'android')
		{
		  marginViewWidth = ((Titanium.Platform.displayCaps.platformWidth * (Titanium.Platform.displayCaps.dpi / 160))/3) + 15 + 'dp';
		}
		else{
		marginViewWidth = ((Titanium.Platform.displayCaps.platformWidth * (Titanium.Platform.displayCaps.dpi / 163))/3) + 15 + 'dp';
		}
		var sessionguid;
		var section = [];
		var labelArray = new Array();
		labelArray['title']=['Alert','Alert'];
		labelArray['message']=['search_Pending_Session_Delete','This session is not saved, anyway you want to delete?'];
		labelArray[1]=['Delete','Delete'];
		labelArray[2]=['Cancel','Cancel'];
		//V1.9 SDK7 - Added r_HomeScreen
		var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, userName);
		//var dialog = createLocalizedAlertDialog(labelArray, userName);
		
		var archiveLabelArray = new Array();
		archiveLabelArray['title']=['Alert','Alert'];
		archiveLabelArray['message']=['archive_session','After archiving, this session will only be available on the web suite. Do you want to continue?'];
		archiveLabelArray[1]=['Archive','Archive'];
		archiveLabelArray[2]=['Cancel','Cancel'];
		//V1.9 SDK7 - Added r_HomeScreen
		var archiveDialog = r_HomeScreen.createLocalizedAlertDialog(archiveLabelArray, userName);
		//var archiveDialog = createLocalizedAlertDialog(archiveLabelArray, userName);
		
		var tableviewData = [];
		//V1.9 SDK7 - added r_loadingScreen
		var maxInches = r_loadingScreen.screenInch();
		//var maxInches = screenInch();
		
		var db = Titanium.Database.open('Miscue');
		var searchMiscueSessionRow;
		
		if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
		{
		    searchMiscueSessionRow =  db.execute("SELECT DISTINCT M.createdDate FROM MiscueSession M, Learner L WHERE M.userId = ? AND M.sessionStatus != ? AND M.learnerGuid = L.learnerGuid AND L.learnerName LIKE \'%" + searchTextFieldValue + "%\'ORDER BY createdDate", userId,'DELETED');
         
         }
		else
		{
		  searchMiscueSessionRow = db.execute('SELECT DISTINCT createdDate FROM MiscueSession WHERE userId = ? AND sessionStatus != ? ORDER BY createdDate', userId,'DELETED');
		}
		
		if(searchMiscueSessionRow.rowCount > 0 ) 
		{
		    var audioFileName;
		miscueSearchWin.add(tableView); //adding table view to mwindow
		
		
	
		
		var imgDimensions = top[4]; 
		var accuracy;
		
		function convertToDisplayFormat (convertDate) {
			var sessionEditedDate = new Date(convertDate);
			var month = new Array();
			month[0] = "January";
			month[1] = "February";
			month[2] = "March";
			month[3] = "April";
			month[4] = "May";
			month[5] = "June";
			month[6] = "July";
			month[7] = "Aug";
			month[8] = "Sept";
			month[9] = "Oct";
			month[10] = "Nov";
			month[11] = "Dec";
			var getYear = sessionEditedDate.getFullYear();
			getYear = getYear.toString();
			return sessionEditedDate.getDate() + '-' + month[sessionEditedDate.getMonth()] + '-' + getYear.substr(2,3) ;
		   }
		
		function createCustomeTableViewRowForBiggerScreen(rowData,userId, sectionVal)
		{
		 var row_height,bookImageViewleft,dateLabelLeft,noteLabelTop,date_left,learnerLabelTop;
			row_height = '185dp';
			learnerLabelTop = '115dp';
			noteLabelTop = '155dp';
			
    var tableSectionView  = Ti.UI.createView({
        backgroundColor:'transparent',
        //top:'10dp',
        height:'55dp'
    });
    var tableSectionLabel = Ti.UI.createLabel({
        font:{fontFamily:pagefontfamily,fontSize:'32dp',fontWeight:'bold'},
       // 
        color:fontcolour,
        textAlign:'left',
        left:'10dp',
        width:'300dp',
        height:'100%'
    });
    
    tableSectionView.add(tableSectionLabel);
    
     
    
    section[sectionVal] = Ti.UI.createTableViewSection({
        headerView:tableSectionView
    });
        var tableRowValues;
        if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
        {
            tableRowValues = db.execute("SELECT * FROM MiscueSession M, Learner L WHERE M.userId = ? AND M.createdDate = ? AND  M.sessionStatus != ? AND M.learnerGuid = L.learnerGuid  AND L.learnerName LIKE \'%" + searchTextFieldValue + "%\'", userId, rowData.fieldByName('createdDate'), 'DELETED');
            tableSectionLabel.text = tableRowValues.fieldByName('createdDate');
         }
          else
          {
         tableSectionLabel.text = rowData.fieldByName('createdDate');
         tableRowValues = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND createdDate = ? AND  sessionStatus != ?', userId, rowData.fieldByName('createdDate'), 'DELETED');
              
          }		
          
       //tableRowValues
		 for(var x = 0; x < tableRowValues.rowCount; x++)
		 {
		 audioFileName = tableRowValues.fieldByName('recordedAudioFilename');
		 var sessionGuid = tableRowValues.fieldByName('sessionGuid');
		var learnerGuid  = tableRowValues.fieldByName('learnerGuid');
		var bookGuid = tableRowValues.fieldByName('bookGUID');
		var note_Value = tableRowValues.fieldByName('sessionNotes');
		var createddate = tableRowValues.fieldByName('sessiondate');
		var editeddate = tableRowValues.fieldByName('lastModifiedDate');
		var createdSessionTime= tableRowValues.fieldByName('createdTime');
		var miscueAccuracy = tableRowValues.fieldByName('accuracyValue');
		var lastServerDate = tableRowValues.fieldByName('lastSavedToServerDate');
		var searchBookLearnerRow = db.execute('SELECT * FROM UserBook  U, learner  L WHERE U.bookGuid = ? AND L.learnerGuid = ? AND U.userId = ? AND U.userId = L.userId', bookGuid, learnerGuid,userId);
		var groupGuid = searchBookLearnerRow.fieldByName('groupGuid');
		var learnerimage = searchBookLearnerRow.fieldByName('learnerImage');
		var learnerName = searchBookLearnerRow.fieldByName('learnerName');
		var bookimage = searchBookLearnerRow.fieldByName('bookImage');
		var bookName = searchBookLearnerRow.fieldByName('bookName');
		var searchGroupRow = db.execute('SELECT groupName FROM LearnerGroup WHERE groupGuid = ? AND loginUserId = ?', groupGuid,userId);
		var groupname = searchGroupRow.fieldByName('groupName');
		
		
      if(Ti.Platform.osname != 'android')
       {
		note_Value = note_Value.replace(/\n/gi,"  ");
	   }
	
		//Creating row for tableview
		var row = Ti.UI.createTableViewRow({
		     className : 'row',
			height:row_height,
			backgroundColor:'transparent',
			backgroundSelectedColor:'transparent', //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
			objName : 'row',
			touchEnabled: true,
			id:sessionGuid,
			//selectionStyle : Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
			//touchEnabled:false
		});
		
		if(osname != 'android')
		{
		 row.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
		}
		
		var rowContainerView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    objName: 'rowContainerView',
		    id:sessionGuid,
		    touchEnabled: true,
		    width: Ti.UI.FILL,
		    height: '100%',
		  });
		 
		 
		var firstRowView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    top:'2dp',
		    left:'5dp',
		    touchEnabled: false,
		    width:'35%',
		    height: '150dp'
		 });
		 
		 var secondRowContainerView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    top:'2dp',
		    left:'35%',
		    touchEnabled: false,
		    width: '35%',
		    height: '150dp'
		 });
		
		var thirdRowContainerView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    top:'2dp',
		    left:'70%',
		    touchEnabled: false,
		    width: '20%',
		    height: '150dp'
		 });
		 
		 var fourthRowContainerView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    top:'2dp',
		    left:'90%',
		    touchEnabled: true,
		    width: '10%',
		    height: '150dp'
		 });
		
		var learnerImageView = Ti.UI.createView({
			backgroundColor:'transparent',
			top:'33dp',
			left:'5dp',
			height:imgDimensions,
			touchEnabled: false,
			width:top[6],
		});
		
		Ti.API.info('learner images '+learnerimage);
		
		//Creating Imageview
		var learnerImage = Ti.UI.createImageView({
			defaultImage:'/images/phase5/NOIMAGE.png',
			top:'0dp',
			touchEnabled: false,
			left:'5dp',
			height:'100%',
			width:'auto',
			image:learnerimage,
		});
		
		var createdTime = Ti.UI.createLabel({
		    text: createdSessionTime,
            left:'110dp',
            touchEnabled: false,
            height:'25dp',
            width:marginViewWidth,
            top:'110dp',
            color:fontcolour,
            visible:true,
            font: {
            fontFamily:pagefontfamily,
            fontSize:'14dp',
            fontWeight:'bold'
            },
		});	
		
		
		var bookImageView = Ti.UI.createView({
			backgroundColor:'transparent',
			top:'33dp',
			left:'1%',
			touchEnabled: false,
			height:imgDimensions,
			width:top[6],
			//opacity:0.7,			
		});
		
		Ti.API.info('book image '+bookimage);
		
		//Creating Imageview
		var bookImage = Ti.UI.createImageView({
			defaultImage:'/images/phase5/NOBOOKIMAGE.png',
			touchEnabled: false,
			top:'0dp',
			left:'5dp',
			height:'100%',
			width:'auto',
			// opacity:0.3,
			// image:'/images/phase5/NOBOOKIMAGE.png',
			image:bookimage
		});
		
		
		var accuracyView = Ti.UI.createView({
			//visible:true,
			width:'100%',
			height:'30dp',
			touchEnabled: false,
		});
		//Creating label(Date)
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var accuracy = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var accuracy = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text:miscueAccuracy + '%',
			height:Titanium.UI.SIZE,
			width:'80dp',
			left:'10%',
			//visible:true,
			textAlign:Titanium.UI.TEXT_ALIGNMENT_RIGHT,
			color:fontcolour,
			touchEnabled: false,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'18dp',
			fontWeight:'bold'
			},
		}));
		
	
		var statusImage = Ti.UI.createImageView({
			touchEnabled: false,
			left:'20%',
			//top:'40%',
			height:'33dp',
			width:'33dp',
			backgroundColor:'transparent',
		});
		
		if(lastServerDate == 'null' || lastServerDate < editeddate)
    		{
    		  statusImage.image = '/images/phase5/NOTSAVEDONSERVER.png';
    		}
    		else if(lastServerDate != 'null' || lastServerDate > editeddate)
    		{
    		  statusImage.image = '/images/phase5/SAVEDONSERVER.png';
    		}
		
		
			//mal 175
			var learnernamelabel = learnerName.replace("&quot;", "'");
			
		//Creating label(group name)	
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var learnerLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var learnerLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text: learnernamelabel,
			//backgroundColor:'#787878 ',
			left:'110dp',
			touchEnabled: false,
			height:'25dp',
			width:marginViewWidth,
			top:'33dp',
			color:fontcolour,
			visible:true,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'18dp',
			fontWeight:'bold'
			},
		}));
		
		
			//mal 175
			var groupnamelabel = groupname.replace("&quot;", "'");
		
		      //Creating label(group name)    
		      //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		      //var groupLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
        var groupLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
            text: groupnamelabel,
            left:'110dp',
            touchEnabled: false,
            height:'25dp',
            width:marginViewWidth,
            top:'70dp',
            color:fontcolour,
            visible:true,
            font: {
            fontFamily:pagefontfamily,
            fontSize:'18dp',
            fontWeight:'bold'
            },
        }));
        
		
		//Adding book Name
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var bookNameLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var bookNameLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text: bookName,
			left:'110dp',
			touchEnabled: false,
			height:'65dp',
			width:'50%',
			top:'40dp',
			color:fontcolour,
			visible:true,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'18dp',
			fontWeight:'bold'
			},
		}));
		
	  		if(bookNameLabel.text.length > 30)
            {
                bookNameLabel.text =  bookNameLabel.text.substr(0, 27) + '...';
            }
            if(learnerLabel.text.length > 15)
            {
                learnerLabel.text =  learnerLabel.text.substr(0, 14) + '...';
            }
            
            if(groupLabel.text.length > 15)
            {
                groupLabel.text =  learnerLabel.text.substr(0, 14) + '...';
            }
		
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var noteLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var noteLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text:note_Value,
			left:'16dp',
			height:'25dp',
			visible:true,
			touchEnabled: false,
			width:'95%',
			top:noteLabelTop,
			wordWrap: false,
			ellipsize: true,
			color:fontcolour,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'15dp',
			fontWeight:'bold'
			},
		}));
		
		var deleteMainView = Ti.UI.createView({
			//height:'100%',
			visible:false,
			opacity:0.7,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			backgroundColor:'transparent',
			touchEnabled: true,
			height:'94%',
			width :'100%',
			objName : 'deleteView',
		});
		
		
		var deleteView = Ti.UI.createView({
			height:'100%',
			visible:true,
			//opacity:0.7,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			backgroundColor:backcolour,
			touchEnabled: false,
			height:'100%',
			width :'100%',
			objName : 'deleteView',
		});
		
		
		var deleteButton = Ti.UI.createLabel({
			objName:'delete',
			id:sessionGuid,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			visible:true,
			right:'8%',
			touchEnabled: true,
			text:deleteLabelName,
			height:'35%',
			width:'30%',
			textAlign:'center',
			borderWidth:4,
			//borderRadius:10, //V1.9 SDK7 - Causes text to be invisible on android 6 and below
			font:{fontSize:'21dp',fontWeight:'bold'},
			borderColor:'white',
			color:'black',
			backgroundColor:'red',
		});
		
		//Archive button
		var archiveButton = Ti.UI.createLabel({
			objName:'archive',
			id:sessionGuid,
			//verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			visible:true,
			right:'40%',
			touchEnabled: true,
			text:'Archive',
			height:'35%',
			width:'30%',
			textAlign:'center',
			borderWidth:4,
			//borderRadius:10, //V1.9 SDK7 - Causes text to be invisible on android 6 and below
			font:{fontSize:'21dp',fontWeight:'bold'},
			borderColor:'white',
			color:'black',
			backgroundColor:'red',
		});
		
	 var separatorLine = Ti.UI.createView({
		 	bottom:'1%',
		 	backgroundColor:'#A9A9A9',
		 	height:'1dp',
		 	width:'100%',
		 	touchEnabled:false
		 });
		
		learnerImageView.add(learnerImage);
		firstRowView.add(groupLabel);
		firstRowView.add(createdTime);
		firstRowView.add(learnerImageView);
		firstRowView.add(learnerLabel);
		bookImageView.add(bookImage);	
		rowContainerView.add(firstRowView);//adding first rowview
		secondRowContainerView.add(bookImageView);
		secondRowContainerView.add(bookNameLabel);
		rowContainerView.add(secondRowContainerView);//adding second row container
		rowContainerView.add(thirdRowContainerView);//adding third row container
		accuracyView.add(accuracy);
		
		// thirdRowContainerView.add(accuracyView);  MAL - remove accuracy
		
		fourthRowContainerView.add(statusImage);
		rowContainerView.add(fourthRowContainerView);//Adding fourthRowCOntainerView torow
		rowContainerView.add(noteLabel);
		deleteMainView.add(deleteView);
		
	    if(statusImage.image == '/images/phase5/SAVEDONSERVER.png')
		  {
		      deleteMainView.add(archiveButton);
		  }
		
		
		deleteMainView.add(deleteButton);
		rowContainerView.add(deleteMainView);
		 if(x != tableRowValues.rowCount - 1)
          {
    		  rowContainerView.add(separatorLine);
    	  }
    	
    	row.add(rowContainerView);
		
		deleteMainView.addEventListener('click',function(e){
		if(e.source.objName != 'deleteView')
			{
				return;
			}
		if(currentVisibleDeleteView != 'NOT-DEFINED') {
		currentVisibleDeleteView.visible = false;
		currentVisibleDeleteView = 'NOT-DEFINED';
		}
		});
		
		section[sectionVal].add(row);
		
			
		   deleteButton.addEventListener('click',function(e){
		   		sessionguid = e.source.id;
		   		var db = Titanium.Database.open('Miscue');
				var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionguid);
				  var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
              audioFileExistCheckRow.close();
				var deleteSessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,sessionguid,'null');
				if(deleteSessionCheckRow.rowCount <= 0)
				{
				db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=?',sessionguid);
				Ti.API.info ('deleting ' + sessionguid)	;
				//V1.9 SDK7 - Added r_sessionBookPage
				db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',r_sessionBookPage.createDate(),sessionguid,userId);
				//db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',createDate(),sessionguid,userId);
				
                db.close();
            if(Ti.Network.online)
            {
            	//V1.9 SDK7 - Added r_HomeScreen
            	r_HomeScreen.createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
                //createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
            }
				//	tableView.deleteRow(e.index);  
				        var labelArray = new Array();
					    labelArray['message']=['search_Session_Deleted_Toast','Deleted'];
					    //V1.9 SDK7 - Added HomeScreen requires
					    r_HomeScreen.createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
					   //createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
				
					if(miscueSearchWin.children.length == 6){
					 miscueSearchWin.remove(tableView);
					}
					
					 if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
                    {
					createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue);
					}
					else
					{
					    createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
					}
				}
				else if(deleteSessionCheckRow.rowCount > 0){
				 db.close();
				dialog.show();		//showing dialogue box if session is not saved and try to delete
				 }
		});
	
		archiveButton.addEventListener('click',function(e){
			sessionguid = e.source.id;
			archiveDialog.show();
		});
		tableRowValues.next();
	}//Closing for loop of tableRowValue
		
   tableRowValues.close();
   tableRowValues = null;
		
		return section[sectionVal];
	  }
		
		////For smaller screen
		function createCustomeTableViewRowForSmallScreen(rowData,userId, sectionVal)
		{
		 var row_height,bookImageViewleft,dateLabelLeft,noteLabelTop,date_left,learnerLabelTop;
			row_height = '135dp';
			bookImageViewleft = '80dp';
			dateLabelLeft = '145dp';
			learnerLabelTop = '85dp';
			noteLabelTop = '110dp';
			date_left = '190dp';
		
		  var tableSectionView  = Ti.UI.createView({
            backgroundColor:'white',
            //top:'10dp',
            height:'55dp'
       });
        var tableSctionLabel = Ti.UI.createLabel({
            font:{fontFamily:pagefontfamily,fontSize:'25dp',fontWeight:'bold'},
          //  text:rowData.fieldByName('createdDate'),
            color:'#222',
            textAlign:'left',
          //  top:0,
            left:'10dp',
            width:'300dp',
            height:'100%'
        });
    
        tableSectionView.add(tableSctionLabel);
        
        section[sectionVal] = Ti.UI.createTableViewSection({
            headerView:tableSectionView
        });

              var tableRowValues;
        if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
        {
             tableRowValues = db.execute("SELECT * FROM MiscueSession M, Learner L WHERE M.userId = ? AND M.createdDate = ? AND  M.sessionStatus != ? AND M.learnerGuid = L.learnerGuid  AND L.learnerName LIKE \'%" + searchTextFieldValue + "%\'", userId, rowData.fieldByName('createdDate'), 'DELETED');
             tableSctionLabel.text = tableRowValues.fieldByName('createdDate');
           
          }
          else
          {
            tableSctionLabel.text = rowData.fieldByName('createdDate');
            tableRowValues = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND createdDate = ? AND  sessionStatus != ?', userId, rowData.fieldByName('createdDate'), 'DELETED');
          }     
          
         
        
         for(var x = 0; x < tableRowValues.rowCount; x++)
         {
		
		  audioFileName = tableRowValues.fieldByName('recordedAudioFilename');
		 var sessionGuid = tableRowValues.fieldByName('sessionGuid');
		var learnerGuid  = tableRowValues.fieldByName('learnerGuid');
		var bookGuid = tableRowValues.fieldByName('bookGUID');
		var note_Value = tableRowValues.fieldByName('sessionNotes');
		var createddate = tableRowValues.fieldByName('sessiondate');
		var editeddate = tableRowValues.fieldByName('lastModifiedDate');
		var miscueAccuracy = tableRowValues.fieldByName('accuracyValue');
		var createdSessionTime= tableRowValues.fieldByName('createdTime');
		var lastServerDate = tableRowValues.fieldByName('lastSavedToServerDate');
		var searchBookLearnerRow = db.execute('SELECT * FROM UserBook  U, learner  L WHERE U.bookGuid = ? AND L.learnerGuid = ? AND U.userId = ?', bookGuid, learnerGuid,userId);
		var groupGuid = searchBookLearnerRow.fieldByName('groupGuid');
		var learnerimage = searchBookLearnerRow.fieldByName('learnerImage');
		var learnerName = searchBookLearnerRow.fieldByName('learnerName');
		var bookName = searchBookLearnerRow.fieldByName('bookName');
		var bookimage = searchBookLearnerRow.fieldByName('bookImage');
		var searchGroupRow = db.execute('SELECT groupName FROM LearnerGroup WHERE groupGuid = ? AND loginUserId = ?', groupGuid,userId);
		var groupname = searchGroupRow.fieldByName('groupName');
		
         if(Ti.Platform.osname != 'android')
          {
            note_Value = note_Value.replace(/\n/gi,"");
          }
		
		//Creating row for tableview
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var row = Ti.UI.createTableViewRow(tt.combine($$.TableViewRow,{
		var row = Ti.UI.createTableViewRow(r_miscue.tt.combine(r_styles.$$.TableViewRow,{
			height:row_height,
			backgroundColor:'transparent',
			backgroundSelectedColor:'transparent', //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
			objName : 'row',
			touchEnabled: true,
			id:sessionGuid,
		}));
		if(osname != 'android')
		{
		row.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
		}
		var rowContainerView = Ti.UI.createView({
		    backgroundColor:'transparent',
		    objName: 'rowContainerView',
		    id:sessionGuid,
		    touchEnabled: true,
		    width: Ti.UI.FILL,
		    height: '100%',
		    visible:true,
		    no:x
		 });
		
		
			//mal 175
			var groupnamelabel = groupname.replace("&quot;", "'");
		
		//Creating label(group name)
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var groupLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var groupLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text: groupnamelabel,
			left:'85dp',
			touchEnabled: false,
			height:'25dp',
			width:lWidth/2,
			top:'40dp',
			color:fontcolour,
			visible:true,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'14dp',
			fontWeight:'bold'
			},
		}));
		

			//mal 175
			var learnernamelabel = learnerName.replace("&quot;", "'");

		
		  //Creating label(group name)    
		  //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		  //var learnerLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
        var learnerLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
            text: learnernamelabel,
            //backgroundColor:'#787878 ',
            left:'16dp',
            touchEnabled: false,
            height:'25dp',
            width:'70%',
            top:'3dp',
            color:fontcolour,
            visible:true,
            font: {
            fontFamily:pagefontfamily,
            fontSize:'18dp',
            fontWeight:'bold'
            },
        }));
		
		//mal 175 moved this
		if(groupLabel.text.length > 15)
            {
                groupLabel.text =  learnerLabel.text.substr(0, 14) + '...';
            }
		
		  //Adding book Name
		  //1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		  //var bookNameLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
        var bookNameLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
            text: bookName,
            left:'16dp',
            touchEnabled: false,
            height:'30dp',
            width:'70%',
            top:learnerLabelTop,
            color:fontcolour,
            visible:true,
            font: {
            fontFamily:pagefontfamily,
            fontSize:'14dp',
            fontWeight:'bold'
            },
        }));
		
		
		
		  if(bookNameLabel.text.length > 30)
            {
                bookNameLabel.text =  bookNameLabel.text.substr(0, 27) + '...';
            }
            if(learnerLabel.text.length > 28)
            {
                learnerLabel.text =  learnerLabel.text.substr(0, 14) + '...';
            }
		
		var learnerImageView = Ti.UI.createView({
			backgroundColor:'transparent',
			top:'33dp',
			left:'16dp',
			height:imgDimensions,
			touchEnabled: false,
			width:top[6],
		});
		
		//Creating Imageview
		var learnerImage = Ti.UI.createImageView({
			defaultImage:'/images/phase5/NOIMAGE.png',
			top:'0dp',
			touchEnabled: false,
			left:'5dp',
			height:'auto',
			width:'auto',
			image:learnerimage,
		});
		
		var bookImageView = Ti.UI.createView({
			backgroundColor:'transparent',
			top:'33dp',
			left:'170dp',
			touchEnabled: false,
			height:imgDimensions,
			width:top[6],		
		});
				
		//Creating Imageview
		Ti.API.info('book image '+bookimage);
		var bookImage = Ti.UI.createImageView({
			defaultImage:'/images/phase5/NOBOOKIMAGE.png',
			touchEnabled: false,
			top:'0dp',
			height:'auto',
			width:'auto',
			// opacity:0.3,
			// image:'/images/phase5/NOBOOKIMAGE.png',
			image:bookimage
		});
		
		//Creating label(Date)
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var CreatedTimeLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var CreatedTimeLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text:createdSessionTime,
			visible:true,
			//backgroundColor:'#787878 ',
			width:'60dp',
			height:'25dp',
			top:'40dp',
            right:'4dp',
			color:fontcolour,
			touchEnabled: false,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'10dp',
			fontWeight:'bold'
			},
		}));
		
		
		//Creating label(Date)
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var accuracy = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var accuracy = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text:miscueAccuracy + '%',
			right:'4dp',
			visible:true,
			textAlign:Titanium.UI.TEXT_ALIGNMENT_RIGHT,
			color:fontcolour,
			touchEnabled: false,
			right:'4dp',
            top:'5dp',
            width:'60dp',
            height:'25dp',
			font: {
			fontFamily:pagefontfamily,
			fontSize:'15dp',
			fontWeight:'bold'
			},
		}));
	
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var sessionStatusLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var sessionStatusLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			visible:true,
			height:'25dp',
			right:((maxInches >= InchValue)?'15dp':'0dp'),
			top:'3dp',
			color:fontcolour,
			touchEnabled: false,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'16dp',
			fontWeight:'bold'
			},
		}));
		
		var statusImage = Ti.UI.createImageView({
			touchEnabled: false,
			top:'75dp',
			right:'14dp',
			height:'28dp',
			width:'30dp',
			backgroundColor:'transparent',
		});
	    
		if(lastServerDate == 'null' || lastServerDate < editeddate)
		{
		statusImage.image = '/images/phase5/NOTSAVEDONSERVER.png';
		}
		else if(lastServerDate != 'null' || lastServerDate > editeddate)
		{
		statusImage.image = '/images/phase5/SAVEDONSERVER.png';
		}
		
	
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var noteLabel = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
		var noteLabel = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,{
			text:note_Value,
			left:'16dp',
			height:'25dp',
			visible:true,
			touchEnabled: false,
			width:'95%',
			top:noteLabelTop,
			wordWrap: false,
			ellipsize: true,
			color:fontcolour,
			font: {
			fontFamily:pagefontfamily,
			fontSize:'15dp',
			fontWeight:'bold'
			},
		}));
		
		var deleteMainView = Ti.UI.createView({
			height:'100%',
			visible:false,
			opacity:0.7,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			backgroundColor:backcolour,
			touchEnabled: true,
			height:'94%',
			width :'100%',
			objName : 'deleteView',
		});
		
		
		var deleteView = Ti.UI.createView({
			height:'100%',
			//visible:false,
			//opacity:0.7,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			backgroundColor:backcolour,
			touchEnabled: true,
			height:'100%',
			width :'100%',
			objName : 'deleteView',
		});
		
		
		var deleteButton = Ti.UI.createLabel({
			objName:'delete',
			id:sessionGuid,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			visible:true,
			right:'25dp',
			touchEnabled: true,
			text:deleteLabelName,
			height:'35%',
			width:'30%',
			textAlign:'center',
			borderWidth:2,
			borderRadius:10,
			font:{fontSize:'21dp',fontWeight:'bold'},
			borderColor:'white',
			color:'black',
			backgroundColor:'red',
		});
		
			//Archive button
		var archiveButton = Ti.UI.createLabel({
			objName:'archive',
			id:sessionGuid,
			verticalAlign:Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			visible:true,
			right:'145dp',
			touchEnabled: true,
			text:'Archive',
			height:'35%',
			width:'30%',
			textAlign:'center',
			borderWidth:2,
			borderRadius:10,
			font:{fontSize:'21dp',fontWeight:'bold'},
			borderColor:'white',
			color:'black',
			backgroundColor:'red',
		});
		
	
	var separatorLine = Ti.UI.createView({
		 	bottom:'1%',
		 	backgroundColor:'#A9A9A9',
		 	height:'1dp',
		 	width:'100%',
		 	touchEnabled:false
		 });
		
		learnerImageView.add(learnerImage);
		bookImageView.add(bookImage);	
		rowContainerView.add(noteLabel);
		rowContainerView.add(learnerLabel);
		rowContainerView.add(CreatedTimeLabel);
		rowContainerView.add(groupLabel);
		rowContainerView.add(bookNameLabel);
		rowContainerView.add(learnerImageView);
		rowContainerView.add(bookImageView);
		
		// rowContainerView.add(accuracy); MAL - remove accuracy
		
		rowContainerView.add(statusImage);
		deleteMainView.add(deleteView);
		deleteMainView.add(deleteButton);
		//checking if status image is saved or not.
		if(statusImage.image == '/images/phase5/SAVEDONSERVER.png')
		{
			deleteMainView.add(archiveButton);
		}
		rowContainerView.add(deleteMainView);
		rowContainerView.add(separatorLine);
		row.add(rowContainerView);
		
		deleteMainView.addEventListener('click',function(e){
		if(e.source.objName != 'deleteView')
			{
				return;
			}
			
		if(currentVisibleDeleteView != 'NOT-DEFINED') {
		currentVisibleDeleteView.visible = false;
		currentVisibleDeleteView = 'NOT-DEFINED';
		}
		});
		
			
	 deleteButton.addEventListener('click',function(e){
	             sessionguid = e.source.id;
				var db = Titanium.Database.open('Miscue');
				var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionguid);
                  var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
                 audioFileExistCheckRow.close();
				var deleteSessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,sessionguid,'null');
				if(deleteSessionCheckRow.rowCount <= 0)
				{
				db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=?',sessionguid);
					//V1.9 SDK7 - Added r_sessionBookPage
					db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',r_sessionBookPage.createDate(),sessionguid,userId);
				  //db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',createDate(),sessionguid,userId);
			
                db.close();
            if(Ti.Network.online)
            {
            	//V1.9 SDK7 - Added r_HomeScreen
            	r_HomeScreen.createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
                //createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
            }
				//tableView.deleteRow(e.index);  
				        var labelArray = new Array();
					    labelArray['message']=['search_Session_Deleted_Toast','Deleted'];
					    //V1.9 SDK7 - Added HomeScreen requires
					    r_HomeScreen.createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
					   //            createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
					if(miscueSearchWin.children.length == 6){
					 miscueSearchWin.remove(tableView);
					}
				 if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
                    {
                    createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue);
                    }
                    else
                    {
                        createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
                    }
				
				}
				else if(deleteSessionCheckRow.rowCount > 0){
				 db.close();
				dialog.show();		//showing dialogue box if session is not saved and try to delete
				 }
		});
		
		archiveButton.addEventListener('click',function(e){
			sessionguid = e.source.id;
			archiveDialog.show();
		});
	   
	   section[sectionVal].add(row);
		tableRowValues.next();
		}
		return section[sectionVal];
	  }
	  
	  for (var i = 0;i < searchMiscueSessionRow.rowCount;i++) 
		{
		  if(Inch >= InchValue || osname == 'ipad') //bce-19 resolved and bce-8
		   {
		      var tableViewRow = createCustomeTableViewRowForBiggerScreen(searchMiscueSessionRow,userId, i);
			searchMiscueSessionRow.next();
		    }
		    else{
		    	   var tableViewRow = createCustomeTableViewRowForSmallScreen(searchMiscueSessionRow,userId, i);
			  searchMiscueSessionRow.next();
		     }
		    tableviewData.push(tableViewRow);
	     }
	     tableView.setData(section); //Adding all data to table view
		
		db.close();
		
		//dialog event listner	(if you click on 'Delete' button on dialogue box)
		dialog.addEventListener('click', function(e){
			if(e.index == 0)
			{
			    var db = Titanium.Database.open('Miscue');
				var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionguid);
                var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
                audioFileExistCheckRow.close();
                
				db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=?',sessionguid);
				//V1.9 SDK7 - Added r_sessionBookPage
				db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',r_sessionBookPage.createDate(),sessionguid,userId);
				//db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',createDate(),sessionguid,userId);
				
				db.close();
			 if(Ti.Network.online)
			 {
			 	//V1.9 SDK7 - Added r_HomeScreen
				r_HomeScreen.createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
				//createSaveMiscueSessionToServer(userId,sessionguid,token,'','',fileName);
			 }
			 var labelDeleteArray = new Array();
			 labelDeleteArray['message']=['search_Session_Deleted_Toast','Deleted'];
			 //V1.9 SDK7 - Added HomeScreen requires
			 r_HomeScreen.createLocalizedShowToastMessage(labelDeleteArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
			 //createLocalizedShowToastMessage(labelDeleteArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
			 if(miscueSearchWin.children.length == 6){
			 miscueSearchWin.remove(tableView);
			 }
			 
	        if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
                {
                   createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue);
                }
           else
               {
                  createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
               }
			//createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
			 }
		});
		
		//Dialog event listner for archiving the miscue session
		archiveDialog.addEventListener('click',function(e){
			if(e.index == 0)
			{
				var db = Titanium.Database.open('Miscue');
				var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionguid);
                var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
                audioFileExistCheckRow.close();
              if(fileName != 'null')
             {   
                if(Ti.Platform.osname != 'android')
                 {
                       var audioFileName = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,fileName);
                       audioFileName.deleteFile();
                 }
                  else
                  {
                      var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
                       var audioFileName = Ti.Filesystem.getFile(audioDir.resolve(),fileName);
                        audioFileName.deleteFile();
                  }
              }
               var deleteSessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,sessionguid,'null');
                db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=?',sessionguid);
                if(deleteSessionCheckRow.rowCount <= 0)
                {
                    db.execute('UPDATE MiscueSession SET sessionStatus = ? WHERE sessionGuid = ? AND userId = ?','DELETED',sessionguid,userId);
                 }
                 else
                 {
                      db.execute('DELETE FROM MiscueSession WHERE sessionGuid=?',sessionguid);
                 }
				deleteSessionCheckRow.close();
				db.close();
			  if(miscueSearchWin.children.length == 6){
			 miscueSearchWin.remove(tableView);
			 }
			  if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
                    {
                    createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue);
                    }
                    else
                    {
                        createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
                    }
			 }
		});
		
			tableView.addEventListener('swipe',function(e){  //Swipe event listner for deleting the session
			    var cnt = e.index;
			    //alert(osname);
			    if (e.direction == 'left')
                {  
                    if( e.source.objName == 'row')
                      {
                       if(currentVisibleDeleteView != 'NOT-DEFINED') {
                         currentVisibleDeleteView.visible = false;
                        }
                        if(Inch >= InchValue || osname == 'ipad' || osname == 'iphone') //mal iphone
                        {
                            e.source.children[0].children[5].visible = true;
                            currentVisibleDeleteView = e.source.children[0].children[5];
                         }
                         else{
                                 if(e.source.children[0].children.length == 14)
                                 {
                                       e.source.children[0].children[12].visible = true;
                                       currentVisibleDeleteView = e.source.children[0].children[12];
                                  }
                                  else
                                  {
                                      e.source.children[0].children[9].visible = true;
                                      currentVisibleDeleteView = e.source.children[0].children[9];
                                  }
                           }
                         
                         
                      } 
                    else if (e.source && e.source.objName !== 'table' && e.source.objName !== 'delete' && e.source.objName !== 'deleteView' && e.source.objName !== 'row' && e.source.objName != '' && e.source.objName != undefined  && e.source.objName != null)
                      {
                          if(e.source.objName != ' ')
                          {
                       if(currentVisibleDeleteView != 'NOT-DEFINED') {
                         currentVisibleDeleteView.visible = false;
                        }
                        if(Inch >= InchValue || osname == 'ipad') //bce-19 resolved and bce-8
                        {
                            e.source.children[5].visible = true;
                            currentVisibleDeleteView = e.source.children[5];
                         }
                         else{
                                 if(e.source.children.length == 14)
                                 {
                                       e.source.children[12].visible = true;
                                       currentVisibleDeleteView = e.source.children[12];
                                  }
                                  else
                                  {
                                      e.source.children[9].visible = true;
                                      currentVisibleDeleteView = e.source.children[9];
                                  }
                           }
                      }
                     }    
                  
                 }
			});
		}
	  else
	  {
	       section = [];
	       tableView.setData(section);
	  }
		var clickCount = 0;
		var swiped = 'none';	
		//Table view click event listner to open the miscue session page
		tableView.addEventListener('singletap',function(e){Ti.API.info('SearchPage' +e.source.objName);
		    if(e.source.objName == 'image')
		    {
		        
		    }
		    else
		    {
			if(e.source.objName != 'table' && e.source.objName != 'rowContainerView')
			{
				return;
			}
			if(currentVisibleDeleteView.visible == 1)
			{
				currentVisibleDeleteView.visible = false;
				currentVisibleDeleteView = 'NOT-DEFINED';
			}
			else if(e.source.objName != 'table'){
			if(currentVisibleDeleteView != 'NOT-DEFINED') {
		currentVisibleDeleteView.visible = false;
		currentVisibleDeleteView = 'NOT-DEFINED';
		}
		else{
		var isSessionBookPage = 'search';
		clickCount++;
		if(clickCount == 1)
		{
		var sessionGuid = e.source.id;
		var db = Titanium.Database.open('Miscue');
		var searchSessionRowClick = db.execute('SELECT * FROM MiscueSession WHERE sessionGuid=? AND userId = ?',sessionGuid,userId);
		var bookguid = searchSessionRowClick.fieldByName('bookGUID');
		
		db.close();
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//var sessionWindow = tt.ui.createSessionWindow(userName,sessionGuid,userId,token,bookguid,isSessionBookPage,menuItemKey);
		var sessionWindow = r_miscue.tt.ui.createSessionWindow(userName,sessionGuid,userId,token,bookguid,isSessionBookPage,menuItemKey);
		sessionWindow.open();
		miscueSearchWin.close();
        }
		}
		}//closing objName is table condition
		}
		}); 
			
		}
		//V1.9 SDK7 - Added export
		exports.createSearchFeild = createSearchFeild;
	
		//Function for submitting the pending session to server
		function createSubmitPendingSessionToServer(userId,token,miscueSearchWin,userName,menuItemKey,fontcolour,backcolour,pagefontfamily,isPageName,tableView, submitSession)
		{
  var cnt = 0,flag = 5;
            var sessionGUID = new Array( );
            var sessionDate = new Array( );
            var miscuesessionDate = new Array( );
            var learnerGUID = new Array( );
            var bookGUID = new Array( );
            var miscues = new Array( );
            var session_Id = new Array( );
            var notes = new Array( );
            var modalId = new Array( );
            var sessionStatus = new Array();
        var saveMiscue,flag = 5;
        var db = Titanium.Database.open('Miscue');
        var loginUserNameRow = db.execute('SELECT * FROM Login WHERE userid = ?',userId);
        var loginUserName = loginUserNameRow.fieldByName('username');
        loginUserNameRow.close();
        var base_URL = 'https://www.miscue.co.uk/iglooapi/apirequest.aspx';
        var miscueSaveSessionToServerRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND  (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,'null'); 
        var rowCount = miscueSaveSessionToServerRow.rowCount;
        if(rowCount > 0)
        {
         while (miscueSaveSessionToServerRow.isValidRow())
         {
          
           sessionStatus[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionStatus');
           sessionGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionGuid');
           db.execute('UPDATE MiscueSession SET isLastEditedSession = ? WHERE userId = ?','false',userId);
           //V1.9 SDK7 - Added r_sessionBookPage
           db.execute('UPDATE MiscueSession SET isSessionModified = ?,isLastEditedSession = ?,lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','false', 'true',r_sessionBookPage.createDate(), sessionGUID[cnt],userId);
          //db.execute('UPDATE MiscueSession SET isSessionModified = ?,isLastEditedSession = ?,lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','false', 'true',createDate(), sessionGUID[cnt],userId); 
            
           
          var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId, sessionGUID[cnt]);
        var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
          if(sessionStatus[cnt] == 'DRAFT')
                {
                   sessionStatus[cnt] = 'CREATED';
                 }
         sessionDate[cnt] = miscueSaveSessionToServerRow.fieldByName('sessiondate');
         learnerGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('learnerGuid');
         bookGUID[cnt] = miscueSaveSessionToServerRow.fieldByName('bookGUID');
         notes[cnt] = miscueSaveSessionToServerRow.fieldByName('sessionNotes');
         notes[cnt] = notes[cnt].replace(/&/gi,'&amp;');
         notes[cnt] = notes[cnt].replace(/</gi,'&lt;');
         notes[cnt] = notes[cnt].replace(/>/gi,'&gt;');
         notes[cnt] = notes[cnt].replace(/"/gi,'&quot;');
         //V1.9 SDK7 - added HomeScreen
         miscues[cnt] = r_HomeScreen.createMiscueXmlData(sessionGUID[cnt],userId);
         //miscues[cnt] = createMiscueXmlData(sessionGUID[cnt],userId);
         cnt++;
         miscueSaveSessionToServerRow.next();
        }
        audioFileExistCheckRow.close();
        db.close();
        var loopEnds = 'false';
        for(var x = 0; x < rowCount; x++)
        {
            if(x == (rowCount -1))
            {
                loopEnds = 'true';
            }
          saveMiscueXML = '<request><requesttype>SAVEMISCUE</requesttype><status>'+sessionStatus[x]+'</status><accesstoken>'+ token +'</accesstoken>' + '<sessionGUID>' + sessionGUID[x] + '</sessionGUID>' + '<sessionDate>'+ sessionDate[x] + '</sessionDate><learnerGUID>' + learnerGUID[x] + '</learnerGUID><bookGUID>' + bookGUID[x] + '</bookGUID><notes>' + notes[x]+ '</notes><miscues>' + miscues[x] + '</miscues> </request>';
          //V1.9 SDK7 - Added r_Apifile
          r_Apifile.createApi (base_URL,saveMiscueXML,loginUserName,userId,flag,miscueSearchWin,(x +1) ,sessionGUID[x],token,menuItemKey,fontcolour,backcolour,pagefontfamily,isPageName,tableView,rowCount,fileName, loopEnds, submitSession);
          //createApi (base_URL,saveMiscueXML,loginUserName,userId,flag,miscueSearchWin,(x +1) ,sessionGUID[x],token,menuItemKey,fontcolour,backcolour,pagefontfamily,isPageName,tableView,rowCount,fileName, loopEnds, submitSession);
        
        }   
         
        }
		}//Closing th function
		//V1.9 SDK7 - Added export
		exports.createSubmitPendingSessionToServer = createSubmitPendingSessionToServer;
			
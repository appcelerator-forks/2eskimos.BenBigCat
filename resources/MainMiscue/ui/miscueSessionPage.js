/*
 Ti.include(
'/MainMiscue/ui/notecontent.js'
    );*/
   
//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue.js'); 
   
var r_notecontent = require('/MainMiscue/ui/notecontent.js');
   
//1.9 SDK7 - Added 'require' for loadingScreen
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen'); 

//1.9 SDK7 - Added 'require' for styles
var r_styles = require('/MainMiscue/ui/styles');
	
//1.9 SDK7 - Added 'require' for HomeScreen
var r_HomeScreen = require('/MainMiscue/ui/HomeScreen');
	
//1.9 SDK7 - Added 'require' for loadingScreen
var r_Miscuedb = require('/MainMiscue/model/Miscuedb'); 
	
(function() 
{
	//1.9 SDK7 - Added r_miscue as tt is undefined
	//tt.ui.createSessionWindow = function(usrname,sessionGuid,userId,token,bookGuid,isSessionBookPage,menuItemKey, button_Id) {
    r_miscue.tt.ui.createSessionWindow = function(usrname,sessionGuid,userId,token,bookGuid,isSessionBookPage,menuItemKey, button_Id) 
    { 
    	//V1.8 BEN UPDATE - Added button_Id as a parameter so that it can be used to create a new instance of 'sessionBookPage'.
	    var osname = Ti.Platform.osname;
	    var  wid= Titanium.Platform.displayCaps.platformWidth;
	    var hght = Titanium.Platform.displayCaps.platformHeight;
	    var db = Titanium.Database.open('Miscue');
	    var homerow = db.execute('SELECT * FROM UserSetting where loginId =?',userId);
	    var schoolnames = homerow.fieldByName('schoolName');
	    var backpage = homerow.fieldByName('backPage');
	    var backcolour = homerow.fieldByName('backgroundColor');
	    var fontcolour = homerow.fieldByName('fontColor');
	    var pagefontfamily = homerow.fieldByName('charFont');
	    Ti.API.log("Font is  :: ", pagefontfamily);
	    var pagelogo = homerow.fieldByName('logos');
	    var sessionBackgroundImage = homerow.fieldByName('sessionPagebackgroundURL');
	    var dec = Ti.Utils.base64decode(schoolnames);
	    var accuracyLabel;
	    var slider;
	    var upImageView;
	    var downImageView;
	    var initialTextForAccuracyLabel;
	
		var animSpeed = 500; //MAL
	
	    homerow.close();
	    db.close();
	    //V1.9 SDK7 - Added r_loadingScreen
	    var iOS7 = r_loadingScreen.isiOS7Plus();
	    //var iOS7 = isiOS7Plus();
	    var sessionWin = Ti.UI.createWindow(
	    {
	    	navBarHidden:true,
	    	backgroundColor: 'white',
	        title: 'Miscue',
	        fullscreen:true  //mal
		});
	
	    if(iOS7 >= 7)
	    {
	    	sessionWin.top = '20dp';
	    }
		
		//V1.9 SDK7 - Added r_loadingScreen
		var screenBackgroundImage = r_loadingScreen.mainBackgroundImage(sessionBackgroundImage);
	    //var screenBackgroundImage = mainBackgroundImage(sessionBackgroundImage);
	    sessionWin.add(screenBackgroundImage[0]);
	
		//V1.9 SDK7 - Added r_loadingScreen
		var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
	    //var screenRes = backgroundImageHeightWidthPxToDp();
	    //V1.9 SDK7 - added r_loadingScreen
	    var Inch = r_loadingScreen.screenInch();
	    //var Inch = screenInch();
	
	    if(Inch < 6.8)
	    {
	    	screenBackgroundImage[1].height = screenRes[1];
	    }
	    else
	    {
	    	screenBackgroundImage[1].height = (osname == 'android')?screenRes[1] + 200 :screenRes[1] + 110;
	    }
	
	    screenBackgroundImage[1].width = screenRes[0];
	
	    if(Inch < 6.8 && osname == 'android')
	    {
	    	sessionWin.orientationModes = [Titanium.UI.PORTRAIT];
	    }
	    else if(osname != 'iphone' && Inch >= 6.8)
	    {
		    sessionWin.orientationModes = [Titanium.UI.PORTRAIT];
	    }
	    else if(osname == 'android')
	    {
	 	  	sessionWin.orientationModes = [Titanium.UI.PORTRAIT];
	    }
	
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
		//var learnerNameLabels = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
	    var learnerNameLabels = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,
	    {
		    top:(Inch >= 6.8)?'14dp':'5dp',
	        //V1.8 Ben UPDATE - Changed left value to center learner name
	        left:'24.5%',//'10dp',
	        color:fontcolour,
	        width:'39%',
	        ellipsize: true,
	        wordWrap: false,
	        backgroundColor:'transparent'
	    }));
	
	
		var deleteLocalizedText = 'Delete';
	    var db = Titanium.Database.open('Miscue');
	    db.execute('BEGIN');
	
	
	    var localizedTextRow = db.execute('SELECT * FROM Language WHERE labelId = ? AND userId = ?','Delete',usrname);
	    if(localizedTextRow.rowCount > 0)
	    {
	    	deleteLocalizedText = localizedTextRow.fieldByName('label');
	    }
	    localizedTextRow.close();
	    var miscueSessionRow = db.execute("SELECT * FROM UserBook T1,MiscueSession T2 WHERE T2.sessionGuid = ? AND T2.userId = ? AND T1.bookGuid = ?",sessionGuid,userId,bookGuid);
	
	    var audioName = miscueSessionRow.fieldByName('recordedAudioFilename');
	    var bookname = miscueSessionRow.fieldByName('bookName');
	    bookname = bookname.replace(/&quot;/gi,"'");
	    var encryptedBookContent = miscueSessionRow.fieldByName('bookContents');
	
	    //Getting and adding extraHTML content to html part
	    var extraHTML = miscueSessionRow.fieldByName('extraHTML');
	    extraHTML = Ti.Utils.base64decode(extraHTML);
	
	    var bookcontent = Ti.Utils.base64decode(encryptedBookContent);
	    var learnerguid = miscueSessionRow.fieldByName('learnerGuid');
	    var miscueAccuracy = miscueSessionRow.fieldByName('accuracyValue');
	    var sliderValues = miscueSessionRow.fieldByName('sliderValues');
	
	    var testSessionRow = db.execute("SELECT * FROM MiscueSession WHERE bookGUID = ? AND userId = ? AND learnerGuid = ?",bookGuid,userId,learnerguid);
	    var latestDbSliderValue = testSessionRow.fieldByName('sliderValue');
	    Ti.API.info('slider value got from DB at entry: '+latestDbSliderValue+' book guid '+bookGuid+ ': user id '+userId+ ' learner guid '+learnerguid);
	
	    var groupLearenrrow = db.execute('SELECT * FROM LearnerGroup G, Learner L WHERE L.groupGuid=G.groupGuid AND L.learnerGuid = ?',learnerguid);
	    var learnername = groupLearenrrow.fieldByName('learnerName');
	    var groupname = groupLearenrrow.fieldByName('groupName');
	    miscueSessionRow.close();
	    groupLearenrrow.close();
	    var isDeletedGroupLearnerBook = 'no';
	    var bookData = db.execute("SELECT U.bookGuid as ID,U.deleted as Deleted FROM UserBook U WHERE U.userId = ? AND U.bookGuid = ? and U.deleted = 'yes'",userId,bookGuid);
	    if(bookData.rowCount > 0)
	    {
	    	isDeletedGroupLearnerBook = 'yes';
	    }
	    else
	    {
		    var learnerData = db.execute("SELECT L.groupGuid as groupGuid,L.learnerGuid as ID,L.deleted as Deleted FROM Learner L WHERE L.learnerGuid = ? AND L.userId = ?",learnerguid,userId);
	        if(learnerData.rowCount == 0 || learnerData.fieldByName('deleted') == 'yes')
	        {
	    	    isDeletedGroupLearnerBook = 'yes';
	        }
	        else
	        {
	        	var groupData =  db.execute("SELECT G.groupGuid as ID,G.deleted as Deleted FROM LearnerGroup G WHERE G.loginUserId = ? AND G.groupGuid = ? AND G.deleted = 'yes'",userId,learnerData.fieldByName('groupGuid'));
	            if(groupData.rowCount > 0)
	            {
	            	isDeletedGroupLearnerBook = 'yes';
	            }
	            groupData.close();
	        }
	        learnerData.close();
	    }
	    if(isDeletedGroupLearnerBook == 'yes')
	    {
		    var labelArray = new Array();
	        labelArray['title']=['Alert','Alert'];
	        labelArray['message']=['group_Learner_Book_Delete_Message','Session cannot be modified as one or more of  group/learner/book is deleted'];
	        labelArray[1]=['Ok','Ok'];
	        //V1.9 SDK7 - Added r_HomeScreen
	        var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, usrname);
	        //var dialog = createLocalizedAlertDialog(labelArray, usrname);
	        dialog.show();
	    }
	    bookData.close();
	
	
	    db.execute('COMMIT');
	
	    db.close();
	    var bookcontentcount = bookname + ' ' + bookcontent;
	    bookcontentcount = bookcontentcount.replace(/\n/g, " ");
	    bookcontentcount = bookcontentcount.replace(/\s\s+/g, ' ');
	    bookcontentcount = bookcontentcount.trim();
	    bookcontentcount = bookcontentcount.split(" ");
	
	    //mal 175
	    var groupnamelabel = groupname.replace("&quot;", "'");
	
		//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for %%
		//var groupNamelabels = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
	    var groupNamelabels = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,
	    {
	    	text:groupnamelabel,
	    	//V1.8 Ben UPDATE - Changed left value so that it is in the center
	        left:'24.5%',
	        top:'40dp',
	        color:fontcolour,
	        width:'39%',
	        height:'40dp',
	        ellipsize: true,
	        wordWrap: false,
	        font: 
	        {
		        fontFamily:pagefontfamily,
	            fontSize:'17dp',
	            fontWeight:'bold'
	        },
	    }));
	
	    function createMiscueAccuracyLabel()
	    {
	    	//1.9 SDK7 - Added r_miscue as tt is undefined and r_styles for $$
	    	//var miscueaccuracylabels = Ti.UI.createLabel(tt.combine($$.boldHeaderText,{
	     	var miscueaccuracylabels = Ti.UI.createLabel(r_miscue.tt.combine(r_styles.$$.boldHeaderText,
	     	{
	        	left:'10dp',
	            top:'80dp',
	            color:fontcolour,
	            // text:'Accuracy:' + miscueAccuracy + '%',
				text:'', //MAL - remove accuracy
	            font: 
	            {
	            	fontFamily:pagefontfamily,
	                fontSize:'17dp',
	                fontWeight:'bold'
	            },
	        }));
	            return miscueaccuracylabels;
	    }
	
	    var accuracy_Label = createMiscueAccuracyLabel();
	
	    function createButton(pType)
	    {
	    	//V1.8 Ben UPDATE - Added these variables and a switch so that button is
	        //so that function can be reused
	
	    	var MyId;
	    	var MyImageField;
	    	var MyRight;
	
	    	switch(pType)
	    	{
	    		case 'back':
	    			MyId = 'backButton';
	    			MyImageField = 'backImageURL';
	    			MyRight = '85.5%';
	    			break;
	
	    		case 'save':
	    			MyId = 'saveButton';
	    			MyImageField = 'saveImageURL';
	    			MyRight = '1.5%';
	    			break;
	    	}
	
	        var backbuttonview = Ti.UI.createView(
	        {
	        	backgroundColor:'transparent',
	            top:'2%',
	            id:'backButton',
	            right:MyRight,
	            touchEnabled:true
	        });
	
	        if(Inch >= 6.8)
	        {
	        	backbuttonview.height =     '80dp';
	            backbuttonview.width = '90dp';
	        }
	        else
	        {
	        	backbuttonview.height = '45dp';
	            backbuttonview.width = '55dp';
	        }   
	
	        var db = Titanium.Database.open('Miscue');
	        var userSettingRow = db.execute('SELECT * FROM UserSetting where loginId =?',userId);
	
	        var backbutton = Ti.UI.createImageView(
	        {
	        	defaultImage:'/images/MISCUE_SAVE.png',
	            backgroundColor:'NONE',
	            height:Titanium.UI.SIZE,
	            id:MyId, //This is now a parameter (rather than hard coded)
	            width:Titanium.UI.SIZE,
	            color:fontcolour,
	            image:userSettingRow.fieldByName(MyImageField), //This is now a parameter (rather than hard coded)
	            touchEnabled:true
	        });
	
	        userSettingRow.close();
	        userSettingRow = null;
	        db.close();
	        db = null;
	        backbuttonview.add(backbutton);
	        return backbuttonview;
	    }    
	
	    //V1.8 Ben UPDATE - Added 'save' parameter. Changed saveBackButton variable to saveButton
		var saveButton = createButton('save');
	    sessionWin.add(saveButton);
	
	    //V1.8 Ben UPDATE - Added backButton
	    var backButton = createButton('back');
	    sessionWin.add(backButton);
	
	
	    //start of slider
	    function createSliderView()
	    {
			var sliderValuesArray = [];
			sliderValuesArray = sliderValues.split(",");
			Ti.API.info('lenght of slider value array ' + sliderValuesArray.length);
			if (latestDbSliderValue == null) 
			{
				initialTextForAccuracyLabel = sliderValuesArray[0];
			} 
			else 
			{
				initialTextForAccuracyLabel = latestDbSliderValue;
			}
	
			var minValue = 0;
	        slider = Ti.UI.createSlider(
	        {
	        	id:'accuracySlider',
	            bottom:(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)?'10%':'15%',
	            right:'10%',
	            left:'10%',
	            touchEnabled:true,
	            zIndex:101,
	            min:minValue,
	            max:(sliderValuesArray.length-1)*10,
	            value:0
	        });
	
	        if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-sliderValuesArray.length])
	        {
	        	slider.value = minValue;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-1)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-1))*10;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-2)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-2))*10;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-3)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-3))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-4)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-4))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-5)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-5))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-6)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-6))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-7)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-7))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-8)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-8))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-9)])
	        {
	        	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-9))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-10)])
	        {
	    	   	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-10))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-11)])
	        {
	           	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-11))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-12)])
	        {
	           	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-12))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-13)])
	        {
	           	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-13))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-14)])
	        {
	           	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-14))*10;;
	        }
	        else if(initialTextForAccuracyLabel == sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-15)])
	        {
	           	slider.value = (sliderValuesArray.length-(sliderValuesArray.length-15))*10;;
	        }
	    
	        var db = Titanium.Database.open('Miscue');
			var sessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND ( lastSavedToServerDate != ?)',userId,sessionGuid,'null');
			db.close();
				
			if (sessionCheckRow.rowCount > 0 || slider.value>0)
			{
				backButton.visible=false;
			}
	
	
			slider.addEventListener('stop', function(e) 
			{
				if (e.value == minValue || e.value < minValue+5) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-sliderValuesArray.length];
					slider.value = (sliderValuesArray.length-sliderValuesArray.length)*10;
				} 
				else if (e.value > minValue+5 && e.value < minValue+15) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-1)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-1))*10;
				} 
				else if (e.value > minValue+15 && e.value < minValue+25) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-2)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-2))*10;
				} 
				else if (e.value > minValue+25 && e.value < minValue+35) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-3)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-3))*10;;
				} 
				else if (e.value > minValue+35 && e.value < minValue+45) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-4)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-4))*10;;
				} 
				else if (e.value > minValue+45 && e.value < minValue+55) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-5)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-5))*10;;
				} 
				else if (e.value > minValue+55 && e.value < minValue+65) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-6)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-6))*10;;
				} 
				else if (e.value > minValue+65 && e.value < minValue+75) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-7)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-7))*10;;
				} 
				else if (e.value > minValue+75 && e.value < minValue+85) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-8)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-8))*10;;
				} 
				else if (e.value > minValue+85 && e.value < minValue+95) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-9)];//V1.8 Ben
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-9))*10;;
				} 
				else if (e.value > minValue+95 && e.value < minValue+105) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-10)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-10))*10;;
				} 
				else if (e.value > minValue+105 && e.value < minValue+115) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-11)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-11))*10;;
				} 
				else if (e.value > minValue+115 && e.value < minValue+125) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-12)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-12))*10;;
				} 
				else if (e.value > minValue+125 && e.value < minValue+135) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-13)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-13))*10;;
				} 
				else if (e.value > minValue+135 && e.value < minValue+145) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-14)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-14))*10;;
				} 
				else if (e.value > minValue+145) 
				{
					accuracyLabel.text = sliderValuesArray[sliderValuesArray.length-(sliderValuesArray.length-15)];
					slider.value = (sliderValuesArray.length-(sliderValuesArray.length-15))*10;;
				}
				var db = Titanium.Database.open('Miscue');
				var sessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND ( lastSavedToServerDate != ?)',userId,sessionGuid,'null');
				db.close();
					
				if (sessionCheckRow.rowCount > 0 || slider.value>0)
				{
					backButton.visible=false;
				}
				else
				{
					backButton.visible=true;
				}
			});
		    return slider;
		}
	
	    function createSliderLabel()
	    {
			accuracyLabel = Ti.UI.createLabel(
				{
	              id:'sliderLabel',
	              text:initialTextForAccuracyLabel,
	              bottom:(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)?'5%':'10%',
	              width:Titanium.UI.SIZE,
	              height:Titanium.UI.SIZE,
	              color:'purple'
	            });
	        return accuracyLabel;
	    }
	
	    function createUpImageView()
	    {
	    	upImageView = Ti.UI.createImageView(
	    	{
	    		  id:'upImageView',
	              bottom:(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)?'10%':'15%',
	              left:'4%',
	              width:'24dp',
	              height:'24dp',
	              image:'/images/sliderDown.png'
	    	});
	    	return upImageView;
	    }
	
	    function createDownImageView()
	    {
	    	downImageView = Ti.UI.createImageView(
	    	{
	    		id:'downImageView',
	            bottom:(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)?'10%':'15%',
	            right:'4%',
	            width:'24dp',
	            height:'24dp',
	            image:'/images/sliderUp.png'
	    	});
	    	return downImageView;
	    }
	
		var accuracySlider = createSliderView();
	    var accuracyLabel = createSliderLabel();
	    var upImageViewThumb = createUpImageView();
	    var downImageViewThumb = createDownImageView();
	    sessionWin.add(accuracySlider);
	    sessionWin.add(accuracyLabel);
	    sessionWin.add(upImageViewThumb);
	    sessionWin.add(downImageViewThumb);
	    //end of slider
	
	    function hex2rgb(hex, opacity)
	    {
	        var h=hex.replace('#', '');
	        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));
	        for(var i=0; i<h.length; i++)
	        h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);
	        if (typeof opacity != 'undefined')  h.push(opacity);
	        return 'rgba('+h.join(',')+')';
	    }
	
	    sessionWin.add(groupNamelabels);
	    sessionWin.add(learnerNameLabels);
	    sessionWin.add(accuracy_Label);
	    //var imageViews = imageLayout(usrname);///Calling image layout function to create imageview
	
	    //mal 175
	    var learnernamelabel = learnername.replace("&quot;", "'");
	
	    if(Inch >=6.8 || osname == 'ipad')
	    {
	        learnerNameLabels.font = {fontSize:'23dp',fontFamily:pagefontfamily,fontWeight:'bold'};
	        learnerNameLabels.text = learnernamelabel;
	        if(osname == 'android' && Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
	        {
	             learnerNameLabels.top = '10dp';
	             groupNamelabels.top = '30dp';
	             accuracy_Label.top = '60dp';
	        }
	    }
	    else
	    {
	    	groupNamelabels.top = '20dp';
	        accuracy_Label.top = '52dp';
	        learnerNameLabels.font = {fontSize:'15dp',fontFamily:pagefontfamily,fontWeight:'bold'};
	        groupNamelabels.font = {fontSize:'14dp',fontFamily:pagefontfamily,fontWeight:'bold'};
	        accuracy_Label.font = {fontSize:'14dp',fontFamily:pagefontfamily,fontWeight:'bold'};
	        learnerNameLabels.text = learnernamelabel;
	    }
	
	    var bookcontent = bookcontent.toString() ;
	    bookcontent = bookcontent.replace(/\r\n/gi," ");
	    bookcontent = bookcontent.replace(/( *\<br *\/> *)/gi," <br /> ");
	    bookcontent = bookcontent.replace(/(^\s*)|(\s*$)/gi,"");
	    bookcontent = bookcontent.replace(/[ ]{2,}/gi," ");
	    bookcontent = bookcontent.replace(/\n/g," ");
	    Ti.API.info('book content: '+bookcontent);
	
	    var val = bookcontent.split(' ').length;
	    Ti.API.info('val: '+val);
	    var titLength = bookname.split(' ').length;
	    var valss = bookcontent.split('<br />');
	    var ln = valss[0].length;
	    var contentOfBook = '';
	    var db = Titanium.Database.open('Miscue');
	
	    book_Name = bookname.split(" ");
	    var titleOfBook = '',index_texts;
	    var titleflag = false,titlecount = 0;
	    var z;
	
	    for(z = 0; z < book_Name.length; z++)
	    {
		    var s = z;
	        var miscueDatarowcount = db.execute('SELECT * FROM MiscueSessionItem WHERE miscueSessionId=? ',sessionGuid);
	        for(var k = 0; k < miscueDatarowcount.rowCount; k++)
	        {
	        	index_texts = miscueDatarowcount.fieldByName('indexofword');
	            var miscueMenuVal = miscueDatarowcount.fieldByName('miscueMenu');
	
	            if(titlecount == index_texts)
	            {
	            	var miscueTypeColorCheckRow = db.execute('SELECT * FROM miscueType WHERE userId = ? AND id = ?',userId,miscueMenuVal);
	                var colorCode = miscueTypeColorCheckRow.fieldByName('colour');
	                var miscueTypeBackgroundColor = hex2rgb(colorCode,0.3);
	                titleflag = true;
	                break;
	            }
	            miscueDatarowcount.next();
	            }
	            miscueDatarowcount.close();
	           	miscueDatarowcount = null;
	
	           	if(titleflag == true)
	            {
	                tittleSpan = ('<span id = ' + z + ' CLASS="heading" style = "border-radius:15px;word-break:break-all;display:inline-block;background-color:' + miscueTypeBackgroundColor +';color:' + colorCode + ';padding:10px 5px 10px 5px;word-spacing: normal;letter-spacing: normal;">')+book_Name[z]+('</span>&nbsp;');
	            }
	            else if(titleflag != true && titlecount <= book_Name.length) 
	            {
	         		tittleSpan = ('<span id = ' + z + ' CLASS="heading" style = "border-radius: 15px;color:')+ fontcolour +(';word-break:break-all; background-color:') +'transparent'+(';display:inline-block;padding:10px 5px 10px 5px;word-spacing: normal;letter-spacing: normal;">')+book_Name[z]+('</span>&nbsp;');
	        	}
	         	titleOfBook += tittleSpan;
	        	titlecount++;
	        	titleflag = false;
			}    
	
	        var count = 0, rowcnt, str1, n, miscueDatarow;
	        var strspan1;
	        for(var i = 0;i < val; i++)
	        {
	    	    var flag = false;
	            miscueDatarow = db.execute('SELECT * FROM MiscueSessionItem WHERE miscueSessionId=? ',sessionGuid);
	            rowcnt = miscueDatarow.rowCount;
	            //var str1 = bookcontent.split(" ");alert(str1);
	            str1 = bookcontent.replace( /\n/g, " " ).split( " " );
	            n = str1[i].length;
	
	            var strn = str1[i].substr(n-4,n);
	
	            var strnchar = str1[i].substr(0,2);
	
	            if(str1[i] == '<br' && str1[i+1] == '/>')
	            {
	                    str1[i] = str1[i] + ' ' + str1[i+1];
	                    str1[i] = str1[i].replace(str1[i], '<br>');
	            }
	
	            else if(str1[i] == '<br' && str1[i+1] != '/>' )
	            {
	            	var strlength = str1[i + 1].length;
	                var first_str = str1[i + 1].substr(0,2);
	
	                str1[i] = str1[i] + ' ' + first_str;
	
	                str1[i] = str1[i].replace(str1[i], '<br>');
	                var secondstr = str1[i + 1].substr(2,strlength);
	            }
	
	            var testingindex = str1.indexOf(str1[i]);
	            if(rowcnt >= 1)
	            {
	            	for(var l=0;l<miscueDatarow.rowCount;l++)
	                {
	                	var index_text = miscueDatarow.fieldByName('indexofword');
	                    var miscueMenuValue = miscueDatarow.fieldByName('miscueMenu');
	                    index_text = index_text - titLength;
	                    if(count == index_text)
	                    {
	                    	var miscueTypeColorCheckValueRow = db.execute('SELECT * FROM miscueType WHERE userId = ? AND id = ?',userId,miscueMenuValue);
	                        var colorCodeValue = miscueTypeColorCheckValueRow.fieldByName('colour');
	                        var miscueTypeBackgroundColorValue = hex2rgb(colorCodeValue,0.3);
	                        flag = true;
	                        miscueTypeColorCheckValueRow.close();
	                        break;
	                    }    
	                 	miscueDatarow.next();
	                }   
	                if(flag == true)
	                {  //miscueTypeBackgroundColorValue
	                    if(str1[i] == '<br>')
	                    {
	                    	strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style="border:2px;border-radius:15px;display: inline-block;background-color:' + miscueTypeBackgroundColorValue + ';padding:10px 5px 10px 5px;color: ' + colorCodeValue + ';word-spacing: normal;letter-spacing: normal;">')+str1[i]+('</span>&nbsp;');
	                    }
	                    else
	                    {
	                        strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style="border:2px;border-radius:15px;background-color:' + miscueTypeBackgroundColorValue + ';display:inline-block;padding:10px 5px 10px 5px;color:' + colorCodeValue + ';word-spacing: normal;letter-spacing: normal;" >')+str1[i]+('</span>&nbsp;');
	                    }
	                }
	                else
	                {  
	                    if(str1[i] == '/>')
	                    {}
	                    else if(str1[i-1] == '<br' && str1[i] != '/>')
	                    {
	                   		var secondstr1 = str1[i].substr(2,str1[i].length);
	                   		str1[i] = secondstr1;
	                   		strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = "border:2px;border-radius:15px;background-color:') +'transparent'+(';display:inline-block;padding:10px 5px 10px 5px;color:')+ fontcolour +(';word-spacing: normal;letter-spacing: normal;">')+str1[i]+('</span>&nbsp;');
	                   	}
	                   	else
	                   	{
		                    if(str1[i] == '<br>')
	                    	{
	                    		strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = color:')+ fontcolour +(';padding:0px 0px 0px 0px;word-spacing: normal;background-color:') +'transparent'+(';letter-spacing: normal;" >')+str1[i]+('</span>&nbsp;');
	                    	}
	                    	else
	                    	{
	                        	strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = "border:2px;border-radius:15px;display:inline-block;color:')+ fontcolour +(';padding:10px 5px 10px 5px;background-color:') +'transparent'+(';word-spacing: normal;letter-spacing: normal;" >')+str1[i]+('</span>&nbsp;');
	                     	}
	                    }
	                }
				}
	            else
	            {
	        	    if(str1[i] == '/>')
	                {
	
	                }
	                else if(str1[i-1] == '<br' && str1[i] != '/>')
	                {
	                    var secondstr1 = str1[i].substr(2,str1[i].length);
	                    str1[i] = secondstr1;
	                    strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = "border:2px;border-radius:15px;word-spacing: normal;letter-spacing: normal;background-color:') +'transparent'+(';display:inline-block;color:')+ fontcolour +(';padding:10px 5px 10px 5px;">')+str1[i]+('</span>&nbsp;');
	                }
	                else
	                {
	                if(str1[i] == '<br>')
	                {
	                	strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = "border:2px;border-radius:15px;word-spacing: normal;letter-spacing: normal;background-color:') +'transparent'+(';padding:10px 5px 10px 5px;">')+str1[i]+('</span>&nbsp;');
	                }
	                else
	                {
	            	    strspan1 = ('<span id= ' + (i + z) + '  CLASS="text" style = "border:2px;border-radius:15px;word-spacing: normal;letter-spacing: normal;background-color:') +'transparent'+(';display:inline-block;color:')+ fontcolour +(';padding:10px 5px 10px 5px;" >')+str1[i]+('</span>&nbsp;');
	                }
	            }   
			}
	
	        contentOfBook += strspan1;
	        count++;
	        miscueDatarow.close();
	        miscueDatarow = null;
	    }
	
	    db.close();
	
	    ///creating last modief date
	    function createLastModifiedDate()
	    {
	    	var lastmodifiedDate = new Date();
	        lastmodifiedDate = lastmodifiedDate.toISOString();
	        return lastmodifiedDate;
	    }
	
	    var htmlContents = createhtml(contentOfBook,titleOfBook);
	    function createhtml(bookContent,bookTitle)
	    {
	        var html = '<!DOCTYPE html><html ID = "htmlTap"><head>';
	        html +='<meta http-equiv="Content-Type" content="text/html";charset="utf-8" >';
	        html += '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>';
	        html += '<style type="text/css">.Highlites {background-color:#808080;} .DeHighlites {background-color: ;}.extraHtmlBox {word-break:break-all;word-spacing: -5px;letter-spacing: -5px;width:98%; padding:2%; line-height:normal;}  .box{word-break:break-all;word-spacing: -5px;letter-spacing: -5px;width:98%; padding:2%; line-height:normal;} body{font-family: Arial;-webkit-user-select:none; -webkit-touch-callout: none; font-size:1.5em;width:96%;background-color:backcolour;} html{  -webkit-user-select: none;-webkit-touch-callout: none;-webkit-text-size-adjust : none; text-size-adjust: none;}';
	        html += '</style>';
	
	
	        html += '<script src="MainMiscue/ui/JqueryPlugin.js.bug"></script>';
	        html +='<script>function fontsize(size){';
	        html +='$("body").css("font-size", size);';
	        html +='}';
	        html +=' function addBackgroundcolor(singletapvals,col){';
	
	        html += "function hex2rgb(hex, opacity) { var h=hex.replace('#', '');";
	        html += "h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g')); for(var i=0; i<h.length; i++)";
	        html += "h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16); if (typeof opacity != 'undefined')  h.push(opacity);";
	        html += "return 'rgba('+h.join(',')+')';}";
	        html += "var colour = hex2rgb(col,0.3);";
	
	        html += "$( 'span' ).eq( singletapvals ).css('background',colour);";
	        html += "$( 'span' ).eq( singletapvals ).css('color',col);";
	        html += "$('span').eq(singletapvals).css('border-radius','15px');";
	        html +='}';
	
	        html +=' function singleTapBackgroundColor(singletapval,backcolour,fontcolour){';
	
	        html += "$( 'span' ).eq( singletapval ).css('background',fontcolour);";
	        html += "$( 'span' ).eq( singletapval ).css('color',backcolour);";
	        html += "$('span').eq(singletapval).css('border-radius','1px');";
	        html +='}';
	
	        html +=' function winrefresh(singletapval,backcolour,fontcolour){';
	
	        html += "$( 'span' ).eq( singletapval ).css('background','transparent');";
	        //html += "$('span').eq(singletapvals).css('border','2px');";
	        html += "$( 'span' ).eq( singletapval ).css('color', fontcolour);";
	        html +="$( 'span' ).eq( singletapval ).removeClass( 'Highlites' );";
	        html +="$( 'span' ).eq( singletapval ).addClass( 'DeHighlites' );";
	        html +='}';
	
	        html +='(function($) {';
	        html +=' $(document).ready(function() {';
	        html += 'i=0;';
	        html += "windowHeight = $(window).height();";
	        html += 'var heightWindow = windowHeight;';
	        html += "$('html').css('height', '90%');";
	        html += "$('body').css('min-height', '100%');";
	        html += 'document.getElementById("txt").style.left="1px";';
	        html +="$('span').click(function(event) {";
	
	        html += 'var classs = event.target.id+" and "+$(event.target).attr(';
	        html += "'class');";
	        html += 'var spanId = event.target.id;';
	        html += 'var spanBackgroundColor = document.getElementById(spanId).style.backgroundColor;';
	
	        html += 'var Color = document.getElementById(spanId).style.color;';
	
	        html += "if(spanBackgroundColor != 'transparent'){";
	        html += "if(Color != ''){";
	        html += "var offsets = document.getElementById(spanId).getBoundingClientRect();";
	        html += 'Ti.App.fireEvent';
	        html +="('app:single', {spanIndex:spanId,spanbackColor: spanBackgroundColor,scrollEnd:'true'});}}";
	        html += 'else if(spanBackgroundColor == "transparent") {';
	
	        html +="var indexOfWord = event.target.id;var selectedWord = document.getElementById(indexOfWord).innerText;";
	        html += 'var spanBackgroundColor = document.getElementById(indexOfWord).style.backgroundColor;';
	
	        html += "if(Color != ''){";
	        html += 'var spanId = event.target.id;';
	        html += "var offsets = document.getElementById(spanId).getBoundingClientRect();";
	        html += 'var miscueMenuLeftPosValue = offsets.left;';
	
	        html += 'Ti.App.fireEvent';
	        html +="('app:long', {data: selectedWord,spanIndex:indexOfWord,miscueMenuLeftValue:miscueMenuLeftPosValue,spanbackColor: spanBackgroundColor,scrollEnd:'true'});";
	        html += '}}';
	        html += "});";
	        html += '});})(window.jQuery);';
	        html +='</script></head>';
	        html +='<body ID="newtext2" style="padding-bottom:12%;  -webkit-user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; -moz-user-select: none; -ms-user-select: none; user-select: none;">';
	        html += "<h2  id='heading'";
	        html += 'style="word-break:break-all;font-size:2em;word-spacing: -6px;letter-spacing: -6px;">';
	        html += bookTitle;
	        html += '</h2>';
	        html += '<div id="txt" class="box">';
	        html +=bookContent;
	        html +='</div > <br /><br />';
	        //MAL - remove break style - html += '<span style="word-break:break-all;font-size:1em;word-spacing: 5px;letter-spacing: normal; line-height: 50px;display:inline-block;padding:10px 15px 10px 15px;">';
	        html += '<span style="font-size:1em;word-spacing: 5px;letter-spacing: normal; line-height: 50px;display:inline-block;padding:10px 15px 10px 15px;">';
	        html += extraHTML;
	        html += "</span>";
	        html +='</body></html>';
	
	        //MAL  Ti.API.info('fullhtml '+html);
	
	     	return html;
		}
	
	    var webviewcontainer = Ti.UI.createView(
	    {
	    	backgroundColor:'transparent',
	        width:'100%',
	        height:'100%',
	    });
	
	    var sessionwebview = Ti.UI.createWebView(
	    {
	    	backgroundColor:'transparent',
	        width:'100%',
	        height:(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)?'70%':'50%',
	        enableZoomControls:false
	    });
	    
	    // if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
	    // sessionwebview.height = '50%';
	    // slider.bottom ='15%';
	    // upImageView.bottom = '15%';
	   	// downImageView.bottom = '15%';
	   	// accuracyLabel.bottom='10%';
	
	   	// webviewcontainer.addEventListener('touchstart',function(e){
	  	// Ti.API.info('bottommenuMainView.rect.y '+bottommenuMainView.rect.y);
	    // Ti.API.info('webviewcontainer y'+webviewcontainer.rect.y);
	    // Ti.API.info('webviewcontainer.getRect().height '+webviewcontainer.getRect().height);
	    // Ti.API.info('sessionwebview y '+sessionwebview.rect.y);
	    // Ti.API.info('upImageView y'+upImageView.rect.y);
	    // Ti.API.info('webview height '+sessionwebview.getRect().height);
	    // Ti.API.info('e.y '+e.y);
	    // if(e.y > bottommenuMainView.rect.y){
	    // upImageView.visible=true;
	    // downImageView.visible=true;
	    // slider.visible=true;
	    // accuracyLabel.visible=true;
	    // }else{
	    // upImageView.visible=false;
	    // downImageView.visible=false;
	    // slider.visible=false;
	    // accuracyLabel.visible=false;
	    // }
	    // });
	
	    var bottomMenuBottomDownValue = -45, bottomMenuBottomUpValue, bottommenuMainViewWidth = Ti.Platform.displayCaps.platformWidth;
	    if(Inch >= 6.8)
	    {
	    	bottomMenuBottomDownValue = -75;
	    }
	
	    var bottommenuMainView = Ti.UI.createView(
	    {
	    	height:(Inch >= 6.8)?'110dp':'70dp',
	        //width:'95%',
	        bottom:bottomMenuBottomDownValue,
	        backgroundColor:'transparent'
	    });
	   	convertFromPxToDp();
	
	    function convertFromPxToDp()
	    {
	    	if(osname == 'android')
	        {
	        	bottommenuMainViewWidth = Ti.Platform.displayCaps.platformWidth;
	            bottommenuMainViewWidth = (bottommenuMainViewWidth / (Titanium.Platform.displayCaps.dpi / 160));
	            bottommenuMainView.width = bottommenuMainViewWidth;
	        }
	        else
	        {
	        	bottommenuMainViewWidth = Ti.Platform.displayCaps.platformWidth;
	            bottommenuMainView.width = bottommenuMainViewWidth;
	            if(osname == 'iphone')
	            {
	                bottommenuMainView.width = Ti.Platform.displayCaps.platformWidth;
	            }
	        }
	    }
	
	    var toolbarShowButton = Ti.UI.createButton(
	    {
	    	top:0,
	        height:(Inch >= 6.8)?'35dp':'25dp',
	        width:(Inch >= 6.8)?'150dp':'120dp',
	        backgroundImage: '/images/phase5/SHOWMENU.png',
	        backgroundColor:'transparent',
	    });
	
	
	    if(Inch >= 6.8 && osname == 'android')
	    {
	        webviewcontainer.top = '120dp';
	        sessionwebview.top = '0dp';
	    }
	    else if(osname == 'ipad')
	    {
	        webviewcontainer.top = '130dp';
	        sessionwebview.top = '0dp';
	    }
	    else
	    {
	        webviewcontainer.height = '90%';
	        webviewcontainer.top = '98dp';
	        sessionwebview.top = '1%';
	    }
	    if(Ti.Platform.osname == 'android')
	    {
	    sessionwebview.addEventListener('longclick',function(){ return false;});
	    sessionwebview.addEventListener('longpress',function(){return false;});
	    }
	
	    webviewcontainer.add(sessionwebview);
	
	
	
	    sessionWin.add(webviewcontainer);
	    sessionwebview.html = htmlContents;
	    var actInd = Titanium.UI.createActivityIndicator();
	    webviewcontainer.addEventListener('beforeload',function()
	    {
	    	actInd.message = 'Loading...';
	    	//webviewcontainer.add(actInd);
	    	if(osname == 'android')
	    	{
	    		//actInd.show();
	    	}
	    });
	
	    sessionwebview.addEventListener('load',function()
	    {
	    	//actInd.hide();
	    	Ti.API.info('call on orientation chaneg');
	    });
	
	    var singleTapWindowCount = 0;
	
	     //Status bar
	    var menuBarView = Ti.UI.createWindow(
	    {
	    	backgroundColor:'white',
	        bottom:0,
	        width:'100%',
	        visible:false //MAL v172 - inisially visibla?
	    });
	
	    var bottomMenu = Ti.UI.createView(
	    {
	    	top:(Inch >= 6.8)?'34dp':'25dp',
	        width:'100%',
	        height:(Inch >= 6.8)?76:45,
	        backgroundColor:'white',
	        backgroundImage:'/images/phase5/MENUBACKGROUND.png'
	    });
	
	    var menubarbutton = Ti.UI.createView(        //MAL was label? - seemed to be too high even when small height set
	    {      
	    	backgroundColor:'#c2d7e1',
	        top:0,
	        height:'5%',
	        width:'100%',
	    });
	
	
		var notesbuttonview = Ti.UI.createView(
		{
	    	backgroundColor:'transparent',
	        bottom:'5dp',
	        height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15,
	        right:'2%',
	    });
	
	    var notesbutton = Ti.UI.createImageView(
	    {
	    	backgroundColor:'transparent',
	        height:Titanium.UI.FILL,
	        width:Titanium.UI.FILL,
	        image:'/images/phase5/EDITNOTES.png',
	        touchEnabled:false
	    });
	
	    var zoomin = Ti.UI.createImageView(
	    {
	    	backgroundColor:'transparent',
	        height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15,
	        left:'0%',
	        image:'/images/phase5/MAGNIFYPLUS.png'
	    });
	    
	    var zoomout = Ti.UI.createImageView(
	    {
	    	height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15,
	        left:zoomin.width + 5,
	        image:'/images/phase5/MAGNIFYMINUS.png'
	    });
	
	    var recordView = Ti.UI.createView(
	    {
	    	backgroundColor:'transparent',
	        bottom:'5dp',
	        height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15
	        //width:(osname == 'android')?bottomMenu.height - 10:bottomMenu.height,
	    });
	
	    var recordImage = Ti.UI.createImageView(
	    {
	    	backgroundColor:'transparent',
	        height:Titanium.UI.FILL,
	        width:Titanium.UI.FILL,
	        image:'/images/phase5/RECORD.png'
	    });
	
	
	    var playView = Ti.UI.createView(
	    {
	    	backgroundColor:'transparent',
	        bottom:'5dp',
	        height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15,
	        visible:false,
	        touchEnabled:false,
	        left:(osname == 'iphone')?'51%':'49.5%',
	    });
	
	    if(osname == 'android')
	    {
	    	playView.left = '50.5%';
		}
	
	    var playImage = Ti.UI.createImageView(
	    {
	    	backgroundColor:'transparent',
	        height:Titanium.UI.FILL,
	        width:Titanium.UI.FILL,
	        image:'/images/blurPlay.png'
	    });
	
	    var stopPlaybackView = Ti.UI.createView(
	    {
	    	backgroundColor:'transparent',
	        bottom:'5dp',
	        height:bottomMenu.height - 15,
	        width:bottomMenu.height - 15,
	        //width:(osname == 'android')?bottomMenu.height - 10:bottomMenu.height,
	        left:(osname == 'iphone')?'50%':'49.5%',
	        visible:false,
	    });
	
	    var stopPlaybackImage = Ti.UI.createImageView(
	    {
	    	backgroundColor:'transparent',
	        height:Titanium.UI.SIZE,
	        width:Titanium.UI.SIZE,
	        right:'0%',
	        image:'/images/stopPlayback.png'
	    });
	
	    bottomViewConfigOnOrientationMode();
	
		//start
	    //start
	    if (osname == 'iphone' || osname == 'ipad') 
	    {
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
		}
		else
		{
			screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
		}
	
		screenBackgroundImage[1].width = screenRes[0];
	
		if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) 
		{
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
			if (Inch >= InchValue) 
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
			}
		}
	    //end
	    //end
	
	    function bottomViewConfigOnOrientationMode()
		{
	    	//V1.9 SDK7 - Added r_loadingScreen
	     	var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
	        //var screenRes = backgroundImageHeightWidthPxToDp();
	        if(Inch < 6.8)
	        {
	            screenBackgroundImage[1].height = screenRes[1] + 130;
	        }
	        else
	        {
	            screenBackgroundImage[1].height = (osname == 'android')?screenRes[1] + 200 :screenRes[1] + 110;
	        }
	        screenBackgroundImage[1].width = screenRes[0];
	        if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
	        {
	        	if(Inch >= 6.8)
	            {
	            	learnerNameLabels.top = '14dp';
	             	groupNamelabels.top = '42dp';
	             	accuracy_Label.top = '80dp';
	            }
	            recordView.left = (osname == 'iphone')?'35.5%':'39.5%';
	
	            if(Ti.App.Properties.getString('isAudioPlayingProcess') == 'true')
	            {
	            	playView.left = '37.5%';
	            }
	        }   
	        else
	        {
	        	if(osname == 'android' && Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight)
	            {
	            	learnerNameLabels.top = '8dp';
	                groupNamelabels.top = '30dp';
	                accuracy_Label.top = '60dp';
	            }
	            recordView.left = '42%';
	            if(Ti.App.Properties.getString('isAudioPlayingProcess') == 'true')
	            {
	            	playView.left = '41%';
	            }
	        }   
		}
	
		stopPlaybackView.add(stopPlaybackImage);
	    playView.add(playImage);
	    //moved recodimage v17 mal
	    bottomMenu.add(playView);
	    bottomMenu.add(recordView);
	    bottomMenu.add(stopPlaybackView);
	
	    bottomMenu.add(zoomout);
	    bottomMenu.add(zoomin);
	    //bottomMenu.add(menubarbutton);
	    notesbuttonview.add(notesbutton);
	    bottomMenu.add(notesbuttonview);
	
	    bottommenuMainView.add(bottomMenu);
	
	
	   	var isRecordStarted = 'false';
	    //Checking audio file is exists or not for playback(Resume and search session)
	    var db = Titanium.Database.open('Miscue');
	    var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ? AND sessionStatus != ?",userId,sessionGuid,'DELETED');
	    Ti.API.info("---------- BEN - SELECT * FROM MiscueSession  WHERE userId = " + userId + " AND sessionGuid = " + sessionGuid + " AND sessionStatus != DELETED");
	    Ti.API.info("---------- BEN - " + audioFileExistCheckRow.count + " row(s) were returned");
	    
	    for(var i = 0; i < audioFileExistCheckRow.fieldCount; i++)
	    {
	    	Ti.API.info("----------Ben - " + audioFileExistCheckRow.fieldName(i) + " = "+ audioFileExistCheckRow.field(i));
	    }
	    
	    var file = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
	    Ti.API.info("---------- BEN!!! 1275 audioFile = " + file);
	    if(file != 'null')
	    {
	    	isRecordStarted = 'true';
	        sound = Titanium.Media.createSound(
	        {
	        	volume:1.0,
	            allowBackground:true
	        });
	   
	        if(osname != 'android')
	        {
	   	    	file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,file);
	            if (file.exists()==false)
	            {
	            	Ti.API.info("---------- BEN!!! audioFile was lost! recordedAudioFilename will be set to null in the database!");
	            	//v177 mal
	               	//if the file is lost (from the old temporary folder bug), then remove it from the db
	               	alert('The audio file could not be loaded');
	               	
	               	db.execute("UPDATE MiscueSession set recordedAudioFilename='null'  WHERE userId = ? AND sessionGuid = ? AND sessionStatus != ?",userId,sessionGuid,'DELETED');
	
	               	file='null';
	            }
	            else
	            {
	            	sound.url = file;
	            	Ti.API.info("---------- BEN!!! audioFile was found! Url = " + sound.url);
	            }
	        }
	        else
	        {
	        	//V1.9 SDK7 - Changed to applicationDataDirectory
	        	//var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
	            file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, file);
	            sound.url = file.nativePath;
	        }
	
	        //only do this if the file is still present v177
	        if(file != 'null')
	        {
	      	 	playView.visible = true;
	         	playView.touchEnabled = true;
	         	playImage.image = '/images/phase5/PLAY.png';
	        }
	
		}
		else
		{
			Ti.API.info("---------- BEN!!! audioFile was null!");
		}
	    audioFileExistCheckRow.close();
	    db.close();
	
	    var interval;
	
	    // Function for flash record
	    function flashRecord()
	    {
	        if(recordView.visible == true)
	        {
	            recordView.visible = false;
	        }
	        else
	        {
	            recordView.visible = true;
	        }
	    }
	
	    Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
	
	    Ti.API.log('Adding listener: '+ Titanium.Platform.name);
	    //audio record function for
	
	    //v1.71 Mal changed OS name
	    if (Titanium.Platform.name !='android')
	    {
	    	Titanium.Media.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
	       	var recording = Ti.Media.createAudioRecorder();
	       	recording.compression = Ti.Media.AUDIO_FORMAT_AAC;
	        recording.format = Titanium.Media.AUDIO_FILEFORMAT_MP4;
	        Ti.Media.addEventListener('recordinginput', function(e) 
	        {
	        	if (!e.available && recording.recording) 
	        	{
	            	recordView.fireEvent('click', {});
	            }
	        });
	
	
	        var  timer, sound,newFile, recordedFileName = 'null';
	        //EventListner to record a audio
	        Ti.API.log('Adding listener1');
	    	recordImage.addEventListener('click', function()
	    	{
	    		Ti.API.log('Starting record '+recordImage.image);
	        	if (recordImage.image == '/images/phase5/RECORDFLASHING.png')
	        	{
	            	file = recording.stop();
	
	
	            	recordView.visible = true;
	            	playView.visible = true;
	            	clearInterval(interval);
	             	recordedFileName = file.getName();
	             	playView.visible = true;
	
	            	if (Ti.Platform.osname != 'android') 
	            	{
	            		//MAL - save this file in the app data directory
	            		var permFileName = sessionGuid+'_'+file.getName();
	            		var permFile = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, permFileName);
	            		permFile.write(file.read);
	            		recordedFileName=permFileName;
	
	            		//assign the file var to be this new file
	
	            		file=permFile;
	            		//alert(recordedFileName);
	            	}
	
	             	//Updating recorded audio file
	            	var db = Titanium.Database.open('Miscue');
	            	Ti.API.info("---------- BEN - recordedAudioFilename is being set on the database!!! recordedFileName = '" + recordedFileName + "'");
	            	db.execute('UPDATE MiscueSession SET recordedAudioFilename =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?',recordedFileName,createLastModifiedDate(),'true','true',userId,sessionGuid);
	            	db.close();
	
	
			        //Creating sound media player
	            	Titanium.Media.setOverrideAudioRoute(Titanium.Media.AUDIO_SESSION_OVERRIDE_ROUTE_SPEAKER);
	              	sound = Titanium.Media.createSound(
	              	{
	                	url:file,
	                    volume:1.0,
	                    allowBackground:true
	            	});
	            	
	            	playImage.image = '/images/phase5/PLAY.png';
	            	recordImage.image  = '/images/phase5/RECORD.png';
	            	playView.touchEnabled = true;
	            	clearInterval(timer);
	            	Ti.Media.stopMicrophoneMonitor();
				}
	        	else if(recordImage.image == '/images/phase5/RECORD.png')
	        	{
	            	Titanium.Media.setAudioSessionMode(Ti.Media.AUDIO_SESSION_MODE_RECORD);
	            	file = null;
	            	isRecordStarted = 'true';
	            	playView.touchEnabled = false;
	            	stopPlaybackView.visible = false;
	            	recordImage.image  = '/images/phase5/RECORDFLASHING.png';
	            	playView.visible = false;
	            	interval = setInterval(flashRecord, 500);
	            	recording.start();
	            	Ti.Media.startMicrophoneMonitor();
	            	duration = 0;
	        	}
	        	else
	        	{
	        		Ti.API.log('Record problem');
	            	if (!Ti.Media.canRecord) 
	            	{
	            		Ti.UI.createAlertDialog(
	            		{
	            			title:'Error!',
	            			message:'No audio recording hardware is currently connected.'
	            		}).show();
	             		
	             		return;
	            	}
	        	}
	    	});
	
	
	    	//Event listner to play the recorded audio
	    	playImage.addEventListener('click', function()
	    	{
		    	if (sound && sound.playing)
		    	{
		        	sound.pause();
		        	playImage.image  = '/images/phase5/PLAY.png';
		        	recordImage.image = '/images/phase5/RECORD.png';
		        	recordView.touchEnabled = false;
		        	stopPlaybackView.visible = true;
		        	recordView.visible = false;
		    	}
		    	else
		    	{
		      		sound.addEventListener('complete', function()
		        	{
		            	Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
		            	playImage.image =  '/images/phase5/PLAY.png';
		            	recordImage.image = '/images/phase5/RECORD.png';
		           		recordView.touchEnabled = true;
		           		stopPlaybackView.visible = false;
		            	recordView.visible = true;
		            	playView.left = (osname == 'iphone')?'51%':'49.5%';
		        	});
		        
		        	if ( file.exists() )
		         	{
		            	Ti.Media.defaultAudioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAYBACK;
		                sound.play();
		                Ti.App.Properties.setString('isAudioPlayingProcess', 'true');
		                playImage.image =  '/images/phase5/PAUSE.png';
		                recordImage.image = '/images/blurRecord.png';
		                recordView.touchEnabled = false;
		                stopPlaybackView.visible = true;
		                recordView.visible = false;
		                if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
		                {
		                	playView.left = (osname == 'iphone')?'35.5%':'39.5%';
		                }
		                else
		                {
		                	playView.left = '42%';
		                }
		
					}
		    	}
	    	});
	
		    stopPlaybackView.addEventListener('click',function(e)
		    {
		    	sound.stop();
		        Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
		        playImage.image  = '/images/phase5/PLAY.png';
		        recordImage.image = '/images/phase5/RECORD.png';
		        recordView.touchEnabled = true;
		        stopPlaybackView.visible = false;
		        recordView.visible = true;
		        playView.left = (osname == 'iphone')?'51%':'49.5%';
		    });
		}
	
	
	    //Audio record function for android
	    if(osname == 'android')
	    {
	    	var path='';
	        //calling android native third party library for audio record
	        
	        //V1.9 SDK7 - Audio recorder is deprecated
	        //var audioRecorder = require('titutorial.audiorecorder');
	        var newAudioRecorder = Ti.Media.createAudioRecorder(); //audioFileExistCheckRow.fieldByName('recordedAudioFilename');
	        
	        var audioFile,isRecordStarted = 'false';
	        //Event listner for recording the audio
	        recordImage.addEventListener('click', function(e)
	        {
	        	Ti.API.info("Record image was clicked");
	        	
	            if (recordImage.image == '/images/phase5/RECORD.png')
	            {
	            	Ti.API.info("---------- BEN - I am starting the recording...");
					interval = setInterval(flashRecord, 500);
	                playView.visible = false;
	                var recordCount =   sessionGuid.substr(sessionGuid.length - 12,sessionGuid.length);
	                path  = learnername + '-' + recordCount;
	                isRecordStarted = 'true';
	                       
	                    
	                newAudioRecorder.start();
	                    
	                    
	                /*
	                * var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
	                audioFile = Ti.Filesystem.getFile(audioDir.resolve(), e.fileName);
	                file = audioFile;
	                * 
	                * 
	                * 
	                * 
	                * 
	                */
	                    
	                //V1.9 SDK7 - Audio recorder is deprecated
	                /*
	                audioRecorder.startRecording({
	                outputFormat : audioRecorder.OutputFormat_MPEG_4,
	                audioEncoder : audioRecorder.AudioEncoder_AAC,
	                directoryName : "Miscue",
	                fileName : path,
	                maxFileSize : 700000,
	                success : function(e) {
	                fileName =  e.fileName;
	                var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
	                audioFile = Ti.Filesystem.getFile(audioDir.resolve(), e.fileName);
	                file = audioFile;
	                var db = Titanium.Database.open('Miscue');
	                db.execute('UPDATE MiscueSession SET recordedAudioFilename =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?',audioFile.getName(),createLastModifiedDate(),'true','true',userId,sessionGuid);
	                db.close();
	                // Creating audio player
	                sound = Ti.Media.createAudioPlayer({
	                allowBackground : true,
	                url : audioFile.nativePath
	                });
	                //audioPlayer.
	                },
	                error : function(d) {
	                alert("error => " + e.message);
	                }
	                });*/
	                 
	                recordImage.image = '/images/phase5/RECORDFLASHING.png';
	                playView.touchEnabled = false;
	                isRecordStarted = 'true';
				}
	            else
	            {               
	            	Ti.API.info("---------- BEN - I am stopping & saving the recording..."); 	
	            	clearInterval(interval);
	                interval = null;
	                recordView.visible = true;
	                playView.visible = true;
	                //V1.9 SDK7 - audioRecorder module deprecated
	                //audioRecorder.stopRecording();
	                 
	                //V1.9 SDK7 - Added new stop function
	                file = newAudioRecorder.stop();
	                
	                Ti.API.info("---------- BEN - The recording has been saved to the cache: " + file.nativePath);
	                
	                var temp = file.nativePath.split("/");
	                var tempFileName = temp[temp.length - 1];
	                
	                //Ti.API.info("---------- BEN - Ti.Filesystem.applicationCacheDirectory = " + Ti.Filesystem.applicationCacheDirectory);
	                
	                
	                //V1.9 SDK7 new implementation of audioPlayer
	                sound = audioPlayer = Ti.Media.createAudioPlayer(
	                {
	    				url: file.nativePath
	    				//url: newFileDirectory
	  				});
	                    
	                recordImage.image = '/images/phase5/RECORD.png';
	                playView.visible = true;
	                playView.touchEnabled = true;
	                playImage.image = '/images/phase5/PLAY.png';
	            }
	        });
			
			//V1.9 SDK7 - Added isPlaying
			var isPlaying = false;
	        //Event listner to play the audio
	        playImage.addEventListener('click', function()
	        {
	        	//V1.9 SDK7 - Added new implementation of audio player
	         	
	  			//V1.9 SDK7 - Doesn't work
	            //if (sound && sound.audioPlaying)
	            if(isPlaying == true)
	            {
	            	//V1.9 SDK7 - Added isPlaying
	             	isPlaying = false;
	                sound.pause();
	                playImage.image  = '/images/phase5/PLAY.png';
	                recordImage.image = '/images/phase5/RECORD.png';
	                recordView.touchEnabled = false;
	                stopPlaybackView.visible = true;
	                recordView.visible = false;
	            }
	            else
	            {
	            	//if(audioFile.exists())
	                //{
	                //V1.9 SDK7 - Added isPlaying
	                isPlaying = true;
	                sound.start();
	                Ti.App.Properties.setString('isAudioPlayingProcess', 'true');
	                playImage.image =  '/images/phase5/PAUSE.png';
	                recordImage.image = '/images/blurRecord.png';
	                recordView.touchEnabled = false;
	                stopPlaybackView.visible = true;
	                recordView.visible = false;
	                if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
	                {
	                	playView.left = '39.5%';
	                }
	                else
	                {
	           	    	playView.left = '42%';
	                }
	
	                sound.addEventListener('complete', function()
	                {
	                	//V1.9 SDK7 - Added isPlaying
	                    isPlaying = false;
	                    Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
	                    playImage.image =  '/images/phase5/PLAY.png';
	                    recordImage.image = '/images/phase5/RECORD.png';
	                    recordView.touchEnabled = true;
	                    stopPlaybackView.visible = false;
	                    recordView.visible = true;
	                    playView.left = '49.5%';
	                    if(osname == 'android')
	                    {
	                    	playView.left = '50.5%';
	                    }
	                });
	                    //}
	            }
	        });
	
	        stopPlaybackView.addEventListener('click',function(e)
	        {
	        	sound.stop();
	            //V1.9 SDK7 - Added isPlaying
	            isPlaying = false;
	            Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
	            playImage.image  = '/images/phase5/PLAY.png';
	            recordImage.image = '/images/phase5/RECORD.png';
	            recordView.touchEnabled = true;
	            stopPlaybackView.visible = false;
	            recordView.visible = true;
	            playView.left = '49.5%';
	            if(osname == 'android')
	            {
	            	playView.left = '50.5%';
	            }
	        });
	    }
	
	    //Long press for deleting the recorded audio
	    var deleteAudioRecordLabel = new Array();
	    deleteAudioRecordLabel['title']=['Alert','Alert'];
	    deleteAudioRecordLabel['message']=['longpress_audio_delete','Long press will be delete your recorded audio session file. Do you want to continue?'];
	    deleteAudioRecordLabel[1]=['Delete','Delete'];
	    deleteAudioRecordLabel[2]=['Cancel','Cancel'];
	    //V1.9 SDK7 - Added r_HomeScreen
	    var deleteAudioDialog = r_HomeScreen.createLocalizedAlertDialog(deleteAudioRecordLabel, usrname);
	    //var deleteAudioDialog = createLocalizedAlertDialog(deleteAudioRecordLabel, usrname);
	    recordImage.addEventListener('longpress', function()
	    {
	    	if(recordImage.image == '/images/phase5/RECORD.png')
	        {
	            if(isRecordStarted == 'true')
	            {
	                deleteAudioDialog.show();
	            }
	        }
	    });
	
	
		deleteAudioDialog.addEventListener('click',function(e)
		{
	    	if(e.index == 0)
	        {
	        	var db = Titanium.Database.open('Miscue');
	            var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionGuid);
	            file = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
	            audioFileExistCheckRow.close();
	            if(file != 'null')
	            {
	            	if(osname != 'android')
	                {
	                	file = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,file);
	                }
	                else
	                {
	                	var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
	                    file = Ti.Filesystem.getFile(audioDir.resolve(), file);
	                }
	                file.deleteFile();
	                playView.visible = false;
	                file = 'null';
	                Ti.API.info("---------- BEN - recordedAudioFilename is being set on the database (2)!!! Hardcoded to = null");
	                db.execute('UPDATE MiscueSession SET recordedAudioFilename =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?','null',createLastModifiedDate(),'true','true',userId,sessionGuid);
	                db.close();
	                playImage.image  = '/images/blurPlay.png';
	                var labelDeleteArray = new Array();
	                labelDeleteArray['message']=['search_Session_Deleted_Toast','Deleted'];
	                //V1.9 SDK7 - Added HomeScreen requires
	                r_HomeScreen.createLocalizedShowToastMessage(labelDeleteArray['message'], usrname);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
	                //createLocalizedShowToastMessage(labelDeleteArray['message'], usrname);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
	            }
	            else
	            {
	         		audioFileExistCheckRow.close();
	                audioFileExistCheckRow = null;
	                db.close();
	                db = null;
	                alert('File does not exists');
	            }
	        }
		});
		
	    function recalculateAccuracy () 
	    {
	    	var db = Titanium.Database.open('Miscue');
	        var miscueItemrow = db.execute('SELECT * FROM MiscueSessionItem  where miscueSessionId =?',sessionGuid);
	        var miscueItemrowCount = miscueItemrow.rowCount;
	        miscueItemrow.close();
	        miscueItemrow = null;
	        db.close();
	        db = null;
	        miscueAccuracy = ((bookcontentcount.length - miscueItemrowCount)*100 ) / bookcontentcount.length;
	        miscueAccuracy = parseFloat(miscueAccuracy).toFixed(2);
	
	        Ti.API.info('book content '+bookcontentcount);
	        Ti.API.log('bookcontentcount.length is :: ', bookcontentcount.length);
	        Ti.API.log('miscueItemrowCount is :: ', miscueItemrowCount);
	        Ti.API.log('bookcontentcount.length is :: ', bookcontentcount.length);
	
	        // accuracy_Label.text = 'Accuracy:' + miscueAccuracy + '%';//ipad  MAL - remove accuracy
	
	        return miscueAccuracy;
	
	    }//closing function
	
	
	    //Zoom in event listner
	    var fontsize = 1.5,incount = 0, outcount = 0;
	    zoomin.addEventListener('click',function(e)
	    {
	    	Ti.API.log('Zoom');
	        if(incount != 10)
	        {
	        	fontsize = fontsize+0.2;
	            sessionwebview.evalJS("fontsize('"+fontsize+"em')");
	            incount++;
	        }
	        outcount = 0;
	    });
	
	    //Zoom out event listner
	    zoomout.addEventListener('click',function(e)
	    {
		    if(outcount != 10 && fontsize > 1.3)
		    {
		    	fontsize = fontsize-0.2;
		        sessionwebview.evalJS("fontsize('"+fontsize+"em')");
		        outcount++;
		        incount--;
		    }
		});
		
		
       	
	    //Creating function for saving the miscue session on back/save button click
	    function saveMiscueSessionOnBackButton()
	    {
	    	//V1.9 SDK7 - I added this for debugging. TODO DELETE ME
	    	checkDevicePermissions();
	    	
	    	//1.9 SDK7 - Added this so that audio is saved between sessions
	    	moveAudioToPermanentStorage();
	    	
	    	function checkDevicePermissions()
			{
	            // also seems to check storage, even though its not explicitly asked for, and not flagged as required anywhere??
				
				Ti.API.info("----------BEN!!! Checking device permissions");
				
				if(Ti.Filesystem.hasStoragePermissions())
				{
					Ti.API.info("----------BEN!!! Has storage permissions...");
				}
				else
				{
					Ti.API.info("----------BEN!!! NOT have storage permissions...");
				}
				
				
	            if (Ti.Media.hasCameraPermissions())
	            {
	                // I can access the camera!
	                Ti.API.info("----------BEN!!! I already have access to storage!");
					return true;
	            }
	            else
				{
					Ti.API.info("----------BEN!!! I cannot access the storage, attempting to get access...");
					try
					{
						
						
						Ti.API.info("----------BEN!!! Try started...");
		                Ti.Media.requestCameraPermissions(function(e) 
						{
							Ti.API.info("----------BEN!!! Permission requested...");
							
		                    if (e.success) 
		                    {
		                    	// permissions granted
		                    	Ti.API.info("----------BEN!!! I managed to get permission to storage.");
								return true;
		                    }
		                    else
		                    {
		                        // user has denied access to the camera
								
		                        //_self.messageBox('I cannot access the camera, please check device Settings.');
		                        
								Ti.API.info("----------BEN!!! I cannot access the storage, please check device Settings.");
								
		                    	return false;
		                	}
		                	
		                	Ti.API.info("----------BEN!!! End of permission request...");
		            	});
		            	Ti.API.info("----------BEN!!! End of try...");
		            }
		            catch(e)
		            {
		            	Ti.API.info("----------BEN!!! There was an error whilst trying to get access to the storage! Error: " + e);
		            }
				}
	       	}
	    	
	    	function moveAudioToPermanentStorage()
	    	{
	    		/*
	    		 * V1.9 SDK7 - I added this function to move the audio file to permanent storage.
	    		 * I did this because it was being saved to the cache and then was subsequently deleted when the app was closed.
	    		 */
	    		
	    		Ti.API.info("---------- BEN - Moving file to permanent storage...");
		    	
		        var temp = file.nativePath.split("/");
		        var audioFileName = temp[temp.length - 1];
		        
		        Ti.API.info("---------- BEN - The audio file itself is called = " + audioFileName);
		        
		        var cachedAudioFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, audioFileName);
		        
		        
		        if(!Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, audioFileName).exists())
		        {
			        var newFileDirectory = Ti.Filesystem.applicationDataDirectory + "/" + audioFileName;
			        Ti.API.info("---------- BEN - Attempting to move audio file from the cache to the application data directory. The new directroy will be: " + newFileDirectory);
			        cachedAudioFile.move(newFileDirectory);
			        Ti.API.info("---------- BEN - file was successfully moved from the cache to the application data directory!");	
		        }
		        else
		        {
		        	Ti.API.info("---------- BEN - The audio file has already been saved to permanent storage.");	
		        }
		        
		        
	    	}
	    	
	    	if(singletapwin.visible == true)
	        {
	        	miscueMenuCloseView.visible = false;
	            miscueMenuCloseView.touchEnabled = false;
	            singletapwin.hide();
	            singletapwin.visible = false;
	            sessionwebview.touchEnabled = true;
	        }
	        else
	        {
				if(initialTextForAccuracyLabel !== accuracyLabel.text)
			    {
					var db = Titanium.Database.open('Miscue');
					db.execute('UPDATE MiscueSession SET isSessionModified = ? WHERE userId=? AND sessionGuid = ?', 'true', userId, sessionGuid);
					db.close();
					db = null;
			    }
	            var db = Titanium.Database.open('Miscue');
	            var checkEditSessionRow = db.execute("SELECT * FROM MiscueSession WHERE sessionGuid = ? AND userId = ? AND (isSessionModified = 'true' OR lastModifiedDate > lastSavedToServerDate OR lastSavedToServerDate = 'null') ",sessionGuid,userId);
	            var checkEditSessionRowCount = checkEditSessionRow.rowCount;
	            checkEditSessionRow.close();
	            checkEditSessionRow = null;
	            db.close();
	            db = null;
	
	            if(checkEditSessionRowCount > 0)
	            {
	            	Ti.API.info('saving session');
	                var labelArray = new Array();
	                labelArray['message']=['saving_Indicator','Please wait...'];
	                //V1.9 SDK7 - Added r_loadingScreen
	                r_loadingScreen.showActivity(labelArray['message'], usrname);
	                //showActivity(labelArray['message'], usrname);
	                
	                
	                if (file != 'null' && file != null) // -Lee adding && file != null stops this falling over, but now saving dialog never goes away.
	                {
	                    file = file.getName(); //-Lee getting occational error here - cannot call method getName on null ??? is the check valid?
	                }
	                else
	                {
	                	file = 'null'; // -Lee forces file to be 'null' even if object is typeof null so code acts consistantly
	                }
	
	                // -Lee Saving.. doesn't go away if wifi has been lost in mid session- probably isn't just file object thats getting destroyed
	                var localSliderValueString = accuracyLabel.text;
	                Ti.API.info('localSliderValueString : '+localSliderValueString);
	                Ti.API.info('insert/update single value at save'+localSliderValueString+'with bookGUID='+bookGuid+' and user id '+userId+ ' learner guid '+learnerguid);
	                Ti.API.info("---------- BEN - First, I am updating the 'sliderValue' (understanding) for this session on the local database.");
	                var db = Titanium.Database.open('Miscue');
	                db.execute('UPDATE MiscueSession SET sliderValue = ? WHERE bookGUID = ? AND userId = ? AND learnerGuid = ?', localSliderValueString, bookGuid, userId,learnerguid);
	     			db.close();
	     			//V1.9 SDK7 - Added r_HomeScreen
	     			Ti.API.info("---------- BEN - Secondly, I am calling HomeScreen.createSubmitMiscueSession which finishes off creating me on the local database. A file is sent to this function. The type is = " + file + " and the directory is = " + file.nativePath);
	     			r_HomeScreen.createSubmitMiscueSession (userId,sessionGuid,token,sessionWin,isSessionBookPage,token, file,accuracyLabel.text);
	                //createSubmitMiscueSession (userId,sessionGuid,token,sessionWin,isSessionBookPage,token, file,accuracyLabel.text);//Calling function from home.js
	                if(!Ti.Network.online)
	                {
	    				//V1.9 SDK7 - Added r_loadingScreen
	                    r_loadingScreen.hideActivity();
	                    //hideActivity();
	                    if(isSessionBookPage == 'book')
	                    {
	                    	//1.9 SDK7 - Added r_miscue as tt is undefined
	                        //var miscuewindow = tt.ui.createmiscueMenuPage(usrname,token,menuItemKey,userId);
	                        var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(usrname,token,menuItemKey,userId);
	                        miscuewindow.open();
	                        sessionWin.close();
	                    } // isSessionBookPage != 'book'
	                    else if(isSessionBookPage == 'search')
	                    {
	                    	//1.9 SDK7 - Added r_miscue as tt is undefined
	                        //var searchSession =  tt.ui.createsearchSession(usrname,userId,token,menuItemKey);
	                        var searchSession =  r_miscue.tt.ui.createsearchSession(usrname,userId,token,menuItemKey);
	                        searchSession.open();
	                        sessionWin.close();
	                    }
	                }
	                //hideActivity(); // -Lee Saving... not going away if wifi lost and restored...
	                // M6D-1(A popup should appear with "please wait" whilst the save is taking place) resolved by applying comment to above line
	            } // CheckEditSessionRowCount ! > 0
	            else
	            {
					if (isSessionBookPage == 'book') 
					{
						//1.9 SDK7 - Added r_miscue as tt is undefined
						//var miscuewindow = tt.ui.createmiscueMenuPage(usrname, token, menuItemKey, userId);
						var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(usrname, token, menuItemKey, userId);
						miscuewindow.open();
						sessionWin.close();
					} 
					else if (isSessionBookPage == 'search') 
					{
						var localSliderValueString = accuracyLabel.text;
	                   	Ti.API.info('search localSliderValueString : '+localSliderValueString);
	                   	//1.9 SDK7 - Added r_miscue as tt is undefined
	                   	//var searchSession = tt.ui.createsearchSession(usrname, userId, token, menuItemKey);
						var searchSession = r_miscue.tt.ui.createsearchSession(usrname, userId, token, menuItemKey);
						searchSession.open();
						sessionWin.close();
					}
	            }
	            file = null;
	            Ti.App.removeEventListener('app:single', singleTap);
	            Ti.App.removeEventListener('app:long', longTap);
	        }
	        Ti.App.Properties.setString('isAudioPlayingProcess', 'false');
			//MAL alert('For your reading results visit the Reading Assessment Centre at BigCatAssessment.com','Saved successfully');
			Ti.UI.createAlertDialog(
			{
				title:'Saved successfully',
				message:Ti.App.Properties.getString("readingResultsMessage")
			}).show();
		}
	
	    //V1.8 Ben UPDATE - Renamed this to 'save' button event listner (was incorrectly named 'back' event listener)
	    //Save button event listner
	    saveButton.addEventListener('click',function(e)
	    {
		    if(e.source.id == 'saveButton')
		    {
		      	if (recordImage.image == '/images/phase5/RECORDFLASHING.png')
		        {
		           	alert('Record is in process');
		        }
		        else
		        {
		           	saveMiscueSessionOnBackButton();
		        }
		    }
		});
	
	    //V1.8 Ben UPDATE - Back button event listner
	    backButton.addEventListener('click',function(e)
	    {
			Ti.API.info('Back button clicked!' + e.source.id);
		    //V1.8 Ben UPDATE - Checks that the sender button is correct
					
		    if(e.source.id == 'backButton')
		    {
		        // create alert dialog
		        var dialog = Ti.UI.createAlertDialog(
		        {
			   		cancel: 1,
			   		buttonNames: ['Yes', 'Cancel'],
			   		message: 'Do you want to go back? This will delete the current session',
				    title: 'Go Back'
				});
				   
				dialog.addEventListener('click', function(e)
				{
					if (e.index === e.source.cancel)
					{		      
						return;
				    } 
					else
					{  
				    	Ti.API.info('Back button still clicked!');
				            	
				            	
				        //V1.8 Ben UPDATE - Loads code for book page
				        //V1.9 SDK7 - Changed to require
				        var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage');
				        //Ti.include('/MainMiscue/ui/sessionBookPage.js');
				
				        //V1.8 Ben UPDATE - Some data, which is required for
				        //'createBookNameWindow()', is not available in this page.
				        var db = Titanium.Database.open('Miscue');
				        //Get this data from db.
				        var miscueSessionRow = db.execute("SELECT * FROM UserBook T1,MiscueSession T2 WHERE T2.sessionGuid = ? AND T2.userId = ? AND T1.bookGuid = ?",sessionGuid,userId,bookGuid);
				        var groupLearenrrow = db.execute('SELECT * FROM LearnerGroup G, Learner L WHERE L.groupGuid=G.groupGuid AND L.learnerGuid = ?',learnerguid);
							  
						//V1.9 SDK7 - Added r_miscue
						var newBookWin = r_miscue.tt.ui.createBookNameWindow(
				        //var newBookWin = tt.ui.createBookNameWindow(
				        usrname, //V1.8 Ben UPDATE -'usrname' is a parameter of 'tt.ui.createSessionWindow'
				        miscueSessionRow.fieldByName('learnerGuid'), //V1.8 Ben UPDATE - Learner GUID must be retrieved from the database
				        groupLearenrrow.fieldByName('learnerName'), //V1.8 Ben UPDATE - Learner name must be retrieved from the database
				        token, //V1.8 Ben UPDATE - 'token' is a parameter of 'tt.ui.createSessionWindow'
				        groupLearenrrow.fieldByName('groupName'), //V1.8 Ben UPDATE - Group name must be retrieved from the database
				        button_Id, //V1.8 Ben UPDATE - 'button_Id' is a parameter of 'tt.ui.createSessionWindow'
				        userId, //V1.8 Ben UPDATE - 'userId' is a parameter of 'tt.ui.createSessionWindow'
				        menuItemKey //V1.8 Ben UPDATE - 'menuItemKey' is a parameter of 'tt.ui.createSessionWindow'
				        );
						db.close(); //v1.8 close db
				        newBookWin.open();
				        DeleteSession();
				        //sessionWin.close();
				
				        //V1.8 Ben UPDATE - Copied from 'searchSession.js' lines 1053 - 1093
				        function DeleteSession() 
				        {
					    	Ti.API.info('- - - - - - delete SESSION start - - - - - - ');
				            Ti.API.info('session guid is ' + sessionGuid );
				    		var db = Titanium.Database.open('Miscue');
				    		var audioFileExistCheckRow =  db.execute("SELECT * FROM MiscueSession  WHERE userId = ? AND sessionGuid = ?",userId,sessionGuid); //V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				    		var fileName = audioFileExistCheckRow.fieldByName('recordedAudioFilename');
				            audioFileExistCheckRow.close();
				    		var deleteSessionCheckRow = db.execute('SELECT * FROM MiscueSession WHERE userId = ? AND sessionGuid=? AND (lastSavedToServerDate < lastModifiedDate OR lastSavedToServerDate = ?)',userId,sessionGuid,'null'); //V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				    		Ti.API.info('	deleteSessionCheckRow is ' + deleteSessionCheckRow.rowCount);
				    		if(deleteSessionCheckRow.rowCount > 0)
				    		{
				    			db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=?',sessionGuid); //V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				    				       
				    			//V1.9 SDK7 - Added r_sessionBookPage
				    			db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',r_sessionBookPage.createDate(),sessionGuid,userId); //V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				    			//db.execute('UPDATE MiscueSession SET sessionStatus = ?, lastModifiedDate = ? WHERE sessionGuid = ? AND userId = ?','DELETED',createDate(),sessionGuid,userId); //V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				                    			
				                db.close();
				                /* if(Ti.Network.online)
				                {
				                	//V1.8 Ben UPDATE - Using sessionGuid instead of sessionguid as sessionguid does not exist in this context.
				                    //createSaveMiscueSessionToServer(userId,sessionGuid,token,'','',fileName);
				                }
				    			//	tableView.deleteRow(e.index);
				    			var labelArray = new Array();
				    			labelArray['message']=['search_Session_Deleted_Toast','Deleted'];
				    			createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
				
				    			if(miscueSearchWin.children.length == 6)
				    			{
				    				miscueSearchWin.remove(tableView);
				    			}
				
				    			if(Ti.App.Properties.getString('isSearchImageButtonIsClicked') == 'true')
				                {
				    				createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily, searchTextFieldValue);
				    			}
				    			else
				    			{
				    			    createSearchFeild(tableView,userId,miscueSearchWin,userName,token,menuItemKey,fontcolour,backcolour,pagefontfamily);
				    			}*/
				    		}
				    		//else if(deleteSessionCheckRow.rowCount > 0){
						    //db.close();
				    		//dialog.show();		//showing dialogue box if session is not saved and try to delete
				    		//}
				    		Ti.API.info('- - - - - - delete SESSION end - - - - - - ');
						} // function DeleteSession
				   	}
				});
			  	dialog.show();	
			} // source = "back"
		}); // back button event listener
	    
	    //Main window close eventlistner
	    sessionWin.addEventListener('close',function(e)
	    {
		    Ti.Gesture.removeEventListener('orientationchange',orientionChangeMode);
		    if(singleTapWindowCount != 0)
		    {
		    	singletapwin.close();
		        singletapwin = null;
		    }
		    menuBarView.close();
		    sessionWin.remove(groupNamelabels);
		    sessionWin.remove(learnerNameLabels);
		    sessionWin.remove(webviewcontainer);
		    menuBarView = null;
		    statusBarView = null;
		    sessionWin = null;
		});
	
	    //Notes event listner
	    notesbuttonview.addEventListener('click',function(e)
	    {
		    if(singletapwin.visible == true)
		    {
		    	miscueMenuCloseView.visible = false;
		        miscueMenuCloseView.touchEnabled = false;
		        singletapwin.close();
		        singletapwin.visible = false;
		        sessionwebview.touchEnabled = true;
		    }
		    else
		    {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//var notewin = tt.ui.createnotecontentWindow(sessionGuid, usrname, isDeletedGroupLearnerBook, bookGuid, userId);
		        var notewin = r_miscue.tt.ui.createnotecontentWindow(sessionGuid, usrname, isDeletedGroupLearnerBook, bookGuid, userId);
		        notewin.open();
		    }
		});
	
	   /* var singletapwin = Ti.UI.createWindow(
		{
			backgroundColor:'white',
	        width:Titanium.UI.FILL,
	        borderWidth:3,
	        borderRadius:10,
	        borderColor:'#888',
	        //height:'120dp',
	        height:Titanium.UI.FILL,
	        layout :'vertical',
	        visible:false
	        //older code working well in iphone for reference
	        // backgroundColor:'white',
	        // width:'58%',
	        // borderWidth:3,
	        // borderRadius:10,
	        // borderColor:'#888',
	        // //height:'120dp',
	        // height:Titanium.UI.SIZE,
	        // layout :'vertical',
	        // visible:false
		});*/
	
	    //MAL - replace singletapwin for iOS
		var singletapwin;
	
	    if(Ti.Platform.osname == 'android')
	    {
			singletapwin = Ti.UI.createWindow(
			{
		        backgroundColor:'white',
		        width:Titanium.UI.FILL,
		        borderWidth:3,
		        borderRadius:10,
		        borderColor:'#888',
		        //height:'120dp',
		        height:Titanium.UI.FILL,
		        layout :'vertical',
		        visible:false
		        //older code working well in iphone for reference
		        // backgroundColor:'white',
		        // width:'58%',
		        // borderWidth:3,
		        // borderRadius:10,
		        // borderColor:'#888',
		        // //height:'120dp',
		        // height:Titanium.UI.SIZE,
		        // layout :'vertical',
		        // visible:false
	        });
		}
	    else
	    {
	    	singletapwin = Ti.UI.createWindow(
	    	{
		        //older code working well in iphone for reference
		        backgroundColor:'white',
		        width:'58%',
		        borderWidth:3,
		        borderRadius:10,
		        borderColor:'#888',
		        height:Titanium.UI.size,
		        //height:Titanium.UI.SIZE,
		        layout :'vertical',
		        visible:false
		    });
		}
	
	
	    var singletapLabel = Ti.UI.createLabel(
	    {
			top:'15dp',
			width:'97%',
			height:'80%',
			//height:Titanium.UI.SIZE,
			textAlign: 'center',
			bottom:'10%',
			color:'black',
			font: 
			{ 
				fontSize:'21dp',
				fontWeight:'bold'
			}
			//older code working well in iphone for reference
			// top:'15dp',
			// width:'97%',
			// //height:'30dp',
			// height:Titanium.UI.SIZE,
			// textAlign: 'center',
			// bottom:'3dp',
			// color:'black',
			// font: {
			// fontSize:'21dp',
			// fontWeight:'bold'
			// },
		});
	
	    var deleteButton = Ti.UI.createButton(
	    {
	    	title:'[X]' + ' ' + deleteLocalizedText,
	        backgroundColor:'transparent',
	        color:'red',
	        style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
	        font: 
	        {
	        	fontSize:'20dp',
	            fontWeight:'bold'
	        },
	    });
	
	    singletapwin.add(singletapLabel);
	    singletapwin.add(deleteButton);
	
	    var singleindex;
	
	    /////Android Back button event listner
	    if(Ti.Platform.osname == 'android')
	    {
	    	sessionWin.addEventListener('android:back', function()
	    	{
		        if (recordImage.image == '/images/phase5/RECORDFLASHING.png')
		        {
		        	alert('Record is in process');
		        }
		        else
		        {
		        	saveMiscueSessionOnBackButton();
		        }
		    });
	    }
	    //mal v17 move recordimage to here, after events are added
	    recordView.add(recordImage);
	    //Singletap event listner
	    var singleTap = function (e) 
	    {
	
		    //If backgroundcolor is grey then show pop up menu
		    if(tweetWindow.visible == false)
		    {
		    	miscueMenuCloseView.visible = true;
		        miscueMenuCloseView.touchEnabled = true;
		        sessionwebview.touchEnabled = false;
		        singleindex = e.spanIndex;
		        var winhgth = Ti.Platform.displayCaps.platformHeight;
		        var winwidth = Ti.Platform.displayCaps.platformWidth;
		
		        singletapwin.visible = true;
		        if(isDeletedGroupLearnerBook == 'yes')//checking book, learner or group is deleted(if checklearnerGroupBookDeleteRowCount = 0 there is no any deleted group or learner or book)
		        {
		        	deleteButton.visible = false;
		        }
		        singleTapWindowCount++;
		        if(Ti.Platform.osname == 'android')
		        {
		        	singletapwin.open();
		        }
		        else
		        {
			    	if(singleTapWindowCount == 1)
			        {
			        	singletapwin.open();
			        }
		        }
		        var db = Titanium.Database.open('Miscue');
		        var singletapmenurow = db.execute('SELECT * FROM MiscueSessionItem WHERE indexOfWord=? AND miscueSessionId=? ',singleindex,sessionGuid);
		        if(singletapmenurow.rowCount >= 1)
		        {
		       		for(var t = 0; t < singletapmenurow.rowCount;t++)
		            {
		            	var quote = '"';
		                var Labelname = singletapmenurow.fieldByName('additionalInfo');
		                Labelname = Labelname.replace(/&apos;/gi,"'");
		                Labelname = Labelname.replace(/&quot;/gi,'"');
		                var note = singletapmenurow.fieldByName('noteText');
		                if(note == '')
		                {
		                	singletapLabel.text = Labelname;
		                }
		                else
		                {
		                	note = note.replace(/&apos;/gi,"'");
		                    singletapLabel.text = Labelname + '-' +'"' + note + '"';
		                }
		                singletapmenurow.next();
		
		            }
		        }
		        singletapmenurow.close();
		        singletapmenurow = null;
		        db.close();
		        db = null;
		    } ///Closing if condition
		    //   }//closing pop up
		
		};
	    //Calling single tap eventlistner function
	    Ti.App.addEventListener('app:single', singleTap);
	
	    //Delete event listner for singletap pop up window
	    deleteButton.addEventListener('click',function(e)
	    {
	    	miscueMenuCloseView.visible = false;
	        miscueMenuCloseView.touchEnabled = false;
	        var db = Titanium.Database.open('Miscue');
	        db.execute('DELETE FROM MiscueSessionItem WHERE miscueSessionId=? AND indexOfWord = ?',sessionGuid,singleindex);
	        miscueAccuracy = recalculateAccuracy();
	        db.execute('UPDATE MiscueSession SET isLastEditedSession = ? WHERE userId = ?','false',userId);
	        db.execute('UPDATE MiscueSession SET accuracyValue =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?',recalculateAccuracy(),createLastModifiedDate(),'true','true',userId,sessionGuid);
	        db.close();
	        var deletecount = 0;
	        sessionwebview.evalJS("winrefresh('"+singleindex+"','"+backcolour+"','"+fontcolour+"')");
	        deletecount++;
	        
	        sessionwebview.touchEnabled = true;
	        singletapwin.visible = false;
	        if(Ti.Platform.osname == 'android')
	        {
	        	singletapwin.close();
	        }
	        else
	        {
	        	singletapwin.hide();
	        }
	    });
	
	
	    //Toolbar event listner
	    toolbarShowButton.addEventListener('click',function(e)
	    {
	    	if(menuBarView.visible == 0)
	    	{
	        	toolbarShowButton.backgroundImage = '/images/phase5/HIDEMENU.png';
	            bottommenuMainView.animate({bottom:0, duration:animSpeed});
	            if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
	            {
		        	sessionwebview.height = '60%';//70
		            slider.animate({bottom:'20%', duration:animSpeed});//10
		            upImageView.animate({bottom:'20%', duration:animSpeed});//10
		            downImageView.animate({bottom:'20%', duration:animSpeed});//10
		            accuracyLabel.animate({bottom:'15%', duration:animSpeed});	//5
	            }
	            else
	            {
		        	sessionwebview.height = '40%';//50
		            slider.animate({bottom:'25%', duration:animSpeed});//15
		            upImageView.animate({bottom:'25%', duration:animSpeed});//15
		            downImageView.animate({bottom:'25%', duration:animSpeed});//15
		            accuracyLabel.animate({bottom:'21%', duration:animSpeed});//10
	            }
	
	            if(osname == 'ipad' || Inch >= 6.8)
	            {
	            	webviewcontainer.height = '100%';
	                sessionwebview.top = '0dp';
	            }
	            else
	            {
	            	webviewcontainer.height = '90%';
	            }
	
	
	         	menuBarView.visible = true;
	        }
	        else
	        {
	        	toolbarShowButton.backgroundImage = '/images/phase5/SHOWMENU.png';
	            if(Inch >= 6.8)
	            {
	            	bottommenuMainView.animate({bottom:bottomMenuBottomDownValue, duration:animSpeed});
	            }
	            else
	            {
	            	bottommenuMainView.animate({bottom:bottomMenuBottomDownValue, duration:animSpeed});
	            }
	            if(Ti.Platform.displayCaps.platformWidth < Ti.Platform.displayCaps.platformHeight)
	            {
	            	sessionwebview.height = '70%';
	            	slider.animate({bottom:'10%', duration:animSpeed});
	            	upImageView.animate({bottom:'10%', duration:animSpeed});
	            	downImageView.animate({bottom:'10%', duration:animSpeed});
	            	accuracyLabel.animate({bottom:'5%', duration:animSpeed});
	            }
	            else
	            {
	               	sessionwebview.height = '50%';
		            slider.animate({bottom:'15%', duration:animSpeed});
		            upImageView.animate({bottom:'15%', duration:animSpeed});
		            downImageView.animate({bottom:'15%', duration:animSpeed});
		            accuracyLabel.animate({bottom:'10%', duration:animSpeed});
	            }
	
	            menuBarView.visible = false;
	            if(Inch < 6.8 || osname == 'iphone')
	            {
	            	webviewcontainer.height = '90%';
	            }
	
			}
		});
	
	    bottommenuMainView.add(toolbarShowButton);
	    sessionWin.add(bottommenuMainView);
	
		function getOrientation(orientVal) 
		{
	    	var value;
	    	switch (orientVal) 
	    	{
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
	    	return value;
		}
	
	    var orientCount = 6;
	
	    Ti.Gesture.addEventListener('orientationchange', orientionChangeMode);
	    function orientionChangeMode(e)
	    {
	    	//var orientVal = e.orientation;
	        Ti.API.info('change orentaion call');
	       	var orientVal = e.source.orientation;
	       	var orientationVal = getOrientation(orientVal);
	    	if(orientationVal != orientCount && orientationVal != 0)
	    	{
	        	orientCount = orientationVal;
	        	bottomViewConfigOnOrientationMode();
	        	if (e.orientation === Ti.UI.LANDSCAPE_RIGHT || e.orientation === Ti.UI.LANDSCAPE_LEFT)
	         	{
	         		sessionwebview.height = '50%';
	      			slider.bottom ='15%';
	      			upImageView.bottom = '15%';
	      			downImageView.bottom = '15%';
	      			accuracyLabel.bottom='10%';
	              	convertFromPxToDp();
	             	if(menuBarView.visible == 1)
	               	{
	             		bottommenuMainView.animate({bottom:bottomMenuBottomDownValue, duration:animSpeed});
	             		toolbarShowButton.backgroundImage = '/images/phase5/SHOWMENU.png';
				 		menuBarView.visible = false;
	                }
	         	}
	        	else
	        	{
		        	sessionwebview.height = '70%';
	      			slider.bottom ='10%';
	      			upImageView.bottom ='10%';
	      			downImageView.bottom ='10%';
	      			accuracyLabel.bottom='5%';
	             	convertFromPxToDp();
	            	if(menuBarView.visible == 1)
	            	{
	               		bottommenuMainView.animate({bottom:bottomMenuBottomDownValue, duration:animSpeed});
	               		toolbarShowButton.backgroundImage = '/images/phase5/SHOWMENU.png';
				   		menuBarView.visible = false;
	             	}
	        	}
	      	}
	      
	      	//V1.9 SDK7 - Added r_loadingScreen
	      	var screenRes = r_loadingScreen.backgroundImageHeightWidthPxToDp();
			//var screenRes = backgroundImageHeightWidthPxToDp();
			screenBackgroundImage[1].width = screenRes[0];
			//V1.9 SDK7 - isLandscape is no longer a function
			//if (Ti.Gesture.isLandscape()) {
			if (Ti.Platform.displayCaps.platformWidth > Ti.Platform.displayCaps.platformHeight) 
			{
				screenBackgroundImage[1].height = screenRes[1];
				Ti.API.info('or change landscape' + screenBackgroundImage[1].height);
			} 
			else 
			{
				if (osname == 'ipad' || osname == 'iphone') 
				{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight) - (Titanium.Platform.displayCaps.platformHeight / 2.5);
					Ti.API.info('or change portrair ipad and iPhone' + screenBackgroundImage[1].height);
				} 
				else 
				{
					screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 120));
					Ti.API.info('or change portrair android' + screenBackgroundImage[1].height);
				}
				if (Inch >= InchValue) 
				{
					if (osname == 'iphone' || osname == 'ipad') 
					{
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight);
						Ti.API.info('or change inch > value portrair iphone or ipad' + screenBackgroundImage[1].height);
					} 
					else 
					{
						screenBackgroundImage[1].height = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 100));
						Ti.API.info('or change inch > value portrair android' + screenBackgroundImage[1].height);
					}
				}
			}
		}
	
	    ///Creating miscue menu modal window
	    var tweetWindow;
	    tweetWindow = Titanium.UI.createView(
	    {
	    	top:(Inch >= 6.8)?'16%':'22%',
	        visible:false,
	        backgroundColor:'white',
	        borderWidth:'1dp',
	        borderColor:'black',
	        layout:'vertical',
	        borderRadius:4,
	    });
	
	 	//Creating a view
	 	//Tap on this to close the miscue menu and singletap pop up
	 	var miscueMenuCloseView = Ti.UI.createView(
	 	{
	    	height:'100%',
	    	width:'100%',
	    	backgroundColor:'transparent',
	    	visible:false,
	    	touchEnabled:false
	 	});
	
	 	sessionWin.add(miscueMenuCloseView);
	    ////Creating input window for further input window
	    // -Lee dialog is too small and text is white on white!
	    // lots of little changes, adding up to a bigger dialog...
	    var subwin = Ti.UI.createWindow(
	    {
	    	top:'20%',
	        height:'200dp', /* 160dp */
	        width:'305dp',  /* 205dp */
	        backgroundColor: '#302828',
	        opacity : 1.0
		});
	    
	    var subwinView = Ti.UI.createView(
	    {
	    	top:'10%',
	        height:'100%',
	        width:'100%',
	        visible:true,
	        backgroundColor: '#302828',
	    });
	
	    var Label = Ti.UI.createLabel(
	    {
	    	top:10,
	        text:'Enter the input',
	        color:'white',
	        width:subwin.width,
	        font:{fontSize:'15dp',fontWeight:'bold'},
	        textAlign:'center',
	        touchEnabled:false
		});
	
	    var txtfield = Ti.UI.createTextArea(
	    {
	    	bottom:110, /* 70 */
	        backgroundColor:'white',
	        width:'285dp', /* 185dp */
	        left:'10dp',
	        height:'40dp',
	        editable:true,
	        enableReturnKey:true,
	        returnKeyType:Titanium.UI.RETURNKEY_DONE ,
	        focusable:true,
	        color:'black',
	        font:{fontSize:'18dp',fontFamily:pagefontfamily},
	    });
	
	    var miscueTypeSaveButton = Ti.UI.createButton(
	    {
	    	bottom:55,  /* 15 */
	        //V1.9 SDK7 - Changed as this was too small on some devices
	        width:'110dp',
	        //width:'90dp',
	        backgroundImage:'/images/button_bg_black.png',
	        style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
	        //V1.9 SDK7 - Changed as this was too small on some devices
	        height:'45dp',
	        //height:'35dp',
	        color:'white',
	        title:'Save',
	        left:'40dp' /* 6dp */
		});
	
		var cancelButton = Ti.UI.createButton(
		{
	    	bottom:55,	/* 15 */
	        //V1.9 SDK7 - Changed as this was too small on some devices
	        width:'110dp',
	        //width:'90dp',
	        backgroundImage:'/images/button_bg_black.png',
	        style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
	        //V1.9 SDK7 - Changed as this was too small on some devices
	        height:'45dp',
	        //height:'35dp',
	        color:'white',
	        title:'Cancel',
	        //V1.9 SDK7 - Changed as this was too small on some devices
	        right: '40dp',
	        //left:'149dp' /* 52% */
		});
	    
	    subwinView.add(Label);
	    subwinView.add(txtfield);
	    subwinView.add(cancelButton);
	    subwinView.add(miscueTypeSaveButton);
	    subwin.add(subwinView);
	
	    var miscue_menu,countval, additionalInfo, miscueMenuLabelId,startchar,endchar,valencr;
	    var selectedMiscueTypeColor;
	    ///Longpress event
		
	    var longTap = function(e)
	    {
		
		    if(isDeletedGroupLearnerBook != 'yes')//checking book, learner or group is deleted(if checklearnerGroupBookDeleteRowCount = 0 there is no any deleted group or learner or book)
		    {
		    	e.preventDefault;
		        var val = e.data;
		        countval = e.spanIndex;
		
		        sessionwebview.evalJS("singleTapBackgroundColor('"+countval+"','"+backcolour+"','"+fontcolour+"')");
		
		        var longtapleft = e.miscueMenuLeftValue;
		        startChar = e.startchar;
		        endChar = e.endchar;
		        if( countval != 'heading')
		        {
		            if(countval != 'htmlTap')
		            {
		            	if(countval != 'newtext2')
		            	{
		                	if(countval != 'txt')
		                	{
		             			val = val.replace(/[&\/\\#+()$~%:*<>{}]/g, '');
		        				if(tweetWindow.visible == false)
		        				{
		            				miscueMenuCloseView.visible = true;
		              				miscueMenuCloseView.touchEnabled = true;
		            				zoomin.touchEnabled = false;
		            				zoomout.touchEnabled = false;
		            				saveButton.touchEnabled = false;
		            				notesbuttonview.touchEnabled = false;
		        					if(Ti.Platform.osname != 'android')
		        					{
		        						sessionwebview.touchEnabled = false;
		        					}
		        					if(Inch < 6.8 ) 
		        					{
		            					if(osname == 'android')
		            					{
		            						tweetWindow.height = '73%';
		            					}
		            					else
		            					{
		                					tweetWindow.height = '70%';
		                					if(osname == 'ipad')
		                					{
		                						tweetWindow.height = '35%';//BCE-17 Resolved
		                					}
		            					}
		            					tweetWindow.width = '45%';
		        					}
		        					else if(Inch >= 6.8 && osname == 'android')
		        					{
		            					tweetWindow.top = '30%';
		            					tweetWindow.height = '59%';
		            					tweetWindow.width = '40%';
		        					}
		        					else
		        					{
		            					tweetWindow.height = '48%';
		            					tweetWindow.width = '42%';
		        					}
		        					var leftTapValue = Titanium.Platform.displayCaps.platformWidth/2.5;
		         					if(Ti.Platform.name === 'android')
		        					{
		          						//Converting to dp value
		         						leftTapValue  = (leftTapValue / (Titanium.Platform.displayCaps.dpi / 160));
		         					}
		        					
		        					if(leftTapValue <= longtapleft)
		         					{
		            					tweetWindow.left = '2%';
		         					}
		        					else
		        					{
		            					tweetWindow.right = '2%';
		           					}
		
		        					var tableView = Ti.UI.createTableView(
		        					{
		            					top:5,
		            					bottom: 0,
		             					separatorColor: 'black',
		            					backgroundColor:'transparent'
		         					});
		
		        					var titleLabels = Ti.UI.createLabel(
		        					{
		            					top:'5dp',
		            					height:30,
		            					color:'black',
		            					backgroundColor:'transparent',
		            					width:'100%',
		            					font:{fontSize:'16dp',fontWeight:'bold'},
		            					textAlign:'center',
		            					text: '"'+val+'"',
		            					touchEnabled:false
		        					});
		
		        					var db = Titanium.Database.open('Miscue');
		        					var insertToModalwin = db.execute("SELECT * FROM UserBook T1,MiscueSession T2 WHERE T2.sessionGuid = ? AND T2.userId = ? AND T1.bookGuid = ?",sessionGuid,userId,bookGuid);
		         					var encstr1 = insertToModalwin.fieldByName('bookContents');
		        					var bookTitle = insertToModalwin.fieldByName('bookName');
		         					bookTitle = bookTitle.replace(/&quot;/gi,"'");
		        					var copyOfBookTitle = bookTitle;
		        					var insertionval = Ti.Utils.base64decode(encstr1);
		        					insertionval = bookTitle + ' ' +insertionval;
		        					insertToModalwin.close();
		        					insertToModalwin = null;
		        					db.close();
		        					db = null;
		        					var insertionconvertval = insertionval.toString();
		        					insertionconvertval = insertionconvertval.replace(/\r\n/gi," ");
		        					insertionconvertval = insertionconvertval.replace(/( *\<br *\/> *)/gi," <br /> ");
		        					insertionconvertval = insertionconvertval.replace(/(^\s*)|(\s*$)/gi,"");
		        					insertionconvertval = insertionconvertval.replace(/[ ]{2,}/gi," ");
		        					insertionconvertval = insertionconvertval.replace(/\n/g," ");
									
		        					var bookContent_Count = insertionconvertval.split(' ').length;
		        					Valstr = insertionconvertval.split(' ');
		        					if( countval == 0)
		        					{
		             					startchar =  0;
		             					endchar = Valstr[countval].length;
		        					}
		        					else
		        					{
		            					var previousvalue = Valstr[countval - 1];
		            					var previousvalueLength = previousvalue.length;
		            					var previousvalindex = countval - 1;
		        					}
		        					
		        					var lasttext;
		        					var beforewordflag = true , afterwordflag = false;
		        					var strx = insertionconvertval.split(" ");
		        					var startCharPos = 0;
		        					var endCharPos = 0;
		        					for(var i = 0;i < bookContent_Count; i++)
		        					{
		            					endCharPos = startCharPos + strx[i].length - 1 ;
		            					if(i == countval)
		            					{
		                					//logic to find next and previous words of the clicked word and
		                					// startchar and endchar positions of the current word
		                					var beforeword = strx[i-1];
		                					var afterword = "";
		                					if(i < (bookContent_Count - 1))
		                					{
		                    					afterword = strx[i+1];
		                					}
		                					
		                					if(afterword == '<br' && i < (bookContent_Count - 3))
		                					{
		                    					afterword = strx[i+3];
		                					}
		
							                if(beforeword == '/>' && i > 2)
		                					{
		                    					beforeword = strx[i-3];
		                					}
							                if(afterword != null)
		                					{
		                    					afterword = afterword.trim();
		                    					afterword = afterword.replace(/[&\/\\#+()$~%:*<>{}]/g, '');
		                					}
							                if(beforeword != null)
							                {
							                    beforeword = beforeword.trim();
							                    beforeword = beforeword.replace(/[&\/\\#+()$~%:*<>{}]/g, '');
							                }
							                startchar = startCharPos;
							                endchar = endCharPos;
							                break;
							            }
		            					else
		            					{
		            						startCharPos = endCharPos + 2;
		            					}
									}
		       						var strval = val.toString();
		        					var val1 = '"';
		
		         					if(countval == bookContent_Count - 1)
		             				{
		                 				var rowcount = 10;
		                				var beforewordstring = beforeword.toString();
		
		                				if(Inch >= 6.8 || osname == 'ipad' || i == 3 || i == 5) 
		                				{
		                    				if(osname == 'ipad')
		                    				{
		                    					tweetWindow.height = '39%';
		                    				}
		                    				else
		                    				{
		                        				tweetWindow.height = '48%';
		                    				}
		                    				i++;
		                  				}
		                 				var lasttext = val1 + strval + val1 + '&' + val1 + beforeword + val1 ;
		             				}
		            				else if(countval == 0)
		            				{
		                				var afterwordstring = afterword.toString();
		                				var rowcount = 10;
		                				if(Inch >= 6.8 || osname == 'ipad') 
		                				{
		                    				if(osname == 'ipad')
		                    				{
		                    					tweetWindow.height = '39%';
		                    				}
		                    				else
		                    				{
		                        				tweetWindow.height = '48%';
		                    				}
		                				}
		                				var firsttext = val1 + strval + val1 + '&' + val1 + afterword + val1 ;
		            				}
		            				else
		            				{
		            					var rowcount = 12;
		            					var beforewordstring = beforeword.toString();
		            					var afterwordstring = afterword.toString();
		            					var lasttext = val1 + strval + val1 + '&' + val1 + beforeword + val1 ;
		            					var firsttext = val1 + strval + val1 + '&' + val1 + afterword + val1 ;
		            				}
		
		        					createmiscueMenuTypeTable();
		        					function createmiscueMenuTypeTable()
		        					{
		          						var tvData = [];
		        						var db = Titanium.Database.open('Miscue');
		         						var userLanguageRow = db.execute('SELECT * FROM miscueType WHERE userId = ? AND isDeleted = ? ORDER BY position ASC',userId,'no');
		        						var array_count = 0;
		        						var j = 3;
		          						var counti = 0;
		         						for(var i = 0;i < userLanguageRow.rowCount;i++)
		        						{
		            						var miscueTypeId = userLanguageRow.fieldByName('id');
						
		            						var miscueTypeValue = userLanguageRow.fieldByName('text');
		            						var miscueTypeColor = userLanguageRow.fieldByName('colour');
		          							if(i <= rowcount)
		                					{
		            							if(miscueTypeValue.search('prevword') != -1)
		            							{
		                							if(beforeword == undefined)
		                							{
		                								userLanguageRow.next();
		                 								continue;
		                							}
		                							else
		                							{
		                    						miscueTypeValue = miscueTypeValue.replace("prevword", beforeword);
									                }
									            }
									            if(miscueTypeValue.search('nextword') != -1)
									            {
									                if(afterword == '')
									                {
									        	        userLanguageRow.next();
									                    continue;
									                }
									                else
									                {
									                    miscueTypeValue = miscueTypeValue.replace("nextword", afterword);
									                }
									            }
		
		             							if(miscueTypeValue.search('word') != -1)
		                						{
		                        					miscueTypeValue = miscueTypeValue.replace("word", strval);
		                						}
		
								                var groupLabel = Ti.UI.createLabel(
								                {
								                	bottom:'2dp',
								                    text:miscueTypeValue,
								                    color:'black',
								                    font: 
								                    {
								                    	fontSize:'16dp',
								                        fontWeight:'bold'
								                    },
								                    left:(Inch >= 6.8) ? 55:35
								                });
		
							                    var labelColor = Ti.UI.createLabel(
							                    {
							                    	bottom:'2dp',
							                        height:(Inch >= 6.8)?'30dp':'20dp',
							                        width:(Inch >= 6.8)?'30dp':'20dp',
							                        left:8,
							                        backgroundColor:miscueTypeColor
							                    });
							
							                    var row = Ti.UI.createTableViewRow(
							                    {
							                    	//height:'45dp',
							                        top:'5dp',
							                        height:(Inch < 6.8)?Titanium.UI.SIZE:'45dp',
							                        id:miscueTypeId,
							                        row_id:groupLabel.text,
							                        backgroundColor:'transparent',
							                        colorId:miscueTypeColor
							                    });
							                    row.add(labelColor);
							                    row.add(groupLabel);
							                    tvData.push(row);
							
							                	userLanguageRow.next();
							                  	//j++;
							            	}
							        	}
							        	tableView.setData(tvData);
							        	userLanguageRow.close();
							        	userLanguageRow = null;
							        	db.close();
							      		db = null;
							    	}
		        					tweetWindow.add(titleLabels);
		        					tweetWindow.add(tableView);
		        					sessionWin.add(tweetWindow);
		        					tweetWindow.show();
		        					tweetWindow.visible = true;
		
		    						//Logic for handling click event of the  of miscue menu items
		    						tableView.addEventListener('click', function (e) 
		    						{
			         					miscue_menu;
			         					additionalInfo = e.rowData.row_id;
			         					miscueMenuLabelId = e.rowData.id;
			          					selectedMiscueTypeColor = e.rowData.colorId;
			         					additionalInfo = additionalInfo.replace(/'/gi,"&apos;");
			        					additionalInfo = additionalInfo.replace(/"/gi,'&quot;');
			         					valencr = Ti.Utils.base64encode(val);
			         					var db = Titanium.Database.open('Miscue');
				
			    					    var miscueTypeRow = db.execute("SELECT * FROM miscueType WHERE id = ? AND userId = ?",miscueMenuLabelId,userId);
								        var miscueTypeRequiredNote;
										if(miscueTypeRow.rowCount > 0)
								        {
								        	// miscue_menu = miscueTypeRow.getFieldName('apiref');
								            miscueTypeRequiredNote = miscueTypeRow.fieldByName('requirenotes');
								            var name = miscueTypeRow.fieldByName('id');
								            miscue_menu = additionalInfo;
								        }
								        miscueTypeRow.close();
								        miscueTypeRow = null;
								        db.close();
								        db = null;
			
			        					var lastmodified_Date = createLastModifiedDate();
			
			        					if(miscueTypeRequiredNote == 'false')
			        					{
			            					var new_val = '';
			            					miscueMenuCloseView.visible = false;
			            					miscueMenuCloseView.touchEnabled = false;
			              					var db = Titanium.Database.open('Miscue');
			            					var miscueTypeRow = db.execute('SELECT apiRef FROM miscueType WHERE userId = ? AND id = ?',userId,miscueMenuLabelId);
			            					var apiRef = miscueTypeRow.fieldByName('apiRef');
			            					miscueTypeRow.close();
			            					miscueTypeRow = null;
			            					db.close();
			            					db = null;
			            					//V1.9 SDK7 - Added r_Miscuedb
			            					r_Miscuedb.insertMiscueSessionItem(sessionGuid,new_val,miscueMenuLabelId,countval,startchar,endchar,additionalInfo,apiRef);
			            					//insertMiscueSessionItem(sessionGuid,new_val,miscueMenuLabelId,countval,startchar,endchar,additionalInfo,apiRef);
			            					miscueAccuracy = recalculateAccuracy();//
			            					var db = Titanium.Database.open('Miscue');
			            					db.execute('UPDATE MiscueSession SET accuracyValue =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?',miscueAccuracy,createLastModifiedDate(),'true','true',userId,sessionGuid);
			            					db.close();
			            					db = null;
			            					var colorVal = selectedMiscueTypeColor;
			            					sessionwebview.evalJS("addBackgroundcolor('"+countval+"','"+colorVal+"')");
			            					tweetWindow.visible = false;
			            					sessionWin.remove(tweetWindow);
			            					tweetWindow = null;
			                    			tweetWindow = Titanium.UI.createView(
			                    			{
				                        		top:(Inch >= 6.8)?'16%':'22%',
				                        		visible:false,
				                        		backgroundColor:'white',
				                        		borderWidth:'1dp',
				                        		borderColor:'black',
				                        		layout:'vertical',
				                        		borderRadius:4,
				                    		});
			            					sessionwebview.touchEnabled = true;
			            					zoomin.touchEnabled = true;
			            					zoomout.touchEnabled = true;
								            saveButton.touchEnabled = true;
								            notesbuttonview.touchEnabled = true;
								            miscue_menu = null;
								            countval = null;
								            additionalInfo = null;
								            miscueMenuLabelId = null;
								            startchar = null;
								            endchar = null;
								            valencr = null;
			        					}
			     						else 
			     						{
			            					//Ti.API.info('length before' +sessionWin.children.length);
			        						sessionWin.remove(tweetWindow);
			        						tweetWindow = null;
			            					tweetWindow = Titanium.UI.createView(
			            					{
						                        top:(Inch >= 6.8)?'16%':'22%',
						                        visible:false,
						                        backgroundColor:'white',
						                        borderWidth:'1dp',
						                        borderColor:'black',
						                        layout:'vertical',
						                        borderRadius:4,
						                    });
			
			        						subwin.addEventListener('open',function(e)
			        						{
			          							txtfield.focus();
			           							if(osname == 'android')
			             						{
			             							txtfield.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
			             							subwin.activity.actionBar.hide();
			            						}
			        						});
			            					
			            					subwin.open();
			            					subwinView.visible = true;
			
			             					if(osname == 'android')
			             					{
			            						sessionWin.addEventListener('focus',function(e){
			                						//txtfield.blur();
			                    					Ti.UI.Android.hideSoftKeyboard();
			                					});
			            					}
			          					}
			        				});
								}//closing if condition
		      				}//Closing first if condition
		     			}
		    		}//if
		     	}//if
			}//Closing if condition(checking condition is book or group or learner is deleted)
		    else
		    {
		    	var labelArray = new Array();
		        labelArray['title']=['Alert','Alert'];
		        labelArray['message']=['group_Learner_Book_Delete_Message','Session cannot be modified as one or more of  group/learner/book is deleted'];
		        labelArray[1]=['Ok','Ok'];
		        //V1.9 SDK7 - Added r_HomeScreen
		        var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, usrname);
		        //var dialog = createLocalizedAlertDialog(labelArray, usrname);
		        dialog.show();
			}
		};
	        
	    Ti.App.addEventListener('app:long',longTap);
	
	    //Event listner for saving the additional info which are created by teacher
	    miscueTypeSaveButton.addEventListener('click' , saveAdditionalInfo);
	    function saveAdditionalInfo() 
	    {
	    	miscueMenuCloseView.visible = false;
	        miscueMenuCloseView.touchEnabled = false;
	        var textNote = txtfield.value;
	        textNote = textNote.replace(/'/gi,'&apos;');
	        if(textNote == '')
	        {
	        	var labelArray = new Array();
	            labelArray['message']=['Empty_Input_Window_Message','Field is Empty'];
	            //V1.9 SDK7 - Added HomeScreen requires
	            r_HomeScreen.createLocalizedShowToastMessage(labelArray['message'], usrname);
	            //createLocalizedShowToastMessage(labelArray['message'], usrname);
	        }
	        else
	        {
	        	var db = Titanium.Database.open('Miscue');
	            var miscueTypeRow = db.execute('SELECT apiRef FROM miscueType WHERE userId = ? AND id = ?',userId,miscueMenuLabelId);
	            var apiRef = miscueTypeRow.fieldByName('apiRef');
	            miscueTypeRow.close();
	            miscueTypeRow = null;
	            db.close();
	            db = null;
	            //V1.9 SDK7 - Added r_Miscuedb
	            r_Miscuedb.insertMiscueSessionItem(sessionGuid,textNote,miscueMenuLabelId,countval,startchar,endchar,additionalInfo,apiRef);
	            //insertMiscueSessionItem(sessionGuid,textNote,miscueMenuLabelId,countval,startchar,endchar,additionalInfo,apiRef);
	            var colorVal = selectedMiscueTypeColor;
	            sessionwebview.evalJS("addBackgroundcolor('"+countval+"','"+colorVal+"')");
	            miscueAccuracy = recalculateAccuracy();
	            var db = Titanium.Database.open('Miscue');
	            db.execute('UPDATE MiscueSession SET accuracyValue =?, lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? WHERE userId=? AND sessionGuid = ?',miscueAccuracy,createLastModifiedDate(),'true','true',userId,sessionGuid);
	            db.close();
	            db = null;
	            subwin.close();
	            subwinView.visible = false;
	            txtfield.value = '';
	            miscue_menu = null;
	            countval = null;
	            additionalInfo = null;
	            miscueMenuLabelId = null;
	            startchar = null;
	            endchar = null;
	            valencr = null;
	            sessionwebview.touchEnabled = true;
	            zoomin.touchEnabled = true;
	            zoomout.touchEnabled = true;
	            saveButton.touchEnabled = true;
	            notesbuttonview.touchEnabled = true;
	        }
	    }
	    ////Cancel button event listner
	    cancelButton.addEventListener('click', function(e)
	    {
	    	miscueMenuCloseView.visible = false;
	        miscueMenuCloseView.touchEnabled = false;
	        sessionWin.remove(tweetWindow);
	        tweetWindow = null;
	        tweetWindow = Titanium.UI.createView(
	        {
		        top:(Inch >= 6.8)?'16%':'22%',
		        visible:false,
		        backgroundColor:'white',
		        borderWidth:'1dp',
		        borderColor:'black',
		        layout:'vertical',
		        borderRadius:4,
		    });
	        sessionwebview.touchEnabled = true;
	        miscueMenuLabelId = null;
	        miscue_menu = null;
	        subwin.close();
	        subwinView.visible = false;
	        txtfield.value = '';
	        sessionwebview.evalJS("winrefresh('"+countval+"','"+backcolour+"','"+fontcolour+"')");
	        zoomin.touchEnabled = true;
	        zoomout.touchEnabled = true;
	        saveButton.touchEnabled = true;
	        notesbuttonview.touchEnabled = true;
	    });
	
	    //Event listner for closing the miscue menu window and singletap popup window.
	    miscueMenuCloseView.addEventListener('click',function(e)
	    {
	    	miscueMenuCloseView.visible = false;
	        miscueMenuCloseView.touchEnabled = false;
	        if(singletapwin.visible == true)
	        {
	        	singletapwin.visible = false;
	            if(Ti.Platform.osname == 'android')
	            {
	            	singletapwin.close();
	            }
	            else
	            {
	            	singletapwin.hide();
	            }
	            sessionwebview.touchEnabled = true;
	            saveButton.touchEnabled = true;
	        }
	        else if(subwinView.visible == true)
	        {
	        	miscueMenuCloseView.visible = false;
	            miscueMenuCloseView.touchEnabled = false;
	            sessionWin.remove(tweetWindow);
	            tweetWindow = null;
	            tweetWindow = Titanium.UI.createView(
	            {
	            	top:(Inch >= 6.8)?'16%':'22%',
	                visible:false,
	                backgroundColor:'white',
	                borderWidth:'1dp',
	                borderColor:'black',
	                layout:'vertical',
	                borderRadius:4,
	            });
	            sessionwebview.touchEnabled = true;
	            miscueMenuLabelId = null;
	            miscue_menu = null;
	            subwin.close();
	            subwinView.visible = false;
	            txtfield.value = '';
	            sessionwebview.evalJS("winrefresh('"+countval+"','"+backcolour+"','"+fontcolour+"')");
	            zoomin.touchEnabled = true;
	            zoomout.touchEnabled = true;
	            saveButton.touchEnabled = true;
	            notesbuttonview.touchEnabled = true;
	
	        }
	        else
			{
	        	sessionWin.remove(tweetWindow);
	            tweetWindow = null;
	            tweetWindow = Titanium.UI.createView(
	            {
	            	top:(Inch >= 6.8)?'16%':'22%',
	                visible:false,
	                backgroundColor:'white',
	                borderWidth:'1dp',
	                borderColor:'black',
	                layout:'vertical',
	                borderRadius:4,
	            });
	            sessionwebview.evalJS("winrefresh('"+countval+"','"+backcolour+"','"+fontcolour+"')");
	            sessionwebview.touchEnabled = true;
	            zoomin.touchEnabled = true;
	            zoomout.touchEnabled = true;
	            saveButton.touchEnabled = true;
	            notesbuttonview.touchEnabled = true;
	        }
	    });
	
	    //MAL make toolar visible
	    setTimeout(function()
	    {
	    	toolbarShowButton.fireEvent('click');
	    },1000);
	    
	    return sessionWin;
	};
})();

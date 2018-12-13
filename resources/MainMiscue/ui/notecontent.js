//V1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
	var r_miscue = require('/MainMiscue/miscue.js'); 
	
	//V1.9 SDK7 - Added 'require' for loadingScreen
	var r_loadingScreen = require('/MainMiscue/ui/loadingScreen'); 
	
	//V1.9 SDK7 - Added 'require' for sessionBookPage
	var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage'); 
	
	//V1.9 SDK7 - Added 'require' for HomeScreen
	var r_HomeScreen = require('/MainMiscue/ui/HomeScreen'); 

(function() {
	//1.9 SDK7 - Added r_miscue as tt is undefined
	//tt.ui.createnotecontentWindow = function(session_Guid, userName, isDeletedGroupLearnerBook, bookGuid, userId) {
	r_miscue.tt.ui.createnotecontentWindow = function(session_Guid, userName, isDeletedGroupLearnerBook, bookGuid, userId) {
		//V1.9 SDK7 - Added r_loadingScreen
		var iOS7 = r_loadingScreen.isiOS7Plus();
	//var iOS7 = isiOS7Plus();
	
	var noteContentWind = Ti.UI.createWindow({
		fullscreen:false,
		navBarHidden:true,
		title:'Miscue',
		tabBarHidden:true,
		backgroundColor:'#F8F6F6'
	});
    	 if(iOS7 >= 7)
         {
          noteContentWind.top = '20dp';
         }
	var osname = Ti.Platform.osname;
	//V1.9 SDK7 - added r_loadingScreen
	var Inch = r_loadingScreen.screenInch();
	//var Inch = screenInch();
	  if(Inch < InchValue && osname == 'android')
	  {
	  	noteContentWind.orientationModes = [Titanium.UI.PORTRAIT];
	  }else if(osname == 'android'){
	  	noteContentWind.orientationModes = [Titanium.UI.PORTRAIT];
	  }
	var notesHeadingToolBarView = Ti.UI.createView({
              	backgroundColor:'#AFAED4',
              	top:'0dp',
    			left:0,
    			width:'100%',
    			height:'40dp',
    	  });
    	  
                
     	var backButton = Ti.UI.createButton({
			 // title:'Back',
			  backgroundImage:'/images/back.png',
			  height:'30dp',
			  backgroundColor:'transparent',
			  width:'30dp',
			  left:'7dp',
			  textAlign:'center',
			  bottom:'5dp',
			  color:'white',
			  style: Titanium.UI.iPhone.SystemButtonStyle.PLAIN,
			  font: {
				fontSize:'20dp',
				fontWeight:'bold'
				},
			});
		
		
		notesHeadingToolBarView.add(backButton);
	              
           function saveNotes (session_Guid,textFieldValue) {
           	var db = Titanium.Database.open('Miscue');
		var note_row = db.execute("SELECT * FROM MiscueSession  where sessionGuid =? AND sessionNotes = ?",session_Guid,textFieldValue);
		if(note_row.rowCount == 0)
		{
			//V1.9 SDK7 - Added r_sessionBookPage
			db.execute("UPDATE MiscueSession SET lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? ,sessionNotes = ? WHERE  sessionGuid = ?",r_sessionBookPage.createDate(),'true','true',textFieldValue,session_Guid);
		//db.execute("UPDATE MiscueSession SET lastModifiedDate=?,isSessionModified = ?,isLastEditedSession = ? ,sessionNotes = ? WHERE  sessionGuid = ?",createDate(),'true','true',textFieldValue,session_Guid);	
	 	db.close();
	 	 var labelArray = new Array();
		labelArray['message']=['note_saved','Saved'];
		//V1.9 SDK7 - Added HomeScreen requires
		r_HomeScreen.createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
		//createLocalizedShowToastMessage(labelArray['message'], userName);//Showing Toast message and calling createLocalizedShowToastMessage function from homescreen.js(line no 687)
		setTimeout(function(){
	 	noteContentWind.close({duration:800});
	 	 },1000);
	      }
	      else{
	      	db.close();
	 		noteContentWind.close();
	 	}
             
           }    	
		
	backButton.addEventListener('click',function(e){
		 var textFieldValue = txtarea.value;
			saveNotes (session_Guid,textFieldValue);
		});
	
	 if(Ti.Platform.osname == 'android')
		    {
		    	  noteContentWind.addEventListener('android:back', function(){
		    	  var textFieldValue = txtarea.value;
			    saveNotes (session_Guid,textFieldValue);
		    	  });
		    }
		    
		 //Keyboard height   
		//  Ti.App.addEventListener("keyboardframechanged", function(e) {
		   // View.height = (Ti.Platform.displayCaps.platformHeight - e.keyboardFrame.height) - 80;   
		//   });  
		    

        var View = Ti.UI.createScrollView({
            contentHeight: Ti.Platform.displayCaps.platformHeight,
            top:'45dp',
            layout: 'vertical',
            backgroundColor:'white',
            });
         
        //Scrollview added to window
        noteContentWind.add(View);
         
      	// -Lee is HelveticaNeue an Android font? - equivalent is Roboto
      	// -Lee iOS expect postscript name, Android expects base filename.
      	// -Lee HelveticaNeue requires a license to use on Android? Not installed by default
      	// -Lee fixed text colour being same as background colour 20/07/2015
		var txtarea = Ti.UI.createTextArea({
			backgroundColor:'white',
			suppressReturn : false,
			//value:txtvalue,
			height:200,
             width:'100%',
            color:'black',    
			font:{fontFamily:'HelveticaNeue',fontSize:23,
					fontFamily:'Roboto',fontSize:23}

		});
		
		
		
		if(Inch >= InchValue)
          {
              txtarea.height = '50%';
          }
		
		if(isDeletedGroupLearnerBook == 'yes')
		{
			txtarea.editable = false;
		}
			var db = Titanium.Database.open('Miscue');
	 		var noterowcheck = db.execute('SELECT * FROM MiscueSession  where sessionGuid =? ',session_Guid);
	 		//alert(noterowcheck.rowCount);	
	 		if(noterowcheck.rowCount > 0)
	 		{
	 		 var notecontent = noterowcheck.fieldByName('sessionNotes');   //"Notes section 1\n \n \n \n \n \n \n Notes section 2\n";//noterowcheck.fieldByName('sessionNotes');	
	 		db.close();
	 		Ti.API.info(notecontent);
			txtarea.value = notecontent;
			}
			else{
			  db.close();
			}
		
		 var lbl_quote = Ti.UI.createLabel({
		    left:0,
		    right:0,
		    top:0,
		    
		    width:'100%',
		    height:'auto',
		    zIndex: 3
		});

	
		var click = 0;  
	   
      View.add(txtarea);
   
     noteContentWind.add(notesHeadingToolBarView);
	
	noteContentWind.addEventListener('focus',function(e){
		txtarea.focus();
		
	});
	
	 return noteContentWind;
 };
 })();
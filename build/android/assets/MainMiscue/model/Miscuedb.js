
 //Creating DeviceInstallID table
 
 function createDeviceinstalID()
  {
      var db = Titanium.Database.open('Miscue');
     //db.execute("DROP TABLE IF EXISTS Login"); 
     db.execute('CREATE TABLE IF NOT EXISTS DeviceID (deviceid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT , deviceInstallID VARCHAR)');
     db.close();
  }
  createDeviceinstalID();
  //1.9 SDK7 added export
  exports.createDeviceinstalID = createDeviceinstalID;
  
  function insertDeviceinstalID(devid)
  {
      var db = Titanium.Database.open('Miscue');
      db.execute("INSERT INTO DeviceID (deviceInstallID) VALUES ('" + devid + "')");
      db.close();	
  }
  //1.9 SDK7 added export
  exports.insertDeviceinstalID = insertDeviceinstalID;
  
 //Creating login table
  var user, password,flag,cach;
 function createLogin() {
     var db = Titanium.Database.open('Miscue');
  // db.execute("DROP TABLE IF EXISTS Login"); 
     db.execute('CREATE TABLE IF NOT EXISTS Login (userid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT , username VARCHAR, getP VARCHAR,checkvalue INTEGER,cachevalue INTEGER,userLanguage TEXT,accessToken VARCHAR,logoutFlag INTEGER)');
     db.close();
 }
 createLogin();
 //1.9 SDK7 added export
 exports.createLogin = createLogin;

 function insertLogin(user, password,flag,cach,userlang,logoutflag,accesstoken)
  {
  	Ti.API.debug('BEN!!! user = ' + user);
  	var db = Titanium.Database.open('Miscue');
	var logincach = db.execute('SELECT * FROM Login');
	if(logincach.rowCount >= 1)
	 {
	   var cachig = 0,flg = 0;
	   while (logincach.isValidRow())
		{ 	
	     	  var cachid = logincach.fieldByName('userid');
	     	  db.execute('UPDATE Login SET cachevalue=? WHERE userid=?',cachig,cachid);
	     	  logincach.next();
	       }
	 }
	 logincach.close();
	 var loginrow = db.execute('SELECT * FROM Login WHERE username=?',user);
       if(loginrow.rowCount == 0)
        {
          db.execute("INSERT INTO Login (username, getP,checkvalue,cachevalue,userLanguage,logoutFlag,accessToken) VALUES ('" + user + "','" + password + "','" + flag + "','" + cach + "','"+userlang+"','" + logoutflag + "','" + accesstoken + "') ");
        }
	 else if(loginrow.rowCount >= 1)
	  {
	    var usrid = loginrow.fieldByName('userid');
	    db.execute('UPDATE Login SET username=?,getP=?,checkvalue=?,cachevalue=?,userLanguage=? ,logoutFlag=?, accessToken=? WHERE userid=?' ,user,password,flag,cach,userlang,logoutflag,accesstoken,usrid);	
	  }
	   loginrow.close();
	   db.close();
  }
  //1.9 SDK7 added export
  exports.insertLogin = insertLogin;

  function Logindelete(deleteid)
   {
	var db = Titanium.Database.open('Miscue');
 	db.execute('DELETE FROM Login WHERE userid=?',deleteid);
	db.close();	
   }
   //1.9 SDK7 added export
   exports.Logindelete = Logindelete;

 var schoolname,bgcolour, fontcolour, charfont,bgimage,logsids,logo;
  function createUserSetting ()
   {
	var db = Titanium.Database.open('Miscue');
  	//db.execute("DROP TABLE IF EXISTS UserSetting"); 
	db.execute('CREATE TABLE IF NOT EXISTS UserSetting (settingId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT ,schoolName VARCHAR,backgroundColor VARCHAR,fontColor VARCHAR,charFont VARCHAR,logos TEXT,backPage TEXT,islastUsedBrandLogo VARCHAR, homePageBackgroundImage TEXT, miscueMenuPageBackgroundImage TEXT, selectionPagebackgroundURL TEXT, sessionPagebackgroundURL TEXT, backImageURL TEXT, saveImageURL TEXT, logoutImageURL TEXT, loginId INTEGER, FOREIGN KEY(loginId) REFERENCES Login(userid))');
	db.close();
   }
   createUserSetting();
   //1.9 SDK7 added export
   exports.createUserSetting = createUserSetting;
	
  function insertUserSetting(schoolname,bgcolour, fontcolour, charfont,bgimage,logo,islastUsedLogo, homePageBackgroundImage, miscueMenuPageBackgroundImage, selectionPagebackgroundURL, sessionPagebackgroundURL, backImageURL, saveImageURL, logoutImageURL,logsids)
   {	
      var db = Titanium.Database.open('Miscue');
      db.execute("INSERT INTO UserSetting (schoolName,backgroundColor,fontColor,charFont,backPage,logos,islastUsedBrandLogo, homePageBackgroundImage, miscueMenuPageBackgroundImage, selectionPagebackgroundURL, sessionPagebackgroundURL, backImageURL, saveImageURL, logoutImageURL,loginId) VALUES ('" + schoolname + "','" + bgcolour + "','" + fontcolour + "','" + charfont + "','" + bgimage + "','"+logo+"','"+islastUsedLogo+"','" + homePageBackgroundImage + "','" + miscueMenuPageBackgroundImage + "','" + selectionPagebackgroundURL + "','" + sessionPagebackgroundURL + "','" + backImageURL + "','" + saveImageURL + "', '" + logoutImageURL + "', '" + logsids + "')");
      db.close();
   }
   exports.insertUserSetting = insertUserSetting;	

  function userSettingDelete(usersettingid)
   {
 	var db = Titanium.Database.open('Miscue');
 	db.execute('DELETE FROM UserSetting WHERE loginId=?',usersettingid);
 	db.close();	
  }
  exports.userSettingDelete = userSettingDelete;
 
   //Creating Homescreen table
   function createUserMenuItem() 
   {
     var db = Titanium.Database.open('Miscue');
	 //db.execute("DROP TABLE IF EXISTS UserMenuItem"); 
     db.execute('CREATE TABLE IF NOT EXISTS UserMenuItem (menuItemId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,  label_name TEXT, Type TEXT,Image TEXT,Link VARCHAR,Position INTEGER, menuItemKey VARCHAR, menuKey VARCHAR,userId INTEGER, FOREIGN KEY(userId) REFERENCES Login(userid))');
     db.close();
   }
    createUserMenuItem();
    //1.9 SDK7 added export
    exports.createUserMenuItem = createUserMenuItem;

  function insertUserMenuItem(labels,icon,link,type,positionid,user_loginId,menu_Key,menuItem_Key)
    {
	var db = Titanium.Database.open('Miscue');
	db.execute("INSERT INTO UserMenuItem (label_name,Type,Image,Link,Position,menuItemKey,menuKey,userId) VALUES('" + labels + "','" + type + "','" + icon + "','"+link+"','"+positionid+"','"+menuItem_Key+"','"+menu_Key+"','"+user_loginId+"')");
	db.close();
    }
    //1.9 SDK7 added export
    exports.insertUserMenuItem = insertUserMenuItem;

  function Userhomescreendelete(homescreenid)
   {
 	var db = Titanium.Database.open('Miscue');
 	db.execute('DELETE FROM UserMenuItem WHERE userId=?',homescreenid);
	db.close();	
   }
   //1.9 SDK7 added export
   exports.Userhomescreendelete = Userhomescreendelete;
  
    //Creating Miscue Type table
   function createMiscueType() 
   {
     var db = Titanium.Database.open('Miscue');
	 // db.execute("DROP TABLE IF EXISTS miscueType"); 
     db.execute('CREATE TABLE IF NOT EXISTS miscueType (miscueTypeId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,  id TEXT, text TEXT,requirenotes TEXT,position INTEGER, apiref VARCHAR, colour VARCHAR,isDeleted TEXT,userId INTEGER, FOREIGN KEY(userId) REFERENCES Login(userid))');
     db.close();
   }
   createMiscueType();
	//1.9 SDK7 added export
	exports.createMiscueType = createMiscueType;
	

  
   	
    function insertUserMiscueType(id,text,position,requireNotes,apiref,colour,isDeleted,userId)
    {
	var db = Titanium.Database.open('Miscue');
	db.execute("INSERT INTO miscueType (id,text,requirenotes,position,apiref,colour,isDeleted,userId) VALUES('" + id + "','" + text + "','" + requireNotes + "','"+position+"','"+apiref+"','"+colour+"','"+isDeleted+"','"+userId+"')");
	 //  var miscueTypeDeleteRowCount = db.execute('SELECT * FROM miscueType WHERE userId =? ', userId);
	//   alert(miscueTypeDeleteRowCount.rowCount);
	db.close();
    }
    //1.9 SDK7 added export
	exports.insertUserMiscueType = insertUserMiscueType;

   
   
   //Creating group table
  function CreateGroup()
  {
	var db = Titanium.Database.open('Miscue');
	//db.execute("DROP TABLE IF EXISTS LearnerGroup"); 
	db.execute('CREATE TABLE IF NOT EXISTS LearnerGroup (groupId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, groupGuid VARCHAR, groupName VARCHAR, deleted VARCHAR,loginUserId INTEGER,FOREIGN KEY(loginUserId) REFERENCES Login(userid))');
	db.close();
  }
  CreateGroup();
  //1.9 SDK7 added export
  exports.CreateGroup = CreateGroup;
 
 //Inserting group info to group table	
 function InsertGroup(groupguid,groupname, isDeleted,userid)
  {	
    var db = Titanium.Database.open('Miscue');
     db.execute("INSERT INTO LearnerGroup (groupGuid, groupName, loginUserId,deleted) VALUES ('" + groupguid + "','" + groupname + "','" + userid + "','" + isDeleted + "')");
     db.close();
  }
//1.9 SDK7 added export
exports.InsertGroup = InsertGroup;
  
  //Creating learner table
   function CreateLearner()
  {
	var db = Titanium.Database.open('Miscue');
//	db.execute("DROP TABLE IF EXISTS Learner"); 
	db.execute('CREATE TABLE IF NOT EXISTS Learner (learnerId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,learnerGuid VARCHAR,learnerName VARCHAR, learnerImage TEXT, deleted VARCHAR,groupGuid VARCHAR,userId INTEGER)');
	db.close();
  }
  CreateLearner();
 //1.9 SDK7 added export
 exports.CreateLearner;
 
  //Inserting learner info to learner table	
  function Insertlearner(learnerguid, groupGuid, learnername, leanerimage,isDeleted,loginUserId )
  {	
  	var db = Titanium.Database.open('Miscue');
     db.execute("INSERT INTO Learner (learnerGuid, learnerName, learnerImage, groupGuid, deleted,userId) VALUES ('"+ learnerguid +"','"+ learnername + "','" + leanerimage + "','" + groupGuid + "','" + isDeleted + "','" + loginUserId + "')");
     db.close();
  }
  //1.9 SDK7 added export
  exports.Insertlearner = Insertlearner;

   function createBook()
  {
     var db = Titanium.Database.open('Miscue');
  // db.execute("DROP TABLE IF EXISTS UserBook"); 
  Ti.API.info('coming here to create a book table');
     db.execute('CREATE TABLE IF NOT EXISTS UserBook (bookId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT , bookName VARCHAR, bookContents VARCHAR,bookGuid VARCHAR,bookImage TEXT,bookType VARCHAR,isManuallyAdded VARCHAR,createdDate VARCHAR,modifiedDate VARCHAR,lastSavedToServerDate VARCHAR,deleted VARCHAR,status VARCHAR, notesTemplate VARCHAR, extraHTML VARCHAR, userId INTEGER,sliderValues VARCHAR, FOREIGN KEY(userId) REFERENCES Login(userid))');
     db.close();
  }
  createBook();
  //1.9 SDK7 added export
  exports.createBook = createBook;
	
	
	function insertBook(book_Contents,book_Name,book_Guid,book_Image,book_Type,isDeleted,status,createdDate,editedDate,isManuallyAdded,lastSavedToServer,user_Id, notesTemplate, extraHTML, sliderValues)
	{
		var db = Titanium.Database.open('Miscue');
		db.execute("INSERT INTO UserBook (bookContents,bookName,bookGuid,bookImage,bookType,deleted,status,createdDate,modifiedDate,isManuallyAdded,lastSavedToServerDate,userId, notesTemplate, extraHTML,sliderValues) VALUES ('" + book_Contents + "','" + book_Name + "','" + book_Guid + "','" + book_Image + "','" + book_Type + "','" + isDeleted + "','" + status + "','" + createdDate +"','"+editedDate +"','"+ isManuallyAdded +"','" + lastSavedToServer +"','" + user_Id + "','" + notesTemplate + "', '" + extraHTML +"', '" + sliderValues +"')");
		
		db.close();	
	}
	//1.9 SDK7 added export
	exports.insertBook = insertBook;
	
	
  //MiscueSession table	
  function createMiscueSession()
  {
     var db = Titanium.Database.open('Miscue');
  //  db.execute("DROP TABLE IF EXISTS MiscueSession");
     db.execute('CREATE TABLE IF NOT EXISTS MiscueSession (sessionId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT ,sessionGuid VARCHAR, userId INTEGER, miscueDataXml VARCHAR, sessiondate VARCHAR, bookGUID VARCHAR, sessionStatus VARCHAR, learnerGuid VARCHAR, accuracyValue VARCHAR, sessionNotes VARCHAR, lastModifiedDate DATE, lastSavedToServerDate DATE, isLastEditedSession VARCHAR, isSessionModified VARCHAR, recordedAudioFilename VARCHAR, createdDate TEXT, createdTime TEXT,sliderValue VARCHAR)');
     db.close();
  }
  createMiscueSession();
  //1.9 SDK7 added export
  exports.createMiscueSession = createMiscueSession;
  
  
  function insertMiscueSession (session_Guid,user_Id,msicue_DataXml,session_Date,book_GUID,session_Status,learner_Guid,accuaracy_Value,session_Notes,lastmodified_Date,lastSavedServer_Date,isLastEdited_Session,isSession_Modified, recordedAudioFilename, createdDate, createdTime) 
  {
   var db = Titanium.Database.open('Miscue');
     db.execute("INSERT INTO MiscueSession (sessionGuid, userId, miscueDataXml, sessiondate, bookGUID,  sessionStatus,learnerGuid,accuracyValue,sessionNotes,lastModifiedDate,lastSavedToServerDate,isLastEditedSession,isSessionModified,recordedAudioFilename, createdDate, createdTime) VALUES ( '"+ session_Guid + "','" + user_Id + "','" + msicue_DataXml + "','" + session_Date + "','" + book_GUID + "','" + session_Status + "','" + learner_Guid + "','" + accuaracy_Value + "','" + session_Notes + "','" + lastmodified_Date + "','" + lastSavedServer_Date + "','" + isLastEdited_Session + "','" + isSession_Modified + "','" + recordedAudioFilename + "','" + createdDate + "','" + createdTime + "')");
     db.close(); 
   }
   //1.9 SDK7 added export
   exports.insertMiscueSession = insertMiscueSession;

  function createMiscueSessionItem()
  {
     var db = Titanium.Database.open('Miscue');
   // db.execute("DROP TABLE IF EXISTS MiscueSessionItem");
     db.execute('CREATE TABLE IF NOT EXISTS MiscueSessionItem (miscueItemId INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, miscueSessionId INTEGER, noteText VARCHAR, miscueMenu VARCHAR, indexOfWord INTEGER, startChar INTEGER, endChar INTEGER,apiRef VARCHAR, additionalInfo VARCHAR)');
     db.close();
  }
  createMiscueSessionItem();
  //1.9 SDK7 added export
  exports.createMiscueSessionItem = createMiscueSessionItem;
  

  function insertMiscueSessionItem(miscuesessionid, noteText, miscuemenu,indexofword, startChar,endChar,additionalInfo,apiRef)
  {
     var db = Titanium.Database.open('Miscue');
     
     db.execute("INSERT INTO MiscueSessionItem (miscueSessionId,  noteText, miscueMenu, indexOfWord,  startChar,endChar,additionalInfo,apiRef) VALUES ('" + miscuesessionid + "' ,'" + noteText + "','" + miscuemenu+ "','" + indexofword + "','" + startChar + "','" + endChar + "','" +additionalInfo+ "','" +apiRef+ "')");
     db.close();	
  }
  //1.9 SDK7 added export
  exports.insertMiscueSessionItem = insertMiscueSessionItem;

  //Creating Language table
  function createLanguage() 
  {
     var db = Titanium.Database.open('Miscue');
     //db.execute("DROP TABLE IF EXISTS Language");
     db.execute('CREATE TABLE IF NOT EXISTS Language (langsid INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT , label INTEGER, labelId TEXT, userId VARCHAR, isLastUsedLang VARCHAR)');
     db.close();
  }
  createLanguage();
  //1.9 SDK7 added export
  exports.createLanguage = createLanguage;

  function insertLanguage(labelid,label,userid,islastusedlang)
  {
     var db = Titanium.Database.open('Miscue');
     db.execute("INSERT INTO Language (label,labelId,userId,isLastUsedLang) VALUES ('" + label + "','" + labelid + "','" + userid + "','" + islastusedlang + "')");
     db.close();
  }
//1.9 SDK7 added export
exports.insertLanguage = insertLanguage;
 
 
 
 


 

//1.9 SDK7 - Changed include to require 
var r_loadingScreen = require('/MainMiscue/ui/loadingScreen');

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue'); 

//1.9 SDK7 - Added require for r_LoginPage
var r_LoginPage = require('/MainMiscue/ui/LoginPage');

//1.9 SDK7 - Added require for HomeScreen
var r_HomeScreen = require('/MainMiscue/ui/HomeScreen');

//1.9 SDK7 - Added require for miscueMainPage
var r_miscueMenuPage = require('/MainMiscue/ui/miscueMenuPage');

//1.9 SDK7 - Added require for sessionBookPage
var r_sessionBookPage = require('/MainMiscue/ui/sessionBookPage');

//API request
function createApi(url, strng, text1, text2, flag, modal, apiCount, menuItemKey, button_Id, audioFileName, fontcolour, backcolour, pagefontfamily, isPageName, tableView, sessionCount, fileName, loopEnds, submitSession) {
	
	var xmldata;
	var loginReq = Ti.Network.createHTTPClient();
	/*
	loginReq.clearCookies('https://www.miscue.co.uk/iglooapi/apirequest.aspx');
	loginReq.cache = false;
	loginReq.setRequestHeader('Cache-Control','no-cache');
	loginReq.setRequestHeader('Cache-Control','no-store'); 
	*/

	/* 2ERA -  URL */
	url = Ti.App.Properties.getString("apiURL");
	//mal v177 - audio temp folder bug
	//dont upload old broken audio
	
	if (audioFileName != 'null') 
	{   
		if (Ti.Platform.osname != 'android')
		{
			testFile = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, audioFileName);
			if (testFile.exists()==false)
			{
				//pretend there is no audio
				audioFileName='null';
				//alert('pretending no file');
			}
		}   
	}
	
	Ti.API.info("---------- BEN - audioFileName = " + audioFileName);
	
	if (flag == 7) 
	{
		Ti.API.info("---------- BEN - flag7");
		if (audioFileName != 'null') 
		{
			if (Ti.Platform.osname != 'android') 
			{   
				//alert('upload: '+audioFileName);
				audioFileName = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, audioFileName);
			} 
			else 
			{
				Ti.API.info("---------- BEN - Attempting to change android audioFileName...");
				
				//V1.9 SDK7 - This returns null
				/*
				var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
				audioFileName = Ti.Filesystem.getFile(audioDir.resolve(), audioFileName);
				*/
				
				audioFileName = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, audioFileName);
				
				Ti.API.info("---------- BEN - audioDir = " + Ti.Filesystem.applicationDataDirectory);
				Ti.API.info("---------- BEN - audioFileName changed to = " + audioFileName);
				
				Ti.API.info("---------- BEN - audioFileName changed to (2) = " + audioFileName.nativePath);
				
			}
			var var1 = 'requestXML';
			var name = 'myFile';
			var filename = 'b.b64';
			var boundary = '-------------------------301503177511666';
			var header = "--" + boundary + "\r\n" + "Content-Disposition: form-data;  name=\"requestXML\"\r\n\r\n" + strng + "\r\n\r\n";

			header += "--" + boundary + "\r\n";
			header += "Content-Disposition: form-data; name=\"" + name + "\";";
			header += " filename=\"" + filename + "\"\r\n";
			header += "Content-Type: application/octet-stream\r\n\r\n";
			var content = audioFileName.read();
			Ti.API.info("---------- BEN - content = " + content);
			content = Ti.Utils.base64encode(content);
			Ti.API.info("---------- BEN - content 2 = " + content);
			var fullContent = header + content + "\r\n--" + boundary;
			Ti.API.info("---------- BEN - fullContent = " + fullContent);
			loginReq.open("POST", url);

			loginReq.setRequestHeader('enctype', 'multipart/form-data');
			loginReq.setRequestHeader("Content-type", "multipart/form-data;boundary=\"" + boundary + "\"");
			loginReq.setRequestHeader("Content-Length", fullContent.length);
			loginReq.send(fullContent);
		   	
		}    
		else 
		{   
			loginReq.open("POST", url);
			Ti.API.log("Req url of save session:: ", url);
			var param = {
				"requestXML" : strng
			};
			Ti.API.log("Req param at save session:: ", strng);
			loginReq.send(param);
		}
	} 
	else if (flag == 5) 
	{
		Ti.API.info("---------- BEN - flag 5");
		if (fileName != 'null') 
		{
			if (Ti.Platform.osname != 'android') 
			{
				fileName = Titanium.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
			} 
			else 
			{
				var audioDir = Titanium.Filesystem.getFile(Titanium.Filesystem.externalStorageDirectory, "Miscue");
				fileName = Ti.Filesystem.getFile(audioDir.resolve(), fileName);
			}
			var name = 'myFile';
			var filename = 'b.b64';
			var boundary = '-------------------------301503177511666';
			var header = "--" + boundary + "\r\n" + "Content-Disposition: form-data;  name=\"requestXML\"\r\n\r\n" + strng + "\r\n\r\n";

			header += "--" + boundary + "\r\n";
			header += "Content-Disposition: form-data; name=\"" + name + "\";";
			header += " filename=\"" + filename + "\"\r\n";
			header += "Content-Type: application/octet-stream\r\n\r\n";
			var content = fileName.read();
			content = Ti.Utils.base64encode(content);
			var fullContent = header + content + "\r\n--" + boundary;
			loginReq.open("POST", url);

			loginReq.setRequestHeader('enctype', 'multipart/form-data');
			loginReq.setRequestHeader("Content-type", "multipart/form-data;boundary=\"" + boundary + "\"");
			loginReq.setRequestHeader("Content-Length", fullContent.length);
			loginReq.send(fullContent);
		    
		} 
		else 
		{
			loginReq.open("POST", url);
			var param = {
				"requestXML" : strng
			};
			loginReq.send(param);

		}
	} 
	else 
	{
		loginReq.open("POST", url);
		var param = {
			"requestXML" : strng
		};
		loginReq.send(param);

		// Ti.API.log("Book request api result is :: ", responses.toString());
		Ti.API.log("Api request param is :: ", param);

	}
	
	Ti.API.info("---------- BEN - Should skip to here...");
	
	loginReq.onload = function() 
	{   
		xmldata = this.responseText;
		
		if (Ti.App.Properties.getString("currentAppID")=="ESKIMO") {
		//2ERA - hack the results temporarily
			xmldata = xmldata.replace(/COLV1/g, 'ESKV1');
		}
	
		if (flag === 2) 
		{
			Ti.API.log("XML data for flag==2 is :: ", xmldata);
			//V1.9 SDK7 - Added r_miscueMenuPage
			r_miscueMenuPage.getGroupLearner(xmldata, text1, text2, apiCount, modal);
			//getGroupLearner(xmldata, text1, text2, apiCount, modal);
			
			//miscueMenuPage.js (Line No- 616)
		} 
		else if (flag == 3) 
		{
			Ti.API.log("XML data for flag==3 is :: ", xmldata);
			//V1.9 SDK7 - Added r_LoginPage
			r_LoginPage.getLanguage(xmldata, text1);
			//getLanguage(xmldata, text1);
			//Login.js(line no -645)
		} 
		else if (flag == 4) 
		{
			Ti.API.log("XML data for flag==4 is :: ", xmldata);
			//V1.9 SDK7 - Added r_miscueMenuPage
			r_miscueMenuPage.createBooksTest(xmldata, text1, text2, modal, apiCount, menuItemKey, button_Id);
			//createBooksTest(xmldata, text1, text2, modal, apiCount, menuItemKey, button_Id);
			//miscueMenuPage.js(line No - 717)
		} 
		else if (flag == 5) 
		{
			Ti.API.log("XML data for flag==5 is :: ", xmldata);
			//V1.9 SDK7 - Added r_sessionBookPage
			
			r_sessionBookPage.createSavePendingMiscueSessionToServer(xmldata, text2, menuItemKey, modal, apiCount, sessionCount, button_Id, audioFileName, fontcolour, backcolour, pagefontfamily, isPageName, tableView, text1, loopEnds, submitSession);
			//createSavePendingMiscueSessionToServer(xmldata, text2, menuItemKey, modal, apiCount, sessionCount, button_Id, audioFileName, fontcolour, backcolour, pagefontfamily, isPageName, tableView, text1, loopEnds, submitSession);
			//sessionBookPage.js(line No-291)
		} 
		else if (flag == 7) 
		{
			Ti.API.log("XML data for flag==7 is :: ", xmldata);
			
			//V1.9 SDK7 - Added r_sessionBookPage
			r_sessionBookPage.SaveMiscueSessionToServer(xmldata, text2, apiCount, modal, text1, menuItemKey, button_Id);
			//SaveMiscueSessionToServer(xmldata, text2, apiCount, modal, text1, menuItemKey, button_Id);
			//sessionBookPage.js(line No-291)
		} 
		else if (flag == 1) 
		{
			Ti.API.log("XML data for flag==1 is :: ", xmldata);
			
			//1.9 SDK7 - Added r_LoginPage
			r_LoginPage.callback(xmldata, text1, text2, apiCount, modal);
			//callback(xmldata, text1, text2, apiCount, modal);
			//Login.js(line no-700)
		}
	};
	
	loginReq.onerror = function(e) {
		if (flag == 5) 
		{
			modal.touchEnabled = true;
		}
		var labelArray = new Array();
		labelArray['title'] = ['Alert', 'Alert'];
		labelArray['message'] = ['network_Not_Found. ', 'Network not found. '+url];
		labelArray[1] = ['Ok', 'OK'];
		//V1.9 SDK7 - Added r_HomeScreen
		var dialog = r_HomeScreen.createLocalizedAlertDialog(labelArray, text1);
		//var dialog = createLocalizedAlertDialog(labelArray, text1);
		dialog.show();
		if (flag == 2) 
		{
			dialog.addEventListener('click', function(e) {
				if (e.index == 0) 
				{
					//1.9 SDK7 - Added r_miscue as tt is undefined 
					//var miscuewindow = tt.ui.createmiscueMenuPage(text1, text2, apiCount);
					var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(text1, text2, apiCount);
					miscuewindow.open();
					modal.close();
				}
			});
		}
		if (flag == 4) 
		{
			dialog.addEventListener('click', function(e) 
			{
				if (e.index == 0) 
				{
					//1.9 SDK7 - Added r_miscue as tt is undefined 
					//var miscuewindow = tt.ui.createmiscueMenuPage(text1, text2, apiCount);
					var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(text1, text2, apiCount);
					miscuewindow.open();
					modal.close();
				}
			});
		}
		if (flag == 1) 
		{
			var db = Titanium.Database.open('Miscue');
			var loginIdRow = db.execute('SELECT userid FROM Login WHERE username = ?', text1);
			if (loginIdRow.rowCount > 0) 
			{
				var loginUserId = loginIdRow.fieldByName('userid');
				loginIdRow.close();
				var homescreencheckrow = db.execute('SELECT * FROM UserMenuItem WHERE userId=?', loginUserId);
				if (homescreencheckrow.rowCount > 0) 
				{
					homescreencheckrow.close();
					db.close();
					//1.9 SDK7 - Added r_miscue as tt is undefined 
					//var homeScreenWin = tt.ui.createHomeScreen(text1);
					var homeScreenWin = r_miscue.tt.ui.createHomeScreen(text1);
					homeScreenWin.open();
					modal.close();
				}
			}
			modal.touchEnabled = true;
		}
		if (flag == 7) {
			if (menuItemKey == 'search') {
				var menuItemKeys = 'miscueanalysis';
				//1.9 SDK7 - Added r_miscue as tt is undefined 
				//var searchSession = tt.ui.createsearchSession(text1, text2, button_Id, menuItemKeys);
				var searchSession = r_miscue.tt.ui.createsearchSession(text1, text2, button_Id, menuItemKeys);
				searchSession.open();
				modal.close();
			} 
			else 
			{
				var menuItemKeys = 'miscueanalysis';
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//var miscuewindow = tt.ui.createmiscueMenuPage(text1, button_Id, menuItemKeys);
				var miscuewindow = r_miscue.tt.ui.createmiscueMenuPage(text1, button_Id, menuItemKeys);
				miscuewindow.open();
				modal.close();
			}
		}
		//V1.9 SDK7 - Added r_loadingScreen
		r_loadingScreen.hideActivity();
		//hideActivity();

	};

	loginReq.setTimeout(40000);
}
exports.createApi = createApi;

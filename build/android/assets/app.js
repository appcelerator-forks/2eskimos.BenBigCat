Ti.App.Properties.setString("currentAppID","COLLINS"),null===Ti.App.Properties.getString("registerURL")&&(Ti.App.Properties.setString("doNetworkCheck","1"),Ti.App.Properties.setString("registerLink","0"),Ti.App.Properties.setString("registerURL","https://www.miscue.co.uk/iglooapi/register"),Ti.App.Properties.setString("apiURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx"),Ti.App.Properties.setString("apiLiveURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx"),Ti.App.Properties.setString("apiTestURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx"),Ti.App.Properties.setString("readingResultsMessage","For your reading results visit BigCatAssessment.com")),get_remote_file("https://www.miscue.co.uk/config/"+Ti.App.Properties.getString("currentAppID")+".xml");var r_miscue=require("MainMiscue/miscue.js"),InchValue=6.8,db=Titanium.Database.open("Miscue"),homelogs=db.execute("SELECT * FROM Login WHERE logoutFlag = ?",1);if(0<homelogs.rowCount){var username=homelogs.fieldByName("username"),acstoken=homelogs.fieldByName("accessToken");db.close();var ref=1;r_miscue.tt.app.mainWindow=r_miscue.tt.ui.createHomeScreen(username,acstoken,ref),r_miscue.tt.app.mainWindow.open()}else db.close(),r_miscue.tt.app.mainWindow=r_miscue.tt.ui.createLoginPage(),r_miscue.tt.app.mainWindow.navBarHidden=!0,r_miscue.tt.app.mainWindow.open();function get_remote_file(url){if(url=url+"?g="+Math.random(),Ti.API.info("config url: "+url),Titanium.Network.online){var c=Titanium.Network.createHTTPClient();c.setTimeout(1e4),c.onload=function(){if(200==c.status){Ti.API.info("Ok"),Ti.API.info(this.responseText);for(var keys=this.responseText.split("|"),j=0,i=0;i<keys.length/2;i++)Ti.App.Properties.setString(keys[j],keys[j+1]),Ti.API.info("config: "+keys[j]+" = "+keys[j+1]),j+=2}else Ti.API.info("error")},c.error=function(e){Ti.API.info("error")},c.open("GET",url),c.send()}else Ti.API.info("no internet")};
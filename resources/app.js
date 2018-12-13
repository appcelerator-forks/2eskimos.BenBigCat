/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//We use app.js mainly as a bootstrap file to include our application namespace
//the `tt` namespace 
//There is one additional global variable, $$, which will hold 'styles' for our app

	//Mal - add the application identifier
	Ti.App.Properties.setString("currentAppID","COLLINS");
	
	if (Ti.App.Properties.getString("registerURL")===null){
			Ti.App.Properties.setString("doNetworkCheck","1");
			Ti.App.Properties.setString("registerLink","0");
			Ti.App.Properties.setString("registerURL","https://www.miscue.co.uk/iglooapi/register");
			Ti.App.Properties.setString("apiURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx");
			Ti.App.Properties.setString("apiLiveURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx");
			Ti.App.Properties.setString("apiTestURL","https://www.miscue.co.uk/iglooapi/apirequest.aspx");
			Ti.App.Properties.setString("readingResultsMessage","For your reading results visit BigCatAssessment.com");
	}

	
	get_remote_file("https://www.miscue.co.uk/config/"+Ti.App.Properties.getString("currentAppID")+".xml");
	
	
	//1.9 SDK7 - Changed include to require
	//Ti.include('/MainMiscue/miscue.js');
	var r_miscue = require('MainMiscue/miscue.js');
	
	var InchValue = 6.8;
	var db = Titanium.Database.open('Miscue');
	var homelogs = db.execute('SELECT * FROM Login WHERE logoutFlag = ?',1);
	if(homelogs.rowCount > 0)
	{
		var username = homelogs.fieldByName('username');
		var acstoken = homelogs.fieldByName('accessToken');
		db.close();
		var ref = 1;
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.app.mainWindow = tt.ui.createHomeScreen(username,acstoken,ref);
		r_miscue.tt.app.mainWindow = r_miscue.tt.ui.createHomeScreen(username,acstoken,ref);
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.app.mainWindow.open();
		r_miscue.tt.app.mainWindow.open();
	}
	else
	{
		db.close();
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.app.mainWindow = tt.ui.createLoginPage();
		r_miscue.tt.app.mainWindow = r_miscue.tt.ui.createLoginPage();
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.app.mainWindow.navBarHidden = true;
		r_miscue.tt.app.mainWindow.navBarHidden = true;
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//tt.app.mainWindow.open();
		r_miscue.tt.app.mainWindow.open();
	}
	

function get_remote_file(url) {



		//set pre-login config options - particularly which server to use for the API

    url = url +"?g="+ Math.random();
 
 Ti.API.info("config url: "+url);
 
        if ( Titanium.Network.online ) {
        	
            var c = Titanium.Network.createHTTPClient();	// 1.8.0 trust manager   {validatesSecureCertificate :true} ?
 
            c.setTimeout(10000);
            c.onload = function()
            {
 
                if (c.status == 200 ) {

		   Ti.API.info("Ok");

                
            Ti.API.info(this.responseText);
            var keys = this.responseText.split("|");
          
			var j=0;
			for (var i=0; i<keys.length/2; i++) {
    			Ti.App.Properties.setString(keys[j],keys[j+1] );
    		    Ti.API.info("config: "+keys[j]+" = "+keys[j+1]);
    			j=j+2;
			}


                    
                }
 
                else {
                 
		   		 Ti.API.info("error");
                    
                }
            
 
            };
         
            c.error = function(e)
            {
 
                Ti.API.info("error");
              
            };
            c.open('GET',url);
            c.send();           
        }
        else {
             Ti.API.info("no internet");
        }
 
 
   };



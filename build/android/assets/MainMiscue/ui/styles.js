/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//1.9 SDK7 - Added 'require' for miscue.js to access the 'tt' variable
var r_miscue = require('/MainMiscue/miscue.js'); 

(function() {	
	
	
	
	var pWidth = Ti.Platform.displayCaps.platformWidth;
    var pHeight = Ti.Platform.displayCaps.platformHeight;	
	var width,height;
	
	var t = 2;
	
	function fontsize (width,height) {
		var fontsizes;
	     fontsizes = '16dp';
	 return fontsizes;
	}
	
	var fonts = fontsize(pWidth,pHeight);
	//Ti.API.info(fonts);
	
	
	//Globally available theme object to hold theme colors/constants
	//1.9 SDK7 - Added r_miscue as tt is undefined 
	//tt.ui.theme = {
	r_miscue.tt.ui.theme = {
		textColor:'#000000',
		grayTextColor:'#888888',
		headerColor:'#333333',
		lightBlue:'#006cb1',
		darkBlue:'#93caed',
		textfont:fonts,
		//1.9 SDK7 - Added r_miscue as tt is undefined
		//fontFamily: tt.os({
		fontFamily: r_miscue.tt.os({
			iphone:'Helvetica Neue',
			android:'Droid Sans'
		})
	};
	
   //All shared property sets are declared here.
   //1.9 SDK7 - Added r_miscue as tt is undefined
	//tt.ui.properties = {
	r_miscue.tt.ui.properties = {
		//grab platform dimensions only once to save a trip over the bridge
		platformWidth: Ti.Platform.displayCaps.platformWidth,
		platformHeight: Ti.Platform.displayCaps.platformHeight,
	     
		//var fontsizes = fon 
		//we use these for default components
		Button: {
			height:'50dp',
			color:'white',
			font: {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontSize:tt.ui.theme.textfont,
				fontSize:r_miscue.tt.ui.theme.textfont,
				fontWeight:'bold'
			}
		},
		Label: {
			color :'#000000',
			font: {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontFamily:tt.ui.theme.fontFamily,
				fontFamily:r_miscue.tt.ui.theme.fontFamily,
				fontSize:'12dp'
			},
			height:'auto'
		},
		Window: {
			navBarHidden:true,
			softInputMode:(Ti.UI.Android) ? Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE : ''
		},
		
		
		
		TableView: {
			//backgroundImage:'images/ruff.png',
			backgroundColor:'transparent',
			style:Ti.UI.iPhone.TableViewStyle.PLAIN,
			//separatorStyle:Ti.UI.TableView.separatorStyle.
			separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE
		},
		TableViewRow: {
			//backgroundImage:'images/tweet_bg.png',
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//backgroundSelectedColor: tt.ui.theme.darkBlue, //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
			backgroundSelectedColor: r_miscue.tt.ui.theme.darkBlue, // it's currently inconsistent x-platform //V1.9 SDK7 - Changed selectedBackgroundColor to backgroundSelectedColor as selectedBackgroundColor is deprecated
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//backgroundSelectedColor: tt.ui.theme.darkBlue,
			backgroundSelectedColor: r_miscue.tt.ui.theme.darkBlue,
			className:'tvRow'
		},
		TextField: {
			borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
			font : {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontSize : tt.ui.theme.textfont
                     fontSize : r_miscue.tt.ui.theme.textfont
                         },
			color:'#000',
			borderWidth : '1dp',
           borderColor : '#bbb',
           //borderRadius : 5
		},
		TextArea: {
			borderRadius:'10dp',
			backgroundColor:'#efefef',
			//gradient will only work on iOS
			backgroundGradient:{
				type:'linear',
				colors:[
					{color:'#efefef',position:0.0},
					{color:'#efefef',position:1.0}
				]
			}
		},
		
		//we use these as JS-based 'style classes'
		animationDuration: 500,
		stretch: {
			top:0,bottom:0,left:0,right:0
		},
		variableTopRightButton: {
			top:'5dp',
			right:'5dp',
			height:'30dp',
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//width:tt.os({
			width:r_miscue.tt.os({
				iphone:'60dp',
				android:'auto'
			}),
			color:'#ffffff',
			font: {
				fontSize:'12dp',
				fontWeight:'bold'
			},
			backgroundImage:'images/button_bg_black.png'
		},
		topRightButton: {
			top:'5dp',
			right:'5dp',
			height:'30dp',
			width:'38dp'
		},
		headerText: {
			top:'0dp',
			height:'50dp',
			textAlign:'center',
			//1.9 SDK7 - Added r_miscue as tt is undefined
			//color:tt.ui.theme.headerColor,
			color:r_miscue.tt.ui.theme.headerColor,
			font: {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontFamily:tt.ui.theme.fontFamily,
				fontFamily:r_miscue.tt.ui.theme.fontFamily,
				fontSize:'25dp',
				fontWeight:'bold'
			}
		},
		headerView: {
			backgroundImage:'images/header_bg.png',
			height:'40dp'
		},
		boldHeaderText: {
			
		},
		smallText: {
			color:'black',
			//color:tt.ui.theme.grayTextColor,
			font: {
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontFamily:tt.ui.theme.fontFamily,
				fontFamily:r_miscue.tt.ui.theme.fontFamily,
				//1.9 SDK7 - Added r_miscue as tt is undefined
				//fontSize:tt.ui.theme.textfont,
				fontSize:r_miscue.tt.ui.theme.textfont,
				fontWeight:'bold'
			},
			height:'auto'
		},
		spacerRow: {
			backgroundImage:'images/spacer_row.png',
			height:'30dp',
			className:'spacerRow'
		}
	};
})();



//global shortcut for UI properties,
//namespace, 
//1.9 SDK7 - Added r_miscue as tt is undefined
//var $$ = tt.ui.properties;
var $$ = r_miscue.tt.ui.properties;
//1.9 SDK7 exported this variable
exports.$$ = $$;


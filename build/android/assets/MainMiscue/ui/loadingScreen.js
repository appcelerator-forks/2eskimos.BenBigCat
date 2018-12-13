var actInd;
var indWin;
//var indView;

// show activity
//function to display activity indicator.
function showActivity(labelArray, userId) {
	var labelIdList = new Array();
	labelIdList = labelArray[0];
	//Fteching localized text for all the titles,message and button names
	var db = Titanium.Database.open('Miscue');
	var paramList = [userId];
	paramList = paramList.concat(labelIdList);
	var localizedAlertLabelnamerow = db.execute('SELECT * FROM Language WHERE userId =? AND labelId IN (?)', paramList);

	if (localizedAlertLabelnamerow.rowCount > 0) {
		var labelName = localizedAlertLabelnamerow.fieldByName('label');
		var labelId = localizedAlertLabelnamerow.fieldByName('labelId');
		//Replacing the default values fetch from database
		if (labelArray[0] == labelId) {
			//alert(labelArray[0][1]);
			labelArray[1] = labelName;
		}
		db.close();
	} else {
		db.close();
	}

	// window
	var winHeight = Ti.Platform.displayCaps.platformHeight;
	indWin = Titanium.UI.createWindow({
		fullscreen : false,
		backgroundColor : 'transparent',
		navBarHidden : true,
		tabBarHidden : true,
		//  borderWidth:2,
		//borderRadius:10,
		// borderColor:'transparent',
		opacity : 0.9,
		height : '100%',
		width : '100%'
	});

	// black view
	var indView = Titanium.UI.createView({
		height : '70dp',
		width : '160dp',
		backgroundColor : 'black',
	});

	indWin.add(indView);

	// loading indicator
	var style;
	if (Ti.Platform.name === 'iPhone OS') {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
	} else {
		style = Titanium.UI.ActivityIndicatorStyle.DARK;
	}

	actInd = Titanium.UI.createActivityIndicator({
		style : style,
		color : 'white',
		height : 'auto',
		message : labelArray[1],
		width : 'auto',
		indicatorColor : '#aaa',
		indicatorDiameter : 50
	});
	indWin.add(actInd);

	indWin.addEventListener('open', function(e) {
		if(Ti.Platform.osname == 'android'){
			indWin.activity.actionBar.hide();
		}		
	}); 

	indWin.open();
	actInd.show();

}
//1.9 SDK7 - Exported showActivity
exports.showActivity = showActivity;

function hideActivity() {
	actInd.hide();
	indWin.close();
}
//1.9 SDK7 - Exported hideActivity
exports.hideActivity = hideActivity;

/// function to determine android device is smartphone or tab
function screenInch() {
	var dpi = Ti.Platform.displayCaps.dpi;
	var screenWidthInInches = Ti.Platform.displayCaps.platformWidth / dpi;
	var screenHeightInInches = Ti.Platform.displayCaps.platformHeight / dpi;

	// Calculation to get screen/device inch to determine wheather the device is android tab or smartphone
	var maxInches = Math.sqrt(screenWidthInInches * screenWidthInInches + screenHeightInInches * screenHeightInInches);
	return maxInches;
}
//1.9 SDK7 added export
exports.screenInch = screenInch;

function titleLabeltop() {
	var maxInch = screenInch();
	if (maxInch >= 4.5) {
		var top = '75dp';
		var miscueLabel = '125dp';
		var tableViewtop = '195dp';
		var rowHeight = '105dp';
		var viewHeight = '80dp';
		var labelLeft = '115dp';
		var viewWidth = '92dp';

	} else {
		var top = '55dp';
		var miscueLabel = '85dp';
		var tableViewtop = '115dp';
		var rowHeight = '60dp';
		var viewHeight = '50dp';
		var labelLeft = '85dp';
		var viewWidth = '65dp';
	}
	return [top, miscueLabel, tableViewtop, rowHeight, viewHeight, labelLeft, viewWidth];
}
//V1.9 SDK7 - Added export
exports.titleLabeltop = titleLabeltop;

function dptopixel(TheDPUnits) {
	var osname = Ti.Platform.osname;
	var maxInches = screenInch();
	var vWidth = Ti.Platform.displayCaps.platformWidth;
	var vHeight = Ti.Platform.displayCaps.platformHeight;
	if (TheDPUnits == 115) {
		TheDPUnits = 115;
	} else {
		if (maxInches >= 4.5) {
			TheDPUnits = 220;
		} else {
			TheDPUnits = 115;

		}
	}
	var DENSITY_SMALL_LDPI = 130;
	var DENSITY_BASELINE_MDPI = 160;
	var DENSITY_HIGH_HDPI = 240;
	var DENSITY_EXTRA_HIGH_XHDPI = 320;
	var DENSITY_EXTRA_HIGH_RETINA = 260;
	var HIGH_XHDPI_VAL;
	if (Ti.Platform.osname == 'android') {
		HIGH_XHDPI_VAL = 160;
	} else {
		HIGH_XHDPI_VAL = 320;
	}
	//alert(Ti.Platform.displayCaps.dpi);
	switch (Ti.Platform.displayCaps.dpi) {
	case DENSITY_SMALL_LDPI:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / 130);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / 130);
		break;

	case DENSITY_BASELINE_MDPI:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / 160);
		break;

	case DENSITY_HIGH_HDPI:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / 160);
		break;

	case DENSITY_EXTRA_HIGH_XHDPI:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / HIGH_XHDPI_VAL);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / HIGH_XHDPI_VAL);
		break;

	case DENSITY_EXTRA_HIGH_RETINA:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / 260);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / 260);
		break;

	default:
		var imgdpval = TheDPUnits * (Titanium.Platform.displayCaps.dpi / 160);
		var dpval = (vWidth / 2) - (imgdpval / 2);
		var pxl = dpval / (Titanium.Platform.displayCaps.dpi / 160);
	}

	return pxl;
}
//V1.9 SDK7 - Added exports
exports.dptopixel = dptopixel;

function imageLayout(usrname) {
	var Inch = screenInch();
	var db = Titanium.Database.open('Miscue');
	var homelog = db.execute('SELECT * FROM Login WHERE username  = ?', usrname);
	var uids = homelog.fieldByName('userId');
	homelog.close();
	var homerow = db.execute('SELECT * FROM UserSetting where loginId =?', uids);
	// Extracting the usersetting values from local database
	var pagelogo = homerow.fieldByName('logos');
	homerow.close();
	db.close();

	var imgview = Ti.UI.createView({
		backgroundColor : 'transparent',
		top : '3dp',
	});

	if (Inch >= InchValue) {
		imgview.height = '65dp';
		imgview.width = '220dp';
	} else {
		imgview.height = '50dp';
		imgview.width = '115dp';
	}

	var image = Ti.UI.createImageView({
		defaultImage : '/images/phase5/NOIMAGE.png',
		image : pagelogo,
		height : 'auto',
		width : 'auto',
		top : 1
	});

	imgview.add(image);
	return imgview;
}

// Function to test if device is iOS 7 or later
function isiOS7Plus() {
	// iOS-specific test
	if (Titanium.Platform.name == 'iPhone OS') {
		var version = Titanium.Platform.version.split(".");
		var major = parseInt(version[0], 10);

		// Can only test this support on a 3.2+ device
		if (major >= 7) {
			return major;
		}
	}

	return major;
}
//V1.9 SDK7 - Added export
exports.isiOS7Plus = isiOS7Plus;

//Function create back button
function createBackButton(fontcolour, backImage) {
	var backView = Ti.UI.createView({
		backgroundColor : 'transparent',
		left : '5dp',
		height : 80,
		width : 145,
		top : (Ti.Platform.osname == 'iphone') ? 4 : 10
	});

	var backButtonImage = Ti.UI.createImageView({
		defaultImage : '/images/BACK_BUTTON.png',
		top : 0,
		height : Titanium.UI.SIZE,
		width : Titanium.UI.SIZE,
		//color:fontcolour,
		image : backImage,
		left : 0
	});

	backView.add(backButtonImage);
	return backView;
}
//V1.9 SDK7 - Added export
exports.createBackButton = createBackButton;

//Function to calculate center x n y value to make background image to center
function BackgroundImageCenterValue() {
	if (Ti.Platform.osname == 'android') {
		xCenterValue = (Ti.Platform.displayCaps.platformWidth / 2);
		//In android, converting xCenterValue pixel value to dp value
		xCenterValue = (xCenterValue / (Titanium.Platform.displayCaps.dpi / 160));
		yCenterValue = (Ti.Platform.displayCaps.platformHeight / 2);
		//In android, converting yCenterValue pixel value to dp value
		yCenterValue = (yCenterValue / (Titanium.Platform.displayCaps.dpi / 160));
	} else {
		xCenterValue = (Ti.Platform.displayCaps.platformWidth / 2);
		yCenterValue = (Ti.Platform.displayCaps.platformHeight / 2);
	}
	return [xCenterValue, yCenterValue];
}

///Function to calculate aspect ratio for adding background image height and width
function backgroundImageHeightWidthPxToDp() {
	/// here calculating aspect ratio for width and height should be screen height(appear non strechable image).
	/// It should be top and center aligned
	///It will crop right, left and bottom side based on screen size of device

	var Inch = screenInch();
	if (Ti.Platform.osname == 'android') {

		var screenWidth = (Titanium.Platform.displayCaps.platformWidth / (Titanium.Platform.displayCaps.dpi / 160));
		var screenHeight = (Titanium.Platform.displayCaps.platformHeight / (Titanium.Platform.displayCaps.dpi / 160));
		/*if(Inch < 4.5)
		{
		var screenWidth = (2048/1024)*Ti.Platform.displayCaps.platformHeight;

		}
		else
		{
		var screenWidth = (4096/2048)*Ti.Platform.displayCaps.platformHeight;
		}*/
		/// Converting screenwidth pixel value to dp value(only in android)
		//  screenWidth = (screenWidth / (Titanium.Platform.displayCaps.dpi / 160));
		// var screenHeight = Ti.Platform.displayCaps.platformHeight;
		/// Converting screenheight pixel value to dp value(only in android)
		// screenHeight = (screenHeight / (Titanium.Platform.displayCaps.dpi / 160));
	}
	else {
		/*
		 if(Ti.Platform.osname == 'ipad')
		 {
		 var screenWidth = (4096/2048)*Ti.Platform.displayCaps.platformHeight;
		 }
		 else
		 {
		 var screenWidth = (2048/1024)*Ti.Platform.displayCaps.platformHeight;
		 }
		 var screenHeight = Ti.Platform.displayCaps.platformHeight;*/

		var screenWidth = (Titanium.Platform.displayCaps.platformWidth);
		var screenHeight = (Titanium.Platform.displayCaps.platformHeight);

	}
	return [screenWidth, screenHeight];
}
//1.9 SDK7 added export
exports.backgroundImageHeightWidthPxToDp = backgroundImageHeightWidthPxToDp;

// Function to create background image for select group, learner, book, session and search page
function mainBackgroundImage(backImage) {
	var mainBackgroundImageView = Ti.UI.createView({
		backgroundColor : 'transparent',
		height : Titanium.UI.FILL,
		width : Titanium.UI.FILL,
	});

	var mainBackgroundImage = Ti.UI.createImageView({
		top : '0dp',
		//defaultImage : '/images/default.png',
		//backgroundColor:'#D8E028',
		image : backImage,
	});

	mainBackgroundImageView.add(mainBackgroundImage);
	return [mainBackgroundImageView, mainBackgroundImage];
}
//V1.9 SDK7 - Added export
exports.mainBackgroundImage = mainBackgroundImage;

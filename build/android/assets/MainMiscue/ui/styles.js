var r_miscue=require('/MainMiscue/miscue.js');(function(){function fontsize(width,height){var fontsizes;return fontsizes='16dp',fontsizes}var width,height,pWidth=Ti.Platform.displayCaps.platformWidth,pHeight=Ti.Platform.displayCaps.platformHeight,t=2,fonts=fontsize(pWidth,pHeight);r_miscue.tt.ui.theme={textColor:'#000000',grayTextColor:'#888888',headerColor:'#333333',lightBlue:'#006cb1',darkBlue:'#93caed',textfont:fonts,fontFamily:r_miscue.tt.os({iphone:'Helvetica Neue',android:'Droid Sans'})},r_miscue.tt.ui.properties={platformWidth:Ti.Platform.displayCaps.platformWidth,platformHeight:Ti.Platform.displayCaps.platformHeight,Button:{height:'50dp',color:'white',font:{fontSize:r_miscue.tt.ui.theme.textfont,fontWeight:'bold'}},Label:{color:'#000000',font:{fontFamily:r_miscue.tt.ui.theme.fontFamily,fontSize:'12dp'},height:'auto'},Window:{navBarHidden:!0,softInputMode:Ti.UI.Android?Ti.UI.Android.SOFT_INPUT_ADJUST_RESIZE:''},TableView:{backgroundColor:'transparent',style:Ti.UI.iPhone.TableViewStyle.PLAIN,separatorStyle:Ti.UI.iPhone.TableViewSeparatorStyle.SINGLE_LINE},TableViewRow:{backgroundSelectedColor:r_miscue.tt.ui.theme.darkBlue,backgroundSelectedColor:r_miscue.tt.ui.theme.darkBlue,className:'tvRow'},TextField:{borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,font:{fontSize:r_miscue.tt.ui.theme.textfont},color:'#000',borderWidth:'1dp',borderColor:'#bbb'},TextArea:{borderRadius:'10dp',backgroundColor:'#efefef',backgroundGradient:{type:'linear',colors:[{color:'#efefef',position:0},{color:'#efefef',position:1}]}},animationDuration:500,stretch:{top:0,bottom:0,left:0,right:0},variableTopRightButton:{top:'5dp',right:'5dp',height:'30dp',width:r_miscue.tt.os({iphone:'60dp',android:'auto'}),color:'#ffffff',font:{fontSize:'12dp',fontWeight:'bold'},backgroundImage:'images/button_bg_black.png'},topRightButton:{top:'5dp',right:'5dp',height:'30dp',width:'38dp'},headerText:{top:'0dp',height:'50dp',textAlign:'center',color:r_miscue.tt.ui.theme.headerColor,font:{fontFamily:r_miscue.tt.ui.theme.fontFamily,fontSize:'25dp',fontWeight:'bold'}},headerView:{backgroundImage:'images/header_bg.png',height:'40dp'},boldHeaderText:{},smallText:{color:'black',font:{fontFamily:r_miscue.tt.ui.theme.fontFamily,fontSize:r_miscue.tt.ui.theme.textfont,fontWeight:'bold'},height:'auto'},spacerRow:{backgroundImage:'images/spacer_row.png',height:'30dp',className:'spacerRow'}}})();var $$=r_miscue.tt.ui.properties;exports.$$=$$;
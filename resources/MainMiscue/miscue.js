/**
* Appcelerator Titanium Platform
* Copyright (c) 2009-2011 by Appcelerator, Inc. All Rights Reserved.
* Licensed under the terms of the Apache Public License
* Please see the LICENSE included with this distribution for details.
**/

//All application functionality is namespaced here

//1.9 SKD7 - Changed "var tt" to "exports.tt"
//var tt = {};
exports.tt = {};

//1.9 SDK7 - Changed tt.ui to exports.tt.ui because tt did not exist
//tt.ui = {};
exports.tt.ui = {};
 
(function() {
	
	//application state variables are held in this namespace.  
	//Like the current app window, for instance, which is created in app.js
	
	//1.9 SDK7 - Changed tt.app to exports.tt.app because tt did not exist
	//tt.app = {};
	exports.tt.app = {};
	
	//Extend an object with the properties from another 
	//(thanks Dojo - http://docs.dojocampus.org/dojo/mixin)
	var empty = {};
	function mixin(/*Object*/ target, /*Object*/ source){
		var name, s, i;
		for(name in source)
		{
			s = source[name];
			if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s)))
			{
				target[name] = s;
			}
		}
		return target; // Object
	};
	
	//1.9 SDK7 - Changed tt.mixin to exports.tt.mixin because tt did not exist
	//tt.mixin = function(/*Object*/ obj, /*Object...*/ props)
	exports.tt.mixin = function(/*Object*/ obj, /*Object...*/ props)
	{
		if(!obj){ obj = {}; }
		for(var i=1, l=arguments.length; i<l; i++)
		{
			mixin(obj, arguments[i]);
		}
		return obj; // Object
	};
	
	//create a new object, combining the properties of the passed objects with the last arguments having
	//priority over the first ones
	
	//1.9 SDK7 - Changed tt.combine to exports.tt.combine because tt did not exist
	//tt.combine = function(/*Object*/ obj, /*Object...*/ props) 
	exports.tt.combine = function(/*Object*/ obj, /*Object...*/ props)
	{
		var newObj = {};
		for(var i=0, l=arguments.length; i<l; i++)
		{
			mixin(newObj, arguments[i]);
		}
		return newObj;
	};
	
	//OS, Locale, and Density specific branching helpers adapted from the Helium library
	//for Titanium: http://github.com/kwhinnery/Helium
	var locale = Ti.Platform.locale;
	var osname = Ti.Platform.osname;

	// Branching logic based on locale
	
	//1.9 SDK7 - Changed tt.locale to exports.tt.locale because tt did not exist
	//tt.locale = function(/*Object*/ map)
	exports.tt.locale = function(/*Object*/ map)
	{
		var def = map.def||null; //default function or value
		if (map[locale]) 
		{
			if (typeof map[locale] == 'function') 
				{ return map[locale](); }
			else 
				{ return map[locale]; }
		}
		else 
		{
			if (typeof def == 'function') 
				{ return def(); }
			else 
				{ return def; }
		}
	};

	// Branching logic based on OS

	//1.9 SDK7 - Changed tt.os to exports.tt.os because tt did not exist
	//tt.os = function(/*Object*/ map)
	exports.tt.os = function(/*Object*/ map)  
	{
		var def = map.def||null; //default function or value
		if (typeof map[osname] != 'undefined') 
		{
			if (typeof map[osname] == 'function') 
				{ return map[osname](); }
			else 
				{ return map[osname]; }
		}
		else 
		{
			if (typeof def == 'function') 
				{ return def(); }
			else 
				{ return def; }
		}
	};
})();

//1.9 SDK7 - Removed as includes are deprecated in SKD7
//Include additional miscue namespaces
//Ti.include('/MainMiscue/ui/LoginPage.js');
var r_LoginPage = require('/MainMiscue/ui/LoginPage');

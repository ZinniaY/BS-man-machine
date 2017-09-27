/**
 * jQuery plugin for Pretty looking right click context menu.
 *
 * Requires popup.js and popup.css to be included in your page. And jQuery, obviously.
 *
 * Usage:
 *
 *   $('.something').contextPopup({
 *     title: 'Some title',
 *     items: [
 *       {label:'My Item', icon:'/some/icon1.png', action:function() { alert('hi'); }},
 *       {label:'Item #2', icon:'/some/icon2.png', action:function() { alert('yo'); }},
 *       null, // divider
 *       {label:'Blahhhh', icon:'/some/icon3.png', action:function() { alert('bye'); }},
 *     ]
 *   });
 *
 * Icon needs to be 16x16. I recommend the Fugue icon set from: http://p.yusukekamiyamane.com/ 
 *
 * - Joe Walnes, 2011 http://joewalnes.com/
 *   https://github.com/joewalnes/jquery-simple-context-menu
 *
 * MIT License: https://github.com/joewalnes/jquery-simple-context-menu/blob/master/LICENSE.txt
 */
jQuery.fn.contextDialog = function(menuData) {
	// Define default settings
	
	// merge them
  // Build popup menu HTML
  function createDialog(menuData) {
    var dialog = $('<div id = "standard-dialogBox"></div>');
    dialog.appendTo(document.body);
    dialog.dialogBox(menuData);
  
  };

  // On contextmenu event (right click)
  this.bind('contextmenu', function(e) {
    createDialog(menuData);
    console.log(this);
    return false;
  });

  return this;
};


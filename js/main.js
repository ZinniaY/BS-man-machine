require.config({
	baseUrl: "js",
	paths: {
		"jquery": "../lib/jquery-1.12.4.min",
		"jquery-ui": "../lib/jquery-ui.min",
		"dialogBox":"../js/dialogBox",
		"jquery.contextmenu": "../lib/jquery.contextmenu"
	},
	shim:{
		"jquery.contextmenu":{
			deps:["jquery"]
		},
		"dialogBox":{
			deps:["jquery"]
		}
	}
});
require(["jquery","toSvg","jquery.contextmenu","dialogBox"],function($,toSvg){
	var svg = document.getElementById("svg");
	toSvg('QZ.dayuanbiandianzhan.fac.pic',svg);
	
	$('.CBreaker').contextPopup({
		// title:"开关操作",
		hasgutterLine:true,
		items:[
			{label:"开关操作", icon:'icons/book-open-list.png',  action:function(){
				return {type:'',title:'开关操作'}
			}
			}
		]
	});
	
	$('.Generator').contextPopup({
		title:"发电机操作",
		hasgutterLine:true,
		items:[
			{label:"出力调整",icon:'icons/book-open-list.png',action:function(e){
				return {type:'adjust',
					title:'出力调整'};
				// $(e.target).dialogBox({
				
				// });
				// console.log(e.target);
			}},
			{label:"机组投切",icon:'icons/book-open-list.png',action:function(){alert('click2')}},
			{label:"测点信息",icon:'icons/book-open-list.png',action:function(){alert('click3')}}
		
		]
	});
	
	
	$('.EnergyConsumer').contextPopup({
		title:"负荷",
		hasgutterLine:true,
		items:[
			{label:"调整负荷",icon:'icons/book-open-list.png',action:function(){alert('click1')}},
			{label:"负荷投切",icon:'icons/book-open-list.png',action:function(){alert('click2')}},
			{label:"测点信息",icon:'icons/book-open-list.png',action:function(){alert('click3')}}
		
		]
	});
	
	$('.Transformer2,.Transformer3').contextPopup({
		title:'变压器',
		hasgutterLine:true,
		items:[
			{label:"调整分接头", icon:'icons/book-open-list.png' ,action:function(){alert('click1')}},
			{label:"变压器投切", icon:'icons/book-open-list.png' ,action:function(){alert('click2')}},
			{label:"测点信息", icon:'icons/book-open-list.png' ,action:function(){alert('click3')}}
		
		]
		
	});
	
});
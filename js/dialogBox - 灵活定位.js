;(function($){
	var pluginName = 'dialogBox',
		defaults = {
			width:400,
			zIndex:99999,
			hasMask:true,
			draggable:true,
			title:'',
			contentTitle:'',
			effect:'',
			type:'adjust',
			loadInfo : {
				'编号':'abcdefggadfasdfsda',
				'名称':'abcdefggadfasdfsda',
				'负荷':'adfadfafasfasfewfwee'
			},
			generatorInfo : {
				'编号':'abcdefggadfasdfsda',
				'名称':'abcdefggadfasdfsda',
				'出力':'adfadfafasfasfewfwee'
			},
			transformInfo :{
				'编号':'adfadfafafsfasfas',
				'名称':'dfasfasfafdsasfas'
			},

			infoList : [
				['容抗开关',['adfadfad','adfasdfasdf','adfadfasdff']],
				['开关刀闸',['adfadfdf','adfadfadf','adfadfadfa']]
			],

			breakInfo : {
				'开关标识':'dfasdfasdfafasdfasd',
				'开关描述':'adfadfadfasdfasfasdfad',
				'操作方向':{'close':true,'open':false}
			}

		};

	function DialogBox(element,options){
		this.element = element;
		this.settings = $.extend({},defaults,options);
		this.init();
	}

	DialogBox.prototype = {
		init:function(){
			var that = this,
				element = this.element;
				console.log(element);
				that.render(element);
				that.setStyle();
				that.show();

				that.trigger(element);
		},
		create: function(){
			var that = this,
			title = that.settings.title,
			hasMask = that.settings.hasMask,
			dialogHTML = [];

			dialogHTML[0] = '<section class = "dialog-box"><div class = "dialog-box-container"><div class = "dialog-box-title"><h3>'+title+'</h3><div class = "dialog-box-close">×</div></div><div class = "dialog-box-content"><div class = "widget"></div><div class = "dialog-box-footer"><div class = "btnGroup"><input type = "button" value = "确定"><input type = "button" value = "取消"><input type = "button" value = "确定并取消计算"></div></div></div></div></section>';
			dialogHTML[1] = '<div id = "dialog-box-mask"></div>'

			return dialogHTML;
		},
		render:function(element){//添加内容
			var that = this,
			$this = $(element),
			dialogHTML = that.create();
			$(dialogHTML[0]+dialogHTML[1]).appendTo(document.body);//添加新div到body上
			if(that.settings.contentTitle){
				$('<p>'+that.settings.contentTitle+'</p>').appendTo('.widget');
			}
			if(that.settings.type == 'adjust'){
				if($.trim($this.text())=='负荷调整'){
					var fieldset1 = $('<fieldset><legend>标识</legend></fieldset>').appendTo('.widget');
						content1Inner = '';
					$.each(that.settings.loadInfo,function(i,val){//loadInfo通过读文件得到
						content1Inner += '<div class = "content1"><label>'+i+'</label><span>'+val + '</span></div>'
					});
					$(content1Inner).insertAfter(fieldset1.find('legend'));

					var fieldset2 = $('<fieldset><legend>负荷</legend></fieldset>').appendTo('.widget');
					var content2Inner = '<div class="content2"><input type="button" value="切负荷"><span>切负荷使负荷为零</span></div><div class="content2"><label for="yougong">有功</label><input id="yougong" type="text" name="yougong" placeholder="yougong"></div><div class="content2"><label for="wugong">无功</label><input id="wugong" type="text" name="wugong" placeholder="wugong"></div>';//后期需要修改
					$(content2Inner).insertAfter(fieldset2.find('legend'));
				}else if($.trim($this.text())=='出力调整'){
					var fieldset1 = $('<fieldset></fieldset>').appendTo('.widget');
					$('<legend>标识</legend>').appendTo(fieldset1);
						content1Inner = '';
					$.each(that.settings.generatorInfo,function(i,val){//
						content1Inner += '<div class = "content1"><label>'+i+'</label><span>'+val + '</span></div>'
					});
					$(content1Inner).appendTo(fieldset1);

					var fieldset2 = $('<fieldset><legend>出力</legend></fieldset>').appendTo('.widget');
					var content2Inner = '<div class="content2"><label for="yougong">有功</label><input id="yougong" type="text" name="yougong" placeholder="yougong"></div><div class="content2"><div class="btnGroup" id="activePowerAdjust"><input type="button" value="立即升满"><input type="button" value="增加10%"><input type="button" value="减小10%"><input type="button" value="减小至0"></div></div>';
					$(content2Inner).insertAfter(fieldset2.find('legend'));
					var fieldset3 =  $('<fieldset><legend>电压</legend></fieldset>').appendTo('.widget');
					var content3Inner = '<div class="content3"><label for="dianya">电压手动</label><input id = "dianya" type="text" name="dianya" placeholder="电压"></div><div class="content3"><div class="btnGroup"><input type="button" value="电压上升1%"><input type="button" value="电压下降1%"></div></div><div class="content3 busControl"><input type="button" value="控制母线"><div id = "busInfo"><div id="busId"><label for="busid">母线id</label><input id = "busid" name = "busId" type="text" value = "aafdjakfjal"></div><div id="busDescribe"><label for="describe">描述</label><input id = "describe" name = "describe" type="text" value = "aaaaaaa"></div></div></div>';
					$(content3Inner).insertAfter(fieldset3.find('legend'));

					var fieldset4 =  $('<fieldset><legend>控制4</legend></fieldset>').appendTo('.widget');
					var content4Inner = '<div class="content4"><div id="adjust"><input type="checkbox" name="checkbox-yg" id = "chekbox-yg"><label for="checkbox-yg">有功调节</label><input type="checkbox" name="checkbox-wg" id = "chekbox-wg"><label for="checkbox-wg">无功调节</label></div></div><div class="content4"><p>分担因子</p><input type="text" value = "1.0" id="parameter"></div>';
					$(content4Inner).insertAfter(fieldset4.find('legend'));

				}else if($.trim($this.text())=='变压器分接头调整'){
					var fieldset1 = $('<fieldset><legend>标识</legend></fieldset>').appendTo('.widget');
						content1Inner = '';
					$.each(that.settings.transformInfo,function(i,val){//
						content1Inner += '<div class = "content1"><label>'+i+'</label><span>'+val + '</span></div>'
					});
					$(content1Inner).insertAfter(fieldset1.find('legend'));

					var contentInner = '';
					[['高压',4],['中压',8],['低压',8]].forEach(function(item,index){
						contentInner += '<fieldset><legend>'+item[0]+'</legend><div class="content'+(index+2)+ '"'+'><label for="yougong">'+item[0]+'侧抽头位置</label><span>'+item[1]+'</span></div>';
						if(item[0] == '低压'){
							contentInner += '<div class="content'+(index+2)+ '"'+'><p>分担因子</p><input type="text" value = "1.0" id="parameter">';
							};
						contentInner +='<div class="content'+(index+2)+ '"'+'><div class="btnGroup"><input type="button" disabled="disabled" value="增加抽头"><input type="button" disabled="disabled" value="较少抽头"></div></div></fieldset>';
						});


					$(contentInner).appendTo('.widget');	
				}
				
			}else if(that.settings.type == 'switch'){
				if(that.settings.infoList.length > 0){
					that.settings.infoList.forEach(function(item,index){
					var fieldset = $('<fieldset></fieldset>').appendTo('.widget');
					$('<legend>'+ item[0]+'</legend>').appendTo(fieldset);
					if(item[1].length > 0){
						var ul = $('<ul class = "list"></ul>').appendTo(fieldset);
						var liList = '';
						item[1].forEach(function(items,i){
							liList += '<li><input type = "checkbox"><span>'+ items +'</span></li>'
						});
					$(liList).appendTo(ul);
					}else{
						$('<p>没有找到与该'+item[0]+'</p>').appendTo(fieldset);
					}
				});
				}else{
					$('<fieldset><p>没有找到相应设备</p></fieldset>').appendTo('.widget');
				}
				
				$('.dialog-box-footer .btnGroup input:eq(2)').val('应用');
			}else{

				$.each(that.settings.breakInfo,function(key,val){
					var fieldset = $('<fieldset></fieldset>').appendTo('.widget');
					$('<legend>'+ key +'</legend>').appendTo(fieldset);
					if(key == '操作方向'){
						$('<div class="content3"><div class="btnGroup"><input type="button" value = "闭合"><input type="button" value = "断开"></div></div>').appendTo(fieldset);
						$("input[value='闭合']").attr('disabled',val['close']&&'disabled');
						$("input[value='断开']").attr('disabled',val['open']&&'disabled');
						
					}else{
						$('<p>' + val + '</p>').appendTo(fieldset);
					}
					
				});
				
			}

		},

		show:function(){
			var scrollTop = $(window).scrollTop();
			var scrollLeft = $(window).scrollLeft();
			$('.dialog-box').css({display:'block'});
			
			setTimeout(function(){
				$('.dialog-box').addClass('show');	
			},50);
			$(window).scroll(function(){
				$(window).scrollTop(scrollTop);
				$(window).scrollLeft(scrollLeft);
			});
						
			$('.dialog-box').draggable();
			$('#dialog-box-mask').show();
		},

		hide:function(element){
			var $dialogBox = $('.dialog-box'),
			    $dialogMask = $('#dialog-box-mask')
			setTimeout(function(){
				$dialogBox.remove();
				$dialogMask.remove();
				$(element).data("plugin_" + pluginName,'');		
			},150);
			$(window).unbind('scroll');
			
		},

		setStyle:function(){
			var that = this;
			
			var offset = $(this.element).offset();
			var elewidth = $(this.element).width();
			var top = offset.top,
				left = offset.left + 5;
			var reltop = top - $(document).scrollTop();
			var relleft = left - $(document).scrollLeft();
    		if ((reltop + (1/4)*$('.dialog-box').height()) >= $(window).height()) {
        			reltop -= (3/4)*$('.dialog-box').height();
    			}
    		if ((relleft + $('.dialog-box').width()) >= $(window).width()) {
        			relleft -= $('.dialog-box').width();
        			relleft -= elewidth;
    		}
    		$('.dialog-box').css({
    			left:relleft,
    			top:reltop
    		});
			$('#dialog-box-mask').css({
				height: $(document).height(),
				width: $(document).width(),
			});

		},

		trigger:function(element,event){
			var that = this,
				$this = $(element);
			$('.dialog-box-close').on('click',function(){
					that.hide(element);
				});

			$(document).keyup(function(event){
 				if(event.keyCode === 27){
 					that.hide();
 				}
 			});
		}
	}

	$.fn[pluginName] = function(options) {
        this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new DialogBox(this, options));			
			}
        });
		return this;
    };
})(jQuery) 
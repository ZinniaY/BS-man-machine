$(function(){
	$('.CBreaker').contextPopup({
				title:"开关操作",
				hasgutterLine:true,
				items:[
					{label:"量测标识",icon:'icons/book-open-list.png', action:function(){alert("click1")}},
					{label:"量测描述",icon:'icons/book-open-list.png', action:function(){alert("click2")}},
					{label:"开关标识", icon:'icons/book-open-list.png',  action:function(){alert("click3")}},
					{label:"开关描述", icon:'icons/book-open-list.png',  action:function(){alert("click4")}},
					{label:"操作方向", icon:'icons/book-open-list.png' , action:function(){alert("click4")}},

				]
			});
			

			$('.Generator').contextPopup({
				title:"发电机操作",
				hasgutterLine:true,
				items:[
					{label:"出力调整",icon:'icons/book-open-list.png',action:function(){alert('click1')}},
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
})
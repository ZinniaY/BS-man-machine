/**
 * Created by wangziying on 2017/9/19.
 */
define(function(){
	var utilsObj={};
	/**
	 * 返回由节点属性构成的对象
	 * @param node
	 * @returns {{}}
	 */
	utilsObj.getProperties=function (node){
		var properties = {};
		var attrList=node.attributes;//图元节点的属性列表
		for(var j=0;j<attrList.length;j++){
			properties[attrList[j].name]=attrList[j].value;
		}
		return properties;
	};
	
	/**
	 * 给symbol设置属性
	 * @param node symbol的dom对象
	 * @param values 需要设置的属性
	 * @param sta 状态码，每一个状态码和id拼接组成新的id，即一个状态码对应一个symbol
	 */
	utilsObj.setSymbolProperties=function (node,values,sta){
		if(!values){
			return;
		}
		var correctVal,stateTmp="";
		for(var k in values){
			stateTmp="";
			if(k=="id"){
				if(values["state"]){
					stateTmp=sta;
				}
				correctVal=values[k]+"_"+stateTmp;
				node.setAttribute(k,correctVal);
			}else{
				node.setAttribute(k,values[k]);
			}
		}
	};
	
	/**
	 * 给use设置对应的属性，use对应G每一行
	 * @param node
	 * @param values
	 * @param center
	 */
	utilsObj.setUseProperties=function (node,values,center){
		if(!values){
			return;
		}
		var correctVal,stateTmp="",unitSymbolId="";
		for(var k in values){
			stateTmp="";
			unitSymbolId="";
			if(k=="devref"){
				// 获取单元 图元id，进行设置
				if(values["state"] || values["state"]==0){
					stateTmp="_"+values["state"];
				}
				unitSymbolId = values[k].slice(1).split(".g:")[1];
				correctVal="#"+unitSymbolId+stateTmp;
				// !!必须要用这种方式设置xlink:href，否则无效
				node.setAttributeNS("http://www.w3.org/1999/xlink", "href", correctVal);
				// node.setAttribute("xlink:href",correctVal);
			}else if(k=="tfr"){
				// 图元整个 变换设置
				if(k && k!="rotate(0) translate(0,0) scale(1,1)"){
					// ！偏移量是 x，y的值，tfr是rotate和scale的值
					node.setAttribute("transform",this.tfr_To_TFR( values[k], center.center_x, center.center_y ));
				}
			}else{
				node.setAttribute(k,values[k]);
			}
		}
	};
	
	/**
	 * 转化tfr属性函数
	 * @param tfr 原tfr的值
	 * @param cx 图元中心坐标x
	 * @param cy 图元中心坐标y
	 * @returns {string|*}
	 */
	utilsObj.tfr_To_TFR=function ( tfr, cx, cy ) {
		var tfr_rotate = "";
		var tfr_translate = "";
		var tfr_scale = "";
		var TFR;
		var tfr_arr = tfr.split( " " );
		for ( var i = 0 ; i < tfr_arr.length ; i++ ) {
			var tfr_tmp = tfr_arr[ i ];
			if ( tfr_tmp.indexOf( "rotate" ) > -1 ) {
				var tfr_rotateValue = tfr_tmp.split( "(" )[ 1 ].split( ")" )[ 0 ];
				tfr_rotate = "rotate(" + tfr_rotateValue + "," + cx + "," + cy + ")";
			} else if ( tfr_tmp.indexOf( "scale" ) > -1 ) {
				var tfr_scaleValue = tfr_tmp.split( "(" )[ 1 ].split( ")" )[ 0 ];
				tfr_scale = "translate(" + cx + "," + cy + ") scale(" + tfr_scaleValue + ") translate(" + -cx + "," + -cy + ")";
			}
		}
		TFR = tfr_scale + tfr_rotate;
		return TFR;
	};
	
	//-------- 颜色相关：需要单独处理
	// TODO 1、重写  分离颜色处理 ==> 改变类名、优先级、transformer3 颜色1\2\3 分别的对应关系
	/**
	 * 	voltype优先配色
	 * @param property
	 * @returns {Array}
	 */
	utilsObj.checkVol=function ( property ) {
		var volAry = [];
		for ( var k in property ) {
			if ( k.indexOf( "voltype" ) > -1 ) {
				volAry.push( k );
			}
		}
		return volAry;
	};
	
	//转化填充颜色fc属性函数
	utilsObj.fc_to_FC=function ( fc, fm ) {
		var FC;
		if ( parseInt( fm ) == 0 ) {
			return "none";
		}
		// if(fc=="0,255,0"){
		//   FC="none";
		// }else if(fc=="128,128,128"){
		// 		FC = "rgb(255,0,0)";
		// }else{
		//   FC="rgb("+fc+")";
		// }
		FC = "rgb(" + fc + ")";
		return FC;
	};
	
	// 转化线条颜色lc属性函数
	utilsObj.lc_to_LC=function ( lc, voltype ) {
		var LC;
		if ( voltype ) {
			switch ( voltype ) {
				case "112871467422580742":
					LC = "255,0,0";
					break;
				case "112871467422580737":
					// console.log( "我是128，0，128" );
					LC = "128,0,128";
					break;
				case "112871467422580738":
					// console.log( "255，255，0" );
					LC = "255,255,0";
					break;
			}
			return LC;
		}
		LC = lc == "128,128,128" ? "255,0,0" : lc;
		return LC
	};
	//-------- 颜色相关：需要单独处理
	
	return utilsObj;
});
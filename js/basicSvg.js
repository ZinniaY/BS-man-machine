
define( [ "utils" ], function (utils) {
	
	/**
	 * 绘制基本元素
	 * @param basicName 字符串，要绘制的基本图形标签名称
	 * @param basicProperty 对象，需要基本图形标签添加的属性
	 * @param targetSvgNode dom对象，需要将绘制的基本图形放入的dom元素
	 */
	function DrawBasicSvg(basicName,basicProperty,targetSvgNode){
		if(!(this instanceof DrawBasicSvg)){
			return new DrawBasicSvg().init(basicName,basicProperty,targetSvgNode);
		}
	}
	DrawBasicSvg.prototype.init=function(basicName,basicProperty,targetSvgNode){
		
		switch (basicName){
			case "circle":
			case "pin":
				this.drawCircle(basicProperty,targetSvgNode);
				break;
			case "rect":
				this.drawRect(basicProperty,targetSvgNode);
				break;
			case "line":
			case "Bus":
				this.drawLine(basicProperty,targetSvgNode);
				break;
			case "polyline":
				this.drawPolyline(basicProperty,targetSvgNode);
				break;
			case "ConnectLine":
			case "ACLine":
			case "DCLine":
			case "ACLineEnd":
			case "EnergyConsumer":
				this.drawPolyline(basicProperty,targetSvgNode,basicName);
				break;
			case "triangle":
				this.drawTriangle(basicProperty,targetSvgNode);
				break;
			case "circlearc":
				this.drawCirclearc(basicProperty,targetSvgNode);
				break;
			case "polygon":
				this.drawPolygon(basicProperty,targetSvgNode);
				break;
			case "ellipse":
				this.drawEllipse(basicProperty,targetSvgNode);
				break;
			case "Text":
			case "DText":
				this.drawText(basicProperty,targetSvgNode);
				break;
			case "poke":
				this.drawRect(basicProperty,targetSvgNode);
				break;
			// case "parallelrect":
			//
			// 	break;
			// case "diamond":
			//
			// 	break;
			// case "roundrect":
			//
			// 	break;
			
			// case "ellipsearc":
			//
			// 	break;
		}
	};
	
	
	//基本绘图元素：
	DrawBasicSvg.prototype.drawText= function ( property, svg ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		var id = property.id;
		var x = property.x;
		var y = property.y;
		var ts = property.ts;
		var lc = property.lc;
		var wm = property.wm;
		var ff = property.ff;
		var fs = property.fs;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var FontDeltaX = property.FontDeltaX;
		var FontDeltaY = property.FontDeltaY;
		var FontInterval = property.FontInterval;
		var RowInterval = property.RowInterval;
		var MatrixFontFlag = property.MatrixFontFlag;
		var ZoomMaxLevel = property.ZoomMaxLevel;
		var dotlength = property.dotlength;

		
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "text" );
		
		node.setAttribute( "id", id );
		node.setAttribute( "font-family", ff );
		node.setAttribute( "dotlength", dotlength );
		
		node.setAttribute( "x", x );
		var yPosition = parseFloat( y ) + parseFloat( fs );
		node.setAttribute( "y", yPosition );
		node.setAttribute( "font-size", fs );
		lc = lc == "0,0,0" ? "255,255,255" : lc;
		node.setAttribute( "style", "fill:rgb(" + fc + ");stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );//设置字体的颜色
		var textNode = document.createTextNode( ts );
		if ( wm == "2" ) {
			var tspan = document.createElementNS( "http://www.w3.org/2000/svg", "tspan" );
			var dx = 0, dy = 0;
			var d_x = fs, d_y = fs;
			for ( var i = 0 ; i < ts.length - 1 ; i++ ) {
				if ( ts[ i ] == " " ) {
					dx += " -" + 0.5 * d_x;
				}
				dx += " -" + d_x;
				dy += " " + d_y;
				
			}
			tspan.setAttribute( "dx", dx );
			tspan.setAttribute( "dy", dy );
			tspan.appendChild( textNode );
			node.appendChild( tspan );
		} else {
			node.appendChild( textNode );
		}
		svg.appendChild( node );
	}
	
	//1.Line
	/*id-图形中每个图形元素的唯一标识，ls-线形(line-style)，fm-填充模式(fill-mode)，lc-线色(line-color)，fc-填充色(fill-color)，
	 lw-线宽(line-width)， tfr-坐标转换，RoundBox-最大包围框，LevelStart-图元显示的起始缩放比例,LevelEnd-图元显示的结束缩放比例。*/
	/*x1-起始点横坐标,y1-起始点纵坐标,x2-终止点横坐标, y2-终止点纵坐标,
	 StartArrowType-首端的箭头形状,EndArrowType-末端的箭头形状,StartArrowSize-首端的箭头大小,EndArrowSize-末端的箭头大小*/
	// id,svg,x1,y1,x2,y2,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd,StartArrowType,EndArrowType,StartArrowSize,EndArrowSize,ifclass
	
	// TODO:ifclass作用
	DrawBasicSvg.prototype.drawLine=function ( property, svg, ifclass ) {
		
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		
		var id = property.id;
		var x1 = property.x1;
		var y1 = property.y1;
		var x2 = property.x2;
		var y2 = property.y2;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var StartArrowType = property.StartArrowType;
		var EndArrowType = property.EndArrowType;
		var StartArrowSize = property.StartArrowSize;
		var EndArrowSize = property.EndArrowSize;
		
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "line" );
		node.setAttribute( "id", id );
		node.setAttribute( "x1", x1 );
		node.setAttribute( "y1", y1 );
		node.setAttribute( "x2", x2 );
		node.setAttribute( "y2", y2 );
		if ( ifclass ) {
			node.setAttribute( "class", ifclass );
		}
		
		node.setAttribute( "style", "fill:rgb(" + fc + ");stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		
		if ( StartArrowType == 1 || EndArrowType == 1 ) {//画箭头
			var g = document.createElementNS( "http://www.w3.org/2000/svg", "g" );
			g.appendChild( node );
			if ( StartArrowType == 1 ) {
				getArrowKeypoints( parseFloat( x2 ), parseFloat( y2 ), parseFloat( x1 ), parseFloat( y1 ), g, lc, fc, lw, StartArrowSize );
			} else {
				getArrowKeypoints( parseFloat( x1 ), parseFloat( y1 ), parseFloat( x2 ), parseFloat( y2 ), g, lc, fc, lw, EndArrowSize );
			}
			svg.appendChild( g );
		} else {
			svg.appendChild( node );
		}
		
	}
	
	
	//2.rect
	/*矩形rect: 属性：x-起始点横坐标，y-起始点纵坐标，w-矩形的宽度，h-矩形的高度,ShadowType-矩形显示阴影的方式*/
	// id,svg,x,y,w,h,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd,ShadowType,stroke_dasharray
	DrawBasicSvg.prototype.drawRect=function ( property, svg ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		var id = property.id;
		var x = property.x ? property.x : 0;
		var y = property.y ? property.y : 0;
		var w = property.w;
		var h = property.h;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var ahref=property.ahref?property.ahref:"";
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var ShadowType = property.ShadowType;
		var stroke_dasharray = property.stroke_dasharray;
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "rect" );
		node.setAttribute( "id", id );
		node.setAttribute( "x", x );
		node.setAttribute( "y", y );
		node.setAttribute( "width", w );
		node.setAttribute( "height", h );
		lc = utils.lc_to_LC( lc );
		
		// 简单处理poke start todo：内部有文字、跳转地址。
		if(ahref){
			console.log( ahref );
			var newA=document.createElementNS("http://www.w3.org/2000/svg","a");
			newA.setAttributeNS("http://www.w3.org/1999/xlink", "href", ahref);
			svg.appendChild(newA);
		}
		// poke end
		
		if ( lc == "128,128,128" ) {
			lc = "255,255,255";
		}
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( property.tfr, parseFloat( x ) + parseFloat( w ) / 2, parseFloat( y ) + parseFloat( h ) / 2 );//旋转
			node.setAttribute( "transform", TFR );
		}
		
		node.setAttribute( "style", "fill:" + utils.fc_to_FC( fc, fm ) + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";stroke-dasharray:" + stroke_dasharray + ";" );
		svg.appendChild( node );
	};
	
	
	//3.roundrect
	/*圆角矩形roundrect：属性：x-起始点横坐标，y-起始点纵坐标，w-矩形的宽度，h-矩形的高度，rx-圆角x轴半径，ry-圆角y轴半径 ShadowType-矩形显示阴影的方式*/
	DrawBasicSvg.prototype.drawRoundrect=function ( id, svg, x, y, w, h, rx, ry, lc, fc, lw, ls, fm, tfr, RoundBox, LevelStart, LevelEnd, ShadowType )
	{
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "rect" );
		node.setAttribute( "id", id );
		node.setAttribute( "x", x );
		node.setAttribute( "y", y );
		node.setAttribute( "width", w );
		node.setAttribute( "height", h );
		node.setAttribute( "rx", rx );
		node.setAttribute( "ry", ry );
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( tfr, parseFloat( x ) + parseFloat( w ) / 2, parseFloat( y ) + parseFloat( h ) / 2 );//旋转
			node.setAttribute( "transform", TFR );
		}
		lc = utils.lc_to_LC( lc );
		
		node.setAttribute( "style", "fill:" + utils.fc_to_FC( fc ) + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	
	//4.circle
	/*圆circle: 属性：cx-中心点横坐标，cy-中心点纵坐标，r-圆的半径*/
	// id,svg,cx,cy,r,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd
	DrawBasicSvg.prototype.drawCircle=function ( property, svg ) {
		
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		
		var id = property.id;
		var cx = property.cx;
		var cy = property.cy;
		var r = property.r;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		
		
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );
		// if(center_x&&center_y){
		// 	cx = center_x > cx ? (2*center_x-cx) : (2*cx-center_x);
		// }
		
		node.setAttribute( "id", id );
		node.setAttribute( "cx", cx );
		node.setAttribute( "cy", cy );
		node.setAttribute( "r", r );
		
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( property.tfr, cx, cy );//旋转
			node.setAttribute( "transform", TFR );
		}
		lc = utils.lc_to_LC( lc );
		node.setAttribute( "style", "fill:" + utils.fc_to_FC( fc, fm ) + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		//node.setAttribute("style","stroke:rgb("+lc+");stroke-width:"+lw+";");//(填充色？？？？)
		svg.appendChild( node );
	}
	
	
	//5.ellipse
	/*椭圆ellipse：属性：cx-中心点横坐标，cy-中心点纵坐标，rx-椭圆的x轴半径，ry-椭圆的y轴半径.*/
	// id,svg,cx,cy,rx,ry,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd
	DrawBasicSvg.prototype.drawEllipse=function ( property, svg ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		
		var id = property.id;
		var cx = property.cx;
		var cy = property.cy;
		var rx = property.rx;
		var ry = property.ry;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "ellipse" );
		node.setAttribute( "id", id );
		node.setAttribute( "cx", cx );
		node.setAttribute( "cy", cy );
		node.setAttribute( "rx", rx );
		node.setAttribute( "ry", ry );
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( property.tfr, cx, cy );//旋转
			node.setAttribute( "transform", TFR );
		}
		lc = utils.lc_to_LC( lc );
		node.setAttribute( "style", "fill:" + utils.fc_to_FC( fc, fm ) + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	
	//5.circlearc  circlearc
	/*圆弧circlearc：属性：cx-中心点横坐标，cy-中心点纵坐标，r-圆弧的半径，a1-弧起点角度，
	 a2-弧终点角度，ArcShape-弧弦方式，DrawFlag-画的方式。*/
	// id,svg,cx,cy,r,a1,a2,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd,ArcShape,DrawFlag
	
	DrawBasicSvg.prototype.drawCirclearc=function ( property, svg ) {
		
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		
		var id = property.id;
		var cx = property.cx;
		var cy = property.cy;
		var r = property.r;
		var a1 = property.a1;
		var a2 = property.a2;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var ArcShape = property.ArcShape;
		
		var x1=parseFloat(cx)+parseFloat(r)*parseFloat(Math.cos(Math.PI*(parseFloat(a1)/180)));
		var y1=parseFloat(cy)-parseFloat(r)*parseFloat(Math.sin(Math.PI*(parseFloat(a1)/180)));
		var x2=parseFloat(cx)+parseFloat(r)*parseFloat(Math.cos(Math.PI*(parseFloat(a2)/180)));
		var y2=parseFloat(cy)-parseFloat(r)*parseFloat(Math.sin(Math.PI*(parseFloat(a2)/180)));
		var d;
		d ="M"+x1+" "+y1+" A"+r+" "+r+",0, 1, 0,"+x2+" "+y2;
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
		node.setAttribute( "id", id );
		node.setAttribute( "d", d );
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( property.tfr, cx, cy );//旋转
			node.setAttribute( "transform", TFR );
		}
		lc = utils.lc_to_LC( lc );
		
		//node.setAttribute("style","fill:rgb("+fc+");stroke:rgb("+lc+");stroke-width:"+lw+";");
		node.setAttribute( "style", "fill:" + "none" + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	
	//6.ellipsearc
	/*椭圆弧ellipsearc：属性：cx-中心点横坐标，cy-中心点纵坐标，rx-椭圆弧的x轴半径，ry-椭圆弧的y轴半径，
	 a1-弧起点角度，a2-弧终点角度，ArcShape-弧弦方式，DrawFlag-画的方式*/
	// function drawEllipsearc(id,svg,cx,cy,rx,ry,a1,a2,lc,fc,lw,tfr,ls,fm,RoundBox,LevelStart,LevelEnd,ArcShape,DrawFlag){
	// 			var tmp_a1=parseFloat(a1);
	// 			var tmp_a2=parseFloat(a2);
	// 			var rX = parseFloat(rx);
	// 			var rY = parseFloat(ry);
	// 			var x1,x2,y1,y2;
	// 			var tan1,tan2;
	// 			if(tmp_a1!=90&tmp_a1!=270){
	// 				tan1=Math.tan(Math.PI*(tmp_a1/180));
	// 			}else{
	// 				if(tmp_a1==90){
	// 					x1=parseFloat(cx);
	// 					y1=parseFloat(cy)-rY;
	// 				}
	// 				if(tmp_a1==270){
	// 					x1=parseFloat(cx);
	// 					y1=parseFloat(cy)+rY;
	// 				}
	// 			}
	// 			//-------------
	// 			if(tmp_a2!=90&tmp_a2!=270){
	// 				tan2=Math.tan(Math.PI*(tmp_a2/180));
	// 			}else{
	// 				//alert("890");
	// 				if(tmp_a2==90){
	// 					x2=parseFloat(cx);
	// 					y2=parseFloat(cy)-rY;
	// 					//alert(x2);
	// 				}
	// 				if(tmp_a2==270){
	// 					x2=parseFloat(cx);
	// 					y2=parseFloat(cy)+rY;
	// 				}
	// 			}
	//
	// 			if(tmp_a1!=90&&tmp_a1!=270){
	// 				if((tmp_a1>90&&tmp_a1<270)){
	// 					 x1=parseFloat(cx)-Math.abs(rX*rY/Math.sqrt(rY*rY+rX*rX*tan1*tan1));
	// 				}else{
	// 					 x1=parseFloat(cx)+Math.abs(rX*rY/Math.sqrt(rY*rY+rX*rX*tan1*tan1));
	// 				}
	//
	// 				if(tmp_a1>0&&tmp_a1<180){
	// 					 y1=parseFloat(cy)-Math.abs(rX*rY*tan1/Math.sqrt(rY*rY+rX*rX*tan1*tan1));
	// 				}else{
	// 					 y1=parseFloat(cy)+Math.abs(rX*rY*tan1/Math.sqrt(rY*rY+rX*rX*tan1*tan1));
	// 				}
	// 			}
	// 			//-----
	// 			if(tmp_a2!=90&&tmp_a2!=270){
	// 				if((tmp_a2>90&&tmp_a2<270)){
	// 					 x2=parseFloat(cx)-Math.abs(rX*rY/Math.sqrt(rY*rY+rX*rX*tan2*tan2));
	// 				}else{
	// 					 x2=parseFloat(cx)+Math.abs(rX*rY/Math.sqrt(rY*rY+rX*rX*tan2*tan2));
	// 				}
	//
	// 				if(tmp_a2>0&&tmp_a2<180){
	// 					 y2=parseFloat(cy)-Math.abs(rX*rY*tan2/Math.sqrt(rY*rY+rX*rX*tan2*tan2));
	// 				}else {
	// 					 y2=parseFloat(cy)+Math.abs(rX*rY*tan2/Math.sqrt(rY*rY+rX*rX*tan2*tan2));
	// 				}
	// 			}
	//
	// 			var d;
	// 			if(parseFloat(a2)-parseFloat(a1)<180){
	// 				d ="M"+x1+" "+y1+" A "+rX+" "+rY+",0, 0, 0,"+x2+" "+y2;
	// 			}else{
	// 				d ="M"+x1+" "+y1+" A "+rX+" "+rY+",0, 1, 0,"+x2+" "+y2;
	// 			}
	// 			//alert(d);
	// 			var node=document.createElementNS("http://www.w3.org/2000/svg","path");
	// 			node.setAttribute("id",id);
	// 			node.setAttribute("d",d);
	// 			if(tfr){
	// 				var TFR = utils.tfr_To_TFR(tfr,cx,cy);//旋转
	// 				node.setAttribute("transform",TFR);
	// 			}
	// 			lc = utils.lc_to_LC(lc);
	//
	// 			//node.setAttribute("style","fill:rgb("+fc+");stroke:rgb("+lc+");stroke-width:"+lw+";");
	// 			node.setAttribute("style","fill:"+utils.fc_to_FC(fc)+";stroke:rgb("+lc+");stroke-width:"+lw+";");
	// 			svg.appendChild(node);
	// 		 }
	
	
	//7.polyline
	/*折线polyline：属性：d-各点的坐标（以空格分隔），StartArrowType-首端的箭头形状，EndArrowType-末端的箭头形状，
	 StartArrowSize-首端的箭头大小，EndArrowSize-末端的箭头大小。*/
	// id,svg,d,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd,StartArrowType,EndArrowType,StartArrowSize,EndArrowSize,ifclass
	DrawBasicSvg.prototype.drawPolyline=function ( property, svg, ifclass ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		var id = property.id;
		var d = property.d;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var StartArrowType = property.StartArrowType;
		var EndArrowType = property.EndArrowType;
		var StartArrowSize = property.StartArrowSize;
		var EndArrowSize = property.EndArrowSize;
		
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "polyline" );
		node.setAttribute( "id", id );
		node.setAttribute( "points", d );
		if ( ifclass ) {
			node.setAttribute( "class", ifclass );
		}
		lc = utils.lc_to_LC( lc );
		
		node.setAttribute( "style", "fill:" + (fc ? utils.fc_to_FC( fc, fm ) : "transparent") + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	
	//8.polygon
	/* 多边形polygon：属性：d-各点的坐标（以空格分隔）*/
	// id,svg,d,lc,fc,lw,ls,fm,tfr,RoundBox,LevelStart,LevelEnd
	DrawBasicSvg.prototype.drawPolygon=function ( property, svg ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		var id = property.id;
		var d = property.d;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "polygon" );
		node.setAttribute( "id", id );
		node.setAttribute( "points", d );
		lc = utils.lc_to_LC( lc );
		node.setAttribute( "style", "fill:" + utils.fc_to_FC( fc ) + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	//9.triangle
	/* 三角形triangle：属性：x-外围矩形左上点的横坐标，y-外围矩形左上点的纵坐标，w-外围矩形的宽度，h-外围矩形的高度，ShadowType-显示阴影的方式。*/
	// id,svg,x,y,w,h,lc,fc,lw,tfr,ls,fm,RoundBox,LevelStart,LevelEnd,ShadowType
	DrawBasicSvg.prototype.drawTriangle=function ( property, svg ) {
		if ( !(Object.prototype.toString.call( property ) == "[object Object]") ) {
			return;
		}
		var id = property.id;
		var x = property.x;
		var y = property.y;
		var w = property.w;
		var h = property.h;
		var lc = property.lc;
		var fc = property.fc;
		var lw = property.lw;
		var ls = property.ls;
		var fm = property.fm;
		var tfr = property.tfr;
		var RoundBox = property.RoundBox;
		var LevelStart = property.LevelStart;
		var LevelEnd = property.LevelEnd;
		var ShadowType = property.ShadowType;
		
		var x1 = parseFloat( x ) + parseFloat( w ) / 2;
		var y1 = parseFloat( y );
		var x2 = parseFloat( x );
		var y2 = parseFloat( y ) + parseFloat( h );
		var x3 = parseFloat( x ) + parseFloat( w );
		var y3 = parseFloat( y ) + parseFloat( h );
		var d = "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " L" + x3 + " " + y3 + " z";
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
		node.setAttribute( "id", id );
		node.setAttribute( "d", d );
		lc = utils.lc_to_LC( lc );
		if ( tfr ) {
			var TFR = utils.tfr_To_TFR( property.tfr, parseFloat( x ) + parseFloat( w ) / 2, parseFloat( y ) + parseFloat( h ) / 2 );//旋转
			node.setAttribute( "transform", TFR );
		}
		
		node.setAttribute( "style", "fill:" + (fm ? utils.fc_to_FC( fc, fm ) : "transparent") + ";stroke:rgb(" + lc + ");stroke-width:" + lw + ";" );
		svg.appendChild( node );
	}
	
	
	//10.parallelrect
	/* 平行四边形parallelrect：属性：x-外围矩形左上点的横坐标，y-外围矩形左上点的纵坐标，w-外围矩形的宽度，h-外围矩形的高度，
	 dx-平行四边形的起点和外围矩形起点之间的距离.*/
	// function drawParallelrect(id,svg,x,y,w,h,dx,lc,fc,lw,tfr,ls,fm,RoundBox,LevelStart,LevelEnd){
	// 			var x1=parseFloat(x)+parseFloat(dx);
	// 			var y1=parseFloat(y);
	// 			var x2=parseFloat(x)+parseFloat(w);
	// 			var y2=parseFloat(y);
	// 			var x3=parseFloat(x)+parseFloat(w)-parseFloat(dx);
	// 			var y3=parseFloat(y)+parseFloat(h);
	// 			var x4=parseFloat(x);
	// 			var y4=parseFloat(y)+parseFloat(h);
	// 			var d="M"+x1+" "+y1+" L"+x2+" "+y2+" L"+x3+" "+y3+" L"+x4+" "+y4+" z";
	// 			var node=document.createElementNS("http://www.w3.org/2000/svg","path");
	// 			node.setAttribute("id",id);
	// 			node.setAttribute("d",d);
	// 			if(tfr){
	// 				var TFR = utils.tfr_To_TFR(tfr,parseFloat(x)+parseFloat(w)/2,parseFloat(y)+parseFloat(h)/2);//旋转
	// 				node.setAttribute("transform",TFR);
	// 			}
	// 			lc = utils.lc_to_LC(lc);
	//
	// 			node.setAttribute("style","fill:"+utils.fc_to_FC(fc)+";stroke:rgb("+lc+");stroke-width:"+lw+";");
	// 			svg.appendChild(node);
	// 		 }
	
	
	//11.diamond
	/* 菱形diamond：属性：x-外围矩形左上点的横坐标，y-外围矩形左上点的纵坐标，w-外围矩形的宽度，h-外围矩形的高度，ShadowType-显示阴影的方式*/
	// function drawDiamond(id,svg,x,y,w,h,lc,fc,lw,tfr,ls,fm,RoundBox,LevelStart,LevelEnd,ShadowType){
	// 		var x1=parseFloat(x)+parseFloat(w)/2;
	// 		var y1=parseFloat(y);
	// 		var x2=parseFloat(x)+parseFloat(w);
	// 		var y2=parseFloat(y)+parseFloat(h)/2;
	// 		var x3=parseFloat(x)+parseFloat(w)/2;
	// 		var y3=parseFloat(y)+parseFloat(h);
	// 		var x4=parseFloat(x);
	// 		var y4=parseFloat(y)+parseFloat(h)/2;
	// 		var d="M"+x1+" "+y1+" L"+x2+" "+y2+" L"+x3+" "+y3+" L"+x4+" "+y4+" z";
	// 		var node=document.createElementNS("http://www.w3.org/2000/svg","path");
	// 		node.setAttribute("id",id);
	// 		node.setAttribute("d",d);
	// 		if(tfr){
	// 			var TFR = utils.tfr_To_TFR(tfr,parseFloat(x)+parseFloat(w)/2,parseFloat(y)+parseFloat(h)/2);//旋转
	// 			node.setAttribute("transform",TFR);
	// 		}
	// 		lc = utils.lc_to_LC(lc);
	//
	// 		node.setAttribute("style","fill:"+utils.fc_to_FC(fc)+";stroke:rgb("+lc+");stroke-width:"+lw+";");
	// 		svg.appendChild(node);
	// 	 }
	
	//12.image
	/* 图像image：属性：x-像素图起点的横坐标，y-像素图起点的纵坐标，w-像素图的宽度，h-像素图的高度，
	 ahref-像素图对应文件名，ShowType-像素图显示的方式（居中/缩放）。*/
	DrawBasicSvg.prototype.drawImage=function drawImage( id, svg, x, y, w, h, ahref, lc, fc, lw, tfr, ls, fm, RoundBox, LevelStart, LevelEnd, ShowType )
	{
		var node = document.createElementNS( "http://www.w3.org/2000/svg", "image" );
		node.setAttributeNS( null, "id", id );
		node.setAttributeNS( null, "x", x );
		node.setAttributeNS( null, "y", y );
		node.setAttributeNS( null, "width", w );
		node.setAttributeNS( null, "height", h );
		node.href.baseVal = ahref;
		svg.appendChild( node );
	};
	return DrawBasicSvg;
} );

define(["basicSvg","getXml","utils"],function(DrawBasicSvg,getXml,utils){
	
	/**
	 * 绘制图元
	 * @param property
	 * @param svg
	 * @param entityUnitName
	 * @param allSymbols
	 */
	function drawTuYuanWithPoint(property,svg,entityUnitName,allSymbols){
		
		// 给每一个单元(简单+复杂）图元 包裹一个g标签
		var unitContainerG=document.createElementNS("http://www.w3.org/2000/svg","g");
		unitContainerG.setAttribute("unitType",entityUnitName);
		// 一、处理简单图元,
		var simpleAry=["poke","line","Bus","rect","circle","pin","ellipse","polyline","polygon","Text","DText","ConnectLine","circlearc","triangle","ellipsearc","parallelrect","diamond","image","ACLine","DCLine","ACLineEnd","EnergyConsumer"];
		if(simpleAry.indexOf(entityUnitName)>-1){
			// TODO：0、poke标签:每一个poke标签都代表一个a连接，可点击跳转到另一个图元
			DrawBasicSvg(entityUnitName,property,unitContainerG);
			svg.appendChild(unitContainerG);
			return;
		}
		
		// 二、处理复杂图元
		
		// // ------start 获取目标文件中 每一行的voltype属性,颜色处理
		// var hasVoltype=basicSvg.checkVol(property)[0];
		// property.lc = hasVoltype?basicSvg.lc_to_LC(property.lc,property[hasVoltype]):basicSvg.lc_to_LC(property.lc);
		// console.log( property.lc );
		// // ------end 获取目标文件中 每一行的voltype属性
		
		
		// 图元引用 起始点
		var x=parseFloat(property.x);
		var y=parseFloat(property.y);
		
		// 获取对应图元内容
		
		// -------获取对应文件路径
		// 存储所有 复杂单元图元 的文件名，临时方式，获取文件内容，TODO：直接给后台未分解的字符串
		var allEntityDirectorNameAry=["arrester","ascoil","capacitor","cbreaker","ct","disconnector","fuse","generator","grounddisconnector","gz","inoutline","other","energyconsumer","pt","reactor","sensitive","split_ractor","state","transformer2","transformer3"];
		
		var Ref = property.devref,unitEntityId="";
		
		if(Ref!=null) {
			var containFileNameStr = Ref.slice(1).split(".g:")[0],
				xmlFileUrl ="";
			unitEntityId=Ref.slice(1).split(".g:")[1];
			for (var i = 0; i < allEntityDirectorNameAry.length; i++) {
			   var entityDirectorName=allEntityDirectorNameAry[i];
				if(Ref.indexOf(entityDirectorName)>-1){
					xmlFileUrl = "element/"+entityDirectorName+"/" + containFileNameStr + ".xml";
				}
			}
		}
		// -------
		
		var targetUnit=getXml.parseXML(unitEntityId,entityUnitName,xmlFileUrl);
		// 定义symbol,根据state个数定义
		defineSymbol(targetUnit,svg,allSymbols,unitEntityId);
		var targetUnitProperty=utils.getProperties(targetUnit);
		
		// 图元定义 宽高尺寸
		var targetUnitWidth=targetUnitProperty.w?parseFloat(targetUnitProperty.w):0;
		var targetUnitHeight=targetUnitProperty.h?parseFloat(targetUnitProperty.h):0;
		
		var targets=targetUnit.childNodes;
		for (var i = 0; i < targets.length; i++) {
			var target=targets[i];
			if(target.nodeName=="Layer"){
				var targetProperty=utils.getProperties(target);
				
				// 图元定义 layer起始点
				var layer_x=targetProperty.x?parseFloat(targetProperty.x):0;
				var layer_y=targetProperty.y?parseFloat(targetProperty.y):0;
				// 图元layer的基准点坐标
				var baseX=x+layer_x;
				var baseY=y+layer_y;
				
				// 图元引用 旋转中心点
				var center={};
				center.center_x=baseX+targetUnitWidth/2;
				center.center_y=baseY+targetUnitHeight/2;
				var tfr="rotate(0) translate(0,0) scale(1,1)";
				// ---------复杂图元，建立use引用,每一个layer创建一个use引用
				var targetSvgNode=document.createElementNS("http://www.w3.org/2000/svg","use");
				utils.setUseProperties(targetSvgNode,property,center);
				// ---------
				
				// 多个layer的图元，都添加到同一个g中
				unitContainerG.appendChild(targetSvgNode);
				svg.appendChild(unitContainerG);
			}
		}
	}
	/**
	 * 定义单元图元symbol
	 * @param unitDom 单元图元的dom对象
	 * @param svg 画布dom对象
	 * @param allSymbolsObj 所有已定义的symbol记录对象，键：单元图元的名称，值：数组，每一项是id和state的组合值
	 * @param targetId 需要定义的单元图元id
	 *
	 */
	function defineSymbol(unitDom,svg,allSymbolsObj,targetId){
		var chNodes=svg.childNodes,
			flag=true,
			defsNode;
		for (var i = 0; i < chNodes.length; i++) {
			var chNodeName=chNodes[i].nodeName;
			if(chNodeName.toUpperCase()=="DEFS"){
				defsNode=document.getElementsByTagNameNS("http://www.w3.org/2000/svg","defs")[0];
				flag=false;
				break;
			}
		}
		if(flag){
			defsNode=document.createElementNS("http://www.w3.org/2000/svg","defs");
			svg.appendChild(defsNode);
		}
		
		// 判断symbol是否已定义
		// 获取state个数，创建symbol
		var tmpProperty=utils.getProperties(unitDom);
		var state=tmpProperty.state;
		var targetName=unitDom.nodeName;
		var tmpTargetId=targetId;
		if(state){
			targetId=targetId+"_"+state;
		}else{
			state=1
		}
		for(var k in allSymbolsObj){
			if(k==targetName && allSymbolsObj[k].indexOf(targetId)>-1 ){
				return;
			}else if(k==targetName){
				allSymbolsObj[k]=[];
			}
		}
		
		// allSymbolsObj没有则需要新定义
		if(allSymbolsObj[targetName]){
			allSymbolsObj[targetName].push(targetId);
		}else{
			allSymbolsObj[targetName]=[];
			allSymbolsObj[targetName].push(targetId);
		}
		
		for (var  h = 0; h < state; h++) {
			var unitNewSymbol=document.createElementNS("http://www.w3.org/2000/svg","symbol");
			utils.setSymbolProperties(unitNewSymbol,tmpProperty,h);
			var allUnitChilds=unitDom.childNodes;
			for (var j = 0; j < allUnitChilds.length; j++) {
				var unitChild=allUnitChilds[j],
					unitChildName=unitChild.nodeName.toUpperCase();
				if(unitChild.nodeType!=1){
					continue;
				}
				if(unitChildName=="LAYER"&&unitChild.hasChildNodes()){
					var trueNodes=unitChild.childNodes;
					for (var k = 0; k < trueNodes.length; k++) {
						var trueNode=trueNodes[k],
							trueNodeName=trueNode.nodeName.toLowerCase();
						if(trueNode.nodeType!=1){
							continue;
						}
						var unitState=utils.getProperties(trueNode).sta;
						if(h==unitState){
							DrawBasicSvg(trueNodeName,utils.getProperties(trueNode),unitNewSymbol);
						}
					}
				}
			}
			defsNode.appendChild(unitNewSymbol);
		}
	}
	
	return drawTuYuanWithPoint;
});

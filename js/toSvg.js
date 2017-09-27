/**
 * 处理G文件
 */
define(["drawEntity","basicSvg","getXml","utils","refreshSvg"],function(drawTuYuanWithPoint,DrawBasicSvg,getXml,utils){
	
	function ToSvg(stationName,svgContainer){
		if(!(this instanceof ToSvg)){
			return new ToSvg().init(stationName,svgContainer);
		}
	}
	/**
	 * 初始化G文件
	 * @param stationName G文件名
	 * @param svg dom对象，html中的svg的容器
	 */
	ToSvg.prototype.init=function(stationName,svg){
		// 定义symbols：用于存储所有的symbol，名称 对应 id数组
		var allSymbols={};
		// ajax返回的xml文件内容
		var G= getXml.parseAllXML("xml/"+stationName+".xml");
		
		// 根据G的属性绘制背景
		var Gproperty=utils.getProperties(G);
		DrawBasicSvg("rect",Gproperty,svg);
		// 遍历全部xml节点
		var nodes = G.childNodes;
		for(var i=1;i<nodes.length;i+=2){
			var node = nodes[i];
			var nodeName = node.nodeName;
			if(nodeName=="Layer"){
				var layer_id = node.getAttribute("id");
				var layer_w = node.getAttribute("w")?node.getAttribute("w"):0;
				var layer_h = node.getAttribute("h")?node.getAttribute("h"):0;
				var layer_x = node.getAttribute("x")?node.getAttribute("x"):0;
				var layer_y = node.getAttribute("y")?node.getAttribute("y"):0;
				// 如果有子节点
				if(node.hasChildNodes()){
					var tuyuan_nodes = node.childNodes;
					for(var k=1;k<tuyuan_nodes.length;k+=2){
						var tuyuan_node=tuyuan_nodes[k];
						var tuyuan_nodeName = tuyuan_node.nodeName;
						// 单个图元 属性 对象
						var property =utils.getProperties(tuyuan_node);
						// TODO?：若同类图元分组，在此。使用自定义属性unitType指定类型
						// drawTuYuanWithPoint负责绘制图元
						drawTuYuanWithPoint(property,svg,tuyuan_nodeName,allSymbols);
					}
				}
			}
		}
	};
	
	return ToSvg;
});

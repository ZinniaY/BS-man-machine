var embedElem = null;
var svgWindow = null;
var svgDoc = null;
var svgDocDocument = null;
var realdataURL = webRoot + "/rtdb/rtdbdata";
var xmlDoc = null;
var isFlash = true;//是否启用闪烁
var isIE8Low = false;
var isIE = false;
var svgOrgWidth = 0;
var svgOrgHeight = 0;
var reFreshTimer = null;
var isChaoLiuTu = false; //是否是潮流图
var svgns = "http://www.w3.org/2000/svg"; 
var xlink = "http://www.w3.org/1999/xlink";
var svgSize = 0;//svg图像缩放的大小

//遥测  客户提出只关注以下质量码 其余都为正常
//越合理范围  33554432 RGB(0,0,0) 4
//不变化 -43776 RGB(255,85,0) 32
//封锁 -11162881 RGB(85,170,255) 256
//告警抑制 16777216  RGB(0,0,0) 512
//非实测 -5592449 RGB(170,170,127) 8192
//被对侧代   -256 RGB(255,255,0) 65536
//被旁路代  -16733696 RGB(0,170,0) 131072
//越上限1  -65536 RGB(255,0,0) 4194304
//越下限1 -65536 RGB(255,0,0)
//越上限2  -65536 RGB(255,0,0)
//越下限2 -65536 RGB(255,0,0)
//越上限3  -65536 RGB(255,0,0)
//越下限3 -65536 RGB(255,0,0)
//越上限4  -65536 RGB(255,0,0) 268435456
//越下限4 -65536 RGB(255,0,0) 536870912
//正常 -65794 RGB(254,254,254)  1073741824

var yc1t=["#ffffff","#FF9900","#FF6600","#FF6699",
         "#FF3366","#FF3300","#CCFFFF","#CCFF00",
         "#CCCCFF","#ffffff","#ffffff","#ffffff",
         "#ffffff","#CC9900","#CC66FF","#ffffff",
         "#ffffff","#99FF66","#ffffff","#ffffff",
         "#ffffff","#9999FF","#999999","#999900",
         "#ffffff","#FFC125","#ffffff","#ffffff",
         "#FF83FA","#ffffff","#ffffff"];

var yc1=["#ffffff","RGB(255,0,0)","RGB(255,0,0)","RGB(255,0,0)",
         "RGB(255,0,0)","RGB(255,0,0)","RGB(255,0,0)","RGB(255,0,0)",
         "RGB(255,0,0)","#ffffff","#ffffff","#ffffff",
         "#ffffff","RGB(0,170,0)","RGB(255,255,0)","#ffffff",
         "#ffffff","RGB(170,170,127)","#ffffff","#ffffff",
         "#ffffff","RGB(255,255,255)","RGB(85,170,255)","#ffffff",
         "#ffffff","RGB(255,85,0)","#ffffff","#ffffff",
         "RGB(255,255,255)","#ffffff","#ffffff"];
var yctext=["正常","越下限4","越上限4","越下限3",
            "越上限3","越下限2","越上限2","越下限1",
            "越上限1","正常","正常","正常",
            "正常","被旁路代","被对侧代","正常",
            "正常","非实测","正常","正常",
            "正常","告警抑制","封锁","未初始化",
            "正常","不变化","正常","正常",
            "越合理范围","正常","正常"];

//遥信 客户提出只关注以下质量码 其余都为正常
//正常:16777216  RGB(0,0,0) 1073741824
//挂牌:16777216  RGB(0,0,0) 524288
//事故变位:16777216  RGB(0,0,0) 131072
//置数:-43521 RGB(255,85,255) 4096 
//告警抑制:16777216  RGB(0,0,0) 512
//封锁:-11162881 RGB(85,170,255) 256


var yktext=["正常","","","",
            "","","","",
            "","","",
            "挂牌","正常变位","事故变位",
            "正常","正常","正常","正常",
            "置数","正常","正常","告警抑制",
            "封锁","正常","正常","正常",
            "正常","正常","正常","正常",
            "正常"];
var currentZoomIndex = 50;//定义当前缩放的比例
/*
 * 初始化,为了兼容edge浏览器，此函数暂时不用，修改为在svg.jsp中加载
 * 
 */
var xmlName;
function initEmbed(){
	embedElem = document.createElement("embed");
    embedElem.name = "svg";
    document.body.appendChild(embedElem);
    embedElem.width = "100%";
    embedElem.height = "100%";
    embedElem.wmode = "transparent";
    var src_ = webRoot + "/usergra/svg/" + svgName  + ".svg?time="+new Date().getTime();
    embedElem.src = encodeURI(src_);

    svgWindow = embedElem.window;
    var names = svgName.split("/");

    if(names.length == 4){
    	xmlName = names[3];
    	//判断是否是潮流图
	    var strs = xmlName.split(".");
	    if(strs.length == 5){
	    	var graphType = strs[2];
	    	if(graphType=="sys" || graphType=="ln"){
	    		isChaoLiuTu = true;
	    	}
	    }
    }
}

function initEmbed4Edge(){
	embedElem = document.getElementById("svgEmbed");
    svgWindow = embedElem.window;
    
    var names = svgName.split("/");
    if(names.length == 4){
    	xmlName = names[3];
    	//判断是否是潮流图
    	var strs = xmlName.split(".");
	    if(strs.length == 5){
	    	var graphType = strs[2];
	    	if(graphType=="sys" || graphType=="ln"){
	    		isChaoLiuTu = true;
	    	}
	    }
    }
}
/*
 * 初始化svg文档
 */
var freshFlag = "0";
var orViewBox = null;
var currentCzId = null;
var bayId = null;
function initSvg(evt){
	//JQuery解析svg文档
	svgDocDocument = evt.currentTarget.ownerDocument;
	svgDoc = $(evt.target);
	
	//获取viewbox重新初始化embedElem大小
	var viewBox = svgDoc.attr("viewBox");
	svgOrgWidth = parseFloat(viewBox.split(" ")[2]);
	svgOrgHeight = parseFloat(viewBox.split(" ")[3]);
	svgSize = svgDoc.attr("scale");
	if(viewBox != null){
		orViewBox = viewBox;
	}
	
	getBrowserInfo();
	
	//初始化拖拽
	initSvgDrag();
	//初始化放大缩小
	initZoom();
	
	//初始化tooltip
	initTooltipDiv();
	
	//添加阴影
	if(top.currentState != "scada"){
		//addShadow(window.parent.parent.group);
	}
	
	//刷数据
	freshFlag = svgDoc.attr("freshFlag");
	freshRtdbData();
	
	//厂站id、间隔id
	currentCzId = svgDoc.attr("czId");
	bayId = svgDoc.attr("bayId");
	
	//初始化鼠标事件
	initButtonDown();
	//初始化右键菜单
	initMenu();
	
	//设置整图显示
//	var zoomLevelSet = parent.parent.getCookie("graphLevel");
//	if(zoomLevelSet == "2"){
//		reSizeEmbedOrg();
//	}
}


//添加阴影
function addShadow(state){
	var temp = state.toLocaleUpperCase();
	var shadow = svgDocDocument.getElementById("shadow");
	if(shadow != null){
		return;
	}
	var whole = svgDocDocument.getElementById("BGRect");
	var g_node = svgDocDocument.createElementNS(svgns,"g");
	g_node.setAttribute("id", "shadow");
	for(var x = -3; x < 5; x++){
		for(var y = -1; y < 5; y++){
			var text_node = svgDocDocument.createElementNS(svgns,"text");
			text_node.setAttribute("x", x*500);
			text_node.setAttribute("y", y*750);
			text_node.setAttribute("font-size", "100px");
			text_node.setAttribute("class", "宋体");
			text_node.setAttribute("width", "600");
			text_node.setAttribute("height", "800");
			text_node.setAttribute("fill", "gray");
			text_node.setAttribute("transform", "rotate(-40 0,0)");
			text_node.setAttribute("fill-opacity","0.2");
			text_node.appendChild(svgDocDocument.createTextNode(temp));
			g_node.appendChild(text_node);
		}
	}
	if(whole.nextSibling){
		whole.parentNode.insertBefore(g_node,whole.nextSibling);
	}else{
		whole.parentNode.appendChild(g_node);
	}
}
//删除阴影
function delShadow(){
	var shadow = svgDocDocument.getElementById("shadow");
	if(shadow != null){
		 var p = shadow.parentNode;
		 p.removeChild(shadow);
	}
}
/*
 * 更新svg实时数据
 * 
 */
//定义遍历xml文档的当前节点
var xmlUnit = null;
//通过设备ID在svgDoc中定位到的设备节点
var svgUnit = null;
//定义单元类型和子类型
var svgUnitClass = null, svgUnitType = null;

//关闭定时器
function closeRefreshTimer(){
	clearInterval(reFreshTimer);
} 

//重启定时器
function restartRefreshTimer(){
	if(reFreshTimer != null){
		clearInterval(reFreshTimer);
	}
	sheetFlag =false;
	freshRtdbData();
} 

function reInitMenu(){
	initMenu();
}

//刷新实时数据
function freshRtdbData(){
	if(freshFlag == "1"){
		setTimeout(refreshData, 200);//获取数据
		if(isChaoLiuTu){
			//潮流图、刷新时间间隔长
			reFreshTimer = setInterval(refreshData, 60000);
		}else{
			reFreshTimer = setInterval(refreshData, 2000);
		}
		
	}
}
var svgUnitTemp;
var UUID = "";
var sheetFlag = false;
var deviceID = "";
var elecArray;
var noElecArray;
var groundArray;
var lawlessArray;
var UUID_OLD = null;
var isFirst = true;
function refreshData(){
	var strParams = "";
	if(typeof parent.parent.getSysInfoStr == "function"){
		strParams = parent.parent.getSysInfoStr();
	}else{
		strParams = parent.getSysInfoStr();
	}
	$.ajax({ 
		url:encodeURI(realdataURL)+"?"+strParams+"&time="+new Date().getMilliseconds(),
		//url:"http://localhost:8080/bshms/graph/xmldata.xml",
		data:{'svgName':xmlName+".xml",'UUID':UUID,'sheetFlag':sheetFlag},
		type: "GET",
		dataType:"xml",
		success: function(data){
			/*
			if(isFirst){
				isFirst = false;
			}else{
				return;
			}*/
			if(isIE8Low){
				xmlDoc = $(data.documentElement);
			}else{
				xmlDoc = $(data);
			}
			var xmlRoot = xmlDoc.find("*").eq(0);
			UUID = xmlRoot.attr("UUID");
			if(UUID != null && UUID != "" && typeof parent.parent.addUUID4Tab == "function"){
				if(UUID_OLD != UUID){
					parent.parent.addUUID4Tab(xmlName,UUID);
					UUID_OLD = UUID;
				}
			}
			sheetFlag = xmlRoot.attr("sheetFlag");
			
			elecArray = new Array();
			noElecArray = new Array();
			groundArray = new Array();
			lawlessArray = new Array();
			
			xmlDoc.find("EMS").each(function (){
				//初始化当前xml文档节点
				xmlUnit = $(this);
				deviceID = $(this).attr("id");
				
				svgUnitTemp = svgDocDocument.getElementById(deviceID);
				svgUnit = $(svgUnitTemp);
				if(svgUnit == null){
					return;
				}
				//对于文本，因为包了两个g元素，定位设备类型和子类型
				try{
					svgUnitClass = svgUnit.parent().attr("unitclass");
					svgUnitType = svgUnit.parent().attr("unittype");
					if(typeof(svgUnitClass) == "undefined" || svgUnitClass == null || svgUnitClass == ""){
						svgUnitClass = svgUnit.parent().parent().attr("unitclass");
						svgUnitType = svgUnit.parent().parent().attr("unittype");
					}
				}catch(e){
					
				}
				
				//处理数据刷新
				processData();
				
				//拓扑着色单独刷新，需要把需要刷新的节点暂时缓存
				var elecValue = $(this).attr("elecValue");
				if(elecValue == "0"){
					noElecArray.push($(this));
				}
				else if(elecValue == "1"){
					elecArray.push($(this));
				}
				else if(elecValue == "2"){
					groundArray.push($(this));
				}
				else if(elecValue == "3"){
					lawlessArray.push($(this));
				}
				
			});
			
			//处理拓扑
			processTopo();
			
		}
	});
	
	//挂牌
	startfreshBrand();
}

//处理数据
function processData(){
	var xmlValue = xmlUnit.attr("value");
//	//如果是潮流图，并且处理的是acline（省调的潮流线），xmlValue为第一个子节点的value值
//	if(isChaoLiuTu && svgUnitType=="acline"){
//		xmlValue = xmlUnit.children().first().attr("value");
//	}
	
	if(typeof(xmlValue) == "undefined" || xmlValue == null || xmlValue == ""){
		return;
	}
	switch (svgUnitType) {
		case "dtext":
			processDtext();
			processDtextCode();
			break;
		case "Disconnector":		//刀闸
		case "GroundDisconnector":	//地刀
		case "CBreaker":			//开关
			processCBreaker();
			processCBreakerCode(true);
			break;
		case "Chzyb":			//重合闸
			processChzyb();
			processCBreakerCode(false);
			break;
		case "Gz":				//光字
			processGz();
			processGzCode(true);
			break;
		case "Protect":			//保护
			processGz();
			processGzCode(false);
			break;
		case "Status":
			processStatus();
			processCBreakerCode(false);
			break;
			
		case "acline":
			//处理潮流线
			processAcLine();
			break;
		default:

			
			break;
	}
}

//处理潮流线
function processAcLine(){
//	//潮流图，并且处理的是acline（省调的潮流线），xmlValue为第一个子节点的value值
//	var xmlValue = xmlUnit.children().first().attr("value");
	//潮流图  value值
	var xmlValue = xmlUnit.attr("value");
	if(xmlValue != null && xmlValue != "" && typeof(xmlValue) != "undefined"){
		xmlValue = parseInt(xmlValue);//忽略小数位
		var lastValue = svgUnit.attr("lastValue");
		var tempValue = 0;
		if(xmlValue > 0){
			//潮流方向为正
			tempValue = 1;
		}else if(xmlValue < 0){
			//潮流方向为反
			tempValue = -1;
		}else{
			//无潮流方向
			tempValue = 0;
		}
		if(lastValue != tempValue){
			svgUnit.attr("lastValue",tempValue);
			/*
			 * 	<g>
					<path onmouseover="window.parent.select(evt)" fill-opacity="0" class1="v112871465677750274" class2="vnull" onmouseout="window.parent.unselect(evt)" class="v112871465677750274" keyid="116530640945414455" d="M 1124.16,2089.83 L 935.84,1600.17" id="33035647" keyname="福建.漳五Ⅰ路" stroke-width="12.0"/>
					<path onmouseover="window.parent.select(evt)" fill-opacity="0" class1="v112871465677750274" class2="vnull" onmouseout="window.parent.unselect(evt)" class="v112871465677750274" keyid="116530640945414455" d="M 935.84,1600.17 L 1124.16,2089.83" id="33035647_opposite" keyname="福建.漳五Ⅰ路" stroke-width="12.0"/>
					<path d="M0,-10 L20,0 L 0,10 z" fill-opacity="0" class="v0" stroke-opacity="0">
						<animateMotion dur="17.49s" rotate="auto" repeatCount="indefinite">
							<mpath xlink:href="#33035647"/>
						</animateMotion>
					</path>
				</g>
			 */
			if(tempValue > 0){
				var id = svgUnit.attr("id");
				svgUnit.next().next().attr("fill-opacity","1");
				svgUnit.next().next().attr("stroke-opacity","1");
				svgUnit.next().next().children().first().children().first().attr("xlink:href", "#" + id);
			}else if(tempValue < 0){
				var id = svgUnit.next().attr("id");
				svgUnit.next().next().attr("fill-opacity","1");
				svgUnit.next().next().attr("stroke-opacity","1");			
				svgUnit.next().next().children().first().children().first().attr("xlink:href","#" + id);
			}else{
				svgUnit.next().next().attr("fill-opacity","0");
				svgUnit.next().next().attr("stroke-opacity","0");
			}
		}
	}
	//测试
//	var id = svgUnit.attr("id");
//	if(id == "10001015"){
//		debugger;
//	}
	
	//着色处理
	var elecValue = xmlUnit.attr("elecValue");
	var svgUnitNect = svgUnit.next();
	if(elecValue != null && elecValue != "" && typeof(elecValue) != "undefined"){
		var lastElecValue = svgUnitNect.attr("lastValue");
		var oriclass = svgUnitNect.attr("oriclass");
		if(oriclass == null){
			 oriclass = svgUnitNect.attr("class");
			 svgUnitNect.attr("oriclass", oriclass);
		}
		if(elecValue!=lastElecValue){
			if(elecValue == "0"){
				svgUnitNect.attr("class",oriclass + " ElecNone");
			}
			else{
				svgUnitNect.attr("class",oriclass);
			}
			svgUnitNect.attr("lastValue",elecValue);
		}
	}
}

//处理量测 dtext
function processDtext(){
	var xmlValue = xmlUnit.attr("value");
	var lastValue = svgUnit.attr("lastValue");
	if(lastValue == xmlValue){
		return;
	}
	svgUnit.attr("lastValue",xmlValue);
	if(typeof(xmlValue) == "undefined" || xmlValue == null || xmlValue == ""){
		return;
	}
	if(xmlValue != null && xmlValue != "" && typeof(xmlValue) != "undefined"){
		//获取保留小数位数
		var dotLength = xmlUnit.attr("dotLength");
		var dotLen = 0;
		if(dotLength != null){
			dotLen = parseInt(dotLength);
		}
		
		if(dotLen > 0){
			xmlValue = parseFloat(xmlValue).toFixed(dotLen);
		}
		else if(dotLen == 0){
			xmlValue = parseInt(xmlValue);
		}
		//如果是潮流图不显示正负号
		if(isChaoLiuTu){
			xmlValue = Math.abs(xmlValue);
		}
		var val = xmlValue; //getArrowVlaue(svgUnit,xmlValue);
		svgUnit.html(val);
		svgUnit.attr("lastValueFormat",val);
	}
}
//刷新量测的质量码
function processDtextCode(){
	var valueType = xmlUnit.attr("valueType");
	var timeStamp = xmlUnit.attr("timeStamp");
	svgUnit.attr("timeStamp",timeStamp);
	var isValid = xmlUnit.attr("isValid");
	var code = xmlUnit.attr("code");
	var firstcode = svgUnit.attr("firstcode");
	if(firstcode=="undefined"  || firstcode == null){
		var color=svgUnit.attr("fill");
		svgUnit.attr("firstcode",color);
	}
	var lastCode = svgUnit.attr("lastCode");
	if(lastCode == code){
		return;
	}
	svgUnit.attr("lastCode",code);
	var num = parseInt(code).toString(2);
	var nums=[];
	nums=num.split("");
	svgUnit.attr("codetext","");
	if(nums.length >31){
		return;
	}
	var bwlength=31-nums.length;
	var numvals=[]
	for(var j=0;j<bwlength;j++){
		numvals.push("0");
	}
	for(var k=0;k<nums.length;k++){
		numvals.push(nums[k]);
	}
	var i=0;
	var flag=0;
	var lastclass=null;;
	for(i=0;i<numvals.length;i++){
		if(numvals[i]=="1"){
			svgUnit.attr("fill",yc1[i]);
			svgUnit.attr("class","");
			flag=1;
			var tmptext = svgUnit.attr("codetext");
			svgUnit.attr("codetext",tmptext+yctext[i]+" ");
			break;
		}
	}
	if(flag==0){
		svgUnit.attr("fill","#ffffff");
		svgUnit.attr("codetext",yctext[0]);
	}
}

//根据数值获取箭头方向
function getArrowVlaue(textNode_,xmlMeasureValue){
	var arrow = textNode_.attr("arrow");
	if(arrow == null || arrow == ""){
        var text = textNode_.text();
        arrow = text.substring(0,1);
        textNode_.attr("arrow", arrow);//原始箭头方向
    }
    if(arrow == "↓" )
    {
        if(xmlMeasureValue>0)
        {
            xmlMeasureValue = arrow + xmlMeasureValue;
        }
        else if(xmlMeasureValue<0)
        {
            xmlMeasureValue = "↑" + Math.abs(xmlMeasureValue);
        }
    }
    else if(arrow == "↑")
    {
        if(xmlMeasureValue>0)
        {
            xmlMeasureValue = arrow + xmlMeasureValue;
        }
        else if(xmlMeasureValue<0)
        {
            xmlMeasureValue = "↓" + Math.abs(xmlMeasureValue);
        }
    }
    else if(arrow == "←")
    {
        if(xmlMeasureValue>0)
        {
            xmlMeasureValue = arrow + xmlMeasureValue;
        }
        else if(xmlMeasureValue<0)
        {
            xmlMeasureValue = "→" + Math.abs(xmlMeasureValue);
        }
    }
    else if(arrow == "→")
    {
        if(xmlMeasureValue>0)
        {
            xmlMeasureValue = arrow + xmlMeasureValue;
        }
        else if(xmlMeasureValue<0)
        {
            xmlMeasureValue = "←" + Math.abs(xmlMeasureValue);
        }
    }
    return xmlMeasureValue;
}

//处理开关分合状态、刀闸、地刀同此
function processCBreaker(){
	var xmlValue = xmlUnit.attr("value");
	var svgValue = svgUnit.attr("value");
	
	//记录电压等级的初始值
	var svgClassOri = svgUnit.attr("svgClassOri");
	if(svgClassOri == null || "" == svgClassOri){
		svgUnit.attr("svgClassOri",svgUnit.attr("class"));
	}
	//状态变化,如果一致，则不做刷新处理
	if(typeof(svgValue) == "undefined" || svgValue != xmlValue){
		var dataValue = "";//状态
		switch (xmlValue) {
			case "1": //合
				dataValue = "合";
				svgUnit.attr("fenheClass", "vfill");	//分和状态class
				break;
			default:
				dataValue = "分";
				svgUnit.attr("fenheClass", "");			//分和状态class
				break;
		}
		addSvgFillClass(svgUnit);
		if(parent.parent.group == "scada"){
			//处理闪烁
			if(typeof svgUnit.attr("value") != "undefined"){
				processFlash(svgUnit);
			}
		}
		
		var tempHref = svgUnit.attr("xlink:href");
		svgUnit.attr("xlink:href", tempHref.substring(0, tempHref.length - 2) + "_" + xmlValue);
		svgUnit.attr("value", xmlValue);
		svgUnit.attr("means", dataValue);
		var timeStamp = xmlUnit.attr("timeStamp");
		svgUnit.attr("timeStamp",timeStamp);
	}
}

//处理遥信质量码
function processCBreakerCode(flashFlag){
	var code = xmlUnit.attr("code");
	var lastcode=svgUnit.attr("lastcode");
	if(lastcode!=code || lastcode =="undefined" ||lastcode ==null){
		svgUnit.attr("code",lastcode);
		
		//如果质量码为零，直接是正常状态
		if(code == "0"){
			svgUnit.attr("zhiliangmaClass","");
			svgUnit.attr("codetext",yktext[0]);
			addSvgFillClass(svgUnit);
			return;
		}
		
		var num = parseInt(code).toString(2);
		var nums=[];
		nums=num.split("");
		if(nums.length >31){
			return;
		}
		var classStr = svgUnit.attr("class");
		var bwlength=31-nums.length;
		var numvals=[]
		for(var j=0;j<bwlength;j++){
			numvals.push("0");
		}
		for(var k=0;k<nums.length;k++){
			numvals.push(nums[k]);
		}
		var flag=0;
		if(parent.parent.group == "dts" && flashFlag){
			if((numvals[12]=="0") && (numvals[13]=="0")){  //第18位和第19位
				if(typeof svgUnit.attr("value") != "undefined"){
					noflash(svgUnit);
				}
			}else{
				flash(svgUnit);
			}
		}
		svgUnit.attr("codetext","");
		for(var i=0;i<numvals.length;i++){
			if(numvals[i]=="1"){
			 switch(i){
				case 11:
				case 13:
				case 12:
				case 21:
					svgUnit.attr("zhiliangmaClass","");
					var tmptext = svgUnit.attr("codetext");
					svgUnit.attr("codetext",tmptext+yktext[i]+" ");
					break;
				case 18:
				case 22:
					svgUnit.attr("zhiliangmaClass","yk"+i);
					var tmptext = svgUnit.attr("codetext");
					svgUnit.attr("codetext",tmptext+yktext[i]);
					flag=1;
				  break;
				default:
					svgUnit.attr("zhiliangmaClass","");
					svgUnit.attr("codetext",yktext[0]+" ");
				}	
			}
			addSvgFillClass(svgUnit);
		}
	}
}

//处理光字质量码
function processGzCode(flashFlag){
	var code = xmlUnit.attr("code");
	var lastcode=svgUnit.attr("code");
	
	//质量码不一致时继续处理
	if(lastcode!=code || lastcode =="undefined" ||lastcode ==null){
		svgUnit.attr("code",lastcode);
		
		//如果质量码为零，直接是正常状态
		if(code == "0"){
			svgUnit.attr("zhiliangmaClass","");
			svgUnit.attr("codetext",yktext[0]);
			addSvgFillClass(svgUnit);
			return;
		}
		
		var num = parseInt(code).toString(2);
		var nums=[];
		nums=num.split("");
		if(nums.length >32){
			return;
		}
		var classStr = svgUnit.attr("class");
		var bwlength=32-nums.length;
		var numvals=[]
		for(var j=0;j<bwlength;j++){
			numvals.push("0");
		}
		for(var k=0;k<nums.length;k++){
			numvals.push(nums[k]);
		}
		var flag=0;
		//闪烁
		if(parent.parent.group == "dts" && flashFlag){
			if(numvals[11]=="1"){  //第21位
				if(typeof svgUnit.attr("value") != "undefined"){
					flash(svgUnit);
				}
			}else{
				noflash(svgUnit);
			}
		}
		
		//质量码着色
		for(var i=0;i<numvals.length;i++){
			if(numvals[i]=="1"){
				 switch(i){
					case 11:
					case 13:
					case 21:
						svgUnit.attr("zhiliangmaClass","");
						svgUnit.attr("codetext",yktext[i]);
						break;
					case 18:
					case 22:
						svgUnit.attr("zhiliangmaClass","yk"+i);
						svgUnit.attr("codetext",yktext[i]);
						flag=1;
					  break;
					default:
						svgUnit.attr("zhiliangmaClass","");
						svgUnit.attr("codetext",yktext[0]);
				}	
				addSvgFillClass(svgUnit);
			}
		}
		
	}
}

//处理重合闸、无拓扑
function processChzyb(){
	var xmlValue = xmlUnit.attr("value");
	var svgValue = svgUnit.attr("value");
	//状态变化
	if(typeof(svgValue) == "undefined" || svgValue != xmlValue){
		
		var dataValue = "";
		
		switch (xmlValue) {
			case "0"://故障
				dataValue = "分";
				break;
			case "1": //分
				dataValue = "合";
				break;
			default:
				break;
		}
		
		//处理闪烁
		if(typeof svgUnit.attr("value") != "undefined"){
			processFlash(svgUnit);
		}
		
		var tempHref = svgUnit.attr("xlink:href");
		svgUnit.attr("xlink:href", tempHref.substring(0, tempHref.length - 2) + "_" + xmlValue);
		svgUnit.attr("value", xmlValue);
		svgUnit.attr("means", dataValue);
		var timeStamp = xmlUnit.attr("timeStamp");
		svgUnit.attr("timeStamp",timeStamp);
	}
}

//处理光字
function processGz(){
	var xmlValue = xmlUnit.attr("value");
	var svgValue = svgUnit.attr("value");
	var pri_flags = svgUnit.attr("pri_flags");
	if(pri_flags == null || pri_flags == ""){
		pri_flags = "1";
	}
	//状态变化
	if(typeof(svgValue) == "undefined" || svgValue != xmlValue){
		
		var dataValue = "";
		switch (xmlValue) {
			case "1": 
				dataValue = "动作";
				svgUnit.attr("svgClassOri", "protect"+pri_flags);
				svgUnit.attr("class", "protect"+pri_flags);
				break;
			default:
				dataValue = "复归";
				svgUnit.attr("svgClassOri", "protect");
				svgUnit.attr("class", "protect");
				break;
		}
		svgUnit.attr("value", xmlValue);
		svgUnit.attr("means", dataValue);
	}
}

//闪烁
function flash(node){
	var timer = node.attr("nodeflashTimer");
	if(timer == null || typeof(timer) == "undefined" || timer == ""){//没有定时器
		timer = setInterval(function(){
			node.toggle();
		}, 1000);
		svgUnit.attr("nodeflashTimer",timer);
	}
}

//停止闪烁
function noflash(node){
	var te = node.attr("nodeflashTimer");
	node.show();
	if(te != null && typeof te != "undefined"){
		node.attr("nodeflashTimer", null);
		clearInterval(te);
	}
}

//处理状态灯
function processStatus(){
	var xmlValue = xmlUnit.attr("value");
	var svgValue = svgUnit.attr("value");
	//状态变化
	if(typeof(svgValue) == "undefined" || svgValue != xmlValue){
		var dataValue = "";
		switch (xmlValue) {
			case "0"://故障
				dataValue = "分";
				svgUnit.attr("fenheClass", "");			//分和状态class
//				removeSvgStatusFillClass();
				break;
			case "1": //分
				dataValue = "合";
				svgUnit.attr("fenheClass", "vStatusfill");	//分和状态class
//				addSvgStatusFillClass();
			default:
				break;
		}
		addSvgFillClass(svgUnit);
		svgUnit.attr("value", xmlValue);
		svgUnit.attr("means", dataValue);
	}
}

//添加遥信填充样式
function addSvgFillClass(svgClassUnit){
	//刷新样式时、需要考虑开关合分、开关带电状态、开关质量码,优先级从高到低顺序为：开关质量码、开关带电状态、开关合分
	var svgClassOri = svgClassUnit.attr("svgClassOri");
	var fenheClass = svgClassUnit.attr("fenheClass");
	var eleClass =  svgClassUnit.attr("eleClass");
	var zhiliangmaClass =  svgClassUnit.attr("zhiliangmaClass");
	if(typeof(svgClassOri) == "undefined" || svgClassOri == null){
		svgClassOri = "";
	}
	if(typeof(fenheClass) == "undefined" || fenheClass == null){
		fenheClass = "";
	}
	if(typeof(eleClass) == "undefined" || eleClass == null){
		eleClass = "";
	}
	if(typeof(zhiliangmaClass) == "undefined" || zhiliangmaClass == null){
		zhiliangmaClass = "";
	}
	
	var newClass = svgClassOri;
	if(fenheClass != null){
		newClass += " " + fenheClass;
	}
	if(eleClass != null){
		newClass += " " + eleClass;
	}
	if(zhiliangmaClass != null){
		newClass += " " + zhiliangmaClass;
	}
	
	svgClassUnit.attr("class",newClass);
}

//闪烁
function processFlash(node){
	if(isFlash){
		//通过定时器控制闪烁
		var timer = node.attr("nodeTimer");
		if(timer == null || typeof(timer) == "undefined" || timer == ""){//没有定时器
			node.attr("nodeValue", 0);
			timer = setInterval(function(){
				node.toggle();
				var nodeValue = node.attr("nodeValue");
				nodeValue = parseInt(nodeValue + "");
				if(nodeValue < 10){
					nodeValue = nodeValue + 1;
					node.attr("nodeValue", nodeValue);
				}else{
					node.show();
					var te = node.attr("nodeTimer");
					if(te != null && typeof te != "undefined"){
						node.attr("nodeTimer", null);
						clearInterval(te);
					}
				}
        	}, 1000);
			svgUnit.attr("nodeTimer",timer);
		}
	}
}

//拓扑着色
function processTopo(){
	try{
		processEachDeviceTopo(lawlessArray);
		processEachDeviceTopo(groundArray);
		processEachDeviceTopo(noElecArray);
		processEachDeviceTopo(elecArray);
		
		processEachDeviceTermTopo(lawlessArray);
		processEachDeviceTermTopo(groundArray);
		processEachDeviceTermTopo(noElecArray);
		processEachDeviceTermTopo(elecArray);
	}catch (e) {
		alert(e);
	}
}

//对设备进行着色
function processEachDeviceTopo(array){
	if(array.length>0){
		for(var i=0;i<array.length;++i){
			var xmlNode = array[i];
			var eleValue = xmlNode.attr("elecValue");
			var deviceId = xmlNode.attr("id");
			var useNode = svgDocDocument.getElementById(deviceId);
			if(useNode!=null){
				var name = useNode.parentNode.getAttribute("name");
		    	//变压器需要特殊处理
		    	if(name != null && name.indexOf("变压器")>-1){
		    		processTransElec(eleValue,useNode);
		    	}
		    	else{
		    		processKGElec(eleValue,useNode);
		    	}
			}
		}
	}
}

//逐个处理着色
function processEachDeviceTermTopo(array){
	if(array.length>0){
		for(var i=0;i<array.length;++i){
			var xmlNode = array[i];
			var eleValue = xmlNode.attr("elecValue");
			var deviceId = xmlNode.attr("id");
			var useNode = svgDocDocument.getElementById(deviceId);
			if(useNode!=null){
				var name = useNode.parentNode.getAttribute("name");
		    	//变压器需要特殊处理
		    	if(name != null && name.indexOf("变压器")>-1){
		    		//目前没有处理变压器端点
		    	}
		    	else{
		    		processKGTermElec(eleValue,useNode);
		    	}
			}
		}
	}
}

//处理开关刀闸带电着色
function processKGElec(elecValue,useNode)
{
	elecValue = getElecValueByStr(elecValue);
	if (processElecToData(elecValue, useNode))
	{
	    processElec(elecValue, useNode);
	}
}

//处理开关刀闸带电着色
function processKGTermElec(elecValue,useNode)
{
	elecValue = getElecValueByStr(elecValue);
    processTerminalElec(elecValue, useNode,0);
    processTerminalElec(elecValue, useNode,1);
}

//处理变压器
function processTransElec(elecValue,useNode){
	elecValue = getElecValueByStr(elecValue);
	if (processElecToData(elecValue, useNode))
	{
		processTransElecToData(elecValue, useNode);
	}
}

//带电状态值
function getElecValueByStr(elecStr)
{
    if (null == elecStr)
    {
        return 3;
    }
    return  parseInt(elecStr);
}

//Terminal带电状态处理
function processTerminalElec(elecValue, useNode,terminalIndex)
{
	//先判断所连接的设备是否有带电的，若有则不处理
	if(elecValue == "0"){
		 var temp = useNode.getAttribute("connectDevice"+terminalIndex);
		 if (temp != null && temp != "")
		    {
		        var ids = temp.split(";");
		        var ff = false;
		        for (var i = 0; i < ids.length; ++i)
		        {
		            var id = ids[i];
		            if (id != null && id != "")
		            {
		                psvgUnit_ = svgDocDocument.getElementById(id);	//效率低
		                if (psvgUnit_ != null)
		                {
		                   var eleMeas = psvgUnit_.getAttribute("elecValue");
		                   if(eleMeas == "1"){
		                	   ff = true;
			                   break;
		                   }
		                }
		            }
		        }
		        
		        if(ff){
		        	return;
		        }
		    }
	}
	
	
    //处理关联的连接线
    var t = useNode.getAttribute("linkline"+terminalIndex);
    if (t != null && t != "")
    {
        var ids = t.split(";");
        for (var i = 0; i < ids.length; ++i)
        {
            var id = ids[i];
            if (id != null && id != "")
            {
                psvgUnit_ = svgDocDocument.getElementById(id);	//效率低
                if (psvgUnit_ != null)
                {
                    processElecToDraw(elecValue, psvgUnit_);
                }
            }
        }
    }
}

//带电值缓存
function processElecToData(elecValue, useNode)
{
    var changed = false;
    var svgDataValue = "非法";
    if (useNode != null && isRender)
    {
        if ((elecValue + "") != useNode.getAttribute("elecValue"))
        {
            changed = true;
            switch (elecValue)
            {
	            case 0:
	            {
	                svgDataValue="不带电";
	                break;
	            }
                case 1:
                {
                    svgDataValue="带电";
                    break;
                }
            }
            useNode.setAttribute("eleMeans", svgDataValue);
            useNode.setAttribute("elecValue", ""+elecValue);
        }
    }
    return changed;
}

//带电状态着色
var isRender = true;	//动态着色标志
function processElecToDraw(elecValue, svgDrawNode)
{
	var $svgDrawNode = $(svgDrawNode);
	//记录电压等级的初始值
	var svgClassOri = $svgDrawNode.attr("svgClassOri");
	if(svgClassOri == null || "" == svgClassOri){
		$svgDrawNode.attr("svgClassOri",$svgDrawNode.attr("class"));
	}
	
    if (isRender)
    {
        switch (elecValue)
        {
	        case 0:  //不带电 
	        {
	        	$svgDrawNode.attr("eleClass","ElecNone");
	            break;
	        }
            case 1:	//带电
            {
            	$svgDrawNode.attr("eleClass","");
                break;
            }
           
        }
        addSvgFillClass($svgDrawNode);
    }
    else
    {
        //默认让全部显示正常颜色，不进行动态着色
      //  restoreOriState();
        isRender = !isRender;
    }
}

//带电状态处理
function processElec(elecValue, useNode)
{
     processElecToDraw(elecValue, useNode);
}

//变压器着色
function processTransElecToData(elecValue, useNode){
	 elecValue = parseInt(elecValue);
	 processTransElecToDraw(elecValue, useNode);
}

//变压器着色
function processTransElecToDraw(elecValue, svgDrawNode)
{
		$(svgDrawNode).find("use").each(function (){
			var class_old = $(this).attr("class_old");
	    	if(class_old == null){
				class_old = $(this).attr("class");
				$(this).attr("class_old", class_old);
	    	}
		});
		
	    if (isRender)
	    {
	    	$(svgDrawNode).find("use").each(function (){
	    		 switch (elecValue)
	    	        {
	    	        	case 1:
	    	        		var class_old = $(this).attr("class_old");
	    	            	if(class_old != null){
	    	        			$(this).attr("class", class_old);
	    	            	}
	    	        		break;
	    	            case 0:
	    	            {
	    	            	
	    	            	$(this).attr("class", "ElecNoneTrans");
	    	                break;
	    	            }
	    	            case 2:
	    	            {
	    	            	$(this).attr("class", "ElecNoneTransGround");
	    	                break;
	    	            }
	    	            case 3:
	    	            {
	    	            	$(this).attr("class", "ElecNoneTransLawless");
	    	                break;
	    	            }
	    	        }
	    	});
	    }
	    else
	    {
	        //默认让全部显示正常颜色，不进行动态着色
	        //  restoreOriState();
	        isRender = !isRender;
	    }
}


//----------------------------------------------------------
//去掉字符串前后的空格
//返回值：
//去除空格后的字符串
//----------------------------------------------------------
function trim(param) {
	if ((vRet = param) == '') {
		return vRet; 
	}
	while (true) {
		if (vRet.indexOf (' ') == 0) {
			vRet = vRet.substring(1, parseInt(vRet.length));
		} else if ((parseInt(vRet.length) != 0) && (vRet.lastIndexOf (' ') == parseInt(vRet.length) - 1)) {
			vRet = vRet.substring(0, parseInt(vRet.length) - 1);
		} else {
			return vRet;
		}
	}
}

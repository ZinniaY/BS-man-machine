define(["jquery"],function($){
	var onOpen = function() {
			console.log("Socket opened.");
			// 向服务器端发送的数据
			socket.send("Hi, Server!");
		},
		onClose = function() {
			console.log("Socket closed.");
		},
		onMessage = function(ws) {
			//  从服务器端接收的数据
			console.log(ws);
			if(!ws.data){
				return;
			}
			var wsDatas=JSON.parse(ws.data);
			for (var  i = 0; i < wsDatas.length; i++) {
			    var unitData=wsDatas[i];
				var unitId=unitData.id;
				if(unitId===undefined){
					break;
				}
				var unitNode=$("#"+unitId);
				console.log( unitNode );
				console.log( unitNode.parent() );
				var newType=unitNode.parent()[0].getAttribute("unitType");
				console.log( newType );
				switch (newType) {
					case "DText":
						var newValue = unitData.value;
						var lastValue = unitNode.text();
						if(lastValue == newValue){
							break;
						}
						processDtext(newValue,unitNode);
						// TODO:质量码什么影响？
						// processDtextCode();
						break;
					case "Disconnector":		//刀闸
					case "GroundDisconnector":	//地刀
					case "CBreaker":			//开关
						// processCBreaker();
						// processCBreakerCode(true);
						break;
					case "Chzyb":			//重合闸
						// processChzyb();
						// processCBreakerCode(false);
						break;
					case "Gz":				//光字
						// processGz();
						// processGzCode(true);
						break;
					case "Protect":			//保护
						// processGz();
						// processGzCode(false);
						break;
					case "Status":
						// processStatus();
						// processCBreakerCode(false);
						break;
					
					case "acline":
						// //处理潮流线
						// processAcLine();
						break;
				}
			}
		},
		onError = function() {
			console.log("We got an error.");
		},
		socket = new WebSocket("ws://127.0.0.1:9000/");
	
	socket.onopen = onOpen;
	socket.onclose = onClose;
	socket.onerror = onError;
	socket.onmessage = onMessage;
	
	
	//处理量测 dtext
	function processDtext(newVal,node){
		if(typeof(newVal) == "undefined" || newVal == null || newVal == ""){
			return;
		}
		if(newVal != null && newVal != "" && typeof(newVal) != "undefined"){
			//获取保留小数位数
			var dotLength = node.attr("dotLength");
			var dotLen = 0;
			if(dotLength != null){
				dotLen = parseInt(dotLength);
			}
			
			if(dotLen > 0){
				newVal = parseFloat(newVal).toFixed(dotLen);
			}
			else if(dotLen == 0){
				newVal = parseInt(newVal);
			}
			//如果是潮流图不显示正负号
			// if(isChaoLiuTu){
			// 	newVal = Math.abs(newVal);
			// }
			// var val = newVal; //getArrowVlaue(svgUnit,xmlValue);
			// node.html(val);
			// node.attr("lastValueFormat",val);
			node.text(newVal);
			
		}
	}
	
});

    
define(function(){
	function From_G_XML(fileName,methodName){
		var xmlHttp ;
		function createXMLHttp(){
			if(window.XMLHttpRequest){
				xmlHttp = new XMLHttpRequest() ;
			} else {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP") ;
			}
		}
		
		createXMLHttp();
		xmlHttp.open("POST","copy.jsp?methodName="+methodName+"&fileName="+fileName) ;
		xmlHttp.onreadystatechange = null;
		xmlHttp.send(null) ;
	}
	function parseAllXML(xmlFile){
		/*var filepath = "../XML/";
		 var my_xmlFile = filepath+xmlFile.substring(0,xmlFile.length-1)+"xml";
		 From_G_XML(xmlFile, "createFile");
		 From_G_XML(xmlFile, "copyFile");*/
		
		var stations=null;
		var root=null;
		var xmlHttp=new XMLHttpRequest();
		xmlHttp.open("GET", xmlFile, false);
		xmlHttp.send(null);
		root=xmlHttp.responseXML.documentElement;
		
		var rootName = root.nodeName;
		if(rootName=="G"){
			stations = root;
		}else{
			alert("xml");
		}
		return stations;
	}
	

	function parseXML(id,tagName,xmlFile){
		var target_node=null;
		var stations=null;
		var xmlDoc=null;
		var xmlHttp=new XMLHttpRequest();
		xmlHttp.open("GET", xmlFile, false);
		//alert(xmlFile);
		//       if(tagName == "Reactor_P"){
		// 	tagName = "Reactor";
		// }
		xmlHttp.send(null);
		xmlDoc=xmlHttp.responseXML.documentElement;
		stations=xmlDoc.getElementsByTagName(tagName);
		for(var i=0;i<stations.length;i++){
			var tmp_id = stations[i].getAttribute("id");
			
			// tmp_id = tmp_id.indexOf("SG") > -1 ? tmp_id.substring(3) : tmp_id;
			
			if(tmp_id==id){
				target_node = stations[i];
				return target_node;
			}
		}
		return target_node;
	}
	return {
		From_G_XML:From_G_XML,
		parseAllXML:parseAllXML,
		parseXML:parseXML
	}
});



	
	
	


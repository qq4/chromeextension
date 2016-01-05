function myLocalStorage_parseToStr(){
	var retStr ="";
	var key,value;
	for(var i=0,len=window.localStorage.length;i<len;i++){
		key = window.localStorage.key(i);
		retStr += key;
		retStr += "\n";
		value = window.localStorage.getItem(key);
		retStr += value;
		retStr += "\n";
	}
	return retStr;
}
function myLocalStorage_parseFromStr(str){
	var bOk = true;
	var oldv = myLocalStorage_parseToStr();
	window.localStorage.clear();
	//
	var lines = str.split("\n");
	var line_ct = lines.length;
	var ct = Math.floor(line_ct/2);
	//alert(ct);
	for(var i=0;i<ct;i++){
		window.localStorage.setItem(lines[i*2],lines[i*2+1]);
	}
	//
	if(!bOk){
		if(!myLocalStorage_parseFromStr(oldv)){
			alert("载入数据出错，本地数据已毁。");
		}
	}
	return bOk;
}
function fileimport_0(){
    var strFeatures = "dialogHeight:200px; dialogWidth:600px;center=yes;scrollbars=no" ;

    var obj = new Object();//傳遞參數到 Popup Window
    window.showModalDialog("html/fileimport.html", obj, strFeatures);//chrome 37+ not support    
    if(obj.retCode == "0"){
        //var msg = "<< Defect Code Load Complete! >>\n\n";
        //msg = msg + "[Code] " + obj.retCode + "\n[Message] " + obj.retMessage + "\n[Defect Code Rows] " + obj.retCount + "\n[HotKey Rows] " + obj.retCount1;
        //alert(msg);
        //location.href = "ovc.jsp?mach="+mach+"&layoutMode="+layoutMode;
    }else if(obj.retCode){
        //var msg = "<< Defect Code Load Fail! >>\n\n";
        //msg = msg + "[Code] " + obj.retCode + "\n[Message] " + obj.retMessage + "\n[Defect Code Rows] " + obj.retCount + "\n[HotKey Rows] " + obj.retCount1;
        //alert(msg);
    }
}
function fileimport(){	
	var iWidth = 600;
	var iHeight = 200;
	var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
	var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
	var strFeatures = "width=" + iWidth + ", height=" + iHeight + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no,alwaysRaised=yes,depended=yes";
	var winRet = window.open("html/fileimport.html", "file import", strFeatures);
	//alert("winRet:["+winRet+"]");
}
function fileimport_finish(obj){
	alert(obj.id+"\n"+obj.name);
}
function gatherlocalStorage(){
	var str = "ok";
	return str;
}
function tabop(t) {
  // No tabs or host permissions needed!
  console.log('Turning ' + t.url + ' green!');
  chrome.tabs.executeScript({
    code: 'document.body.style.backgroundColor="green"'
  });
}
function tablistop(tl) {
	for(var i=0;i<tl.length;i++){
		var t = tl[i];
		console.log('get '
		+t.id+','
		+ t.index+','
		+t.windowid+','
		+t.highlighted+','
		+t.active
		+'[' + t.url + '] url');
	}
}
function fileexport(){
	var str = gatherlocalStorage();
	//chrome中不支持window.clipboardData
	/*if (window.clipboardData)
    {
    	window.clipboardData.clearData(); 
        window.clipboardData.setData("Text",str);
        alert("已复制到剪切板");
    }
    else{
     	alert('您的浏览器不支持剪切板，请手动copy：' + str);             	
    }*/
    //alert("已复制到剪切板");
    //window.copy(str);
    //var t = chrome.tabs.getCurrent(tabop);
    //var t = chrome.tabs.query({active:true},tablistop);
    chrome.tabs.query({currentWindow:true},tablistop);
    
    //var a = chrome.activeTab;
    //alert("ss");
}
function fileexport_finish(){
}
function localStorageClean(){
	if(confirm('是否确定要清空所有保存条目？（本机保存的内容将被清空！）')){
		//先摘录出需要保存的变量
		var vl = ["option:NeedTip_restoreWindow","option:NeedNoTip_delItem","qq"];//new Array("option:needtip");
		var vr = [];
		for(var i=0;i<vl.length;i++){
			vr[i] = window.localStorage.getItem(vl[i]);
		}
		//
		window.localStorage.clear();
		//恢复
		for(var i=0;i<vl.length;i++){
			if(vr[i])
				window.localStorage.setItem(vl[i],vr[i]);
		}
		//刷新
		myRefresh();
	}else{
	}
}
function localStorageLoad(){
	if(confirm('是否确定要载入现有内容？\n（本机保存的内容将被覆盖！）')){
		var str = document.getElementById("taInfo").value;
		if(myLocalStorage_parseFromStr(str)){
			alert("载入成功。");
			myRefresh();
		}else{
			alert("载入失败，请检查内容。");
		}
	}
}
function txtLocalStorageRefresh(){
	var str = myLocalStorage_parseToStr();
	//document.getElementById("taInfo").innerText = str;//这个无法直接刷新
	document.getElementById("taInfo").value = str;
}
function myRefresh(){
	txtLocalStorageRefresh();
	var cb = document.getElementById("cbNeedTip_restoreWindow");
	cb.checked = (window.localStorage.getItem('option:NeedTip_restoreWindow')=="true")?true:false;
	var cb2 = document.getElementById("cbNeedNoTip_delItem");
	cb2.checked = (window.localStorage.getItem('option:NeedNoTip_delItem')=="true")?true:false;
}
window.onload = function(){
	//alert("onload");
    //绑定按钮事件
	document.getElementById("btnImport").addEventListener('click',function(){
		//alert("import");
		fileimport();
	},true);
	document.getElementById("btnExport").addEventListener('click',function(){
		//alert("export");
		fileexport();
	},true);
	document.getElementById("btnClean").addEventListener('click',function(){
		//alert("export");
		localStorageClean();
	},true);
	document.getElementById("btnLoad").addEventListener('click',function(){
		//alert("load");
		localStorageLoad();
	},true);
	document.getElementById("btnRefresh").addEventListener('click',function(){
		//alert("refresh");
		txtLocalStorageRefresh();
	},true);
	var cb = document.getElementById("cbNeedTip_restoreWindow");
	cb.addEventListener('click',function(){
		var c = document.getElementById("cbNeedTip_restoreWindow").checked;
		window.localStorage.setItem('option:NeedTip_restoreWindow',c);
	},true);
	var cb2 = document.getElementById("cbNeedNoTip_delItem");
	cb2.addEventListener('click',function(){
		var c = document.getElementById("cbNeedNoTip_delItem").checked;
		window.localStorage.setItem('option:NeedNoTip_delItem',c);
	},true);
	
	myRefresh();
}


function fileimport0(){
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
function myInit(){
	var $=function(id){return document.getElementById(id);}
	var Tasks = {
		show:function(obj){
			obj.className='';
			return this;
		},
		hide:function(obj){
			obj.className='hide';
			return this;
		},
		//存储dom
		$addItemDiv:$('addItemDiv'),
		$addItemInput:$('addItemInput'),
		$txtTaskTitle:$('txtTaskTitle'),
		$taskItemList:$('taskItemList'),
		$btnImport:$('btnImport'),
		$btnExport:$('btnExport'),
		//指针
		index:window.localStorage.getItem('Tasks:index'),
		//初始化
		init:function(){
			if(!Tasks.index){
				window.localStorage.setItem('Tasks:index',Tasks.index=0);
			}
			/*注册事件*/
			//打开添加文本框
			Tasks.$addItemDiv.addEventListener('click',function(){
				Tasks.show(Tasks.$addItemInput).hide(Tasks.$addItemDiv);
				Tasks.$txtTaskTitle.focus();
			},true);
			//回车添加
			Tasks.$txtTaskTitle.addEventListener('keyup',function(ev){
				var ev=ev || window.event;
				if(ev.keyCode==13){
					var task={
						id:0,
						task_item:$('txtTaskTitle').value,
						add_time:new Date(),
						is_finished:false
					};
					Tasks.Add(task);
					Tasks.AppendHtml(task);
					Tasks.$txtTaskTitle.value='';
					Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
				}
				ev.preventDefault();
			},true);
			//取消
			Tasks.$txtTaskTitle.addEventListener('blur',function(){
				Tasks.$txtTaskTitle.value='';
				Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
			},true);
			//初始化数据
			if(window.localStorage.length-1){
				var task_list=[];
				var key;
				for(var i=0,len=window.localStorage.length;i<len;i++){
					key=window.localStorage.key(i);
					if(/task:\d+/.test(key)){
						task_list.push(JSON.parse(window.localStorage.getItem(key)));
					}
				}
				for(var i=0,len=task_list.length;i<len;i++){
					Tasks.AppendHtml(task_list[i]);
				}
			}
			//绑定按钮事件
			Tasks.$btnImport.addEventListener('click',function(){
				//alert("import");
				fileimport();
			},true);
			Tasks.$btnExport.addEventListener('click',function(){
				//alert("export");
				fileexport();
			},true);
		},
		//增加
		Add:function(task){
			//更新指针
			window.localStorage.setItem('Tasks:index', ++Tasks.index);
			task.id=Tasks.index;
			window.localStorage.setItem("task:"+ Tasks.index, JSON.stringify(task));
		},
		//修改
		Edit:function(task){
			window.localStorage.setItem("task:"+ task.id, JSON.stringify(task));
		},
		//删除
		Del:function(task){
			window.localStorage.removeItem("task:"+ task.id);
		},
		AppendHtml:function(task){
			var oDiv=document.createElement('div');
			oDiv.className='taskItem';
			oDiv.setAttribute('id','task_' + task.id);
			var addTime=new Date(task.add_time);
			var timeString=(addTime.getYear()+1900) + '-' +(addTime.getMonth()+1) + '-' + addTime.getDate() + ' ' + addTime.getHours() + ':' + addTime.getMinutes() + ':' + addTime.getSeconds();
			oDiv.setAttribute('title',timeString);
			var oLabel=document.createElement('label');
			oLabel.className= task.is_finished ? 'off' : 'on';
			var oSpan=document.createElement('span');
			oSpan.className='taskTitle';
			var oText=document.createTextNode(task.task_item);
			oSpan.appendChild(oText);
			oDiv.appendChild(oLabel);
			oDiv.appendChild(oSpan);
			//注册事件
			oDiv.addEventListener('click',function(){
				if(!task.is_finished){
					task.is_finished=!task.is_finished;
					var lbl=this.getElementsByTagName('label')[0];
					lbl.className= (lbl.className=='on') ? 'off' : 'on';
					Tasks.Edit(task);
				}else{
					if(confirm('是否确定要删除此项？\r\n\r\n点击确定删除，点击取消置为未完成。')){
						Tasks.Del(task);
						Tasks.RemoveHtml(task);
					}else{
						task.is_finished=!task.is_finished;
						var lbl=this.getElementsByTagName('label')[0];
						lbl.className= (lbl.className=='on') ? 'off' : 'on';
						Tasks.Edit(task);
					}
				}
			},true);
			Tasks.$taskItemList.appendChild(oDiv);	
		},
		RemoveHtml:function(task){
			var taskListDiv=Tasks.$taskItemList.getElementsByTagName('div');
			for(var i=0,len=taskListDiv.length;i<len;i++){
				var id=parseInt(taskListDiv[i].getAttribute('id').substring(5));
				if(id==task.id){
					Tasks.$taskItemList.removeChild(taskListDiv[i]);
					break;
				}
			}
		}
	};
	Tasks.init();
}
function myLog(log){
	if (window.console) {
		console.log(log);
	}
}
function loadready(){
	//alert("loadready");
	if(window.localStorage){
		myLog("支持localStorage");
		myInit();
	}else{
		myLog("不支持localStorage");
		alert("不支持localStorage");
	}
}

window.onload = function(){
	//alert("onload");
    loadready();
}

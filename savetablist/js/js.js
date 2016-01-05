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
		getCurWindow:function(wd){
			Tasks._curWinID = wd.id;
			//alert("init:"+Tasks._curWinID);
		},
		openTabs:function(task_key){
			//"task:"+ task.id
			var v = window.localStorage.getItem(task_key);
			if(v){
				var j = JSON.parse(v);
				if(j){
					var us = j.urls;
					var tl = us.split(",");
					for(var i=0;i<tl.length;i++){
						var u = tl[i];
						//chrome.tabs.
						console.log(u);
					}
					chrome.windows.create({url:tl}, function(wd){});
				}
			}
		},
		tablistop:function(tl) {
			Tasks._tlcount = 0;
			Tasks._tl = [];
			for(var i=0;i<tl.length;i++){
				var t = tl[i];
				
				/*console.log('get '
				+t.id+','
				+ t.index+','
				+t.windowid+','
				+t.highlighted+','
				+t.active
				+'[' + t.url + '] url');*/
				Tasks._tl[i] = t.url;
				Tasks._tlcount++;
			}
			//
			var title = $('txtTaskTitle').value;
			var cur = new Date();
			var d = (cur.getYear()+1900) + '-' +(cur.getMonth()+1) + '-' + cur.getDate();
			d=d.replace(/\d+/g,function(a){return (a.length==4)?a:((a.length==2)?a:("0"+a))});
			var t = cur.getHours() + ':' + cur.getMinutes() + ':' + cur.getSeconds();
			t=t.replace(/\d+/g,function(a){return (a.length==2)?a:("0"+a);});
			var dt = d+" "+t;
			var urls = Tasks._tl.join(",");
			var count = Tasks._tlcount;
			var task={
				id:0,
				task_title:title,
				add_time:dt,
				//is_finished:false,
				urls:urls,
				count:count
			};
			Tasks.Add(task);
			Tasks.AppendHtml(task);
			Tasks.$txtTaskTitle.value='';
			Tasks.hide(Tasks.$addItemInput).show(Tasks.$addItemDiv);
		},
		//
		_curWinID:0,
		_tl:[],
		_tlcount:0,
		//存储dom
		$addItemDiv:$('addItemDiv'),
		$addItemInput:$('addItemInput'),
		$txtTaskTitle:$('txtTaskTitle'),
		$taskItemList:$('taskItemList'),
		//$btnImport:$('btnImport'),
		//$btnExport:$('btnExport'),
		$btnDef:$('btnDef'),
		//指针
		index:window.localStorage.getItem('Tasks:index'),
		//初始化
		init:function(){
			chrome.windows.getCurrent({},Tasks.getCurWindow);
			
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
					var title = $('txtTaskTitle').value;
					if(title==null||title==""){
						return;
					}
					//chrome.tabs.query({currentWindow:true},Tasks.tablistop);
					//chrome.tabs.query({lastFocusedWindow:true},Tasks.tablistop);
					chrome.tabs.query({windowId:Tasks._curWinID},Tasks.tablistop);					
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
		//	//绑定按钮事件
		//	Tasks.$btnImport.addEventListener('click',function(){
		//		//alert("import");
		//		fileimport();
		//	},true);
		//	Tasks.$btnExport.addEventListener('click',function(){
		//		//alert("export");
		//		fileexport();
		//	},true);
			Tasks.$btnDef.addEventListener('click',function(){
				//alert("def");
				$('txtTaskTitle').value = "def";
				chrome.tabs.query({windowId:Tasks._curWinID},Tasks.tablistop);
			},true);
		},
		//增加
		Add:function(task){
			//更新指针
			window.localStorage.setItem('Tasks:index', ++Tasks.index);
			task.id=Tasks.index;
			window.localStorage.setItem("task:"+ task.id, JSON.stringify(task));
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
			//var addTime=new Date(task.add_time);
			//var dt = (addTime.getYear()+1900) + '-' +(addTime.getMonth()+1) + '-' + addTime.getDate();
			//dt=dt.replace(/\d+/g,function(a){return (a.length==4)?a:((a.length==2)?a:("0"+a))});
			//var timeString= dt + ' ' + addTime.getHours() + ':' + addTime.getMinutes() + ':' + addTime.getSeconds();
			//oDiv.setAttribute('dt',timeString);
			oDiv.setAttribute('dt',task.add_time);
			var oLabel=document.createElement('label');
			//oLabel.className= task.is_finished ? 'off' : 'on';
			oLabel.className= 'del';
			var oSpan=document.createElement('span');
			oSpan.className='taskTitle';
			var oText=document.createTextNode("["+task.add_time+"]:    "+task.task_title+" ("+task.count+")");
			oSpan.appendChild(oText);
			oDiv.appendChild(oLabel);
			oDiv.appendChild(oSpan);
			//注册事件
			oLabel.addEventListener('click',function(){
				//alert("click label");
				var bDel = true;
				if(window.localStorage.getItem('option:NeedNoTip_delItem')=="true"){
					bDel = true;
				}else{
					if(confirm("是否删除此项？")){
						bDel = true;
					}else{
						bDel = false;
					}
				}
				if(bDel){
					Tasks.Del(task);
					Tasks.RemoveHtml(task);
				}
			},true);
			oSpan.addEventListener('click',function(){
				/*if(!task.is_finished){
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
				}*/
				var bOpen = true;
				if(window.localStorage.getItem('option:NeedTip_restoreWindow')=="true"){
					if(confirm("是否打开该组tabs？count = "+task.count)){
						bOpen = true;
					}else{
						bOpen = false;
					}
				}
				if(bOpen){
					Tasks.openTabs("task:"+ task.id);
					window.close();
				}
			},true);
			//Tasks.$taskItemList.appendChild(oDiv);
			Tasks.$taskItemList.insertBefore(oDiv,Tasks.$taskItemList.firstChild);
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

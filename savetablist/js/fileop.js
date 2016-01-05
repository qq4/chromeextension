function fileLoad(myForm){
	//chrome是可以的，但是要通过文件流读写，你从客户端读取不安全，所以你得把文件先进行上传，再从服务器端读取文件流，就能取到了
	var fName = "d:/gdl/a.txt";//myForm.file_name.baseURI;
	//var fName = myForm.file_name.value;
	alert("file name:["+fName+"]");
	
    if(!fName){
        alert("File Name is empty!");
        return;
    }
    var lastWord = fName.substr(fName.length-4).toLowerCase();
    if(lastWord != ".txt" && lastWord != ".csv"){
        alert("Sub file name should be CSV(.csv) or TXT(.txt)!");
        return;
    }
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    if (!fso.FileExists(fName)){
        alert(fName + " is not found!");
        return;
    }
    var ff = fso.OpenTextFile(fName,1);
     if (!fso.FileExists(fName)){
        alert(fName + " is not found!");
        return;
    }
    
    var line_idx = 0;
    while(!ff.AtEndOfStream){
        var str = ff.ReadLine();
        alert("line "+line_idx+":["+str+"]");
        /*var strArray = str.split(",");
        if(line_idx == 0 && strArray[0].toLowerCase() == "no"){
            continue;
        }else{
            var arr_len = strArray.length;
            while(arr_len<9){
                strArray.push("");
                arr_len++;
            }
            if(strArray.length == 9){
                if(strArray[5]){
                    var hk = parseInt(strArray[5]);
                    if(hk >= 0 && hk <=9){
                        hkg1Code[hk] = strArray[3];
                        hkg1Desc[hk] = strArray[4];
                    }
                }
                if(strArray[6]){
                    var hk = parseInt(strArray[6]);
                    if(hk >= 0 && hk <=9){
                        hkg2Code[hk] = strArray[3];
                        hkg2Desc[hk] = strArray[4];
                    }
                }
                if(strArray[7]){
                    var hk = parseInt(strArray[7]);
                    if(hk >= 0 && hk <=9){
                        hkg3Code[hk] = strArray[3];
                        hkg3Desc[hk] = strArray[4];
                    }
                }
                if(strArray[8]){
                    var hk = parseInt(strArray[8]);
                    if(hk >= 0 && hk <=9){
                        hkg4Code[hk] = strArray[3];
                        hkg4Desc[hk] = strArray[4];
                    }
                }
                codeAll.push(strArray);
            }
        }*/
        line_idx ++;
    }
    ff.Close();
    fso = null;
    
    var obj = {
		id:"qqid",
		name:"qqname"
	};
	if(window.opener){
		//alert("opener");
		window.opener.fileimport_finish(obj);//这段在单独页面中出错（报domain为null)，在插件模式下可运行。不知道怎么区分
	}
    window.close();
}
function cancel(){
    window.close();
}

window.onload = function(){
    document.getElementById("Load").addEventListener('click',function(){
		fileLoad(this.form);
	},true);
	document.getElementById("Cancel").addEventListener('click',function(){
		cancel();
	},true);
}
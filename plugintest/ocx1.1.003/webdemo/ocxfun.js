﻿var gWndId = 0;
var nDirect=-1;
var nOper=-1;
var gXmlRecords;
var gRecordPath;
var bLogin = 0;
var bIVS =1;
var gVtCallWndNo = 0;

function switchTab(n)
{
	for(var i=1;i<=11;i++)
	{
		document.getElementById("tab_" + i).className = "";
		document.getElementById("tab_con_" + i).style.display = "none";
	}
	document.getElementById("tab_" + n).className = "on";
	document.getElementById("tab_con_" + n).style.display = "block";
	document.getElementById("DGroupInfo").innerText = "";
}

function historyRealplay(cameraId) {
	var obj = document.getElementById("DPSDK_OCX");
		
	var szCameraId = cameraId;
	var nStreamType = document.getElementById("selectStreamType").value;
	var nMediaType = document.getElementById("selectMediaType").value;
	var nTransType = document.getElementById("selectTransType").value;
	   
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nRet = obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType);
    ShowCallRetInfo(nRet, "播放视频");
	if(nRet == 0)
	{
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 1, bIVS),"规则线显示");//打开规则线显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 2, bIVS),"目标框显示");//打开目标框显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 3, bIVS),"轨迹线显示");//打开轨迹线显示
	}
}

function insertRealplayHistory(cameraId) 
{
	var eleTr = document.createElement("tr");
		
	var eleTdCameraId = document.createElement("td");
	eleTdCameraId.innerHTML = cameraId;
	eleTr.appendChild(eleTdCameraId);
		
	var eleTdBtn = document.createElement("td");
	var eleBtn = document.createElement("button");
	eleBtn.innerHTML = "播放";
	eleTdBtn.appendChild(eleBtn);
	eleTr.appendChild(eleTdBtn);
		
	eleTdBtn.onclick = function() {
	historyRealplay(cameraId);
	};
		
	eleTr.ondblclick = function() {
	historyRealplay(cameraId);
	};
		
	document.getElementById("historyContent").appendChild(eleTr);
}

function getStrLength(str)
{
   var cArr = str.match(/[^\x00-\xff]/ig);
   return str.length + (cArr == null ? 0 : cArr.length);
}

function init(){
	switchTab(1);
	
	/*try
	{
		var obj = new ActiveXObject("DPSDK_OCX.DPSDK_OCXCtrl.1");
	}
	catch(e)
	{
		alert("控件未注册，请先注册控件！");
		return;
	}*/
		
	var obj = document.getElementById("DPSDK_OCX");
    gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100);
	
	ButtonCreateWnd_onclick();
	obj.DPSDK_SetLog(2, "D:\\DPSDK_OCX_log", false, false); //初始化后设置日志路径
	//var obj = document.getElementById("DPSDK_OCX");
	//ShowCallRetInfo(obj.DPSDK_Login("172.7.123.123", 9000, "1", "1"), "登录");
	//ShowCallRetInfo(obj.DPSDK_AsyncLoadDGroupInfo(), "异步加载组织结构");
	//var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	//ShowCallRetInfo(obj.DPSDK_DirectRealplayByWndNo(gWndId, nWndNo, "1000001$1$0$0", 1, 1, 1), "直接实时播放");
	for(var i=1;i<=4;i++)
	    obj.DPSDK_SetToolBtnVisible(i, false);
	obj.DPSDK_SetToolBtnVisible(7, false);
	obj.DPSDK_SetToolBtnVisible(9, false);
	obj.DPSDK_SetControlButtonShowMode(1, 0);
	obj.DPSDK_SetControlButtonShowMode(2, 0);
}
function SetLog()
{
     var obj = document.getElementById("DPSDK_OCX");
	 var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	 fileSave.MaxFileSize = 128;
	 fileSave.ShowSave();
	 if(fileSave.fileName == "")
	     return -1;
	 return obj.DPSDK_SetLog(4, fileSave.fileName, true, true);
}

function GetGps()
{
	var obj = document.getElementById("DPSDK_OCX");
    alert(obj.DPSDK_AskForLastGpsStatus());
}

function SetControlButtonShowMode()
{
     var obj = document.getElementById("DPSDK_OCX");
	 var nType = document.getElementById("textType").value;
	 var nMode = document.getElementById("textMode").value;
     obj.DPSDK_SetControlButtonShowMode(nType, nMode); 
}
function ShowCallRetInfo(nRet, strInfo) 
{
    //if (nRet != 0)
    //{
    //    var obj = document.getElementById("DPSDK_OCX");
    //    alert(strInfo + ": ErrorCode = "+obj.DPSDK_GetLastError());
    //}
	
	var str = "";
	if(nRet == 0)
	{
	     str = strInfo + " 成功！";
	}
	else
	{
	     str = strInfo + "失败！错误码：" + nRet;
		 if(nRet == 19 || nRet == 20)
		 {
			str += "，请先加载组织结构！";
		 }
	}
	document.getElementById("RetInfo").innerText = str;
}
function getDate(strDate) 
{
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	return date;
}

function ButtonCreateWnd_onclick() 
{
	var obj = document.getElementById("DPSDK_OCX");
    var nWndCount = document.getElementById("textWndNum").value;
    obj.DPSDK_SetWndCount(gWndId, nWndCount); 
	obj.DPSDK_SetSelWnd(gWndId, 0); 
}

function ButtonSetCustomizedWndCount_onclick() 
{
	var obj = document.getElementById("DPSDK_OCX");
    var nWndCount = document.getElementById("textWndNum2").value;
    obj.DPSDK_SetCustomizedWndCount(gWndId, nWndCount); 
	obj.DPSDK_SetSelWnd(gWndId, 0); 
}

function ButtonLogin_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szIp = document.getElementById("textIP").value;
    var nPort = document.getElementById("textPort").value;
    var szUsername = document.getElementById("textUser").value;
    var szPassword = document.getElementById("textPassword").value;
    
	var nRet = obj.DPSDK_Login(szIp, nPort, szUsername, szPassword);
	//var nRet = obj.DPSDK_SingleLogin(szIp, nPort, szUsername, szPassword);
    ShowCallRetInfo(nRet, "登录");
	if(nRet == 0)
	{
	    bLogin = 1;
	}
	//ButtonLoadDGroupInfo_onclick();
}

function ButtonAsyncLogin_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szIp = document.getElementById("textIP").value;
    var nPort = document.getElementById("textPort").value;
    var szUsername = document.getElementById("textUser").value;
    var szPassword = document.getElementById("textPassword").value;
    
	var nRet = obj.DPSDK_AsyncLogin(szIp, nPort, szUsername, szPassword);
	if( nRet != 0)
	{
		ShowCallRetInfo(nRet, "异步登录");
	}
}

function ButtonLogout_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    if( bLogin == 1)
	{
        ShowCallRetInfo(obj.DPSDK_Logout(), "登出");
	    bLogin = 0;
	}
}


function ButtonLoadDGroupInfo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
	ShowCallRetInfo(obj.DPSDK_LoadDGroupInfo(), "加载组织结构");
    //alert(obj.DPSDK_GetDGroupStr());
	//document.getElementById("DGroupInfo").innerText = obj.DPSDK_GetDGroupStr();
}

function ButtonAsyncLoadDGroupInfo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    obj.DPSDK_SetCompressType(1);
	ShowCallRetInfo(obj.DPSDK_AsyncLoadDGroupInfo(), "异步加载组织结构");
    //alert(obj.DPSDK_GetDGroupStr());
}
function ButtonGetDGroupInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	document.getElementById("DGroupInfo").innerText = obj.DPSDK_GetDGroupStr();
}

function ButtonConnectDmsByChnlId_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value;
	var nRet = obj.DPSDK_ConnectDmsByChnlId(szCameraId);
	ShowCallRetInfo(nRet, "根据通道ID连接DMS");
}

function ButtonStartRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szCameraId = document.getElementById("textCameraID").value;
    var nStreamType = document.getElementById("selectStreamType").value;
    var nMediaType = document.getElementById("selectMediaType").value;
    var nTransType = document.getElementById("selectTransType").value;
   
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nRet = obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType);
    ShowCallRetInfo(nRet, "播放视频");
	if(nRet == 0)
	{
		insertRealplayHistory(szCameraId);
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 1, bIVS),"规则线显示");//打开规则线显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 2, bIVS),"目标框显示");//打开目标框显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 3, bIVS),"轨迹线显示");//打开轨迹线显示
	}
}

function ButtonAsyncStartRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szCameraId = document.getElementById("textCameraID").value;
    var nStreamType = document.getElementById("selectStreamType").value;
    var nMediaType = document.getElementById("selectMediaType").value;
    var nTransType = document.getElementById("selectTransType").value;
   
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nRealFlag = obj.DPSDK_AsyncStartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType);
    //ShowCallRetInfo(nRet, "播放视频");
	//if(nRet == 0)
	//{
	//	insertRealplayHistory(szCameraId);
	//	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 1, bIVS),"规则线显示");//打开规则线显示
	//	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 2, bIVS),"目标框显示");//打开目标框显示
	//	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 3, bIVS),"轨迹线显示");//打开轨迹线显示
	//}
}

function ButtonStartRealplayByHWND_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
    var szCameraId = document.getElementById("textCameraID").value;
    var nStreamType = document.getElementById("selectStreamType").value;
    var nMediaType = document.getElementById("selectMediaType").value;
    var nTransType = document.getElementById("selectTransType").value;
   
	var	nRet = obj.DPSDK_StartRealplayByHWND(hWnd, szCameraId, nStreamType, nMediaType, nTransType);
    ShowCallRetInfo(nRet, "播放视频");
	if(nRet == 0)
	{
		insertRealplayHistory(szCameraId);
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByHWND(hWnd, 1, 1),"规则线显示");//打开规则线显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByHWND(hWnd, 2, 1),"目标框显示");//打开目标框显示
		ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByHWND(hWnd, 3, 1),"轨迹线显示");//打开轨迹线显示
	}
}

function ButtonStopRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StopRealplayByWndNo(gWndId, nWndNo), "停止播放视频");
}

function ButtonAsyncStopRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    obj.DPSDK_AsyncStopRealplayByWndNo(gWndId, nWndNo);
}

function ButtonStopRealplayByHWND_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
    ShowCallRetInfo(obj.DPSDK_StopRealplayByHWND(hWnd), "停止播放视频");
}

function ButtonStartRecordByWndNo_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaVideo\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	alert("存储路径："+path)

    ShowCallRetInfo(obj.DPSDK_StartRealRecordByWndNo(gWndId, nWndNo, path), "实时视频录制");
}

function ButtonStartRecordByHWND_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaVideo\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	alert("存储路径："+path)
	
    ShowCallRetInfo(obj.DPSDK_StartRealRecordByHWND(hWnd, path), "实时视频录制");
}

function ButtonStopRecordByWndNo_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StopRealRecordByWndNo(gWndId, nWndNo), "停止实时视频录制");
}

function ButtonStopRecordByHWND_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
    ShowCallRetInfo(obj.DPSDK_StopRealRecordByHWND(hWnd), "停止实时视频录制");
}

function ButtonSetOsdTxtByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strOSD = document.getElementById("text7").value;
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_SetOsdTxtByHWND(hWnd, strOSD), "OSD文本信息下发");
}

function ButtonCleanUpOsdInfoByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_CleanUpOsdInfoByWndNo(gWndId, nWndNo), "清除osd信息");
}

function ButtonCleanUpOsdInfoByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_CleanUpOsdInfoByHWND(hWnd), "清除osd信息");
}

function ButtonCapturePictureByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path)
	ShowCallRetInfo(obj.DPSDK_CapturePictureByWndNo(gWndId, nWndNo,path), "抓图");
}

function ButtonCapturePictureByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path)
	
	ShowCallRetInfo(obj.DPSDK_CapturePictureByHWND(hWnd, path), "抓图");
}

function ButtonCapturePictureByWndNoAndUpload_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path)
	ShowCallRetInfo(obj.DPSDK_CapturePictureByWndNo(gWndId, nWndNo,path), "抓图");
	
	var szCameraId = document.getElementById("textCameraID").value;
	var szIp = document.getElementById("textFtpIp").value;
	var szName = document.getElementById("textFtpName").value;
	var szPwd = document.getElementById("textFtpPwd").value;
	var timestamp = Date.parse(new Date())/1000;
	var nRet = obj.DPSDK_UploadFtpPic(szCameraId, timestamp, path, "ftp://" + szIp, szName, szPwd);
	if(nRet != 0)
	    ShowCallRetInfo( nRet, "上传");
	else
	{
		var szFtpUrl = obj.DPSDK_GetLastUploadFtpPicUrl();
	    alert("已上传至：" + szFtpUrl);
	}
}

function ButtonCapturePictureByHWNDAndUpload_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path)
	ShowCallRetInfo(obj.DPSDK_CapturePictureByHWND(hWnd, path), "抓图");
	
	var szCameraId = document.getElementById("textCameraID").value;
	var szIp = document.getElementById("textFtpIp").value;
	var szName = document.getElementById("textFtpName").value;
	var szPwd = document.getElementById("textFtpPwd").value;
	var timestamp = Date.parse(new Date())/1000;
	var nRet = obj.DPSDK_UploadFtpPic(szCameraId, timestamp, path, "ftp://" + szIp, szName, szPwd);
	if(nRet != 0)
	    ShowCallRetInfo( nRet, "上传");
	else
	    alert("已上传至ftp://" + szIp);
}

function ButtonGetAudioChannelsByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var ret = obj.DPSDK_GetAudioChannelsByWndNo(gWndId, nWndNo);
	document.getElementById("textAudioNum").innerText = ret;
}

function ButtonGetAudioChannelStateByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var index = document.getElementById("textAudioIndex").value;
	var ret = obj.DPSDK_GetAudioChannelStateByWndNo(gWndId, nWndNo, index);
	document.getElementById("textAudioState").innerText = (ret==true? 1 : 0) + "";
}

function ButtonSetAudioChannelByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var index = document.getElementById("textAudioIndex").value;
	var strAudioState = document.getElementById("textAudioState").value;
	ShowCallRetInfo(obj.DPSDK_SetAudioChannelByWndNo(gWndId, nWndNo, index, strAudioState == 0 ? false : true), "设置音频状态");
}

function ButtonGetAudioChannelsByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	var ret = obj.DPSDK_GetAudioChannelsByHWND(hWnd);
	document.getElementById("textAudioNum").innerText = ret;
}

function ButtonGetAudioChannelStateByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	var index = document.getElementById("textAudioIndex").value;
	var ret = obj.DPSDK_GetAudioChannelStateByHWND(hWnd, index);
	document.getElementById("textAudioState").innerText = (ret==true? 1 : 0) + "";
}

function ButtonSetAudioChannelByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	var index = document.getElementById("textAudioIndex").value;
	var strAudioState = document.getElementById("textAudioState").value;
	ShowCallRetInfo(obj.DPSDK_SetAudioChannelByHWND(hWnd, index, strAudioState == 0 ? false : true), "设置音频状态");
}

function ButtonStopRealplayByCameraId_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strCameraID = document.getElementById("textCameraID").value;
	ShowCallRetInfo(obj.DPSDK_StopRealplayByCameraId(strCameraID), "关闭CAM");
}

function ButtonPtzDirection_onclick(nDirects)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    nDirect = nDirects;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzDirection(szCameraId, nDirect, nStep, 0), "方向控制");
}

function ButtonPtzDirection_onclickStop(bStop)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzDirection(szCameraId, nDirect, nStep, bStop), "方向控制");
}

function ButtonAsyncPtzDirection_onclick(nDirects)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    nDirect = nDirects;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    obj.DPSDK_AsyncPtzDirection(szCameraId, nDirect, nStep, 0);
}

function ButtonAsyncPtzDirection_onclickStop(bStop)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    obj.DPSDK_AsyncPtzDirection(szCameraId, nDirect, nStep, bStop);
}

function ButtonPtzCameraOperation_onclick(nOpers)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    nOper = nOpers;
    var nStep = document.getElementById("selectCameraStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, 0), "镜头控制");
}

function ButtonPtzCameraOperation_onclickStop(bStop)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    var nStep = document.getElementById("selectCameraStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, bStop), "镜头控制");
}

function ButtonPtzSit_onclick()
{

	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nXPosition = document.getElementById("textXPosition").value;
    var nYPosition = document.getElementById("textYPosition").value;
    var nStep = document.getElementById("selectPtzSitStep").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzSit(szCameraId, nXPosition, nYPosition, nStep), "三维定位");

	var obj = document.getElementById("DPSDK_OCX");
}

function ButtonAutoPtzSit_onclick()
{

	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value; 
    var nAuto = document.getElementById("selectAutoPtzSit").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzAutoSit(szCameraId, nAuto), "自动三维定位");

	var obj = document.getElementById("DPSDK_OCX");
}

function ButtonAddPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,2), "增加预置点");
}

function ButtonDelPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,3), "删除预置点");
}

function ButtonQueryPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
   
    alert(obj.DPSDK_QueryPrePoint(szCameraId));
}

function ButtonSeekPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,1), "定位预置点");
}
function getDate(strDate) 
{
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	return date;
}

function ButtonQueryRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
    var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
//	alert(nStartTime);
	var nEndTime = getDate(strEndTime).getTime()/1000;
//	alert(nEndTime);
		
//    ShowCallRetInfo(obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime), "查询录像");

//	gXmlRecords = obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime);
	console.log("szCameraId"+szCameraId+"nRecordSource"+nRecordSource+"nEndTime"+nEndTime+"nEndTime"+nEndTime);
	alert(obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime));
}

function ButtonStartFilePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nFileIndex = document.getElementById("textFileIndex").value;
	ShowCallRetInfo(obj.DPSDK_StartFilePlaybackByWndNo(gWndId, nWndNo, nFileIndex), "按文件回放");
}

function ButtonStartFilePlaybackByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var nFileIndex = document.getElementById("textFileIndex").value;
	ShowCallRetInfo(obj.DPSDK_StartFilePlaybackByHWND(hWnd, nFileIndex), "按文件回放");
}

function ButtonStartTimePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	console.log(nWndNo+"nWndNo"+nRecordSource+"nRecordSource"+nEndTime+"nEndTime"+nStartTime+"nStartTime"+szCameraId+"szCameraId");
	ShowCallRetInfo(obj.DPSDK_StartTimePlaybackByWndNo(gWndId, nWndNo, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间回放");
}

function ButtonStartBackTimePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;

	ShowCallRetInfo(obj.DPSDK_StartBackTimePlaybackByWndNo(gWndId, nWndNo, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间倒放");
}

function ButtonStartTimePlaybackByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;

	ShowCallRetInfo(obj.DPSDK_StartTimePlaybackByHWND(hWnd, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间回放");
}

function ButtonPausePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_PausePlaybackByWndNo(gWndId, nWndNo), "暂停回放");
}

function ButtonPausePlaybackByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_PausePlaybackByHWND(hWnd), "暂停回放");
}

function ButtonResumePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_ResumePlaybackByWndNo(gWndId, nWndNo), "继续回放");
}

function ButtonResumePlaybackByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_ResumePlaybackByHWND(hWnd), "继续回放");
}

function ButtonStopPlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_StopPlaybackByWndNo(gWndId, nWndNo), "停止回放");
}

function ButtonStopPlaybackByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_StopPlaybackByHWND(hWnd), "停止回放");
}

function ButtonSetPlaybackSpeedByWndNo_onclick(nPlaybackRate)
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	//var nPlaybackRate = document.getElementById("selectPlaybackRate").value;
	//alert(nPlaybackRate);
	var str = "设置 回放速度X" + nPlaybackRate/8 + " ";
	ShowCallRetInfo(obj.DPSDK_SetPlaybackSpeedByWndNo(gWndId, nWndNo, nPlaybackRate), str);
}

function ButtonSetPlaybackSpeedByHWND_onclick(nPlaybackRate)
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd =  obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	//var nPlaybackRate = document.getElementById("selectPlaybackRate").value;
	//alert(nPlaybackRate);
	var str = "设置 回放速度X" + nPlaybackRate/8 + " ";
	ShowCallRetInfo(obj.DPSDK_SetPlaybackSpeedByHWND(hWnd, nPlaybackRate), str);
}

function ButtonDownloadRecordByFile_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	gRecordPath="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	var nFileIndex = document.getElementById("textFileIndex").value;
	alert("存储路径："+gRecordPath);
	ShowCallRetInfo(obj.DPSDK_DownloadRecordByFile(gRecordPath, 0), "按文件下载");
}

function ButtonDownloadRecordByTime_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	var mydate=new Date();
	var reg=new RegExp(":","g");
	gRecordPath="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	alert("存储路径："+gRecordPath);
	ShowCallRetInfo(obj.DPSDK_DownloadRecordByTime(gRecordPath, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间下载");
}

function ButtonPauseDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_PauseDownloadRecord(gRecordPath), "暂停下载");
}

function ButtonResumeDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_ResumeDownloadRecord(gRecordPath), "继续下载");
}

function ButtonStopDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleStringtoLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_StopDownloadRecord(gRecordPath), "停止下载");
}

function ButtonPlaybackCaptureByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_CapturePictureByWndNo(gWndId, nWndNo,path), "抓图");
}

function ButtonPlaybackCaptureByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_CapturePictureByHWND( hWnd, path ), "抓图");
}

function ButtonEnableAlarm_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szDevID = document.getElementById("textDeviceID").value; 
	var nVideoChannel = document.getElementById("textVideoChan").value; 
	var nAlarmChannel = document.getElementById("textAlarmChan").value; 
    var nAlarmType = document.getElementById("selectAlarmType2").value;
	
	ShowCallRetInfo(obj.DPSDK_EnableAlarm(szDevID, nVideoChannel, nAlarmChannel, nAlarmType), "布控");
}

function ButtonDisableAlarm_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	ShowCallRetInfo(obj.DPSDK_DisableAlarm(), "撤控");
}

function ButtonQueryAlarmInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var szCameraId = document.getElementById("textCameraID").value; 
    var nAlarmType = document.getElementById("selectAlarmType").value;
    var strStartTime = document.getElementById("textAlarmStartTime").value;
    var strEndTime = document.getElementById("textAlarmEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	
	var nCount = obj.DPSDK_QueryAlarmCount(szCameraId, nAlarmType, nStartTime, nEndTime);
	
	if(nCount > 0)
	{
		var nIndex = 0;
		var strAlarmInfo = obj.DPSDK_QueryAlarmInfo(szCameraId, nAlarmType, nStartTime, nEndTime, nIndex, 500);
		alert(strAlarmInfo);
	}
	else
	{
		alert("无报警信息！");
	}
}


//电视墙操作方法
function getWallCount(){
	var obj = document.getElementById("DPSDK_OCX");
	var count=obj.DPSDK_QueryTvWallList();
	writewall("获取电视墙总数:"+count);
	//alert("获取电视墙总数:"+count);
}
function writewall(info){
	document.getElementById("wallinfoxml").innerText=info;
}
function getWallInfo(){
	var obj = document.getElementById("DPSDK_OCX");
	var allstr=obj.DPSDK_GetTvWallList();
	writewall("获取电视墙信息:"+allstr);
	var xmlDoc=loadXML(allstr);
	var elements = xmlDoc.getElementsByTagName("TvWall");
	var objSelect=document.getElementById("wallid");
	objSelect.options.length = 0;  
	for (var i = 0; i < elements.length; i++) {
		var tvWallId = elements[i].getAttribute("tvWallId");
		var name = elements[i].getAttribute("name");
		//var tvWallId = elements[i].getElementsByTagName("TvWall").getAttribute("tvWallId").value;
		//var name = elements[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		//alert(tvWallId+"----"+name);
		var varItem = new Option(name, tvWallId);      
        objSelect.options.add(varItem); 
	}
}

function getWallLayout(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	//alert(wallid);
    var allstr=obj.DPSDK_QueryTvWallLayout(wallid);
	writewall("获取电视墙布局:"+allstr);
}

function getOneWallLayout(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var wallstr=obj.DPSDK_GetTvWallLayout(wallid);
	writewall("得到电视墙布局"+wallstr);
}

function CutWall(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var nSplitCount = document.getElementById("textSplitCount").value;
	var nScreenId = document.getElementById("textScreenId").value;
	var statue=obj.DPSDK_SetTvWallScreenSplit(wallid, nScreenId, nSplitCount);
	ShowCallRetInfo(statue, "电视墙分割");
}

function OpenWindow(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var nScreenId = document.getElementById("textOpenWndScreenId").value;
	var fLeft = document.getElementById("textOpenWndLeft").value;
	var fTop = document.getElementById("textOpenWndTop").value;
	var fWidth = document.getElementById("textOpenWndWidth").value;
	var fHeight = document.getElementById("textOpenWndHeight").value;
	var nWndId = obj.DPSDK_TvWallScreenOpenWindow(wallid, nScreenId, fLeft, fTop, fWidth, fHeight);
	if(nWndId == -1)
	{
		var nLastError = obj.DPSDK_GetLastError();
		document.getElementById("RetInfo").innerText = "电视墙开窗失败！错误码：" + nLastError;
	}
	else
	{
		document.getElementById("RetInfo").innerText = "电视墙开窗成功！窗口ID：" + nWndId;
	}
}

function wallset(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var nScreenId = document.getElementById("textScreenId").value;
	var szCamId = document.getElementById("textCamId").value;
    var nWinNo =  document.getElementById("textWndNo").value;
	var statue=obj.DPSDK_SetTvWallScreenWindowSource(wallid, nScreenId, nWinNo, szCamId, 1, 30);
	ShowCallRetInfo(statue, "设置电视墙");
}


function wallclose(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var nScreenId = document.getElementById("textScreenId2").value;
	var nWinNo =  document.getElementById("textWndNo").value;
	var statue=obj.DPSDK_CloseTvWallScreenWindowSource(wallid, nScreenId, nWinNo);
	ShowCallRetInfo(statue, "电视墙关闭");
}


function WallClean(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallid = document.getElementById("wallid").value;
	var nSplitCount = document.getElementById("textSplitCount").value;
	var nScreenId = document.getElementById("textScreenId2").value;
	var statue=obj.DPSDK_ClearTvWallScreen(wallid);
	ShowCallRetInfo(statue, "电视墙清屏");
}

function ButtonQueryPictureRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var szCameraId = document.getElementById("textCameraID").value; 
    var strStartTime = document.getElementById("textStartTimePicture").value;
    var strEndTime = document.getElementById("textEndTimePicture").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	alert(obj.DPSDK_QueryFtpPicInfo(szCameraId,nStartTime , nEndTime));
	//ShowCallRetInfo(obj.DPSDK_QueryFtpPicInfo(szCameraId,nStartTime , nEndTime), "查询");
}

function ButtonDeletePictureRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

    var path= document.getElementById("textPicturePath").value;
	
	ShowCallRetInfo(obj.DPSDK_DelFtpPic(path), "删除ftp图片");
}

function ButtonCloseAudioByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_OpenAudioByWndNo(gWndId, nWndNo, false), "关闭音频");
}

function ButtonCloseAudioByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_OpenAudioByHWND(hWnd, false), "关闭音频");
}

function ButtonOpenAudioByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_OpenAudioByWndNo(gWndId, nWndNo, true), "开启音频");
}

function ButtonOpenAudioByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_OpenAudioByHWND(hWnd, true), "开启音频");
}

function ButtonStartRealRecordByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	 var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	 fileSave.MaxFileSize = 128;
	 fileSave.ShowSave();
	 if(fileSave.fileName == "")
	     return -1;
	ShowCallRetInfo(obj.DPSDK_StartRealRecordByWndNo( gWndId, nWndNo, fileSave.fileName), "开始录像");
}

function ButtonStartAVIRealRecordByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	 var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	 fileSave.MaxFileSize = 128;
	 fileSave.ShowSave();
	 if(fileSave.fileName == "")
	     return -1;
	ShowCallRetInfo(obj.DPSDK_StartAVIRealRecordByWndNo( gWndId, nWndNo, fileSave.fileName), "开始AVI格式录像");
}

function ButtonStartRealRecordByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	fileSave.MaxFileSize = 128;
	fileSave.ShowSave();
	if(fileSave.fileName == "")
	    return -1;
	ShowCallRetInfo(obj.DPSDK_StartRealRecordByHWND( hWnd, fileSave.fileName), "开始录像");
}

function ButtonStopRealRecordByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);

	ShowCallRetInfo(obj.DPSDK_StopRealRecordByWndNo( gWndId, nWndNo ), "停止录像");
}

function ButtonStopRealRecordByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);

	ShowCallRetInfo(obj.DPSDK_StopRealRecordByHWND( hWnd ), "停止录像");
}

function ButtonSetOsdTxtByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    var text = document.getElementById("textOsd").value;
	//ShowCallRetInfo(obj.DPSDK_SetOsdTxtByWndNo( gWndId, nWndNo, text ), "设置Osd信息");
	ShowCallRetInfo(obj.DPSDK_SetOsdTxtExByWndNo( gWndId, nWndNo, text, 255,"黑体", 100,70,7,7), "设置Osd信息");
}

function ButtonSetOsdTxtByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
    var text = document.getElementById("textOsd").value;
	ShowCallRetInfo(obj.DPSDK_SetOsdTxtByHWND( hWnd, text ), "设置Osd信息");
}

function ButtonCleanUpOsdInfoByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_CleanUpOsdInfoByWndNo( gWndId, nWndNo ), "清除osd信息");
}

function ButtonCleanUpOsdInfoByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	ShowCallRetInfo(obj.DPSDK_CleanUpOsdInfoByHWND( hWnd ), "清除osd信息");
}

function ButtonAdjustColorByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nBrightness = document.getElementById("textBrightness").value;
	var nContract = document.getElementById("textContract").value;
	var nSaturation = document.getElementById("textSaturation").value;
	var nTone = document.getElementById("textTone").value;
	ShowCallRetInfo(obj.DPSDK_AdjustColorByWndNo( gWndId, nWndNo, nBrightness, nContract, nSaturation, nTone), "屏幕颜色调整");
}

function ButtonAdjustColorByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	
	var nBrightness = document.getElementById("textBrightness").value;
	var nContract = document.getElementById("textContract").value;
	var nSaturation = document.getElementById("textSaturation").value;
	var nTone = document.getElementById("textTone").value;
	ShowCallRetInfo(obj.DPSDK_AdjustColorByHWND( hWnd, nBrightness, nContract, nSaturation, nTone), "屏幕颜色调整");
}

function ButtonPtzLockCamera_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value;
    var nLock = document.getElementById("selectPtzLockCamera").value;
	
	ShowCallRetInfo(obj.DPSDK_PtzLockCamera( szCameraId, nLock), "锁定控制");
}

function ButtonStartTalk_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value;
	var nSampleType = document.getElementById("selectSampleType").value;
	var nBitType = document.getElementById("selectBitType").value;
	var nTransType = document.getElementById("selectTransType").value;
	var nAudioType = document.getElementById("selectAudioType").value;
	var nDevType = document.getElementById("selectDevType").value;
	
	ShowCallRetInfo(obj.DPSDK_StartTalk( szCameraId, nAudioType, nBitType, nSampleType, nDevType, nTransType), "开始语音对讲");
}

function ButtonStopTalk_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value;
	
	ShowCallRetInfo(obj.DPSDK_StopTalk( szCameraId ), "停止语音对讲");
}

function ButtonQueryFtpPicInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value;
	
	var strStartTime = document.getElementById("textFtpStartTime").value;
    var strEndTime = document.getElementById("textFtpEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	
	alert(obj.DPSDK_QueryFtpPicInfo( szCameraId, nStartTime, nEndTime));
}

function ButtonDelFtpPic_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var strPicPath = document.getElementById("textFtpPic").value;
	
	ShowCallRetInfo(obj.DPSDK_DelFtpPic(strPicPath), "删除Ftp图片");
}

function ButtonStartPlaybackByLocalByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	fileSave.MaxFileSize = 128;
	fileSave.ShowOpen();
	if(fileSave.fileName == "")
	    return -1;
	ShowCallRetInfo(obj.DPSDK_StartPlaybackByLocalByWndNo( gWndId, nWndNo, fileSave.fileName), "本地播放");
}

function ButtonStartPlaybackByLocalByHWND_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var hWnd = obj.DPSDK_GetWndVideoHandle(gWndId, nWndNo);
	var fileSave = new ActiveXObject("MSComDlg.CommonDialog");
	fileSave.MaxFileSize = 128;
	fileSave.ShowOpen();
	if(fileSave.fileName == "")
	    return -1;
	ShowCallRetInfo(obj.DPSDK_StartPlaybackByLocalByHWND( hWnd, fileSave.fileName), "本地播放");
}
function ButtonSetSnapshotInterval_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var json1 = "{ \"method\":\"dms.setsnapshotinterval\",\"params\":{\"DevID\":\"";
	var json2 = document.getElementById("DevID").value;
	var json3 = "\",\"ChannelId\":";
	var json4 = document.getElementById("ChannelNo").value;
	var json5 = ",\"Interval\":";
	var json6 = document.getElementById("Interval").value;
	var json7 = "},\"id\":";
	var json8 = document.getElementById("jsonID").value;
	var json9 = " }";
	var json = json1 + json2 + json3 + json4 + json5 + json6 + json7 + json8 + json9;
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(json,3,0), "发送json");
}

function ButtonSnap_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var json1 = "{ \"method\":\"dev.snap\",\"params\":{\"DevID\":\"";
	var json2 = document.getElementById("SnapDevID").value;
	var json3 = "\",\"DevChannel\":";
	var json4 = document.getElementById("SnapChannelNo").value;
	var json5 = ",\"PicNum\":1,\"SnapType\":";
	var json6 = document.getElementById("SnapType").value;
	var json7 = ",\"CmdSrc\":1},\"id\":";
	var json8 = document.getElementById("SnapjsonID").value;
	var json9 = " }";
	var json = json1 + json2 + json3 + json4 + json5 + json6 + json7 + json8 + json9;
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(json,3,0), "发送json");
}
	//{"method":"client.SetDevDirect","params":{"DevID":"1000021","channelNo":0,"stop":0,"stepX":56,"stepY":89},"id":100}
function ButtonSetCameraAngle_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var json1 = "{ \"method\":\"client.SetDevDirect\",\"params\":{\"DevID\":\"";
	var json2 = document.getElementById("AngleDevID").value;
	var json3 = "\",\"channelNo\":";
	var json4 = document.getElementById("AngleChannelNo").value;
	var json5 = ",\"stop\":0,\"stepX\":";
	var json6 = document.getElementById("AngleX").value;
	var json7 = ",\"stepY\":";
	var json8 = document.getElementById("AngleY").value;
	var json9 = "},\"id\":";
	var json10 = document.getElementById("AnglejsonID").value;
	var json11 = " }";
	var json = json1 + json2 + json3 + json4 + json5 + json6 + json7 + json8 + json9 + json10 + json11;
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(json,3,0), "发送json");
}

	//{"method":"client.SetViewRange","params":{"DevID":"1000021","channelNo":0,"distance":1200,"width":500,"screenRatio":100},"id":110}
function ButtonObiectScreenRatio_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var json1 = "{ \"method\":\"client.SetViewRange\",\"params\":{\"DevID\":\"";
	var json2 = document.getElementById("ScaleDevID").value;
	var json3 = "\",\"channelNo\":";
	var json4 = document.getElementById("ScaleChannelNo").value;
	var json5 = ",\"distance\":";
	var json6 = document.getElementById("nDistance").value;
	var json7 = ",\"width\":";
	var json8 = document.getElementById("nWidth").value;
	var json9 = ",\"screenRatio\":";
	var json10 = document.getElementById("nScreenRatio").value;
	var json11 = "},\"id\":";
	var json12 = document.getElementById("ScreenRatiojsonID").value;
	var json13 = " }";
	var json = json1 + json2 + json3 + json4 + json5 + json6 + json7 + json8 + json9 + json10 + json11 + json12 + json13;
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(json,3,0), "发送json");
}

function ButtonSendGeneraljson_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var json = document.getElementById("Generaljson").value;
	var mdl = document.getElementById("selectMdl").value;
	var type = document.getElementById("selectTransportType").value;
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(json,mdl,type), "发送json");
}

function ButtonSubscribeAllBayCarInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var subType = document.getElementById("selectSubscribeAllBayCarInfo").value;
	if(subType == 1)
		ShowCallRetInfo(obj.DPSDK_SubscribeAllBayCarInfo(subType), "订阅过车流量");
	else
		ShowCallRetInfo(obj.DPSDK_SubscribeAllBayCarInfo(subType), "取消订阅过车流量");
}

function ButtonIVSSwitchByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	bIVS = !bIVS;
	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 1, bIVS),"规则线显示");//打开规则线显示
	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 2, bIVS),"目标框显示");//打开目标框显示
	ShowCallRetInfo(obj.DPSDK_SetIvsShowFlagByWndNo(gWndId, nWndNo, 3, bIVS),"轨迹线显示");//打开轨迹线显示	
}
function buttonGetExtrenUrl_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	var szCameraId = document.getElementById("textCameraID").value;
	var url = obj.DPSDK_GetExternalRealStreamUrl(szCameraId,1,1,1,801,0,0,0,0,0);
	alert(url);
}

function ButtonSetWndText_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var text = document.getElementById("WndText").value;
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_SetWndText(gWndId, nWndNo, text, "黑体", 0, 7, 7, 0, 100, 100, 100), "窗口显示文字");
	
}

function ButtonSetWndFullScreen_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");
	var text = document.getElementById("WndText").value;
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_SetWndFullScreen(gWndId), "全屏显示选中窗口");
}

function ExitFullScreenTimeout()
{
	var obj = document.getElementById("DPSDK_OCX");
	obj.DPSDK_ExitSmartWndFullScreen(gWndId);
}

function ButtonSetSmartWndFullScreen_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");
	var text = document.getElementById("WndText").value;
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_SetSmartWndFullScreen(gWndId), "全屏显示Smart窗口");
	//setTimeout("ExitFullScreenTimeout()", 2000);
}

function ButtonSetWndStyle_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndStyle = document.getElementById("selectWndStyle").value;
	obj.DPSDK_SetWndStyle(nWndStyle);
}

function ButtonControlDevBurner_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var deviceid = document.getElementById("Devceid").value;
	var cmd = document.getElementById("selectcmd").value;
	var Channelid = document.getElementById("Channelid").value;
	var channelmask = 1 << Channelid;
	var nBurnerMask = document.getElementById("selectmask").value;
	var mode = document.getElementById("selectmode").value;
	var pack = document.getElementById("selectpack").value;
	ShowCallRetInfo(obj.DPSDK_ControlDevBurner(deviceid, cmd, channelmask, nBurnerMask, mode, pack), "刻录控制");
}

function ButtonGetDevBurnerCDState_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var strDeviceId = document.getElementById("Devceid_query").value;
	var nBurnId = document.getElementById("burnerId").value;
	var result = obj.DPSDK_GetDevBurnerCDState(strDeviceId, nBurnId);
	alert(result);
}

function ButtonSitPtzParam_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nXPosition = document.getElementById("textXPositionEX").value;
    var nYPosition = document.getElementById("textYPositionEX").value;
    var nStep = document.getElementById("selectPtzSitStepEX").value;
	var nXspeed = document.getElementById("textXspeedEX").value;
    var nYspeed = document.getElementById("textYspeedEX").value;
    var nZspeed = document.getElementById("textZspeedEX").value;
	
    ShowCallRetInfo(obj.DPSDK_SetPtzParam(szCameraId, nXPosition, nYPosition, nStep, parseFloat(nXspeed), parseFloat(nYspeed), parseFloat(nZspeed)), "设置球机云台参数");
}

function ButtonGetPtzParam_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("textCameraID").value; 
	var type = document.getElementById("selectPtzSittype").value;
	var result = obj.DPSDK_QueryPtzSitInfo(szCameraId, type);
	alert(result);
}
function ButtonOpenDoor_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("DoorChannelid").value; 
	var result = obj.DPSDK_SetDoorCmd(szCameraId, 5);
	ShowCallRetInfo(result,"远程开门");
}

function ButtonQueryNetAlarmHostStatus_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szDeviceId = document.getElementById("NetHostStatusDevceid").value; 
	var result = obj.DPSDK_QueryNetAlarmHostStatus(szDeviceId);
	alert(result);
}

function ButtonControlNetAlarmHostCmd_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("NetHostDevceid").value; 
	var operationtype = document.getElementById("operationtype").value; 
	var cmd = document.getElementById("NetHostcmd").value;
	var nStartTime = document.getElementById("NetHostStartTime").value;
	var nEndTime = document.getElementById("NetHostEndTime").value;
	var result = obj.DPSDK_ControlNetAlarmHostCmd(szCameraId, operationtype, cmd, nStartTime, nEndTime);
	ShowCallRetInfo(result,"网络报警主机控制");
}

function ButtonControlVideoAlarmHost_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szCameraId = document.getElementById("VideoHostDevceid").value; 
	var channelId = document.getElementById("VideoHostChannelNO").value; 
	var controlType = document.getElementById("VideoHostcontrolType").value;
	
	var result = obj.DPSDK_ControlVideoAlarmHost(szCameraId, channelId, controlType);
	ShowCallRetInfo(result,"视频报警主机控制");
}

function ButtonQueryChannelViewInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var CameraID = document.getElementById("viewinfoCameraID").value; 
	var result = obj.DPSDK_QueryChannelViewInfo(CameraID);
	alert(result);
}

function ButtonQueryDeviceViewInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szDeviceId = document.getElementById("viewinfoDeviceID").value; 
	var result = obj.DPSDK_QueryDeviceViewInfo(szDeviceId);
	
	ShowCallRetInfo(result,"查询设备球机通道可视域信息");
}

loadXML = function(xmlString){
        var xmlDoc=null;
        //判断浏览器的类型
        //支持IE浏览器 
        if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
            for(var i=0;i<xmlDomVersions.length;i++){
                try{
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                    break;
                }catch(e){
                }
            }
        }
        //支持Mozilla浏览器
        else if(window.DOMParser && document.implementation && document.implementation.createDocument){
            try{
                /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                 */
                domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }catch(e){
            }
        }
        else{
            return null;
        }

        return xmlDoc;
}

function ButtonCheckRealPlayAuth_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szIP = document.getElementById("textJDIP").value;
	var nPort = document.getElementById("textJDPort").value;
	var szDvrCode = document.getElementById("textJDDvrCode").value;
	var szToken = document.getElementById("textJDToken").value;
	var nResult = obj.DPSDK_CheckRealPlayAuth(szIP, nPort, szDvrCode, szToken);
	alert("result = " + nResult);
}

function ButtonCheckPlaybackAuth_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szIP = document.getElementById("textJDIP2").value;
	var nPort = document.getElementById("textJDPort2").value;
	var szFileId = document.getElementById("textJDFileId").value;
	var szToken = document.getElementById("textJDToken2").value;
	var nResult = obj.DPSDK_CheckPlaybackAuth(szIP, nPort, szFileId, szToken);
	//alert("result = " + nResult);
	alert(nResult);
}

function StartMonitor()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nResult = obj.DPSDK_StartMonitor("D:\\testdump");
	ShowCallRetInfo(nResult,"开启崩溃监控，设置dump名称D:\\testdump");
}

function StopMonitor()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nResult = obj.DPSDK_StopMonitor();
	ShowCallRetInfo(nResult,"关闭崩溃自动生成dump");
}

function ButtonOpenTime_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nResult = obj.DPSDK_SetSyncTimeOpen( 1 );
	ShowCallRetInfo(nResult,"打开全网校时");
}

function ButtonSubscribeAllBayCarInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nResult = obj.DPSDK_SubscribeAllBayCarInfo( 1 );
	ShowCallRetInfo(nResult,"订阅所有卡口过车上报");
}

function ButtonUndoSubscribe_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nResult = obj.DPSDK_SubscribeAllBayCarInfo( 0 );
	ShowCallRetInfo(nResult,"取消订阅所有卡口过车上报");
}

function ButtonShowVideoPlayInfo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var bShow = document.getElementById("selectVideoPlayInfo").value;
	var nResult = obj.DPSDK_ShowVideoPlayInfo(bShow);
	ShowCallRetInfo(nResult, "设置视频播放信息显示");
}

function ButtonGetChnlID_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
	var strChnlName = document.getElementById("ChnlName").value;
	var strChnlID = obj.DPSDK_GetChnlIDByChnlName(strChnlName);
	alert(strChnlID);
}

function ButtonQueryNVRChnlStatus_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var strDevId = document.getElementById("QueryNVRDevId").value;
	var nResult = obj.DPSDK_QueryNVRChnlStatus(strDevId);
	ShowCallRetInfo(nResult,"查询NVR通道状态");
}

function ButtonSetOsdTxt_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strOSD = document.getElementById("textOsd").value;
	var szCameraId = document.getElementById("textCameraID").value;
	ShowCallRetInfo(obj.DPSDK_SetOSDInfo(szCameraId, strOSD, 0, 0, 5402, 797, 5402, 797, 1, 0), "摄像头码流叠加OSD信息");
}

function ButtonCleanOsdTxt_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strOSD = "";
	var szCameraId = document.getElementById("textCameraID").value;
	ShowCallRetInfo(obj.DPSDK_SetOSDInfo(szCameraId, strOSD, 0, 0, 5402, 797, 5402, 797, 1, 0), "摄像头码流叠加OSD信息");
}

function ButtonSearchPicture_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var strChnlID = document.getElementById("ChnlID").value;
	var strStartTime = document.getElementById("searchStartTime").value;
    var strEndTime = document.getElementById("searchEndTime").value;	
	var index = strChnlID.indexOf('$');
	var strDevID = strChnlID.substring(0, index);
	
	var jsonObj = { 
		"method":"cu.searchSnapPicUrl",
		"params": {
			"DevID":"",
			"cameraId":"",
			"startTime":"",
			"endTime":"" 
		},
		"id":1
	};
	jsonObj.params.DevID=strDevID;
	jsonObj.params.cameraId=strChnlID;
	jsonObj.params.startTime=strStartTime;
	jsonObj.params.endTime=strEndTime;
	jsonObj.id=10000;
	
	var jsonStr= JSON.stringify(jsonObj);
	
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(jsonStr,1,0), "发送json");
}

function ButtonGetPictureData_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var strPicUrl = document.getElementById("PictureFtpUrl").value;
	var strChnlID = document.getElementById("ChnlID").value;
	var index = strChnlID.indexOf('$');
	var strDevID = strChnlID.substring(0, index);
	
	var jsonObj = { 
		"method":"dms.getSnapPic",
		"params": {
			"DevID":"",
			"FtpUrl":""
		},
		"id":1
	};
	jsonObj.params.DevID=strDevID;
	jsonObj.params.FtpUrl=strPicUrl;
	jsonObj.id=30001;
	
	var jsonStr= JSON.stringify(jsonObj);
	
	ShowCallRetInfo(obj.DPSDK_GeneralJsonTransport(jsonStr,3,0), "发送json");
}

function ButtonStopAllPlay_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nRet = obj.DPSDK_StopAllPlay(gWndId);
	ShowCallRetInfo(nRet, "停止所有预览");
}

function ButtonGetFirstFreeWindow_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetFirstFreeWindow(gWndId);
	if(nWndNo == -1)
	{
		alert("无空闲窗口！");
	}
	else
	{
		alert("空闲窗口号：" + nWndNo);
	}
}

function ButtonStartRealplayByFreeWnd_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    
    var szCameraId = document.getElementById("textCameraID").value;
    var nStreamType = document.getElementById("selectStreamType").value;
    var nMediaType = document.getElementById("selectMediaType").value;
    var nTransType = document.getElementById("selectTransType").value;
   
	var nRet = obj.DPSDK_StartRealplayByFreeWnd(gWndId, szCameraId, nStreamType, nMediaType, nTransType);
    ShowCallRetInfo(nRet, "空闲窗口预览");
}

function ButtonGetPlayCameraIdByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var szCameraId = obj.DPSDK_GetPlayCameraIdByWndNo(gWndId, nWndNo);
	if(szCameraId == "")
	{
		alert("当前窗口无对应通道ID！")
	}
	else
	{
		alert("窗口对应通道ID：" + szCameraId);
	}
}

function ButtonConnectToSCSWithCallNumber_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    var szIp = document.getElementById("textSCSIP").value;
    var nPort = document.getElementById("textSCSPort").value;
    var szCallNumber = document.getElementById("textSCSCallNumber").value;
	var nRet = obj.DPSDK_ConnectToSCSWithCallNumber(szIp, nPort, szCallNumber);
    ShowCallRetInfo(nRet, "登录SCS服务");
}

function ButtonStartVtCallByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	gVtCallWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var szUserId = document.getElementById("textSCSUserId").value;
	var nRet = obj.DPSDK_StartVtCallByWndNo(gWndId, gVtCallWndNo, szUserId);
    ShowCallRetInfo(nRet, "开始呼叫");
}

function ButtonSendCancelVtCallByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szUserId = document.getElementById("textSCSUserId").value;
	var nRet = obj.DPSDK_SendCancelVtCallByWndNo(gWndId, gVtCallWndNo, szUserId);
    ShowCallRetInfo(nRet, "取消呼叫");
}

function ButtonStopVtCallByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szUserId = document.getElementById("textSCSUserId").value;
	var nRet = obj.DPSDK_StopVtCallByWndNo(gWndId, gVtCallWndNo, szUserId);
    ShowCallRetInfo(nRet, "停止可视对讲");
}

function ButtonInviteVtCallByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	gVtCallWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var nRet = obj.DPSDK_InviteVtCallByWndNo(gWndId, gVtCallWndNo);
    ShowCallRetInfo(nRet, "接收对讲邀请");
}

function ButtonSendRejectVtCall_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nRet = obj.DPSDK_SendRejectVtCall();
    ShowCallRetInfo(nRet, "拒绝对讲邀请");
}
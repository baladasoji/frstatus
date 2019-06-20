var currentEnv="";
var api_url_live = "https://api280801live.gateway.akana.com/";
var api_url_stage = "https://api301002live.gateway.akana.com/";
var api_url_cdt = "https://api301002sandbox.gateway.akana.com/";

var cdt_emea="d6e1949593824ca4b74dcc5b3dd3aa02";
var cdt_amer="";
var cdt_apac="2268de00eaea4378b2975f149f41d00f";
var pp_emea="f0c2af13a6754bf3806e978e6286fc75";
var pp_apac="c7637f83993b489d98d8bb914c3607af";
var pp_amer="19a96ae12e7248408e95feb1f71a51a5";
var p_emea="dd2b96f8cc6b45f59f8aed9979b4a0f3";
var p_apac="65fae118dfb94b76ac11d7dc00d761c0";
var p_amer="4f11b641441c450eb1655f318e408ae5";
var EMEA_DC="";
var AMER_DC="";
var APAC_DC="";
var countsOnly=true;
var latestentitlements;
var access_token='';
var api_url = api_url_cdt ;
//var api_url = "https://iam.maerskline.com/";
var unamehdr = "X-OpenIDM-Username";
var datacenterhdr = "X-TEST-FAILOVER";
var uname;
var pwd;
var pwdhdr = "X-OpenIDM-Password";
var userURI = "openidm/managed/user?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var profileURI = "openidm/managed/UserProfile?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var entitlementsURI = "openidm/managed/entitlement?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var searchuserURI = "openidm/managed/user?_queryFilter=userName+eq+";
var DC = 'dd2b96f8cc6b45f59f8aed9979b4a0f3';
var waittime=1000;
//var singleUser;
//var singleProfile;
//var singleEntitlement;


function searchUser()
{
  document.getElementById('emeauserresult').innerHTML = '' ;
  document.getElementById('apacuserresult').innerHTML = '' ;
  document.getElementById('ameruserresult').innerHTML = '' ;
  if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
  {
    showMsgNSecs ('alert-danger','Please choose environment first',3);
  }
  else
  {
    document.getElementById("tab-search").style.display='block';
   // uname=document.getElementById('uname').value.trim();
   // pwd=document.getElementById('pwd').value.trim();
    waittime = parseInt(document.getElementById('waittime').value.trim());
    showMsgNSecs ('alert-info' ,'<span class="fas fa-spinner"></span> Searching for users please wait...',waittime+2);
    waittime = waittime*1000;
    countsOnly=document.getElementById("checkCountOnly").checked;
    singleDCOnly=document.getElementById("checkSingleDC").checked;

    allusersstr=document.getElementById('usernames').value;
    users = allusersstr.split("\n");
    for (i=0; i<users.length; i++)
    {
      suser = users[i];
      if (suser.trim() != "")
      {
        //console.log(emails[email]);
	callUserApi('emeauserresult',searchuserURI, suser  ,EMEA_DC );
	if (!singleDCOnly)
	{
	    callUserApi('apacuserresult',searchuserURI, suser ,APAC_DC );
	    callUserApi('ameruserresult',searchuserURI, suser ,AMER_DC );
	}
      }
    }
  }
}

function callRest()
{
	access_token=sessionStorage.access_token;
	document.getElementById('environmentChoice').addEventListener('click', changeEnvironment);
	document.getElementById('btnSearchUser').addEventListener('click', searchUser);
}

/*
function callProfileApi(element, url,datacenter)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    if (this.status == 200)
	    {
		var singleProfile;
		profileresult= JSON.parse(this.responseText);
		profilename = profileresult.userProfileKey;
		var singleProfile;
		if (countsOnly)
		{
		    singleProfile = { "profilename": profilename, "entitlements":0};
		    entitlements = profileresult.entitlements;
		    singleProfile.entitlements=entitlements.length;
		    element.profiles.push(singleProfile);
		}
		else
		{
		    singleProfile = { "profilename": profilename, "entitlements":[]};
		    entitlements = profileresult.entitlements;
		    for ( e in entitlements )
		    {
			callEntitlementApi (singleProfile , 'openidm/' + entitlements[e]._ref, datacenter );
		    }
	    //	console.log(singleProfile.entitlements);
		    element.profiles.push(singleProfile);
		}
	    }
	    else if (this.status == 401)
	    {
		showMsgNSecs ('alert-danger',JSON.parse(this.responseText).message + " - Please check your credentials",3);
	    }
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
	apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
  //  apiXMLReq.setRequestHeader(unamehdr, uname );
  //  apiXMLReq.setRequestHeader(pwdhdr, pwd );
    apiXMLReq.setRequestHeader(datacenterhdr, datacenter );
    apiXMLReq.send(null);

}
*/


function callEntitlementApi(element, url, datacenter)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    if (this.status == 200)
	    {
		entitlementresult= JSON.parse(this.responseText);
		entitlementname = entitlementresult.entitlementKey;
		element.entitlements.push(entitlementname);
	    }
	    else if (this.status == 401)
	    {
		showMsgNSecs ('alert-danger',JSON.parse(this.responseText).message + " - Please check your credentials",3);
	    }
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
	apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
  //  apiXMLReq.setRequestHeader(unamehdr, uname );
  //  apiXMLReq.setRequestHeader(pwdhdr, pwd );
    apiXMLReq.setRequestHeader(datacenterhdr, datacenter );
    apiXMLReq.send(null);
}


function callUserApi(element, url, user, datacenter)
{
    url = url + '%22' + user + '%22' ;
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = async function() {
        if (this.readyState == 4)
        {
	    if (this.status == 200)
	    {
		userresult= JSON.parse(this.responseText);
		if (userresult.result.length != 0)
		{
		    username = userresult.result[0].userName;
		    user = userresult.result[0];
		    var singleUser = { "username" : username , "entitlements" : []};
			if (countsOnly)
			{
			    var singleUser = { "username" : username , "entitlements" :0 };
			    entitlements = user.entitlements;
			    singleUser.entitlements=entitlements.length;
//			    element.users.push(singleUser);
			}
			else
			{
			    singleUser = { "username": username, "entitlements":[]};
			    entitlements = user.entitlements;
			    for ( e in entitlements )
			    {
				callEntitlementApi (singleUser , 'openidm/' + entitlements[e]._ref, datacenter );
			    }
		    //	console.log(singleProfile.entitlements);
//			    element.profiles.push(singleProfile);
			}
		    await new Promise(resolve => setTimeout(resolve, waittime));
		//singleUser.entitlements=singleUser.entitlements.sort((a, b) => a.entitlementKey < b.entitlementKey ? -1 : 1);

		    document.getElementById(element).innerHTML += renderJSON(singleUser);
		}
		else
		{
		    document.getElementById(element).innerHTML += " <span class='alert-warning'>" + user + " - User not found </span> ";
		}
	    }
	    else if (this.status == 401)
	    {
		showMsgNSecs ('alert-danger',JSON.parse(this.responseText).message + " - Please check your credentials",5);
		document.getElementById(element).innerHTML = '' ;
	    }
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
	apiXMLReq.setRequestHeader("Authorization","Bearer "+access_token);
//    apiXMLReq.setRequestHeader(unamehdr, uname );
//    apiXMLReq.setRequestHeader(pwdhdr, pwd );
    apiXMLReq.setRequestHeader(datacenterhdr, datacenter );
    apiXMLReq.send(null);
}

function renderJSON(obj) {
    'use strict';
    var keys = [],
        retValue = "";
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            retValue += "<div class='tree'>" ;
            retValue += renderJSON(obj[key]);
            retValue += "</div>";
        } else {
            retValue += "<div class='tree'>" + obj[key] + "</div>";
        }

        keys.push(key);
    }
    return retValue;
}

function changeEnvironment()
{
  currentEnv = this.value;
  //console.log("Current environment is "+currentEnv);
  if (currentEnv === "NONE")
  {
    return;
  }
  else if (currentEnv === "CDT")
  {
    api_url=api_url_cdt;
    EMEA_DC=cdt_emea;
    APAC_DC=cdt_apac;
    AMER_DC=cdt_amer;
  }
  else if (currentEnv === "STAGE")
  {
    api_url=api_url_stage;
    EMEA_DC=pp_emea;
    APAC_DC=pp_apac;
    AMER_DC=pp_amer;
  }
  else if (currentEnv == "PRODUCTION")
  {
    api_url=api_url_live;
    EMEA_DC=p_emea;
    APAC_DC=p_apac;
    AMER_DC=p_amer;
  }

}


 function showMsgNSecs (alertclass, message, numsecs)
  {
    document.getElementById('message').className = "mt-2 alert "+alertclass;
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style = 'visibility:visible';

    setTimeout(function(){
      document.getElementById('message').style = 'visibility:hidden';
    }, numsecs*1000);
  }

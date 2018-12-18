
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
var searchuserURI = "openidm/managed/user?_queryFilter=userName+eq+%22";
var DC = 'dd2b96f8cc6b45f59f8aed9979b4a0f3';
var waittime=1000;
//var singleUser;
//var singleProfile;
//var singleEntitlement;


function searchUser()
{
  if (currentEnv == null || currentEnv == "" || currentEnv == "NONE" )
  {
    showMsgNSecs ('alert-danger','Please choose environment first',3);
  }
  else
  {

/*
    allusersstr=  document.getElementById('allusers').value;
    users = allusersstr.split("\n");
    for (i=0; i<users.length; i++)
    {
      curuser = users[i];
      if (curuser.trim() != "")
      {
        //console.log(emails[email]);
	callUserApi('emeauserresult',searchuserURI+ curuser + '%22',EMEA_DC );
      }
    }
*/
    document.getElementById("tab-search").style.display='block';
    uname=document.getElementById('uname').value.trim();
    pwd=document.getElementById('pwd').value.trim();
    suser=document.getElementById('suser').value.trim();
    waittime = parseInt(document.getElementById('waittime').value.trim());
    waittime = waittime*1000;
    countsOnly=document.getElementById("checkCountOnly").checked;
    callUserApi('emeauserresult',searchuserURI+ suser + '%22',EMEA_DC );
    callUserApi('apacuserresult',searchuserURI+ suser + '%22',APAC_DC );
    callUserApi('ameruserresult',searchuserURI+ suser + '%22',AMER_DC );
  }
}

function callRest()
{
	document.getElementById('environmentChoice').addEventListener('click', changeEnvironment);
	document.getElementById('btnSearchUser').addEventListener('click', searchUser);
}

function callProfileApi(element, url,datacenter)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
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
		singleProfile.entitlements=singleProfile.entitlements.sort((a, b) => a < b ? -1 : 1);
	//	console.log(singleProfile.entitlements);
		element.profiles.push(singleProfile);
	    }
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
    apiXMLReq.setRequestHeader(datacenterhdr, datacenter );
    apiXMLReq.send(null);

}

function callEntitlementApi(element, url, datacenter)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    entitlementresult= JSON.parse(this.responseText);
	    entitlementname = entitlementresult.entitlementKey;
	    element.entitlements.push(entitlementname);
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
    apiXMLReq.setRequestHeader(datacenterhdr, datacenter );
    apiXMLReq.send(null);
}


function callUserApi(element, url, datacenter)
{
    var apiXMLReq = new XMLHttpRequest();

	document.getElementById(element).innerHTML = '<span class="fas fa-spinner"></span> Loading...';
    apiXMLReq.onreadystatechange = async function() {
        if (this.readyState == 4)
        {
	    userresult= JSON.parse(this.responseText);
	    if (userresult.result.length != 0)
	    {
		username = userresult.result[0].userName;
		var singleUser = { "username" : username , "profiles" : []};
		profiles = userresult.result[0].userProfiles;
		for (profile in profiles)
		{
		    callProfileApi (singleUser , 'openidm/' + profiles[profile]._ref, datacenter );
		}
		await new Promise(resolve => setTimeout(resolve, waittime));
		singleUser.profiles=singleUser.profiles.sort((a, b) => a.profilename < b.profilename ? -1 : 1);
		document.getElementById(element).innerHTML = renderJSON(singleUser);
	    }
	    else
	    {
		document.getElementById(element).innerHTML = "User Not Found";
	    }
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
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
    document.getElementById('message').className = "alert "+alertclass;
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').style = 'visibility:visible';

    setTimeout(function(){
      document.getElementById('message').style = 'visibility:hidden';
    }, numsecs*1000);
  }


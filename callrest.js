var jwtb = false;
var bkgXMLReq;
var bolXMLReq;
var finXMLReq;
var admXMLReq;
var api_url = "https://api280801live.gateway.akana.com/";
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

function callApi(element, url)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    result= JSON.parse(this.responseText).totalPagedResults;
		document.getElementById(element).innerHTML = result;
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
    //alert ("Sending" + uname + "  " + pwd);
    apiXMLReq.send(null);

}

function getCounts()
{
	document.getElementById("tab-search").style.display='none';
	document.getElementById("tab-counter").style.display='block';
	uname=document.getElementById('uname').value.trim();
	pwd=document.getElementById('pwd').value.trim();
        callApi('users',userURI);
        callApi('profiles',profileURI);
        callApi('entitlements',entitlementsURI);
}
function searchUser()
{
	document.getElementById("tab-search").style.display='block';
	document.getElementById("tab-counter").style.display='none';
	uname=document.getElementById('uname').value.trim();
	pwd=document.getElementById('pwd').value.trim();
	suser=document.getElementById('suser').value.trim();
	waittime = parseInt(document.getElementById('waittime').value.trim());
	waittime = waittime*1000;
//        callUserApi('userresult',searchuserURI+ suser + '%22' );
	DC='dd2b96f8cc6b45f59f8aed9979b4a0f3';
        callUserApi('emeauserresult',searchuserURI+ suser + '%22',DC );
	DC='65fae118dfb94b76ac11d7dc00d761c0';
        callUserApi('apacuserresult',searchuserURI+ suser + '%22',DC );
	DC='4f11b641441c450eb1655f318e408ae5';
        callUserApi('ameruserresult',searchuserURI+ suser + '%22',DC );
}
function callRest()
{
	ures = '';
	pres = '';
	eres = '';
	document.getElementById('userresult').innerHTML = ures;
	document.getElementById('profileresult').innerHTML = pres;
	document.getElementById('entitlementresult').innerHTML = eres;
	uname=document.getElementById('uname').value.trim();
	pwd=document.getElementById('pwd').value.trim();
	suser=document.getElementById('suser').value.trim();
        callApi('users',userURI);
        callApi('profiles',profileURI);
        callApi('entitlements',entitlementsURI);
        callUserApi('userresult',searchuserURI+ suser + '%22' );
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
	    var singleProfile = { "profilename": profilename, "entitlements":[]};
	    entitlements = profileresult.entitlements;
	    for ( e in entitlements )
	    {
		    callEntitlementApi (singleProfile , 'openidm/' + entitlements[e]._ref, datacenter );
	    }
	    singleProfile.entitlements.sort();
	    element.profiles.push(singleProfile);
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
		singleUser.profiles.sort();
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

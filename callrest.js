var jwtb = false;
var bkgXMLReq;
var bolXMLReq;
var finXMLReq;
var admXMLReq;
var api_url = "https://api280801live.gateway.akana.com/";
var unamehdr = "X-OpenIDM-Username";
var uname;
var pwd;
var ures='';
var pres='';
var eres='';
var pwdhdr = "X-OpenIDM-Password";
var userURI = "openidm/managed/user?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var profileURI = "openidm/managed/UserProfile?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var entitlementsURI = "openidm/managed/entitlement?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var searchuserURI = "openidm/managed/user?_queryFilter=userName+eq+%22";


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
//    alert ("Sending" + uname + "  " + pwd);
    apiXMLReq.send(null);

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
function callProfileApi(element, url)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    profileresult= JSON.parse(this.responseText);
		profilename = profileresult.userProfileKey;
		pres = pres + profilename;
		entitlements = profileresult.entitlements;
		for ( e in entitlements )
		{
			callEntitlementApi ('entitlementresult' , 'openidm/' + entitlements[e]._ref );
		}

		document.getElementById(element).innerHTML = pres;
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
//    alert ("Sending" + uname + "  " + pwd);
    apiXMLReq.send(null);

}

function callEntitlementApi(element, url)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    entitlementresult= JSON.parse(this.responseText);
		entitlementname = entitlementresult.entitlementKey;
		eres = eres + entitlementname ;
		document.getElementById(element).innerHTML = eres;
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
//    alert ("Sending" + uname + "  " + pwd);
    apiXMLReq.send(null);
}


function callUserApi(element, url)
{
    var apiXMLReq = new XMLHttpRequest();
    apiXMLReq.onreadystatechange = function() {
        if (this.readyState == 4)
        {
	    userresult= JSON.parse(this.responseText);
	    username = userresult.result[0].userName;
		ures = ures +username;
	    profiles = userresult.result[0].userProfiles;
	    for (profile in profiles)
		{
			callProfileApi ('profileresult' , 'openidm/' + profiles[profile]._ref );
		}

		document.getElementById(element).innerHTML = ures;
        }
      };
    apiXMLReq.open("GET", api_url + url , true );
    apiXMLReq.setRequestHeader(unamehdr, uname );
    apiXMLReq.setRequestHeader(pwdhdr, pwd );
//    alert ("Sending" + uname + "  " + pwd);
    apiXMLReq.send(null);

}

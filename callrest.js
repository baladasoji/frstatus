var jwtb = false;
var bkgXMLReq;
var bolXMLReq;
var finXMLReq;
var admXMLReq;
var api_url = "https://api280801live.gateway.akana.com/";
var unamehdr = "X-OpenIDM-Username";
var uname;
var pwd;
var pwdhdr = "X-OpenIDM-Password";
var userURI = "openidm/managed/user?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var profileURI = "openidm/managed/UserProfile?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";
var entitlementsURI = "openidm/managed/entitlement?_queryId=query-all-ids&_pageSize=3&_totalPagedResultsPolicy=EXACT";


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
	uname=document.getElementById('uname').value.trim();
	pwd=document.getElementById('pwd').value.trim();
        callApi('users',userURI);
        callApi('profiles',profileURI);
        callApi('entitlements',entitlementsURI);
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&|#]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function store(){
    err = getURLParameter("error_description");
    msg = document.getElementById("message");
    if (err == null || err.length == 0)
    {
      access_token = getURLParameter("id_token");
      if (access_token == null || access_token.length == 0){
          msg.className = 'text-danger' ;
          msg.innerHTML = "No Token available redirecting to Azure AD for authentication";
	  origin=encodeURI(window.location.origin);
          setTimeout(function(){
              window.location.href = "https://login.microsoftonline.com/maersk.onmicrosoft.com/oauth2/v2.0/authorize?response_mode=fragment&nonce=987234&client_id=98023e9a-8797-420b-b987-e80877ebd352&response_type=id_token&state=0237840987234&scope=openid&redirect_uri="+origin+"%2Findex.html" ;
          }, 1000);
      }
      else{
          msg.className = 'text-success' ;
          msg.innerHTML = "Obtained the token from Auth provider redirecting to the Admin page " ;
          sessionStorage.access_token = access_token;
          setTimeout(function(){
              window.location.href = "search.html";
          }, 1000);
      }

    }
    else {
          msg.className = 'text-danger' ;
          msg.innerHTML = err + "<BR> Please correct these errors first";
    }
}

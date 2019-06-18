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
              window.location.href = "https://login.microsoftonline.com/maersk.onmicrosoft.com/oauth2/v2.0/authorize?response_mode=fragment&nonce=987234&client_id=08d64f11-9c8a-4a08-a737-022b04c0b9a9&response_type=token&state=0237840987234&scope=openid%20profile&redirect_uri="+origin+"%2Findex.html" ;
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

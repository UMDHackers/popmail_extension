//GMAIL STUFF

function get_information() {
	var to = document.getElementById("to").value, 
	subject = document.getElementById("subject").value,
	message = document.getElementById("message").value;
	
	console.log("To: " + to + " subject " + subject + " message " + message);
	
	if(to == "") {
		alert("Include a recipent please");
		return;
	}

	sendMessage(
	  {
		'To': to,
		'Subject': subject
	  },
	  message,
	  clear
	);
}

//oauth2 auth
chrome.identity.getAuthToken(
	{'interactive': true},
	function(){
	  //load Google's javascript client libraries
		window.gapi_onload = authorize;
		loadScript('https://apis.google.com/js/client.js');
	}
);

function loadScript(url){
  var request = new XMLHttpRequest();

	request.onreadystatechange = function(){
		if(request.readyState !== 4) {
			return;
		}

		if(request.status !== 200){
			return;
		}

		eval(request.responseText);
	};

	request.open('GET', url);
	request.send();
}

function authorize(){
  gapi.auth.authorize(
		{
			client_id: CLIENT_ID,
			immediate: true,
			scope: 'https://www.googleapis.com/auth/gmail.send'
		},
		function(){
		  gapi.client.load('gmail', 'v1', gmailAPILoaded);
		}
	);
}

function gmailAPILoaded(){	
	//document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('send').addEventListener('click', get_information);
	//}, false);
}


function sendMessage(headers_obj, message, callback) {
	var email = '';
	for(var header in headers_obj)
	  email += header += ": "+headers_obj[header]+"\r\n";
	email += "\r\n" + message;
	var sendRequest = gapi.client.gmail.users.messages.send({
	  'userId': 'me',
	  'resource': {
		'raw': window.btoa(email).replace(/\+/g, '-').replace(/\//g, '_')
	  }
	});
	return sendRequest.execute(callback);
}
function clear() {
	document.getElementById("to").value = "";
	document.getElementById("subject").value = "";
	document.getElementById("message").value = "";
	alert("Email sent!");
	return;
}

$('.carousel').carousel({
    interval: false
});

var initTable = buildTableFromObject({"users": {}, "passwords": {}});
$("#table").html(initTable);

function buildTableFromObject(inputObject){
    var tableOpen = "<table class=\"table table-striped\">";
    var tableHeaderOpen = "<thead class=\"thead-dark\"><tr><th scope=\"col\">#</th>";
    var tableHeaderClose = "</tr></thead>";
    var tableBodyOpen = "<tbody>";
    var tableBodyClose = "</tbody>";
    var tableClose = "</table>";
    var tableHeaders = "";
    var tableBody = "";
        
    var keys = Object.keys(inputObject);
    var rowLength = inputObject[keys[0]].length;
    
    for (let i = 0; i < keys.length; i++){
        tableHeaders += "<th scope=\"col\">" + keys[i] + "</th>";
    }
    for (let i = 0; i < rowLength; i++){
        tableBody += "<tr><th scope=\"row\">" + i + "</th>";
        for (let j = 0; j < keys.length; j++){
            tableBody += "<td>" + users[keys[j]][i] + "</td>";
        }
        tableBody += "</tr>";
    }
    return tableOpen + tableHeaderOpen + tableHeaders + tableHeaderClose +
            tableBodyOpen + tableBody + tableBodyClose + tableClose;
}

function getUsers(){
    var params = {};
	var body = {
		"fetch": "yes"
	};
	var additionalParams = {
		headers: {},
		queryParams: {}
	};

	var apigClient = apigClientFactory.newClient();
	var responseBody = null;
	apigClient.userAllPost(params, body, additionalParams)
		.then(function(result){
			console.log(result);
			responseBody = result["data"]["body"];
		}).catch( function(result){
			alert("Oops. Bad response. :(");
		});
	
	setTimeout(function(){
		console.log(responseBody)
		users = responseBody["users"];
		var table = buildTableFromObject(users);
	    $("#table").html(table);
	}, 1000);
}

function addUser() {
    var username = $('#userInsert-input').val();
    var password = $('#passwordInsert-input').val();
    $('#userInsert-input').val(null);
    $('#passwordInsert-input').val(null);
    
    var params = {};
	var body = {
		"username": username,
		"password": password
	};

	var additionalParams = {
		headers: {},
		queryParams: {}
	};

	var apigClient = apigClientFactory.newClient();
	var responseBody = null;
	apigClient.userInputPost(params, body, additionalParams)
		.then(function(result){
			responseBody = result["data"]["body"];
		}).catch( function(result){
			alert("Oops. Bad response. :(");
		});
	
	setTimeout(function(){
		console.log(responseBody);
		if (responseBody["success"] == "True"){
			alert("Successfully input user.");
			getUsers();
		}
		else{
			alert("Could not add user.");
		}
	}, 1000);
}

function getInjection(){
	var username = $('#username-input').val();
	var password = $('#password-input').val();
	$('#username-input').val(null);
	$('#password-input').val(null);
	var params = {};
	var body = {
		"username": username,
		"password": password
	}
	var additionalParams={
		headers: {},
		queryParams: {}
	}
	
	var apigClient = apigClientFactory.newClient();
	var responseBody = null;
	apigClient.userPost(params, body, additionalParams)
		.then(function(result){
			responseBody = result["data"]["body"];
		}).catch(function(result){
			alert("Oops. Bad response. :(");
		});
	
	setTimeout(function(){
		console.log(responseBody);
		var refreshButton = 
			`<div class="submit-button" align="center">
				<button id="sqli-refresh" type="button" class="btn btn-primary" onclick="injectionRefresh()">Refresh</button>
			</div>`;
		if (responseBody["success"] == "True"){
			users = responseBody["users"];
			console.log(users);
			if (users["users"].length > 0){
				var table = buildTableFromObject(users);
				$('#injection-div').html("<div class=\"container w-50 p-3\">" + table + refreshButton + "</div>");
			}
			else {
				alert("Incorrect Username or Password.");
			}
		}
		else{
			$('#injection-div').html(
				`<div class="container"
					<h4>Oops. Bad Query.</h4>` + refreshButton +
				`</div>` 
			);
		}
	}, 1000);
}

function getPrepared(){
	var username = $('#pusername-input').val();
	var password = $('#ppassword-input').val();
	$('#pusername-input').val(null);
	$('#ppassword-input').val(null);
	var params = {};
	var body = {
		"username": username,
		"password": password
	}
	var additionalParams={
		headers: {},
		queryParams: {}
	}
	
	var apigClient = apigClientFactory.newClient();
	var responseBody = null;
	apigClient.userCleanPost(params, body, additionalParams)
		.then(function(result){
			responseBody = result["data"]["body"];
		}).catch(function(result){
			alert("Oops. Bad response. :(");
		});
	
	setTimeout(function(){
		console.log(responseBody);
		var refreshButton = 
			`<div class="submit-button" align="center">
				<button id="prepared-refresh" type="button" class="btn btn-primary" onclick="preparedRefresh()">Refresh</button>
			</div>`;
		if (responseBody["success"] == "True"){
			users = responseBody["users"];
			if (users["users"].length > 0){
				var table = buildTableFromObject(users);
				$('#prepared-div').html("<div class=\"container w-50 p-3\">" + table + refreshButton + "</div>");
			}
			else{
				alert("Incorrect Username or Password.")
			}
		}
		else{
			$('#prepared-div').html("<div class=\"container\"><h4>Oops. Bad Query.</h4>" + refreshButton + "</div>");
		}
	}, 1000);
}

function injectionRefresh(){
	$("#injection-div").html(
		`<div class="container">
            <form id="user-query-form">
                <div class="form-group">
					<label for="username-input">Username (with injection)</label>
					<input type="text" class="form-control" id="username-input" aria-describedby="usernameHelp" placeholder="Username">
					<small id="usernameHelp" class="form-text text-muted">This username will be embedded with an injection attack.</small>
				</div>
				<div class="form-group">
					<label for="password-input">Password (won't really matter because of injection)</label>
					<input type="text" class="form-control" id="password-input" aria-describedby="passwordHelp" placeholder="Password">
					<small id="passwordHelp" class="form-text text-muted">The password won't matter in either examples because the injection will occur with the username input.</small>
				</div>
				<div class="submit-button" align="center"><button type="button" class="btn btn-primary" onclick="getInjection()">Get Injection Results</button></div>
            </form>
        </div>`
	);
}

function preparedRefresh(){
	$("#prepared-div").html(
		`<div class="container">
            <form id="puser-query-form">
                <div class="form-group">
                    <label for="pusername-input">Username</label>
                    <input type="text" class="form-control" id="pusername-input" aria-describedby="pusernameHelp" placeholder="Username">
                    <small id="pusernameHelp" class="form-text text-muted">Username</small>
                </div>
                <div class="form-group">
                    <label for="ppassword-input">Password</label>
                    <input type="text" class="form-control" id="ppassword-input" aria-describedby="ppasswordHelp" placeholder="Password">
                    <small id="passwordHelp" class="form-text text-muted">Password</small>
                </div>
                <div class="submit-button" align="center"><button type="button" class="btn btn-primary" onclick="getPrepared()">Get User</button></div>
            </form>
        </div>`
	);
}

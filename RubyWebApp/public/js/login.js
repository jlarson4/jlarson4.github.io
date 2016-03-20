$('#logIn').on("click", function(){

	var email = $("#email").val();
	var password = $('#password').val();

	if(!isNaN(password) && !isNaN(email))
	{
		$("#errors").text("Please input an email-password combination");
	}
	else if(!isNaN(password))
	{
		$("#errors").text("Please input a password");
	}
	else if(!isNaN(email))
	{
		$("#errors").text("Please input an email")
	}
	else
	{
		$("#errors").hide();
		var formData = {
		'password' : password,
		'email' : email
 		}
		
		$.ajax({
        		         type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
        		         url         : 'login', // the url where we want to POST
        		         data        : JSON.stringify(formData), // our data object
        		         dataType    : 'json', // what type of data do we expect back from the server
        		                             
        		  })
		
		 .success(function(data) {
        		               console.log("INFO SENT AND RECIEVED");
        		          // log data to the console so we can see
        		         		
        		          // here we will handle errors and validation messages
        		 });
        		
        // stop the form from submitting the normal way and refreshing the page
       		 event.preventDefault();
        

	}
	
	
    });
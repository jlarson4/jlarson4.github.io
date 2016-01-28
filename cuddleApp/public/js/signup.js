var CID;
$(document).ready(function() {
   $('#submitted').hide();
  
});



$('form').submit(function(event) {
	// get the form data

            
              var formData = {
                  'genderD'   : $('input[name=genderD]:checked').val(),
                  'ageD'    : $('input[name=ageD]').val(),
                  'weightD'    : $('input[name=weightD]').val(),
                  'heightFTD'    : $('input[name=heightFTD]').val(),
                  'heightIND'    : $('input[name=heightIND]').val(),
                  'hairColorD'    : $('input[name=hairColorD]:checked').val(),
                  'musicD'    : $('input[name=musicD]:checked').val(),
                   'genderP' : $('input[name=genderP]:checked').val(),
                  'ageP'    : $('input[name=ageP]').val(),
                  'weightP'    : $('input[name=weightP]').val(),
                  'heightFTP'    : $('input[name=hghtFTP]').val(),
                  'heightINP'    : $('input[name=hghtINP]').val(),
                  'hairColorP'    : $('input[name=hairColorP]:checked').val(),
                  'musicP'    : $('input[name=musicP]:checked').val(),
                  'locale' :$('input[name=locale]').val(),
                  'email' :$('input[name=email]').val() 
            
              };
            
              // process the form
                     $.ajax({
                           type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                           url         : 'signup', // the url where we want to POST
                           data        : formData, // our data object
                           dataType    : 'json', // what type of data do we expect back from the server
                                     
                       })
                       // using the done promise callback
                       .success(function(data) {
                                console.log(data);
                                $("#bigForm").hide();
                                $("#submitted").show();
                                $('body').css('background-image','url(images/success.jpg)');
                                $('body').css('background-size','cover');
                           // log data to the console so we can see
                          
                           // here we will handle errors and validation messages
                       });
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        
    });


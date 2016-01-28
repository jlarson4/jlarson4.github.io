var CID;

$(document).ready(function() {
   $('#display').hide();
   $('#websiteTopper').hide();
   $('#nav').hide();
});

$('form').submit(function(event) {
	// get the form data
              var fingers = $('input[name=fingers').val();
              var acht = false;
              if(fingers === '8'){
                acht=true;
                console.log(acht);
              }
            
              var formData = {
                  'gender'              : $('input[name=gender]:checked').val(),
                  'age'    : $('input[name=age]').val(),
                  'weight'    : $('input[name=weight]').val(),
                  'heightFT'    : $('input[name=heightFT]').val(),
                  'heightIN'    : $('input[name=heightIN]').val(),
                  'hairColor'    : $('input[name=hairColor]:checked').val(),
                  'music'    : $('input[name=music]:checked').val()
            
              };
            
              // process the form
                     $.ajax({
                           type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                           url         : 'apply', // the url where we want to POST
                           data        : formData, // our data object
                           dataType    : 'json', // what type of data do we expect back from the server
                                     
                       })
                       // using the done promise callback
                       .success(function(data) {
                            if(checkForms() && !acht){
                                console.log(data);
                                $("#applyForCuddles").hide();
                                data = JSON.parse(data);
                                console.log(data.name);
                                console.log(data.bio);
                                console.log(data.imgurl);
                                $('#img').html('<img src="' + data.imgurl + '" class="img-thumbnail" style="max-height:460px; max-width:455px;">');
                                $('#responsedata').html('<strong><emp>Congratulations!</emp></strong> Your Recommended Cuddler is ' + data.name + '!');
                                $('#bio').html('About ' + data.name + ': ' + data.bio);
                                $('#display').show();
                                $('#websiteTopper').show();
                                $('#nav').show();
                                $('html,body').scrollTop(0);
                            }
                            if(acht){
                               $('#img').html('<img src="images/octo.jpg" class="img-thumbnail" style="max-height:460px; max-width:455px;">');
                                $('#responsedata').html('<strong><emp>Congratulations!</emp></strong> Your Recommended Cuddler is Larry!');
                                $('#bio').html("About Larry: He's a damn octopus. First row will get wet. Great if you enjoy hickeys. Also he might kill you. But thats what you get for cuddling with an octopus.");
                                $('#display').show();
                                $('#websiteTopper').show();
                                $('#nav').show();
                                 $("#applyForCuddles").hide();
                                $('html,body').scrollTop(0);
                            }
                           // log data to the console so we can see
                          
                           // here we will handle errors and validation messages
                       });
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        
    });

function checkForms(){
var radios=[]
radios.push($('input[name=gender]:checked').val());
radios.push($('input[name=gender]:checked').val());
radios.push($('input[name=music]:checked').val());

for(var x = 0; x<3; x++){
    if(radios[x]== '' || radios[x] == undefined){
        $('#errors').html('<strong style="font-size: 300%">Error: one or more field was not filled out</strong>');
       return false;
    }
 }

 return true;
}

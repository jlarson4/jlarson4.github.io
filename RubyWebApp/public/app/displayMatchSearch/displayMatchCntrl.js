
app.controller('PeopleCtrl', ['$scope', function($scope) {
      $scope.matches = [];
      
      $scope.loadMatches = function(matches) {
        $scope.matches = matches;
        
      };
    }]);

$('form').submit(function(event) {
    // get the form data
    var team1 = $('#team1').val()
    
            var formData = {
              'team1':team1
            };
             
              // process the form
                     $.ajax({
                           type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                           url         : 'findSchool', // the url where we want to POST
                           data        : JSON.stringify(formData), // our data object
                           dataType    : 'json', // what type of data do we expect back from the server
                                     
                       })
                       // using the done promise callback
                       .success(function(data) {
                            var obj = data;
                         console.log("SUCCESS");
                        var m = obj.seasons;
                      $('#playerName').text(obj.school);
                       $('#table').show();
                      var scope = angular.element(document.getElementById("hope")).scope();
                      scope.$apply(function () {
                        scope.loadMatches(m);
                       });
                   
                           // log data to the console so we can see
                          
                           // here we will handle errors and validation messages
                       });
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        
    });
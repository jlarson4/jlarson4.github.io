
app.controller('PeopleCtrl', ['$scope', function($scope) {
      $scope.people = [];
      
      $scope.loadPeople = function(people) {
        $scope.people = people;
        
      };
    }]);

$('form').submit(function(event) {
    // get the form data
            
              var formData = {
                  'email'              : $('input[name=email]').val(),
              };
            
              // process the form
                     $.ajax({
                           type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
                           url         : 'view', // the url where we want to POST
                           data        : formData, // our data object
                           dataType    : 'json', // what type of data do we expect back from the server
                                     
                       })
                       // using the done promise callback
                       .success(function(data) {
                        var obj = JSON.parse(data);
                           console.log(data);
                           console.log(obj.matches.a);
                           var people = obj.matches.a;
                           $('#table').show();
                           var scope = angular.element(document.getElementById("hope")).scope();
                            scope.$apply(function () {
                             scope.loadPeople(people);
                         });
                   
                           // log data to the console so we can see
                          
                           // here we will handle errors and validation messages
                       });
        
        // stop the form from submitting the normal way and refreshing the page
        event.preventDefault();
        
    });
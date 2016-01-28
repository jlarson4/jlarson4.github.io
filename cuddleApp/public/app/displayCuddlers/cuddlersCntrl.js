$(document).ready(function(){



             
    $.ajax({
          type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
          url         : 'cuddlers', // the url where we want to POST
          data        : null, // our data object
          dataType    : 'json', // what type of data do we expect back from the server
                    
      })
      // using the done promise callback
      .success(function(data) {
       var obj = JSON.parse(data);
          
          var people = obj.profs.a;
          console.log(obj.profs.a[0]);
          
         var scope = angular.element(document.getElementById("hope")).scope();
                            scope.$apply(function () {
                             scope.loadPeople(people);
        });
  
          // log data to the console so we can see
         
          // here we will handle errors and validation messages
      });

});

app.controller('cuddlerCtrl', ['$scope', function($scope) {
      $scope.people = [];
      
      $scope.loadPeople = function(people) {
        $scope.people = people;
        
      };
    }]);
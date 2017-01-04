//kapsouras
angular.module('drinkMe')
    //directive!

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

// .directive('googleplace', function() {
//     return {
//         require: 'ngModel',
//         link: function(scope, element, attrs, model) {
//             var options = {
//                 types: [],
//                 componentRestrictions: {}
//             };
//             scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
 
//             google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
//                 scope.$apply(function() {
//                     model.$setViewValue(element.val());
//                 });
//             });
//         }
//     };
// })

.directive('locationSuggestion', function($ionicModal, LocationService, UtilitySrv){
  return {
    restrict: 'A',
    link: function($scope, element){
      console.log('locationSuggestion started!');
      $scope.search = {};
      $scope.search.suggestions = [];
      $scope.search.query = "";
      $ionicModal.fromTemplateUrl('templates/location.html', {
        scope: $scope,
        focusFirstInput: true
      }).then(function(modal) {
        $scope.modal = modal;
      });
      element[0].addEventListener('focus', function(event) {
        $scope.open();
      });
      $scope.$watch('search.query', function(newValue) {
        if (newValue) {
          LocationService.searchAddress(newValue).then(function(result) {
            $scope.search.error = null;
            $scope.search.suggestions = result;
          }, function(status){
            $scope.search.error = "There was an error " + status;
            $scope.search.suggestions = [];
          });
        };
        $scope.open = function() {
          $scope.modal.show();
        };
        $scope.close = function() {
          $scope.modal.hide();
        };
        // $scope.choosePlace = function(place) {
        //   LocationService.getDetails(place.place_id).then(function(location) {
        //       var i = 0;
        //       var l = location.address_components.length;

        //       for(i; i < l; i++){
        //           if(location.address_components[i].types[0] === 'street_number'){
        //               $scope.data.user.unumber = location.address_components[i].short_name;
        //               $scope.user.address_number = parseInt(location.address_components[i].short_name);
        //           }
        //           if(location.address_components[i].types[0] ==='postal_code'){
        //               $scope.data.user.uzipcode = location.address_components[i].short_name;
        //               $scope.user.zip_code = location.address_components[i].short_name;
        //           }
        //           if(location.address_components[i].types[0] ==='route'){
        //               $scope.data.user.uaddress = location.address_components[i].short_name;
        //               $scope.user.address = location.address_components[i].short_name;
        //           }
        //       }    

        //     $scope.close();
        //   });
        // };

      });
    }
  }
})

.directive('breadcrumbs', function () {

    return {

        restrict: 'E',
        templateUrl: 'templates/breadcrumbs.html'

    };
})

.directive('popularproducts', function () {

    return {

        restrict: 'E',
        templateUrl: 'templates/popular.html'
    };
})

.directive('similarproducts', function () {

    return {

        restrict: 'E',
        templateUrl: 'templates/similar_slider.html'
    };
})

.directive('compareTo', function () {

    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue === scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };


})

//.directive('adjustFs', function ($log, $interpolate) {
//    return {
//        restrict: 'A',
//        scope: {
//            val: '@inpVal'
//        },
//        link: function (scope, element, attrs) {
//
//            this.changeFontSize = function () {
//                var textLength = element[0].innerText.length;
//
//                if (textLength >= 2) {
//                    var scaleVal = 0.35;
//                    console.log(attrs);
//
//                    var f_size = textLength * scaleVal + "px"
//
//                    element.style = f_size;
//                    //                    element[0].style.fontSize = textLength * scaleVal + "px";
//                    //                    element.css("font-size", parseInt(element.css("font-size")) * textLength * scaleVal + "px");
//                }
//            }
//
//            scope.$watch("val", function () {
//                this.changeFontSize();
//            });
//        }
//    }
//})
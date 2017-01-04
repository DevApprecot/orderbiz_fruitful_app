angular.module('drinkMe')

.filter('matchValues', function () {
    return function (arr, super_cat) {
        var toReturn = [];
        var length = arr.length;
        var i;
        for (i = 0; i < length; i++) {
            if (arr[i].refid == super_cat) {
                toReturn.push(arr[i])
            }
        }
        return toReturn;
    }
})
.filter('parseDate', function( $filter){
    return function(input){
        var tmp = $filter('date')(new Date(Date.parse(input)), 'MMM d, y');
        return tmp;
    };

})

.filter('hasCurrentActivities', function($filter) {
    return function(input) {
        var today = $filter('date')(new Date(), 'dd/MM/yyyy').toString();
        angular.forEach(input.activities, function(val,key) {
            if (val.date == today) {
                return true
            };  
        });
        return false;
    }
})
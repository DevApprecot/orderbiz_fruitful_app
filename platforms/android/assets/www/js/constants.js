angular.module('drinkMe')


    .constant('API_CONSTANTS', {
        url: 'http://www.san-soft.com/smartagent/services/',
        app_code: 'X13ZEB24GV',
        media: 'http://www.san-soft.com/smartagent/images/products/'
    })
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
angular.module('drinkMe')


    .constant('API_CONSTANTS', {
        url: 'http://www.anaxoft.com/agent_frouta/services/',
        app_code: 'X13ZEB24GV',
        media: 'http://www.anaxoft.com/agent_frouta/images/products/'
    })
    .constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
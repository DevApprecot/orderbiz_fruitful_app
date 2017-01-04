// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('drinkMe', ['ionic', 'ngCordova', 'pascalprecht.translate', 'angularjs-crypto', 'tmh.dynamicLocale'])

.run(function ($ionicPlatform, $ionicPopup, $rootScope, $state, check_connection, $ionicSideMenuDelegate, AuthService, appdata, getProducts, UtilitySrv, $translate) {


  $ionicPlatform.ready(function () {



    //overwrite localstorage set/get
    Storage.prototype.setObject = function (key, value) {
      this.setItem(key, JSON.stringify(value));
    }

    Storage.prototype.getObject = function (key) {
      var value = this.getItem(key);
      return value && JSON.parse(value);
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);


      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }


    if (typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function (language) {
        $translate.use((language.value).split("-")[0]).then(function (data) {
          console.log("switched to " + data);
        }, function (error) {
          console.log("language ERROR -> " + error);
        });
      }, null);
    }

    $ionicSideMenuDelegate.canDragContent(false);
  });

})

.config(function ($stateProvider, $ionicConfigProvider, $urlRouterProvider, $translateProvider, $compileProvider, $httpProvider, tmhDynamicLocaleProvider) {



  $translateProvider.useStaticFilesLoader({
    prefix: 'resources/',
    suffix: '.json'
  });

  $translateProvider.preferredLanguage("en");
  $translateProvider.fallbackLanguage("el");
  $translateProvider.useSanitizeValueStrategy('escape');

  //alex
  //$translate('back').then(function (t) {
  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  //});
  // console.log('bower_components/angular-i18n/angular-locale_{{locale}}.js');



  tmhDynamicLocaleProvider.localeLocationPattern('angular-i18n/angular-locale_{{locale}}.js');


  $stateProvider
    .state('mystatistics', {
      //cache: true,
      url: '/mystatistics',
      templateUrl: 'templates/Ordering/Statistics.html',
      controller: 'myStatisticsController'
    })

  $stateProvider
    .state('statistics', {
      //cache: true,
      url: '/statistics',
      templateUrl: 'templates/Sales/Statistics.html',
      controller: 'StatisticsController',
      params: {
        item: null
      }
    })

  $stateProvider
    .state('contactsStatistics', {
      //cache: true,
      url: '/contactstatistics',
      templateUrl: 'templates/Sales/Contacts/contactsStatistics.html',
      controller: 'contactsStatisticsController'
    })

  $stateProvider
    .state('mylocations', {
      //cache: true,
      url: '/mylocations',
      templateUrl: 'templates/Ordering/Locations.html',
      controller: 'MyLocationController'
    })

  $stateProvider
    .state('locations', {
      //cache: true,
      url: '/locations',
      templateUrl: 'templates/Sales/Locations.html',
      controller: 'locationController'
    })


  $stateProvider
    .state('companyContacts', {
      //cache: true,
      url: '/companyContact',
      templateUrl: 'templates/Sales/Contacts/contacts.html',
      controller: 'contactController'
    })

  $stateProvider
    .state('companyContact', {
      //cache: true,
      url: '/companyContact/current',
      templateUrl: 'templates/Sales/Contacts/contact.html',
      controller: 'currentContactController',
      params: {
        item: null
      }
    })

  $stateProvider
    .state('currentNews', {
      //cache: true,
      url: '/news/current',
      templateUrl: 'templates/Marketing/new.html',
      controller: 'currentNewController',
      params: {
        item: null
      }
    })

  $stateProvider
    .state('news', {
      //cache: true,
      url: '/news',
      templateUrl: 'templates/Marketing/news.html',
      controller: 'newsController'
    })

  $stateProvider
    .state('rewards', {
      //cache: true,
      url: '/rewards',
      templateUrl: 'templates/Marketing/rewards.html',
      controller: 'rewardController'
    })

  $stateProvider
    .state('companyNotes', {
      //cache: true,
      url: '/companyNotes',
      templateUrl: 'templates/Sales/notes.html',
      controller: 'noteController'
    })

  $stateProvider
    .state('toDoList', {
      //cache: true,
      url: '/toDoList',
      templateUrl: 'templates/Sales/todoList.html',
      controller: 'leadController'
    })

  $stateProvider
    .state('dailyActivity', {
      //cache: true,
      url: '/dailyActivity',
      templateUrl: 'templates/Sales/dailyActivity.html',
      controller: 'leadController'
    })

  $stateProvider
    .state('leads', {
      //cache: true,
      url: '/leads',
      templateUrl: 'templates/Sales/Leads/leads.html',
      controller: 'leadController'
    })

  $stateProvider
    .state('lead', {
      //cache: true,
      url: '/leads/current',
      templateUrl: 'templates/Sales/Leads/lead.html',
      controller: 'currentLeadController',
      params: {
        item: null
      }
    })


  $stateProvider
    .state('profile', {
      //cache: true,
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileCtrl'
    })


  $stateProvider
    .state('forgot-password_1', {
      //cache: true,
      url: '/forgot_password_1',
      templateUrl: 'templates/forgot_password_step_1.html',
      controller: 'ForgotCtrl'
    })

  $stateProvider
    .state('tutorial', {
      //cache: true,
      url: '/tutorial',
      templateUrl: 'templates/tutorial.html',
      controller: 'TutorialCtrl'
    })

  $stateProvider
    .state('settings', {
      //cache: true,
      url: '/app/settings',
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })

  $stateProvider
    .state('cat_1', {
      //cache: true,
      url: '/app/store_cat_1'


      ,
      templateUrl: 'templates/store_cat_1.html',
      controller: 'cat_1_Ctrl'
    })

  $stateProvider
    .state('cat_2', {
      //cache: true,
      url: '/app/store_cat_2/:aId'


      ,
      templateUrl: 'templates/store_cat_2.html',
      controller: 'cat_2_Ctrl'



    })

  $stateProvider
    .state('cat_3', {
      //cache: true,
      url: '/app/store_cat_3/:aId'


      ,
      templateUrl: 'templates/store_cat_3.html',
      controller: 'cat_3_Ctrl'



    })

  $stateProvider
    .state('products', {
      //cache: true,
      url: '/app/product-list-of-brands/:bId/:aId'


      ,
      templateUrl: 'templates/product-list-of-brands.html',
      controller: 'product_list_of_brands_Ctrl'



    })

  $stateProvider
    .state('dashboard', {
      // cache: false,
      url: '/app/dashboard'


      ,
      templateUrl: 'templates/dashboard.html',
      controller: 'dashboardCtrl'



    })

  $stateProvider
    .state('feedback', {
      url: '/app/feedback',
      templateUrl: 'templates/feedback.html',



    })

  $stateProvider
    .state('contact', {
      url: '/app/contact',
      templateUrl: 'templates/contact.html',


    })

  $stateProvider
    .state('history', {
      url: '/app/history'


      ,
      templateUrl: 'templates/history.html'



    })

  $stateProvider
    .state('results', {
      url: '/app/results/:aId'


      ,
      templateUrl: 'templates/searchResults.html'



    })

  $stateProvider
    .state('favourites', {
      // cache: false,
      url: '/favourites'



      ,
      abstract: true,

      templateUrl: 'templates/favourites.html'



    })

  $stateProvider
    .state('favourites.orders', {
      url: '/orders',


      views: {
        'orders': {
          templateUrl: 'templates/favourite-orders.html'

        }
      }

    })

  $stateProvider
    .state('favourites.products', {
      url: '/products',
      views: {

        'products': {
          templateUrl: 'templates/favourite-products.html'
        }
      }
    })

  $stateProvider
    .state('details', {
      url: '/app/products/:aId',
      templateUrl: 'templates/detail.html',
      controller: "DetailedController"
    })

  $stateProvider
    .state('checkOut', {
      url: '/app/checkout',
      templateUrl: 'templates/checkout.html',
      controller: 'CheckOutCtrl'

    })

  $stateProvider
    .state('reqProduct', {
      url: '/app/reqProduct',
      templateUrl: 'templates/reqProduct.html'
        //                ,controller: 'reqProductCtrl'
    })

  $stateProvider
    .state('notifications', {
      url: '/app/notifications',
      params: {
        obj: null
      },
      templateUrl: 'templates/notifications.html',
      controller: 'notifCtrl'

    })

  $stateProvider
    .state('signUp', {
      url: '/user/signUp',
      templateUrl: 'templates/sign-up.html',
      controller: 'SignUpCtrl'
    })

  $stateProvider
    .state('sign-in', {
      cache: false,
      url: '/user/signin',
      templateUrl: 'templates/sign-in.html',
      controller: "LoginCtrl"
    })

  $stateProvider
    .state('construction', {
      cache: false,
      url: '/app/construction',
      templateUrl: 'templates/under_construction.html'
    })

  $urlRouterProvider.otherwise('user/signin');
  $httpProvider.interceptors.push('AuthInterceptor');
})

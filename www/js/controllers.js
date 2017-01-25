angular.module('drinkMe')
  //not needed controller
  //uses authservice to check if user already logged in
  .controller('AppCtrl', function ($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
    // console.log("In the app controller");
    $scope.username = AuthService.username();

    $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
      var alertPopup = $ionicPopup.alert({
        title: 'Unauthorized!',
        template: 'You are not allowed to access this resource.'
      });
    });

    $scope.$on(AUTH_EVENTS.notAuthenticated, function (event) {
      AuthService.logout();
      $state.go('login');
      var alertPopup = $ionicPopup.alert({
        title: 'Session Lost!',
        template: 'Sorry, You have to login again.'
      });
    });

    $scope.setCurrentUsername = function (name) {
      $scope.username = name;
    };
  })

.controller('contactsStatisticsController', function ($scope, $http,$state,$stateParams, $ionicPopup, $translate) {
  $scope.Contacts = [];

  $scope.loadLeads = function () {

    $http.get('resources/leadsSource.json')
      .success(function (data, status, headers, config) {
        $scope.Contacts = data.contacts;
      })
      .error(function (data, status, headers, config) {
        console.log(status);
      });
  }

  $scope.contactClicked = function (lead) {
    $state.go('statistics', {
      item: lead
    });
  }

  $scope.loadLeads();

})

.controller('StatisticsController', function ($scope, $http, $state,$stateParams, $ionicPopup, $translate) {
  $scope.$on('$ionicView.beforeEnter', function (event, data) {

    $scope.activeContact = $stateParams.item;

  });

})

.controller('myStatisticsController', function ($scope, $http, $ionicLoading, $ionicPopup, $translate) {
  $scope.company = {};
  $scope.loadMyCompany = function () {

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http.get('resources/myCompany.json')
      .success(function (data, status, headers, config) {
        $scope.company = data.myCompany;
        $ionicLoading.hide();
      })
      .error(function (data, status, headers, config) {
        console.log(status);
        $ionicLoading.hide();
      });
  }

  $scope.loadMyCompany();
})



.controller('MyLocationController', function ($scope, $http, $state, $ionicLoading, $translate) {

  var bounds = new google.maps.LatLngBounds(); // for best zoom on init
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(48.7791878, 9.107176),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.markers = [];
  $scope.leads = [];
  $scope.contacts = [];
  $scope.company = [];
  var map;


  $scope.loadLeads = function () {

    $http.get('resources/leadsSource.json')
      .success(function (data, status, headers, config) {
        $scope.leads = data.leads;
        $scope.contacts = data.contacts;
        // $scope.init();
      })
      .error(function (data, status, headers, config) {
        console.log(status);
      });
  }

  $scope.loadMyCompany = function () {

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    $http.get('resources/myCompany.json')
      .success(function (data, status, headers, config) {
        $scope.company = data.myCompany;
        $ionicLoading.hide();
      })
      .error(function (data, status, headers, config) {
        console.log(status);
        $ionicLoading.hide();
      });
  }

  $scope.Reset = function () {
    LoadMarkers();
    MakeMovingMarkers();
  }

  var MakeMovingMarkers = function () {
    $scope.markers.forEach(function (element) {
      element.setDuration(20000);
    })

    $scope.markers[1].setPosition($scope.markers[0].getPosition());
    $scope.markers[2].setPosition($scope.markers[1].getPosition());
    $scope.markers[3].setPosition($scope.markers[2].getPosition());

  }

  var createMarker = function (info, color) {
    var col;
    var content;
    if (color == 0) {
      content = "<strong>" + info.company + "</strong></br>" + info.ceo;
      col = "img/myhome.png";
    } else if (color == 1) {
      content = "<strong>" + info.name + "</strong>";
      col = "img/truck.png"
    }
    var marker = new SlidingMarker({
      position: new google.maps.LatLng(info.lat, info.lng),
      map: map,
      animation: google.maps.Animation.DROP,
      icon: col
    });


    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    infowindow.open(map, marker);
    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });
    bounds.extend(marker.getPosition());
    $scope.markers.push(marker);
  };

  var DeleteMarkers = function () {
    //Loop through all the markers and remove
    var i = 0;
    for (i; i < $scope.markers.length; i++) {
      $scope.markers[i].setMap(null);
    }
    $scope.markers = [];
  };

  var LoadMarkers = function () {

    DeleteMarkers();
    createMarker($scope.company, 0);
    $scope.company.salespersons.forEach(function (element) {
      createMarker(element, 1);
    });

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(map.getZoom() - 1);
    if (map.getZoom() > 15) {
      map.setZoom(15);
    }
    if ($scope.markers.length == 1) {
      map.setMaxZoom(15);
      map.fitBounds(bounds);
      map.setMaxZoom(null)
    }
  };

  $scope.init = function () {
    map = new google.maps.Map(document.getElementById("map2"), mapOptions);
    var legend = document.getElementById("legend2");
    var div = document.createElement('div');
    div.innerHTML = '<img src="img/myhome.png"> ' + $translate.instant("my_company");
    legend.appendChild(div);
    var div = document.createElement('div');
    div.innerHTML = '<img src="img/truck.png"> ' + $translate.instant("my_salespersons");
    legend.appendChild(div);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);
    google.maps.event.addListenerOnce(map, 'idle', function () {
      LoadMarkers();
      MakeMovingMarkers();
    });

  };

  // $scope.loadLeads();
  $scope.loadMyCompany();
  $scope.init();



})

.controller('locationController', function ($scope, $http, $ionicLoading, $translate) {

  var bounds = new google.maps.LatLngBounds(); // for best zoom on init
  var mapOptions = {
    zoom: 7,
    center: new google.maps.LatLng(48.7791878, 9.107176),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.markers = [];
  $scope.leads = [];
  $scope.contacts = [];
  var map;


  $scope.loadLeads = function () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
    $http.get('resources/leadsSource.json')
      .success(function (data, status, headers, config) {
        $scope.leads = data.leads;
        $scope.contacts = data.contacts;
        $ionicLoading.hide();

      })
      .error(function (data, status, headers, config) {
        console.log(status);
        $ionicLoading.hide();

      });
  }

  var LoadMarkers = function () {
    $scope.leads.forEach(function (element) {
      createMarker(element, 0);
    });
    $scope.contacts.forEach(function (element) {
      createMarker(element, 1);
    });

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
    map.setZoom(map.getZoom());
    if (map.getZoom() > 15) {
      map.setZoom(15);
    }
    if ($scope.markers.length == 1) {
      map.setMaxZoom(15);
      map.fitBounds(bounds);
      map.setMaxZoom(null)
    }
  };

  var createMarker = function (info, color) {
    var col;
    var content;
    if (color == 0) {
      content = info.company
      col = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    } else if (color == 1) {
      content = info.company
      col = "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
    } else if (color == 2) {
      content = $translate.instant("mylocation");
      col = "img/truck.png";
    }

    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(info.lat, info.lng),
      map: map,
      animation: google.maps.Animation.DROP,
      icon: col
    });

    var infowindow = new google.maps.InfoWindow({
      content: content
    });

    infowindow.open(map, marker);
    marker.addListener('click', function () {
      infowindow.open(map, marker);
    });
    bounds.extend(marker.getPosition());
    $scope.markers.push(marker);
  };

  var DeleteMarkers = function () {
    //Loop through all the markers and remove
    var i = 0;
    for (i; i < $scope.markers.length; i++) {
      $scope.markers[i].setMap(null);
    }
    $scope.markers = [];
  };

  var LoadMyPath = function () {
    var flightPlanCoordinates = [{
      lat: 48.783066, 
      lng: 9.187970
    }, {
      lat: 48.786225,
      lng: 9.189977
    }, {
      lat: 48.787073,
      lng: 9.189387
    }, {
      lat: 48.790289,
      lng: 9.193689
    }];

    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
    createMarker(flightPlanCoordinates[3], 2);

  }

  $scope.init = function () {

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var legend = document.getElementById("legend");
    var div = document.createElement('div');
    div.innerHTML = '<img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"> ' + $translate.instant("sidebar_sales_leads");
    legend.appendChild(div);
    var div = document.createElement('div');
    div.innerHTML = '<img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"> ' + $translate.instant("sidebar_sales_customers");
    legend.appendChild(div);
    var div = document.createElement('div');
    div.innerHTML = '<img src="img/truck.png"> ' + $translate.instant("mylocation");
    legend.appendChild(div);
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(legend);

    google.maps.event.addListenerOnce(map, 'idle', function () {
      LoadMarkers();
    });
  }

  $scope.loadLeads();
  $scope.init();
  LoadMyPath();


})

.controller('currentContactController', function ($scope, $http, $state, $ionicModal, $ionicActionSheet, $ionicPopup, $translate, $stateParams, $ionicScrollDelegate, $filter) {

  $scope.newActivityModal = {};
  $scope.newNoteModal = {};
  

  $scope.toggleGroup = function (item) {
    if ($scope.isGroupShown(item)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = item;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.isGroupShown = function (item) {
    return $scope.shownGroup === item;
  };

  $ionicModal.fromTemplateUrl('templates/Sales/Leads/createNewActivity.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newActivityModal = modal;
  });
  $ionicModal.fromTemplateUrl('templates/Sales/addNote.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newNoteModal = modal;
  });

  $scope.show = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: $translate.instant("activity") },
       { text: $translate.instant("notes") }
     ],
     cancelText: $translate.instant("cancel"),
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       if(index == 0)
        $scope.addActivityClicked();
       else
        $scope.addNoteClicked();
        return true;
     }
   });
 };

 $scope.addNoteClicked = function () {
    $scope.Note = {};
    $scope.Note.company = $scope.activeContact.company;
    $scope.newNoteModal.show();
  }

  $scope.SaveNote = function () {
    $scope.activeContact.notes.push($scope.Note);
    var tmp = window.localStorage.getObject("contacts");
    tmp[$scope.activeContact.id] = $scope.activeContact;
    window.localStorage.setObject("contacts", tmp);
    $scope.Note = {};
    $scope.closeModal();
  }

  $scope.addActivityClicked = function () {
    $scope.tmp = {
      "status": "0"
    };
    $scope.newActivityModal.show();
  }

  $scope.addItem = function (item) {
    $scope.activeContact.activities.push(item);
    var tmp = window.localStorage.getObject("contacts");
    tmp[$scope.activeContact.id] = $scope.activeContact;
    window.localStorage.setObject("contacts", tmp);
    $scope.closeModal();
  }

  $scope.ActivityClicked = function (index) {
    if (!$scope.activeContact.activities[index].next_step_completed) {
      $ionicPopup.confirm({
          title: $translate.instant("warning"),
          template: $translate.instant("todo_complete"),
          cssClass: 'confirm-popup',
          okType: 'button-dark',
          buttons: [{
            text: $translate.instant('cancel')
          }, {
            text: $translate.instant('ok'),
            onTap: function (e) {
              return e;
            }
          }]
        })
        .then(function (res) {

          if (res) {
            $scope.activeContact.activities[index].next_step_completed = !$scope.activeContact.activities[index].next_step_completed;
          }
        })
    } else
      $scope.activeContact.activities[index].next_step_completed = !$scope.activeContact.activities[index].next_step_completed;

  }

  $scope.SendMessage = function (number) {

  }

  $scope.CallPhone = function (number) {

  }

  $scope.closeModal = function () {
    $scope.newActivityModal.hide();
    $scope.newNoteModal.hide();
  }

  $scope.$on('$ionicView.beforeEnter', function (event, data) {

    $scope.activeContact = $stateParams.item;

  });



})

.controller('contactController', function ($scope, $http, $state, $ionicModal, $ionicPopup, $translate, $stateParams, $filter) {

  $scope.Contacts = [];
  $scope.newLeadModal = {};
  $scope.today = $filter('parseDate')(new Date());
  $ionicModal.fromTemplateUrl('templates/Sales/Contacts/createNewContact.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newLeadModal = modal;
  });

  $scope.ToDoClicked = function (index) {
    $ionicPopup.confirm({
        title: $translate.instant("warning"),
        template: $translate.instant("todo_complete"),
        cssClass: 'confirm-popup',
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          onTap: function (e) {
            return e;
          }
        }]
      })
      .then(function (res) {

        if (res) {
          $scope.toDoList[index].next_step_completed = !$scope.toDoList[index].next_step_completed;
          $scope.toDoList.splice(index, 1);
        }


      })

  }

  $scope.loadLeads = function () {

    if(window.localStorage.getItem("contacts") === null){
      $http.get('resources/leadsSource.json')
        .success(function (data, status, headers, config) {
          $scope.Contacts = data.contacts;
          window.localStorage.setObject("contacts", $scope.Contacts);
        })
        .error(function (data, status, headers, config) {
          console.log(status);
        });
    }
    else
    {
      $scope.Contacts = window.localStorage.getObject("contacts");
      console.log("local")
    }
  }


  $scope.RemoveClicked = function (index) {
    $ionicPopup.confirm({
        title: $translate.instant("warning"),
        template: $translate.instant("remove_contact"),
        cssClass: 'confirm-popup',
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          onTap: function (e) {
            return e;
          }
        }]
      })
      .then(function (res) {

        if (res) {
          $scope.Contacts.splice(index, 1);
          window.localStorage.setObject("contacts", $scope.Contacts);
        }


      })
  }

  $scope.addContactClicked = function (item, index) {
    if (item != undefined) //edit
    {
      $scope.tmp = item;
      $scope.tmp.index = index;
      $scope.flagEdit = true;
      $scope.newLeadModal.show();
    } else //new
    {
      $scope.tmp = {};
      $scope.flagEdit = false;
      $scope.newLeadModal.show();
    }
  }

  $scope.addItem = function (item, index) {
    if (index != undefined) {
      $scope.Contacts.splice(index, 1);
      $scope.Contacts.push(item);
    } else {
      item.notes = [];
      item.activities = [];
      $scope.Contacts.push(item);
    }
    window.localStorage.setObject("contacts", $scope.Contacts);
    $scope.closeModal();
  }

  $scope.contactClicked = function (lead, index) {
    lead.id = index;
    $state.go('companyContact', {
      item: lead
    });
  }

  $scope.closeModal = function () {
    $scope.tmp = {};
    $scope.newLeadModal.hide();
  }

  $scope.loadLeads();

})

.controller('currentNewController', function ($scope, $http, $ionicPopup, $state, $stateParams, $translate) {

  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    console.log($stateParams.item)
    $scope.activeNew = $stateParams.item;
  });

})

.controller('newsController', function ($scope, $http, $state, $ionicPopup, $translate) {

  $scope.News = [{
    "url": "mystery.jpg",
    "date": "2016/12/1",
    "text": "Breaking News!! A new product is coming next week!"
  }, {
    "url": "merge.jpg",
    "date": "2016/11/17",
    "text": "We are happy to inform you about a company merge that is about to happen."
  }, {
    "url": "survey.jpg",
    "date": "2016/11/2",
    "text": "Our survey has showed that our employee satisfaction level is above average!"
  }, {
    "url": "christmas.jpeg",
    "date": "2016/10/30",
    "text": "Christmas Special Event! Do you work for us? Then come get your Christmas present! Don't work for us? Send us your resume!"
  }];

  $scope.newClicked = function (item) {
    $state.go('currentNews', {
      item: item
    });
  }

})

.controller('rewardController', function ($scope, $http, $ionicPopup, $translate) {
  $scope.Reward = {};

  $scope.SendMsg = function () {
    console.log("send!");
    $scope.Reward = {};
    $ionicPopup.alert({
      title: $translate.instant('resp')
    });
  }

})

.controller('noteController', function ($scope, $ionicModal, $http, $ionicPopup, $translate) {
  $scope.Leads = [];
  $scope.Contacts = [];
  $scope.Note = {};
  $scope.Notes = [];
  $scope.newNoteModal = {};
  $ionicModal.fromTemplateUrl('templates/Sales/addNote.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newNoteModal = modal;
  });

  $scope.RemoveNote = function (index) {
    $scope.Notes.splice(index,1);
  }

  $scope.loadLeads = function () {
    if(window.localStorage.getItem("leads") === null){
    $http.get('resources/leadsSource.json')
      .success(function (data, status, headers, config) {
        $scope.Leads = data.leads;
      })
      .error(function (data, status, headers, config) {
        console.log(status);
      });
    }
    else
    {
      $scope.Leads = window.localStorage.getObject("leads");
    }

  if(window.localStorage.getItem("contacts") === null){
      $http.get('resources/leadsSource.json')
        .success(function (data, status, headers, config) {
          $scope.Contacts = data.contacts;
        })
        .error(function (data, status, headers, config) {
          console.log(status);
        });
      }
      else
      {
        $scope.Contacts = window.localStorage.getObject("contacts");
      }
  }

  $scope.loadNotes = function () {
    angular.forEach($scope.Leads, function (val, key) {
          if(val.notes.length>0){
            angular.forEach(val.notes, function (val2, key) {
              $scope.Notes.push({"company": val.company, "message": val2.message});
            })
          }
        })

        angular.forEach($scope.Contacts, function (val, key) {
          if(val.notes.length>0){
            angular.forEach(val.notes, function (val2, key) {
              $scope.Notes.push({"company": val.company, "message": val2.message});
            })
          }
        })

        console.log($scope.Notes)
    
  }

  $scope.addNoteClicked = function () {
    $scope.newNoteModal.show();

  }

  $scope.SaveNote = function () {
    console.log("saved!");
    $scope.Notes.push($scope.Note);
    $scope.Note = {};
    $scope.closeModal();
  }

  $scope.closeModal = function () {
    $scope.newNoteModal.hide();
  }
  
  $scope.$on('$ionicView.beforeEnter', function (event, data) {

    $scope.loadLeads();
    $scope.Notes = [];
    $scope.loadNotes();

  });


})

.controller('currentLeadController', function ($scope, $http, $state, $ionicModal, $ionicActionSheet, $ionicPopup, $translate, $stateParams, $ionicScrollDelegate, $filter) {
  $scope.newNoteModal = {};
  $scope.newActivityModal = {};

  $scope.toggleGroup = function (item) {
    if ($scope.isGroupShown(item)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = item;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.isGroupShown = function (item) {
    return $scope.shownGroup === item;
  };

  $ionicModal.fromTemplateUrl('templates/Sales/Leads/createNewActivity.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newActivityModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/Sales/addNote.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newNoteModal = modal;
  });

  $scope.show = function() {

   // Show the action sheet
   var hideSheet = $ionicActionSheet.show({
     buttons: [
       { text: $translate.instant("activity") },
       { text: $translate.instant("notes") }
     ],
     cancelText: $translate.instant("cancel"),
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
       if(index == 0)
        $scope.addActivityClicked();
       else
        $scope.addNoteClicked();
        return true;
     }
   });
 };

 $scope.addNoteClicked = function () {
    $scope.Note = {};
    $scope.Note.company = $scope.activeLead.company;
    $scope.newNoteModal.show();
  }

  $scope.SaveNote = function () {
    $scope.activeLead.notes.push($scope.Note);
    $scope.Note = {};
    var tmp = window.localStorage.getObject("leads");
    tmp[$scope.activeLead.id] = $scope.activeLead;
    window.localStorage.setObject("leads", tmp);
    $scope.closeModal();
  }

  $scope.addActivityClicked = function () {
    $scope.tmp = {
      "status": "0"
    };
    $scope.newActivityModal.show();
  }

  $scope.addItem = function (item) {
    $scope.activeLead.activities.push(item);
    var tmp = window.localStorage.getObject("leads");
    tmp[$scope.activeLead.id] = $scope.activeLead;
    window.localStorage.setObject("leads", tmp);
    $scope.closeModal();
  }

  $scope.ActivityClicked = function (index) {
    if (!$scope.activeLead.activities[index].next_step_completed) {
      $ionicPopup.confirm({
          title: $translate.instant("warning"),
          template: $translate.instant("todo_complete"),
          cssClass: 'confirm-popup',
          okType: 'button-dark',
          buttons: [{
            text: $translate.instant('cancel')
          }, {
            text: $translate.instant('ok'),
            onTap: function (e) {
              return e;
            }
          }]
        })
        .then(function (res) {

          if (res) {
            $scope.activeLead.activities[index].next_step_completed = !$scope.activeLead.activities[index].next_step_completed;
          }
        })
    } else
      $scope.activeLead.activities[index].next_step_completed = !$scope.activeLead.activities[index].next_step_completed;
  }

  $scope.SendMessage = function (number) {

  }

  $scope.CallPhone = function (number) {

  }

  $scope.ToDoClicked = function (index) {

  }

  $scope.closeModal = function () {
    $scope.newActivityModal.hide();
    $scope.newNoteModal.hide();
  }

  $scope.$on('$ionicView.beforeEnter', function (event, data) {

    $scope.activeLead = $stateParams.item;

  });



})

.controller('leadController', function ($scope, $http, $state, $ionicModal, $ionicPopup, $translate, $stateParams, $filter) {

  $scope.Leads = [];
  $scope.newLeadModal = {};
  $scope.today = $filter('date')(new Date(), 'yyyy/MM/dd');
  $ionicModal.fromTemplateUrl('templates/Sales/Leads/createNewLead.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.newLeadModal = modal;
  });

  $scope.$watch(function (scope) {
      if ($scope.tmp != undefined)
        return $scope.tmp.status
    },
    function () {
      if ($scope.tmp != undefined) {
        if ($scope.tmp.status == 6) {
          $ionicPopup.confirm({
              title: $translate.instant("warning"),
              template: $translate.instant("lead2contact"),
              cssClass: 'confirm-popup',
              okType: 'button-dark',
              buttons: [{
                text: $translate.instant('cancel')
              }, {
                text: $translate.instant('ok'),
                onTap: function (e) {
                  return e;
                }
              }]
            })
            .then(function (res) {
              // call service
              console.log("delete!")
            })
        }
      }
    }
  );


  $scope.ActivityClicked = function (index) {
    if (!$scope.dailyActivities[index].next_step_completed) {
      $ionicPopup.confirm({
          title: $translate.instant("warning"),
          template: $translate.instant("todo_complete"),
          cssClass: 'confirm-popup',
          okType: 'button-dark',
          buttons: [{
            text: $translate.instant('cancel')
          }, {
            text: $translate.instant('ok'),
            onTap: function (e) {
              return e;
            }
          }]
        })
        .then(function (res) {

          if (res) {
            $scope.dailyActivities[index].next_step_completed = !$scope.dailyActivities[index].next_step_completed;
          }
        })
    } else
      $scope.dailyActivities[index].next_step_completed = !$scope.dailyActivities[index].next_step_completed;
  }

  $scope.ToDoClicked = function (index) {
    if (!$scope.toDoList[index].next_step_completed) {
      $ionicPopup.confirm({
          title: $translate.instant("warning"),
          template: $translate.instant("todo_complete"),
          cssClass: 'confirm-popup',
          okType: 'button-dark',
          buttons: [{
            text: $translate.instant('cancel')
          }, {
            text: $translate.instant('ok'),
            onTap: function (e) {
              return e;
            }
          }]
        })
        .then(function (res) {

          if (res) {
            $scope.toDoList[index].next_step_completed = !$scope.toDoList[index].next_step_completed;
            $scope.toDoList.splice(index, 1);
          }
        })
    } else
      $scope.toDoList[index].next_step_completed = !$scope.toDoList[index].next_step_completed;
  }



  $scope.RemoveClicked = function (index) {
    $ionicPopup.confirm({
        title: $translate.instant("warning"),
        template: $translate.instant("remove_lead"),
        cssClass: 'confirm-popup',
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          onTap: function (e) {
            return e;
          }
        }]
      })
      .then(function (res) {

        if (res) {
          $scope.Leads.splice(index, 1);
          window.localStorage.setObject("leads", $scope.Leads);
        }


      })
  }

  $scope.loadLeads = function () {

  if(window.localStorage.getItem("leads") === null){
      $http.get('resources/leadsSource.json')
        .success(function (data, status, headers, config) {
          $scope.Leads = data.leads;
          $scope.dailyActivities = [];
          $scope.toDoList = [];
          angular.forEach(data.leads, function (val, key) {
            angular.forEach(val.activities, function (val2, key) {
              if (val2.date == $scope.today) {
                var tmp = val2;
                tmp.name = val.name;
                tmp.company = val.company;
                $scope.dailyActivities.push(tmp);
              }
              if (!val2.next_step_completed) {
                var tmp = val2;
                tmp.name = val.name;
                tmp.company = val.company;
                $scope.toDoList.push(tmp);
              }
            });

          });
          angular.forEach(data.contacts, function (val, key) {
            angular.forEach(val.activities, function (val2, key) {
              if (val2.date == $scope.today) {
                var tmp = val2;
                tmp.name = val.name;
                tmp.company = val.company;
                $scope.dailyActivities.push(tmp);
              }
              if (!val2.next_step_completed) {
                var tmp = val2;
                tmp.name = val.name;
                tmp.company = val.company;
                $scope.toDoList.push(tmp);
              }
            });

          });
          window.localStorage.setObject("leads", $scope.Leads);
        })
        .error(function (data, status, headers, config) {
          console.log(status);
        });

    }
    else
    {
      $scope.Leads = window.localStorage.getObject("leads");
    }
}


  $scope.addLeadClicked = function (item, index) {
    if (item != undefined) //edit
    {
      $scope.tmp = item;
      $scope.tmp.index = index;
      $scope.flagEdit = true;
      $scope.newLeadModal.show();
    } else //new
    {
      $scope.tmp = {};
      $scope.flagEdit = false;
      $scope.newLeadModal.show();
    }
  }

  $scope.addItem = function (item, index) {
    if (index != undefined) {
      $scope.Leads.splice(index, 1);
      $scope.Leads.push(item);
    } else {
      item.notes = [];
      item.activities = [];
      $scope.Leads.push(item);
    }
    window.localStorage.setObject("leads", $scope.Leads);
    $scope.closeModal();
  }

  $scope.leadClicked = function (lead,index) {
    lead.id = index;
    $state.go('lead', {
      item: lead
    });
  }

  $scope.closeModal = function () {
    $scope.tmp = {};
    $scope.newLeadModal.hide();
  }

  $scope.loadLeads();


})

.controller('dashboardCtrl', function ($scope, $http, $ionicHistory, $ionicLoading, AuthService, UtilitySrv, handleFavouriteProduct, getProducts, appdata) {




  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    dash_products = [];
    $scope.ft_products = appdata.get_dash_products();


    for (var i = 0; i < $scope.ft_products.length; i++) {
      dash_products = dash_products.concat($scope.ft_products[i].products);
      $scope.ft_products[i].products = UtilitySrv.syncProducts($scope.ft_products[i].products, appdata.get_checkout_products());
    }

    dash_products = UtilitySrv.syncProducts(dash_products, appdata.get_checkout_products());

    appdata.set_current_products(dash_products);


  });


  $scope.handleFavourite = function (parent_index, index, isFavourite, id) {

    console.log(parent_index, index, isFavourite, id);

    if (isFavourite) {

      handleFavouriteProduct.subFavouriteProduct(id).then(function () {
        $scope.ft_products[parent_index].products[index].pfav = 0;
        appdata.remove_favourite_product(id);

      }, function () {
        console.log("error on sub fav");
      });
    } else {

      handleFavouriteProduct.addFavouriteProduct(id).then(function () {
        $scope.ft_products[parent_index].products[index].pfav = 1;
        appdata.add_favourite_product($scope.ft_products[parent_index].products[index]);

      }, function () {
        console.log("error on add fav");
      });

    }

    appdata.set_dash_products($scope.ft_products);

    for (i = 0; i < $scope.ft_products.length; i++) {
      dash_products = dash_products.concat($scope.ft_products[i].products);
    }
    dash_products = UtilitySrv.syncProducts(dash_products, appdata.get_checkout_products());

    appdata.set_current_products(dash_products);

  };


})

.controller('CheckOutCtrl', function ($scope, $state, getProducts, $http, $ionicModal, $timeout, $translate, checkOutSrv, $ionicHistory, $ionicLoading, $ionicPopup, appdata, AuthService) {

  $scope.order = {
    "products": "",
    "rproducts": "",
    "msg": ""
  }

  $ionicModal.fromTemplateUrl('templates/chooseAddress.html', {
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.addressModal = modal;
  });


  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    firsttime = true;
    $scope.order.products = appdata.get_checkout_products();
    $scope.order.rproducts = appdata.get_requestProducts();
    $scope.total = Number(appdata.get_total());
    data.enableBack = true;
  })


  $scope.clearCart = function (e) {

    if (e) {
      $ionicPopup.confirm({
          title: $translate.instant("warning"),
          template: $translate.instant("empty_cart"),
          cssClass: 'confirm-popup',
          okType: 'button-dark',
          buttons: [{
            text: $translate.instant('cancel')
          }, {
            text: $translate.instant('ok'),
            onTap: function (e) {
              return e;
            }
          }]
        })
        .then(function (res) {

          if (res) {
            appdata.set_checkout_products([]);
            appdata.set_total(0);
            appdata.set_totalcost(0);
            appdata.set_requestProducts([]);
            $scope.order.products = [];
            $scope.data.totalPrice = 0;
            $scope.order.msg = '';
            $state.go('dashboard');
            $scope.data.ck_length = appdata.get_checkout_products();
            $scope.data.ck_length2 = appdata.get_requestProducts();
          }
        })

    } else {
      appdata.set_checkout_products([]);
      appdata.set_total(0);
      appdata.set_totalcost(0);
      appdata.set_requestProducts([]);
      $scope.order.products = [];
      $scope.data.totalPrice = 0;
      $scope.order.msg = '';
      $state.go('dashboard');
      $scope.data.ck_length = appdata.get_checkout_products();
      $scope.data.ck_length2 = appdata.get_requestProducts();

    }
  };

  $scope.removeFromCart = function (id, index) {

    $ionicPopup.confirm({
        title: $translate.instant("warning"),
        template: $translate.instant("remove_product"),
        cssClass: 'confirm-popup',
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          onTap: function (e) {
            return e;
          }
        }]
      })
      .then(function (res) {

        if (res) {
          if (id != -2) {
            $scope.data.totalPrice -= ($scope.order.products[index].quantity * $scope.order.products[index].pprice * (1 - ($scope.order.products[index].pdiscount * 0.01)));
            $scope.order.products[index].quantity = 0;
            $scope.order.products.splice(index, 1);
            appdata.set_checkout_products($scope.order.products);
          }

          //It's a request product
          else {
            $scope.order.rproducts[index].quantity = 0;
            $scope.order.rproducts.splice(index, 1);
          }
        }


      })






  }

  $scope.changeQuantity = function (id, index) {

    console.log("id: " + id);
    console.log("index: " + index);

    var myPopup = $ionicPopup.show({
      template: '<input id="qt-input" type="number" max="999" ng-model="data.q" autofocus>',
      title: $translate.instant('new_quantity'),
      subTitle: $translate.instant('max_value'),
      scope: $scope,
      buttons: [{
        text: $translate.instant('cancel')
      }, {
        text: $translate.instant('ok'),
        type: 'button-positive',
        onTap: function (e) {
          return $scope.data.q;
        }
      }]
    });

    myPopup.then(function (res) {

      var tmp;

      if (res === null || res === "" || res === 0) {
        console.log('Changed to zero ', res);
        //total price

        // It's not a request product
        if (id != -2) {
          $scope.data.totalPrice -= ($scope.order.products[index].quantity * $scope.order.products[index].pprice * (1 - ($scope.order.products[index].pdiscount * 0.01)));
          $scope.order.products[index].quantity = 0;
          $scope.order.products.splice(index, 1);
          appdata.set_checkout_products($scope.order.products);
        }

        //It's a request product
        else {
          $scope.order.rproducts[index].quantity = 0;
          $scope.order.rproducts.splice(index, 1);
        }


      } else if (res === undefined) {
        console.log('Canceled: ', res);
      } else if (res > 0) {

        if (id != -2) {
          tmp = $scope.order.products[index].quantity;
          $scope.order.products[index].quantity = res;

          if (res > tmp) {
            $scope.total += (res - tmp);
            $scope.data.totalPrice += ((res - tmp) * $scope.order.products[index].pprice * (1 - ($scope.order.products[index].pdiscount * 0.01)));
          } else if (res < tmp) {
            $scope.total -= (tmp - res);
            $scope.data.totalPrice -= ((tmp - res) * $scope.order.products[index].pprice * (1 - ($scope.order.products[index].pdiscount * 0.01)));
          }

          appdata.set_checkout_products($scope.order.products);

        } else {
          console.log('Changed to: ', res);
          $scope.order.rproducts[index].quantity = res;
        }

      }

      $state.reload();
      $scope.data.q = "";
    });

    //Autofocus the popup
    setTimeout(function () {
      document.getElementById("qt-input").focus();
    }, 350);


  };

  $scope.confirmed = function (add) {
    var tmp = '';
    if (add) {
      console.log(add.id)
      $scope.order.aid = add.id;
      tmp = add.uaddress;
    } else {
      tmp = $translate.instant('default_add');
    }



    $ionicPopup.confirm({
      title: tmp,
      content: $translate.instant('ordertext'),
      okType: 'button-dark',
      buttons: [{
        text: $translate.instant('cancel')
      }, {
        text: $translate.instant('ok'),
        onTap: function (e) {
          return e;
        }
      }]
    }).then(function (res) {
      if (res) {

        $scope.addressModal.hide();

        console.log($scope.order);
        checkOutSrv.sendOrder($scope.order).then(function (res) {
          console.log(res);
          var tmp_order = window.localStorage.getObject("user_orders");
          if (tmp_order !== null) {
            appdata.add_order(res);
          }
          $ionicPopup.alert({
            title: $translate.instant('ordersuc')
          }).then(function () {
            $scope.clearCart();
          });

        }, function () {
          $ionicPopup.alert({
            title: $scope.message = $translate.instant('orderfail')
          }).then(function () {
            $scope.clearCart();
          });
        })
      }
    })
  };

  $scope.checkOut = function () {
    //var stopped;
    //If there are products for checkout
    if ($scope.order.products.length > 0 || $scope.order.rproducts.length > 0) {
      //here popup!

      getProducts.get_user_addresses()
        .then(function (res) {
          console.log(res)
          if (res.length !== 0) {
            $scope.addresses = res;
            $scope.addressModal.show();
          } else {
            $scope.confirmed();
          }

        }, function (res) {
          console.log("error");
        })

    }


  };
})

.controller("FavouriteProductsCtrl", function ($scope, $http, $state, UtilitySrv, $ionicLoading, handleFavouriteProduct, AuthService, appdata, getProducts) {

  var productIds = [];
  var favIds = [];

  $scope.checkout_products = [];
  $scope.fav_products = [];
  $scope.categories = appdata.get_categories();

  $scope.fav_products_init = function () {
    getProducts.get_user_favourites().then(function (fav) {
      $scope.fav_products = fav;
      appdata.set_current_products($scope.fav_products);
      $scope.fav_products = UtilitySrv.syncProducts($scope.fav_products, appdata.get_checkout_products());
      appdata.set_favourite_products($scope.fav_products);
      $ionicLoading.hide();


    }, function (error) {
      $ionicLoading.hide();
    })
  }

  $scope.$on('$ionicView.afterEnter', function (event, data) {
    if ((window.localStorage.getItem("favourite_products") === undefined) || (window.localStorage.getItem("favourite_products") === null)) {

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });


      getProducts.get_user_favourites().then(function (fav) {
        $scope.fav_products = fav;
        appdata.set_current_products($scope.fav_products);
        $scope.fav_products = UtilitySrv.syncProducts($scope.fav_products, appdata.get_checkout_products());
        appdata.set_favourite_products($scope.fav_products);
        $ionicLoading.hide();

      }, function (error) {
        $ionicLoading.hide();
      })
    } else {
      console.log("from local");
      $scope.fav_products = window.localStorage.getObject("favourite_products");
      $scope.fav_products = UtilitySrv.syncProducts($scope.fav_products, appdata.get_checkout_products());

    }

  });



  $scope.handleFavourite = function (rid, id) {

    handleFavouriteProduct.subFavouriteProduct(id).then(function () {
      $scope.fav_products.splice(rid, 1);
      appdata.set_favourite_products($scope.fav_products);
      appdata.set_current_products($scope.fav_products);


      appdata.syncFav(id, appdata.get_dash_products());


    }, function () {
      console.log("Failed to remove product from favorites");
    });

  };
})

.controller("FavouriteOrdersCtrl", function ($scope, $http, $state, $translate, $ionicPopup, checkOutViewProccesor, getProducts, $ionicLoading, handleFavouriteOrder, AuthService, appdata, UtilitySrv, $ionicScrollDelegate) {


  $scope.userFavOrders = [];
  $scope.orderType = '-odate';

  $scope.fav_init = function () {
    $scope.fav_products = [];
    $scope.categories = appdata.get_categories();
    $scope.checkout_products = appdata.get_checkout_products();

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });


    getProducts.get_user_favourites().then(function (fav) {
      $scope.fav_products = fav;
      appdata.set_current_products($scope.fav_products);
      $scope.fav_products = UtilitySrv.syncProducts($scope.fav_products, appdata.get_checkout_products());
      appdata.set_favourite_products($scope.fav_products);
      $ionicLoading.hide();

    }, function (error) {
      $ionicLoading.hide();
    })

  }

  $scope.toggleGroup = function (order) {
    if ($scope.isGroupShown(order)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = order;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.isGroupShown = function (order) {
    return $scope.shownGroup === order;
  };

  $scope.$on('$ionicView.afterEnter', function (event, data) {

    $scope.userFavOrders = [];


    if ((window.localStorage.getItem("favourite_orders") === undefined) || (window.localStorage.getItem("favourite_orders") === null)) {

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });
      getProducts.get_favourite_orders().then(function (fav) {
        $scope.userFavOrders = fav;
        appdata.set_favourite_orders($scope.userFavOrders);
        $ionicLoading.hide();

      }, function (error) {
        $ionicLoading.hide();
      })
    } else {
      console.log("from local");
      $scope.userFavOrders = window.localStorage.getObject("favourite_orders");

    }


  });


  $scope.favouriteCheckout = function (products, rproducts) {
    // checkOutViewProccesor.fromFavourites(products);
    // appdata.set_current_products(products);

    appdata.set_checkout_products(products);

    if (rproducts.length)
      appdata.set_requestProducts(rproducts);
    else
      appdata.set_requestProducts([]);



    function calcTotalPrice(products) {
      $scope.data.totalPrice = 0;
      var i;
      for (i = 0; i < products.length; i++) {
        $scope.data.totalPrice += products[i].quantity * (products[i].pprice * (1 - (products[i].pdiscount * 0.01)));
      }
    };

    calcTotalPrice(products);
    $scope.data.ck_length = appdata.get_checkout_products();
    $scope.data.ck_length2 = appdata.get_requestProducts();

    // $scope.data.totalPrice = appdata.get_totalcost();
    $state.go('checkOut');

  };

  $scope.subFromFavourites = function (index, orderId, ofav) {

    $ionicPopup.confirm({
      title: $translate.instant('removefavord'),
      content: $translate.instant('removefavtemplates'),
      okType: 'button-dark',
      buttons: [{
        text: $translate.instant('cancel')
      }, {
        text: $translate.instant('ok'),
        type: 'button-positive',
        onTap: function (e) {
          return e;
        }
      }]
    }).then(function (res) {

      if (res) {

        handleFavouriteOrder.handleOrder(orderId, 1).then(function () {
          $scope.userFavOrders.splice(index, 1);
          appdata.unfav_order(orderId);
          appdata.set_favourite_orders($scope.userFavOrders);
        }, function () {
          console.log("Couldn't remove it from favourites.")
        });


      }
    });
  }
})

.controller('HistoryCtrl', function ($scope, $http, load, $ionicScrollDelegate, checkOutViewProccesor, $state, $translate, handleFavouriteOrder, $ionicPopup, $ionicLoading, AuthService, appdata, UtilitySrv) {


  $scope.data.checkHistory = true;
  $scope.orderType = '-odate';


  $scope.$on('$ionicView.beforeEnter', function (event, data) {
    // uncomment when localStorage is ready
    if ($scope.data.checkHistory) {

      $ionicLoading.show({
        template: '<ion-spinner></ion-spinner>'
      });

      load.orders().then(function (res) {
        $scope.userOrders = res;
        appdata.set_userOrders($scope.userOrders);
        $ionicLoading.hide();
      }, function (res) {
        console.log("Something went wrong");
        $ionicLoading.hide();
      });
      $scope.data.checkHistory = false;

    } else {
      console.log("from local");
      $scope.userOrders = window.localStorage.getObject("user_orders");
    }
  });

  $scope.tmp = {};

  $scope.toggleGroup = function (order) {
    if ($scope.isGroupShown(order)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = order;
    }
    $ionicScrollDelegate.resize();
  };

  $scope.isGroupShown = function (order) {
    return $scope.shownGroup === order;
  };


  $scope.addToFavourites = function (orderId, isFavourite) {

    console.log("Initial isfavourite: " + isFavourite);

    //If it is favourite unfavourite. If it's not then favourite it.
    if (isFavourite == 0) {



      var myPopup = $ionicPopup.show({
        template: $translate.instant('ordertemplate') + '<input type="text" ng-model="tmp.q" autofocus>',
        title: $translate.instant('ordername'),
        scope: $scope,
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          type: 'button-positive',
          onTap: function (e) {
            return $scope.tmp.q;
          }
        }]
      });

      myPopup.then(function (res) {

        console.log("Result: " + res);


        if (res == null || res == '') {
          return;
        } else {

          handleFavouriteOrder.handleOrder(orderId, 0, res).then(function () {
            var index = UtilitySrv.getIndex($scope.userOrders, 'oid', orderId);
            $scope.userOrders[index].ofav = 1;
            $scope.userOrders[index].oname = res;
            appdata.set_userOrders($scope.userOrders);

            var tmp = window.localStorage.getObject("favourite_orders");

            if (tmp) {
              appdata.add_favourite_order($scope.userOrders[index]);
            }

          }, function () {
            console.log("Failed to make the order favourite");
          });


        }
      })

    } else {
      $ionicPopup.confirm({
        title: $translate.instant('removefavord'),
        content: $translate.instant('removefavtemplates'),
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          type: 'button-positive',
          onTap: function (e) {
            return e;
          }
        }]
      }).then(function (res) {

        if (res) {

          handleFavouriteOrder.handleOrder(orderId, 1).then(function () {
            var index = UtilitySrv.getIndex($scope.userOrders, 'oid', orderId);
            $scope.userOrders[index].ofav = 0;
            appdata.set_userOrders($scope.userOrders);
            appdata.remove_favourite_order($scope.userOrders[index]);
          }, function () {
            console.log("Failed to make the order favourite");
          });


        }
      });

    }

  }

  $scope.favouriteCheckout = function (products, rproducts) {
    checkOutViewProccesor.fromFavourites(products);
    // appdata.set_current_products(products);
    appdata.set_checkout_products(products);

    if (rproducts.length)
      appdata.set_requestProducts(rproducts);
    else
      appdata.set_requestProducts([]);

    function calcTotalPrice(products) {
      $scope.data.totalPrice = 0;
      var i;
      for (i = 0; i < products.length; i++) {
        $scope.data.totalPrice += products[i].quantity * (products[i].pprice * (1 - (products[i].pdiscount * 0.01)));
      }
    };

    calcTotalPrice(products);
    $scope.data.ck_length = appdata.get_checkout_products();
    $scope.data.ck_length2 = appdata.get_requestProducts();
    // $scope.data.totalPrice = appdata.get_totalcost();
    $state.go('checkOut');


  }



})

.controller('ContactCtrl', function ($scope, $translate, $ionicPopup, sendMsgSrv, $ionicLoading, AuthService) {

  $scope.contact = {
    "topic": '',
    "description": ''
  };

  //This service sends contact
  $scope.sendMsg = function () {
    sendMsgSrv.sendMsg($scope.contact).then(function () {
      $scope.contactList.$setPristine();
      $scope.contactList.$setUntouched();
      $scope.contact = {};
      $ionicPopup.alert({
        title: $translate.instant('resp')
      });

    }, function () {
      console.log("Failed to send msg.")
    });

  }


  //This service sends feedback
  $scope.sendFeedback = function () {
    sendMsgSrv.sendFeed($scope.contact).then(function () {
      console.log("Sent feedback");
      $scope.contactList.$setPristine();
      $scope.contactList.$setUntouched();
      $scope.contact = {};
      $ionicPopup.alert({
        title: $translate.instant('respfeed')
      });
    }, function () {
      console.log("Failed to send feedback.")
    });
  }

})

.controller('SignUpCtrl', function ($scope, $ionicPopup, $state, SignUpSrv, $ionicHistory, check_connection, $translate, LocationService) {

  $scope.isAdult = false;
  console.log("Is adult: " + $scope.isAdult);

   $scope.$on('$ionicView.beforeEnter', function (event, data) {
    $scope.user = {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      address: '',
      address_number: '',
      zip_code: '',
      userName: '',
      password: ''
    };

   })

  $scope.back = function () {
    $ionicHistory.goBack();
  }

  $scope.submit = function () {
    //kapsouras check for intenet
    //mobile only
    var ret = check_connection.check_net();
    console.log("Interne checking returned with " + ret);
    if (ret != 0) {
      //lili
      SignUpSrv.signUp($scope.user).then(function (response) {

        $ionicPopup.show({
          template: response.msg,
          title: response.title,
          buttons: [{
            text: $translate.instant('ok'),
            type: 'button-dark'
          }]
        })

        $state.go('sign-in');
        $scope.SignUpList.$setPristine();
        $scope.SignUpList.$setUntouched();
        $scope.user = {};

      }, function (response) {

        $ionicPopup.show({
          template: response.msg,
          title: response.title,
          buttons: [{
            text: $translate.instant('ok'),
            type: 'button-dark'
          }]
        })


      });

    }
  }

  $scope.choosePlace = function (place) {
    LocationService.getDetails(place.place_id).then(function (location) {
      var i = 0;
      var l = location.address_components.length;

      for (i; i < l; i++) {
        if (location.address_components[i].types[0] === 'street_number') {
          $scope.user.address_number = parseInt(location.address_components[i].short_name);
        }
        if (location.address_components[i].types[0] === 'postal_code') {
          $scope.user.zip_code = location.address_components[i].short_name;
        }
        if (location.address_components[i].types[0] === 'route') {
          $scope.user.address = location.address_components[i].short_name;
        }

      }
      $scope.close();
    });
  };

})


.controller('ProfileCtrl', function ($scope, $state, $ionicPopup, $translate, $ionicModal, $ionicLoading, getProducts, AuthService, LocationService) {

  $scope.addresses = [];

  $scope.$on("$ionicView.beforeEnter", function (event, data) {

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    getProducts.get_user_addresses()
      .then(function (res) {
        $scope.addresses = res;


      }, function (res) {
        console.log("error");
        $ionicLoading.hide();

      })

    getProducts.get_user_info()
      .then(function (response) {
        $ionicLoading.hide();
        $scope.data.user = response;

      }, function (err) {
        $ionicLoading.hide();
        console.log(err);
      })

  });






  $ionicModal.fromTemplateUrl('templates/newPassword.html', {
    id: '1',
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.passModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/newAddress.html', {
    id: '2',
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.addressModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/editAddress.html', {
    id: '3',
    backdropClickToClose: false,
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.editModal = modal;
  });


  $scope.openModal = function (index) {
    if (index == 1) $scope.passModal.show();
    else if (index == 2)
      $scope.addressModal.show();
    else
      $scope.editModal.show();
  };

  $scope.closeModal = function (index) {
    if (index == 1) $scope.passModal.hide();
    else if (index == 2)
      $scope.addressModal.hide();
    else
      $scope.editModal.hide();

    $scope.data.user.current = '';
    $scope.data.user.newpass = '';
    $scope.data.user.newpassconfirm = '';
    $scope.editAddress = {};

  };


  $scope.update = function (data) {
    getProducts.update_user_info(data)
      .then(function () {
        $ionicPopup.alert({
            title: $translate.instant("success"),
            template: $translate.instant("changes"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            $scope.closeModal(1);
            $scope.closeModal(2);
            $scope.closeModal(3);
          })
      }, function () {
        $ionicPopup.alert({
            title: $translate.instant("error"),
            template: $translate.instant("wrong"),
            cssClass: 'confirm-popup',
          })
          .then(function () {

          })
        console.log("error");
      })

  };
  $scope.deleteAddress = function (index, id) {
    $ionicPopup.confirm({
        title: $translate.instant("warning"),
        template: $translate.instant("delete_address"),
        cssClass: 'confirm-popup',
        okType: 'button-dark',
        buttons: [{
          text: $translate.instant('cancel')
        }, {
          text: $translate.instant('ok'),
          type: 'button-positive',
          onTap: function (e) {
            return e;
          }
        }]
      })
      .then(function (res) {
        if (res) {
          $scope.closeModal(1);
          $scope.closeModal(2);
          $scope.closeModal(3);


          getProducts.remove_address(id)
            .then(function () {
              $ionicPopup.alert({
                  title: $translate.instant("success"),
                  template: $translate.instant("removed_address"),
                  cssClass: 'confirm-popup',
                })
                .then(function () {

                  $scope.addresses.splice(index, 1);
                  $scope.closeModal(1);
                  $scope.closeModal(2);
                  $scope.closeModal(3);
                })
            }, function () {
              $ionicPopup.alert({
                  title: $translate.instant("error"),
                  template: $translate.instant("wrong"),
                  cssClass: 'confirm-popup',
                })
                .then(function () {

                })
              console.log("error");
            })
        }
      })
  }

  $scope.edit = function (add) {
    $scope.editAddress = add;
    $scope.openModal(3);
    //call service
  };

  $scope.updateAddress = function (data) {
    getProducts.update_address(data)
      .then(function () {
        $ionicPopup.alert({
            title: $translate.instant("success"),
            template: $translate.instant("changes"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            $scope.closeModal(1);
            $scope.closeModal(2);
            $scope.closeModal(3);
          })



      }, function () {
        $ionicPopup.alert({
            title: $translate.instant("error"),
            template: $translate.instant("wrong"),
            cssClass: 'confirm-popup',
          })
          .then(function () {

          })
        console.log("error");
      })

  };

  $scope.addItem = function (item) {


    getProducts.add_address(item)
      .then(function () {
        $ionicPopup.alert({
            title: $translate.instant("success"),
            template: $translate.instant("add_address"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            // $scope.addresses.push(item);
            $scope.closeModal(1);
            $scope.closeModal(2);
            $scope.closeModal(3);
            getProducts.get_user_addresses()
              .then(function (res) {
                $scope.addresses = res;

              }, function (res) {
                console.log("error");
              })
          })



      }, function () {
        $ionicPopup.alert({
            title: $translate.instant("error"),
            template: $translate.instant("wrong"),
            cssClass: 'confirm-popup',
          })
          .then(function () {

          })
        console.log("error");
      })
    console.log("Added");
  };


  $scope.changePassword = function (user) {

    AuthService.changePassword(user)
      .then(function (res) {
        $ionicPopup.alert({
            title: $translate.instant("success"),
            template: $translate.instant("changes"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            $scope.closeModal(1);
            $scope.closeModal(2);
            $scope.closeModal(3);

          })



      }, function (res) {
        if (res === 1) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("wrong_pass"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })


        } else if (res === 3) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("wrong_confirm"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })
        }
        // $scope.closeModal(1);
        // $scope.closeModal(2);
        console.log(res);
      })


  };




  $scope.choosePlace = function (place, modal) {
    LocationService.getDetails(place.place_id).then(function (location) {
      var i = 0;
      var l = location.address_components.length;

      if ($scope.addressModal.isShown()) {
        for (i; i < l; i++) {
          if (location.address_components[i].types[0] === 'street_number') {
            $scope.data.address.unumber = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'postal_code') {
            $scope.data.address.uzipcode = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'route') {
            $scope.data.address.uaddress = location.address_components[i].short_name;
          }

        }


      } else if ($scope.editModal.isShown()) {
        for (i; i < l; i++) {
          if (location.address_components[i].types[0] === 'street_number') {
            $scope.editAddress.unumber = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'postal_code') {
            $scope.editAddress.uzipcode = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'route') {
            $scope.editAddress.uaddress = location.address_components[i].short_name;
          }

        }


      } else {
        for (i; i < l; i++) {
          if (location.address_components[i].types[0] === 'street_number') {
            $scope.data.user.unumber = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'postal_code') {
            $scope.data.user.uzipcode = location.address_components[i].short_name;
          }
          if (location.address_components[i].types[0] === 'route') {
            $scope.data.user.uaddress = location.address_components[i].short_name;
          }

        }
      }

      modal.hide();


    });
  };


})



.controller("ForgotCtrl", function ($scope, $ionicHistory, $ionicPopup, AuthService, $state, $translate) {


  $scope.user = {};


  $scope.back = function () {
    $ionicHistory.goBack();
  }


  $scope.sendMail = function (mail) {

    AuthService.forgotPassword1(mail)
      .then(function (res) {
        $ionicPopup.alert({
            title: $translate.instant("info"),
            template: $translate.instant("key_code"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            console.log("mail sent!");
          })



      }, function (res) {
        if (res === 1) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("no_account"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })


        } else if (res === 2) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("missing"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })

        }

        console.log(res);
      })
  }

  $scope.newPassword = function (params) {


    AuthService.forgotPassword2(params)
      .then(function (res) {
        $ionicPopup.alert({
            title: $translate.instant("success"),
            template: $translate.instant("changes"),
            cssClass: 'confirm-popup',
          })
          .then(function () {
            $state.go('sign-in');
            $scope.user = {};
          })




      }, function (res) {

        if (res === 1) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("no_account"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })


        } else if (res === 2) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("missing"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })

        } else if (res === 3) {
          $ionicPopup.alert({
              title: $translate.instant("error"),
              template: $translate.instant("wrong_confirm"),
              cssClass: 'confirm-popup',
            })
            .then(function () {

            })

        }
        console.log(res);
      })
  }

})

.controller('TutorialCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $translate) {

  // $scope.$on('$ionicView.beforeEnter', function (event, toState, toParams, fromState, fromParams) {
  //     $scope.language = $translate.proposedLanguage();
  // });


  // Called to navigate to the main app
  $scope.startApp = function () {
    $ionicSlideBoxDelegate.slide(0);
    window.localStorage.setItem('watchedTutorial', 1);
    $state.go('dashboard');
  };
  $scope.next = function () {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function () {
    $ionicSlideBoxDelegate.previous();
  };


  $scope.old_theme = "css/venus_theme.css";
  $scope.theme = "css/venus_theme.css";

  // Called each time the slide changes
  $scope.slideChanged = function (index) {
    $scope.slideIndex = index;
  };
})



.controller('SettingsCtrl', function ($scope, appdata, $state, $translate, $rootScope, tmhDynamicLocale) {

  $scope.theme = appdata.get_theme();


  $scope.changeLan = function (language) {

    tmhDynamicLocale.set(language);
    $translate.use(language);
    window.localStorage.setItem("language", language);

    // $scope.data.language = language;
    console.log(language);

  };
  $scope.playTutorial = function () {
    $state.go('tutorial');
  };


  function createjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
      var fileref = document.createElement('script')
      fileref.setAttribute("type", "text/javascript")
      fileref.setAttribute("src", filename)
    } else if (filetype == "css") { //if filename is an external CSS file
      var fileref = document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
    }
    return fileref
  };

  function replacejscssfile(oldfilename, newfilename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist using
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename) != -1) {
        var newelement = createjscssfile(newfilename, filetype)
        allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
      }
    }
  };

  $scope.changeTheme = function (theme) {

    console.log("switch to " + theme);
    var old_theme = appdata.get_theme();
    appdata.set_theme(theme);
    replacejscssfile(old_theme, theme, "css");
    // $scope.theme = theme;

  };

})


.controller('LoginCtrl', function ($ionicPlatform, $rootScope, $scope, $ionicPopup, $state, $http, $translate, $stateParams, check_connection, AuthService, $ionicHistory, tmhDynamicLocale) {

  $scope.$on("$ionicView.afterEnter", function (event, data) {



    // if (window.localStorage.getItem('language') !== null) {
    //     $translate.use(window.localStorage.getItem('language'));
    //     $scope.data.language = window.localStorage.getItem('language');
    //     console.log("login: "+$scope.data.language);
    // } else {
    //     $scope.data.language = $translate.proposedLanguage() || $translate.use();
    //     $translate.use($scope.data.language);
    // }


    $ionicHistory.clearCache().then(function () {
      $ionicHistory.clearHistory();
      $ionicHistory.removeBackView();
    })


    if (window.localStorage.getItem("username") !== null && window.localStorage.getItem("pw") !== null) {
      $scope.data.username = window.localStorage.getItem("username");
      $scope.data.password = window.localStorage.getItem("pw");
    } else {
      $scope.data.username = "alex"; //!!!!!!!!!!!!!!!!!!! change this to empty string!! Only for development
      $scope.data.password = "123456";
    }

  })




  $scope.changeLan = function (language) {
    tmhDynamicLocale.set(language);
    $translate.use(language);
    $scope.data.language = language;
    window.localStorage.setItem('language', $scope.data.language);
    console.log(language);
  };

  $scope.focusPass = function () {
    setTimeout(function () {
      document.getElementById("password").focus();
    }, 350);
  }

  $scope.initlogin = function () {


  }

  $scope.login = function (data) {
    //----------------------------------------------------------------------------
    var ret = check_connection.check_net();
    //alert("Interne checking returned with "+ret);
    if (ret != 0) {
      //to be used with authservice
      AuthService.login(data.username, data.password).then(function (is_verified) {
        $rootScope.is_verified = is_verified;

        if (window.localStorage.getItem('watchedTutorial') === '1') {
          $state.go('dashboard');
        } else
          $state.go('tutorial');
      }, function (r) {
        console.log(r);

      });
    }
  }

  $scope.signUp = function () {
    $state.go('signUp');
  }
})

.controller('DetailedController', function ($scope, $http, $state, $ionicHistory, checkOutViewProccesor, UtilitySrv, appdata, handleFavouriteProduct, getProducts) {


  $scope.getState = function () {
    return 4;
  };

  $scope.$on('$ionicView.beforeEnter', function (event, toState, toParams, fromState, fromParams) {

    var products = [];
    $scope.categories = appdata.get_categories();
    products = appdata.get_current_products();
    var index = UtilitySrv.getIndex(products, 'pid', parseInt($state.params.aId));

    $scope.whichproductfull = products[index];

    $scope.total = appdata.get_total();
    //-----------------------------------------------------------------

    // Breadcrumbs values

    $scope.bread2 = $scope.whichproductfull.root_id;
    $scope.bread3 = $scope.whichproductfull.r_cat_level1;
    $scope.bread4 = $scope.whichproductfull.r_cat_level2;

    appdata.set_bread2($scope.bread2);
    appdata.set_bread3($scope.bread3);
    appdata.set_bread4($scope.bread4);

    $scope.name1 = $scope.whichproductfull.root_name;
    $scope.name2 = $scope.whichproductfull.down1_name;
    $scope.name3 = $scope.whichproductfull.down2_name;
    $scope.name = $scope.whichproductfull.pname;

    var checkout_products = appdata.get_checkout_products();
    var index = UtilitySrv.getIndex(checkout_products, 'pid', $scope.whichproductfull.pid);
    console.log(index);
    if (index != -1) {
      console.log('entered to get quantity');
      $scope.whichproductfull.quantity = checkout_products[index].quantity;
    }

    getProducts.get_products_of_brand($scope.whichproductfull.r_cat_level1).then(function (res) {
      $scope.popular = res;
      appdata.set_current_products(res);
    }, function () {
      console.log("Failed to get popular products");
    });
  });

  // alex
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });

  $scope.back = function () {
    checkOutViewProccesor.prepare();
    $ionicHistory.goBack();
  }

  $scope.goCheckOut = function () {
    checkOutViewProccesor.prepare();
    $state.go('checkOut');
  }

  $scope.handleFavourite = function (isFavourite, id) {

    if (isFavourite) {

      handleFavouriteProduct.subFavouriteProduct(id).then(function () {
        $scope.whichproductfull.pfav = 0;
        appdata.remove_favourite_product(id);


      }, function () {
        console.log("error on sub fav");
      });
    } else {

      handleFavouriteProduct.addFavouriteProduct(id).then(function () {
        $scope.whichproductfull.pfav = 1;
        appdata.add_favourite_product($scope.whichproductfull);



      }, function () {
        console.log("error on add fav");
      });

    }

    appdata.syncFav(id, appdata.get_dash_products());

  };





})

.controller('cat_1_Ctrl', function ($scope, $rootScope, AuthService, appdata, getProducts, $translate) {
  $scope.popular = [];
  $scope.getState = function () {
    return 1;
  };




  $scope.$on('$ionicView.beforeEnter', function (event, data) {

    //POPULAR
    $scope.name = $translate.instant('store');

    getProducts.get_popular_products('all')
      .then(function (res) {
        $scope.popular = res;
        appdata.set_current_products($scope.popular);
      }, function () {

        console.log("error on popular");
      });

    $scope.categories = appdata.get_categories();

    if (window.localStorage.getItem('total') === undefined || window.localStorage.getItem('total') === null) {
      $scope.total = 0;
      appdata.set_total(0);
      appdata.set_totalcost(0);
      appdata.zero_quant();
      //window.localStorage.setItem('total', 0);
    } else {
      $scope.total = window.localStorage.getItem('total');
      appdata.set_total($scope.total);
    }



  });
})

.controller('cat_2_Ctrl', function ($scope, $http, $state, $ionicHistory, UtilitySrv, appdata, getProducts, $filter) {

  $scope.popular = [];
  $scope.getState = function () {
    return 2;
  };

  appdata.set_bread2($state.params.aId);
  $scope.bread2 = appdata.get_bread2();

  $scope.$on('$ionicView.beforeEnter', function (event, toState, toParams, fromState, fromParams) {
    appdata.set_bread2($state.params.aId);
    $scope.bread2 = appdata.get_bread2();

    $scope.name1 = '';


    //POPULAR
    getProducts.get_popular_products($state.params.aId)
      .then(function (res) {
        $scope.popular = res;
        appdata.set_current_products($scope.popular);
      }, function () {

        console.log("error on popular");
      });


    $scope.type = appdata.get_type();

    $scope.super_cat = $state.params.aId;
    $scope.categories = appdata.get_categories();
    $scope.name1 = $scope.categories[UtilitySrv.getIndex($scope.categories, 'id', parseInt($state.params.aId))].name;
    $scope.name = $scope.name1;



  });



  $scope.back = function () {

    $ionicHistory.goBack();

  }

})



.controller('cat_3_Ctrl', function ($scope, $http, $state, $ionicHistory, appdata, getProducts, UtilitySrv, $ionicScrollDelegate) {


  $scope.popular = [];

  $scope.data.areSimilarProducts = false;

  $scope.getState = function () {
    return 3;
  };
  appdata.set_bread3($state.params.aId);
  $scope.bread2 = appdata.get_bread2();
  $scope.bread3 = appdata.get_bread3();




  $scope.$on('$ionicView.beforeEnter', function (event, toState, toParams, fromState, fromParams) {



    appdata.set_bread3($state.params.aId);
    $scope.bread2 = appdata.get_bread2();
    $scope.bread3 = appdata.get_bread3();

    $scope.categories = appdata.get_categories();
    $scope.name1 = $scope.categories[UtilitySrv.getIndex($scope.categories, 'id', parseInt($scope.bread2))].name;


    $scope.types = appdata.get_type();
    $scope.brand = appdata.get_brand();
    $scope.name2 = $scope.types[UtilitySrv.getIndex($scope.types, 'id', parseInt($state.params.aId))].name;
    $scope.name = $scope.name2;
    $scope.super_cat = $state.params.aId;


    //POPULAR
    getProducts.get_popular_products($state.params.aId)
      .then(function (res) {
        $scope.popular = res;
        appdata.set_current_products($scope.popular);
      }, function () {

        console.log("error on popular");
      });

    //Popup Scroll Window
    $scope.checkout_products = appdata.get_checkout_products();
    $scope.category_type = parseInt($state.params.aId);
    console.log("Category_Type");
    var index = UtilitySrv.getIndex($scope.checkout_products, "r_cat_level1", $scope.category_type);
    console.log(index);
    if (index !== -1 && $scope.checkout_products.length > 0) {
      setTimeout(function () {
        $scope.data.areSimilarProducts = true;
      }, 100);

    }



  })


  $scope.back = function () {
    $ionicHistory.goBack();
  }

  var scrolled = false;

  $scope.test = function (flag) {
    console.log(flag);
    var distance = $ionicScrollDelegate.$getByHandle('popupScroller').getScrollPosition().top;

    if (distance >= 40) {
      scrolled = true;
    }

    if (distance == 25 && scrolled) {
      console.log("I should dissapear");
      setTimeout(function () {
        flag = false;
      }, 500);
    }

    console.log("Distance: " + distance);
    console.log("Scrolled: " + scrolled);



  }
})

.controller('product_list_of_brands_Ctrl', function ($scope, $http, $state, $ionicHistory, $translate, appdata, getProducts, AuthService, handleFavouriteProduct, UtilitySrv, $ionicLoading) {

  $scope.getState = function () {
    return $scope.state;
  };


  $scope.bread2 = appdata.get_bread2();
  $scope.bread3 = appdata.get_bread3();
  $scope.bread4 = appdata.get_bread4();

  $scope.$on('$ionicView.beforeEnter', function (event, toState, toParams, fromState, fromParams) {

    $scope.bread2 = appdata.get_bread2();
    $scope.bread3 = appdata.get_bread3();
    $scope.bread4 = appdata.get_bread4();

    $scope.name1 = '';
    $scope.name2 = '';
    $scope.name3 = '';

    $scope.categories = appdata.get_categories();
    $scope.types = appdata.get_type();


    res = $state.params.aId;
    //fix for show all breadcrumbs and name
    if (res.charAt(0) === "a" || res.charAt(0) === 'b') {
      $scope.state = 2;
      $scope.bread2 = appdata.get_bread2();

      $scope.name1 = $scope.categories[UtilitySrv.getIndex($scope.categories, 'id', parseInt($scope.bread2))].name;
      $scope.name = $scope.name1;

      if (res.charAt(0) === 'b') {
        $scope.state = 3;
        $scope.bread3 = appdata.get_bread3();
        $scope.name2 = $scope.types[UtilitySrv.getIndex($scope.types, 'id', parseInt($scope.bread3))].name;
        $scope.name = $scope.name2;

      }
      // fix end 
      res = res.substr(1);

      var store = appdata.get_store_all(res);
      console.log(store);
      if (store === null) {


        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });

        getProducts.get_products_of_brand(res)
          .then(function (response) {

            console.log(response);
            $scope.products_of_brand = response;
            //Syncs products' quantities with these in cart.
            $scope.products_of_brand = UtilitySrv.syncProducts($scope.products_of_brand, appdata.get_checkout_products());
            appdata.set_current_products($scope.products_of_brand);

            if (response.length != 0)
              appdata.set_store_all(res, response);

            $ionicLoading.hide();

          }, function (r) {
            console.log(r);
            $ionicLoading.hide();
          });

        appdata.set_current_products($scope.products_of_brand);

      } else {

        console.log("from local");
        $scope.products_of_brand = appdata.get_store_all(res);
        $scope.products_of_brand = UtilitySrv.syncProducts($scope.products_of_brand, appdata.get_checkout_products());
        appdata.set_current_products($scope.products_of_brand);


      }


    } else {
      $scope.state = 4;

      appdata.set_bread4($state.params.aId);

      $scope.brand = appdata.get_brand();
      $scope.name1 = $scope.categories[UtilitySrv.getIndex($scope.categories, 'id', parseInt($scope.bread2))].name;
      $scope.name2 = $scope.types[UtilitySrv.getIndex($scope.types, 'id', parseInt($scope.bread3))].name;
      $scope.name3 = $scope.brand[UtilitySrv.getIndex($scope.brand, 'id', parseInt($state.params.aId))].name;
      $scope.name = $scope.name3;

      var store = appdata.get_store();
      if (store[$state.params.bId].categories[$state.params.aId].products.length === 0) {


        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });

        getProducts.get_products_of_brand(res)
          .then(function (response) {

            console.log(response);
            $scope.products_of_brand = response;
            //Syncs products' quantities with these in cart.
            $scope.products_of_brand = UtilitySrv.syncProducts($scope.products_of_brand, appdata.get_checkout_products());
            appdata.set_current_products($scope.products_of_brand);

            if (response.length != 0)
              appdata.set_products(response[0].r_cat_level1, response[0].r_cat_level2, response);

            $ionicLoading.hide();

          }, function (r) {
            console.log(r);
            $ionicLoading.hide();
          });


        appdata.set_current_products($scope.products_of_brand);

      } else {
        console.log("from local");
        $scope.products_of_brand = store[$state.params.bId].categories[$state.params.aId].products;
        $scope.products_of_brand = UtilitySrv.syncProducts($scope.products_of_brand, appdata.get_checkout_products());
        appdata.set_current_products($scope.products_of_brand);
      }



    }



  })


  $scope.back = function () {

    $ionicHistory.goBack();

  }



  $scope.handleFavourite = function (isFavourite, id, index) {

    if (isFavourite) {

      handleFavouriteProduct.subFavouriteProduct(id).then(function () {
        $scope.products_of_brand[index].pfav = 0;
        appdata.remove_favourite_product(id);

      }, function () {
        console.log("error on sub fav");
      });
    } else {

      handleFavouriteProduct.addFavouriteProduct(id).then(function () {
        $scope.products_of_brand[index].pfav = 1;
        appdata.add_favourite_product($scope.products_of_brand[index]);

      }, function () {
        console.log("error on add fav");
      });

    }
    appdata.syncFav(id, appdata.get_dash_products());

  };

})

.controller("ResultsCtrl", function ($scope, $state, appdata, UtilitySrv) {


  $scope.query = $state.params.aId;

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.results = appdata.get_results();
    appdata.set_current_products($scope.results);
    UtilitySrv.syncProducts($scope.results, appdata.get_checkout_products());

    console.log("results");
    console.log($scope.results);


  });
  //edo mesa prepei na mpei to handelFavorite!

})


.controller('notifCtrl', function ($scope, $rootScope, $ionicPopup, appdata, $filter, getProducts, $ionicLoading, AuthService, UtilitySrv, $state, $translate) {

  $scope.notifications = [];
  $scope.areAvailableItems = true;
  var msgCount = 0;
  var numberOfRecords = 15;

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    // if (appdata.get_receivedNotification()) {
    //     loadNotification();
    // }


    getProducts.getNotif().then(function (response) {
      console.log(response);



      $translate(['status_order1', 'status_order2', 'pending', 'progress', 'completed']).then(function (t) {
        for (var i = 0; i < response.length; i++) {
          var fixString = " #";
          var fixString2 = ' ';
          var status = [];
          response[i].difference = $scope.getDateDifference(response[i].pdate);



          if (response[i].notification_type === 2) {
            status = response[i].notification_params.split(":");
            switch (status[1]) {
              case "1":
                fixString2 += t["pending"];
                break;
              case "2":
                fixString2 += t["progress"];
                break;
              case "3":
                fixString2 += t["completed"];
                break;
              default:
                fixString2 += "Error";

            }
            response[i].msg = t["status_order1"] + fixString + status[0] + t["status_order2"] + fixString2;
          } else {
            // for future
          }
        }
      });



      $scope.notifications = response;
    }, function (e) {
      console.log("error notif", e);
    })



  });


  // Popup

  $scope.showNotification = function (item, i) {

    //needs localization
    var tmp_date = new Date(item.pdate);
    var niceDate = $filter('date')(tmp_date, 'MMM d, y H:mm');


    var alertPopup = $ionicPopup.alert({
      template: item.msg,
      title: niceDate,
      okText: 'Close',
      cssClass: 'msgPopup'
    });

    alertPopup.then(function (res) {
      if (item.has_read == 0) {

        console.log("read!")
        getProducts.readNotif(item).then(function () {
          item.has_read = 1;
          $rootScope.notifs--;

        }, function (e) {
          console.log(e);
        })


      }


    });
  };




  $scope.getDateDifference = function (d) {

    var today = new Date();
    var difference = '';
    var date = new Date(d);



    var differenceMs = Math.abs(today - date);
    var differenceDays = Math.floor(differenceMs / (24 * 60 * 60 * 1000));
    var differenceWeeks = Math.floor(differenceMs / 604800000);


    if (differenceDays == 0) {
      difference = $translate.instant("today");
    } else if (differenceDays <= 7) {
      if (differenceDays == 1)
        difference = $translate.instant("yesterday");
      else
        difference = differenceDays + $translate.instant("days");
    } else if (differenceDays <= 30) {
      difference = differenceWeeks;

      if (difference == 1)
        difference += $translate.instant("week")
      else
        difference += $translate.instant("weeks")
    } else if (differenceDays <= 365) {
      difference = +Math.floor(differenceDays / 30);
      if (difference == 1)
        difference += $translate.instant("month")
      else
        difference += $translate.instant("months")
    } else if (differenceDays > 365) {
      difference = +Math.floor(differenceDays / 365);
      if (difference == 1)
        difference += $translate.instant("year")
      else
        difference += $translate.instant("years")
    } else
      difference = "";


    return difference;

  }
})

.controller('ListController', function ($scope, $rootScope, $http, $state, $stateParams, $ionicLoading, $ionicPopup, $translate, checkOutViewProccesor, UtilitySrv, handleFavouriteProduct, AuthService, appdata, getProducts, $ionicModal, API_CONSTANTS, $cordovaMedia, $ionicPlatform, $interval, tmhDynamicLocale) {

  $scope.platform = ionic.Platform.platform();
  $rootScope.media = {};




  var wasPaused = false;
  var repeatAudio;

  document.addEventListener("pause", function () {
    clearInterval(repeatAudio);
    $rootScope.media.track.release();
    wasPaused = true;
  }, false);

  document.addEventListener("resume", function () {
    console.log(wasPaused);
    if (wasPaused && $rootScope.media.status == true) {
      console.log("Mpainw");
      src = "resources/Jazzy.mp3";
      if (ionic.Platform.isAndroid())
        src = '/android_asset/www/' + src;
      $rootScope.media.track = $cordovaMedia.newMedia(src);
      $scope.startAudio();
      wasPaused = false;
    }
  }, false);

  $scope.changeAudioStatus = function (status, from) {

    //Optional parameter from - Temporary solution for current bug.
    if (from == 'set')
      status = !status;

    if (status)
      $scope.muteAudio();
    else
      $scope.unmuteAudio();
  }

  $scope.startAudio = function () {

    $rootScope.media.track.play();
    window.localStorage.setItem('soundFlag', $rootScope.media.status);


    var repeatAudio = setInterval(function () {
      if (!$rootScope.media.track)
        clearInterval(repeatAudio);
      if ($rootScope.media.status) {
        $rootScope.media.track.release();
        $rootScope.media.track = $cordovaMedia.newMedia(src);
        $rootScope.media.track.play();
      }
    }, 16100);

    //16000 is the length of Jazzy.mp3 in secs.
  }

  $scope.muteAudio = function () {
    $rootScope.media.track.setVolume('0.0');
    $rootScope.media.status = false;
    window.localStorage.setItem('soundFlag', $rootScope.media.status);
  }

  $scope.unmuteAudio = function () {
    $rootScope.media.track.setVolume('1.0');
    $rootScope.media.status = true;
    window.localStorage.setItem('soundFlag', $rootScope.media.status);
  }

  if (window.cordova) {

    $ionicPlatform.ready(function () {
      if (!$rootScope.media.track) {
        src = "resources/Jazzy.mp3";
        if (ionic.Platform.isAndroid())
          src = '/android_asset/www/' + src;
        $rootScope.media.track = $cordovaMedia.newMedia(src);
      }
      $rootScope.media.status = JSON.parse(window.localStorage.getItem('soundFlag'));
      console.log("SoundFlag: " + $rootScope.media.status);

      // disable music by default comment next lines
      $scope.startAudio();

      //Case it isn't set (opened for first time) or it is true.
      if ($rootScope.media.status == null || $rootScope.media.status == true)
        $scope.unmuteAudio();
      else
        $scope.muteAudio();
    })
  }

  $scope.data = {};
  $scope.data.user = {};
  $scope.data.totalPrice = 0;

  if (window.localStorage.getItem('language') !== null) {
    $translate.use(window.localStorage.getItem('language'));
    $scope.data.language = window.localStorage.getItem('language');
    tmhDynamicLocale.set($scope.data.language);
    console.log("list " + $scope.data.language);
  } else {
    $scope.data.language = $translate.proposedLanguage() || $translate.use();
    tmhDynamicLocale.set($scope.data.language);
    $translate.use($scope.data.language);
    window.localStorage.setItem('language', $scope.data.language);
  }



  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

  console.log("Browser width: " + w);
  console.log("Browser height: " + h);

  //Photos size for smartphones
  if (w <= 480 || (w <= 640 && w > h)) {
    $rootScope.img_tiny = "213x213.jpg";
    $rootScope.img_thumb = '640x640.jpg';
    $rootScope.img_full = '426x426.jpg';
    console.log("This is a smartphone");
  }

  //Photos size for tablets
  if (w >= 600 || (w >= 800 && w > h)) {
    $rootScope.img_tiny = "213x213.jpg";
    $rootScope.img_thumb = '640x640.jpg';
    $rootScope.img_full = '567x567.jpg';
    console.log("This is a tablet");
  }

  $rootScope.media_url = API_CONSTANTS.media;



  //default list ordering by Name
  $scope.data.orderType = "pname";

  var products = [];
  var total = 0;
  var attr = '';
  var temp = {
    "array": [],
    "price": ''
  };


  var clearUsrInput = function () {
    $scope.reqProduct.pname = '';
    $scope.reqProduct.psize = '';
    $scope.reqProduct.quantity = '';
    $scope.reqProduct.pdesc = '';
  }

  //init arrays
  appdata.set_checkout_products([]);
  appdata.set_requestProducts([]);
  $scope.data.ck_length = appdata.get_checkout_products();
  $scope.data.ck_length2 = appdata.get_requestProducts();

  //For Request Product
  $scope.reqProduct = {
    "pname": '',
    "psize": '',
    "quantity": '',
    "pdesc": '',
    "pid": -2 //This defines that is a product in request.
  }

  $ionicModal.fromTemplateUrl('templates/similar-products-suggestion.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function (modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function () {
    $scope.modal.show();
    cordova.plugins.Keyboard.close();
  };
  $scope.closeModal = function () {
    $scope.modal.hide();
  };
  // Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function () {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function () {
    clearUsrInput();
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function () {
    // Execute action
  });



  $scope.found = function () {

    $scope.modal.hide();

  }

  $scope.notFound = function (flag, prd, items) {

    $ionicPopup.alert({
        title: $translate.instant("thanks"),
        template: $translate.instant("reqmes"),
        cssClass: 'confirm-popup',
      })
      .then(function () {

        //Checks if module was opened

        if (flag) {
          //Restores to initial values
          console.log(temp);
          appdata.set_checkout_products(temp.array);
          temp.array = [];
          $scope.data.totalPrice = temp.price;
        }


        prd = new requested_Product($scope.reqProduct);


        //Updates requested products array in service.
        appdata.add_requestProducts(prd);
        $scope.modal.hide();

      })

  }


  function requested_Product(data) {
    this.pname = data.pname;
    this.psize = data.psize;
    this.quantity = data.quantity;
    this.pdesc = data.pdesc;
    this.pid = data.pid;
  }


  $scope.addReqPr = function () {

    var product = new requested_Product($scope.reqProduct);

    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    getProducts.find(product.pname).then(function (res) {

      total = parseInt(appdata.get_total());
      console.log(res);
      console.log("length: " + res.length);

      if (res.length) {

        //Syncs the quantities with checkout products
        $scope.simProd = UtilitySrv.syncProducts(res, appdata.get_checkout_products());
        appdata.set_current_products(res);

        //Save cart in case he changes his mind even if similar products are found and used controls.

        angular.copy(appdata.get_checkout_products(), temp.array);
        temp.price = $scope.data.totalPrice;


        console.log("otan anoigei to modal");
        console.log(temp);


        $scope.modal.show();

      } else
        $scope.notFound(false, product);

      $ionicLoading.hide();
    }, function (res) {
      $ionicLoading.hide();
      console.log("Something went wrong with search");
    });
  }

  $scope.$on('$ionicView.afterEnter', function (event, data) {

    if (window.localStorage.getItem('total') === undefined || window.localStorage.getItem('total') === null) {
      $scope.total = 0;
      appdata.set_total(0);
      appdata.set_totalcost(0);
      appdata.zero_quant();
    } else {
      $scope.total = window.localStorage.getItem('total');
      appdata.set_total($scope.total);
    }
  });

  //reqProduct-->


  //here the internet load service will be called
  $scope.doRef = function () {
    console.warn('Refresh!');
    if (window.localStorage.getItem('total') === undefined || window.localStorage.getItem('total') === null) {
      $scope.total = 0;
      appdata.set_total(0);
      window.localStorage.setItem('total', 0);
    } else {
      $scope.total = window.localStorage.getItem('total');
      appdata.set_total($scope.total);
    }

  };

  $scope.goCheckOut = function () {
    checkOutViewProccesor.prepare();
    $state.go('checkOut');
  }



  $scope.handleFavourite = function (isFavourite, id, index) {
    var data = appdata.get_results();
    if (isFavourite) {

      handleFavouriteProduct.subFavouriteProduct(id).then(function () {
        data[index].pfav = 0;
        appdata.remove_favourite_product(id);

      }, function () {
        console.log("error on sub fav");
      });
    } else {

      handleFavouriteProduct.addFavouriteProduct(id).then(function () {
        data[index].pfav = 1;
        appdata.add_favourite_product(data[index]);

      }, function () {
        console.log("error on add fav");
      });

    }

    appdata.syncFav(id, appdata.get_dash_products());

  };

  $scope.subfromcart = function (pr) {
    var checkout_products = appdata.get_checkout_products();
    var index_checkout = UtilitySrv.getIndex(checkout_products, 'pid', pr.pid);
    if (index_checkout != -1) {
      if (checkout_products[index_checkout].quantity > 0) {
        checkout_products[index_checkout].quantity--;

        pr.quantity = checkout_products[index_checkout].quantity;
        $scope.data.totalPrice -= pr.pprice * (1 - (pr.pdiscount * 0.01));
      }
      if (checkout_products[index_checkout].quantity == 0) {
        checkout_products.splice(index_checkout, 1);
        pr.quantity = 0;
      }
    }

    appdata.set_checkout_products(checkout_products);
  }

  $scope.add2cart = function (pr) {

    var checkout_products = appdata.get_checkout_products();
    var index_checkout = UtilitySrv.getIndex(checkout_products, 'pid', pr.pid);
    if (index_checkout == -1) {
      pr.quantity++;
      checkout_products.push(pr);
      $scope.data.totalPrice += pr.pprice * (1 - (pr.pdiscount * 0.01));
    } else {
      checkout_products[index_checkout].quantity++;
      pr.quantity = checkout_products[index_checkout].quantity;
      $scope.data.totalPrice += pr.pprice * (1 - (pr.pdiscount * 0.01));
    }
    appdata.set_checkout_products(checkout_products);
  }

  $scope.setQuantity = function (item) {


    var checkoutProducts = appdata.get_checkout_products();
    var index = UtilitySrv.getIndex(checkoutProducts, 'pid', item.pid);


    var myPopup = $ionicPopup.show({
      template: '<input id="qt-input" type="number" max="999" ng-model="data.q" autofocus>',
      title: $translate.instant('new_quantity'),
      subTitle: $translate.instant('max_value'),
      scope: $scope,
      buttons: [{
        text: $translate.instant('cancel')
      }, {
        text: $translate.instant('ok'),
        type: 'button-positive',
        onTap: function (e) {
          return $scope.data.q;
        }
      }]
    });

    myPopup.then(function (res) {

      var tmp;

      if (res === null || res === "" || res === 0) {
        console.log('Changed to zero ', res);
        //total price


        //If already in cart
        if (index != -1) {
          $scope.data.totalPrice -= (checkoutProducts[index].quantity * checkoutProducts[index].pprice * (1 - (checkoutProducts[index].pdiscount * 0.01)));
          checkoutProducts[index].quantity = 0;
          checkoutProducts.splice(index, 1);
          appdata.set_checkout_products(checkoutProducts);
        }

        item.quantity = 0;


      } else if (res === undefined) {
        console.log('Canceled: ', res);
      } else if (res > 0) {


        //If already in cart
        if (index != -1) {
          tmp = JSON.parse(JSON.stringify(checkoutProducts[index].quantity));
          checkoutProducts[index].quantity = res;
          item.quantity = res;

          console.log("tmp: " + tmp);
          console.log(res)
          if (res > tmp) {
            console.log("bigger")
            $scope.total += (res - tmp);
            $scope.data.totalPrice += ((res - tmp) * checkoutProducts[index].pprice * (1 - (checkoutProducts[index].pdiscount * 0.01)));
          } else if (res < tmp) {
            console.log("smaller")
            $scope.total -= (tmp - res);
            $scope.data.totalPrice -= ((tmp - res) * checkoutProducts[index].pprice * (1 - (checkoutProducts[index].pdiscount * 0.01)));
          }

        } else {
          console.log("I wasn't in cart");
          checkoutProducts.push(item);
          $scope.total += item.quantity;
          $scope.data.totalPrice += res * item.pprice * (1 - (item.pdiscount * 0.01));
          item.quantity = res;
        }
        appdata.set_checkout_products(checkoutProducts);

      }

      $state.reload();
      $scope.data.q = "";
    });

    //Autofocus the popup
    setTimeout(function () {
      document.getElementById("qt-input").focus();
    }, 350);


  }

  //Long click functions

  //Defines packs added/subbed
  var packs = 10;

  $scope.longAdd = {
    run: function (self) {
      var tapped = $interval(function () {
        if (self.flag) {
          var checkout_products = appdata.get_checkout_products();
          var index_checkout = UtilitySrv.getIndex(checkout_products, 'pid', self.product.pid);
          if (index_checkout == -1) {
            self.product.quantity += packs;
            checkout_products.push(self.product);
            $scope.data.totalPrice += (self.product.pprice * (1 - self.product.pdiscount * 0.01) * packs);
          } else {
            checkout_products[index_checkout].quantity += packs;
            self.product.quantity = checkout_products[index_checkout].quantity;
            $scope.data.totalPrice += (self.product.pprice * (1 - self.product.pdiscount * 0.01) * packs);
          }
          appdata.set_checkout_products(checkout_products);
        } else
          $interval.cancel(tapped);
      }, 1000);

    },

    hold: function (pr) {
      this.product = pr;
      this.flag = true;
      this.run(this);
    },

    release: function () {
      this.flag = false;
    }
  }

  $scope.longSub = {
    run: function (self) {
      var tapped = $interval(function () {
          if (self.flag) {
            var checkout_products = appdata.get_checkout_products();
            var index_checkout = UtilitySrv.getIndex(checkout_products, 'pid', self.product.pid);
            if (index_checkout != -1) {
              if (checkout_products[index_checkout].quantity > 0) {
                checkout_products[index_checkout].quantity -= packs;
                if (checkout_products[index_checkout].quantity < 0) {
                  var dif = packs - Math.abs(checkout_products[index_checkout].quantity);
                  checkout_products[index_checkout].quantity = 0;
                  $scope.data.totalPrice -= (self.product.pprice * (1 - self.product.pdiscount * 0.01) * dif);
                } else
                  $scope.data.totalPrice -= (self.product.pprice * (1 - self.product.pdiscount * 0.01) * packs);

                self.product.quantity = checkout_products[index_checkout].quantity;
              }
              if (checkout_products[index_checkout].quantity <= 0) {
                checkout_products.splice(index_checkout, 1);
                self.product.quantity = 0;
              }
            }

            appdata.set_checkout_products(checkout_products);

          } else
            $interval.cancel(tapped);
        },
        1000);

    },

    hold: function (pr) {
      this.product = pr;
      this.flag = true;
      this.run(this);
    },

    release: function () {
      this.flag = false;
    }
  }




  //Sign the user out
  $scope.signOut = function () {

    $scope.search = false;

    AuthService.logout().then(function () {
      UtilitySrv.clear();
      //fix for clear
      appdata.set_checkout_products([]);
      appdata.set_total(0);
      appdata.set_totalcost(0);
      appdata.set_requestProducts([]);
      $scope.data.totalPrice = 0;
      $scope.data.ck_length = appdata.get_checkout_products();
      $scope.data.ck_length2 = appdata.get_requestProducts();
      //
      $state.go('sign-in');
    }, function () {
      // UtilitySrv.clear();
      console.log("Couldn't log out");
    });

  }




  //Filter Bar
  $scope.showFilterBar = function () {
    $scope.search = !$scope.search;
    setTimeout(function () {
      document.getElementById("search").focus();
    }, 150);
    console.log("Search:" + $scope.search);
    $scope.userSearch = {
      input: ''
    }
  }

  $scope.SearchFun = function () {
    var data = [];
    console.log('entered!');
    if ($scope.userSearch.input.length >= 3) {
      if ($scope.search) {
        $ionicLoading.show({
          template: '<ion-spinner></ion-spinner>'
        });
        getProducts.find($scope.userSearch.input).then(function (res) {

          data = UtilitySrv.syncProducts(res, appdata.get_checkout_products());
          console.log(data);

          console.log("Before add results in appdata results are: ");
          console.log(data);
          appdata.set_results(data);
          //-------------------------------------------------------
          $ionicLoading.hide();
          $state.go('results', {
            aId: $scope.userSearch.input
          });
        }, function () {
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: $translate.instant('wrongsearch'),
            template: $translate.instant('unquery')
          });
        })

      }
    } else {
      $ionicPopup.alert({
        title: $translate.instant('wrongsearch'),
        template: $translate.instant('4letters')
      });
    }
  }

  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {

    if (next.name !== 'results')
    {
      $scope.search = false;
      $scope.userSearch = {
        input: ''
      }
    }

    if (next.name !== 'sign-in' && next.name !== 'signUp' && next.name !== 'forgot-password_1') {
      //will change to other service || testing authentication
      getProducts.get_user_session()
        .then(function (response) {
          $rootScope.discount = response.data.discount;

        }, function (err) {

          event.preventDefault();
          UtilitySrv.clear();
          $ionicLoading.hide();


          //fix for clear
          appdata.set_checkout_products([]);
          appdata.set_total(0);
          appdata.set_totalcost(0);
          appdata.set_requestProducts([]);
          $scope.data.totalPrice = 0;
          $scope.data.ck_length = appdata.get_checkout_products();
          $scope.data.ck_length2 = appdata.get_requestProducts();


          $translate(['session_lost_title', 'session_lost_msg']).then(function (t) {



            $ionicPopup.alert({
              title: t.session_lost_title,
              template: t.session_lost_msg
            })

            .then(function (res) {
              $state.go('sign-in');
            })
          });
        })
    }

  })




});

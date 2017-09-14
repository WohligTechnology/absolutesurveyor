angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngCordovaOauth'])

  .run(function ($ionicPlatform, $ionicPopup, $rootScope, $ionicHistory, backgroundLocationTracking) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      if (window.Connection) {
        if (navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
            title: "Internet Disconnected",
            content: "The internet is disconnected on your device."
          })
            .then(function (result) {
              if (!result) {
                ionic.Platform.exitApp();
              }
            });
        }
      }


      // For location tracking
      function startBackgroundService() {
        if (window.cordova) {
          cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            console.log("enabled", enabled);
            // alert("Location is " + (enabled ? "enabled" : "disabled"));
            if (enabled == true) {
              backgroundLocationTracking.startTracking();
            } else {
              alert("Please enable location service");
              cordova.plugins.diagnostic.switchToLocationSettings();
            }
          }, function (error) {
            // alert("The following error occurred: " + error);
            alert("Unable to start Location service");
          });
        } else {
          // alert("window.cordova");
        }
      };
      startBackgroundService();



      if (window.plugins) {
        if (window.plugins.OneSignal) {
          var notificationOpenedCallback = function (result) {
            console.log(result);
            $rootScope.$broadcast('proximityCatched', null);
            var data = result.notification.payload.additionalData;
            console.log(data);
            if (data && data.targetUrl) {
              var state = $injector.get($state);
              $ionicHistory.clearCache().then(function () { state.go(data.targetUrl) })
              // state.go(data.targetUrl);
            }
          };
          window.plugins.OneSignal
            .startInit("41050fa0-9f31-4d69-b774-1e501f79cbfa")
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
          window.plugins.OneSignal.getIds(function (ids) {
            console.log('getIds: ' + JSON.stringify(ids));
            // $rootScope.$broadcast('proximityCatched', null);
            $rootScope.deviceId = ids.userId;
          });
        }
      };

      document.addEventListener("resume", onResume, false);

      function onResume() {
        if (($rootScope.latitude == undefined && $rootScope.latitude == "") && ($rootScope.longitude == undefined && $rootScope.longitude == "")) {
          startBackgroundService();
        }
        // Handle the resume event
      }

      document.addEventListener('deviceready', function () {
        // bgService.init()
        //For background mode
        cordova.plugins.backgroundMode.setDefaults({
          title: "ABM Field",
          text: "Background process is running",
          icon: 'icon.png', // this will look for icon.png in platforms/android/res/drawable|mipmap
          color: "22439b", // hex format like 'F14F4D'
          resume: true,
          hidden: false,
          bigText: false
        })
        // cordova.plugins.backgroundMode.configure({ 
        //    title: "ABM Field",
        //   text: "Background process is running",
        //   icon: '../img/icon.png', // this will look for icon.png in platforms/android/res/drawable|mipmap
        //   color: "22439b", // hex format like 'F14F4D'
        //   resume: true,
        //   hidden: false,
        //   bigText: false
        //  });
        cordova.plugins.backgroundMode.enable();
      }, false);

    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(2);
    $ionicConfigProvider.views.swipeBackEnabled(false)
    $stateProvider

      .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('app', {
        cache: false,
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.task', {
        cache: false,
        url: '/task',
        views: {
          'menuContent': {
            templateUrl: 'templates/task.html',
            controller: 'TaskCtrl'
          }
        }
      })

      .state('app.history', {
        cache: false,
        url: '/history',
        views: {
          'menuContent': {
            templateUrl: 'templates/history.html',
            controller: 'HistoryCtrl'
          }
        }
      })

      .state('app.photos-documents', {
        cache: false,
        url: '/photos-documents/:assignId/:surveyId/:department',
        views: {
          'menuContent': {
            templateUrl: 'templates/photos-documents.html',
            controller: 'PhotosDocumentsCtrl'
          }
        }
      })

      .state('app.emergency', {
        url: '/emergency',
        views: {
          'menuContent': {
            templateUrl: 'templates/photos-documents.html',
            controller: 'EmergencyCtrl'
          }
        }
      })

      .state('app.survey', {
        url: '/survey',
        views: {
          'menuContent': {
            templateUrl: 'templates/survey.html',
            controller: 'SurveyCtrl'
          }
        }
      })

      .state('app.marineSurvey', {
        url: '/marineSurvey',
        views: {
          'menuContent': {
            templateUrl: 'templates/marineSurvey.html',
            controller: 'MarineSurveyCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/task');
  })


  .filter('uploadpath', function () {
    return function (input, width, height, style) {
      var other = "";
      if (width && width != "") {
        other += "&width=" + width;
      }
      if (height && height != "") {
        other += "&height=" + height;
      }
      if (style && style != "") {
        other += "&style=" + style;
      }
      if (input) {
        if (input.indexOf('https://') == -1) {
          return imgpath + input + other;

        } else {
          return input;
        }
      }
    };
  });

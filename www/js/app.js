angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.task', {
    url: '/task',
    views: {
      'menuContent': {
        templateUrl: 'templates/task.html',
        controller: 'TaskCtrl'
      }
    }
  })

  .state('app.photos-documents', {
    url: '/photos-documents',
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
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

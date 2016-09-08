angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {})

.controller('LoginCtrl', function($scope) {})

.controller('TaskCtrl', function($scope) {})

.controller('PhotosDocumentsCtrl', function($scope, $cordovaCamera) {

  $scope.openCamera = function() {
    var cameraOptions = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: 0,
      targetWidth: 1200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
      $scope.imageSrc = "data:image/jpeg;base64," + imageData;
      console.log($scope.imageSrc);
    }, function(err) {
      console.log(err);
    });
  };

  $scope.openLibrary = function() {
    var libraryOptions = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: 0,
      targetWidth: 1200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(libraryOptions).then(function(imageData) {
      $scope.imageSrc = "data:image/jpeg;base64," + imageData;
      console.log($scope.imageSrc);
    }, function(err) {
      console.log(err);
    });
  };

})

.controller('EmergencyCtrl', function($scope) {})

.controller('SurveyCtrl', function($scope, $ionicScrollDelegate) {
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
});

connector.controller('PhotosDocumentsCtrl', function ($scope, $ionicNavBarDelegate, $ionicLoading, $ionicModal, $ionicActionSheet, $state, $stateParams, $ionicPopup, MyServices, $cordovaImagePicker, $ionicHistory, PopupService) {

  //initialize all objects start
  $scope.photos = [];
  $scope.doc = [];
  $scope.jir = [];

  //Function to get marine logic
  $scope.getMarineLogic = function () {
    $state.go('app.marineSurvey');
  }

  //picture upload action sheet popup
  $scope.showActionsheet = function (arrayName) {

    // Image picker will load images according to these settings
    var options = {
      maximumImagesCount: 20, // Max number of selected images
      width: 3096,
      height: 3096,
      quality: 60 // Higher is better
    };

    //Check permission before image picker
    cordova.plugins.diagnostic.requestCameraAuthorization({
      successCallback: function (status) {
        console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
        $cordovaImagePicker.getPictures(options).then(function (results) {
          if (arrayName === 'photos') {
            $scope.photos = _.flatten($scope.photos);
            _.forEach(results, function (value) {
              $scope.photos.push({
                name: value,
                retry: 0
              });
            });
            $scope.photosChunk = _.chunk($scope.photos, 3);
          } else if (arrayName === 'Document') {
            $scope.doc = _.flatten($scope.doc);
            _.forEach(results, function (value) {
              $scope.doc.push({
                name: value,
                retry: 0
              });
            });
            $scope.docChunk = _.chunk($scope.doc, 3);
          } else {
            $scope.jir = _.flatten($scope.jir);
            _.forEach(results, function (value) {
              $scope.jir.push({
                name: value,
                retry: 0
              });
            });
            $scope.jirChunk = _.chunk($scope.jir, 3);
          }
        }, function (error) {
          console.log('Error: ' + JSON.stringify(error));
        });
      },
      errorCallback: function (error) {
        console.error(error);
      }
    });
  };


  //remove image from array
  $scope.showConfirm = function (image, arrayName) {
    var confirmPopup = $ionicPopup.confirm({
      template: ' Are you sure you want to remove this?',
      cssClass: 'remove'
    });
    confirmPopup.then(function (res) {
      console.log('You are sure', image, res);
      if (res) {
        console.log('You are sure');
        if (arrayName === 'photos') {
          $scope.photosChunk = _.flatten($scope.photosChunk);
          _.remove($scope.photosChunk, function (n) {
            return n === image;
          });
          $scope.photosChunk = _.chunk($scope.photosChunk, 3);
          console.log($scope.photosChunk);
        } else if (arrayName === 'Document') {
          $scope.docChunk = _.flatten($scope.docChunk);
          _.remove($scope.docChunk, function (n) {
            return n === image;
          });
          $scope.docChunk = _.chunk($scope.docChunk, 3);
          console.log($scope.docChunk);

        } else {
          $scope.jirChunk = _.flatten($scope.jirChunk);
          _.remove($scope.jirChunk, function (n) {
            return n === image;
          });
          $scope.jirChunk = _.chunk($scope.jirChunk, 3);
          console.log($scope.jirChunk);
        }
      } else {
        console.log('You are not sure');
      }
    });
  };

  //survey form modal
  $scope.openSurveyForm = function () {
    var url = 'templates/modal/survey-form.html';
    var assignmentObj = {
      photos: _.clone($scope.photos),
      doc: _.clone($scope.doc),
      jir: _.clone($scope.jir),
      assignId: $stateParams.assignId,
      surveyId: $stateParams.surveyId,
      department: $stateParams.department,
      status: false,
      // latitude : $rootScope.latitude,
      // longitude : $rootScope.longitude,
      isMobile: true
    }

    if ($.jStorage.get('currentState') == "app.task") {
      if (!(_.isEmpty($scope.photos) && _.isEmpty($scope.doc) && _.isEmpty($scope.jir))) {
        if (!(_.isEmpty($scope.jir))) {
          PopupService.openModal(assignmentObj, url);
        } else {
          PopupService.showAlert('Please add JIR');
        }
      } else {
        PopupService.showAlert('Please add attachments ');
      }
    } else if ($.jStorage.get('currentState') == "app.history") {
      PopupService.openModal(assignmentObj, url);
    } else if ($.jStorage.get('currentState') == "app.marineSurvey") {
      PopupService.openModal(assignmentObj, url);
    }
  };

})

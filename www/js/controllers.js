angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal,$state, $timeout) {
  $scope.profile = $.jStorage.get('profile');

  $scope.getprofile =function(){
    $scope.profile = $.jStorage.get('profile');
  };
// $state.go($state.current, {}, { reload: true });
  $scope.logout= function(){
    $.jStorage.set('profile',null);
    $.jStorage.deleteKey('profile');
    $.jStorage.flush();

if($.jStorage.get('profile')=== null){
  $state.go('login');

}
  };

})

.controller('LoginCtrl', function($scope, $ionicPopup, $state, MyServices) {
$scope.profile = $.jStorage.get('profile');
if ($scope.profile) {
  $state.go('app.task');
  console.log("hi");
}

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'oops!',
      template: 'Sorry You have entered wrong email '

    });

    alertPopup.then(function(res) {
      console.log('Thank you for not eating my delicious ice cream cone');
      // $state.go('app.task');
    });
  };
  $scope.formData = {};
  $scope.validEmail = /^[a-z]+[@][a-z]+[.]+[a-z]*$/;
  $scope.login = function(email) {
    console.log("hi", email);
    MyServices.Login(email, function(data) {
      if (data.value) {
        $.jStorage.set('profile', data.data);
        $state.go('app.task');
      } else {
        $scope.showAlert();
      }
    });
  }

})

.controller('TaskCtrl', function($scope, $ionicPopup,$state, MyServices,$timeout) {

  $scope.profile = $.jStorage.get('profile');
  $scope.id = $scope.profile._id;
  console.log($scope.id);

  $scope.taskfun = function () {
    MyServices.Task($scope.id, function(data) {
      $scope.notask=false;
      console.log(data.data.length);
      if(data.data.length === 0){
        $scope.notask=true;
        console.log(data);
      }
      if (data.value) {
        console.log(data);
        $scope.task = data.data;
        var
          monthLabels = ["Jan", "Feb", "March",
            "April", "May", "June",
            "July", "Aug", "Sep",
            "Oct", "Nov", "Dec"
          ],
          items = $scope.task;
        console.log(items);
        var itemsGroupedByMonth = function(items) {
          var
            groups = [
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
              [],
            ],
            itemGroupedByMonths = [];

          for (var i = 0; i < items.length; i++) {
            groups[new Date(items[i].surveyDate).getMonth()].push(items[i]);
          }
          console.log(groups);


          for (var i = 0; i < groups.length; i++) {
            if (groups[i].length) {
              itemGroupedByMonths.push({
                month: monthLabels[i],
                items: groups[i]
              });

            }
          }
          return itemGroupedByMonths;
        };

        $scope.monthWiseGroup = itemsGroupedByMonth(items);
        console.log($scope.monthWiseGroup);

      } else {
        // $scope.showAlert();
        $scope.notask=true;
      }
    });
  }

  $scope.taskfun();
  $scope.doRefresh = function() {

     console.log('Refreshing!');
     $timeout( function() {
       //simulate async response
       $scope.taskfun();
       //Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');

     }, 1000);

   };
   $scope.decline={};
   $scope.declinetask = function (surveyId,assignId) {
     $scope.decline.surveyId =surveyId;
     $scope.decline.assignId =assignId;
     $scope.decline.empId =$scope.id;
    //  $scope.decline.empMail =$scope.profile.mai;
     MyServices.Decline($scope.decline, function(data) {
       if (data.value) {
         console.log(data);
         $scope.doRefresh()
       }
     });
   };

  $scope.information = function(index, parent) {
    console.log($scope.monthWiseGroup[parent].items[index], 'inside match');
    $scope.insideData = $scope.monthWiseGroup[parent].items[index];
    console.log(index, 'index');
    $scope.insideData.surveyDate = new Date($scope.monthWiseGroup[parent].items[index].surveyDate);
    console.log($scope.insideData.surveyDate);
    $scope.infos = $ionicPopup.show({
      templateUrl: 'templates/modal/info.html',
      scope: $scope,

    });
  }
  $scope.closePopup = function() {
    $scope.infos.close();
  }

})

.controller('PhotosDocumentsCtrl', function($scope, $cordovaCamera, $ionicActionSheet, $cordovaFileTransfer, $state,$stateParams, $ionicPopup, $rootScope, MyServices, $cordovaImagePicker) {
  $scope.photos = [];
  $scope.doc = [];
  $scope.jir = [];
  $scope.document = {};
  $scope.profile = $.jStorage.get('profile');
  console.log($scope.profile);
  console.log($scope.profile._id);
  $scope.document.empId = $scope.profile._id;
  $scope.document.assignId = $stateParams.assignId;
  $scope.document.surveyId = $stateParams.surveyId;
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'oops!',
      template: 'please add attachments '

    });

    alertPopup.then(function(res) {
      // $state.go('app.task');
    });
  };
  $scope.mobileSubmit = function() {

    if (!(_.isEmpty($scope.photos) && _.isEmpty($scope.doc) && _.isEmpty($scope.jir))) {
      //photos
      $scope.document.photos = [];
      $scope.photos = _.flatten($scope.photos);
      _.forEach($scope.photos, function(value) {
        $scope.document.photos.push({
          "file": value
        });
      });
      console.log($scope.document.photos);
      //doc
      $scope.document.doc = [];
      $scope.doc = _.flatten($scope.doc);
      _.forEach($scope.doc, function(value) {
        $scope.document.doc.push({
          "file": value
        });
      });
      console.log($scope.document.doc);
      //jir
      $scope.document.jir = [];
      $scope.jir = _.flatten($scope.jir);

      _.forEach($scope.jir, function(value) {
        $scope.document.jir.push({
          "file": value
        });
      });
      console.log($scope.document.jir);
      console.log($scope.document);
      // $scope.uploadImage($scope.photos,'photos');
      // $scope.uploadImage($scope.doc,'Document');
      // $scope.uploadImage($scope.jir,'JIR');


      MyServices.mobileSubmit($scope.document, function(data) {
        if (data.value) {
          console.log(data);
          $state.go('app.task');
        } else {
          console.log(data.value);
        }
      });
    } else {
      $scope.showAlert();
    }
  };
  $scope.showActionsheet = function(arrayName) {
    console.log(arrayName);
    $ionicActionSheet.show({
      //  titleText: 'choose option',
      buttons: [{
        text: '<i class="icon ion-ios-camera-outline"></i> Choose from gallery'
      }, {
        text: '<i class="icon ion-images"></i> Take from camera'
      }, ],
      //  destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        console.log('BUTTON CLICKED', index);
        if (index == 0) {
          $scope.getImageSaveContact(arrayName);
        } else {
          $scope.openCamera(arrayName);
        }
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      }
    });
  };


  $scope.showConfirm = function(image,arrayName) {

    var confirmPopup = $ionicPopup.confirm({
      template: ' Are you sure you want to remove this?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
          if (arrayName === 'photos') {
        _.remove($scope.photos, function(n) {
          return n.file === image;
        });
            }
      else if (arrayName === 'Document') {
         _.remove($scope.doc, function(n) {
          return n.file === image;
        });
      } else {
       _.remove($scope.jir, function(n) {
          return n.file === image;
        });
            }
      

      } else {
        console.log('You are not sure');
      }
    });
  };
  $scope.openCamera = function(arrayName) {
    console.log(arrayName);

    var cameraOptions = {
      quality: 90,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: false,
      encodingType: 0,
      targetWidth: 1200,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true,
      correctOrientation: true
    };
    $cordovaCamera.getPicture(cameraOptions).then(function(imageData) {
      $scope.imageSrc = "data:image/jpeg;base64," + imageData;
      console.log(arrayName);

      if (arrayName === 'photos') {

        $scope.uploadImage($scope.imageSrc, arrayName);
      } else if (arrayName === 'Document') {
        $scope.uploadImage($scope.imageSrc, arrayName);
      } else {
        $scope.uploadImage($scope.imageSrc, arrayName);
      }
    }, function(err) {          $scope.photos = _.flatten($scope.photos);

      console.log(err);
    });
  };

  $scope.uploadImage = function(imageURI, arrayName) {
    console.log('imageURI', imageURI);
    // $scope.showLoading('Uploading Image...', 10000);
    $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
      .then(function(result) {
        // Success!

        result.response = JSON.parse(result.response);
        console.log(result.response.data[0]);

        if (arrayName === 'photos') {
          $scope.photos = _.flatten($scope.photos);
          $scope.photos = $scope.photos.concat(result.response.data[0]);
          $scope.photos = _.chunk($scope.photos, 4);
          console.log($scope.photos);
       

        } else if (arrayName === 'Document') {
          $scope.doc = _.flatten($scope.doc);
          $scope.doc = $scope.doc.concat(result.response.data[0]);
          $scope.doc = _.chunk($scope.doc, 4);
          console.log($scope.doc);
     

        } else {
          $scope.jir = _.flatten($scope.jir);
          $scope.jir = $scope.jir.concat(result.response.data[0]);
          $scope.jir = _.chunk($scope.jir, 4);
          console.log($scope.jir);
        

        }

      }, function(err) {
        // Error

      }, function(progress) {
        // constant progress updates
      });
  };

  $scope.getImageSaveContact = function(arrayName) {
    console.log(arrayName);

    // Image picker will load images according to these settings
    var options = {
      maximumImagesCount: 20, // Max number of selected images, I'm using only one for this example
      width: 800,
      height: 800,
      quality: 80 // Higher is better
    };

    $cordovaImagePicker.getPictures(options).then(function(results) {
      console.log(arrayName);
      if (arrayName === 'photos') {
        $scope.photos = _.flatten($scope.photos);
        _.forEach(results, function(value) {
          $scope.uploadImage(value, arrayName);
        });
        console.log($scope.photos);
        // $scope.photos= $scope.photos.concat(results);
        $scope.photos = _.chunk($scope.photos, 4);

      } else if (arrayName === 'Document') {
        $scope.doc = _.flatten($scope.doc);

        _.forEach(results, function(value) {
          $scope.uploadImage(value, arrayName);
        });
        console.log($scope.doc);
        // $scope.doc= $scope.doc.concat(results);
        $scope.doc = _.chunk($scope.doc, 4);

      } else {
        _.forEach(results, function(value) {
          $scope.uploadImage(value, arrayName);
        });
      }

    }, function(error) {
      console.log('Error: ' + JSON.stringify(error)); // In case of error
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

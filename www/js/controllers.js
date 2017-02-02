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

.controller('LoginCtrl', function($scope, $ionicPopup, $state, MyServices,$ionicLoading) {
  $scope.profile={};
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
    $scope.showLoading('Please wait...', 10000);
  $.jStorage.set('profile',null);
  $.jStorage.deleteKey('profile');
  $.jStorage.flush();
        MyServices.Login(email, function(data) {
      if (data.value) {
          $scope.hideLoading();
        $.jStorage.set('profile', data.data);
        $state.go('app.task');
      } else {
          $scope.hideLoading();
        $scope.showAlert();
      }
    });
  }
  $scope.showLoading = function (value, time) {
    $ionicLoading.show({
      template: value,
      duration: time
    });
  };
  $scope.hideLoading = function () {
    $ionicLoading.hide();
  };
})

.controller('TaskCtrl', function($scope, $ionicPopup,$state, MyServices,$timeout,$ionicLoading) {


  $scope.taskfun = function () {
    $scope.profile = {};
    $scope.id = {};
    $scope.profile = $.jStorage.get('profile');
    $scope.id = null;
    $scope.id = $scope.profile._id;
    $scope.task ={};
    MyServices.Task($scope.id, function(data) {
      $scope.task ={};
      console.log($scope.id);
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
     $scope.show = function() {
    $ionicLoading.show({
      template: 'Loading...',
      duration: 3000
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
   $scope.decline={};
   $scope.declinetask = function (surveyId,assignId,message) {
      $scope.show();
     $scope.decline.surveyId =surveyId;
     $scope.decline.assignId =assignId;
     $scope.decline.empId =$scope.id;
     $scope.decline.message=message;
     console.log($scope.decline);
    //  $scope.decline.empMail =$scope.profile.mai;
     MyServices.Decline($scope.decline, function(data) {
       if (data.value) {
         $scope.hide();
         console.log(data);
         $scope.doRefresh();
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

  $scope.showPopup = function(surveyId,assignId) {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
      template: '<textarea placeholder="Reason" ng-model="data.message" class="decline-input"></textarea>',
      title: 'Please submit the reason for decline the task',
      cssClass :'declinepop',
      // subTitle: 'Please use normal things',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Submit</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.message) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              $scope.declinetask(surveyId,assignId,$scope.data.message);

            }
          }
        }
      ]
    });

    myPopup.then(function(res) {
      console.log('Tapped!', res);
    });

    // $timeout(function() {
    //    myPopup.close(); //close the popup after 3 seconds for some reason
    // }, 10000);
   };
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $scope.task = [];
    console.log("GOOD");
    $timeout(function(){
      $scope.doRefresh();
    },300);
  });

})

.controller('PhotosDocumentsCtrl', function($scope, $cordovaCamera,$ionicLoading, $ionicModal,$ionicPopup,$ionicActionSheet, $cordovaFileTransfer, $state,$stateParams, $ionicPopup, $rootScope, MyServices, $cordovaImagePicker) {
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
  $scope.showAlert = function(text) {
    var alertPopup = $ionicPopup.alert({
      template: text

    });

    alertPopup.then(function(res) {
      // $state.go('app.task');
    });
  };
  $scope.newUser={};
  $scope.newUser.surveyDate=new Date();
  $scope.surveyOpen = function() {


    if (!(_.isEmpty($scope.photos) && _.isEmpty($scope.doc) && _.isEmpty($scope.jir))) {
      if(!( _.isEmpty($scope.jir))){
    //photos
      $scope.document.photos = [];
      $scope.photos = _.flatten($scope.photos);
      _.forEach($scope.photos, function(value) {
        $scope.document.photos.push({
          "file": value
        });
      });
      //doc
      $scope.document.doc = [];
      $scope.doc = _.flatten($scope.doc);
      _.forEach($scope.doc, function(value) {
        $scope.document.doc.push({
          "file": value
        });
      });
      //jir
      $scope.document.jir = [];
      $scope.jir = _.flatten($scope.jir);

      _.forEach($scope.jir, function(value) {
        $scope.document.jir.push({
          "file": value
        });
      });

      $scope.survey = $ionicPopup.show({
        templateUrl: 'templates/modal/survey-form.html',
        scope: $scope,
      });

      }else{
        $scope.showAlert('Please add JIR ');
      }

    } else {
      $scope.showAlert('Please add attachments ');
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
      template: ' Are you sure you want to remove this?',
      cssClass:'remove'
    });
    confirmPopup.then(function(res) {
      if (res) {
        console.log('You are sure');
          if (arrayName === 'photos') {
            $scope.photos = _.flatten($scope.photos);
            _.remove($scope.photos, function(n) {
              return n === image;
            });
            $scope.photos = _.chunk($scope.photos, 3);
        console.log($scope.photos);
            }
      else if (arrayName === 'Document') {
        $scope.doc = _.flatten($scope.doc);
         _.remove($scope.doc, function(n) {
          return n === image;
        });
        $scope.doc = _.chunk($scope.doc, 3);
        console.log($scope.doc);

      } else {
        $scope.jir = _.flatten($scope.jir);
       _.remove($scope.jir, function(n) {
          return n === image;
        });
        $scope.jir = _.chunk($scope.jir, 3);
        console.log($scope.jir);

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
        $scope.photos = _.flatten($scope.photos);
        $scope.uploadImage($scope.imageSrc, arrayName);
        $scope.photos = _.chunk($scope.photos, 3);
      } else if (arrayName === 'Document') {
        $scope.doc = _.flatten($scope.doc);
        $scope.uploadImage($scope.imageSrc, arrayName);
        $scope.doc = _.chunk($scope.doc, 3);
      } else {
        $scope.jir = _.flatten($scope.jir);
        $scope.uploadImage($scope.imageSrc, arrayName);
        $scope.jir = _.chunk($scope.jir, 3);
      }
    }, function(err) {

      console.log(err);
    });
  };

  $scope.uploadImage = function(imageURI, arrayName) {
    console.log('imageURI', imageURI);
    $scope.showLoading('Uploading Image...', 10000);
    $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
      .then(function(result) {
        // Success!
        $scope.hideLoading();
        result.response = JSON.parse(result.response);
        console.log(result.response.data[0]);

        if (arrayName === 'photos') {
          $scope.photos = _.flatten($scope.photos);
          $scope.photos = $scope.photos.concat(result.response.data[0]);
          $scope.photos = _.chunk($scope.photos, 3);


        } else if (arrayName === 'Document') {
          $scope.doc = _.flatten($scope.doc);
          $scope.doc = $scope.doc.concat(result.response.data[0]);
          $scope.doc = _.chunk($scope.doc, 3);


        } else {
          $scope.jir = _.flatten($scope.jir);
          $scope.jir = $scope.jir.concat(result.response.data[0]);
          $scope.jir = _.chunk($scope.jir, 3);
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
        $scope.photos = _.chunk($scope.photos, 3);

      } else if (arrayName === 'Document') {
        $scope.doc = _.flatten($scope.doc);

        _.forEach(results, function(value) {
          $scope.uploadImage(value, arrayName);
        });
        $scope.doc = _.chunk($scope.doc, 3);

      } else {
        $scope.jir = _.flatten($scope.jir);

        _.forEach(results, function(value) {
          $scope.uploadImage(value, arrayName);
        });
        $scope.jir = _.chunk($scope.jir, 3);

      }

    }, function(error) {
      console.log('Error: ' + JSON.stringify(error)); // In case of error
    });
  };
  $ionicModal.fromTemplateUrl('templates/modal/survey-form.html', {
  scope: $scope
}).then(function(modal) {
  $scope.modal = modal;
});
$scope.surveyform={};
$scope.showLoading = function (value, time) {
  $ionicLoading.show({
    template: value,
    duration: time
  });
};
$scope.hideLoading = function () {
  $ionicLoading.hide();
};
$scope.mobileSubmit = function(newuser) {
  $scope.surveyform = newuser;
  $scope.document.surveyDate = $scope.surveyform.surveyDate;
  $scope.document.startTime=$scope.surveyform.startTime;
  $scope.document.endTime=$scope.surveyform.endTime;
  $scope.document.address=$scope.surveyform.address;
  console.log($scope.document);
  $scope.showLoading('Please wait...', 15000);

  MyServices.mobileSubmit($scope.document, function(data) {

    if (data.value) {
      $scope.hideLoading();
      console.log(data);
      $scope.surveyClose();
      $state.go('app.task');
    } else {
      console.log(data.value);
      $scope.hideLoading();
    }
  });
}
$scope.surveyClose = function() {
  $scope.survey.close();
}

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

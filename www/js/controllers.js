angular.module('starter.controllers', ['ngCordova'])

  .controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $state, $timeout) {
    $scope.profile = $.jStorage.get('profile');
    // $rootScope.document = [];
    $scope.getprofile = function () {
      $scope.profile = $.jStorage.get('profile');
    };
    // $state.go($state.current, {}, { reload: true });
    $scope.logout = function () {
      $.jStorage.set('profile', null);
      $.jStorage.deleteKey('profile');
      $.jStorage.flush();

      if ($.jStorage.get('profile') === null) {
        $state.go('login');

      }
    };

  })

  .controller('LoginCtrl', function ($scope, $ionicPopup, $rootScope, $state, MyServices, $ionicLoading) {
    $scope.profile = {};
    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile) {

      console.log($rootScope.document);
      $state.go('app.task');
      console.log("hi");
    }

    $scope.showAlert = function () {
      var alertPopup = $ionicPopup.alert({
        title: 'oops!',
        template: 'Sorry You have entered wrong email '

      });

      alertPopup.then(function (res) {
        console.log('Thank you for not eating my delicious ice cream cone');
        // $state.go('app.task');
      });
    };
    $scope.formData = {};
    $scope.validEmail = /^[a-z]+[@][a-z]+[.]+[a-z]*$/;
    $scope.login = function (email) {
      $scope.showLoading('Please wait...', 10000);
      $.jStorage.set('profile', null);
      $.jStorage.deleteKey('profile');
      $.jStorage.flush();
      MyServices.Login(email, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $rootScope.document = [];
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

  .controller('TaskCtrl', function ($scope, $ionicPopup, $state, $rootScope, $cordovaFileTransfer, $cordovaNetwork, MyServices, $timeout, $ionicLoading) {
    $scope.task = {};
    $rootScope.task = {};
    $scope.photos = [];
    $scope.doc = [];
    $scope.jir = [];
    $scope.photos1 = [];
    $scope.doc1 = [];
    $scope.jir1 = [];


    console.log($rootScope.document);
    $scope.taskpending = $.jStorage.get('taskpending');
    console.log($scope.taskpending);
    document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork()

      var isOnline = $cordovaNetwork.isOnline()

      var isOffline = $cordovaNetwork.isOffline()

      $scope.taskcomplete = [];
      $scope.taskIncomplete = [];
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        var onlineState = networkState;
        console.log(onlineState);
        console.log($rootScope.document);
        async.eachSeries($rootScope.document, function (value, callback) {
          uploadData(value, callback);
        }, function (err, data) {
          callback(null, data);
        });


        _.forEach($scope.taskcomplete, function (value) {
          _.remove($rootScope.document, function (n) {
            return n.assignId == value.assignId;
          });
          $scope.doRefresh();
        });
        $scope.doRefresh();
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        var offlineState = networkState;
        console.log(offlineState);
        $scope.doRefresh();
      })

    }, false);

    function uploadData(value, callback) {
      $scope.document = value;
      console.log(value);
      console.log($scope.document);
      $scope.photos = $scope.document.photos;
      $scope.doc = $scope.document.doc;
      $scope.jir = $scope.document.jir;
      console.log($scope.photos);
      console.log($scope.doc);
      console.log($scope.jir);
      async.parallel({
        photos: function (callback) {
          async.each(_.flatten($scope.photos), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'photos', callback);

          }, function (err, data) {
            callback(null, data);
          });
        },
        document: function (callback) {
          async.each(_.flatten($scope.doc), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'Document', callback);

          }, function (err, data) {
            callback(null, data);
          });
        },
        jir: function (callback) {
          async.each(_.flatten($scope.jir), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'JIR', callback);

          }, function (err, data) {
            callback(null, data);
          });
        }
      }, function (err, data) {

        console.log($scope.photos1);
        console.log($scope.doc1);
        console.log($scope.jir1);

        $scope.document.photos = [];
        $scope.document.doc = [];
        $scope.document.jir = [];
        $scope.document.photos.length = 0;
        // $scope.photos1 = _.flatten($scope.photos);
        _.forEach($scope.photos1, function (value) {
          $scope.document.photos.push({
            "file": value
          });
        });
        //doc
        $scope.document.doc.length = 0;
        // $scope.doc1 = _.flatten($scope.doc);
        _.forEach($scope.doc1, function (value) {
          $scope.document.doc.push({
            "file": value
          });
        });
        //jir
        $scope.document.jir.length = 0;
        // $scope.jir1 = _.flatten($scope.jir)
        _.forEach($scope.jir1, function (value) {
          $scope.document.jir.push({
            "file": value
          });
        });
        MyServices.mobileSubmit($scope.document, function (data) {

          if (data.value) {
            console.log(data);
            $scope.taskcomplete.push($scope.document);
            $scope.photos = [];
            $scope.doc = [];
            $scope.jir = [];
            $scope.photos1 = [];
            $scope.doc1 = [];
            $scope.jir1 = [];
            // _.remove($rootScope.document, function(n) {
            //   return  n.assignId==$scope.document.assignId;
            // });
            callback(null, $scope.taskcomplete);
          } else {
            console.log(data.value);
            callback(null, data);
          }
        });

      });

    }

    $scope.taskfun = function () {
      $scope.profile = {};
      $scope.id = {};
      $scope.profile = $.jStorage.get('profile');
      $scope.id = null;
      $scope.id = $scope.profile._id;
      $scope.task = {};
      MyServices.Task($scope.id, function (data) {
        $scope.task = {};
        console.log($scope.id);
        $scope.notask = false;
        $rootScope.document=[];

        console.log(data.data.length);
        if (data.data.length === 0) {
          $scope.notask = true;
          console.log(data);
        }
        if (data.value) {
          console.log(data);
          $rootScope.task = data.data;
          $scope.offtask($rootScope.task);

        } else {
          // $scope.showAlert();
          $scope.notask = true;
        }
      });
    }
    $scope.offtask = function (task) {
      console.log("i am in the offline man");
      $scope.task = task;
      if ($rootScope.document.length != 0 && $scope.task.length != 0) {
        var i = 0;
        _.each($rootScope.document, function (values) {
          var val1 = values.assignId.toString();
          var val2 = $scope.task[i]._id;
          if (val1 == val2) {
            $scope.task[i].status = true;
          } else {
            $scope.task[i].status = false;
          }
          i++;
        });
      }

      var
        monthLabels = ["Jan", "Feb", "March",
          "April", "May", "June",
          "July", "Aug", "Sep",
          "Oct", "Nov", "Dec"
        ],
        items = $scope.task;
      console.log(items);
      var itemsGroupedByMonth = function (items) {
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
    };
    $scope.taskfun();
    $scope.doRefresh = function () {

      console.log('Refreshing!');
      $timeout(function () {
        //simulate async response
        if ($cordovaNetwork.isOnline()) {
          $scope.taskfun();
        } else {
          $scope.offtask($rootScope.task);
        }
        //Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
    $scope.show = function () {
      $ionicLoading.show({
        template: 'Loading...',
        duration: 3000
      }).then(function () {
        console.log("The loading indicator is now displayed");
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide().then(function () {
        console.log("The loading indicator is now hidden");
      });
    };
    $scope.decline = {};
    $scope.declinetask = function (surveyId, assignId, message) {
      $scope.show();
      $scope.decline.surveyId = surveyId;
      $scope.decline.assignId = assignId;
      $scope.decline.empId = $scope.id;
      $scope.decline.message = message;
      console.log($scope.decline);
      //  $scope.decline.empMail =$scope.profile.mai;
      MyServices.Decline($scope.decline, function (data) {
        if (data.value) {
          $scope.hide();
          console.log(data);
          $scope.doRefresh();
        }
      });
    };





    //upload image----------------------------------------------------------------
    $scope.uploadImage = function (imageURI, arrayName, callback) {
      console.log('imageURI', imageURI);
      // $scope.showLoading('Uploading Image...', 10000);
      $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
        .then(function (result) {
          // Success!
          // $scope.hideLoading();
          result.response = JSON.parse(result.response);
          console.log(result.response.data[0]);

          if (arrayName === 'photos') {
            // $scope.photos = _.flatten($scope.photos);
            $scope.photos1.push(result.response.data[0]);
            console.log($scope.photos1);
            // $scope.photos = _.chunk($scope.photos, 3);
          } else if (arrayName === 'Document') {
            // $scope.doc = _.flatten($scope.doc);
            $scope.doc1.push(result.response.data[0]);
            console.log($scope.doc1);
            // $scope.doc = _.chunk($scope.doc, 3);
          } else {
            // $scope.jir = _.flatten($scope.jir);
            $scope.jir1.push(result.response.data[0]);
            console.log($scope.jir1);
            // $scope.jir = _.chunk($scope.jir, 3);
          }
          callback(null, result);
        }, function (err) {
          // Error
        }, function (progress) {
          // constant progress updates
        });
    };






    $scope.information = function (index, parent) {
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
    $scope.closePopup = function () {
      $scope.infos.close();
    }

    $scope.showPopup = function (surveyId, assignId) {
      $scope.data = {};

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<textarea placeholder="Reason" ng-model="data.message" class="decline-input"></textarea>',
        title: 'Please submit the reason for decline the task',
        cssClass: 'declinepop',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [{
            text: 'Cancel'
          },
          {
            text: '<b>Submit</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (!$scope.data.message) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
              } else {
                $scope.declinetask(surveyId, assignId, $scope.data.message);

              }
            }
          }
        ]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

      // $timeout(function() {
      //    myPopup.close(); //close the popup after 3 seconds for some reason
      // }, 10000);
    };
    $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
      $scope.task = [];
      console.log("GOOD");
      $timeout(function () {
        $scope.doRefresh();
      }, 300);
    });

    $scope.showAlert = function (text) {
      var alertPopup = $ionicPopup.alert({
        template: text
      });
      alertPopup.then(function (res) {
        // $state.go('app.task');
      });
    };

  })

  .controller('PhotosDocumentsCtrl', function ($scope, $cordovaCamera, $ionicLoading, $cordovaNetwork, $ionicModal, $ionicPopup, $ionicActionSheet, $cordovaFileTransfer, $state, $stateParams, $ionicPopup, $rootScope, MyServices, $cordovaImagePicker) {
    //initialize all objects start-----------------------------------------------
    $scope.photos = [];
    $scope.doc = [];
    $scope.jir = [];
    $scope.photos1 = [];
    $scope.doc1 = [];
    $scope.jir1 = [];
    $scope.document = {};
    $scope.surveyform = {};
    $scope.profile = $.jStorage.get('profile');
    // console.log($scope.profile);
    // console.log($scope.profile._id);
    $scope.document.empId = $scope.profile._id;
    $scope.document.assignId = $stateParams.assignId;
    $scope.document.surveyId = $stateParams.surveyId;
    $scope.newUser = {};
    $scope.newUser.surveyDate = new Date();
    //initialize all objects end------------------------------------------------------

    //picture upload action sheet popup--------------------------------------------
    $scope.showActionsheet = function (arrayName) {
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
        cancel: function () {
          console.log('CANCELLED');
        },
        buttonClicked: function (index) {
          console.log('BUTTON CLICKED', index);
          if (index == 0) {
            $scope.getImageSaveContact(arrayName);
          } else {
            $scope.openCamera(arrayName);
          }
          return true;
        },
        destructiveButtonClicked: function () {
          console.log('DESTRUCT');
          return true;
        }
      });
    };

    //picture upload action sheet popup--------------------------------------------
    $scope.showActionsheet = function (arrayName) {
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
        cancel: function () {
          console.log('CANCELLED');
        },
        buttonClicked: function (index) {
          console.log('BUTTON CLICKED', index);
          if (index == 0) {
            $scope.getImageSaveContact(arrayName);
          } else {
            $scope.openCamera(arrayName);
          }
          return true;
        },
        destructiveButtonClicked: function () {
          console.log('DESTRUCT');
          return true;
        }
      });
    };

    //take image from camera --------------------------------------------------------
    $scope.openCamera = function (arrayName) {
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
      $cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
        $scope.imageSrc = "data:image/jpeg;base64," + imageData;
        console.log(arrayName);

        if (arrayName === 'photos') {
          $scope.photos = _.flatten($scope.photos);
          // $scope.uploadImage($scope.imageSrc, arrayName);
          $scope.photos.push($scope.imageSrc);
          $scope.photos = _.chunk($scope.photos, 3);
        } else if (arrayName === 'Document') {
          $scope.doc = _.flatten($scope.doc);
          $scope.doc.push($scope.imageSrc);
          // $scope.uploadImage($scope.imageSrc, arrayName);
          $scope.doc = _.chunk($scope.doc, 3);
        } else {
          $scope.jir = _.flatten($scope.jir);
          $scope.jir.push($scope.imageSrc);
          // $scope.uploadImage($scope.imageSrc, arrayName);
          $scope.jir = _.chunk($scope.jir, 3);
        }
      }, function (err) {

        console.log(err);
      });
    };

    //cordovaImagePicker function------------------------------------------------------
    $scope.getImageSaveContact = function (arrayName) {
      console.log(arrayName);
      // Image picker will load images according to these settings
      var options = {
        maximumImagesCount: 20, // Max number of selected images
        width: 800,
        height: 800,
        quality: 80 // Higher is better
      };
      $cordovaImagePicker.getPictures(options).then(function (results) {
        console.log(results);
        console.log(arrayName);
        if (arrayName === 'photos') {
          $scope.photos = _.flatten($scope.photos);
          // _.forEach(results, function(value) {
          //   $scope.uploadImage(value, arrayName);
          // });
          _.forEach(results, function (value) {
            $scope.photos.push(value);
          });
          $scope.photos = _.chunk($scope.photos, 3);
        } else if (arrayName === 'Document') {
          $scope.doc = _.flatten($scope.doc);
          // _.forEach(results, function(value) {
          //   $scope.uploadImage(value, arrayName);
          // });
          _.forEach(results, function (value) {
            $scope.doc.push(value);
          });
          $scope.doc = _.chunk($scope.doc, 3);
        } else {
          $scope.jir = _.flatten($scope.jir);
          // _.forEach(results, function(value) {
          //   $scope.uploadImage(value, arrayName);
          // });
          _.forEach(results, function (value) {
            $scope.jir.push(value);
          });
          $scope.jir = _.chunk($scope.jir, 3);
        }
      }, function (error) {
        console.log('Error: ' + JSON.stringify(error)); // In case of error
      });
    };


    //remove image from array-----------------------------------------------------
    $scope.showConfirm = function (image, arrayName) {
      var confirmPopup = $ionicPopup.confirm({
        template: ' Are you sure you want to remove this?',
        cssClass: 'remove'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          if (arrayName === 'photos') {
            $scope.photos = _.flatten($scope.photos);
            _.remove($scope.photos, function (n) {
              return n === image;
            });
            $scope.photos = _.chunk($scope.photos, 3);
            console.log($scope.photos);
          } else if (arrayName === 'Document') {
            $scope.doc = _.flatten($scope.doc);
            _.remove($scope.doc, function (n) {
              return n === image;
            });
            $scope.doc = _.chunk($scope.doc, 3);
            console.log($scope.doc);

          } else {
            $scope.jir = _.flatten($scope.jir);
            _.remove($scope.jir, function (n) {
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

    //survey form modal --------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/modal/survey-form.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    //survey popup close----------------------------------------------------------
    $scope.surveyClose = function () {
      $scope.survey.close();
    }

    // alert popup for all---------------------------------------------------------
    $scope.showAlert = function (text) {
      var alertPopup = $ionicPopup.alert({
        template: text
      });
      alertPopup.then(function (res) {
        // $state.go('app.task');
      });
    };

    //survey form open popup-------------------------------------------------------------------
    $scope.surveyOpen = function () {
      $scope.msg = false;
      if (!(_.isEmpty($scope.photos) && _.isEmpty($scope.doc) && _.isEmpty($scope.jir))) {
        if (!(_.isEmpty($scope.jir))) {
          // //photos
          //   $scope.document.photos = [];
          //   $scope.photos1 = _.flatten($scope.photos);
          //   _.forEach($scope.photos1, function(value) {
          //     $scope.document.photos.push({
          //       "file": value
          //     });
          //   });
          //   //doc
          //   $scope.document.doc = [];
          //   $scope.doc1 = _.flatten($scope.doc);
          //   _.forEach($scope.doc1, function(value) {
          //     $scope.document.doc.push({
          //       "file": value
          //     });
          //   });
          //   //jir
          //   $scope.document.jir = [];
          //   $scope.jir1 = _.flatten($scope.jir);
          //
          //   _.forEach($scope.jir1, function(value) {
          //     $scope.document.jir.push({
          //       "file": value
          //     });
          //   });
          $scope.survey = $ionicPopup.show({
            templateUrl: 'templates/modal/survey-form.html',
            scope: $scope,
          });

        } else {
          $scope.showAlert('Please add JIR ');
        }

      } else {
        $scope.showAlert('Please add attachments ');
      }
    };


    //loader function-------------------------------------------------------------
    $scope.showLoading = function (value, time) {
      $ionicLoading.show({
        template: value,
        duration: time
      });
    };
    $scope.hideLoading = function () {
      $ionicLoading.hide();
    };

    //task submit api ------------------------------------------------------------------------
    $scope.mobileSubmit = function (newuser) {
      // $scope.surveyform = newuser;
      $scope.document = newuser;
      // $scope.document.surveyDate = $scope.surveyform.surveyDate;
      // $scope.document.startTime = $scope.surveyform.startTime;
      // $scope.document.endTime = $scope.surveyform.endTime;
      // $scope.document.address = $scope.surveyform.address;
      // _.forEach($scope.document.photos, function (value) {
      //   $scope.photos.push(
      //     value
      //   );
      // });
      // _.forEach($scope.document.doc, function (value) {
      //   $scope.doc.push(
      //     value
      //   );
      // });
      // _.forEach($scope.document.jir, function (value) {
      //   $scope.jir.push(
      //     value
      //   );
      // });

      $scope.document.photos = $scope.photos;
      $scope.document.doc = $scope.doc;
      $scope.document.jir = $scope.jir;
      $scope.document.empId = $scope.profile._id;
      $scope.document.assignId = $stateParams.assignId;
      $scope.document.surveyId = $stateParams.surveyId;
      console.log($scope.document);
      // $scope.showLoading('Please wait...', 15000);
      if ($cordovaNetwork.isOnline()) {
        uploadData();
      } else {
        $rootScope.document.push($scope.document);
        // $.jStorage.set('taskpending', $rootScope.document);
        // $scope.hideLoading();
        $scope.msg = true;

      }
    }

    function uploadData() {
      console.log($scope.photos);
      console.log($scope.doc);
      console.log($scope.jir);
      async.parallel({
        photos: function (callback) {
          async.each(_.flatten($scope.photos), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'photos', callback);

          }, function (err, data) {
            callback(null, data);
          });
        },
        document: function (callback) {
          async.each(_.flatten($scope.doc), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'Document', callback);

          }, function (err, data) {
            callback(null, data);
          });
        },
        jir: function (callback) {
          async.each(_.flatten($scope.jir), function (value, callback) {
            console.log(value);
            $scope.uploadImage(value, 'JIR', callback);

          }, function (err, data) {
            callback(null, data);
          });
        }
      }, function (err, data) {

        console.log($scope.photos1);
        console.log($scope.doc1);
        console.log($scope.jir1);
        //
        $scope.document.photos = [];
        $scope.document.doc = [];
        $scope.document.jir = [];
        $scope.document.photos.length = 0;

        // $scope.photos1 = _.flatten($scope.photos);
        _.forEach($scope.photos1, function (value) {
          $scope.document.photos.push({
            "file": value
          });
        });
        //doc
        $scope.document.doc.length = 0;
        // $scope.doc1 = _.flatten($scope.doc);
        _.forEach($scope.doc1, function (value) {
          $scope.document.doc.push({
            "file": value
          });
        });
        //jir
        $scope.document.jir.length = 0;
        // $scope.jir1 = _.flatten($scope.jir)
        _.forEach($scope.jir1, function (value) {
          $scope.document.jir.push({
            "file": value
          });
        });
        MyServices.mobileSubmit($scope.document, function (data) {

          if (data.value) {
            // $scope.hideLoading();
            console.log(data);
            $scope.msg = true;
            // $scope.surveyClose();
            // $state.go('app.task');
          } else {
            console.log(data.value);
            // $scope.hideLoading();
          }
        });
      });



    }

    //msg----------------------------------------------------------------------00

    $scope.msgsubmit = function () {
      $scope.surveyClose();
      $state.go('app.task');
    }
    //upload image----------------------------------------------------------------
    $scope.uploadImage = function (imageURI, arrayName, callback) {
      console.log('imageURI', imageURI);
      // $scope.showLoading('Uploading Image...', 10000);
      $cordovaFileTransfer.upload(adminurl + 'upload', imageURI)
        .then(function (result) {
          // Success!
          // $scope.hideLoading();
          result.response = JSON.parse(result.response);
          console.log(result.response.data[0]);

          if (arrayName === 'photos') {
            // $scope.photos = _.flatten($scope.photos);
            $scope.photos1.push(result.response.data[0]);
            console.log($scope.photos1);
            // $scope.photos = _.chunk($scope.photos, 3);
          } else if (arrayName === 'Document') {
            // $scope.doc = _.flatten($scope.doc);
            $scope.doc1.push(result.response.data[0]);
            console.log($scope.doc1);
            // $scope.doc = _.chunk($scope.doc, 3);
          } else {
            // $scope.jir = _.flatten($scope.jir);
            $scope.jir1.push(result.response.data[0]);
            console.log($scope.jir1);
            // $scope.jir = _.chunk($scope.jir, 3);
          }
          callback(null, result);
        }, function (err) {
          // Error
        }, function (progress) {
          // constant progress updates
        });
    };



  })

  .controller('EmergencyCtrl', function ($scope) {})

  .controller('SurveyCtrl', function ($scope, $ionicScrollDelegate) {
    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
      $ionicScrollDelegate.resize();
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop();
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };
  });

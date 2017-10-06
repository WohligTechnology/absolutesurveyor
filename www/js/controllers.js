angular.module('starter.controllers', ['ngCordova', 'ngCordovaOauth'])

  .controller('AppCtrl', function ($scope, $rootScope, MyServices, $ionicModal, $state, $timeout, $ionicHistory) {
    $scope.profile = $.jStorage.get('profile');
    // $rootScope.document = [];
    $scope.getprofile = function () {
      $scope.profile = $.jStorage.get('profile');
    };

    //to refresh page
    $scope.doRefresh = function () {
      $state.reload();
    }


    // $state.go($state.current, {}, { reload: true });
    $scope.logout = function () {
      var logoutData = {};
      logoutData.empId = $scope.profile._id;
      logoutData.deviceId = $rootScope.deviceId;
      MyServices.mobileLogout(logoutData, function (data) {
        if (data.value) {
          $.jStorage.set('profile', null);
          $.jStorage.deleteKey('profile');
          $.jStorage.flush();
          $state.go('login');
        }
      })



      if ($.jStorage.get('profile') === null) {
        $state.go('login');

      }


    };

  })

  .controller('LoginCtrl', function ($scope, $ionicPopup, $rootScope, $state, MyServices, $ionicLoading, $cordovaOauth) {
    $scope.profile = {};
    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile) {

      // console.log($rootScope.document);
      $state.go('app.task');
    }


    // $scope.login = function() {
    //   console.log("hi");
    //     $cordovaOauth.google("AIzaSyDEckQh5-njghsAhWUs1gT6qjIfmuqlpOo", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
    //         console.log(JSON.stringify(result));
    //     }, function(error) {
    //         console.log(error);
    //     });
    // }

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
    $scope.callAPI = function (email) {
      $scope.showLoading('Please wait...', 10000);
      $.jStorage.set('profile', null);
      $.jStorage.deleteKey('profile');
      $.jStorage.flush();
      MyServices.Login(email, function (data) {
        if (data.value) {
          $scope.hideLoading();
          $rootScope.taskpending = [];
          $.jStorage.set('profile', data.data);
          $state.go('app.task');
        } else {
          $scope.hideLoading();
          $scope.showAlert();
        }
      });
    };

    //To get device id before login
    $scope.login = function (loginData) {
      $scope.showLoading('Please wait...', 15000);
      if (window.plugins) {
        if (window.plugins.OneSignal) {
          window.plugins.OneSignal.getIds(function (ids) {
            loginData.deviceId = ids.userId;
            $rootScope.deviceId = ids.userId;
            if (loginData.deviceId) {
              $scope.callAPI(loginData);
            } else {
              $scope.callAPI(loginData);
            }
          });
        }
      } else {
        $scope.callAPI(loginData);
      }
    };


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

  .controller('TaskCtrl', function ($scope, $ionicPopup, $interval, $ionicNavBarDelegate, $state, $ionicHistory, $rootScope, $ionicLoading, $cordovaFileTransfer, $cordovaNetwork, MyServices, $timeout, MyFlagValue) {
    $scope.profile = {};
    $scope.profile = $.jStorage.get('profile');
    $scope.page = 1;
    // $rootScope.refresh = true;
    $scope.more = {
      Data: true
    };

    //To display refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'block');

    //To select the surveyor 
    $scope.getSurveyour = function (value) {
      var obj = {
        lat: value.lat,
        lng: value.lng,
        assignId: value._id,
        surveyId: value.survey._id,
        currentEmpId: value.survey.employee
      }

      $.jStorage.set('assignmentObj', obj);
      $state.go('app.selectSurveyor');
    };


    $rootScope.$on('proximityCatched', function () {
      $state.reload();
    });
    $scope.$on('$ionicView.enter', function (e) {
      $ionicNavBarDelegate.showBar(true);
    });
    // $rootScope.$on('toTask', function () {   
    //     $state.reload();
    // });



    //To set flag for task tab
    MyFlagValue.setFlag("task");
    if ($scope.profile) {
      console.log($scope.profile);
    } else {
      $state.go('login');
    }

    // $rootScope.task = {};
    $scope.photos = {};
    $scope.doc = {};
    $scope.jir = {};
    $scope.photos1 = [];
    $scope.doc1 = [];
    $scope.jir1 = [];
    $rootScope.isOnline = false;
    $rootScope.shouldUpload = true;

    // console.log($rootScope.document);
    // $scope.taskpending = $.jStorage.get('taskpending');
    // console.log($scope.taskpending);
    document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork();

      $rootScope.isOnline = $cordovaNetwork.isOnline();

      var isOffline = $cordovaNetwork.isOffline();

      $scope.taskcomplete = [];
      $scope.taskIncomplete = [];
      $rootScope.shouldUpload = true;
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $rootScope.taskpending = $.jStorage.get('taskpending');
        console.log($rootScope.taskpending);
        var onlineState = networkState;
        if ($rootScope.shouldUpload) {
          $rootScope.shouldUpload = false;
          var i = 0;
          async.eachSeries(_.cloneDeep($rootScope.taskpending), function (value, callback) {
            uploadData(value, i, function (err, data) {
              if (err) {
                callback(err);
              } else {
                $rootScope.taskpending.shift();
                callback(null, data);
              }
            });
          }, function (err, data) {
            $rootScope.shouldUpload = true;
            // callback(null, data);
            $.jStorage.set('taskpending', []);
            $scope.profile = {};
            $scope.id = {};
            $scope.profile = $.jStorage.get('profile');
            $scope.id = null;
            $scope.id = $scope.profile._id;
          });
        }
        // $scope.taskfun();
        // $scope.doRefresh();
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        $rootScope.taskpending = [];
        $rootScope.taskpending = $.jStorage.get('taskpending');
        console.log($rootScope.taskpending);

        var offlineState = networkState;
        console.log(offlineState);
        $scope.doRefresh();
      });

    }, false);

    function uploadData(value, i, callback) {
      $scope.document = value;
      console.log($scope.document.taskPendingStatus);
      if (!value.taskPendingStatus) {
        $rootScope.taskpending[i].taskPendingStatus = true;
        console.log(value);
        console.log($scope.document);
        $scope.photos = _.cloneDeep($scope.document.photos);
        $scope.doc = _.cloneDeep($scope.document.doc);
        $scope.jir = _.cloneDeep($scope.document.jir);
        console.log($scope.photos);
        console.log($scope.doc);
        console.log($scope.jir);
        async.parallel({
          photos: function (callback) {
            async.each(_.flatten($scope.photos), function (value, callback) {
              console.log(value);
              uploadImage(value, 'photos', callback);

            }, function (err, data) {
              callback(null, data);
            });
          },
          document: function (callback) {
            async.each(_.flatten($scope.doc), function (value, callback) {
              console.log(value);
              uploadImage(value, 'Document', callback);

            }, function (err, data) {
              callback(null, data);
            });
          },
          jir: function (callback) {
            async.each(_.flatten($scope.jir), function (value, callback) {
              console.log(value);
              uploadImage(value, 'JIR', callback);

            }, function (err, data) {
              callback(null, data);
            });
          }
        }, function (err, data) {
          $scope.document.photos = [];
          $scope.document.doc = [];
          $scope.document.jir = [];
          $scope.document.photos.length = 0;
          console.log("done");
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
          console.log("hry", $scope.document);
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
              // $rootScope.taskpending.shift();
              callback(null, $scope.taskcomplete);
            } else {
              console.log(data.value);
              callback(null, data);
            }
          });

        });
      }
    }

    $scope.taskfun = function () {
      console.log("online status", $rootScope.isOnline);
      // if ($rootScope.isOnline) {
      //
      // $rootScope.taskpending = $.jStorage.get('taskpending');
      console.log($rootScope.taskpending);

      // var onlineState = networkState;
      if (_.isEmpty($rootScope.taskpending)) {

        console.log("empty", $rootScope.taskpending);
        // $scope.doRefresh();
        $scope.profile = {};
        $scope.id = {};
        $scope.profile = $.jStorage.get('profile');
        $scope.id = null;
        $scope.id = $scope.profile._id;
        $ionicLoading.show({
          template: '<img src="img/loading.gif" height="50" width="50">',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 100
        });
        MyServices.Task({
          id: $scope.id,
          page: $scope.page
        }, function (data) {
          console.log($scope.id);
          $scope.notask = false;
          console.log(data.data.length);
          if (data.data.length === 0) {
            $ionicLoading.hide();
            $scope.notask = true;
            $scope.more.Data = false;
            console.log(data);
          }
          if (data.value) {
            if (data.data.length > 0) {
              console.log(data);
              _.forEach(data.data, function (value) {
                $scope.task.push(value);
              });
              // $scope.task = $.jStorage.get('task');
              $.jStorage.set('task', $scope.task);
              // $scope.more.Data = true;
              $.jStorage.set('taskpending', []);
              // $scope.page++;
              $ionicLoading.hide();
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.offtask();
            } else {
              $scope.more.Data = false;
              $ionicLoading.hide();
            }


          } else {
            // $scope.showAlert();
            $ionicLoading.hide();
            $scope.notask = true;
            $scope.more.Data = false;
          }
        });
      } else {
        if ($rootScope.isOnline) {
          $rootScope.shouldUpload = true;

          if ($rootScope.shouldUpload) {

            $rootScope.shouldUpload = false;
            // debugger;
            var i = 0;
            async.eachSeries(_.cloneDeep($rootScope.taskpending), function (value, callback) {

              uploadData(value, i, function (err, data) {
                if (err) {
                  callback(err);
                } else {
                  $rootScope.taskpending.shift();
                  console.log("$rootScope.taskpending", $rootScope.taskpending);
                  callback(null, data);
                }
              });
              i++;
            }, function (err, data) {
              $rootScope.shouldUpload = true;
              // $scope.doRefresh();
              $.jStorage.set('taskpending', []);
              $scope.profile = {};
              $scope.id = {};
              $scope.profile = $.jStorage.get('profile');
              $scope.id = null;
              $scope.id = $scope.profile._id;
              // $ionicLoading.show({
              //   template: '<img src="img/loading.gif" height="50" width="50">',
              //   animation: 'fade-in',
              //   showBackdrop: true,
              //   maxWidth: 500,
              //   showDelay: 100
              // });
              MyServices.Task({
                id: $scope.id,
                page: $scope.page
              }, function (data) {
                console.log($scope.id);
                $scope.notask = false;
                console.log(data.data.length);
                if (data.data.length === 0) {
                  $ionicLoading.hide();
                  $scope.notask = true;
                  $scope.more.Data = false;
                  console.log(data);
                }
                if (data.value) {
                  if (data.data.length > 0) {
                    _.forEach(data.data, function (value) {
                      $scope.task.push(value);
                    });

                    // $scope.task = $.jStorage.get('task');
                    $.jStorage.set('task', $scope.task);
                    // $scope.more.Data = true;
                    $.jStorage.set('taskpending', []);
                    $rootScope.taskpending = [];
                    // $scope.page++;
                    $scope.offtask();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicLoading.hide();
                  } else {
                    $scope.more.Data = false;
                    $ionicLoading.hide();
                  }


                  // console.log(data);
                  // $.jStorage.set('task', data.data);
                  // $scope.task = $.jStorage.get('task');
                  // $.jStorage.set('taskpending', []);
                  // $scope.offtask();
                } else {
                  // $scope.showAlert();
                  $scope.notask = true;
                  $scope.more.Data = false;
                  $ionicLoading.hide();
                }
              });
              // callback(null, data);
            });

            // $scope.doRefresh();
          }
        }
      }
      // }
    };
    $scope.loadMore = function () {
      $scope.page++;
      $scope.taskfun();
    };
    $scope.offtask = function () {
      $scope.task = $.jStorage.get('task');
      if ($scope.task) {
        $rootScope.taskpending = $.jStorage.get('taskpending');

        console.log("i am in the offline man");
        if (_.isArray($rootScope.taskpending) && _.isArray($scope.task)) {

          _.each($scope.task, function (v) {

            var val2 = v._id;
            v.taskPendingStatus = false
            _.each($rootScope.taskpending, function (values) {
              var val1 = values.assignId.toString();


              console.log("taskpending .................", values, val1, val2);

              if (val1 == val2) {
                v.taskPendingStatus = true;
                console.log("taskpending ................. true", v);

              }
              // else {
              //   $scope.task[i].taskPendingStatus = false;
              //               console.log("taskpending ................. false",$scope.task[i].taskPendingStatus);

              // }
            })

          });
        }
        $.jStorage.set('task', $scope.task);

        var
          monthLabels = ["Jan", "Feb", "March",
            "April", "May", "June",
            "July", "Aug", "Sep",
            "Oct", "Nov", "Dec"
          ];
        var items = $scope.task;
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
      }
    };
    $scope.offtask();
    $scope.task = [];
    $scope.taskfun();
    $scope.doRefresh = function () {

      console.log('Refreshing!');
      $timeout(function () {
        //simulate async response
        if ($cordovaNetwork.isOnline()) {
          $scope.taskfun();
        } else {
          $scope.offtask();
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
    // $scope.uploadImage = function (imageURI, arrayName, callback) {
    function uploadImage(imageURI, arrayName, callback) {
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
          console.log(err);
          // Error
        }, function (progress) {
          // console.log(err);
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
    };
    $scope.closePopup = function () {
      $scope.infos.close();
    };

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
        }, {
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
        }]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

      // $timeout(function() {
      //    myPopup.close(); //close the popup after 3 seconds for some reason
      // }, 10000);
    };
    // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //   $scope.task = [];
    //   console.log("GOOD");
    //   $timeout(function() {
    //     $scope.doRefresh();
    //   }, 300);
    // });

    $scope.showAlert = function (text) {
      var alertPopup = $ionicPopup.alert({
        template: text
      });
      alertPopup.then(function (res) {
        // $state.go('app.task');
      });
    };

  })

  .controller('PhotosDocumentsCtrl', function ($scope, $filter, $ionicNavBarDelegate, $cordovaCamera, $ionicLoading, $cordovaNetwork, $ionicModal, $ionicActionSheet, $cordovaFileTransfer, $state, $stateParams, $ionicPopup, $rootScope, MyServices, $cordovaImagePicker, MyFlagValue, backgroundLocationTracking) {
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
    $scope.isDisable = true;
    // $rootScope.refresh = false;

    // console.log($scope.profile);
    // console.log($scope.profile._id);
    $scope.document.empId = $scope.profile._id;
    $scope.document.assignId = $stateParams.assignId;
    $scope.document.surveyId = $stateParams.surveyId;
    $scope.document.department = $stateParams.department;
    $scope.newUser = {};
    $scope.newUser.surveyDate = new Date();

    //To hide refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'none');

    //$scope.maxDate = new Date();
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    if (month < 10) {
      month = '0' + month;
    }
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    $scope.maxDate = year + "-" + month + "-" + day;
    console.log("$scope.newUser.surveyDatee", $scope.newUser.surveyDate);

    $scope.$on('$ionicView.enter', function (e) {
      $ionicNavBarDelegate.showBar(true);
    });


    //Function to get marine logic
    $scope.getMarineLogic = function () {
      $state.go('app.marineSurvey');
    }

    //To get flag value
    $scope.flag = MyFlagValue.getFlag();
    //initialize all objects end------------------------------------------------------

    //picture upload action sheet popup--------------------------------------------
    $scope.showActionsheet = function (arrayName) {
      // console.log(arrayName);
      // $ionicActionSheet.show({
      //   //  titleText: 'choose option',
      //   buttons: [{
      //     text: '<i class="icon ion-ios-camera-outline"></i> Choose from gallery'
      //   }
      //   // , {
      //   //   text: '<i class="icon ion-images"></i> Take from camera'
      //   // }, 
      //   ],
      //   //  destructiveText: 'Delete',
      //   cancelText: 'Cancel',
      //   cancel: function () {
      //     console.log('CANCELLED');
      //   },
      //   buttonClicked: function (index) {
      //     console.log('BUTTON CLICKED', index);
      //     if (index === 0) {
      //       $scope.getImageSaveContact(arrayName);
      //     } else {
      //       $scope.openCamera(arrayName);
      //     }
      //     return true;
      //   },
      //   destructiveButtonClicked: function () {
      //     console.log('DESTRUCT');
      //     return true;
      //   }
      // });

      /*********************** Please uncomment following code for marine logic *****************************************************/
      // if ($scope.document.department == "Marine Cargo") {
      //   $state.go('app.marineSurvey');
      // } else {
      //   $scope.getImageSaveContact(arrayName);
      // }

      $scope.getImageSaveContact(arrayName);
    };

    //take image from camera --------------------------------------------------------
    // $scope.openCamera = function (arrayName) {
    //   console.log(arrayName);

    //   var cameraOptions = {
    //     quality: 60,
    //     destinationType: Camera.DestinationType.DATA_URL,
    //     sourceType: Camera.PictureSourceType.CAMERA,
    //     allowEdit: false,
    //     encodingType: 0,
    //     targetWidth: 4096,
    //     targetHeight: 4096,
    //     popoverOptions: CameraPopoverOptions,
    //     saveToPhotoAlbum: true,
    //     correctOrientation: true
    //   };
    //   $cordovaCamera.getPicture(cameraOptions).th        $http({
    //       url: adminurl + 'Assignment/mobileSubmit',
    //       method: 'POST',
    //       withCredentials: true,
    //       data: data
    //     }).successen(function (imageData) {
    //     $scope.imageSrc = "data:image/jpeg;base64," + imageData;
    //     console.log(arrayName);

    //     if (arrayName === 'photos') {
    //       $scope.photos = _.flatten($scope.photos);
    //       // $scope.uploadImage($scope.imageSrc, arrayName);
    //       $scope.photos.push($scope.imageSrc);
    //       $scope.photos = _.chunk($scope.photos, 3);
    //     } else if (arrayName === 'Document') {
    //       $scope.doc = _.flatten($scope.doc);
    //       $scope.doc.push($scope.imageSrc);
    //       // $scope.uploadImage($scope.imageSrc, arrayName);
    //       $scope.doc = _.chunk($scope.doc, 3);
    //     } else {
    //       $scope.jir = _.flatten($scope.jir);
    //       $scope.jir.push($scope.imageSrc);
    //       // $scope.uploadImage($scope.imageSrc, arrayName);
    //       $scope.jir = _.chunk($scope.jir, 3);
    //     }
    //   }, function (err) {

    //     console.log(err);
    //   });
    // };


    // var options = {
    //       uri: imageData,
    //       quality: 90,
    //       width: 3000,
    //       height: 2000
    //     };

    //     window.ImageResizer.resize(options,
    //       function (image) {
    //         // success: image is the new resized image
    //         if (arrayName === 'photos') {
    //           $scope.photos = _.flatten($scope.photos);
    //           // $scope.uploadImage($scope.imageSrc, arrayName);
    //           $scope.photos.push(image);
    //           $scope.photos = _.chunk($scope.photos, 3);
    //         } else if (arrayName === 'Document') {
    //           $scope.doc = _.flatten($scope.doc);
    //           $scope.doc.push(image);
    //           // $scope.uploadImage($scope.imageSrc, arrayName);
    //           $scope.doc = _.chunk($scope.doc, 3);
    //         } else {
    //           $scope.jir = _.flatten($scope.jir);
    //           $scope.jir.push(image);
    //           // $scope.uploadImage($scope.imageSrc, arrayName);
    //           $scope.jir = _.chunk($scope.jir, 3);
    //         }
    //       },
    //       function () {
    //         // failed: grumpy cat likes this function
    //         console.log("error in photo resizer plugins");
    //       });


    //cordovaImagePicker function------------------------------------------------------
    $scope.getImageSaveContact = function (arrayName) {
      console.log(arrayName);
      // Image picker will load images according to these settings
      var options = {
        maximumImagesCount: 20, // Max number of selected images
        width: 3096,
        height: 3096,
        quality: 60 // Higher is better
      };

      cordova.plugins.diagnostic.isCameraAuthorized({
        successCallback: function (authorized) {
          console.log("authorized jsfhdfjsjdf", authorized);
          console.log("App is " + (authorized ? "authorized" : "denied") + " access to the camera");
          if (authorized == false) {
            cordova.plugins.diagnostic.requestCameraAuthorization({
              successCallback: function (status) {
                console.log("Authorization request for camera use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
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
                  console.log('Error: ' + JSON.stringify(error));
                });
              },
              errorCallback: function (error) {
                console.error(error);
              }
            });

          } else {
            console.log("jdkjdlfjskdfjklasdjfkl");
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
              console.log('Error: ' + JSON.stringify(error));
            });
          }
        },
        errorCallback: function (error) {
          console.error("The following error occurred: " + error);
        }
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
    };

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
      $scope.msgSub = false;
      //If from task tab
      if ($scope.flag == "task") {
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
      } else if ($scope.flag == "history") { //If from history tab
        $scope.survey = $ionicPopup.show({
          templateUrl: 'templates/modal/survey-form.html',
          scope: $scope,
        });
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
      console.log("newuser1", newuser);
      newuser.surveyTime = new Date();
      console.log("newuser2", newuser);
      $scope.document = _.cloneDeep(newuser);
      console.log("$scope.document", $scope.document);
      $scope.msgSub = true;

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


      $scope.document.photos = {};
      $scope.document.doc = {};
      $scope.document.jir = {};
      $scope.document.photos = _.clone($scope.photos);
      $scope.document.doc = _.clone($scope.doc);
      $scope.document.jir = _.clone($scope.jir);
      $scope.document.empId = $scope.profile._id;
      $scope.document.assignId = $stateParams.assignId;
      $scope.document.surveyId = $stateParams.surveyId;
      $scope.document.status = false;
      $scope.document.latitude = $rootScope.latitude;
      $scope.document.longitude = $rootScope.longitude;
      $scope.document.isMobile = true;
      console.log($scope.document);
      $scope.showLoading('Please wait...', 15000);
      //
      // if ($cordovaNetwork.isOnline()) {
      //   uploadData();
      // } else {

      if ($scope.flag == "task") {
        $rootScope.taskpending.push($scope.document);
        $.jStorage.set('taskpending', $rootScope.taskpending);
      } else if ($scope.flag == "history") {
        $rootScope.historyTaskPending.push($scope.document);
        $.jStorage.set('historyTaskPending', $rootScope.historyTaskPending);
      }
      $scope.msg = true;
      $scope.hideLoading();
      $scope.msgSub = true;

      //
      // }
    };

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
            $scope.hideLoading();
            console.log(data);
            $scope.msg = true;
            $scope.msgSub = true;

            // $scope.surveyClose();
            // $state.go('app.task');
          } else {
            console.log(data.value);
            $scope.hideLoading();
          }
        });

      });

    }

    //To disable submit button
    setInterval(function () {
      if (($rootScope.latitude != undefined && $rootScope.latitude != "") && ($rootScope.longitude != undefined && $rootScope.longitude != "")) {
        // alert("$rootScope.latitude " + $rootScope.latitude + " $rootScope.longitude " + $rootScope.longitude);
        if ($scope.isDisable == true) {
          $scope.isDisable = false;
          $scope.$apply();
        }
      } else {
        $scope.isDisable = true;
      }
    }, 1000);


    //msg----------------------------------------------------------------------00

    $scope.msgsubmit = function () {
      $scope.surveyClose();
      if ($scope.flag == "task") {
        // $rootScope.$broadcast('toTask', null)
        $state.go('app.task');
      } else if ($scope.flag == "history") {
        // $rootScope.$broadcast('toHistory', null)
        $state.go('app.history');
      }

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



  })


  //To show all history of user
  .controller('HistoryCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate, $state, $rootScope, $cordovaFileTransfer, $cordovaNetwork, MyServices, $timeout, $ionicLoading, MyFlagValue) {
    $scope.profile = {};
    $scope.page = 1;
    $scope.more = {
      Data: true
    };
    // $rootScope.refresh = true;
    //To set flag for history tab
    MyFlagValue.setFlag("history");
    // $rootScope.$on('toHistory', function () {   
    //     $state.reload();
    // });

    //To display refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'block');

    //To select the surveyor 
    $scope.getSurveyour = function (value) {
      var obj = {
        lat: value.lat,
        lng: value.lng,
        assignId: value._id,
        surveyId: value.survey._id,
        currentEmpId: value.survey.employee
      }

      $.jStorage.set('assignmentObj', obj);
      $state.go('app.selectSurveyor');
    };

    $scope.profile = $.jStorage.get('profile');
    if ($scope.profile) {
      console.log($scope.profile);
    } else {
      $state.go('login');
    }

    // $rootScope.task = {};
    $scope.photos = {};
    $scope.doc = {};
    $scope.jir = {};
    $scope.photos1 = [];
    $scope.doc1 = [];
    $scope.jir1 = [];
    $rootScope.isOnline = false;
    $rootScope.shouldUpload = true;

    $scope.$on('$ionicView.enter', function (e) {
      $ionicNavBarDelegate.showBar(true);
    });

    // console.log($rootScope.document);
    // $scope.taskpending = $.jStorage.get('taskpending');
    // console.log($scope.taskpending);
    document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork();

      $rootScope.isOnline = $cordovaNetwork.isOnline();

      var isOffline = $cordovaNetwork.isOffline();

      $scope.taskcomplete = [];
      $scope.taskIncomplete = [];
      $rootScope.shouldUpload = true;
      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
        $rootScope.historyTaskPending = $.jStorage.get('historyTaskPending');
        console.log($rootScope.historyTaskPending);
        var onlineState = networkState;
        if ($rootScope.shouldUpload) {
          $rootScope.shouldUpload = false;
          var i = 0;
          async.eachSeries(_.cloneDeep($rootScope.historyTaskPending), function (value, callback) {
            uploadData(value, i, function (err, data) {
              if (err) {
                callback(err);
              } else {
                $rootScope.historyTaskPending.shift();
                callback(null, data);
              }
            });
          }, function (err, data) {
            $rootScope.shouldUpload = true;
            // callback(null, data);
            $.jStorage.set('historyTaskPending', []);
            $scope.profile = {};
            $scope.id = {};
            $scope.profile = $.jStorage.get('profile');
            $scope.id = null;
            $scope.id = $scope.profile._id;
            // $scope.task = [];
            // MyServices.History($scope.id, function (data) {
            //   $scope.task = [];
            //   console.log($scope.id);
            //   $scope.notask = false;
            //   console.log(data.data.length);
            //   if (data.data.length === 0) {
            //     $scope.notask = true;
            //     $scope.more.Data = false;
            //     console.log(data);
            //   }
            //   if (data.value) {
            //     if (data.data.length > 0) {
            //       console.log(data);
            //       _.forEach(data.data, function (value) {
            //         $scope.task.push(value);
            //       });
            //       // $scope.task = $.jStorage.get('task');
            //       $.jStorage.set('historyTask', $scope.task);
            //       $scope.more.Data = true;
            //       $.jStorage.set('historyTaskPending', []);
            //       $scope.page++;
            //       $scope.offtask();
            //     } else {
            //       $scope.more.Data = false;
            //     }

            //     // console.log(data);
            //     // $.jStorage.set('historyTask', data.data);
            //     // $scope.task = $.jStorage.get('historyTask');
            //     // $.jStorage.set('historyTaskPending', []);
            //     // $scope.offtask();
            //   } else {
            //     // $scope.showAlert();
            //     $scope.more.Data = false;
            //     $scope.notask = true;
            //   }
            // });
            // callback(null, data);
            // $scope.taskfun();
          });
        }
        // $scope.taskfun();
        // $scope.doRefresh();
      });

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
        $rootScope.historyTaskPending = [];
        $rootScope.historyTaskPending = $.jStorage.get('historyTaskPending');
        console.log($rootScope.historyTaskPending);

        var offlineState = networkState;
        console.log(offlineState);
        $scope.doRefresh();
      });

    }, false);

    function uploadData(value, i, callback) {
      $scope.document = value;
      console.log($scope.document.historyTaskPendingStatus);
      if (!value.historyTaskPendingStatus) {
        $rootScope.historyTaskPending[i].historyTaskPendingStatus = true;
        console.log(value);
        console.log($scope.document);
        $scope.photos = _.cloneDeep($scope.document.photos);
        $scope.doc = _.cloneDeep($scope.document.doc);
        $scope.jir = _.cloneDeep($scope.document.jir);
        console.log($scope.photos);
        console.log($scope.doc);
        console.log($scope.jir);
        async.parallel({
          photos: function (callback) {
            async.each(_.flatten($scope.photos), function (value, callback) {
              console.log(value);
              uploadImage(value, 'photos', callback);

            }, function (err, data) {
              callback(null, data);
            });
          },
          document: function (callback) {
            async.each(_.flatten($scope.doc), function (value, callback) {
              console.log(value);
              uploadImage(value, 'Document', callback);

            }, function (err, data) {
              callback(null, data);
            });
          },
          jir: function (callback) {
            async.each(_.flatten($scope.jir), function (value, callback) {
              console.log(value);
              uploadImage(value, 'JIR', callback);

            }, function (err, data) {
              callback(null, data);
            });
          }
        }, function (err, data) {
          $scope.document.photos = [];
          $scope.document.doc = [];
          $scope.document.jir = [];
          $scope.document.photos.length = 0;
          console.log("done");
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
          console.log("hry", $scope.document);
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
              // $rootScope.taskpending.shift();
              callback(null, $scope.taskcomplete);
            } else {
              console.log(data.value);
              callback(null, data);
            }
          });

        });
      }
    }

    $scope.taskfun = function () {
      console.log("online status", $rootScope.isOnline);
      // if ($rootScope.isOnline) {
      //
      // $rootScope.taskpending = $.jStorage.get('taskpending');
      console.log($rootScope.historyTaskPending);

      // var onlineState = networkState;
      if (_.isEmpty($rootScope.historyTaskPending)) {

        console.log("empty", $rootScope.historyTaskPending);
        // $scope.doRefresh();
        $scope.profile = {};
        $scope.id = {};
        $scope.profile = $.jStorage.get('profile');
        $scope.id = null;
        $scope.id = $scope.profile._id;
        // $scope.task = [];
        $ionicLoading.show({
          template: '<img src="img/loading.gif" height="50" width="50">',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 100
        });
        MyServices.History({
          id: $scope.id,
          page: $scope.page
        }, function (data) {
          // $scope.task = [];
          console.log($scope.id);
          $scope.notask = false;
          console.log(data.data.length);

          if (data.data.length === 0) {
            $ionicLoading.hide();
            $scope.notask = true;
            $scope.more.Data = false;
            console.log(data);
          }
          if (data.value) {
            if (data.data.length > 0) {
              console.log(data, $scope.task);
              _.forEach(data.data, function (value) {
                $scope.task.push(value);
              });
              console.log("dash", $scope.task);
              // $scope.task = $.jStorage.get('task');
              $.jStorage.set('historyTask', $scope.task);
              $.jStorage.set('historyTaskPending', []);
              // $scope.page++;
              $scope.$broadcast('scroll.infiniteScrollComplete');
              $scope.offtask();
              $ionicLoading.hide();
            } else {
              $ionicLoading.hide();
              $scope.more.Data = false;
            }

            // console.log(data);
            // $.jStorage.set('historyTask', data.data);
            // $scope.task = $.jStorage.get('historyTask');
            // $.jStorage.set('historyTaskPending', []);
            // $scope.offtask();
          } else {
            // $scope.showAlert();
            $ionicLoading.hide();
            $scope.more.Data = false;
            $scope.notask = true;
          }
        });
      } else {
        if ($rootScope.isOnline) {
          $rootScope.shouldUpload = true;

          if ($rootScope.shouldUpload) {

            $rootScope.shouldUpload = false;
            // debugger;
            var i = 0;
            async.eachSeries(_.cloneDeep($rootScope.historyTaskPending), function (value, callback) {

              uploadData(value, i, function (err, data) {
                if (err) {
                  callback(err);
                } else {
                  $rootScope.historyTaskPending.shift();
                  console.log("$rootScope.historyTaskPending", $rootScope.historyTaskPending);
                  callback(null, data);
                }
              });
              i++;
            }, function (err, data) {
              $rootScope.shouldUpload = true;
              // $scope.doRefresh();
              $.jStorage.set('historyTaskPending', []);
              $scope.profile = {};
              $scope.id = {};
              $scope.profile = $.jStorage.get('profile');
              $scope.id = null;
              $scope.id = $scope.profile._id;
              // $scope.task = [];
              $ionicLoading.show({
                template: '<img src="img/loading.gif" height="50" width="50">',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 500,
                showDelay: 100
              });
              MyServices.History({
                id: $scope.id,
                page: $scope.page
              }, function (data) {
                // $scope.task = [];
                console.log($scope.id);
                $scope.notask = false;
                console.log(data.data.length);
                if (data.data.length === 0) {
                  $ionicLoading.hide();
                  $scope.notask = true;
                  $scope.more.Data = false;
                  console.log(data);
                }
                if (data.value) {
                  if (data.data.length > 0) {
                    console.log(data);
                    _.forEach(data.data, function (value) {
                      $scope.task.push(value);
                    });
                    console.log("adsd", $scope.task);
                    // $scope.task = $.jStorage.get('task');
                    $.jStorage.set('historyTask', $scope.task);
                    // $scope.more.Data = true;
                    $.jStorage.set('historyTaskPending', []);
                    $rootScope.historyTaskPending = [];
                    // $scope.page++;
                    $scope.offtask();
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $ionicLoading.hide();
                  } else {
                    $ionicLoading.hide();
                    $scope.more.Data = false;
                  }

                  // console.log(data);
                  // $.jStorage.set('historyTask', data.data);
                  // $scope.task = $.jStorage.get('historyTask');
                  // $.jStorage.set('historyTaskPending', []);
                  // $scope.offtask();
                } else {
                  // $scope.showAlert();
                  $ionicLoading.hide();
                  $scope.more.Data = false;
                  $scope.notask = true;
                }
              });
              // callback(null, data);
            });

            // $scope.doRefresh();
          }
        }
      }
      // }
    };
    $scope.loadMore = function () {
      $scope.page++;
      $scope.taskfun();
    };
    $scope.offtask = function () {
      $scope.task = $.jStorage.get('historyTask');
      if ($scope.task) {
        $rootScope.historyTaskPending = $.jStorage.get('historyTaskPending');

        console.log("i am in the offline man");
        if (_.isArray($rootScope.historyTaskPending) && _.isArray($scope.task)) {
          var i = 0;
          _.each($scope.task, function (v) {

            var val2 = v._id;
            v.historyTaskPendingStatus = false
            _.each($rootScope.historyTaskPending, function (values) {
              var val1 = values.assignId.toString();


              console.log("taskpending .................", values, val1, val2);

              if (val1 == val2) {
                v.historyTaskPendingStatus = true;
                console.log("taskpending ................. true", v);

              }
              // else {
              //   $scope.task[i].taskPendingStatus = false;
              //               console.log("taskpending ................. false",$scope.task[i].taskPendingStatus);

              // }
            })

          });
          // _.each($rootScope.historyTaskPending, function (values) {
          //   var val1 = values.assignId.toString();
          //   var val2 = $scope.task[i]._id;
          //   if (val1 == val2) {
          //     $scope.task[i].historyTaskPendingStatus = true;
          //   } else {
          //     $scope.task[i].historyTaskPendingStatus = false;
          //   }
          //   i++;
          // });
        }
        $.jStorage.set('historyTask', $scope.task);

        var
          monthLabels = ["Jan", "Feb", "March",
            "April", "May", "June",
            "July", "Aug", "Sep",
            "Oct", "Nov", "Dec"
          ];
        var items = $scope.task;
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
      }
    };
    $scope.offtask();
    $scope.task = [];
    $scope.taskfun();
    $scope.doRefresh = function () {

      console.log('Refreshing!');
      $timeout(function () {
        //simulate async response
        if ($cordovaNetwork.isOnline()) {
          $scope.taskfun();
        } else {
          $scope.offtask();
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
    // $scope.uploadImage = function (imageURI, arrayName, callback) {
    function uploadImage(imageURI, arrayName, callback) {
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
          console.log(err);
          // Error
        }, function (progress) {
          // console.log(err);
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
    };
    $scope.closePopup = function () {
      $scope.infos.close();
    };

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
        }, {
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
        }]
      });

      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });

      // $timeout(function() {
      //    myPopup.close(); //close the popup after 3 seconds for some reason
      // }, 10000);
    };
    // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    //   $scope.task = [];
    //   console.log("GOOD");
    //   $timeout(function() {
    //     $scope.doRefresh();
    //   }, 300);
    // });

    $scope.showAlert = function (text) {
      var alertPopup = $ionicPopup.alert({
        template: text
      });
      alertPopup.then(function (res) {
        // $state.go('app.task');
      });
    };

  })

  .controller('EmergencyCtrl', function ($scope) { })

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
  })


  .controller('MarineSurveyCtrl', function ($scope, $timeout, MyFlagValue, $ionicPlatform, $state) {

    $scope.questionObj = {
      question: "Where are you? At destination?",
      questionNumber: 1,
      answer: "",
      type: "radio"
    }
    $scope.finalArray = [];
    $scope.isText = false;
    $scope.multiOption = false;
    $scope.isSubmit = false;
    $scope.isNumeric = false;
    $scope.lr, $scope.delievered, $scope.wet, $scope.damaged = null;
    $scope.short = null;

    //To hide refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'none');

    //Function to save answer
    $scope.saveAnswer = function (value1, value2) {
      var obj = {};
      if (value2 == "Yes" || value2 == "No" || value2 == "Wet" || value2 == "Unloaded" || value2 == "Containerised" || value2 == "Holes" || value2 == "Partially Unloaded" || value2 == "Not Unloaded" || value2 == "Welding" || value2 == "Door Caps" || value2 == "Others" || value2 == "Open Vehicle" || value2 == "Good" || value2 == "Average" || value2 == "Bad" || value2 == "Short" || value2 == "Damage") {
        obj = {
          question: value1,
          answer: value2,
          no: $scope.questionObj.questionNumber,
          type: "radio"
        };
        var no = $scope.questionObj.questionNumber;
        // $scope.questionObj = {};
        $scope.finalArray.push(obj);
        console.log("$scope.finalArray", $scope.finalArray);
        $timeout(function () {
          $scope.getQuestion(no, value2);
        }, 100)
      } else {
        obj = {
          question: value1,
          answer: value2,
          no: $scope.questionObj.questionNumber,
          type: "text"
        };
        var no = $scope.questionObj.questionNumber;
        // $scope.questionObj = {};
        $scope.finalArray.push(obj);
        console.log("$scope.finalArray", $scope.finalArray);
        $timeout(function () {
          $scope.getQuestion(no, "text");
        }, 100)
      }
    };

    //To get question
    $scope.getQuestion = function (no, ans) {

      var demo = no + "-" + ans;
      switch (demo) {
        case "1-Yes":
          $scope.questionObj = {
            question: "Is destination same as LR?",
            questionNumber: 2
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;
        case "2-Yes":
          $scope.questionObj = {
            question: "Is it Full Truck Load?",
            questionNumber: 3
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;
        case "3-Yes":
          $scope.questionObj = {
            question: "Was Vehicle involved in an accident?",
            questionNumber: 4
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;
        case "4-Yes":
          $scope.questionObj = {
            question: "Is RC book available?",
            questionNumber: 5
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "5-Yes":
          $scope.questionObj = {
            question: "",
            questionNumber: 59
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = true;
          $scope.getNumericOption($scope.questionObj.questionNumber);
          break;

        case "5-No":
          $scope.getQuestion(5, "text");
          break;

        case "59-text":
          $scope.getQuestion(5, "text");
          break;

        case "5-text":
          $scope.questionObj = {
            question: "Number of packages in 1.LR 2.Delievered 3.Short 4.Wet 5.Damaged?",
            questionNumber: 6
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = true;
          $scope.isSubmit = false;
          $scope.getNumericOption($scope.questionObj.questionNumber);
          break;

        case "6-text":
          $scope.questionObj = {
            question: "Is Packing shown to you?",
            questionNumber: 7
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "7-Yes":
          $scope.questionObj = {
            question: "Is packing new?",
            questionNumber: 8
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "8-Yes":
          $scope.questionObj = {
            question: "Is it Customary?",
            questionNumber: 9
          }
          $scope.isText = false;
          $scope.isNumeric = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        case "9-Yes":
          $scope.questionObj = {
            question: "What was the condition of packing at time of survey?",
            questionNumber: 10
          }
          $scope.isText = true;
          $scope.isNumeric = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        case "10-text":
          // $scope.questionObj = {
          //   question: "Options",
          //   questionNumber: 11
          // }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption(11);
          break;

        case "11-Wet":
          $scope.questionObj = {
            question: "Is Truck present during survey?",
            questionNumber: 12
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "12-Yes":
          $scope.questionObj = {
            question: "Is it Containerised or is it an Open vehicle?",
            questionNumber: 13
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "13-Unloaded":
          $scope.questionObj = {
            question: "Options",
            questionNumber: 14
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "14-Containerised":
          $scope.questionObj = {
            question: "Was the light test done?",
            questionNumber: 15
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "15-Yes":
          $scope.questionObj = {
            question: "Were there?",
            questionNumber: 16
          }
          $scope.isText = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "16-Holes":
          $scope.questionObj = {
            question: "Was there Tarpaulin on the floor of the truck as well?",
            questionNumber: 17
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "16-Welding":
          $scope.questionObj = {
            question: "Was there Tarpaulin on the floor of the truck as well?",
            questionNumber: 17
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        case "16-Door Caps":
          $scope.questionObj = {
            question: "Was there Tarpaulin on the floor of the truck as well?",
            questionNumber: 17
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "16-Others":
          $scope.questionObj = {
            question: "Was there Tarpaulin on the floor of the truck as well?",
            questionNumber: 17
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "17-Yes":
          $scope.questionObj = {
            question: "Are there any test reports available?",
            questionNumber: 18
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "18-Yes":
          $scope.questionObj = {
            question: "Can it be repaired?",
            questionNumber: 19
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "19-Yes":
          $scope.questionObj = {
            question: "How much is the estimated cost?",
            questionNumber: 20
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = true;
          $scope.isSubmit = true;
          $scope.getNumericOption($scope.questionObj.questionNumber);
          break;

        // case "20-text":
        //   $scope.questionObj = {
        //     question: "Estimated Costing",
        //     questionNumber: 20
        //   }
        //   $scope.isText = true;
        //   $scope.multiOption = false;
        //   $scope.isSubmit = true;
        //   break;

        case "1-No":
          $scope.questionObj = {
            question: "Are you at spot of loss?",
            questionNumber: 21
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "21-Yes":
          $scope.getQuestion(2, "Yes");
          break;

        case "21-No":
          $scope.questionObj = {
            question: "Where are you and Why are you here?",
            questionNumber: 22
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "22-text":
          $scope.getQuestion(2, "Yes");
          break;

        case "2-No":
          $scope.getQuestion(21, "No");
          break;

        case "23-text":
          $scope.getQuestion(2, "Yes");
          break;

        case "4-No":
          $scope.questionObj = {
            question: "Was there a transhipment during the journey?",
            questionNumber: 24
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "24-No":
          $scope.getQuestion(5, "text");
          break;

        case "24-Yes":
          $scope.questionObj = {
            question: "Where and Why did the transhipment happen?",
            questionNumber: 25
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "25-text":
          $scope.getQuestion(5, "text");
          break;

        case "7-No":
          $scope.questionObj = {
            question: "Why is packing not shown?",
            questionNumber: 26
          }
          $scope.isText = true;
          $scope.isNumeric = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        case "26-text":
          $scope.getQuestion(10, "text");
          break;

        case "8-No":
          $scope.getQuestion(8, "Yes");
          break;

        case "9-No":
          $scope.questionObj = {
            question: "Is it Adequate?",
            questionNumber: 27
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "27-No":
          $scope.questionObj = {
            question: "Why is it adequate or inadequate?",
            questionNumber: 28
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "27-Yes":
          $scope.getQuestion(27, "No");
          break;

        case "28-text":
          $scope.getQuestion(9, "Yes");
          break;

        case "13-Partially Unloaded":
          $scope.questionObj = {
            question: "Options",
            questionNumber: 14
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "13-Not Unloaded":
          $scope.questionObj = {
            question: "Options",
            questionNumber: 14
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "15-No":
          $scope.questionObj = {
            question: "Options",
            questionNumber: 16
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "12-No":
          $scope.questionObj = {
            question: "Ask for Photos,if any?",
            questionNumber: 29
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "29-text":
          $scope.getQuestion(15, "Yes");
          break;

        case "17-No":
          $scope.questionObj = {
            question: "Test Reports, if any",
            questionNumber: 18
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;

          break;

        case "3-No":
          $scope.getQuestion(5, "text");
          break;

        case "14-Open Vehicle":
          $scope.questionObj = {
            question: "Was there a Tarpaulin or not?",
            questionNumber: 30
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "30-No":
          $scope.questionObj = {
            question: "What is the condition of truck floor?",
            questionNumber: 31
          }
          $scope.isText = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.getMultipleOption($scope.questionObj.questionNumber);
          break;

        case "30-Yes":
          $scope.questionObj = {
            question: "How many Tarpaulin were there?",
            questionNumber: 32
          }
          $scope.isText = false;
          $scope.isNumeric = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        // case "30-Yes":
        //   $scope.questionObj = {
        //     question: "# Tarpaulin",
        //     questionNumber: 32
        //   }
        //   $scope.isText = true;
        //   $scope.multiOption = false;
        //   $scope.isSubmit = false;
        //   break;

        case "32-text":
          $scope.questionObj = {
            question: "Was Tarpaulin removed in your presence?",
            questionNumber: 33
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "33-Yes":
          $scope.questionObj = {
            question: "Did you spread the Tarpaulin and check for quality?",
            questionNumber: 34
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "33-No":
          $scope.getQuestion(33, "Yes");
          break;

        case "34-No":
          $scope.getQuestion(30, "No");
          break;

        case "34-Yes":
          $scope.questionObj = {
            question: "Were there any Holes in Tarpaulin?",
            questionNumber: 35
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "35-Yes":
          $scope.questionObj = {
            question: "Was there Tarpaulin on the floor of the truck as well?",
            questionNumber: 36
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "35-No":
          $scope.getQuestion(35, "Yes");
          break;

        case "36-No":
          $scope.getQuestion(30, "No");
          break;

        case "36-Yes":
          $scope.getQuestion(30, "No");
          break;

        case "31-Good":
          // $scope.questionObj = {
          //   question: "Tarpaulin Floor",
          //   questionNumber: 37
          // }
          // $scope.isText = true;
          // $scope.multiOption = false;
          // $scope.isSubmit = false;
          $scope.getQuestion(60, "text");
          break;

        case "31-Average":
          $scope.getQuestion(60, "text");
          break;

        case "31-Bad":
          $scope.getQuestion(60, "text");
          break;

        case "37-text":
          $scope.getQuestion(17, "No");
          break;

        case "11-Short":
          $scope.questionObj = {
            question: "Is Truck present during survey?",
            questionNumber: 38
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "38-Yes":
          $scope.questionObj = {
            question: "Is there enough space for missing packages?",
            questionNumber: 39
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "38-No":
          $scope.getQuestion(39, "Yes");
          break;

        case "39-Yes":
          $scope.questionObj = {
            question: "Are units missing from packages?",
            questionNumber: 40
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "39-No":
          $scope.getQuestion(44, "text");
          break;

        case "40-Yes":
          $scope.questionObj = {
            question: "How many units are missing?",
            questionNumber: 41
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = true;
          break;

        case "40-No":
          $scope.getQuestion(44, "text");
          break;

        case "41-text":
          $scope.questionObj = {
            question: "Was there enough space for missing packages?",
            questionNumber: 42
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "42-Yes":
          $scope.questionObj = {
            question: "Was the package tampered?",
            questionNumber: 43
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "42-No":
          $scope.getQuestion(44, "text");
          break;

        case "43-Yes":
          $scope.questionObj = {
            question: "How was the package tampered?",
            questionNumber: 44
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "43-No":
          $scope.getQuestion(44, "text");
          break;

        case "44-text":
          $scope.questionObj = {
            question: "Collect GRN",
            questionNumber: 45
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;

          break;

        case "45-text":
          // $scope.questionObj = {
          //   question: "Documentation invoice/packing list/Endorsed LR",
          //   questionNumber: 46
          // }
          // $scope.isText = true;
          // $scope.multiOption = false;
          // $scope.isSubmit = true;
          // $scope.isNumeric = false;

          if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
            $scope.getQuestion(11, "Damage");
          } else {
            $scope.getQuestion(17, "Yes");
          }

          break;

        case "11-Damage":
          $scope.questionObj = {
            question: "Did damage happen during Unloading?",
            questionNumber: 47
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "47-Yes":
          $scope.questionObj = {
            question: "How did damage happen during Unloading?",
            questionNumber: 48
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "48-text":
          $scope.getQuestion(17, "No");
          break;

        case "47-No":
          $scope.questionObj = {
            question: "Is it beacuse of Jerks and Jolts?",
            questionNumber: 49
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "49-Yes":
          $scope.questionObj = {
            question: "Can Jerks and Jolts cause such magnitude of damage?",
            questionNumber: 50
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "49-No":
          $scope.getQuestion(17, "No");
          break;

        case "50-Yes":
          $scope.getQuestion(17, "No");
          break;

        case "50-No":
          $scope.getQuestion(17, "No");
          break;

        case "19-No":
          $scope.questionObj = {
            question: "Can it be reprocessed?",
            questionNumber: 51
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "51-No":
          $scope.questionObj = {
            question: "Can it be reconditioned?",
            questionNumber: 52
          }
          $scope.isText = false;
          $scope.isNumeric = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          break;

        case "52-No":
          $scope.questionObj = {
            question: "Can it be cannibalised?",
            questionNumber: 53
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = false;
          $scope.isSubmit = false;
          break;

        case "53-No":
          $scope.questionObj = {
            question: "Is it to be destroy?",
            questionNumber: 54
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "54-Yes":
          $scope.questionObj = {
            question: "Does it have Residual value",
            questionNumber: 55
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "54-No":
          $scope.questionObj = {
            question: "Input salvage value",
            questionNumber: 56
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = true;
          $scope.getNumericOption($scope.questionObj.questionNumber);
          break;

        case "55-No":
          $scope.getQuestion(45, "text");
          break;

        case "55-Yes":
          $scope.getQuestion(54, "No");
          break;

        case "53-Yes":
          $scope.getQuestion(19, "Yes");
          break;

        case "52-Yes":
          $scope.getQuestion(19, "Yes");
          break;

        case "51-Yes":
          $scope.getQuestion(19, "Yes");
          break;

        case "56-text":
          $scope.questionObj = {
            question: "Can it be retained?",
            questionNumber: 57
          }
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "57-Yes":
          $scope.getQuestion(45, "text");
          break;

        case "57-No":
          $scope.questionObj = {
            question: "Dispose salvage",
            questionNumber: 58
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          break;

        case "58-text":
          $scope.getQuestion(45, "text");
          break;

        case "60-text":
          $scope.questionObj = {
            question: "Possible source of ingress",
            questionNumber: 61
          }
          $scope.isText = true;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;

          break;

        case "61-text":
          if ($scope.short != 0 && $scope.short != null && $scope.short != "") {
            $scope.getQuestion(11, "Short");
          } else if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
            $scope.getQuestion(11, "Damage");
          } else {
            $scope.getQuestion(17, "Yes");
          }
          break;

        default: console.log("Invalid choice");
      }
    };

    //To get last question
    $scope.back = function () {
      console.log("$scope.finalArray2", $scope.finalArray);
      $scope.isSubmit = false;
      if ($scope.finalArray[$scope.finalArray.length - 1] != undefined) {
        $scope.questionObj = {
          question: $scope.finalArray[$scope.finalArray.length - 1].question,
          questionNumber: $scope.finalArray[$scope.finalArray.length - 1].no,
          answer: $scope.finalArray[$scope.finalArray.length - 1].answer
        }
        if ($scope.finalArray[$scope.finalArray.length - 1].type == "radio") {
          $scope.isText = false;
        } else if ($scope.finalArray[$scope.finalArray.length - 1].type == "text") {
          if ($scope.questionObj.questionNumber == 29) {
            $scope.isText = false;
          } else {
            $scope.isText = true;
          }
        };

        if ($scope.questionObj.questionNumber == 16 || $scope.questionObj.questionNumber == 14 || $scope.questionObj.questionNumber == 13 || $scope.questionObj.questionNumber == 11 || $scope.questionObj.questionNumber == 31) {
          $scope.getMultipleOption($scope.questionObj.questionNumber);
        } else {
          $scope.multiOption = false;
        }

        if ($scope.questionObj.questionNumber == 59 || $scope.questionObj.questionNumber == 6 || $scope.questionObj.questionNumber == 41 || $scope.questionObj.questionNumber == 32) {
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isNumeric = true;
          $scope.getNumericOption($scope.questionObj.questionNumber);
        } else {
          $scope.isNumeric = false;
        }

        $scope.finalArray.pop();
      }
    };

    //Final submit
    $scope.submit = function () {
      // alert("Submit called");
      $state.go('app.photos-documents');
    }

    //Function to get multiple options(more than two)
    $scope.getMultipleOption = function (qno) {
      $scope.multiArray = [];
      switch (qno) {
        case 11:
          // $scope.multiArray = ["Wet", "Short", "Damage"];
          if ($scope.wet != 0 && $scope.wet != null && $scope.wet != "") {
            $scope.surveyWet = true;
            $scope.surveyShort = false;
            $scope.surveyDamaged = false;
            $scope.getQuestion(11, "Wet");
          } else if ($scope.short != 0 && $scope.short != null && $scope.short != "") {
            $scope.surveyWet = false;
            $scope.surveyShort = true;
            $scope.surveyDamaged = false;
            $scope.getQuestion(11, "Short");
          } else if ($scope.damaged != 0 && $scope.damaged != null && $scope.damaged != "") {
            $scope.surveyWet = false;
            $scope.surveyShort = false;
            $scope.surveyDamaged = true;
            $scope.getQuestion(11, "Damage");
          }
          // $scope.multiOption = true;
          break;

        case 13:
          $scope.multiArray = ["Unloaded", "Partially Unloaded", "Not Unloaded"];
          $scope.multiOption = true;
          break;

        case 14:
          $scope.multiArray = ["Containerised", "Open Vehicle"];
          $scope.multiOption = true;
          break;

        case 16:
          $scope.multiArray = ["Holes", "Welding", "Door Caps", "Others"];
          $scope.multiOption = true;
          break;

        case 31:
          $scope.multiArray = ["Good", "Average", "Bad"];
          $scope.multiOption = true;
          break;

        default: console.log("Invalid choice");
      }
    };

    //To calculate short in question no 6
    $scope.calculateShort = function (val, index) {
      if ($scope.questionObj.questionNumber == 6) {

        if (index == 0) {
          $scope.lr = val;
        }
        if (index == 1) {
          $scope.delievered = val;
        }

        if ($scope.lr != null && $scope.delievered != null) {
          console.log("lr, delievered", $scope.lr, $scope.delievered);
          $scope.short = $scope.lr - $scope.delievered;
        } else {
          $scope.short = null;
        }

        if (index == 3) {
          $scope.wet = val;
        }

        if (index == 4) {
          $scope.damaged = val;
        }

        console.log("lr, delievered", $scope.lr, $scope.delievered, $scope.wet, $scope.damaged);

      }
    };

    //Function to get numeric values
    $scope.getNumericOption = function (qno) {
      $scope.numericInputArray = [];
      $scope.numericValue = [];
      switch (qno) {
        case 59:
          $scope.numericInputArray = ["GVW", "RLW", "VLW"];
          break;

        case 6:
          $scope.numericInputArray = ["LR", "Delievered", "Short", "Wet", "Damaged"];
          $scope.numericValue[0] = $scope.lr;
          $scope.numericValue[1] = $scope.delievered;
          $scope.numericValue[2] = $scope.short;
          $scope.numericValue[3] = $scope.wet;
          $scope.numericValue[4] = $scope.damaged;
          break;

        case 20:
          $scope.numericInputArray = ["Amt. in inr", "In %"];
          $scope.numericValue[0] = $scope.amt;
          $scope.numericValue[1] = $scope.percentage;

        case 56:
          $scope.numericInputArray = ["Amt. in inr", "In %"];
          $scope.numericValue[0] = $scope.amt;
          $scope.numericValue[1] = $scope.percentage;

        default: console.log("Invalid choice");
      }
    }

  })


  .controller('SelectSurveyorCtrl', function ($scope, $rootScope, MyServices, $ionicPopup, MyFlagValue, $state) {

    $scope.searchObj = {};
    $scope.searchObj.keyword = null;
    $scope.searchObj.lat = $.jStorage.get('assignmentObj').lat;
    $scope.searchObj.lng = $.jStorage.get('assignmentObj').lng;

    //To hide refresh button
    angular.element(document.getElementsByClassName("right-btn")).css('display', 'none');


    if ($scope.searchObj.keyword == null || $scope.searchObj.keyword == "") {
      $scope.searchObj.keyword = "";
    }

    //To get flag to know previous state
    $scope.flag = MyFlagValue.getFlag();

    $scope.getSurveyours = function () {
      MyServices.getNearestOffice($scope.searchObj, function (data) {
        if (data.value) {
          $scope.searchResultArray = data.data;
        } else {
          $scope.searchResultArray = [];
        }
      })
    };
    $scope.getSurveyours();

    //Function to assign surveyor 
    $scope.assignSurveyor = function (value) {
      console.log(value);
      $ionicPopup.show({
        title: 'Do you really want to assign task?',
        scope: $scope,
        buttons: [
          { text: 'Cancel', onTap: function (e) { return false; } },
          {
            text: '<b>Assign</b>',
            type: 'button-positive',
            onTap: function (e) {
              return true;
            }
          },
        ]
      }).then(function (res) {
        console.log('Tapped!', res);
        if (res == true) {
          var reqObj = {
            assignId: $.jStorage.get('assignmentObj').assignId,
            surveyId: $.jStorage.get('assignmentObj').surveyId,
            currentEmpId: $.jStorage.get('assignmentObj').currentEmpId,
            empId: value._id
          }

          MyServices.AppointSurveyorFromApp(reqObj, function (data) {
            console.log("$scope.flag", $scope.flag);
            if (data.value) {
              if ($scope.flag == "task") {
                $state.go('app.task');
              } else if ($scope.flag == "history") {
                $state.go('app.history');
              }
            } else {

            }
          });
        } else {

        }
      }, function (err) {
        console.log('Err:', err);
      }, function (msg) {
        console.log('message:', msg);
      });
    }
  });

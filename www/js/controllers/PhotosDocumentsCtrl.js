connector.controller('PhotosDocumentsCtrl', function ($scope, $filter, $ionicNavBarDelegate, $cordovaCamera, $ionicLoading, $cordovaNetwork, $ionicModal, $ionicActionSheet, $cordovaFileTransfer, $state, $stateParams, $ionicPopup, $rootScope, MyServices, $cordovaImagePicker, MyFlagValue, backgroundLocationTracking, LocalStorageService) {


    // As images are uploaded the files should be mapped in to the object and on save should push on LocalStorageService
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
        $scope.getImageSaveContact(arrayName);
    };


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

                } else {
                    console.log("jdkjdlfjskdfjklasdjfkl");
                    $cordovaImagePicker.getPictures(options).then(function (results) {
                        console.log("###################results#######################", results);
                        console.log(arrayName);
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
        $scope.document.photos = _.clone($scope.photos);
        $scope.document.doc = _.clone($scope.doc);
        $scope.document.jir = _.clone($scope.jir);
        $scope.document.empId = $scope.profile._id;
        $scope.document.assignId = $stateParams.assignId;
        $scope.document.surveyId = $stateParams.surveyId;
        $scope.document.status = false;
        // $scope.document.latitude = $rootScope.latitude;
        // $scope.document.longitude = $rootScope.longitude;
        $scope.document.isMobile = true;
        console.log($scope.document);
        $scope.showLoading('Please wait...', 15000);
        //
        // if ($cordovaNetwork.isOnline()) {
        //   uploadData();
        // } else {

        // if ($scope.flag == "task") {
        //     $rootScope.taskpending.push($scope.document);
        //     $.jStorage.set('taskpending', $rootScope.taskpending);
        // } else if ($scope.flag == "history") {
        //     $rootScope.historyTaskPending.push($scope.document);
        //     $.jStorage.set('historyTaskPending', $rootScope.historyTaskPending);
        // }

        LocalStorageService.addToLocalStorage($scope.document);
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

    //msg----------------------------------------------------------------------00

    $scope.msgsubmit = function () {
        $scope.surveyClose();
        // LocalStorageService.uploadFiles(function (err, data) {
        //     console.log("####### err, data ######", err, data)
        // });
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

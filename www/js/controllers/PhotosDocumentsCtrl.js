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
        if ($ionicHistory.backView().stateName == "app.task") {
            if (!(_.isEmpty($scope.photos) && _.isEmpty($scope.doc) && _.isEmpty($scope.jir))) {
                if (!(_.isEmpty($scope.jir))) {
                    PopupService.openModal(assignmentObj, url);
                } else {
                    $scope.showAlert('Please add JIR');
                }
            } else {
                $scope.showAlert('Please add attachments ');
            }
        } else if ($ionicHistory.backView().stateName == "app.history") {
            PopupService.openModal(assignmentObj, url);
        }
    }
})

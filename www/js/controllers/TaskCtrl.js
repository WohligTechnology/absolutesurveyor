connector.controller('TaskCtrl', function ($scope, $ionicPopup, $interval, $ionicNavBarDelegate, $state, $ionicHistory, $rootScope, $ionicLoading, $cordovaFileTransfer, $cordovaNetwork, MyServices, $timeout, MyFlagValue) {

    // Pagination Start
    //  Get Task
    //  Send to for isItLocalStorageData
    // Pagination End

    // UI alerts if already in localStorage






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
    };

    $scope.showAlert = function (text) {
        var alertPopup = $ionicPopup.alert({
            template: text
        });
        alertPopup.then(function (res) {
            // $state.go('app.task');
        });
    };

})
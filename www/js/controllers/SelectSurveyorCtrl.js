connector.controller('SelectSurveyorCtrl', function ($scope, $rootScope, MyServices, $ionicPopup, MyFlagValue, $state) {

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
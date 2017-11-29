connector.controller('SelectSurveyorCtrl', function ($scope, MyServices, $ionicPopup, $state, $stateParams, $ionicHistory) {

    $scope.searchObj = {};
    $scope.searchObj.keyword = null;
    $scope.searchObj.lat = parseFloat($stateParams.lat);
    $scope.searchObj.lng = parseFloat($stateParams.lng);


    if ($scope.searchObj.keyword == null || $scope.searchObj.keyword == "") {
        $scope.searchObj.keyword = "";
    }

    //To get surveyor
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
            if (res == true) {
                var reqObj = {
                    assignId: $stateParams.assignId,
                    surveyId: $stateParams.surveyId,
                    currentEmpId: $stateParams.currentEmpId,
                    empId: value._id
                }

                MyServices.AppointSurveyorFromApp(reqObj, function (data) {
                    if (data.value) {
                        $state.go($ionicHistory.backView().stateName);
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
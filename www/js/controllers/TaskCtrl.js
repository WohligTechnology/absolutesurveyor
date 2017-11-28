connector.controller('TaskCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate, $state, $ionicLoading, MyServices, $timeout, LocalStorageService) {

  $scope.profile = MyServices.getProfile();
  $scope.doRefresh = function (val) {
    $scope.pagination = {
      shouldLoadMore: true,
      currentPage: 0,
      result: []
    };
    if (!val) {
      $scope.loadMore();
    }
  };
  $scope.doRefresh(true);

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

  $scope.loadMore = function () {
    $scope.pagination.shouldLoadMore = false;
    $scope.pagination.currentPage++;
    MyServices.getTask({ page: $scope.pagination.currentPage }, function (data) {
      $scope.pagination.result = _.concat($scope.pagination.result, data.data);
      if (data.data.length == 10) {
        $scope.pagination.shouldLoadMore = true;
      }
      $scope.pagination.resultGroup = _.groupBy($scope.pagination.result, function (n) {
        return moment(n.surveyDate).format("MMM YYYY");
      });
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  $scope.decline = {};
  $scope.declinetask = function (surveyId, assignId, message) {
    $scope.show();
    $scope.decline.surveyId = surveyId;
    $scope.decline.assignId = assignId;
    $scope.decline.empId = $scope.id;
    $scope.decline.message = message;
    MyServices.Decline($scope.decline, function (data) {
      if (data.value) {
        $scope.hide();
        $scope.doRefresh();
      }
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

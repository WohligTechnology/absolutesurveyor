connector.controller('TaskCtrl', function ($scope, $ionicPopup, $ionicNavBarDelegate, $state, $ionicLoading, MyServices, $timeout, LocalStorageService, PopupService, $rootScope) {

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

  $rootScope.$on('proximityCatched', function () {
    $state.reload();
  });

  $scope.$on('$ionicView.enter', function (e) {
    $ionicNavBarDelegate.showBar(true);
  });

  //To select the surveyor 
  $scope.getSurveyour = function (value) {
    $state.go('app.selectSurveyor', {
      lat: value.lat,
      lng: value.lng,
      assignId: value._id,
      surveyId: value.survey._id,
      currentEmpId: value.survey.employee
    });
  };

  $scope.loadMore = function () {
    $scope.pagination.shouldLoadMore = false;
    $scope.pagination.currentPage++;
    MyServices.getTask({
      page: $scope.pagination.currentPage
    }, function (data) {
      $scope.pagination.result = _.concat($scope.pagination.result, data.data);
      if (data.data.length == 10) {
        $scope.pagination.shouldLoadMore = true;
      };
      LocalStorageService.isItLocalStorageData($scope.pagination.result);
      $scope.pagination.resultGroup = _.groupBy($scope.pagination.result, function (n) {
        return moment(n.surveyDate).format("MMM YYYY");
      });
      $scope.$broadcast('scroll.refreshComplete');
    });
  };

  //To decline the task
  $scope.declineTask = function (surveyId, assignId) {
    PopupService.decline(surveyId, assignId);
  }

  //To get information of task 
  $scope.getInformation = function (value) {
    var url = 'templates/modal/info.html';
    PopupService.openModal(value, url);
  }
})

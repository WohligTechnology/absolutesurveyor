service.factory('MyServices', function ($http) {
  return {
    Login: function (email, callback) {
      $http({
        url: adminurl + 'Employee/getLoginSurveyor',
        method: 'POST',
        withCredentials: true,
        data: email
      }).success(callback);
    },
    Task: function (data, callback) {
      // console.log(id);
      // var data = {
      //   id: id
      // };
      $http({
        url: adminurl + 'Assignment/tasklist',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    //To get History 
    History: function (data, callback) {
      // console.log(id);
      // var data = {
      //   id: id
      // };
      $http({
        url: adminurl + 'Assignment/tasklistCompleted',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    Decline: function (data, callback) {
      // console.log("data", data);
      $http({
        url: adminurl + 'Assignment/decline',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },
    mobileSubmit: function (data, callback) {

      $http({
        url: adminurl + 'Assignment/mobileSubmit',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    mobileLogout: function (data, callback) {

      $http({
        url: adminurl + 'Employee/mobileLogout',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    getNearestOffice: function (data, callback) {

      $http({
        url: adminurl + 'Office/getNearestOffice',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    //Assign surveyor 
    AppointSurveyorFromApp: function (data, callback) {

      $http({
        url: adminurl + 'Assignment/AppointSurveyorFromApp',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },
  }
});


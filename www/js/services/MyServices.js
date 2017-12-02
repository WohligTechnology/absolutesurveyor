service.factory('MyServices', function ($http, $state) {



  function getUserProfile() {
    var profile = $.jStorage.get('profile');
    if (profile) {
      return profile;
    } else {
      return {};
    }
  }

  return {
    Login: function (email, callback) {
      $http({
        url: adminurl + 'Employee/getLoginSurveyor',
        method: 'POST',
        withCredentials: true,
        data: email
      }).success(function (data) {
        if (data.value) {
          $.jStorage.set('profile', data.data);
          callback(null, data);
        } else {
          callback("Incorrect Email");
        }
      });
    },
    getProfile: function () {
      return getUserProfile();
    },
    getTask: function (data, callback) {
      data.id = getUserProfile()._id;
      $http({
        url: adminurl + 'Assignment/tasklist',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    //To get History 
    getHistory: function (data, callback) {
      data.id = getUserProfile()._id;
      $http({
        url: adminurl + 'Assignment/tasklistCompleted',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },

    Decline: function (data, callback) {
      // console.log("data", data);
      data.empId = getUserProfile()._id;
      $http({
        url: adminurl + 'Assignment/decline',
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(callback);
    },
    mobileSubmit: function (data, callback) {
      data.empId = getUserProfile()._id;
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

    //To get all Task/History
    getData: function (url, data, callback) {
      data.id = getUserProfile()._id;
      $http({
        url: adminurl + url,
        method: 'POST',
        withCredentials: true,
        data: data
      }).success(function (data) {
        console.log("error,data", data);
        callback(data);
      });
    }
  }
});


// var adminurl = "http://192.168.43.147:80/api/"; //local

var adminurl = "http://104.198.28.29:80/api/"; //server 
// var adminurl = "http://35.185.181.141:80/api/"; //Test server
// var adminurl = "http://absolutesurveyors.com/api/"; //server

// var imgpath = adminurl + "uploadfile/getupload?file=";
var imgurl = adminurl + "upload/";
var imgpath = imgurl + "readFile?file=";
// var uploadurl = imgurl;

angular.module('starter.services', [])
  .factory('MyServices', function ($http) {
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
      }

    }
  })

  //This service is to set flag to identify History and Task page
  .service('MyFlagValue', function () {
    var flag;
    this.setFlag = function (value) {
      flag = value;
    };

    this.getFlag = function () {
      return flag;
    }
  });

service.service('backgroundLocationTracking', function ($ionicPlatform, $rootScope) {
  // For location tracking
  this.startTracking = function () {
    $ionicPlatform.ready(function () {
      // console.log("hiiiiiii location 1st step");
      if (window.cordova) {
        var callbackFn = function (location) {
          // alert('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
          $rootScope.latitude = location.latitude;
          $rootScope.longitude = location.longitude;
          /*
          IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
          and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
          IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
          */
          backgroundGeolocation.finish();
          backgroundGeolocation.stop();
        };

        var failureFn = function (error) {
          console.log('BackgroundGeolocation error');
        };

        // BackgroundGeolocation is highly configurable. See platform specific configuration options
        backgroundGeolocation.configure(callbackFn, failureFn, {
          desiredAccuracy: 10,
          stationaryRadius: 20,
          distanceFilter: 30,
          interval: 1000
        });

        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
        backgroundGeolocation.start();
      } else {
        // alert("window.cordova");
      }
    });
  };

});

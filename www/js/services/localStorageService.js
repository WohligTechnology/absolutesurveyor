service.service('LocalStorageService', function ($ionicPlatform, MyServices, $cordovaFileTransfer) {

  // Local Storage Single Assignment fileObject
  // var assignmentFileObject = {
  //     name: "/home/dev/djkjks/odhljd.jpg",
  //     serverFile: "ksjaskjlakljslkas.jpg" || undefined,
  //     retry: 0
  // };
  // var assignment = {
  //     _id: "89732382782839"
  //     images: [assignmentFileObject],
  //     jir: [assignmentFileObject],
  //     document: [assignmentFileObject]
  // };

  var LocalStorageMain = this;

  $ionicPlatform.ready(function () {
    LocalStorageService.uploadingCompleted();
    LocalStorageService.uploadFiles(function (err, data) {
      console.log(err, data);
    });
  });

  //Function to Add document to local storage
  this.addToLocalStorage = function (assignment) {
    var localStorage = this.getLocalValues();
    localStorage.push(assignment);
    this.saveStorage(localStorage);
    this.uploadFiles(function (err, data) {
      console.log(err, data);
    });
  };

  this.saveStorage = function (localStorages) {
    $.jStorage.set('localStorage', localStorages);
  };

  // Get Values for all Documents
  this.getLocalValues = function () {
    var localStorage = $.jStorage.get('localStorage');
    if (_.isEmpty(localStorage)) {
      localStorage = [];
    }
    return localStorage;
  };


  // Upload Files
  this.uploadFiles = function (callback) {
    if (!this.isUploadingRunning) {

      var localStorage = this.getLocalValues();
      var assignment = _.first(localStorage);
      if (assignment) {
        LocalStorageMain.uploadingStarted();
        var unUploadedImages = _.filter(assignment.photos, function (n) {
          return !n.file;
        });
        var unUploadedJir = _.filter(assignment.jir, function (n) {
          return !n.file;
        });
        console.log(assignment.jir);
        var unUploadedDocument = _.filter(assignment.doc, function (n) {
          return !n.file;
        });
        async.series({
          unUploadedImages: function (callback) {
            if (unUploadedImages.length === 0) {
              callback();
            } else {
              async.concatLimit(unUploadedImages, 1, function (data, callback) {
                LocalStorageMain.uploadDocument(data, "photos", callback);
              }, callback);
            }
          },
          unUploadedJir: function (callback) {
            if (unUploadedJir.length === 0) {
              callback();
            } else {
              console.log(unUploadedJir);
              async.eachSeries(unUploadedJir, function (data, callback) {
                LocalStorageMain.uploadDocument(data, "jir", callback);
                // callback();
              }, callback);
            }
          },
          unUploadedDocument: function (callback) {
            if (unUploadedDocument.length === 0) {
              callback();
            } else {
              async.concatLimit(unUploadedDocument, 1, function (data, callback) {
                LocalStorageMain.uploadDocument(data, "doc", callback);
              }, callback);
            }
          },
          uploadToAssignment: function (callback) {
            // Upload to uploadToAssignment maping and all
            var localStorage = LocalStorageMain.getLocalValues();
            var assignment = _.first(localStorage);
            MyServices.mobileSubmit(assignment, function (data) {
              console.log("final data#####################", data);
              var localStorage = LocalStorageMain.getLocalValues();
              localStorage = _.drop(localStorage);
              LocalStorageMain.saveStorage(localStorage);
              callback(null, data);
            })

          },
        }, function (err, data) {
          LocalStorageMain.uploadingCompleted();
          if (err) {
            callback(err);
          } else {
            this.uploadFiles(callback);
          }
        });
      } else {
        console.log("No more assignment documents to upload");
      }
    } else {
      callback("Already Running Uploading");
    }

  };

  this.uploadDocument = function (fileObject, objectKey, callback) {

    console.log(fileObject);

    $cordovaFileTransfer.upload(adminurl + 'upload', fileObject.name).then(function (result) {
      result.response = JSON.parse(result.response);
      var localStorage = LocalStorageMain.getLocalValues();
      var indexVal = _.findIndex(localStorage[0][objectKey], function (n) {
        return fileObject.name == n.name;
      });
      localStorage[0][objectKey][indexVal].file = result.response.data[0];
      LocalStorageMain.saveStorage(localStorage);
      callback();
    }, function (err) {
      console.log(err);
      callback();
    });

  };

  this.isItLocalStorageData = function (assignmentList) {
    var localStorage = LocalStorageMain.getLocalValues();
    _.each(assignmentList, function (assignment) {
      var isThereInLocal = _.find(localStorage, function (n) {
        return assignment._id == n._id;
      });
      if (isThereInLocal) {
        assignment.onLocalStorage = true;
      }
    });
  };


  this.isUploadingRunning = function () {
    return $.jStorage.get("uploadingRunning");
  }

  this.uploadingCompleted = function () {
    $.jStorage.set("uploadingRunning", false);
  }

  this.uploadingStarted = function () {
    $.jStorage.set("uploadingRunning", true);
  }



});

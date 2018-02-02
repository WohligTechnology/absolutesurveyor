service.service('LocalStorageService', function ($rootScope, $ionicPlatform, MyServices, $cordovaFileTransfer, $cordovaNetwork, $interval) {

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
    LocalStorageMain.uploadingCompleted();
    LocalStorageMain.uploadFiles(function (err, data) {
      console.log(err, data);
    });
  });

  $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
    LocalStorageMain.uploadingCompleted();
    LocalStorageMain.setOnlineStatus(true);
    LocalStorageMain.uploadFiles(function (err, data) {
      console.log(err, data);
    });
  });

  $rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
    console.log("I m offline man");
    LocalStorageMain.setOnlineStatus(false);
  });

  //Function to Add document to local storage
  this.addToLocalStorage = function (assignment) {
    var localStorage = this.getLocalValues();
    localStorage.push(assignment);
    this.saveStorage(localStorage);
    if (this.getOnlineStatus()) {
      this.uploadFiles(function (err, data) {
        console.log(err, data);
      });
    }
  };

  this.saveTaskOnLocalStorage = function (task, page) {
    if (page == "task") {
      $.jStorage.set('taskData', task);
    } else if (page == "history") {
      $.jStorage.set('historyData', task);
    }
  };

  this.getTaskFromLocalStorage = function (page) {
    if (page == "history") {
      var localStorage = $.jStorage.get('historyData');
    } else if (page == "task") {
      var localStorage = $.jStorage.get('taskData');
    }
    if (_.isEmpty(localStorage)) {
      localStorage = [];
    }
    return localStorage;
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
    if (!this.isUploadingRunning()) {

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
        var totalFiles = unUploadedImages.length + unUploadedJir.length + unUploadedJir.length;
        async.series({
          unUploadedImages: function (callback) {
            if (unUploadedImages.length === 0) {
              callback();
            } else {
              async.concatLimit(unUploadedImages, 1, function (data, callback) {
                LocalStorageMain.checkUploadStatusOfFile(totalFiles, assignment.surveyId, 1);
                LocalStorageMain.uploadDocument(data, "photos", callback);
              }, callback);
            }
          },
          unUploadedJir: function (callback) {
            if (unUploadedJir.length === 0) {
              callback();
            } else {
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
            LocalStorageMain.uploadFiles(callback);
          }
        });
      } else {
        console.log("No more assignment documents to upload");
      }
    } else {
      callback("Already Running Uploading");
    }

  };

  //To check upload status of Files
  this.checkUploadStatusOfFile = function (totalFiles, surveyId, count) {
    var localStorage = $.jStorage.get("uploadingFileStatus");
    console.log("localStorage checkUploadStatusOfFile1", localStorage);
    if (localStorage) {
      var isThereInLocal = _.find(localStorage, function (n) {
        if (n.onLocalStorage == true) {
          if (surveyId == n.surveyId) {
            n.totalFiles = totalFiles;
            n.count = n.count + count;
          }
        }
        $.jStorage.set("uploadingFileStatus", localStorage);
      });
      console.log("localStorage checkUploadStatusOfFile2", localStorage);
    }
  }

  this.uploadDocument = function (fileObject, objectKey, callback) {
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
        return assignment.survey._id == n.surveyId;
      });
      if (isThereInLocal) {
        assignment.onLocalStorage = true;
      }
    });
    $.jStorage.set("uploadingFileStatus", assignmentList);
  };

  this.isUploadingRunning = function () {
    return $.jStorage.get("uploadingRunning");
  }

  this.uploadingCompleted = function () {
    $.jStorage.set("uploadingRunning", false);
  }

  this.uploadingStarted = function () {
    $.jStorage.set("uploadingRunning", true);
  };

  this.groupDataByMonth = function (data) {
    var finalData = _.groupBy(data, function (n) {
      return moment(n.surveyDate).format("MMM YYYY");
    });
    return finalData;
  };

  this.setOnlineStatus = function (value) {
    $.jStorage.set("onlineStatus", value);
  };

  this.getOnlineStatus = function () {
    return $.jStorage.get("onlineStatus");
  }

  this.checkUploadStatusOfFile = function (value) {
    $interval(function () {
      var array = LocalStorageMain.getLocalValues();
      _.each(array, function (n) {
        var totalFiles = n.doc.length + n.photos.length + n.jir.length;
        var count = 0;
        _.each(n.doc, function (m) {
          if (m.hasOwnProperty("file")) {
            count++;
          }
        });
        _.each(n.jir, function (m) {
          if (m.hasOwnProperty("file")) {
            count++;
          }
        });
        _.each(n.photos, function (m) {
          if (m.hasOwnProperty("file")) {
            count++;
          }
        })
        var isPresent = _.find(value, function (o) {
          if (o.survey._id === n.surveyId) {
            o.fileUploaded = count;
            o.totalFiles = totalFiles;
          };
        });
      })
    }, 2000);
  }

});

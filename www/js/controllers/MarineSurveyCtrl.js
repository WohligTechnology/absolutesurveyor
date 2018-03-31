connector.controller('MarineSurveyCtrl', function ($scope, $timeout, MyFlagValue, $ionicPlatform, $state, $ionicPopup, PopupService) {

  //Variables
  $scope.finalArray = [];
  $scope.isText = false;
  $scope.multiOption = true;
  $scope.isSubmit = false;
  $scope.isNumeric = false;
  $scope.isInstructions = false;
  $scope.multiOptionAndTextBox = true;
  $scope.lr, $scope.delievered, $scope.wet, $scope.damaged = null;
  $scope.short = null;
  $scope.isQuestionSix = false;

  //First question
  $scope.questionObj = {
    question: "Where are you? At destination?",
    questionNumber: 1,
    keyWord: "test",
    answer: "",
    details: "",
    type: "text"
  };

  // $timeout(function () {
  //   $scope.getQuestion(31, "text");
  // }, 100);


  //Function to get multiple options(more than two)
  $scope.getMultipleOption = function (qno) {
    $scope.class1 = "";
    $scope.multiArrayObj = {};
    switch (qno) {
      case 1:
        $scope.multiArrayObj.multiArray = ["Origin", "Destination", "Accident Spot", "Other"];
        $scope.multiArrayObj.subQuestion = "Address of location(Enter full address in as much detail as possinle)"
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = true;
        break;

      case 103:
        $scope.multiArrayObj.multiArray = ["Transit not started", "Returned from midway", "Returned from destination"];
        $scope.multiArrayObj.subQuestion = "What happened?";
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = true;
        break;

      case 34:
        $scope.multiArrayObj.multiArray = ["Unloaded", "Partially Unloaded", "Not Unloaded"];
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = false;
        break;

      case 35:
        $scope.multiArrayObj.multiArray = ["Containerised", "Open Vehicle"];
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = false;
        break;

      case 37:
        $scope.multiArrayObj.multiArray = ["Holes", "Welding", "Door Caps", "Others"];
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = false;
        break;

      case 40:
        $scope.multiArrayObj.multiArray = ["Good", "Average", "Bad"];
        $scope.multiOption = true;
        $scope.multiOptionAndTextBox = false;
        break;

      default:
        console.log("Invalid choice");
    }
  };

  $scope.getMultipleOption(1); // uncomment this

  //Function to save answer
  $scope.saveAnswer = function (value1, value2, keyWord) {
    $scope.class1 = "fadeOutLeftBig animated";
    var no;
    var obj = {};
    if (value2 == "Yes" || value2 == "No" || value2 == "Dry" || value2 == "Liquid" || value2 == "Loose" || value2 == "Packed" || value2 == "Unloaded" || value2 == "Containerised" || value2 == "Holes" || value2 == "Partially Unloaded" || value2 == "Not Unloaded" || value2 == "Containerised" || value2 == "Open Vehicle") {
      var val;

      if (value2 == "Yes") {
        val = true;
      } else if (value2 == "No") {
        val = false;
      }

      obj = {
        question: value1,
        answer: value2,
        ans: val,
        keyWord: keyWord,
        no: $scope.questionObj.questionNumber,
        type: "radio"
      };
      if ($scope.questionObj.questionNumber == 10) {
        delete obj.val;
        if (obj.answer == "Dry") {
          obj.isDry = true;
          $scope.cargoType = "Dry";
        } else if (obj.answer == "Liquid") {
          obj.isLiquid = true;
          $scope.cargoType = "Liquid";
        }
      } else if ($scope.questionObj.questionNumber == 12) {
        delete obj.val;
        if (obj.answer == "Loose") {
          obj.isLoose = true;
          $scope.cargoPackageType = "Loose";
        } else if (obj.answer == "Packed") {
          obj.isPacked = true;
          $scope.cargoPackageType = "Packed";
        }
      }

      if ($scope.questionObj.questionNumber == 2) {
        if (obj.answer == "Yes") {
          $scope.isTruckPresent = true;
        } else if (obj.answer == "No") {
          $scope.isTruckPresent = false;
        }
      }
      no = $scope.questionObj.questionNumber;
      // $scope.questionObj = {};
      $scope.finalArray.push(obj);
      console.log("$scope.finalArray", $scope.finalArray);
      if ($scope.questionObj.questionNumber == 100) {
        if (obj.answer == "Yes") {
          $scope.getQuestion(no, value2);
        } else if (obj.answer == "No") {
          $scope.finalArray[0].answer = "Other";
          $scope.isWarning = true;
        }
      } else {
        $timeout(function () {
          if ($scope.questionObj.questionNumber == 10) {
            $scope.getQuestion(no, "text");
          } else if ($scope.questionObj.questionNumber == 12) {
            if (($scope.cargoType == "Dry" && $scope.cargoPackageType == "Packed") || ($scope.cargoType == "Liquid" && $scope.cargoPackageType == "Packed")) {
              $scope.getQuestion(12, "packed");
            } else if (($scope.cargoType == "Dry" && $scope.cargoPackageType == "Loose") || ($scope.cargoType == "Liquid" && $scope.cargoPackageType == "Loose")) {
              $scope.getQuestion(12, "loose");
            }
          } else {
            $scope.getQuestion(no, value2);
          }
        }, 100);
      }

    } else {

      switch ($scope.questionObj.questionNumber) {

        case 103:
          obj = {
            question: value1,
            answer: value2,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;

        case 1:
          obj = {
            question: value1,
            answer: value2,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          if (obj.answer == "Origin") {
            $scope.getQuestion(1, "Origin");
          } else if (obj.answer == "Destination") {
            $scope.getQuestion(1, "Destination");
          } else if (obj.answer == "Accident Spot") {
            $scope.getQuestion(1, "Accident Spot");
            $scope.multiOptionAndTextBox = false;
          } else if (obj.answer == "Other") {
            $scope.multiOptionAndTextBox = false;
            $scope.getQuestion(1, "Other");
          }

          break;

        case 11:

          obj = {
            question: value1,
            answer: {
              gvw: $scope.gvw,
              rlw: $scope.rlw,
              vlw: $scope.vlw
            },
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.gvw) && _.isNumber($scope.rlw) && _.isNumber($scope.vlw)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(no);
          } else {
            PopupService.showAlert('All field must be filled');
          }
          break;

        case 13:
          obj = {
            question: value1,
            answer: {
              lr: $scope.lr,
              delievered: $scope.delievered,
              short: $scope.short
            },
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.short) && _.isNumber($scope.delievered) && _.isNumber($scope.lr)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(14);
          } else {
            PopupService.showAlert('All field must be filled');
          }
          break;

        case 14:
          obj = {
            question: value1,
            answer: {
              cargoWtOld: $scope.cargoWtOld,
              cargoWtNow: $scope.cargoWtNow
            },
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.cargoWtOld) && _.isNumber($scope.cargoWtNow)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(14);
          } else {
            PopupService.showAlert('All field must be filled');
          }
          break;

        case 31:
          obj = {
            question: value1,
            answer: value2,
            keyWord: $scope.questionObj.keyWord,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          if ($scope.isTruckPresent == true) {

          } else {

          }
          break;

        case 41:

          obj = {
            question: value1,
            answer: $scope.noOfTarpaulin,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.noOfTarpaulin)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(no);
          } else {
            PopupService.showAlert('Please enter the value');
          }
          break;

        default:
          obj = {
            question: value1,
            answer: value2,
            keyWord: $scope.questionObj.keyWord,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (no == 23 && $scope.cargoPackageType == "Packed") {
            $scope.getQuestionInTimeout(23);
          } else if (no == 23 && $scope.cargoPackageType == "Loose") {
            console.log("Package type is loose");
          } else {
            $scope.getQuestionInTimeout(no);
          }

          $scope.finalArray.push(obj);
      }
      // $scope.finalArray.push(obj);
      console.log("$scope.finalArray", $scope.finalArray);
    }
  };

  //Get question after time out
  $scope.getQuestionInTimeout = function (no) {
    $timeout(function () {
      $scope.getQuestion(no, "text");
    }, 100);
  };

  //To get question
  $scope.getQuestion = function (no, ans) {
    $scope.class1 = "";
    var demo = no + "-" + ans;
    switch (demo) {

      case "1-Origin":
        $scope.questionObj = {
          question: "Why are you here?",
          questionNumber: 103,
          keyWord: "test",
          answer: "",
          details: "",
          type: "text"
        };

        $scope.getMultipleOption(103);
        break;

      case "1-Destination":
        $scope.questionObj = {
          question: "Is place of survey same as LR destination",
          questionNumber: 100,
          keyWord: "test",
          answer: "",
          type: "radio"
        };
        $scope.multiOption = false;
        $scope.multiOptionAndTextBox = false;
        break;

      case "1-Accident Spot":
        $scope.questionObj = {
          question: "Why is consignment at this place? Explain",
          questionNumber: 101,
          keyWord: "accidentSpot",
          answer: "",
          type: "text"
        };
        $scope.multiOption = false;
        $scope.isText = true;
        break;

      case "1-Other":
        $scope.questionObj = {
          question: "Why is consignment at this place? Explain",
          questionNumber: 102,
          keyWord: "otherLocation",
          answer: "",
          type: "text"
        };
        $scope.multiOption = false;
        $scope.isText = true;
        break;

      case "103-text":
        $scope.questionObj = {
          question: "FTL",
          questionNumber: 2,
          keyWord: "FTL"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.isWarning = false;
        $scope.multiOptionAndTextBox = false;
        break;

      case "100-Yes":
        $scope.getQuestion(103, "text");
        break;

      case "100-No":
        $scope.getQuestion(103, "text");
        break;

      case "101-text":
        $scope.getQuestion(103, "text");
        break;

      case "102-text":
        $scope.getQuestion(103, "text");
        break;

      case "2-Yes": //2-Yes
        $scope.questionObj = {
          question: "Is truck present",
          questionNumber: 3,
          keyWord: "isTruckPresent"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isInstructions = false;
        $scope.isNumeric = false;
        break;

      case "2-No":
        $scope.questionObj = {
          question: "Is truck present",
          questionNumber: 3,
          keyWord: "isTruckPresent"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "3-Yes":
        $scope.questionObj = {
          question: "Original truck",
          questionNumber: 4,
          keyWord: "isOriginalTruck"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "3-No":
        $scope.questionObj = {
          instructions: ["Instructions:", "take truck no", "take photos"],
          questionNumber: 5,
          keyWord: "isTruckPresent"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "4-Yes":
        $scope.questionObj = {
          question: "IsAccident",
          questionNumber: 6,
          keyWord: "isAccident"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "4-No":
        $scope.questionObj = {
          question: "is transhipment",
          questionNumber: 7,
          keyWord: "isTranshipment"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "5-text":
        $scope.getQuestion(4, "No");
        break;

      case "7-Yes":
        $scope.questionObj = {
          question: "Place and reason",
          questionNumber: 8,
          keyWord: "transhipmentPlaceReason"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "7-No":
        $scope.getQuestion(4, "Yes");
        break;

      case "6-Yes":
        $scope.questionObj = {
          instructions: ["Instructions:", "place of accident", "reason", "collect FIR"],
          questionNumber: 9,
          keyWord: "isAccident"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "6-No":
        $scope.questionObj = {
          question: "is cargo",
          questionNumber: 10,
          keyWord: "cargoType"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "9-text":
        $scope.questionObj = {
          question: "Enter GVW (Gross Vehicle Weight),RLW(Registered Laden Weight), ULW(Unladen Weight) in Kgs",
          questionNumber: 11
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = true;
        $scope.isInstructions = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "11-text":
        $scope.getQuestion(6, "No");
        break;

      case "10-text":
        $scope.questionObj = {
          question: "is cargo",
          questionNumber: 12,
          keyWord: "cargoPackageType"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "12-packed":
        $scope.questionObj = {
          question: "Number of packages in 1.LR 2.Delievered 3.Short?",
          questionNumber: 13
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isNumeric = true;
        $scope.isSubmit = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "12-loose":
        $scope.questionObj = {
          question: "Weight lr",
          questionNumber: 14
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isNumeric = true;
        $scope.isSubmit = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "14-text":
        $scope.questionObj = {
          question: "is packing available?",
          questionNumber: 15,
          keyWord: "isPackingAvailable"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "15-Yes":
        $scope.questionObj = {
          question: "is New?",
          questionNumber: 16,
          keyWord: "isNew"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "15-No":
        $scope.questionObj = {
          question: "why?",
          questionNumber: 17,
          keyWord: "noPackingWhy"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "17-text":
        $scope.getQuestion(15, "Yes");
        break;


      case "16-Yes":
        $scope.questionObj = {
          question: "customary",
          questionNumber: 18,
          keyWord: "customary"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "16-No":
        $scope.getQuestion(16, "Yes");
        break;

      case "18-No":
        $scope.questionObj = {
          question: "adequate",
          questionNumber: 19,
          keyWord: "adequate"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "18-Yes":
        $scope.getQuestion(19, "No");
        break;

      case "19-No":
        $scope.questionObj = {
          question: "Reason",
          questionNumber: 20,
          keyWord: "reason"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "19-Yes":
        $scope.getQuestion(19, "No");
        break;

      case "20-text":
        $scope.questionObj = {
          question: "Describe the condition of packing",
          questionNumber: 21,
          keyWord: "conditionOfPacking"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "21-text":
        $scope.questionObj = {
          question: "is there any shortage?",
          questionNumber: 22,
          keyWord: "isShortage"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "22-No":
        PopupService.showAlert("End of marine logic");
        break;

      case "22-Yes":
        $scope.questionObj = {
          question: "Please describe what led to shortage",
          questionNumber: 23,
          keyWord: "conditionOfPacking"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "23-text":
        $scope.questionObj = {
          question: "Are any packages missing?",
          questionNumber: 24,
          keyWord: "isPackageMissing"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "24-Yes":
        $scope.questionObj = {
          question: "Is there space for missing packages?",
          questionNumber: 25,
          keyWord: "isSpaceForMissingPackages"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "25-No":
        $scope.questionObj = {
          instructions: ["Instructions:", "Take truck number", "make notes", "take photos"],
          questionNumber: 26,
          keyWord: "isAccident"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "24-No":
        $scope.questionObj = {
          question: "Is content missing from packages?",
          questionNumber: 27,
          keyWord: "isSpaceForMissingPackages"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "27-Yes":
        $scope.questionObj = {
          instructions: ["Instructions:", "make notes", "take photos"],
          questionNumber: 28,
          keyWord: "isAccident"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "28-text":
        $scope.questionObj = {
          question: "Is there is Damage?",
          questionNumber: 29,
          keyWord: "isDamage"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "29-Yes":
        $scope.questionObj = {
          question: "How?",
          questionNumber: 30,
          keyWord: "damage"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "30-Unloading":
        $scope.questionObj = {
          question: "Describe cause of loss",
          questionNumber: 31,
          keyWord: "causeOfLoss"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "30-JJ":
        $scope.questionObj = {
          question: "Can Jerks & Jolts cause such magnitude of damage?",
          questionNumber: 32,
          keyWord: "causeOfLoss"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "32-Yes":
        $scope.getQuestion(30, "Unloading");
        break;

      case "32-No":
        $scope.getQuestion(30, "Unloading");
        break;

      case "31-text":
        $scope.questionObj = {
          question: "Is Wet?",
          questionNumber: 33,
          keyWord: "isWet"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "33-No":
        PopupService.showAlert("End of marine logic");
        break;

      case "33-Yes":
        $scope.questionObj = {
          question: "?",
          questionNumber: 34,
          keyWord: ""
        };
        $scope.isText = false;
        $scope.multiOption = true;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.getMultipleOption(34);
        break;

      case "34-Unloaded":
        $scope.questionObj = {
          question: "?",
          questionNumber: 35,
          keyWord: ""
        };
        $scope.isText = false;
        $scope.multiOption = true;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.getMultipleOption(35);
        break;

      case "34-Partially Unloaded":
        $scope.getQuestion(34, "Unloaded");
        break;

      case "34-Not Unloaded":
        $scope.getQuestion(34, "Unloaded");
        break;

      case "35-Containerised":
        $scope.questionObj = {
          question: "Is light test done?",
          questionNumber: 36,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "36-Yes":
        $scope.questionObj = {
          question: "???",
          questionNumber: 37,
          keyWord: ""
        };
        $scope.isText = false;
        $scope.multiOption = true;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.getMultipleOption(37);
        break;

      case "36-No":
        $scope.getQuestion(36, "Yes");
        break;

      case "37-Holes":
        $scope.questionObj = {
          question: "Is Tarpaulin floor?",
          questionNumber: 38,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "37-Welding":
        $scope.getQuestion(37, "Holes");
        break;

      case "37-Door Caps":
        $scope.getQuestion(37, "Holes");
        break;

      case "37-Others":
        $scope.getQuestion(37, "Holes");
        break;

      case "35-Open Vehicle":
        $scope.questionObj = {
          question: "Tarpaulin?",
          questionNumber: 39,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "39-No":
        $scope.questionObj = {
          question: "Floor condition?",
          questionNumber: 40,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.getMultipleOption(40);
        break;

      case "39-Yes":
        $scope.questionObj = {
          question: "# Tarpaulin?",
          questionNumber: 41,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = true;
        $scope.isInstructions = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

        // case "41-text":
        //   $scope.questionObj = {
        //     question: "removed in presence?",
        //     questionNumber: 42,
        //     keyWord: "isLight"
        //   };
        //   $scope.isText = false;
        //   $scope.multiOption = false;
        //   $scope.isSubmit = false;
        //   $scope.isNumeric = false;
        //   $scope.isInstructions = false;
        //   break;

      case "41-text":
        $scope.questionObj = {
          question: "removed in presence?",
          questionNumber: 43,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "43-Yes":
        $scope.questionObj = {
          question: "spread & checked?",
          questionNumber: 44,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "43-No":
        $scope.getQuestion(43, "Yes");
        break;

      case "44-Yes":
        $scope.questionObj = {
          question: "Holes?",
          questionNumber: 45,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "45-Yes":
        $scope.questionObj = {
          question: "Tarpaulin floor?",
          questionNumber: 46,
          keyWord: "isLight"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;


      case "45-No":
        $scope.getQuestion(45, "Yes");
        break;


      case "46-Yes":
        $scope.getQuestion(39, "No");
        break;

      case "46-No":
        $scope.getQuestion(39, "No");
        break;

      case "40-Good":
        $scope.questionObj = {
          question: "Possible source of ingress?",
          questionNumber: 47,
          keyWord: "isLight"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "40-Bad":
        $scope.getQuestion(40, "Good");
        break;

      case "40-Average":
        $scope.getQuestion(40, "Good");
        break;
    }
  };

  //To get last question
  $scope.back = function () {
    console.log("$scope.finalArray2", $scope.finalArray);
    $scope.class1 = "fadeOutRightBig animated";
    $timeout(function () {
      $scope.class1 = "";
    }, 100);
    $scope.isSubmit = false;
    if ($scope.finalArray[$scope.finalArray.length - 1] != undefined) {
      $scope.questionObj = {
        question: $scope.finalArray[$scope.finalArray.length - 1].question,
        questionNumber: $scope.finalArray[$scope.finalArray.length - 1].no,
        answer: $scope.finalArray[$scope.finalArray.length - 1].answer
      };
      if ($scope.finalArray[$scope.finalArray.length - 1].type == "radio") {
        if ($scope.finalArray[$scope.finalArray.length - 1].no == 12) {
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.isInstructions = false;
        }
        $scope.isText = false;
        $scope.isInstructions = false;
      } else if ($scope.finalArray[$scope.finalArray.length - 1].type == "text") {

        var lastQuestionNo = $scope.finalArray[$scope.finalArray.length - 1].no;
        var objNo = $scope.finalArray.length - 1;

        switch (lastQuestionNo) {
          // case 5:
          //   $scope.getQuestion(3, "No");
          //   break;

          case 103:
            $scope.multiOption = true;
            $scope.multiOptionAndTextBox = true;
            $scope.questionObj.details = $scope.finalArray[objNo].details;
            $scope.getMultipleOption(103);
            break;

          case 1:
            $scope.questionObj.details = $scope.finalArray[objNo].details;
            $scope.multiOption = true;
            $scope.multiOptionAndTextBox = true;
            $scope.getMultipleOption(1);
            break;

          case 11:
            // $scope.getQuestion(9, "text");
            $scope.isText = false;
            $scope.multiOption = false;
            $scope.isSubmit = false;
            $scope.isNumeric = true;
            $scope.isInstructions = false;
            break;


          default:
            $scope.isText = true;
            $scope.isInstructions = false;
            $scope.multiOption = false;
        }
      }

      var qNo = $scope.questionObj.questionNumber;

      if (qNo == 37 || qNo == 35 || qNo == 34 || qNo == 40 || qNo == 1) {
        $scope.getMultipleOption(qNo);
      }

      if (qNo == 41 || qNo == 11) {
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isNumeric = true;
        $scope.getNumericOption($scope.questionObj.questionNumber);
      } else {
        $scope.isNumeric = false;
      }

      $scope.finalArray.pop();
    }
  };


  //To function to handle numeric values
  $scope.numericAnswers = function (val, index) {
    if ($scope.questionObj.questionNumber == 13) {
      $scope.isQuestionSix = true;
      if (index == 0) {
        $scope.lr = val;
      }
      if (index == 1) {
        $scope.delievered = val;
      }

      if ($scope.lr != null && $scope.delievered != null) {
        console.log("lr, delievered", $scope.lr, $scope.delievered);
        $scope.short = $scope.lr - $scope.delievered;
      } else {
        $scope.short = null;
      }
    }

    if ($scope.questionObj.questionNumber == 14) {
      if (index == 0) {
        $scope.cargoWtOld = val;
      }
      if (index == 1) {
        $scope.cargoWtNow = val;
      }
    }

    if ($scope.questionObj.questionNumber == 11) {
      if (index == 0) {
        $scope.gvw = val;
      }
      if (index == 1) {
        $scope.rlw = val;
      }
      if (index == 2) {
        $scope.vlw = val;
      }
    }

    if ($scope.questionObj.questionNumber == 41) {
      $scope.noOfTarpaulin = val;
    }

    if ($scope.questionObj.questionNumber == 20) {
      if (index == 0) {
        $scope.amt = val;
      }
      if (index == 1) {
        $scope.percentage = val;
      }

    }

    if ($scope.questionObj.questionNumber == 56) {
      if (index == 0) {
        $scope.salvageAmt = val;
      }
      if (index == 1) {
        $scope.salvagePercentage = val;
      }
    }
  };

  //Function to get numeric values
  $scope.getNumericOption = function (qno) {
    $scope.class1 = "";
    $scope.numericInputArray = [];
    $scope.numericValue = [];
    switch (qno) {
      case 11:
        $scope.numericInputArray = ["GVW", "RLW", "VLW"];
        $scope.numericValue[0] = $scope.gvw;
        $scope.numericValue[1] = $scope.rlw;
        $scope.numericValue[2] = $scope.vlw;
        break;

      case 13:
        $scope.numericInputArray = ["LR", "Delievered", "Short"];
        $scope.numericValue[0] = $scope.lr;
        $scope.numericValue[1] = $scope.delievered;
        $scope.numericValue[2] = $scope.short;
        break;

      case 14:
        $scope.numericInputArray = ["Wt in LR", "Wt now"];
        $scope.numericValue[0] = $scope.cargoWtOld;
        $scope.numericValue[1] = $scope.cargoWtNow;
        break;

      case 20:
        $scope.numericInputArray = ["Amt. in inr", "In %"];
        break;

      case 56:
        $scope.numericInputArray = ["Amt. in inr", "In %"];
        break;

      case 41:
        $scope.numericInputArray = ["no"];
        $scope.numericValue[0] = $scope.noOfTarpaulin;
        break;

      default:
        console.log("Invalid choice");
    }
  };

});

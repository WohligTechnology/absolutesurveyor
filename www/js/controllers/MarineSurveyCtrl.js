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
  // $scope.questionObj = {
  //   question: "Where are you? At destination?",
  //   questionNumber: 1,
  //   keyWord: "currentLocation",
  //   answer: "",
  //   details: "",
  //   type: "text"
  // };

  $timeout(function () {
    $scope.getQuestion(47, "text");
  }, 100);


  //Function to get multiple options(more than two)
  $scope.getMultipleOption = function (qno) {
    $scope.class1 = "";
    $scope.multiArrayObj = {};
    switch (qno) {
      case 1:
        $scope.multiArrayObj.multiArray = ["Origin", "Destination", "Accident Spot", "Other"];
        $scope.multiArrayObj.subQuestion = "Address of location(Enter full address in as much detail as possible)";
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

      case 57:
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
    if (value2 == "Yes" || value2 == "No" || value2 == "Dry" || value2 == "Liquid" || value2 == "Loose" || value2 == "Packed" || value2 == "Unloaded" || value2 == "Containerised" || value2 == "Holes" || value2 == "Partially Unloaded" || value2 == "Not Unloaded" || value2 == "Containerised" || value2 == "Open Vehicle" || value2 == "During Unloading" || value2 == "Jerks & Jolts" || value2 == "Good" || value2 == "Average" || value2 == "Bad") {
      var val;
      console.log("$scope.questionObj.questionNumber11111111", $scope.questionObj.questionNumber);
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

      // if ($scope.questionObj.questionNumber == 2) {
      //   if (obj.answer == "Yes") {
      //     $scope.isTruckPresent = true;
      //   } else if (obj.answer == "No") {
      //     $scope.isTruckPresent = false;
      //   }
      // }

      if ($scope.questionObj.questionNumber == 3) {
        if (obj.answer == "Yes") {
          $scope.isTruckPresent = true;
        } else if (obj.answer == "No") {
          $scope.isTruckPresent = false;
        }
      }

      if ($scope.questionObj.questionNumber == 15) {
        if (obj.answer == "Yes") {
          $scope.isPackingAvailable = true;
        } else if (obj.answer == "No") {
          $scope.isPackingAvailable = false;
        }
      }

      if ($scope.questionObj.questionNumber == 22) {
        if (obj.answer == "Yes") {
          $scope.isShort = true;
        } else if (obj.answer == "No") {
          $scope.isShort = false;
        }
      }

      if ($scope.questionObj.questionNumber == 29) {
        if (obj.answer == "Yes") {
          $scope.isDamage = true;
        } else if (obj.answer == "No") {
          $scope.isDamage = false;
        }
      }

      if ($scope.questionObj.questionNumber == 33) {
        if (obj.answer == "Yes") {
          $scope.isWet = true;
        } else if (obj.answer == "No") {
          $scope.isWet = false;
        }
      }

      no = $scope.questionObj.questionNumber;
      // $scope.questionObj = {};
      $scope.finalArray.push(obj);
      console.log("$scope.finalArray", $scope.finalArray);
      if ($scope.questionObj.questionNumber == 100) {
        if (obj.answer == "Yes") {
          $scope.finalArray[0].answer = "Destination";
          $scope.getQuestion(no, value2);
        } else if (obj.answer == "No") {
          $scope.finalArray[0].answer = "Other";
          $scope.getQuestion(100, "No");
          // if ($scope.isWarning == true) {
          //   $scope.finalArray.pop();
          //   $scope.getQuestion(100, "No");
          //   $scope.isWarning = false;
          // } else {
          //   $scope.isWarning = true;
          // }
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
          } else if ($scope.questionObj.questionNumber == 30) {
            if (obj.answer == "Jerks & Jolts") {
              $scope.getQuestion(30, "JJ");
            } else if (obj.answer == "During Unloading") {
              $scope.getQuestion(30, "Unloading");
            }
          } else {
            $scope.getQuestion(no, value2);
          }
        }, 100);
      }

    } else {

      console.log("$scope.questionObj.questionNumber", $scope.questionObj.questionNumber);
      switch ($scope.questionObj.questionNumber) {

        case 68:
          PopupService.showAlert("End of marine logic");
          break;

        case 69:
          PopupService.showAlert("End of marine logic");
          break;

        case 5:
          obj = {
            question: value1,
            answer: value2.answer,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;


        case 8:
          obj = {
            question: value1,
            place: value2.place,
            reason: value2.reason,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;

        case 9:
          obj = {
            question: value1,
            place: value2.place,
            reason: value2.reason,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;

        case 51:
          obj = {
            question: value1,
            notes: value2.notes,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;

        case 52:
          obj = {
            question: value1,
            notes: value2.notes,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;

        case 44:
          obj = {
            question: value1,
            place: value2.place,
            reason: value2.reason,
            details: keyWord,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };
          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
          break;


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
            if ($scope.short >= 0) {
              $scope.finalArray.push(obj);
              $scope.getQuestionInTimeout(14);
            } else {
              PopupService.showAlert('Short shoud be greater than or equal to zero');
            }
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
          // if ($scope.isTruckPresent == true) {

          // } else {

          // }
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(no);
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

        case 64:

          obj = {
            question: value1,
            answer: {
              salvageAmt: $scope.salvageAmt,
              salvagePercentage: $scope.salvagePercentage
            },
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.salvageAmt) && _.isNumber($scope.salvagePercentage)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(no);
          } else {
            PopupService.showAlert('Please enter the value');
          }
          break;

        case 69:

          obj = {
            question: value1,
            answer: $scope.estimatedCost,
            no: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          if (_.isNumber($scope.estimatedCost)) {
            $scope.finalArray.push(obj);
            $scope.getQuestionInTimeout(no);
          } else {
            PopupService.showAlert('Please enter the value');
          }
          break;

        case 37:
          console.log("value2", value2);
          obj = {
            question: "Are there?",
            answer: value2.answer,
            no: $scope.questionObj.questionNumber,
            questionNumber: $scope.questionObj.questionNumber,
            type: "text"
          };

          no = $scope.questionObj.questionNumber;
          $scope.finalArray.push(obj);
          $scope.getQuestionInTimeout(37);

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
          }
          // else if (no == 23 && $scope.cargoPackageType == "Loose") {
          //   console.log("Package type is loose");
          // } 
          else {
            $scope.getQuestionInTimeout(no);
          }
          if ($scope.questionObj.questionNumber != 71)
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
          keyWord: "WhyAtOrigin",
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
          keyWord: "isDestination",
          answer: "",
          type: "radio"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.multiOptionAndTextBox = false;
        break;

      case "100-No":
        $scope.questionObj = {
          question: "Is place of survey same as LR destination",
          questionNumber: 71,
          keyWord: "isDestination",
          answer: "",
          type: "radio"
        };
        $scope.isText = false;
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
          question: "Is it a Full Truck Load?",
          questionNumber: 2,
          keyWord: "isFTL"
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

      case "71-text":
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
        $scope.ftl = false;
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
        $scope.ftl = false;
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
          questionNumber: 5,
          keyWord: "truckNumber"
        };
        // $scope.questionObj = {
        //   instructions: ["Instructions:", "take truck no", "take photos"],
        //   questionNumber: 5,
        //   keyWord: "isTruckPresent"
        // };
        // $scope.isText = true;
        // $scope.multiOption = false;
        // $scope.isSubmit = false;
        // $scope.isNumeric = false;
        // $scope.isInstructions = true;
        break;

      case "4-Yes":
        $scope.questionObj = {
          question: "Was there an accident en route?",
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
          question: "Transhipment 1. place 2. reason ",
          questionNumber: 8,
          keyWord: "transhipmentPlaceReason"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "8-text":
        $scope.getQuestion(4, "Yes");
        break;

      case "7-No":
        $scope.getQuestion(4, "Yes");
        break;

      case "6-Yes":
        $scope.questionObj = {
          questionNumber: 9,
          keyWord: "accidentPlaceAndReason"
        };
        // $scope.questionObj = {
        //   instructions: ["Instructions:", "place of accident", "reason", "collect FIR"],
        //   questionNumber: 9,
        //   keyWord: "isAccident"
        // };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "6-No":
        $scope.questionObj = {
          question: "is cargo?",
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
          question: "Check for overloading. Enter:<br><br> GVW:   Gross Vehicle Weight<br>RLW: Registered Laden Weight<br> ULW: Unladen Weight <br><br>in Kgs",
          questionNumber: 11,
          keyWord: "GvwRlwUlw"
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
          question: "is cargo?",
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
          questionNumber: 13,
          keyWord: "NoOfPackages"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isNumeric = true;
        $scope.isSubmit = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "12-loose":
        $scope.questionObj = {
          question: "Please enter:",
          questionNumber: 14,
          keyWord: "WtLr"
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

        if ($scope.isPackingAvailable == true) {
          $scope.questionObj = {
            question: "Is packing new?",
            questionNumber: 16,
            keyWord: "isNew"
          };
        } else {
          $scope.questionObj = {
            question: "Was packing new?",
            questionNumber: 16,
            keyWord: "wasNew"
          };
        }
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

        if ($scope.isPackingAvailable == true) {
          $scope.questionObj = {
            question: "Is customary?",
            questionNumber: 18,
            keyWord: "isCustomary"
          };
        } else {
          $scope.questionObj = {
            question: "Was customary?",
            questionNumber: 18,
            keyWord: "wasCustomary"
          };
        }
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

        if ($scope.isPackingAvailable == true) {
          $scope.questionObj = {
            question: "Is adequate?",
            questionNumber: 19,
            keyWord: "isAdequate"
          };
        } else {
          $scope.questionObj = {
            question: "Was adequate?",
            questionNumber: 19,
            keyWord: "wasAdequate"
          };
        }

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
          keyWord: "adequateReason"
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
        // PopupService.showAlert("End of marine logic");
        $scope.getQuestion(28, "text");
        break;

      case "22-Yes":
        $scope.questionObj = {
          question: "Please describe what led to shortage",
          questionNumber: 23,
          keyWord: "shortageDescription"
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

      case "25-Yes":
        $scope.getQuestion(24, "No");
        break;

      case "25-No":
        $scope.questionObj = {
          instructions: ["Instructions:", "Reload truck", "make notes", "take photos"],
          questionNumber: 26,
          keyWord: "isAccident"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = true;
        break;

      case "26-text":
        $scope.getQuestion(24, "No");
        break;

      case "24-No":
        $scope.questionObj = {
          question: "Is content missing from packages?",
          questionNumber: 27,
          keyWord: "isContentMissingFromPackages"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "27-Yes":
        $scope.questionObj = {
          question: "Is there space for missing content?",
          questionNumber: 48,
          keyWord: "isSpaceForMissingContent"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "27-No":
        $scope.questionObj = {
          questionNumber: 50
        };
        break;

      case "48-No":
        $scope.questionObj = {
          questionNumber: 52
        };
        break;

      case "48-Yes":
        $scope.questionObj = {
          question: "Is there any sign of Tampering?",
          questionNumber: 49,
          keyWord: "isTampering"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "49-Yes":
        $scope.questionObj = {
          questionNumber: 51
        };
        break;

      case "49-No":
        $scope.getQuestion(27, "No");
        break;

      case "51-text":
        $scope.getQuestion(27, "No");
        break;

      case "50-text":
        $scope.getQuestion(28, "text");
        break;

      case "52-text":
        $scope.getQuestion(27, "No");
        break;

        // case "27-Yes":
        //   $scope.questionObj = {
        //     instructions: ["Instructions:", "make notes", "take photos"],
        //     questionNumber: 28,
        //     keyWord: "isAccident"
        //   };
        //   $scope.isText = false;
        //   $scope.multiOption = false;
        //   $scope.isSubmit = false;
        //   $scope.isNumeric = false;
        //   $scope.isInstructions = true;
        //   break;

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
          keyWord: "damageDescription"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "29-No":
        $scope.getQuestion(31, "text");
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
          keyWord: "canJJcauseDamage"
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
          question: "Is there any wet damage?",
          questionNumber: 33,
          keyWord: "isWetDamage"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.multiOptionAndTextBox = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "33-No":

        if ($scope.isShort == true && $scope.isDamage == false && $scope.isWet == false) {
          $scope.getQuestion(66, "Yes");
        } else {
          $scope.getQuestion(47, "text");
        }
        break;

      case "33-Yes":

        if ($scope.isTruckPresent == true) {
          $scope.questionObj = {
            question: "Is truck?",
            questionNumber: 34,
            keyWord: ""
          };
          $scope.isText = false;
          $scope.multiOption = true;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.isInstructions = false;
          $scope.getMultipleOption(34);
        } else if ($scope.isTruckPresent == false) {
          $scope.questionObj = {
            questionNumber: 70,
            keyWord: "noTruckPresentAtWetInstruction"
          };
        }

        break;

      case "34-Unloaded":
        $scope.questionObj = {
          question: "Is truck?",
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
          keyWord: "isLightTestDone"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "70-text":
        $scope.getQuestion(36, "Yes");
        break;

      case "36-Yes":
        $scope.questionObj = {
          question: "Were there?",
          questionNumber: 37,
          keyWord: ""
        };
        // $scope.isText = false;
        // $scope.multiOption = true;
        // $scope.isSubmit = false;
        // $scope.isNumeric = false;
        // $scope.isInstructions = false;
        // $scope.getMultipleOption(37);
        break;

      case "36-No":
        $scope.getQuestion(36, "Yes");
        break;

      case "37-text":
        $scope.getQuestion(45, "Yes");
        // $scope.questionObj = {
        //   question: "Is there a Tarpaulin on the floor?",
        //   questionNumber: 38,
        //   keyWord: "isTarpaulingOnFloorContainerised"
        // };
        // $scope.isText = false;
        // $scope.multiOption = false;
        // $scope.isSubmit = false;
        // $scope.isNumeric = false;
        // $scope.isInstructions = false;
        // $scope.multiOption = false;
        // $scope.multiOptionAndTextBox = false;
        break;

        // case "38-Yes":
        //   $scope.questionObj = {
        //     question: "Please describe the condition of tarpauling?",
        //     questionNumber: 53,
        //     keyWord: "conditionOfTarpaulinContainerised"
        //   };
        //   $scope.isText = true;
        //   $scope.multiOption = false;
        //   $scope.isSubmit = false;
        //   $scope.isNumeric = false;
        //   $scope.isInstructions = false;
        //   break;

      case "53-text":
        $scope.getQuestion(56, "Yes");
        break;

        // case "38-Yes":
        //   PopupService.showAlert("End of marine logic");
        //   break;

        // case "37-Welding":
        //   $scope.getQuestion(37, "Holes");
        //   break;

        // case "37-Door Caps":
        //   $scope.getQuestion(37, "Holes");
        //   break;

        // case "37-Others":
        //   $scope.getQuestion(37, "Holes");
        //   break;

      case "35-Open Vehicle":
        $scope.questionObj = {
          question: "Is there tarpaulin the top?",
          questionNumber: 39,
          keyWord: "isTarpaulinOnTop"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "39-No":

        $scope.getQuestion(45, "Yes");

        // $scope.questionObj = {
        //   question: "Floor condition?",
        //   questionNumber: 40,
        //   keyWord: "isLight"
        // };
        // $scope.isText = false;
        // $scope.multiOption = false;
        // $scope.isSubmit = false;
        // $scope.isNumeric = false;
        // $scope.isInstructions = false;
        // $scope.getMultipleOption(40);
        break;

      case "39-Yes":
        $scope.questionObj = {
          question: "No of Tarpaulin?",
          questionNumber: 41,
          keyWord: "noOfTarulin"
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
          question: "Was tarpaulin removed in your presence?",
          questionNumber: 43,
          keyWord: "isTarpaulinRemovedInUrPresence"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "43-Yes":
        $scope.questionObj = {
          question: "spread & check?",
          questionNumber: 44,
          keyWord: "spreadAndCheckedInstruction"
        };
        break;

      case "43-No":
        $scope.getQuestion(43, "Yes");
        break;

      case "44-text":
        $scope.questionObj = {
          question: "Are there any holes in the tarpaulin?",
          questionNumber: 45,
          keyWord: "holesTarpaulinOnTop"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "45-Yes":
        $scope.questionObj = {
          question: "Is there Tarpaulin on the floor?",
          questionNumber: 46,
          keyWord: "isTarpaulingOnFloorOpenVehicle"
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
        $scope.questionObj = {
          question: "Was tarpaulin removed in your presence?",
          questionNumber: 54,
          keyWord: "isTarpaulinRemovedInUrPresenceFloor"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "46-No":
        $scope.getQuestion(56, "Yes");
        break;

      case "54-Yes":
        $scope.questionObj = {
          question: "spread & checked?",
          questionNumber: 55,
          keyWord: "spreadAndCheckedInstruction"
        };
        break;

      case "54-No":
        $scope.questionObj = {
          question: "spread & checked?",
          questionNumber: 55,
          keyWord: "spreadAndCheckedInstruction"
        };
        break;


      case "55-text":
        $scope.questionObj = {
          question: "Are there any holes in the tarpaulin??",
          questionNumber: 56,
          keyWord: "holesTarpaulinOnFloor"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "56-Yes":
        $scope.questionObj = {
          question: "Floor condition?",
          questionNumber: 57,
          keyWord: "floorConditionOpenVehicle"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        $scope.getMultipleOption(57);
        break;

      case "56-No":
        $scope.getQuestion(56, "Yes");
        break;

      case "57-Good":
        $scope.questionObj = {
          question: "Possible source of ingress?",
          questionNumber: 47,
          keyWord: "ingressOpenVehicle"
        };
        $scope.isText = true;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "57-Bad":
        $scope.getQuestion(40, "Good");
        break;

      case "57-Average":
        $scope.getQuestion(40, "Good");
        break;

      case "47-text":
        $scope.questionObj = {
          questionNumber: 58,
          keyWord: "testReportInstruction"
        };
        break;

      case "58-text":
        $scope.questionObj = {
          question: "Can it be repaired??",
          questionNumber: 59,
          keyWord: "isRepairable"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "59-Yes":
        $scope.questionObj = {
          question: "How much is the estimated cost?",
          questionNumber: 69,
          keyWord: "estimatedCosting"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = true;
        $scope.isInstructions = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "59-No":
        $scope.questionObj = {
          question: "Can it be reprocessed?",
          questionNumber: 60,
          keyWord: "reprocess"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "60-Yes":
        $scope.getQuestion(59, "Yes");
        break;

      case "60-No":
        $scope.questionObj = {
          question: "Can it be reconditioned?",
          questionNumber: 61,
          keyWord: "recondition"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "61-Yes":
        $scope.getQuestion(59, "Yes");
        break;

      case "61-No":
        $scope.questionObj = {
          question: "Can it be cannibalised?",
          questionNumber: 62,
          keyWord: "canbalisation"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "62-Yes":
        $scope.getQuestion(59, "Yes");
        break;

      case "62-No":
        $scope.questionObj = {
          question: "Is it to be destroy?",
          questionNumber: 63,
          keyWord: "isDestroyable"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "63-No":
        $scope.questionObj = {
          question: "Input salvage value",
          questionNumber: 64,
          keyWord: "salvageValue"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = true;
        $scope.isInstructions = false;
        $scope.getNumericOption($scope.questionObj.questionNumber);
        break;

      case "63-Yes":
        $scope.questionObj = {
          question: "Dose it have residual value?",
          questionNumber: 65,
          keyWord: "isResidualValue"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "65-Yes":
        $scope.getQuestion(63, "No");
        break;

      case "65-No":
        $scope.getQuestion(66, "Yes");
        break;

      case "64-text":
        $scope.questionObj = {
          question: "Can it be retained?",
          questionNumber: 66,
          keyWord: "retain"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "66-Yes":
        $scope.questionObj = {
          question: "Retain?",
          questionNumber: 68,
          keyWord: "retain"
        };
        break;

      case "66-No":
        $scope.questionObj = {
          question: "Dispose salvage",
          questionNumber: 67,
          keyWord: "dispose"
        };
        $scope.isText = false;
        $scope.multiOption = false;
        $scope.isSubmit = false;
        $scope.isNumeric = false;
        $scope.isInstructions = false;
        break;

      case "67-text":
        $scope.getQuestion(66, "Yes");
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
      var lastQuestionNo = $scope.finalArray[$scope.finalArray.length - 1].no;
      if ($scope.finalArray[$scope.finalArray.length - 1].type == "radio") {

        if ($scope.finalArray[$scope.finalArray.length - 1].no == 12) {
          $scope.isText = false;
          $scope.multiOption = false;
          $scope.isSubmit = false;
          $scope.isNumeric = false;
          $scope.isInstructions = false;
        }

        if (lastQuestionNo == 36 || lastQuestionNo == 46) {
          $scope.multiOption = false;
          $scope.multiOptionAndTextBox = false;
        }
        $scope.multiOption = false;
        $scope.isText = false;
        $scope.isInstructions = false;
      } else if ($scope.finalArray[$scope.finalArray.length - 1].type == "text") {


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

          case 8:
            console.log("$scope.finalArray[8]", $scope.finalArray[objNo]);
            $scope.questionObj = $scope.finalArray[objNo];
            break;

          case 9:
            console.log("$scope.finalArray[9]", $scope.finalArray[objNo]);
            $scope.questionObj = $scope.finalArray[objNo];
            break;

          case 51:
            $scope.questionObj = $scope.finalArray[objNo];
            break;

          case 52:
            $scope.questionObj = $scope.finalArray[objNo];
            break;

          case 37:
            console.log("$scope.finalArray[objNo]", $scope.finalArray[objNo]);
            $scope.questionObj = $scope.finalArray[objNo];
            $scope.questionObj.answer = $scope.finalArray[objNo].answer;
            break;

          default:

            $scope.isText = true;
            $scope.isInstructions = false;
            $scope.multiOption = false;
        }
      }

      var qNo = $scope.questionObj.questionNumber;

      if (qNo == 35 || qNo == 34 || qNo == 57 || qNo == 1) {
        $scope.getMultipleOption(qNo);
      }

      if (qNo == 41 || qNo == 11 || qNo == 64 || qNo == 69 || qNo == 13) {
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

    if ($scope.questionObj.questionNumber == 64) {
      if (index == 0) {
        $scope.salvageAmt = val;
      }
      if (index == 1) {
        $scope.salvagePercentage = val;
      }
    }

    if ($scope.questionObj.questionNumber == 69) {
      $scope.estimatedCost = val;
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
        $scope.numericInputArray = ["Weight in LR", "Weight now"];
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

      case 69:
        $scope.numericInputArray = ["Est Cost"];
        $scope.numericValue[0] = $scope.estimatedCost;
        break;


      case 64:
        $scope.numericInputArray = ["Amt. in inr", "In %"];
        $scope.numericValue[0] = $scope.salvageAmt;
        $scope.numericValue[1] = $scope.salvagePercentage;
        break;

      default:
        console.log("Invalid choice");
    }
  };


  //Function to reset radio buttons of q no 37
  var isEmpty = [true, true, true, true];
  $scope.resetRadio = function (value, index) {

    if (index == 0 && value.answer[index] != "" && isEmpty[0] == false) {
      value.answer[index] = "";
      isEmpty[0] = true;
    } else if (index == 0 && value.answer[index] != "" && isEmpty[0] == true) {
      isEmpty[0] = false;
    }

    if (index == 1 && value.answer[index] != "" && isEmpty[1] == false) {
      value.answer[index] = "";
      isEmpty[1] = true;
    } else if (index == 1 && value.answer[index] != "" && isEmpty[1] == true) {
      isEmpty[1] = false;
    }

    if (index == 2 && value.answer[index] != "" && isEmpty[2] == false) {
      value.answer[index] = "";
      isEmpty[2] = true;
    } else if (index == 2 && value.answer[index] != "" && isEmpty[2] == true) {
      isEmpty[2] = false;
    }

    if (index == 3 && value.answer[index] != "" && isEmpty[3] == false) {
      value.answer[index] = "";
      isEmpty[3] = true;
    } else if (index == 3 && value.answer[index] != "" && isEmpty[3] == true) {
      isEmpty[3] = false;
    }

  };

});

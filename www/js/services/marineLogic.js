service.service('marineLogic', function ($state) {
  var marineLogicArray = [];
  this.saveObj = function (value) {
    marineLogicArray = value;
  };

  this.getMarineLogicObj = function () {
    return marineLogicArray;
  }
});

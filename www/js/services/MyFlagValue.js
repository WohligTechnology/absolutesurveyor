service.service('MyFlagValue', function () {
  var flag;
  this.setFlag = function (value) {
    flag = value;
  };

  this.getFlag = function () {
    return flag;
  };
});

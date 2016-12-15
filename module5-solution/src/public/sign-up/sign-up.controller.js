(function () {
"use strict";

angular.module('public')
.controller('SignUpController', SignUpController);

SignUpController.$inject = ['MenuService', 'SignUpDataService'];

function SignUpController(MenuService, SignUpDataService) {
  var $ctrl = this;
  $ctrl.submit = function() {
    MenuService.getMenuItemByShortName($ctrl.user.favourite).then(function(result) {
      $ctrl.invalidDish = false;
      $ctrl.user.favouriteMenuItem = result;
      SignUpDataService.setUserPref($ctrl.user);
      $ctrl.saved = true;
    }, function(error) {
      $ctrl.invalidDish = true;
      $ctrl.saved = false;
    });
  };
}

})();

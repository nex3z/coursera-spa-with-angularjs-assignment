(function () {
  'use strict'

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowCtrl = this;

  narrowCtrl.searchMenuItems = function () {
    if (narrowCtrl.searchTerm === "" || narrowCtrl.searchTerm===undefined) {
      narrowCtrl.found = [];
    } else {
      MenuSearchService.getMatchedMenuItems(narrowCtrl.searchTerm)
      .then(function(result) {
        narrowCtrl.found = result;
      });
    }
  }

  narrowCtrl.removeItem = function(itemIndex) {
    MenuSearchService.removeItem(itemIndex);
  };
}

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
    controller: FoundItemsDirectiveController,
    controllerAs: 'foundCtrl',
    bindToController: true
  };

  return ddo;
}

function FoundItemsDirectiveController() {
  var foundCtrl = this;
  foundCtrl.isBeforeSearch = function() {
    return foundCtrl.items == undefined;
  }
  foundCtrl.isNothingFound = function() {
    return foundCtrl.items != undefined && foundCtrl.items.length === 0;
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;
  var foundItems = [];

  service.getMatchedMenuItems = function(searchTerm) {
    return $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function(result) {
      var allItems = result.data.menu_items;
      foundItems = [];
      for (var index = 0; index < allItems.length; ++index) {
        if (allItems[index].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
          foundItems.push(allItems[index]);
        }
      }
      return foundItems;
    });
  };

  service.removeItem = function(itemIndex) {
    foundItems.splice(itemIndex, 1);
  };

}

})();

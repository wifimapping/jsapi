angular
.module('DemoApp', ['WifiMapping'])
.controller('DemoCtrl', function($scope, wifiMappingAPI) {
    $scope.text = wifiMappingAPI.test();
});

angular
.module('DemoApp', ['WifiMapping'])
.controller('DemoCtrl', function($scope, wifiMappingAPI) {
    $scope.params = {
        page_size: 5,
        page: 0,
        acc: '',
        altitude: '',
        startdate: '5/10/2016',
        enddate: '',
        device_mac: '',
        app_version: '',
        droid_version: '',
        bssid: '',
        ssid: 'nyu',
        caps: '',
        level: '',
        freq: ''
    };

    $scope.columns = {
        lat: false,
        lng: false,
        acc: false,
        altitude: false,
        time: false,
        device_mac: false,
        app_version: false,
        droid_version: false,
        device_model: false,
        ssid: true,
        bssid: false,
        caps: false,
        level: false,
        freq: false
    };

    $scope.execute = function() {
        $scope.text = 'Pending...';
        
        var columns = [];
        for (var col in $scope.columns) {
            if ($scope.columns[col]) {
                columns.push(col);
            }
        }
        var params = {columns: columns};
        for (param in $scope.params) {
            if ($scope.params[param]) {
                params[param] = $scope.params[param];
            }
        }
        wifiMappingAPI.query(params).then(function(res) {
            $scope.text = res;
        });
    }
});

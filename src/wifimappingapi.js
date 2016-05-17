angular
.module('WifiMapping', [])
.provider('wifiMappingAPI', function() {
    this.$get = [function() {
        return {
            test: function() {
                return 'test';
            }
        }
    }];
});

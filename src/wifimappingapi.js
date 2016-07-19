// This is a javascript wrapper on top of the WiFind data API.  It can be used
// to query the WiFind API.
//
// # Installation
//
//         bower install --save git@github.com:wifimapping/jsapi.git
//
// # Usage
//
// In your HTML file include the script:
//
//     <script src="wifimappingapi.js"></script>
//
// In your javascript code:
//
//     angular
//     .module('App', ['WiFind'])
//     .controller('Ctrl', function(wiFindAPI) {
//
//         wifiMappingAPI.query({
//              ssid: 'nyu'
//         }).then(function(res) {
//             //Do stuff
//         });
//     });
//
// # Demo
//
// The `demo` directory contains an example of using the library.  It can easily
// be run with:
//
//     # Python 2
//     $ python -m SimpleHTTPServer
//     # Python 3
//     $ python -m http.server
//
// And then navigating to `http://localhost:8000/demo/` in a browser.
//
// # Functions
//
// ## wifiMappingAPI.query()
//
// Query the API for individual scans.  Takes an object with the following
// parameters:
//
// * `page_size`: Number of responses
// * `page`: when using page size, which page to return.
//     Starts at 0.
// * `columns`: a list of columns to return.  Available columns are:
//     * `idx`
//     * `lat`
//     * `lng`
//     * `acc`
//     * `altitude`
//     * `time`
//     * `device_mac`
//     * `app_version`
//     * `droid_version`
//     * `device_model`
//     * `ssid`
//     * `bssid`
//     * `caps`
//     * `level`
//     * `freq`
// * `acc`: accuracy greater than or equal to the given value
// * `startdate`: date grater than or equal to this date
// * `enddate`: date less than this date
// * `device_mac`: scan done by the given device mac address
// * `app_version`: scan done by given app version
// * `droid_version`: scan done by phone with given android version
// * `device_model`: scan done by phone of given model
// * `ssid`: a single ssid or list of ssids
// * `bssid`: equal to the given bssid
// * `caps`: contains a given capability. i.e. `wps`
// * `level`: greater than or equal to the given signal strength
// * `freq`: Equal to the specified frequency
//
// Returns a list of scan results with the columns specified.
//
// ## wifiMappingAPI.getAccessPoints()
//
// Query the API for unique access points.  Takes an object with the following
// parameters:
//
// * `page_size`: Number of responses
// * `page`: when using page size, which page to return.
//     Starts at 0.
// * `columns`: a list of columns to return.  Available columns are:
//     * `ssid`
//     * `bssid`
//     * `caps`
//     * `freq`
// * `acc`: accuracy greater than or equal to the given value
// * `startdate`: date grater than or equal to this date
// * `enddate`: date less than this date
// * `device_mac`: scan done by the given device mac address
// * `app_version`: scan done by given app version
// * `droid_version`: scan done by phone with given android version
// * `device_model`: scan done by phone of given model
// * `ssid`: a single ssid or list of ssids
// * `bssid`: equal to the given bssid
// * `caps`: contains a given capability. i.e. `wps`
// * `level`: greater than or equal to the given signal strength
// * `freq`: Equal to the specified frequency
//
// Returns a list of access points with the columns specified.
//
// # The Code


// URL of the API
var URL = 'http://wifindproject.com/wifipulling/';

// Mapping of param names/columns from new to old
var MAPPING = {
    'page_size': 'batch',
    'page': 'offset'
};

// List of valid parameters
var PARAMS = [
    'page_size', 'page', 'acc', 'altitude', 'startdate',
    'enddate', 'device_mac', 'app_version', 'droid_version',
    'bssid', 'caps', 'level', 'freq',
    'columns', 'ssid',
];

// List of valid columns for query
var QUERY_COLUMNS = [
    'lat', 'lng', 'acc', 'altitude', 'time', 'device_mac',
    'app_version', 'droid_version', 'device_model', 'ssid', 'bssid',
    'caps', 'level', 'freq'
];

// List of valid columns for getAccessPoints
var AP_COLUMNS = [
    'ssid', 'bssid', 'caps', 'freq'
];


// ## getRequestColumns

// Return a pipe separated list of columns to be returned by the API.
// `validColumns` depends on the type of query.
// `params` is an object containing an attribute `columns` which is an array
// of column names.
function getRequestColumns(validColumns, params) {
    if (params.columns) {
        var columns = [];
        for (i in validColumns) {
            var column = validColumns[i];

            if (params.columns.indexOf(column) >= 0) {
                if (column in MAPPING) {
                    columns.push(MAPPING[column]);
                } else {
                    columns.push(column);
                }
            }
        }
        return columns.join('|');
    }
}

// ## getRequestParams

// Format the parameters correctly for the API.
// API. `validParams` and `validColumns` depend on the request type.
// `params` is an object of parameters.
function getRequestParams(validParams, validColumns, params) {
    // Create a pipe-separated string of ssids if it is an array.
    var ssid = params.ssid;
    if (ssid & Array.isArray(params.ssid)) {
        ssid = params.ssid.join('|');
    }

    queryParams = {
        ssid: ssid,
        columns: getRequestColumns(validColumns, params),
    };

    for (param in params) {
        if (['ssid', 'columns'].indexOf(param) >= 0) {
            continue;
        }

        if (validParams.indexOf(param) >= 0) {
            if (param in MAPPING) {
                queryParams[MAPPING[param]] = params[param];
            } else {
                queryParams[param] = params[param];
            }
        }
    }

    return queryParams;
}

// # wiFindAPI

// Create the WiFind angular module which exposes `wiFindAPI`
angular
.module('WiFind', [])
.provider('wiFindAPI', function() {
    this.$get = ['$http', function($http) {
        return {

            queryParams: PARAMS,
            queryColumns: QUERY_COLUMNS,
            apColumns: AP_COLUMNS,


            // ## query

            // Query the API for individual scans.  Accepts an object `params`
            // with the following properties:
            //
            // * page_size: Number of responses
            // * page: when using page size, which page to return.
            //     Starts at 0.
            // * columns: a list of columns to return.  Available columns
            //     are: idx, lat, lng, acc, altitude, time, device_mac
            //     app_version, droid_version, device_model, ssid, bssid,
            //     caps, level and freq.
            // * acc: accuracy greater than or equal to the given value
            // * startdate: date grater than or equal to this date
            // * enddate: date less than this date
            // * device_mac: scan done by the given device mac address
            // * app_version: scan done by given app version
            // * droid_version: scan done by phone with given android version
            // * device_model: scan done by phone of given model
            // * ssid: a single ssid or list of ssids
            // * bssid: equal to the given bssid
            // * caps: contains a given capability. i.e. `wps`
            // * level: greater than or equal to the given
            //     signal strength
            // * freq: Equal to the specified frequency

            query: function(params) {
                return $http.get(URL, {
                    params: getRequestParams(PARAMS, QUERY_COLUMNS, params)
                }).then(function(res) {
                    return res.data;
                });
            },


            // ## getAccessPoints

            // Query the API for unique access points.
            // Accepts an object `params` with the following properties:
            //
            // * page_size: Number of responses
            // * page: when using page size, which page to return.
            //     Starts at 0.
            // * columns: a list of columns to return.  Available columns
            //     are: ssid, bssid, caps, and freq.
            // * acc: accuracy greater than or equal to the given value
            // * startdate: date grater than or equal to this date
            // * enddate: date less than this date
            // * device_mac: scan done by the given device mac address
            // * app_version: scan done by given app version
            // * droid_version: scan done by phone with given android version
            // * device_model: scan done by phone of given model
            // * ssid: a single ssid or list of ssids
            // * bssid: equal to the given bssid
            // * caps: contains a given capability. i.e. `wps`
            // * level: greater than or equal to the given
            //     signal strength
            // * freq: Equal to the specified frequency
            getAccessPoints: function(params) {
                var queryParams = getRequestParams(PARAMS, AP_COLUMNS, params);
                queryParams['distinct'] = 1;
                return $http.get(URL, {
                    params: queryParams
                }).then(function(res) {
                    return res.data;
                });
            }
            //
        }
    }];
});

'use strict';

angular.module('isa-export-parser', [])

.factory('Parseds', ['$http',
    function($http) {
        var get = function(file, callback) {
            $http.get("json/" + file).then(function(response) {
                callback(response.data)
            })
        }
        return {
            get: get
        }
    }
])

.controller('AppCtrl', ['$scope', 'Parseds',
    function($scope, Parseds) {
        $scope.sections = [{
            name: "URL Sets",
            url: "parsed_urlsets.json",
        }, {
            name: "User Sets",
            url: "parsed_usersets.json",
        }]

        $scope.sections.forEach(function(section) {
            Parseds.get(section.url, function(data) {
                section.header = data[0]
                section.data = data.slice(1, data.length)
            })
        })
    }
])

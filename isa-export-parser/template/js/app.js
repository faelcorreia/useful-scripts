'use strict';

angular.module('isa-export-parser', [])

.factory('Parseds', ['$http',
    function($http) {
        var get = function(file, callback) {
            $http.get("json/" + "parsed_urlsets.json").then(function(response) {
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
            url: "urlsets",
        }]

        $scope.sections.forEach(function(section) {
            Parseds.get("parsed_" + section.url + ".json", function(data) {
                switch (section.url) {
                    case "urlsets":
                        section.header = data[0]
                        section.data = data.slice(1, data.length)
                        break
                    default:
                        break
                }
            })
        })
    }
])

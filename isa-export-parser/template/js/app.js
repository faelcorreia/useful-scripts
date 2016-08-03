'use strict';

angular.module('isa-export-parser', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
            url: '/app',
            templateUrl: 'views/app.html',
            controller: 'AppCtrl'
        })

        .state('app.section', {
            url: '/section/:sectionId',
            templateUrl: 'views/section.html',
            controller: 'SectionCtrl'
        })

        $urlRouterProvider.otherwise('/app')
    }
])

.constant("sections", {
    data: [{
        name: "Address Ranges",
        url: "parsed_addressranges.json",
    }, {
        name: "Computer Sets",
        url: "parsed_computersets.json",
    }, {
        name: "Computers",
        url: "parsed_computers.json",
    }, {
        name: "Domain Name Sets",
        url: "parsed_domainnamesets.json",
    }, {
        name: "Enterprise Networks",
        url: "parsed_enterprisenetworks.json",
    }, {
        name: "Protocols",
        url: "parsed_protocols.json",
    }, {
        name: "Proxy Schedule Templates",
        url: "parsed_proxyscheduletemplates.json",
    }, {
        name: "URL Sets",
        url: "parsed_urlsets.json",
    }, {
        name: "User Sets",
        url: "parsed_usersets.json",
    }]
})

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

.controller('AppCtrl', ['$scope', 'sections',
    function($scope, sections) {
        $scope.sections = sections.data
    }
])

.controller('SectionCtrl', ['$scope', '$stateParams', 'Parseds', 'sections',
    function($scope, $stateParams, Parseds, sections) {
        var section = sections.data[$stateParams.sectionId]
        Parseds.get(section.url, function(data) {
            section.header = data[0]
            section.data = data.slice(1, data.length)
        })
        $scope.section = section
    }
])

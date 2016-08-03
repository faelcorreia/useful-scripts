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

        .state('app.policies', {
            url: '/policies',
            templateUrl: 'views/section.html',
            controller: 'PoliciesCtrl'
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
        name: "Networks Sets",
        url: "parsed_networksets.json",
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

.controller('AppCtrl', ['$scope', 'sections', 'Parseds',
    function($scope, sections, Parseds) {
        sections.data.forEach(function(section) {
            Parseds.get(section.url, function(data) {
                section.header = data[0]
                section.data = data.slice(1, data.length)
            })
        })
        $scope.sections = sections.data
    }
])

.controller('PoliciesCtrl', ['$scope', 'Parseds', 'sections',
    function($scope, Parseds, sections) {
        var section = {
            name: "Policies",
            url: "parsed_policies.json",
        }

        var convertId = function(line, policyPos, sectionPos, namePos) {
            try {
                var newValue
                line[policyPos].forEach(function(obj1, index) {
                    sections.data[sectionPos].data.forEach(function(obj2) {
                        if (obj1 === obj2[0][0]) {
                            newValue = obj2[namePos][0]
                        }
                    })
                    line[policyPos][index] = newValue
                })
            } catch (e) {
                console.log(e)
            }
        }

        Parseds.get(section.url, function(data) {
            section.header = data[0]
            section.data = data.slice(1, data.length)
            section.data.forEach(function(line) {
                convertId(line, section.header.indexOf("SourceNetworkSets"), 5, 1)
                convertId(line, section.header.indexOf("SourceComputers"), 2, 1)
                convertId(line, section.header.indexOf("SourceAddressRanges"), 0, 1)
                convertId(line, section.header.indexOf("SourceComputerSets"), 1, 1)
                convertId(line, section.header.indexOf("SourceEnterpriseNetworks"), 4, 1)

                convertId(line, section.header.indexOf("DestinationNetworkSets"), 5, 1)
                convertId(line, section.header.indexOf("DestinationComputers"), 2, 1)
                convertId(line, section.header.indexOf("DestinationAddressRanges"), 0, 1)
                convertId(line, section.header.indexOf("DestinationComputerSets"), 1, 1)
                convertId(line, section.header.indexOf("DestinationEnterpriseNetworks"), 4, 1)

                convertId(line, section.header.indexOf("DomainNameSets"), 3, 1)
                convertId(line, section.header.indexOf("ProtocolsUsed"), 6, 1)
                convertId(line, section.header.indexOf("URLSet"), 8, 1)
                convertId(line, section.header.indexOf("UserSets"), 9, 1)
                convertId(line, section.header.indexOf("ScheduleUsed"), 7, 1)
            })
            $scope.section = section
        })
    }
])

.controller('SectionCtrl', ['$scope', '$stateParams', 'Parseds', 'sections',
    function($scope, $stateParams, Parseds, sections) {
        $scope.section = sections.data[$stateParams.sectionId]
    }
])

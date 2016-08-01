var parseString = require('xml2js').parseString
var parser = require('./parser.js')
var _ = require('lodash');

var parseXML = function(xml, callback) {
    parseString(xml, function(err, result) {
        var header = ["ID", "Name", "Enabled", "SourceNetworkSets",
            "SourceComputers", "SourceAddressRanges", "SourceSubnets",
            "SourcesComputerSets", "SourceEnterpriseNetworks", "DestinationNetworkSets",
            "DestinationComputers", "DestinationAddressRanges", "DestinationSubnets",
            "DestinationComputerSets", "DestinationEnterpriseNetworks", "DestinationDomainNameSets",
            "ProtocolsUsed", "ContentTypeSetsUsed", "URLSet", "UserSets"
        ]
        var policies = []
        var element = result["fpc4:Root"]["fpc4:Enterprise"][0]["fpc4:Policies"][0]["fpc4:Policy"][0]["fpc4:PolicyRules"][0]["fpc4:PolicyRule"]
        element.forEach(function(policyRule, index) {
            var policy = []
            policy[0] = policyRule["$"]["StorageName"]
            policy[1] = policyRule["fpc4:Name"][0]["_"]
            policy[2] = policyRule["fpc4:Enabled"][0]["_"]
            if (typeof(policyRule["fpc4:SelectionIPs"]) !== "undefined") {
                policyRule["fpc4:SelectionIPs"][0]["fpc4:Refs"].forEach(function(ref) {
                    var i
                    switch (ref["$"]["StorageName"]) {
                        case "NetworkSets":
                            i = 3
                            break
                        case "Computers":
                            i = 4
                            break
                        case "AddressRanges":
                            i = 5
                            break
                        case "Subnets":
                            i = 6
                            break
                        case "ComputerSets":
                            i = 7
                            break
                        case "EnterpriseNetworks":
                            i = 8
                            break
                        default:
                            break
                    }
                    if (typeof(ref["fpc4:Ref"]) !== "undefined") {
                        policy[i] = ref["fpc4:Ref"][0]["fpc4:Name"][0]["_"]
                    }
                })
            }
            if (typeof(policyRule["fpc4:AccessProperties"]) !== "undefined") {
                if (typeof(policyRule["fpc4:AccessProperties"][0]["fpc4:SelectionIPs"]) !== "undefined") {
                    policyRule["fpc4:AccessProperties"][0]["fpc4:SelectionIPs"][0]["fpc4:Refs"].forEach(function(ref) {
                        var i
                        switch (ref["$"]["StorageName"]) {
                            case "NetworkSets":
                                i = 9
                                break
                            case "Computers":
                                i = 10
                                break
                            case "AddressRanges":
                                i = 11
                                break
                            case "Subnets":
                                i = 12
                                break
                            case "ComputerSets":
                                i = 13
                                break
                            case "EnterpriseNetworks":
                                i = 14
                                break
                            default:
                                break
                        }
                        if (typeof(ref["fpc4:Ref"]) !== "undefined") {
                            policy[i] = ref["fpc4:Ref"][0]["fpc4:Name"][0]["_"]
                        }
                    })
                }
                if (typeof(policyRule["fpc4:AccessProperties"][0]["fpc4:Refs"]) !== "undefined") {
                    policyRule["fpc4:AccessProperties"][0]["fpc4:Refs"].forEach(function(ref) {
                        var i
                        switch (ref["$"]["StorageName"]) {
                            case "DestinationDomainNameSets":
                                i = 15
                                break
                            case "ProtocolsUsed":
                                i = 16
                                break
                            case "ContentTypeSetsUsed":
                                i = 17
                                break
                            case "URLSet":
                                i = 18
                                break
                            case "UserSets":
                                i = 19
                                break
                            default:
                                break
                        }
                        if (typeof(ref["fpc4:Ref"]) !== "undefined") {
                            policy[i] = ref["fpc4:Ref"][0]["fpc4:Name"][0]["_"]
                        }
                    })
                }
            }
            policies.push(policy)
        })
        callback({
            csv: parser.listsToCsv(header, policies)
        })
    })
}

module.exports = {
    parseXML: parseXML
}

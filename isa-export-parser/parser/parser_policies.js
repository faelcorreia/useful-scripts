var parseString = require('xml2js').parseString
var parser = require('./parser.js')
var _ = require('lodash');

var saveRef = function(arr) {
    var list = []
    if (typeof(arr) !== "undefined") {
        arr.forEach(function(elem, index) {
            list.push(elem["fpc4:Name"][0]["_"])
        })
    }
    return list
}

var parseXML = function(xml, callback) {
    parseString(xml, function(err, result) {
        var header = ["ID", "Name", "Enabled", "SourceNetworkSets",
            "SourceComputers", "SourceAddressRanges", "SourceSubnets",
            "SourceComputerSets", "SourceEnterpriseNetworks", "DestinationNetworkSets",
            "DestinationComputers", "DestinationAddressRanges", "DestinationSubnets",
            "DestinationComputerSets", "DestinationEnterpriseNetworks", "DomainNameSets",
            "ProtocolsUsed", "ContentTypeSetsUsed", "URLSet", "UserSets", "ScheduleUsed"
        ]
        var policies = []
        var element = result["fpc4:Root"]["fpc4:Enterprise"][0]["fpc4:Policies"][0]["fpc4:Policy"][0]["fpc4:PolicyRules"][0]["fpc4:PolicyRule"]
        element.forEach(function(policyRule, index) {
            var policy = []
            policy[0] = [policyRule["$"]["StorageName"]]
            policy[1] = [policyRule["fpc4:Name"][0]["_"]]
            policy[2] = [policyRule["fpc4:Enabled"][0]["_"]]
            if (typeof(policyRule["fpc4:SelectionIPs"]) !== "undefined") {
                policyRule["fpc4:SelectionIPs"][0]["fpc4:Refs"].forEach(function(ref) {
                    var i = header.indexOf("Source" + ref["$"]["StorageName"])
                    policy[i] = saveRef(ref["fpc4:Ref"])
                })
            }

            if (typeof(policyRule["fpc4:AccessProperties"]) !== "undefined") {
                if (typeof(policyRule["fpc4:AccessProperties"][0]["fpc4:SelectionIPs"]) !== "undefined") {
                    policyRule["fpc4:AccessProperties"][0]["fpc4:SelectionIPs"][0]["fpc4:Refs"].forEach(function(ref) {
                        var i = header.indexOf("Destination" + ref["$"]["StorageName"])
                        policy[i] = saveRef(ref["fpc4:Ref"])
                    })
                }

                if (typeof(policyRule["fpc4:AccessProperties"][0]["fpc4:Refs"]) !== "undefined") {
                    policyRule["fpc4:AccessProperties"][0]["fpc4:Refs"].forEach(function(ref) {
                        var i = header.indexOf(ref["$"]["StorageName"])
                        policy[i] = saveRef(ref["fpc4:Ref"])
                    })
                }
            }
            policies.push(policy)
        })
        callback({
            csv: parser.listsToCsv(header, policies),
            json: [header].concat(policies)
        })
    })
}

module.exports = {
    parseXML: parseXML
}

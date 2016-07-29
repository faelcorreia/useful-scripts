var parseString = require('xml2js').parseString

var Type = Object.freeze({
    POLICIES: 0,
    URL_SETS: 1,
    ENTERPRISE_NETWORKS: 2
})
var parseXML = function(xml, type, callback) {
    parseString(xml, function(err, result) {
        var element, model
        if (type == 0) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:Policies'][0]['fpc4:Policy'][0]['fpc4:PolicyRules'][0]
            model = require('../json/policies.json')
        }
        if (type == 1) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:RuleElements'][0]['fpc4:URLSets'][0]
            model = require('../json/urlsets.json')
        }
        if (type == 2) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:NetConfig'][0]['fpc4:EnterpriseNetworks'][0]
            model = require('../json/enterprisenetworks.json')
        }
        callback(parseXMLRecursive(element, model, null, [], 0))
    })
}
var parseXMLRecursive = function(element, model, parsed, i) {
    if (parsed === null)
        parsed = {}
    parsed[model.name] = []
    if (typeof(element[model.name]) !== 'undefined') {
        element[model.name].forEach(function(elementChild) {
            var obj = {}
            model.attrs.forEach(function(attr) {
                obj[attr] = elementChild['$'][attr]
            })
            if (model.needValue) {
                obj['value'] = elementChild['_']
            }
            obj.childs = {}
            model['childs'].forEach(function(modelChild) {
                parseXMLRecursive(elementChild, modelChild, obj.childs, i + 1)
            })
            parsed[model.name].push(obj)
        })
    }
    return parsed
}

module.exports = {
    Type: Type,
    parseXML: parseXML,
    parseXMLRecursive: parseXMLRecursive
}

var parseString = require('xml2js').parseString

var Type = Object.freeze({
    POLICIES: 0,
    URL_SETS: 1,
    ENTERPRISE_NETWORKS: 2
})
var parseXML = function(xml, type, callback) {
    parseString(xml, function(err, result) {
        var element, model
        var header = []
        var lists = [[]]
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
        var parsed = {}
        parseXMLRecursive(element, model, parsed, 0, lists, header)
        console.log(header)
        console.log(lists)
        callback(parsed)
    })
}
var parseXMLRecursive = function(element, model, parsed, i, lists, header) {
    if (parsed === null)
        parsed = {}
    parsed[model.tag] = []
    if (typeof(element[model.tag]) !== 'undefined') {
        element[model.tag].forEach(function(elementChild) {
            var obj = {
                attrs:[]
            }
            model.attrs.forEach(function(attr) {
                var newAttr = {}
                newAttr[attr.tag] = elementChild['$'][attr.tag]
                obj.attrs.push(newAttr)

                if (header.indexOf(attr.label) <= -1) {
                    header[i] = attr.label
                    lists.forEach(function(list) {
                        list[i] = newAttr[attr.tag]
                    })
                }
                else {

                }
                i++             
            })
            if (model.needValue) {
                obj.value = elementChild['_']
                if (header.indexOf(model.label) <= -1) {
                    header[i] = model.label
                    lists.forEach(function(list) {
                        list[i] = obj.value
                    })
                }   
                else {
                
                }
                i++
            }
            obj.childs = {}
            if (typeof(model['childs']) !== 'undefined') {
                model['childs'].forEach(function(modelChild) {
                    i = parseXMLRecursive(elementChild, modelChild, obj.childs, i, lists, header)
                })
            }
            parsed[model.tag].push(obj)
        })
    }
    return i
}

module.exports = {
    Type: Type,
    parseXML: parseXML,
    parseXMLRecursive: parseXMLRecursive
}

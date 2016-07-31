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
        var lists = [header]
        var json = {}
        if (type == Type.POLICIES) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:Policies'][0]['fpc4:Policy'][0]['fpc4:PolicyRules'][0]
            model = require('../scheme/policies.json')
        }
        if (type == Type.URL_SETS) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:RuleElements'][0]['fpc4:URLSets'][0]
            model = require('../scheme/urlsets.json')
        }
        if (type == Type.ENTERPRISE_NETWORKS) {
            element = result['fpc4:Root']['fpc4:Enterprise'][0]['fpc4:NetConfig'][0]['fpc4:EnterpriseNetworks'][0]
            model = require('../scheme/enterprisenetworks.json')
        }
        parseXMLRecursive(element, model, json, 0, lists, [], header)
        var parsed = {
            json: json,
            csv: lists
        }
        callback(parsed)
    })
}
var parseXMLRecursive = function(element, model, parsed, cont, lists, list, header) {
    if (parsed === null)
        parsed = {}
    parsed[model.tag] = []
    cont = 0
    if (typeof(element[model.tag]) !== 'undefined') {
        element[model.tag].forEach(function(elementChild, index) {
            var obj = {
                attrs: []
            }
            model.attrs.forEach(function(attr) {
                var newAttr = {}
                newAttr[attr.tag] = elementChild['$'][attr.tag]
                obj.attrs.push(newAttr)
                list.push(newAttr[attr.tag])
                cont++
                if (header.indexOf(attr.label) <= -1) {
                    header.push(attr.label)
                }
            })
            if (model.needValue) {
                obj.value = elementChild['_']
                list.push(obj.value)
                cont++
                if (header.indexOf(model.label) <= -1) {
                    header.push(model.label)
                }
            }
            obj.childs = {}
            if (typeof(model['childs']) !== 'undefined') {
                model['childs'].forEach(function(modelChild) {
                    cont += parseXMLRecursive(elementChild, modelChild, obj.childs, cont, lists, list, header)
                })
            }
            parsed[model.tag].push(obj)
            if (model.newLine) {
                lists.push(list)
                var listTmp = JSON.parse(JSON.stringify(list))

                if (index + 1 < element[model.tag].length) {
                    var contTmp = cont
                    for (var i = 0; i < cont; i++) {
                        listTmp.pop()
                        contTmp--
                    }
                    cont = contTmp
                }

                list = listTmp
            }
        })
    }
    return cont
}

module.exports = {
    Type: Type,
    parseXML: parseXML,
    parseXMLRecursive: parseXMLRecursive
}

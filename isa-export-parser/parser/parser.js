var parseString = require('xml2js').parseString

var parseXML = function(xml, scheme, callback) {
    parseString(xml, function(err, result) {
        var model = require('../scheme/' + scheme)
        var header = []
        var lists = [header]
        var json = {}

        parseXMLRecursive(result, model, json, 0, lists, [], header)
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
        if (typeof(element[model.tag].forEach) === 'undefined') {
            element[model.tag] = [element[model.tag]]
        }
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
    parseXML: parseXML,
    parseXMLRecursive: parseXMLRecursive
}

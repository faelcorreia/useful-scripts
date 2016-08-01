var parseString = require('xml2js').parseString
var _ = require('lodash');

var parseXML = function(xml, scheme, callback) {
    parseString(xml, function(err, result) {
        var model = require('../scheme/' + scheme)
        var header = []
        var lists = []
        var json = {}
        var listPos = {
            pos: 0
        }

        parseXMLRecursive(result, model, json, 0, lists, [], header, listPos)
        var parsed = {
            json: json,
            csv: listsToCsv(header, lists)
        }
        callback(parsed)
    })
}

var listsToCsv = function(header, lists) {
    var csv = listToCsv(header, header.length, ";") + "\n"
    lists.forEach(function(list, i) {
        csv += listToCsv(list, header.length, ";") + "\n"
    })
    return csv
}

var listToCsv = function(list, size, char) {
    var csv = ""
    for (var i = 0; i < size; i++) {
        var value
        if (typeof(list[i]) == "undefined") {
            value = ""
        } else {
            value = list[i]
        }
        csv += "\"" + value + "\""
        if (i + 1 < size) {
            csv += char
        }
    }
    return csv
}

var parseXMLRecursive = function(element, model, parsed, cont, lists, list, header, listPos) {
    if (parsed === null)
        parsed = {}
    parsed[model.tag] = []
    cont = 0
    if (typeof(element[model.tag]) !== 'undefined') {
        if (!_.isArray(element[model.tag])) {
            element[model.tag] = [element[model.tag]]
        }
        element[model.tag].forEach(function(elementChild, index) {
            var obj = {
                attrs: []
            }
            model.attrs.forEach(function(attr) {
                if (header.indexOf(attr.label) <= -1) {
                    header.push(attr.label)
                }
                var index = header.indexOf(attr.label)
                var newAttr = {}
                newAttr[attr.tag] = elementChild['$'][attr.tag]
                obj.attrs.push(newAttr)
                list[index] = newAttr[attr.tag]
                cont++

            })
            if (model.needValue) {
                if (header.indexOf(model.label) <= -1) {
                    header.push(model.label)
                }
                var index = header.indexOf(model.label)
                obj.value = elementChild['_']
                list[index] = obj.value
                cont++
            }
            obj.childs = {}
            if (typeof(model['childs']) !== 'undefined') {
                model['childs'].forEach(function(modelChild) {
                    cont += parseXMLRecursive(elementChild, modelChild, obj.childs, cont, lists, list, header, listPos)
                })
            }
            parsed[model.tag].push(obj)
            if (model.newLine) {
                var exists = false
                lists.forEach(function(l) {
                    if (_.isEqual(l, list)) {
                        exists = true
                    }
                })

                if (!exists) {
                    lists.push(list)
                }
                var listTmp = _.cloneDeep(list)

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
    listsToCsv,listsToCsv
}

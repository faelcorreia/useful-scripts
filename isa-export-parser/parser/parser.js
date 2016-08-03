var parseString = require('xml2js').parseString
var _ = require('lodash');

var parseXML = function(xml, scheme, callback) {
    parseString(xml, function(err, element) {
        var model = require('../scheme/' + scheme)
        var header = []
        var lists = []
        var parsed = {}

        parseXMLRecursive(element, model, lists, [], header)
        var parsed = {
            csv: listsToCsv(header, lists),
            json: [header].concat(lists)
        }
        callback(parsed)
    })
}

var listsToCsv = function(header, lists) {
    var csv = []
    csv.push(listToCsv(header, header.length, ";"))
    lists.forEach(function(list, i) {
        csv.push(listToCsv(list, header.length, ";"))
    })
    return csv.join("\n")
}

var listToCsv = function(list, size, char) {
    var csv = []
    for (var i = 0; i < size; i++) {
        var value
        if (typeof(list[i]) === "undefined") {
            value = ""
        } else {
            if (_.isArray(list[i]))
                value = list[i].join("|")
            else
                value = list[i]
        }
        csv.push("\"" + value + "\"")
    }
    return csv.join(char)
}

var parseXMLRecursive = function(element, model, lists, list, header) {
    if (typeof(element[model.tag]) !== 'undefined') {
        if (!_.isArray(element[model.tag])) {
            element[model.tag] = [element[model.tag]]
        }
        element[model.tag].forEach(function(elementChild, index) {
            model.attrs.forEach(function(attr) {
                if (header.indexOf(attr.label) <= -1) {
                    header.push(attr.label)
                }
                var index = header.indexOf(attr.label)
                if (typeof(list[index]) === "undefined") {
                    list[index] = []
                }
                list[index].push(elementChild['$'][attr.tag])
            })
            if (model.needValue) {
                if (header.indexOf(model.label) <= -1) {
                    header.push(model.label)
                }
                var index = header.indexOf(model.label)
                if (typeof(list[index]) === "undefined") {
                    list[index] = []
                }
                list[index].push(elementChild['_'])
            }
            if (typeof(model['children']) !== 'undefined') {
                model['children'].forEach(function(modelChild) {
                    parseXMLRecursive(elementChild, modelChild, lists, list, header)
                })
            }
            if (model.newLine) {
                lists.push(list)
                list = []
            }
        })
    }
}

module.exports = {
    parseXML: parseXML,
    listsToCsv,
    listsToCsv
}

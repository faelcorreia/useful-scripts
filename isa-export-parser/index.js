var fs = require('fs')
var parser = require('./parser/parser.js')

if (process.argv.length == 3) {
    var file = process.argv[2]
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log(err)
        }
        if (!fs.existsSync("out")) {
            fs.mkdirSync("out")
        }

        var outs = [{
            scheme: "policies.json",
            file: "parsed_policies.json"
        }, {
            scheme: "urlsets.json",
            file: "parsed_urlsets.json"
        }, {
            scheme: "usersets.json",
            file: "parsed_usersets.json"
        }, {
            scheme: "enterprisenetworks.json",
            file: "parsed_enterprisenetworks.json"
        }]

        outs.forEach(function(out) {
            parser.parseXML(data, out.scheme, function(parsed) {
                fs.writeFile("out/" + out.file, JSON.stringify(parsed.csv, null, 2), function(err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("out/" + out.file + " saved.");
                })
            })
        })
    })
} else {
    console.log('Usage: node index.js filename')
}

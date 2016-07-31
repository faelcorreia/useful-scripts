var fs = require('fs')
var parser = require('./parser/parser.js')

if (process.argv.length == 3) {
    var file = process.argv[2]
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            return console.log(err)
        }
        if (!fs.existsSync('out')) {
            fs.mkdirSync('out')
        }
        parser.parseXML(data, parser.Type.URL_SETS, function(parsed) {
            fs.writeFile("out/parsed_urlsets.json", JSON.stringify(parsed.csv, null, 2), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("out/parsed_urlsets.json saved.");
            })
        })
        parser.parseXML(data, parser.Type.ENTERPRISE_NETWORKS, function(parsed) {
            fs.writeFile("out/parsed_enterprisenetworks.json", JSON.stringify(parsed.csv, null, 2), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("out/parsed_enterprisenetworks.json saved.");
            })
        })
    })
} else {
    console.log('Usage: node index.js filename')
}

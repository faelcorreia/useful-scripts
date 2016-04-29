fs = require('fs')
fileType = require('file-type')

if (process.argv.length == 3) {
	var file = process.argv[2]
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err)
		}
		if (!fs.existsSync('out')){
			fs.mkdirSync('out')
		}
		var result = data.split('\n')
		var strs = []
		for (var i = 1; i < result.length - 1; i++) {
			strs.push(result[i].replace(/ /g, ''))
		}
		for (var i = 0; i < strs.length; i++) {
			var b = new Buffer(strs[i].length/2)
			for(var j = 0; j < strs[i].length-1; j+=2) {
				b[j/2] = (parseInt(strs[i].substr(j, 2), 16))
			}
			var wstream = fs.createWriteStream('out/file' + i + '.' + fileType(b).ext)
			wstream.write(b)
			wstream.end()
		}	
	})
}
else {
	console.log('Usage: node index.js filename')
}
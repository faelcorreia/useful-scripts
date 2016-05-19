fs = require('fs')

if (process.argv.length == 3) {
	var file = process.argv[2]
	fs.open(file, 'r', function(err, fd) {
		if (err) throw err
		var chunkSize = 1024
		var buffer = new Buffer(chunkSize)
		var map = []
		for (var i = 0; i < 256; i++) {
			map[i] = 0
		}
		function readNextChunk() {
			fs.read(fd, buffer, 0, chunkSize, null, function(err, nread) {
				if (err) throw err

				if (nread === 0) {
					fs.close(fd, function(err) {
						if (err) throw err
					})
					printMap()
					return
				}
				var data
				if (nread < chunkSize)
					data = buffer.slice(0, nread)
				else
					data = buffer
				for (var i = 0; i < 1024; i++) {
					map[data[i]]++
				}
				readNextChunk()
			})
		}
		function printMap() {
				console.log('CharCode;Quantity')
				for (var i = 0; i < 256; i++) {					
					console.log(i + ';' + map[i])
				}
		}
		readNextChunk()		
	})
}
else {
	console.log('Usage: node index.js filename')
}
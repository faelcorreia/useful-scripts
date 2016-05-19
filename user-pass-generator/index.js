fs = require('fs')

var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%&*-_'

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

if (process.argv.length == 3) {
	var file = process.argv[2]
	fs.readFile(file, 'utf8', function (err,data) {
		if (err) {
			return console.log(err)
		}
		if (!fs.existsSync('out')){
			fs.mkdirSync('out')
		}
	  var users = fs.createWriteStream('out/users.lst')
	  var passwords = fs.createWriteStream('out/passwords.lst')
		var words = data.split('\n')
	  shuffle(words)
		for (var i = 0; i < words.length; i++) {
		var user = words[i] + randomInt(10000, 99999).toString()
		var password = ''
		var passSize = randomInt(8, 15)
		for (var j = 0; j < passSize; j++) {
		  password += charset[randomInt(0, charset.length)]
		}
		console.log(user + ':' + password)
		users.write(user + '\n')
		passwords.write(password + '\n')
	  }
	  users.end()
	  passwords.end()
	})
}
else {
	console.log('Usage: node index.js filename')
}

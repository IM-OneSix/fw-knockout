var http = require('http');
var path = require('path');
var url = require('url');
var fs = require('fs');

var portno = 8888;
var webroot = '/fw-knockout/';

http.createServer(function(request, response) {
	var pathname = decodeURI(url.parse(request.url).pathname);

    pathname = pathname.replace(webroot,'/');

	if(!pathname||pathname=='/'){
		pathname = '/index.html'
	}

	console.log(pathname);

	var fullpath = path.join(process.cwd(), pathname);
	var ext = pathname.split('.');
	ext = ext[ext.length - 1] || 'plain';

	try {
		if (fs.statSync(fullpath).isFile()) {
			fs.readFile(fullpath, 'binary', function(err, file) {
				if (err) {
					console.log(err);

					response.writeHeader(500, {
						'Content-Type': 'text/plain',
						'X-UA-Compatible': 'IE=edge, chrome=1'
					});
					response.write('500 Server Error\n');
					response.end();
					return;
				}

				response.writeHeader(200, {
					'Content-Type': 'text/' + ext,
					'X-UA-Compatible': 'IE=edge, chrome=1'
				});
				response.write(file, 'binary');
				response.end();
			});
			return;
		}
	} catch (e) {
		//console.log(e.stack);
	}

	response.writeHeader(404, {
		'Content-Type': 'text/plain',
		'X-UA-Compatible': 'IE=edge, chrome=1'
	});
	response.write('404 Not Found\n');
	response.end();

}).listen(portno);

console.log('Server running port:'+portno);
const http = require('http');
const https = require('https');
const zlib = require('zlib');
const url = require('url');

class api {
	/**
	 * @param {string} token - PaperBark project token
	 */
	constructor(token) {
		this._server = 'https://api.paperbark.io/';
		this._token = token;
	}

	/**
	 * Read a stream until the end event and return the buffer
	 * @param {stream} stream
	 * @return {Promise.<Buffer>}
	 */
	readStream(stream) {
		return new Promise((resolve, reject) => {
			let buffers = [];
			stream.on('data', buffer => buffers.push(buffer));
			stream.on('end', () => resolve(Buffer.concat(buffers)));
			stream.on('error', err => reject(err));
		});
	}

	/**
	 * Request an api endpoint
	 * @param {object} options - Request options
	 * @param {string} [options.method=GET] - Request method
	 * @param {string} [options.path=/] - Request path
	 * @param {string} [options.contentType] - Content-Type for body
	 * @param {string|Buffer} [options.body] - Request body
	 * @return {Promise.<Buffer>}
	 */
	request(options) {
		return new Promise((resolve, reject) => {
			let headers = {};
			headers['Accept-Encoding'] = 'gzip, deflate';
			headers['User-Agent'] = 'PaperBark/SDK (Node)';
			headers['Authorization'] = 'Bearer ' + this._token;

			if (options.body && options.contentType)
				headers['Content-Type'] = options.contentType;

			let server = url.parse(this._server);
			let protocolClass = server.protocol === 'http:' ? http : https;
			let request = protocolClass.request({
				hostname: server.hostname,
				port: server.port,
				method: options.method || 'GET',
				path: options.path || '/',
				headers: headers
			});

			request.on('response', response => {
				let decoder = null;

				switch ((response.headers['content-encoding'] || '').toLowerCase()) {
					case 'gzip':
						decoder = zlib.createGunzip();
						break;
					case 'deflate':
						decoder = zlib.createInflate();
						break;
				}

				let stream = response;
				if (decoder !== null)
					stream = response.pipe(decoder);

				if (response.statusCode === 200)
					return resolve(stream);

				this.readStream(stream).then(content => {
					try {
						return JSON.parse(content.toString());
					} catch (err) {
						return null;
					}
				}).then(content => {
					if (content && content.message)
						reject('PaperBark error: ' + content.message);
					else
						reject('An unknown error occurred');
				});
			});

			request.on('error', err => reject(err));

			if (options.body)
				request.write(options.body);

			request.end();
		});
	}
}

module.exports = api;
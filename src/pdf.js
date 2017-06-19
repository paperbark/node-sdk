const fs = require('fs');

class pdf {
	/**
	 * @param {paperbark} paperbark
	 */
	constructor(paperbark) {
		this._paperbark = paperbark;
		this._json = {
			properties: {},
			pages: []
		};
	}

	/**
	 * Reads all custom properties set on this instance and places them in the json.properties object
	 * @private
	 */
	_getProperties() {
		let keys = Object.keys(this);

		for (let key of keys) {
			if (key.substr(0, 1) !== '_')
				this._json.properties[key] = this[key];
		}
	}

	/**
	 * Add given HTML source to PDF, can be called multiple times
	 * @param {string|Buffer} content
	 * @param {object} [properties={}]
	 */
	html(content, properties = {}) {
		this._json.pages.push({
			type: 'html',
			content: content.toString(),
			properties: properties
		})
	}

	/**
	 * Create & stream the PDF
	 * @return {Promise.<stream>}
	 */
	stream() {
		this._getProperties();

		return this._paperbark.api.request({
			method: 'POST',
			path: '/pdf',
			contentType: 'application/json',
			body: JSON.stringify(this._json)
		});
	}

	/**
	 * Download the PDF
	 * @return {Promise.<Buffer>}
	 */
	download() {
		return this.stream().then(stream => this._paperbark.api.readStream(stream));
	}

	/**
	 * Save the PDF
	 * @param {string} path - Path to save file to
	 * @return {Promise.<stream>}
	 */
	save(path) {
		let writeStream = fs.createWriteStream(path);
		return this.stream().then(stream => stream.pipe(writeStream));
	}
}

module.exports = pdf;
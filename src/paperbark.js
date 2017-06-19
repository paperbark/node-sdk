const api = require('./api');
const pdf = require('./pdf');

class paperbark {
	/**
	 * @param {string} token - PaperBark project token
	 */
	constructor(token) {
		this._api = new api(token);
	}

	/**
	 * Returns the api instance, it is not recommended to use this directly.
	 * @return {api}
	 */
	get api() {
		return this._api;
	}

	/**
	 * Create a new PDF
	 * @return {pdf}
	 */
	pdf() {
		return new pdf(this);
	}
}

/**
 * @param {string} token - PaperBark project token
 * @return {paperbark}
 */
module.exports = token => new paperbark(token);

module.exports.paperbark = paperbark;
module.exports.pdf = pdf;
module.exports.api = api;
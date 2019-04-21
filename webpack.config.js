const path = require('path');

module.exports = {
    entry: './index.js',
    output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'swisspass-scan.bundle.js'
    },
    mode: 'production'
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js',
    plugins: [
	new HtmlWebpackPlugin({
	    title: 'Swisspass Scan'
	})
    ],
    output: {
	path: path.resolve(__dirname, 'dist'),
	filename: 'swisspass-scan.bundle.js'
    },
    mode: 'production'
};

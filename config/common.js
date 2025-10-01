const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const __root = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		index: ['@babel/polyfill', './src/scripts/index.js'],
		'upload-page': ['@babel/polyfill', './src/scripts/upload-page.js'],
		'dashboard-page': ['@babel/polyfill', './src/scripts/dashboard-page.js'],
		'embed-page': ['@babel/polyfill', './src/scripts/embed-page.js'],
	},
	output: {
		path: path.resolve(__root, 'dist'),
		filename: 'scripts/[name].[chunkhash].js',
		chunkFilename: 'scripts/[name].[chunkhash].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-syntax-dynamic-import']
					}
				},
				exclude: /node_modules/
			},
			{
				test: /\.(glsl|frag|vert)$/,
				use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
			},
			{
				test: /three\/examples\/js/,
				use: 'imports-loader?THREE=three'
			},
			/*
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: 'file-loader'
			},
			{
				test: /\.(jpe?g|png|gif)$/i,
				use: 'file-loader'
			}
			*/
		]
	},
	resolve: {
		alias: {
			'three-examples': path.join(__root, './node_modules/three/examples/js'),
		}
	},
	plugins: [
		new CleanWebpackPlugin(
			['dist'],
			{ root: __root },
		),
		new CopyWebpackPlugin([
			{
				from: path.resolve(__root, 'static'),
			}
		]),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
			chunks: ['index']
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/upload.html',
			filename: 'upload.html',
			chunks: ['upload-page']
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/dashboard.html',
			filename: 'dashboard.html',
			chunks: ['dashboard-page']
		}),
		new HtmlWebpackPlugin({
			template: './src/pages/embed.html',
			filename: 'embed.html',
			chunks: ['embed-page']
		}),
		new webpack.ProvidePlugin({
			'THREE': 'three'
		})
	]
};

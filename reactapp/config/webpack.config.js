const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
	const dotEnvPath = `./reactapp/config/${argv.mode}.env`;
	console.log(`Building in ${argv.mode} mode...`);
	console.log(`=> Using .env config at "${dotEnvPath}"`);
	return {
		entry: ['./reactapp'],
		output: {
			path: path.resolve(__dirname, '../../tethysapp/owp/public/frontend'),
			filename: '[name].js',
			publicPath: '/static/owp/frontend/',
		},
		resolve: {
			modules: [
				path.resolve(__dirname, '../'), 
				path.resolve(__dirname, '../../node_modules')
			]
		},
		plugins: [
			new Dotenv({
				path: dotEnvPath
			}),
		],
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
						},
					],
				},
				{
					test: /\.css$/,
					// exclude: /node_modules/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
						},
					],
				},
				{
					test: /\.(scss|sass)$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'style-loader',
						},
						{
							loader: 'css-loader',
						},
						{
							loader: 'sass-loader',
						},
					],
				},
				{
					test: /\.(jpe?g|png|gif|svg|mp4|mp3)$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								outputPath: '',
							},
						},
					],
				},
			],
		},
		optimization: {
			minimize: true,
		},
		devServer: {
			proxy: {
				'!/static/owp/frontend/**': {
					target: 'http://localhost:8000', // points to django dev server
					changeOrigin: true,
				},
			},
			open: true,
		},
	}
};
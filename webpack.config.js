const path = require('path');
const argv = require('yargs').argv;
const fs = require('fs');
const webpack = require('webpack');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const config = {
	options: {
		production: Boolean(process.env.NODE_ENV === 'production' || argv['production']),
		minifyHtml: Boolean(argv['minify-html']),
		deploy: Boolean(argv['deploy']),
		verbose: Boolean(argv['verbose']),
	},
	paths: {
		cache: './cache',
		publicPath: process.env.PUBLIC_PATH || '/',
		src: {
			root: './src',
			templates: './src/templates',
			templatesPages: './src/templates/pages',
			js: './src/js',
			styles: './src/styles',
			fonts: './src/fonts',
			webFont: './src/fonts/webfont',
			webfontIcons: './src/webfont-icons',
			images: './src/images',
			favicon: './src/images/favicon.jpg',
		},
		dist: {
			root: './dist',
			html: './dist',
			js: './dist/js',
			styles: './dist/css',
			fonts: './dist/fonts',
			images: './dist/images',
		}
	}
};

const pugPages = fs.readdirSync(config.paths.src.templatesPages).filter(file => {
	return !fs.lstatSync(`${config.paths.src.templatesPages}/${file}`).isDirectory()
		&& path.extname(file) === '.pug';
});

module.exports = {
	mode: config.options.production ? 'production' : 'development',
	devtool: (config.options.production) ? false : 'inline-source-map',
	entry: {
		vendor: path.resolve(__dirname, 'src/js/vendor.js'),
		app: path.resolve(__dirname, 'src/js/app.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: (config.options.production) ? 'js/[name].bundle.min.js' : 'js/[name].bundle.js',
		pathinfo: !config.options.production,
		publicPath: config.paths.publicPath,
	},
	optimization: {
		minimizer: [
			...(config.options.production
				? [
					new UglifyJsPlugin({
						cache: true,
						parallel: true,
						sourceMap: false,
						uglifyOptions: {
							output: {
								comments: false,
							},
						},
					}),
					new OptimizeCSSAssetsPlugin({})
				]
				: [])
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: config.options.cache,
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				type: 'javascript/auto',
				test: /\.modernizrrc$/,
				use: ['modernizr-loader', 'json-loader']
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules)/,
				use: [
					(config.options.production) ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: !config.options.production,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: !config.options.production,
							config: {
								path: './postcss.config.js',
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: !config.options.production,
							outputStyle: 'expanded',
						},
					}
				]
			},
			{
				test: /\.pug$/,
				use: [
					{
						loader: 'pug-loader'
					}
				]
			},
			{
				test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
				loader: 'file-loader',
				options: {
					outputPath: 'fonts',
				},
			},
			{
				test: /\.(webp|png|jpe?g|gif|ico)$/i,
				loader: 'file-loader',
				options: {
					outputPath: 'images'
				},
			},
		],
	},
	plugins: [
		...(config.options.production
				? []
				: [new webpack.HotModuleReplacementPlugin()]
		),
		...(config.options.production
				? [new CompressionPlugin({
					algorithm: 'gzip',
					test: /\.js$|\.css$|\.html$/,
					threshold: 10240,
					minRatio: 0.8
				})]
				: []
		),
		new webpack.ProvidePlugin({}),
		// Хак, необходимый для корректной работы конструкции catch в промисах
		new webpack.DefinePlugin({
			'\.catch': '["catch"]',
			production: config.options.production
		}),
		new MiniCssExtractPlugin({
			filename: (config.options.production) ? 'css/[name].bundle.min.css' : 'css/[name].bundle.css',
		}),
		...pugPages.map((page) => {
			return new HtmlWebpackPlugin({
				filename: `${path.parse(page).name}.html`,
				template: `${config.paths.src.templatesPages}/${page}`,
				templateParameters: {
					production: config.options.production
				},
				inject: true,
				minify: {
					html5: true,
					collapseWhitespace: true,
					minifyCSS: true,
					minifyJS: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributese: true,
					useShortDoctype: true
				}
			})
		}),
		new FaviconsWebpackPlugin({
			logo: config.paths.src.favicon,
			cache: true,
			outputPath: './images/favicon',
			prefix: 'images/favicon',
			inject: true,
			favicons: {
				icons: {
					android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					coast: true,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
					yandex: true                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }`
				}
			}
		}),

	],
	resolve: {
		alias: {
			modernizr$: path.resolve(__dirname, '.modernizrrc'),
		}
	},
	devServer: {
		contentBase: [
			...pugPages.map((page) => `${config.paths.src.templatesPages}/${page}`)
		],
		watchContentBase: true,
		port: 9000,
		hot: true,
		open: true
	}
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true // cleans old build files
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/, // CSS files
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },
    ],
    exprContextCritical: false,
  },
  ignoreWarnings: [
    {
      module: /react-datepicker/,
    },
  ],
  resolve: {
    extensions: ['.js', '.jsx'] // allow import without extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
     new webpack.DefinePlugin({
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
  })
  ],
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    liveReload: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    devMiddleware: {
      publicPath: '/',
    },
  },
  mode: 'development'
};

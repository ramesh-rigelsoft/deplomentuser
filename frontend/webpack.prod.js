const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const dotenv = require("dotenv");
const env = dotenv.config({ path: "./.env.prod" });


module.exports = {
  entry: './src/index.js',
  output: {
    filename: "bundle.[contenthash].js", // cache-busting
    path: path.resolve(__dirname, "build"),
    clean: true, // remove old files
    publicPath: "/", // for react-router-dom
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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'] // allow import without extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
      },
    }),
     new webpack.DefinePlugin({
      "process.env.REACT_APP_API_URL": JSON.stringify(env.parsed.REACT_APP_API_URL),
  })
  ],

   optimization: {
    minimize: true, // enables minification
    splitChunks: {
      chunks: "all",
    },
  },
  
  mode: 'production'
};

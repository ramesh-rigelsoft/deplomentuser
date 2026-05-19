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
    static: './dist',  // npx webpack serve //---karne pr auto buld create hojaiga

    liveReload: true, // Live reload enable 
    port: 3000, // आपका नया port
    open: true, // Browser auto open 
    hot: true, // Hot Module Replacement
    watchFiles: ['src/**/*'], // Watch all source files
    historyApiFallback: true,
    static: {
    directory: path.resolve(__dirname, 'public'),
    serveIndex: false, // 🚫 prevents decode errors
    watch: true
  }
  },
  mode: 'development'
};

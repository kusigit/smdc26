const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const path = require('path');
const dist = path.resolve(__dirname, 'build');

module.exports = (env, argv) => ({
  entry: './index.ts',
  mode: 'development',
  watch: argv.mode === 'production' ? false : true,
  devtool: argv.mode === 'production' ? undefined : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          configFile: 'tsconfig.json',
        },
      },
    ],
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: dist,
  },
  devServer: {
//    contentBase: dist,
    compress: false,
    port: 8000,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
});


const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/client/scripts/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, "src/client")
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', ".js"],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/client'),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {from: path.resolve(__dirname, "src/client/public"), to: path.resolve(__dirname, "dist/client/public")},
        {from: path.resolve(__dirname, "package.json"), to: path.resolve(__dirname, "dist")}
      ]
    })
  ]
};
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: "./src/client/scripts/index.tsx",
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: "ts-loader",
            include: path.resolve(__dirname, "src/client")
        }, ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist/client/scripts"),
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin()
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [{
                from: path.resolve(__dirname, "src/client/css"),
                to: path.resolve(__dirname, "dist/client/css")
            },
            {
                from: path.resolve(__dirname, "src/client/html"),
                to: path.resolve(__dirname, "dist/client/html")
            },
            {
                from: path.resolve(__dirname, "package.json"),
                to: path.resolve(__dirname, "dist")
            },
            {
                from: path.resolve(__dirname, "config.json"),
                to: path.resolve(__dirname, "dist")
            },
            {
                from: path.resolve(__dirname, "src/client/media"),
                to: path.resolve(__dirname, "dist/client/media")
            }
            ]
        })
    ]
};
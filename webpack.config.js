const webpack = require('webpack');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/index.js",
        library: ['Dryad']
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.ts?$/, use: "ts-loader", enforce: "pre" },
            { test: /\.json$/, use: "json-loader", enforce: "pre" }
        ]
    }
};
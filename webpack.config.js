const path = require('path');

module.exports = {
    entry: "./frontend/src/index.js",
    output: {
        path: path.resolve('public'),
        filename: 'bundle.js'
    },
    mode: 'development',
    module: {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader'
        }
    }
}
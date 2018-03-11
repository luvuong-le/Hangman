const path = require('path');

module.exports =  {
    mode: 'development',
    entry: {
        app: [
            './src/js/app.js',
            './src/js/loader.js'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/',
        filename: 'bundle.js'
    },
    devServer: {
        historyApiFallback: {
            index: "index.html"
        }
    },
};
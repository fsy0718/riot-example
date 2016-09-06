module.exports = {
    // 页面入口文件配置
    entry: './src/index.js',

    // 入口文件输出配置
    output: {
        path: __dirname,
        filename: 'bundle.js' // filename和html里面的文件要对应
    },
    module: {
        // 加载器配置
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.tag$/,
            loader: 'tag',
            exclude: /node_modules/
        }]
    }
};
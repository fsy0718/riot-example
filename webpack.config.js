const path = require('path');
const webpack = require('webpack');


//提取指定文件中公共模块
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
//生成样式
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    // 页面入口文件配置
    entry: {
        common: ['riot', 'redux', 'underscore','webpack-zepto']
    },
    // 入口文件输出配置
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js?[hash]', // filename和html里面的文件要对应
        sourceMapFilename: '[file].map'
    },
    devtool: '#source-map',
    module: {
        // 加载器配置
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader','css-loader','sass-loader')
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader','css-loader')
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            }, {
                test: /\.tag\.html$/,
                loader: 'tag',
                exclude: /node_modules/
            }]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: ['index', 'common']
        }),
        new webpack.ProvidePlugin({
            $: 'zepto',
            Zepto: 'zepto',
            'window.Zepto': 'zepto'
        }),
        new ExtractTextPlugin('[name].css')
    ],
    resolve: {
        alias: {
            "zepto": path.join(__dirname, 'node_modules/webpack-zepto/index.js')
        }
    }
};
"use strict";
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfig = require('./webpack.config');

function getEntries(globPath){
  let files = glob.sync(globPath),entries = {};
  files.forEach(function(filepath){
    let split = filepath.split('/');
    let name = split[2];
    entries[name] = './' + filepath + '/' + name + '.js'
  })
  return entries;
}

const entries = getEntries('src/components/*');
const indexHtmlItems = [];
Object.keys(entries).forEach(function(name){
  indexHtmlItems.push('<li><a href="/' + name + '.html">' + name + '</a></li>')
  webpackConfig.entry[name] = entries[name];
  let plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: './template.html',
    inject: 'body',
    chunks: [name],
    title: name
  });
  webpackConfig.plugins.push(plugin);
})

//生成首页
const plugin = new HtmlWebpackPlugin({
  filename: 'index.html',
  title: 'riot-example',
  chunks: [''],
  templateContent: function(){
    return '<ul>' + indexHtmlItems.join('') + '</ul>'
  }
});
webpackConfig.plugins.push(plugin);


const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
  hot: true
})

server.listen(8000, 'localhost', function(err){
  err && console.log(err);
})
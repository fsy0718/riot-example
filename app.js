"use strict";
const path = require('path');
const fs = require('fs');
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
  var _path = path.join(__dirname, 'src/components/', name);
  var demotpl = path.join(_path, name + '.demo.html');
  try{
    if(!fs.accessSync(demotpl, fs.R_OK)){
      //这是更改默认模板的地方
    }
  }catch(e){
    demotpl = './template.html'
  }
  let plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: demotpl,
    inject: 'body',
    chunks: [name],
    title: name
  });
  webpackConfig.plugins.push(plugin);

  /*var readme = path.join(_path, 'readme.md');
  try{
    console.log(readme)
    if(fs.accessSync(readme, fs.R_OK)){
      console.log(12);
    }else{
      fs.readFile(readme, function(err, data){
        let pluginReadme = new HtmlWebpackPlugin({
          filename: name + '-readme.html',
          title: name + 'Readme',
          chunks: [''],
          templateContent: function(templateParams, compilation){
            console.log(arguments,111111111111111111111111111111);
            return '...'
          }
        })
        ywebpackConfig.plugins.push(pluginReadme);
      })

    }
  }catch(e){
  }*/
  
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
  hot: true,
  setup: function(app){
    app.get('/Basic/GetOverSeaCity', function(req, res){
      fs.readFile(path.join(__dirname,'./src/mock/citylistoversea.json'),'utf8', function(err, data){
        res.json(data);
      })
      //res.json({custom: 'response'});
    })
  }
})

server.listen(8000, 'localhost', function(err){
  err && console.log(err);
})
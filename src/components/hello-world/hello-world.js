var riot = require('riot');
var redux = require('redux');
var _ = require('underscore');
//引入模板
require('./hello-world.tag.html');

var reducer = function(state = {
  title: '欢迎进入riot-redux的世界'
}, action){
  switch(action.type){
    case 'CHANGE_TITLE':
      return Object.assign({}, state, {
        title: action.data
      });
  }
  return state;
}

var store = redux.createStore(reducer);

riot.mount(document.querySelector('.app'),'hello-world',{
  store
})
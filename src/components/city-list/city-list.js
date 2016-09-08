var riot = require('riot');
var $ = require('webpack-zepto');
var _ = require('underscore');
var redux = require('redux');
var cityDatas = require('json!../../mock/citylist.json');
require('./city-list.tag.html');
require('./city-list-group.tag.html');

var  _cityGroups = _.groupBy(cityDatas.CityList,'Group');

var _g = 65, char = '', cityGroupIndexs = [],cityGroups = [];
while(_g <= 90){
  char = String.fromCharCode(_g);
  if(_cityGroups[char]){
    cityGroupIndexs.push(char);
    cityGroups.push({index: char, citys:_cityGroups[char]});
  }
  _g++;
}

var changeActiveGroupReducer = function(state = cityGroupIndexs[0], action){
  switch(action.type){
    case 'CHANGE_ACTIVE_GROUP':
      return action.activeGroup;
    default: 
      return state;
  }
}

var cityGroupIndexsReducer = function(state = cityGroupIndexs, action){
  return state;
}
var cityGroupReducer = function(state = cityGroups, action){
  return state;
}



var reducer = redux.combineReducers({activeGroupIndex: changeActiveGroupReducer, cityGroupIndexs: cityGroupIndexsReducer, cityGroups: cityGroupReducer});


//创建一个加载city-list-group的容器元素
var citylistGroupEl = $('<div class="city-list-group"></div>');
$('body').append(citylistGroupEl);
var store = redux.createStore(reducer);



riot.mount(document.querySelector('.app'),'city-list', {
  store,
  autoScrollGroupIndex: true
});

riot.mount(citylistGroupEl[0], 'city-list-group', {
  store
})

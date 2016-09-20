require('../city-list/city-list-group.css');
require('../city-list/city-list.css');
require('./switch.css');
var _ = require('underscore');
var CityListPure = require('../city-list-pure-js/city-list-pure')


var _vars = ndoo.vars;

var cityListPure1 = new CityListPure();
var cityListPure2 = null;
var $group1 = $('.city-list-group ul').eq(0);
var $group2 = $('.city-list-group ul').eq(1);
var $list1 = $('.city-list dl').eq(0);
var $list2 = $('.city-list dl').eq(1);

var $tabHeader = $('.tab__header');

$tabHeader.on('click', 'a', function () {
  var $self = $(this);
  if ($self.hasClass('active')) {
    return;
  }
  $self.addClass('active').siblings('.active').removeClass('active');
  var index = $self.index('a');
  if (index === -1) {
    cityListPure1.changePauseStatus(false);
    $list1.hide();
    $group1.hide();
    if (!cityListPure2) {
      $.ajax({
        type: 'GET',
        url: '/Basic/GetOverSeaCity',
        beforeSend: function (xhr, settings) {
          $('.loading').show();
        },
        success: function (data, status, xhr) {
          //此处转换线上不需要
          data = JSON.parse(data);
          $('.loading').hide();
          cityListPure2 = new CityListPure({
            groupContainer: $group2,
            listContainer: $list2,
            CityList: data.CityList
          });
          //更新缓存值
          $group2 = $('.city-list-group ul').eq(1);
          $list2 = $('.city-list dl').eq(1);
          window.cityListPure2 = cityListPure2
        }
      });
    } else {
      $list2.show();
      $group2.show();
      cityListPure2.changePauseStatus(true);
    }
  } else {
    cityListPure2.changePauseStatus(false);
    $list1.show();
    $group1.show();
    $list2.hide();
    $group2.hide();
    cityListPure1.changePauseStatus(true);
  }

})

window.cityListPure1 = cityListPure1;
console.log(CityListPure.__instances__)

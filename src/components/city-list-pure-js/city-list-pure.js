var _ = require('underscore');

var _vars = ndoo.vars;

var CityListPure = function (options) {
  this.options = options || {};
  //缓存常用变量
  this.$group = $(this.options.groupContainer || '.city-list-group');
  this.$list = $(this.options.listContainer || '.city-list');
  this.$fixedIndex = this.options.fixedIndexContainer && $(this.options.fixedIndexContainer) || this.$list.find('.city-list__current-index');
  this.$scrollContainer = $(this.options.container || window);
  this.initState();
  this.paused = this.options.paused || false;
  if (!this.$group.length) {
    var dom = this.createGroupDOMFromData();
    this.$group = $(dom).appendTo('.city-list-group');
    this.$group.find('[data-city-group="' + this.state.activeGroup.index + '"]').addClass('active');
  }
  if (!this.$list.length) {
    var dom = this.createListDOMFromData();
    this.$list = $(dom).appendTo('.city-list');
    this.$fixedIndex = this.$list.find('.city-list__current-index');
  }
  this.setFixedGroupIndexWidth();
  this.calcGroupListMap();

  CityListPure.__instances__ ? null : CityListPure.__instances__ = {};
  this.__id__ = this.getInstanceId();
  CityListPure.__instances__[this.__id__] = { paused: this.paused };
  this.initEvent();
}
CityListPure.prototype = {
  //初始化城市数据
  initCityGroupData: function () {
    var cityGroup = this.options.CityList || [];
    var cityGroupData;
    if (cityGroup.length === 0 && this.$group.find('li').length > 0) {
      cityGroupData = this.getCityGroupDataFromDom();
    } else {
      cityGroupData = this.parseCityGroupDataFromData(cityGroup);
    }
    return cityGroupData;
  },
  //从DOM结构中获取数据
  getCityGroupDataFromDom: function () {
    var $cityGroupIndexDoms = this.$list.find('dt.city-list__index');
    var cityGroup = [];
    var cityGroupIndexs = [];
    $cityGroupIndexDoms.each(function () {
      var $self = $(this);
      var citys = [];
      var $cityGroupDoms = $self.next('.city-list__citys-box').find('.city-list__citys-item');
      $cityGroupDoms.each(function () {
        var _id;
        if (_id = $(this).data('cityId')) {
          citys.push({ CityID: _id });
        }
      })
      if (citys.length) {
        var index = $self.data('cityGroup')
        cityGroup.push({
          index: index,
          citys: citys
        });
        cityGroupIndexs.push(index);
      }
    });
    return {
      cityGroups: cityGroup,
      cityGroupIndexs: cityGroupIndexs
    }
  },
  getInstanceId: function () {
    return Date.now() + (Math.random() * 1000).toFixed(0);
  },
  //从接口返回的数据格式中转换数据
  parseCityGroupDataFromData: function (data) {
    var _cityGroups = _.groupBy(data, 'Group');
    var _g = 65, char = '', cityGroupIndexs = [], cityGroups = [];
    while (_g <= 90) {
      char = String.fromCharCode(_g);
      if (_cityGroups[char]) {
        cityGroupIndexs.push(char);
        cityGroups.push({ index: char, citys: _cityGroups[char] });
      }
      _g++;
    }
    return {
      cityGroups: cityGroups,
      cityGroupIndexs: cityGroupIndexs
    }
  },
  //初始化状态
  initState: function () {
    var cityGroupData = this.initCityGroupData(this.options);
    this.state = {
      activeGroup: {
        index: this.options.activeGroupIndex || cityGroupData.cityGroupIndexs[0]
      },
      cityGroupIndexs: cityGroupData.cityGroupIndexs,
      cityGroups: cityGroupData.cityGroups
    }
  },
  //初始化DOM数据
  initDOMData: function () {
    this.__domData = {
      listClientRect: this.$list[0].getBoundingClientRect(),
      pageScrollTop: Math.max(document.body.scrollTop, document.documentElement.scrollTop) || 0,
      groupIndexHeight: this.$list.find('dt').height(),
      groupItemHeight: this.$list.find('dd li').height(),
    }
  },
  setFixedGroupIndexWidth: function () {
    var groupIndexWidth = this.$list.find('dt').width();
    this.$fixedIndex.css('width', groupIndexWidth);
    this.options.setFixedGroupIndexView && this.options.setFixedGroupIndexView(this.$fixedIndex);
  },
  //计算各个分组间距对应关系
  calcGroupListMap: function () {
    this.initDOMData();
    //计算grouplist本身距离顶部的偏移值
    var t = (parseFloat(this.$list.find('dl').css('padding-top')) || 0) + this.__domData.listClientRect.top;
    var cityGroups = this.state.cityGroups;
    var self = this;
    var _calcGroupListMap = function (initTop) {
      var h = initTop || 0;
      var groupListMap = [];
      cityGroups.forEach(function (cityGroup) {
        var d = {};
        var _h = self.__domData.groupIndexHeight + cityGroup.citys.length * self.__domData.groupItemHeight;
        d.index = cityGroup.index;
        d.value = h;
        d.height = _h;
        h += _h;
        groupListMap.push(d);
      })
      return groupListMap;
    }
    this.state.groupListMap = _calcGroupListMap(t);
  },
  changeFixedActiveGroupIndex: function () {
    this.$fixedIndex.text(this.state.activeGroup.index);
  },
  changeCityGroupIndex: function () {
    var $groupItems = this.$group.find('a');
    $groupItems.filter('.active').removeClass('active')
    $groupItems.filter('[data-city-group="' + this.state.activeGroup.index + '"]').addClass('active');
  },
  toggleFixedActiveGroupIndex: function (value, groupItemMap) {
    if (value - this.__domData.groupIndexHeight > groupItemMap.value) {
      this.$fixedIndex.show();
    } else {
      this.$fixedIndex.hide();
    }
  },
  //获取当前指定值的索引值区间
  getCurrentGroupIndex: function (value) {
    var groupListMap = this.state.groupListMap;
    var i = 0, len = groupListMap.length;
    while (i < len) {
      if (groupListMap[i].value > value) {
        var _i = i === 0 ? 0 : i - 1;
        this.toggleFixedActiveGroupIndex(value, groupListMap[_i]);
        return groupListMap[_i].index;
      }
      i++;
    }
    return null;
  },
  //根据top获取索引值
  getGrouIndexPosHeight: function (groupIndex) {
    var groupListMap = this.state.groupListMap;
    var i = 0, len = groupListMap.length;
    while (i < len) {
      if (groupListMap[i].index === groupIndex) {
        return groupListMap[i].value;
      }
      i++
    }
    return 0;
  },
  setActiveGroup: function (index, trigger) {
    if (index !== this.state.activeGroup.index) {
      this.state.activeGroup = {
        index: index,
        trigger: trigger
      };
      this.changeFixedActiveGroupIndex();
      //更改相关状态
      this.changeCityGroupIndex();
      if (trigger === 1) {
        var _top = this.getGrouIndexPosHeight(index);
        this.$scrollContainer.scrollTop(_top + this.__domData.pageScrollTop);
      }
    }
    console.log(3, this.state.activeGroup);
  },
  queryCityByGroup: function (index, cityId) {
    var result = _.find(this.state.cityGroups, { index: index });
    if (cityId && result) {
      result = _.find(result.citys, { CityID: cityId });
    }
    return result;
  },
  initEvent: function () {
    this._initScrollEvent();
    this._initListClickEvent();
    this._initGroupClickEvent();
  },
  changePauseStatus: function (isPause) {
    this.paused = Boolean(isPause);
    CityListPure.__instances__[this.__id__].paused = this.paused;
    if (this.paused) {
      this.$scrollContainer.off('scroll', CityListPure.__instances__[this.__id__].fn);
    } else {
      this.$scrollContainer.on('scroll', CityListPure.__instances__[this.__id__].fn);
    }

  },
  _scrollHandler: function (e) {
    var scrollThrottleTimer = null;
    console.log(2, this.state.activeGroup);
    var self = this;
    if (self.paused) {
      return;
    }
    if (self.state.activeGroup.trigger === 1) {
      this.state.activeGroup = {
        index: this.state.activeGroup.index,
        trigger: 0
      }
      return;
    }
    clearTimeout(scrollThrottleTimer);
    scrollThrottleTimer = setTimeout(function () {
      var _listClientRect = self.$list[0].getBoundingClientRect();
      var _top = self.__domData.listClientRect.top - _listClientRect.top;
      var groupIndex = self.getCurrentGroupIndex(_top);
      if (groupIndex !== self.state.activeGroup.index) {
        self.setActiveGroup(groupIndex, 0);
      }
      clearTimeout(scrollThrottleTimer);
    }, 30);
  },
  _initScrollEvent: function () {
    var self = this;
    CityListPure.__instances__[self.__id__].fn = _.bind(self._scrollHandler, self)
    this.$scrollContainer.on('scroll', CityListPure.__instances__[self.__id__].fn);
  },
  _initListClickEvent: function () {
    var self = this;
    var handleGroupItemClick = function (e) {
      var $self = $(this);
      var activeGroup = $self.data('cityGroup') || $self.parent().parent().prev('.city-list__index').data('cityGroup');
      e.item = {
        city: self.queryCityByGroup(activeGroup, $self.data('cityId')),
        index: $self.index()
      };
      self.options.onItemTouchTap && self.options.onItemTouchTap(e);
      if (activeGroup !== self.state.activeGroup.index) {
        self.setActiveGroup(activeGroup, 1)
      }
      console.log(1, self.state.activeGroup);
    }
    self.$list.on('click', '.city-list__citys-item', handleGroupItemClick);
  },
  _initGroupClickEvent: function () {
    var self = this;
    this.$group.on('click', 'a', function (e) {
      if (!$(this).hasClass('active')) {
        var activeGroup = $(this).data('cityGroup');
        self.setActiveGroup(activeGroup, 1);
      }
    });
  },
  createListDOMFromData: function () {
    var doms = [];
    var self = this;
    _.each(self.state.cityGroups, function (cityGroup, index) {
      var str = '<dt class="city-list__index" data-city-group="' + cityGroup.index + '">' + cityGroup.index + '</dt>';
      if (cityGroup.citys.length) {
        doms.push(str);
        doms.push('<dd class="city-list__citys-box"><ul>')
        _.each(cityGroup.citys, function (city, index) {
          doms.push('<li class="city-list__citys-item" data-city-id="' + city.CityID + '">' + city.CityName + '</li>');
        });
        doms.push('</ul></dd>')
      }
    });
    if (doms.length) {
      doms.unshift('<h3 class="city-list__current-index" style="display:none">' + (self.state.activeGroup.index || '') + '</h3>');
      doms.unshift('<dl>');
      doms.push('</dl>')
    }
    return doms.join('');
  },
  createGroupDOMFromData: function () {
    var doms = [];
    _.each(this.state.cityGroupIndexs, function (cityGroupIndex, index) {
      doms.push('<li><a href="javascript:;" data-city-group="' + cityGroupIndex + '">' + cityGroupIndex + '</a></li>');
    })
    if (doms.length) {
      doms.push('</ul>');
      doms.unshift('<ul>');
    }
    return doms.join('')
  },
  destroy: function () {
    this.$scrollContainer.off('scroll', CityListPure.__instances__[self.__id__].fn);
    delete CityListPure.__instances__[this.__id__]
    if (!_.keys(CityListPure.__instances__).length) {
      this.$scrollContainer.off('scroll', this._scrollHandler);
    }
  }
};

module.exports = CityListPure;
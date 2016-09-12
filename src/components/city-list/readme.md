# 分组展示组件，类似安卓手机通讯录

## 功能

## 用法
 `city-list`组件支持以下属性
 | attribute | type | description
 |--- |---|---
 |`store`|Object| 用`redux`生成的store,提供状态管理
 |`showFixedActiveGroupIndex`|Boolean| 是否显示固定在顶部的当前分组索引
 |`onItemTouchTap(e)`|Function|点击当前分组子项的回调函数
 |`e.index`|Number| 当前子项在当前分组中的顺序，从0开始
 |`e.item`|Object| 当前子项的数据源 
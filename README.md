# element-ui-admin

基于 [element-ui](https://github.com/ElemeFE/element) 的单页面后台管理项目模版

![element-ui-admin-snapshot](http://ww3.sinaimg.cn/large/0060lm7Tgy1fe509itqdjj318e0m3wfc.jpg)

## 技术栈

[功能演示]()

* vue
* vue-resource
* vue-router
* element-ui
* 基于路由配置的导航菜单
* 基于路由配置的面包屑

## 使用方法

项目模版基于 [webpack-driven-web](https://github.com/appbone/webpack-driven-web), 使用方法请参考 [webpack-driven-web](https://github.com/appbone/webpack-driven-web#使用方法)

## 目录说明

```
element-ui-admin/
├── src/
|   |── home/  -- 首页
|   |── event/ -- 活动页
|   |── user/  -- 账户页
|   └── lib/
|       └── app/
|           |── navbar/            -- 顶部导航组件
|           |── router-nav/        -- 基于路由配置的导航菜单组件
|           |── main-content/      -- 主要内容组件
|           |── router-breadcrumb/ -- 基于路由配置的面包屑组件
|           |── notfound/          -- 未找到路由时显示的组件
|           |── app.vue            -- 页面布局组件
|           └── routes.js          -- 路由配置
├── dist/
├── config/
|── package.json
└── webpack.config.js
```

## 参考

* [AdminLTE](https://github.com/almasaeed2010/AdminLTE) 可以参考界面布局
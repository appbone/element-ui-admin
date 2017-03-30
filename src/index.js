// 3rd
// base framework
import Vue from 'vue';
// http
// 由于 axios 依赖浏览器原生支持的 Promise, 所以还是暂时决定用 vue-resource
// https://github.com/mzabriskie/axios
import VueResource from 'vue-resource';
// router
import VueRouter from 'vue-router';
// UI lib
import ElementUI from 'element-ui';

import App from 'lib/app/app.vue';
import routes from 'lib/app/routes.js';

import {
    initHttpInterceptors
} from 'lib/app/app.js';

Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(ElementUI);

initHttpInterceptors();

var router = new VueRouter({
    routes
});

new Vue({
    el: '.app',
    router,
    render: h => h(App)
});
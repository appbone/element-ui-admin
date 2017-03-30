// 项目公共模块
import Vue from 'vue';
import 'lib/app/app.css';

function initHttpInterceptors() {
    // https://github.com/pagekit/vue-resource/blob/develop/docs/http.md#interceptors
    Vue.http.interceptors.push(function(request, next) {
        // modify request
        // request.method = 'POST';
        request.params = {
            _: Date.now()
        };

        // continue to next interceptor
        next(function(response) {
            // modify response
            response.body.headers['X-Http-Interceptor'] = 'vue-resource';
        });
    });
}

export {
    initHttpInterceptors
};
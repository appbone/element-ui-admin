// webpack 的基础配置

var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin.js')

var projectConfig = require('./project-config.js');
var pkg = projectConfig.pkg;
var env = projectConfig.env;
var config = projectConfig.config;

if (env.MODE == 'dev') { // 开发模式下不使用 hash
    config.output.jsFilename = '[name].js';
    config.output.cssFilename = '[name].css';
    config.output.resFilename = '[name].[ext]';

    config.cssLoader.sourceMap = true;
} else {
    // 正式环境一般会发布到 CDN
    config.publicPath = config.cdnPath;
    config.cssLoader.minimize = true;
}

var webpackConfig = {
    entry: {
        // 第三方模块(JS/CSS), 注意: 如果在这里指定了 CSS 模块, 在 CSS 文件中就不要 @import 了
        // 决定了那些模块合并输出为 vendor.js 和 vendor.css
        //
        // 如果不在乎项目公共逻辑和第三方模块合并成一个 CommonsChunk, 那么可以不需要配置第三方模块入口了,
        // 对应 HtmlWebpackPlugin 中的 chunks 也不要加入 vendor, 只需要加入 app 模块即可
        // 此时依赖的第三方样式在 app.js 中 import 进去,
        // 例如 import 'bootstrap/dist/css/bootstrap.css'
        'vendor': config.vendor,
    },
    output: {
        // 放置输出内容的目录(针对本地文件系统的)
        path: config.output.dist,
        // 针对的是浏览器, 在页面(HTML, CSS, JS)中引用文件的根路径, 可以很方便的切换到 CDN
        publicPath: config.publicPath,
        // https://segmentfault.com/a/1190000006863968
        // [name]，指代入口文件的name，也就是上面提到的entry参数的key，因此，我们可以在name里利用 / ，即可达到控制文件目录结构的效果。
        //
        // [hash]，指代本次编译的一个hash版本，值得注意的是，只要是在同一次编译过程中生成的文件，这个[hash]的值就是一样的；在缓存的层面来说，相当于一次全量的替换。
        // 例如:
        // F:\tmp\es2015>webpack
        // Hash: 3cc68e3a00bd8bba8557
        // Version: webpack 1.14.0
        //
        // [chunkhash]，指代的是当前chunk的一个hash版本，也就是说，在同一次编译中，每一个chunk的hash都是不一样的；而在两次编译中，如果某个chunk根本没有发生变化，那么该chunk的hash也就不会发生变化。这在缓存的层面上来说，就是把缓存的粒度精细到具体某个chunk，只要chunk不变，该chunk的浏览器缓存就可以继续使用。
        // 
        // XXX 使用 [chunkhash] 如果 JS 文件中依赖了 CSS, 即使只是修改 CSS, 也会导致 JS 文件的 chunkhash 改变
        // webpack 的 [chunkhash] 是根据 chunk 的内容计算的，而 JS 这个 chunk 的输出在 webpack 看来是包括 css 文件的，只不过被你抽取出来罢了，所以你改 css 也就改了这个 chunk 的内容
        filename: config.output.jsFilename,
        // require.ensure 声明的 chunks
        chunkFilename: config.output.chunk + '/' + config.output.jsFilename
    },
    module: {
        // Ignored files should not have calls to import, require, define or any other importing mechanism. They are allowed to use exports and module.exports. This can boost build performance when ignoring large libraries.
        // 告诉 webpack 这个模块是没有依赖的, 用于优化 webpack 的构建速度
        // noParse: ['jquery'],
        loaders: [{ // es2015
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: [/node_modules/],
            query: {
                presets: ['es2015'] // 可以在这里添加对 react 的支持
            }
        }, { // css
            test: /\.css$/,
            // 配置 notExtractLoader, 当 CSS 没有被提取出来的时候降级到另外的 loader 来加载样式
            loader: ExtractTextPlugin.extract('style-loader', 'css?' + JSON.stringify(config.cssLoader))
        }, { // 其他静态资源
            test: /\.(jpe?g|png|gif|svg)(\?\S*)?$/i, // 图片资源
            loaders: [
                // 对于小质量的图片资源, 由 url-loader 实现将其进行统一打包, 对于所有小于 8kb 的图片资源转换成base64 格式. 这在一定程度上可以替代 CSS Sprites 方案, 用于减少对于小图片资源的HTTP请求数量
                'url-loader?limit=' + config.urlLoader.limit + '&name=' + config.output.res + '/' + config.output.resFilename,
                'image-webpack?' + JSON.stringify(config.imageWebpack)
            ]
        }, {
            test: /\.(otf|eot|ttf|woff2?)(\?\S*)?$/i, // 字体
            loader: 'url-loader?limit=' + config.urlLoader.limit + '&name=' + config.output.res + '/' + config.output.resFilename
        }, {
            test: /\.vue$/,
            loader: 'vue-loader'
        }] // 还可以配置 raw-loader 在某些情况下可以使用, 例如直接放入某文件的内容
    },
    plugins: [
        // 相当于替换代码中的占位
        new webpack.DefinePlugin({
            // 可以将运行环境单独提出来, 方便在代码中使用 dead_code
            // 例如 if (__MODE__ == 'dev') { console.log('日志'); }
            // 这样在构建时, UglifyJS 会帮我们删掉这段代码
            __MODE__: JSON.stringify(env.MODE),
            __ENV__: JSON.stringify(env)
        }),
        // https://segmentfault.com/a/1190000006887523
        // ProvidePlugin的机制是：当webpack加载到某个js模块里，出现了未定义且名称符合（字符串完全匹配）配置中key的变量时，会自动require配置中value所指定的js模块。
        // expose-loader，这个loader的作用是，将指定js模块export的变量声明为全局变量
        new webpack.ProvidePlugin({
        }),
        new ExtractTextPlugin(config.output.cssFilename, {
            allChunks: false // 涉及到通过 Code Spliting 加载的异步模块中的样式如何提取
        }),
        // CommonsChunkPlugin的效果是：在你的多个页面（入口）所引用的代码中，找出其中满足条件（被多少个页面引用过）的代码段，判定为公共代码并打包成一个独立的js文件。至此，你只需要在每个页面都加载这个公共代码的js文件，就可以既保持代码的完整性，又不会重复下载公共代码了（多个页面间会共享此文件的缓存）。
        new webpack.optimize.CommonsChunkPlugin({
            // vendor bundle changes when the application code changes
            // https://webpack.js.org/guides/code-splitting-libraries/#manifest-file
            // 模块的顺序要和加载顺序(即依赖顺序)相反
            name: ['vendor', 'manifest'],
            // https://segmentfault.com/a/1190000006871991
            // 想控制目录结构的，直接在filename参数里动手脚即可
            filename: config.output.chunk + '/' + config.output.jsFilename,
            // 设定要有被3个chunk（即3个页面入口）加载的js模块才会被纳入公共代码
            // 这数目自己考虑吧，我认为3-5比较合适
            minChunks: 3
        }),
        /* 以下配置是进一步的优化, 不是必要的配置 */
        // manifest.js 实在是太小了，以至于不值得再为一个小 js 增加资源请求数量
        // https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/
        new InlineManifestWebpackPlugin(),
        // http://webpack.github.io/docs/list-of-plugins.html#bannerplugin
        // 为了不让注释影响文件的版本, 一般不用动态内容的 banner 了
        // pkg.name + ' v' + pkg.version + ' ' + new Date().toLocaleDateString() + ' | (c) 2014-' + new Date().getFullYear() + ' ' + pkg.author
        new webpack.BannerPlugin(pkg.name + ' | (c) ' + pkg.author, {
            // entryOnly: true
        }),
        // 让模块 ID 稳定下来
        new HashedModuleIdsPlugin()
    ],
    // http://webpack.github.io/docs/library-and-externals.html#applications-and-externals
    // 依赖的外部 JS, 需要手工在页面中预先添加 script
    // externals: {
    //     // 这样的模块仅仅是直接 exports 出这个全局变量而已
    //     // 相当于: module.exports = jQuery;
    //     jquery: 'jQuery'
    // },
    resolve: {
        // 通过 alias 配置减少引用模块的时候要考虑相对目录, 还有就是直接指定使用 min 版来优化打包
        // 例如:
        // import app from '../lib/app/app.js';
        // 就可以简写为
        // import app from 'lib/app/app.js';
        alias: {
            'vue$': 'vue/dist/vue.js',
            'lib': path.resolve(config.src, 'lib')
        }
    },
    // 要使用 HMR(Hot Module Replacement) 功能
    // 只需要在 start 命令的 webpack-dev-server 后加入 --hot 即可
    // 但使用后发现, 对于 html 文件的更新, 有时候会不刷新页面, 所以暂时还是没有使用 HMR 功能
    devServer: {
        contentBase: config.output.dist,
        // 默认只监听 localhost, 如果想通过 IP 来访问, 需要添加 host
        // host: '0.0.0.0',
        // 通过代理来使用原来的 puer-mock 提供的 mockserver 功能
        // puer 的其他功能使用 webpack-dev-server 来代替
        proxy: [{
            context: [
                '/api',
                // 代理 puer 提供的基础资源文件, 只会影响到 puer 默认提供的文件索引页面,
                // 如果不代理这个只会造成没有样式而已
                '/puer',
                // 代理 websocket, 由于已经使用 webpack-dev-server 做了自动刷新, 因此一般也不需要这个了
                '/socket.io'
            ],
            target: 'http://localhost:8000',
            // https://github.com/chimurai/http-proxy-middleware#options
            // app.use('/api', proxy({target: 'http://www.example.org', changeOrigin: true}));
            // http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar
            // 
            // 由于代理这边的 context (/api) 会带到 target 的 URL 上去,
            // 因此需要通过 pathRewrite 重写一下
            pathRewrite: {
                // https://webpack.js.org/configuration/dev-server/#devserver-proxy
                // If you don't want /api to be passed along, we need to rewrite the path:
                '^/api': ''
            },
            ws: true,
            changeOrigin: true
        }]
    },
    vue: { // webpack1 的配置方式
        loaders: {
            css: ExtractTextPlugin.extract('style-loader', 'css?' + JSON.stringify(config.cssLoader)),
            js: 'babel-loader?{"presets":["es2015"]}'
        }
    }
};

// 开发模式下不做压缩并启用 source map
if (env.MODE == 'dev') {
    webpackConfig.devtool = config.devtool;
} else {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(config.uglifyJsPlugin));

    webpackConfig.resolve.alias['vue$'] = 'vue/dist/vue.runtime.min.js';
    webpackConfig.resolve.alias['vue-router$'] = 'vue-router/dist/vue-router.min.js';
    webpackConfig.resolve.alias['element-ui$'] = 'element-ui/lib/index.js';
}

module.exports = webpackConfig;
// 项目配置和环境配置

var pkg = require('../package.json');

// 环境配置, 例如配置开发环境下的各个 URL
var env = {
    MODE: process.env.MODE
};

// webpack 配置
var config = {
    src: 'src',

    output: { // 构建输出的目录和文件名规则
        dist: 'dist', // 构建目录
        chunk: 'lib', // 公共模块
        res: 'res',   // 资源文件
        // 例如: [入口模块名]-[chunkhash].js
        //      [about/about]-[chunkhash].js => about/about-abcd123.js
        jsFilename: '[name]-[chunkhash:7].js',
        cssFilename: '[name]-[contenthash:7].css',
        resFilename: '[name]-[hash:7].[ext]'
    },

    vendor: [ // 需要打包到一起的第三方模块
        'vue',
        'vue-router',
        'vue-resource',
        'element-ui',
        'element-ui/lib/theme-default/index.css',
    ],

    publicPath: '/',
    // 正式环境一般会发布到 CDN, 例如: //youcdn.com/dir/
    // 如果不发布到 CDN, 则保持跟 publicPath 一致即可
    cdnPath: '/',
    // cdnPath: 'http://rawgit.com/appbone/element-ui-admin/master/dist/',

    // [devtool里的7种SourceMap模式是什么鬼](https://gold.xitu.io/post/58293502a0bb9f005767ba2f)
    // XXX 用了 cheap-module-source-map 模式后, 发现在 chrome 中无法查看变量的值了, 还是安静的使用 source-map 吧
    devtool: 'source-map', // cheap-module-source-map

    // Loader/Plugin 的配置
    cssLoader: {
        autoprefixer: {
            add: true,
            // https://github.com/ai/browserslist#queries
            browsers: ['last 2 versions'],
            remove: false
        }
    },
    urlLoader: {
        limit: 8 * 1024
    },
    imageWebpack: {
        optipng: {
            optimizationLevel: 7
        },
        gifsicle: {
            interlaced: false
        },
        pngquant: {
            quality: '75-90',
            speed: 4
        },
        mozjpeg: {
            quality: 75
        }
    },
    uglifyJsPlugin: {
        compress: {
            warnings: false,
            drop_console: true
        }
    }
};

module.exports = {
    config: config,
    env: env,
    pkg: pkg
};
var path = require('path');

var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');

var webpackBaseConfig = require('./config/webpack.base.config.js');
var webpackConfig = merge(webpackBaseConfig);

var projectConfig = require('./config/project-config.js');
var pkg = projectConfig.pkg;
var env = projectConfig.env;
var config = projectConfig.config;

// 默认的首页入口
var pageEntries = [{
    entryName: 'index',
    entry: path.resolve(config.src, 'index.js'),
    template: path.resolve(config.src, 'index.html'),
    filename: 'index.html'
}];

/**
 * 添加页面模块
 * 
 * @param entryName {string} 模块名, 与模块的入口文件保持一致(仅去掉 JS 文件后缀)
 */
function addPageEntry(entryName) {
    var entry = entryName + '.js';
    var template = entryName + '.html';

    pageEntries.push({
        entryName: entryName,
        entry: path.resolve(config.src, entry),
        template: path.resolve(config.src, template),
        filename: template
    });
}

/**
 * 给页面添加 webpack 配置
 * 
 * @param pageEntry {object} {
 *     entryName: 'index/index',
 *     entry: './src/index/index.js',
 *     template: './src/index.html',
 *     filename: 'index.html'
 * }
 */
function addPageWebpackConfig(pageEntry) {
    var entry = {};
    entry[pageEntry.entryName] = pageEntry.entry;

    // XXX 多个页面使用一份 webpack 配置, 就会造成每个页面引入的 manifest 会包含所有页面的模块信息
    // 如果想解决这个问题, 可以每个页面返回一个单独的 webpack 配置即可
    // 例如: module.exports = [webpackConfigIndex, webpackConfigAbout];
    var baseChunks = ['manifest', 'vendor'];
    var chunks = baseChunks.concat(pageEntry.entryName);

    webpackConfig = merge(webpackConfig, {
        entry: entry,
        plugins: [
            new HtmlWebpackPlugin({
                template: pageEntry.template,
                // filename 利用 / 即可达到控制文件目录结构的效果
                filename: pageEntry.filename,
                // 页面中需要加入的模块
                chunks: chunks,
                chunksSortMode: 'dependency',
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
                // 配置信息可以在 template 中使用, 例如 <%= htmlWebpackPlugin.options.option1 %>
                // 因此可以在这里实现 ejs 的 Including nested templates 功能
                // https://github.com/okonet/ejs-loader#including-nested-templates
                // 
                // 其他可以使用的变量还有: webpack, webpackConfig
            })
        ]
    });
}

// 如果考虑自动扫描多页面模块(不需要每次自己配置), 可以参考 multi-vue
// https://github.com/blade254353074/multi-vue/blob/master/tools/config/index.js#constructEntries
// addPageEntry('about/about');
// addPageEntry('about/foo/foo');

// 给所有页面模块添加 webpack 配置
pageEntries.forEach(function(pageEntry) {
    addPageWebpackConfig(pageEntry);
});

// console.log(webpackConfig);
module.exports = webpackConfig;
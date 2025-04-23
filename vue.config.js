'use strict';
const path = require('path');

// const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // publicPath: './',
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/yian/' : './',
  devServer: {
    port: 8888,
    proxy: {
      '/picsum.photos': { // 使用"/queue-admin"来代替 API头部，可随意命名
        // target: 'http://192.168.11.12:8080',  // 源地址 本地开发的API头部
        target: 'localhost:8888', // 配置到服务器后端的API头部
        pathRewrite: {
          '^/picsum.photos': '/fastly.picsum.photos' // 路径重写，第一个与上面相同，第二个/queue-admin 为server.context-path（服务器的上下文）
        },
        // 以下解决https 访问问题。上面的可以访问http
        changeOrigin: true,
        secure: false,
        headers: {
          Referer: 'https://fastly.picsum.photos'
        }
      },
      '/js/static/web-ifc/': {
        target: 'http://localhost:8888/static/web-ifc', // 代理的目标地址
        changeOrigin: false,
        // secure: false, // 如果目标服务器使用 HTTPS，则需要设置为 true
        pathRewrite: { '^/js/static/web-ifc/': '' }
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      title: 'threeJs学习'
    }
  },
  configureWebpack: {
    externals: {
      jquery: '$',
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery'
      // echarts: 'echarts'
    },
    // module: {
    //   rules: [
    //     {
    //       test: /\.wasm$/,
    //       type: 'javascript/auto',
    //       loader: 'file-loader',
    //       options: {
    //         name: '[name].[hash].[ext]',
    //         publicPath: '/'
    //       }
    //     }
    //   ]
    // },
    plugins: [
      // new webpack.optimize.CommonsChunkPlugin('common.js'),
      // new webpack.ProvidePlugin({
      //   jQuery: 'jquery',
      //   $: 'jquery'
      // })
    ]
  },
  chainWebpack (config) {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/common/icons')) // 注意svg的存储地址
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/common/icons')) // 注意svg的存储地址
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
  }
};

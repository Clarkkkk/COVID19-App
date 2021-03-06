const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: false,
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      importWorkboxFrom: 'local', // 从''cdn"导入workbox,也可以‘local’
      skipWaiting: true, // 安装完SW不等待直接接管网站
      clientsClaim: true,
      exclude: [/\.(?:map)$/], // 在预缓存中排除sourceMap
      // 定义运行时缓存
      runtimeCaching: [
        {
          // To match cross-origin requests, use a RegExp that matches
          // the start of the origin:
          urlPattern: new RegExp(/^https?:\/\/carllllo\.work/),
          handler: 'CacheFirst',
          options: {
            cacheName: 'appShell',
            // Configure which responses are considered cacheable.
            cacheableResponse: {
              statuses: [200]
            },
            expiration: {
              maxAgeSeconds: 7 * 24 * 60 * 60
            }
          }
        }, {
          // eslint-disable-next-line max-len
          urlPattern: new RegExp(/^https?:\/\/api\.carllllo\.work\/covid19\/maps/),
          handler: 'CacheFirst',
          options: {
            cacheName: 'statics',
            cacheableResponse: {
              statuses: [200]
            }
          }
        }, {
          // eslint-disable-next-line max-len
          urlPattern: new RegExp(/^https?:\/\/api\.carllllo\.work\/covid19\/(?!maps)/),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'apiRequests',
            cacheableResponse: {
              statuses: [200]
            }
          }
        },
      ]
    },
    // 这里的设置会反映在index.html中
    name: 'COVID-19疫情小站',
    themeColor: '#00a59d',
    msTileColor: '#00a59d',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    manifestPath: 'public/manifest.json',
    iconPaths: {
      favicon32: 'img/icons/favicon-196.png',
      favicon16: 'img/icons/favicon-196.png',
      androidChrome: 'img/icons/manifest-icon-512.png',
      appleTouchIcon: 'img/icons/apple-icon-180.png'
    }
  },
  css: {
    loaderOptions: {
      css: {
        // 这里的选项会传递给 css-loader
        esModule: false
      }
    }
  },
  configureWebpack: (config) => {
    return {
      optimization: {
        splitChunks: {
          chunks: 'all',
          minSize: 300,
          cacheGroups: {
            vendors: {
              name: `chunk-vendors`,
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              chunks: 'initial'
            },
            echarts: {
              name: `chunk-echarts`,
              test: /[\\/]echarts[\\/]|[\\/]echarts-stat[\\/]|[\\/]zrender[\\/]/,
              priority: -5,
              chunks: 'initial'
            },
            echartsGl: {
              name: `chunk-echarts-gl`,
              test: /[\\/]echarts-gl[\\/]|[\\/]claygl[\\/]/,
              priority: -1,
              chunks: 'initial'
            },
          }
        }
      }
    };
  },
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/covid19/',
};

var path = require('path')
var fs = require('fs')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var templatesPath = path.join(__dirname, '../src/templates')
var glob = require('glob')


var timestamp = new Date().getTime()
var svg = fs.readFileSync(path.join(__dirname, '../src/templates/fragments/svg.html'))
var staticHead = fs.readFileSync(path.join(__dirname, '../src/templates/fragments/head.html'))
staticHead = staticHead.toString().replace(/v=revision_here/ig, `v=${timestamp}`)
var staticBottom = fs.readFileSync(path.join(__dirname, '../src/templates/fragments/bottom.html'))
staticBottom = staticBottom.toString().replace(/v=revision_here/ig, `v=${timestamp}`)
var plugins = []
var productPlugins = []





var files = glob.sync(path.join(__dirname, '../src/templates/*.html'))

files.forEach(function (value, index, array) {
  // 截取文件名加后缀
  var element = value.substr(value.lastIndexOf('/') + 1);
  // 截取文件名
  var chunkName = element.replace('.html', '')
  if (/.html$/.test(element)) {
    console.log(element)
    var plugin = new HtmlWebpackPlugin({
      filename: element,
      template: 'src/templates/' + element,
      inject: 'head',
      svg: svg,
      staticHead: staticHead,
      staticBottom: staticBottom,
      inject_devtools: true,
      inject_title: 'In Essence',
      inject_keywords: 'In Essence',
      inject_description: 'In Essence',
      chunks: [chunkName]
    })
    plugins.push(plugin)

    if (process.env.NODE_ENV === 'production') {
      var vendorFiles = glob.sync(path.join(__dirname, '../dist/static/js/vendor.dll.*.js'))

      var vendorFile = vendorFiles.pop()
      var vendorName = vendorFile.match(/vendor.dll.(\S*).js/gi).pop()

      var productPlugin = new HtmlWebpackPlugin({
        filename: element,
        template: 'src/templates/' + element,
        inject: 'head',
        svg: svg,
        staticHead: staticHead,
        staticBottom: staticBottom,
        inject_devtools: false,
        inject_title: 'In Essence',
        inject_keywords: 'In Essence',
        inject_description: 'In Essence',
        inject_vendorDLL: vendorName,
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunks: ['manifest', 'vendor', chunkName],
        chunksSortMode: 'dependency'
      })
      productPlugins.push(productPlugin)
    }

  }
})

module.exports = {
  plugins: plugins,
  productPlugins: productPlugins
}

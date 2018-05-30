import Vue from 'vue'
Vue.config.errorHandler = function (err, vm, info) {
  console.error(err)
  var msg = '错误信息：' + err.message
  msg += '堆栈信息：' + err.stack
  var img = document.createElement('img')
  img.src = `/api/logs/js?errorMsg=${encodeURIComponent(msg)}`
}
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
  var msg = '错误信息：' + errorMessage.toString()
  msg += '出错文件：' + scriptURI.toString()
  msg += '出错行号：' + lineNumber.toString()
  msg += '出错列号：' + columnNumber.toString()
  var img = document.createElement('img')
  img.src = `/api/logs/js?errorMsg=${encodeURIComponent(msg)}`
}

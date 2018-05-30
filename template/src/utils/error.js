let sendMsg = function(errorMessage) {
  let msg = '错误信息：' + errorMessage.toString()
  let img = document.createElement('img')
  img.src = `/api/logs/js?errorMsg=${encodeURIComponent(msg)}`
}

let onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
  let msg = '错误信息：' + errorMessage.toString()
  msg += '出错文件：' + scriptURI.toString()
  msg += '出错行号：' + lineNumber.toString()
  msg += '出错列号：' + columnNumber.toString()

  let img = document.createElement('img')
  img.src = `/api/logs/js?errorMsg=${encodeURIComponent(msg)}`
}

let errorHandler = function (err, vm, info) {
  let msg = '错误信息：' + err.toString()
  let img = document.createElement('img')
  img.src = `/api/logs/js?errorMsg=${encodeURIComponent(msg)}`
}

export {
  sendMsg,
  onerror,
  errorHandler
}

var http = require('http')

//使用http.createServer() 方法建立web伺服器，回傳一個server實例
var server = http.createServer()

// 註冊request 請求事件監聽，當前端請求過來，此事件會被觸發，並執行callback函式
// server.on('request', function(request, response) {
//   var url = request.url

//   if (url === '/') {
//     response.end('你好世界')    
//   } else if (url === '/login') {
//     response.end('Login page')
//   } else {
//     response.end('404')
//   }
// })

server.on('request', function(request, response) {
  var family = [
    {
      name: 'Dylan',
      age: 18
    },
    {
      name: 'Paul',
      age: 80
    },
    {
      name: 'John',
      age: 5
    }
  ]
  response.end(JSON.stringify(family))
})

server.listen(8000,function() {
  console.log('伺服器已運行')
})
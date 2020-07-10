var http = require('http')
var fs = require('fs')
var server = http.createServer()
var template = require('art-template')
var timeFormater = function(RFCdate) {
  var millisecond = Date.parse(RFCdate)
  var dateObj = new Date(millisecond)
  return `${dateObj.toLocaleDateString()} ${dateObj.getHours()}:${dateObj.getMinutes()}`
}
var path = require('path')
path.extname('index.js')
var returnContentType = function(fileName) {
  var deputy = path.extname(fileName)
  switch(deputy) {
    case '.html':
      return 'text/html; charset=utf-8'
      break
    case '.js':
      return 'application/x-javascript; charset=utf-8'
      break
    case '.css':
      return 'text/css; charset=utf-8'
      break
    case '.jpg':
      return 'image/jpg'
      break
    case '.jpeg':
      return 'image/jpeg'
      break
    case 'png':
      return 'image/png'
      break
    default:
      return 'charset=utf-8'
      break
  }
}


// server.on('request', function(req, res) {
//   var url = req.url

//   if (url === '/' || url === '/index.html') {
//     fs.readFile('./www/index.html', function (err, data) {
//       if (err) {
//         return res.end('404')
//       }
//       res.end(data)
//     })
//   } else if (url === '/file' || url === '/file/index.html') {
//     fs.readFile('./www/file/index.html', function(err, data) {
//       if (err) {
//         return res.end('404')
//       }

//       res.end(data)
//     })
//   }
// })

//優化
var wwwDir = './www'

// server.on('request', function(req, res) {
//   var url = req.url
//   var filePath
//   url === '/' ? filePath = '/index.html' : filePath = url

//   fs.readFile(wwwDir + filePath, function(error, data) {
//     if (error) {
//       return res.end('404')
//     }
//     res.end(data)
//   })
// })


server.on('request', function(req, res) {
  var url = req.url
  var filePath
  url === '/' ? filePath = '/index.html' : filePath = url
  var fullPath = wwwDir + filePath
  console.log(fullPath)
  //fs.access()判斷路徑是否存在
  // fs.statSync() 取得資源的詳細資訊(Stats)
  //isDirectory() 判斷是否為資料夾
  //fs.readdir() 取資料夾內的成員
  fs.access(fullPath, function(err) {
    if (err) {
      console.log('資源不存在')
      return res.end('404')
    } else {
      console.log('存在')
      /**********Str********** */
      if (fs.statSync(fullPath).isDirectory()) {
        console.log('路徑為資料夾')
        fs.readdir(fullPath, function(err, dirFiles) {
          if (err) {
            return res.end('404')
          }
          //檢查該資料夾內是否有名為index的檔案，有則建立一個物件
          var indexItem = {}
          dirFiles.forEach((file) => {
            if (/index\./.test(file)) {
              indexItem = {
                hasIndexFile: true,
                fileName: file
              }
            }
          })
          //如果有則印出資料夾的頁面
          if (indexItem.hasIndexFile) {
            var indexPathLocation = fullPath + '/' + indexItem.fileName
            fs.readFile(indexPathLocation, function(err, indexFile) {
              if (err) {
                return res.end('404')
              }
              res.setHeader('Content-type', returnContentType(indexItem.fileName))
              res.end(indexFile)
            })
          } else {
            fs.readFile('./template.html', function(err, templateFile) {
              if (err) {
                return res.end('404')
              }
              var filesDelailInfo = dirFiles.map((file) => {
                var statSync = fs.statSync(fullPath + '/' + file)
                var fileDetail = {
                  fileName: file,
                  size: statSync.size,
                  createTime: timeFormater(statSync.ctime),
                  mutateTime: timeFormater(statSync.mtime),
                }
                return fileDetail
              })
              //加入path port參數做使用
              var htmlStr = template.render(templateFile.toString(), {
                path: filePath,
                port: 9000,
                files:filesDelailInfo
              })
              res.end(htmlStr)
            })
          }
        })
      } else {
        console.log('資料為一般檔案')
        fs.readFile(fullPath, function(error, data) {
          if (error) {
            return res.end('404')
          }
          res.end(data)
        })
      }
    }
  })
})

server.listen('9000', function() {
  console.log('伺服器正在運行')
})
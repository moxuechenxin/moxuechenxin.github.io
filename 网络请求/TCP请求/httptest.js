const http = require('http');
const fs = require('fs');
http.createServer(function(req,res){
  fs.readFile('./httptest.pptx',function(err,data){
    // 设置请求头，通过Content-Type告诉客户端实际返回的内容类型
    res.writeHead(200, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
    res.send(data)
  })
}).listen(4000);
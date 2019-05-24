var net = require('net');
var client = net.Socket();
// 连接服务器
client.connet(3400, '192.168.91.169', function(){
  setTimeout(function(){
    // 客户端向服务端发送信息
    client.write('我登录进来了')
  }, 2000)
})
client.on('data', function(data){
  console.log(data.toString())
})
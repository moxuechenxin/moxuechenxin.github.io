const net = require('net');

// 创建一个tcp服务器
var server = net.createServer(function(){
  console.log('some on connect')
})
// 设置监听端口
server.listen(3400);
// 监听连接事件
server.on('connection', function(socket){
  // 向客户端传消息
  socket.write('用户登录成功')
  // 监听客户端发送过来的数据
  socket.on('data', function(){
    socket.write('欢迎进入')
  })
})
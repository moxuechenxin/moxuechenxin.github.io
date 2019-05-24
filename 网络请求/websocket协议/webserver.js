const WebSocket = require('ws'); // 使用的common.js模块化的规范，不能使用import，只能用require
// 获取WebSocket类
const WebSocketServer = WebSocket.Server()
// 开启WebSocket服务器
const wss = new WebSocketServer({
  port: 3000
})
// 设置监听事件
wss.on('connection', function(socket){
  // 向客户端推送消息
  ws.send('恭喜你连上了')
  setTimeout(function(){
    ws.send('你连上了倒是说话呀')
  }, 2000)
  // 监听客户推送过来的消息
  ws.on('message', (ms)=> {
    console.log('get it')
    ws.send('收到')
  })
})
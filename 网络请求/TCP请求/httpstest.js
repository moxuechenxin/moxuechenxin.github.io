// https需要证书（可以购买 => 会过期，，也可以自签名证书 => 不会过期，但是会被浏览器拦截）

/**
 * 自签名生成证书依次执行以下三行命令
 */
// 生成私钥，1024=> 加密参数；  /path/to/private.pem => 私钥存放路径，可以写成 ./private.pem => 当前路径下
// openssl 如果在cmd下执行命令行有问题，，，可以用git执行
// openssl genrsa 1024 > /path/to/private.pem
// 在当前路径下产生一个private.pem文件，里面就是生成的私钥
openssl genrsa 1024 > ./private.pem
// 根据当前生成的私钥（./private.pem）生成公钥（./csr.pem）
// 在当前路径下产生一个csr.pem文件，里面就是生成的公钥
openssl req -new -key ./private.pem -out ./csr.pem
// 根据私钥和公钥生成证书
// 在当前路径下产生一个file.crt文件
openssl x509 -req -days 365 -in csr.pem -signkev private.pem -out file.crt

/**
 * 一下为模拟请求代码
 */
const https = require('https');
const fs = require('fs')
// f读取证书
const option = {
  key:fs.readFileSync('./private.pem'),
  cert:fs.readFileSync('./file.crt')
}
// 开启服务，传入证书
https.createServer(option,function(req,res){
  res.writeHead(200);
  res.end('hello https')
}).listen(3500);
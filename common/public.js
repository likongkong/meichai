var Aes = require('crypto-js.js');  //引用AES源码js

var env = 'online';   // 线上 
// var env = 'qpe';  // 准生产环境
// var env = 'test';  // 测试
var versionnumber = '14.4.7';

if(env == "online"){
  var key = Aes.enc.Utf8.parse("danzhuan1chaijia");   //Aes解密正式服秘钥
}else if(env == "qpe"){ 
  var key = Aes.enc.Utf8.parse("danzhuan1chaijia");
}else if(env == "test"){
  var key = Aes.enc.Utf8.parse("danzhuanichaijia");    //Aes解密测式服秘钥
}; 

// 公共地址 接口
function comurl() {
  switch(env){
    case "online":var envUrl = 'https://api.51chaidan.com/';break;
    case "qpe":var envUrl = 'https://api-t.51chaidan.com/';break;
    case "test":var envUrl = 'http://api-test.51chaidan.com/';break;
    default:console.log('错误');
  };
  return envUrl;
}
// 公共地址 接口
function comUrlNew() {
  switch(env){
    case "online":var envUrl = 'https://api-api.51chaidan.com/';break;
    case "qpe":var envUrl = 'https://api-new-t.51chaidan.com/';break;
    case "test":var envUrl = 'http://test-api-new.51chaidan.com/';break;
    default:console.log('错误');
  };
  return envUrl; 
} 
console.log(comurl(),comUrlNew())
//拼图 公共地址 接口
function clwcomurl(){  
  return env=='online'?'https://clw.51chaidan.com/':'http://clw-test.51chaidan.com/';
}
// 公共地址 图片
function zdyurl() {
  // 测试
  // return 'http://test.51chaidan.com/';
  // 线上  
  return 'https://cdn.51chaidan.com/';
}
//拼图 公共版本号
function subversionNumber() {
  return '1.4.2';
}

//加密方法
function Aese(secretPwd){
  var secretPwd = secretPwd +'&ct=3&vcode='+versionnumber;
  var encrypted = Aes.AES.encrypt(secretPwd, key, {
    mode: Aes.mode.ECB,    
    padding: Aes.pad.Pkcs7
  });
  //  测试 不加密
  // return '?'+secretPwd;
  //  线上 加密
  return '?q='+encrypted.toString();
}

//解密方法
function Aesd(ciphertext) {
  var bytes = Aes.AES.decrypt(ciphertext.toString(), key, {
    mode: Aes.mode.ECB,
    padding: Aes.pad.Pkcs7
  });
  var plaintext = bytes.toString(Aes.enc.Utf8);
  return plaintext;
}
// 分享
function sharemc(){
  return {
    title: '潮玩社交平台',
    path: 'pages/index/index',
    imageUrl: 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
    success: function (res) {}
  }  
}
// 分享朋友圈
function shareWechatMoments(){
  return {
    title:'美拆',
    imageUrl:'https://cdn.51chaidan.com/images/default/shareImg.jpg'
  }
}

function toDate(number,num) {
  var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
}


module.exports.comurl = comurl;
module.exports.zdyurl = zdyurl;
module.exports.sharemc = sharemc; 
module.exports.Aese = Aese; 
module.exports.Aesd = Aesd; 
module.exports.subversionNumber = subversionNumber;
module.exports.env = env;
module.exports.versionnumber = versionnumber;
module.exports.clwcomurl = clwcomurl;
module.exports.shareWechatMoments = shareWechatMoments;
module.exports.comUrlNew = comUrlNew;
module.exports.toDate = toDate;
var Aes = require('crypto-js.js');  //引用AES源码js

var env = 'online';   // 线上 
// var env = 'qpe';  // 准生产环境
// var env = 'test';  // 测试
var versionnumber = '13.5.7';

if(env == "online"){
  var key = Aes.enc.Utf8.parse("danzhuan1chaijia");
}else if(env == "qpe"){
  var key = Aes.enc.Utf8.parse("danzhuan1chaijia");
}else if(env == "test"){
  var key = Aes.enc.Utf8.parse("danzhuanichaijia");
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
  // return 'https://www.51chaidan.com/';
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
// 购物车显示数据
function shopnum(_this,comurl){
  var _this = _this;
  var store_id = _this.data.store_id||0;
  // 获取购物车显示个数
  if (_this.data.uid && _this.data.loginid){
    var qq = Aese('mod=cart&operation=getcartnum&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&store_id=' + store_id);
    wx.request({
      url: comurl + 'goods.php' + qq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            shopnum: res.data.count
          });
        };
      }
    }) 
  }else{
    _this.setData({
      shopnum: 0
    });
  };
}
// 晒单数量
function dryingSum(_this,url) {
  var _this = _this;
  var data = { vcode: '1.4.2', source: 4, uid: _this.data.uid, loginid: _this.data.loginid };
  // wx.request({
  //   url: url+'dryingSum',
  //   header: { "Content-Type": "application/x-www-form-urlencoded" },
  //   method: "POST",
  //   data: data,
  //   success: function (res) {
  //     if (res.data.ReturnCode == 200) {
  //       _this.setData({ 
  //         dryinglistnum: res.data.List || 0, 
  //         commentNumber:res.data.Info.commentNumber||0
  //       });
  //     } else {
  //       _this.setData({ 
  //         dryinglistnum: 0, 
  //         commentNumber:0 
  //       });
  //     }
  //   },
  // })
}
// 判断是否登录
function comiftrsign(_this,res,app) {
  if (res.data.ReturnCode == 900) {
    wx.showToast({
      title: '登陆状态有误',
      icon: 'none',
      duration: 1500
    });
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          app.signin(_this);
        } else {
          wx.navigateTo({
            url: "/pages/signin/signin"
          })
        }
      }
    });
  }else if(res.data.ReturnCode == 999){
    wx.showToast({
      title: res.data.Message,
      icon: 'none',
      duration: 1500
    });
  };
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

console.log('envVersion',__wxConfig.envVersion);

module.exports.comurl = comurl;
module.exports.zdyurl = zdyurl;
module.exports.sharemc = sharemc; 
module.exports.Aese = Aese; 
module.exports.Aesd = Aesd; 
module.exports.comiftrsign = comiftrsign;
module.exports.shopnum = shopnum;
module.exports.dryingSum = dryingSum;
module.exports.subversionNumber = subversionNumber;
module.exports.env = env;
module.exports.versionnumber = versionnumber;
module.exports.clwcomurl = clwcomurl;
module.exports.shareWechatMoments = shareWechatMoments;
module.exports.comUrlNew = comUrlNew;
module.exports.toDate = toDate;
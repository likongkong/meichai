

//拼图 公共地址 接口
function comurl() {
  // 测试
  // return 'http://clw-test.51chaidan.com/';
  // 线上
  return 'https://clw.51chaidan.com/';
}

//公共版本号
function versionNumber() {
  return '1.4.2';
}

// post请求函数  url(请求地址) data(请求参数)   
function postRequest(_this, url, data, callback,comcallback,hideload){
  var _this = _this;
  _this.setData({ headhidden: false});
  var edition = { vcode: versionNumber(), source:4};
  if (data!=''){
    var data = JSON.parse((JSON.stringify(edition) + JSON.stringify(data)).replace(/}{/, ','));
  }else{
    var data = edition;
  };
  wx.request({
    url: comurl() + url,
    header: {"Content-Type": "application/x-www-form-urlencoded"},
    method: "POST",
    data: data,
    complete: function () {
      _this.setData({
        headhidden: true,
      });
    },
    success: function (res) {
      if (hideload) {
        hideload();
      };
      wx.hideLoading();
      wx.stopPullDownRefresh();
      _this.setData({
        headhidden: true,
      })
      if (res.data.ReturnCode == 200) {
        callback(res);
      } else {
        wx.showToast({
          title: res.data.Msg,
          icon: 'none',
          mask: true,
          duration: 3000
        })
      };
      if (comcallback) {
        comcallback()
      };
    },
    fail:function(){
      if (hideload){
        hideload();
      };
      wx.hideLoading();
    }
  })
}

// 时间转化
//时间戳转换时间  
function toDate(number) {
  var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
    return h + ':' + m;
  } else if (new Date(number * 1000) < new Date()) {
    return M + '-' + D;
  }

}

// 晒单分享图片地址
function dryinglistshare(){
  return 'https://clw.51chaidan.com//images/drying/goodsimg/communication.png?s=1'
}


module.exports.comurl = comurl;
module.exports.versionNumber = versionNumber;
module.exports.postRequest = postRequest;
module.exports.toDate = toDate;
module.exports.dryinglistshare = dryinglistshare;      
// bargainDetail 砍价详情
// bargainList 砍价列表
// devanning 拆箱
// getjigsaw 拼图助力页
// jigsawDetail 拼图详情
// jigsawList 拼图列表
// minejigsaw 我的拼图
// newbornzone 新人3重礼
// dlfind 晒单发现
// dlfinddetails 发现详情
// dldlcreate 创建晒单
// dltopicselection 选择话题
// dlpersonalhomepage 个人主页
// dllocation 所在位置
// dluserhomepage 用户主页
// rofcoins 拆币记录
// awardwinningarea 领奖专区
// earnmoney 赚拆币
// exchangeanddismantling 兑换拆币
// turntable 转盘
// rotaryrecord 转盘中奖记录
// newpsellwell 首页新品热销 查看更多跳转页
// mytoydg 我的玩具柜 立即发货
// mytoyorder 我的玩具柜 全部 出售中 已售出 列表
// myothertoydg  别人的玩具店

//  informationdetail  详细消息中心列表



// Pub.postRequest(_this, 'topicclass', { uid: _this.data.uid, loginid: _this.data.loginid }, function (res) {

// });







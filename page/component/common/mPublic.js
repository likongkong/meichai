const app = getApp();

console.log('app=====================',app.signindata.clwcomurl)

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
    url: app.signindata.clwcomurl + url,
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
//  doubleElevenexh  展会临时转盘


// Pub.postRequest(_this, 'topicclass', { uid: _this.data.uid, loginid: _this.data.loginid }, function (res) {
//   
// });



// 云
// activityStatistics 活动统计表  act_id 活动id  uid用户id  timestamp时间戳  type 0普通  1展会
// exhibitionList 展会列表统计 type 0 展会列表 1 免单活动 2 品牌列表  4限量  5展会限量抽盒  11限时抢购  12福袋列表  14 设计师展示 15 种草列表
// advertisingStat 广告统计 type 0 展会列表 1 免单活动列表 2 品牌列表  4限量  5展会限量抽盒  11限时抢购列表  12福袋列表  14 设计师展示  15 限定详情 16 品牌详情 17 免单详情 18 普通商品详情 19 展会福利  adv_id  广告id 


//  index 首页
//  wode 我的
//  personaldata 个人资料

//  information  消息中心
//  addressmanagement  收货地址
//  orderdetails  订单详情
//  myorder 订单列表
//  successfultrade  交易成功
//  transactionfailure  交易失败
//  customerservice  客户服务
//  mycollection  我的收藏
//  coupon  优惠券
//  allcomments  全部评论
//  applyforaftersale  申请售后
//  detailspage  详情页
//  myorder  我的订单
//  newreceivingaddress 新增收货地址
//  classificationpage  分类页面
//  search 搜索
//  hotsearchvocabulary 热门搜索词汇
//  webview  跳转外部页面
//  signin 获取权限页面
//  activitysharinglist 拆免单页面
//  myexemption 我的免单
//  activitydetailspage 活动详情页
//  hdparticipateintheuser 免单活动参与用户
//  dismantlingbox 拆盒装
//  signinpage 签到页面
//  combination 组合页面
//  combinationdetail 组合详情页
//  savethepicture 保存图片
//  imdetailspage 拆币兑换详情页
//  sputforward 我的小金库 提现
//  sbestpartner 最佳合伙人
//  streasurylist  金库排行榜
//  soviceguidance  店铺新手引导
//  invitingfriends  邀请好友 and 邀请拆单
//  shopsquare 展会打卡
//  shopsquaretrip 展会打卡第三方
//  dismantlingbox 展会订阅


//  redenvelopes 红包页面
//  redenvelopesdetails 红包页面


//  shoppingCart 购物车 
//  afterSalesRecord 售后记录
//  applyAfterSales  申请售后
//  logs  查看启动日志
//  register  注册
//  resetPassword  重置密码
//  reviewProgress 审核进度
//  lookatthelogistics 查看物流
//  share  详情页
//  shippingAddress 修改收货地址
//  newbornzone 新人三重礼
//  weplug-add-tips 首页提示用户加入我的小程序
//  dlnotice 发现中的 通知
//  officialconsignment 官方寄售列表
//  cumconreward  连续签到 累计抽奖 奖励列表   app.js 中
//  initiateopenboxeslist 发起拆明盒列表
//  initiateopenboxes 发起拆明盒详情
//  ocamendment 闲置潮玩列表修改
//  ocamgoodsseries 闲置商品系列
//  ocamcart  闲置潮玩列表购物车
//  ocamhot  闲置捡漏热门
//  drivetohidehome 开车送隐藏主页
//  drivetohide 开车送隐藏详情页
//  drivetohidelist 开车送隐藏中奖列表
//  newsignin 新登录
//  crowdfunding 众筹详情页
//  playgrasslist 众筹列表

//  exhibition 展会页面
//  exhibitionlist 展会列表

// aRewardList    一番赏详情页
// aRewardDetails 一番赏详情
// aRewardHistory 一番赏历史

// halloweenparty 万圣节活动组件

// calendarList 日历列表
// modifythenickname 日历详情
// iWasInvolved 日历 我的投票
// vipPage  vip 页面
// vipClausePage  vip会员条款
// giftCollection 领取礼物
// electronicTicket 电子票详情

// priorityVoting  邀请函
// luckyDraw  展会VIP抽签
// winningResult  展会抽签中奖名单
// bindTicket  绑定展会门票
// ticketRcSort  门票入场顺序
// ordinaryTicket  普通门票
// entityLuckyDraw  实物刮刮卡
// idCardVerification 身份证验证

// canvasRoute 路径 canvas 展会画路径
// draw  抽奖
// blankPage 展会空白页跳转
// drawHideGoods 抽隐藏

//fortuneToys  关注公众号小号赠送限时抽盒金

//mobileShellList  手机壳列表


// isItaVIPTicket 暂时没用到 
// storehomepage  申请入驻


//auctionList 拍卖列表
//myAuctionList 我的拍卖列表
//auctionRecord 拍卖出价记录

// redEnvelopeList 红包列表
// onlineFukubukuro  在线福袋
// payee  收款

// "pages/vipOrTicket/vipOrTicket",  


// ballotList  抽签中签名单

// offeringCalendar 发售日历
// atlas 图鉴
// orderManagement 订单管理
// businessOrderDetails  订单详情
// dynamicDetails 动态详情
// commodityManagement 商品管理
// salesEffect 销售效果
// fanManagement 粉丝管理
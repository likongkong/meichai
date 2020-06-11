// 阿拉丁
const ald = require('./utils/ald-stat.js');
// talkingdata
var tdweapp = require('./utils/tdweapp.js');
//aes加密解密js
var Dec = require('common/public.js');
App({
  signindata: {
    env:Dec.env, //环境
    // 接口地址  
    comurl: Dec.comurl(),
    // 发现地址
    clwcomurl:Dec.clwcomurl(),
    // 图片地址
    zdyurl: Dec.zdyurl(),
    openid: '',
    loginid: '',
    uid: '',
    pushnum: 0,
    // 自己店铺id
    store_id: '',
    reg: /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/,
    // 活动分享推荐人id  
    referee: 0,
    activity_id: 0,
    // B店铺id
    b_store_id: 0,
    // 判断是否通过扫码进入新用户
    global_store_id: '-1',
    channel: '',
    // 判断跳哪个首页
    last_store_id: 0,
    iftr_mc: false,
    // 版本号
    versionnumber:Dec.versionnumber,
    // 苹果X适配
    isIphoneX: false,
    // 判断是ios还是android  ios:true, android:false
    iftriosorand: true,
    // 用户注册统计
    token: "",
    // 用户头像图片
    avatarUrl: '',
    share_source: 1,
    modelData: '',
    systemData: '',
    platformData: '',
    appNowTime: Date.parse(new Date()),
    // 是否是扫码进入
    typeNum: 1,
    // 校验城市 加入黑名单
    blackCity: false,
    // 基础数据
    defaultinformation: '',
    isNewer: false,
    freeOvertime: 0,
    tid: 0,
    // 是否开启了分享功能
    isShareFun: true,
    // 首页领奖 悬浮窗 数据
    isAwardOrder: false,
    awardOrder: false,
    spreadEntry: false,
    // 屏幕高度
    windowHeight: 0,
    index_ela_fra: false,
    isProduce: false,
    // 订阅判断
    subscribeif: false,
    // 透视卡数据
    perspcardata: '',
    // 统计活动详情是扫码还是分享 1 默认 2 领奖推荐注册
    activity_type: 1,
    activity_type_share: 0,
    aid: 0,
    addressinfo: '',
    automat: '',
    automattitle: '',
    userInfo: { nickName: "", gender: '', language: "", city: "", province: "" },
    // 分享图片底部商品数据
    activityblindbox: '',
    // 是否签到
    isTodaySign: false,
    isBlindBoxDefaultAddress: false,
    // 授权图片
    tgaimg: 'https://www.51chaidan.com/images/default/openscreen.jpg',
    // 服务器随机数
    randommaximum:20,
    // 是否能进入展会
    isOpenToyShow:false, // 是否开启展会
    statusBarHeightMc:0
  },
  // 登录
  signin: function (callback, BSkipData) {
    // 获取id    
    var callback = callback || { onLoadfun: function () {  } };
    var _this = this;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.getUserInfo({
          success: function (res) {
            var resiv = res.iv;
            var avaurl = res.userInfo.avatarUrl;
            _this.signindata.avatarUrl = res.userInfo.avatarUrl;
            wx.setStorageSync('image_cache', '')
            var nicname = res.userInfo.nickName;
            var iconsex = res.userInfo.gender;
            var encryptedData = res.encryptedData;
            _this.signindata.userInfo = res.userInfo;

            if (BSkipData && typeof (BSkipData) != "undefined") { //如果B端过来需要额外传递数据
              var q = Dec.Aese('operation=xcx&mod=login&code=' + code + '&iv=' + resiv + '&encryptedData=' + encryptedData + '&referee=' + _this.signindata.referee + '&activity_id=' + _this.signindata.activity_id + '&channel=' + _this.signindata.channel + '&last_store_id=' + _this.signindata.global_store_id + '&token=' + _this.signindata.token + '&share_source=' + _this.signindata.share_source + '&tid=' + _this.signindata.tid + "&isBusinessSkip=" + BSkipData.isBusinessSkip + "&businessClientUserId=" + BSkipData.businessClientUserId +
                "&isMergedUserInfo=" + BSkipData.isMergedUserInfo + '&activity_type=' + _this.signindata.activity_type);
            } else {
              var q = Dec.Aese('operation=xcx&mod=login&code=' + code + '&iv=' + resiv + '&encryptedData=' + encryptedData + '&referee=' + _this.signindata.referee + '&activity_id=' + _this.signindata.activity_id + '&channel=' + _this.signindata.channel + '&last_store_id=' + _this.signindata.global_store_id + '&token=' + _this.signindata.token + '&share_source=' + _this.signindata.share_source + '&tid=' + _this.signindata.tid + '&activity_type=' + _this.signindata.activity_type);
            }
            wx.request({
              url: Dec.comurl() + 'user.php' + q,
              method: 'GET',
              success: function (res) {
                console.log('app', res);
                if (res.data.ReturnCode == 200 || res.data.ReturnCode == 201) {
                  _this.signindata.openid = res.data.Info.openid || '';

                  _this.signindata.loginid = res.data.Info.loginid || '';
                  _this.signindata.uid = res.data.Info.uid || '';

                  console.log(Dec.comurl(),Dec.clwcomurl())
                  // 是否开启展会 
                  _this.signindata.isOpenToyShow = res.data.Info.isOpenToyShow || false;

                  _this.signindata.isNewer = res.data.Info.isNewer || false;
                  _this.signindata.token = '';
                  _this.signindata.freeOvertime = res.data.Info.freeOrder.Info.overtime || 0;
                  _this.signindata.isAwardOrder = res.data.Info.isAwardOrder || false;
                  _this.signindata.awardOrder = res.data.Info.awardOrder || { Info: { cover: "", isAwardOrder: false, overtime: 0, url: "", } };

                  _this.signindata.isShareFun = res.data.Info.isShareFun;

                  _this.signindata.isTodaySign = res.data.Info.isTodaySign;

                  _this.signindata.spreadEntry = res.data.List ? res.data.List.spreadEntry : false || false;
                  _this.signindata.index_ela_fra = true;
                  _this.signindata.isProduce = res.data.Info.isProduce || false;

                  // 是否是地域黑模式
                  _this.signindata.isHellBlackUser = res.data.Info.isHellBlackUser || false;
                  // 是否能进入展会
                  _this.signindata.isOpenToyShow = res.data.Info.isOpenToyShow;
                  // 透视卡倒计时
                  _this.signindata.perspcardata = res.data.Info.tempChance.length != 0 ? res.data.Info.tempChance[0].over_time || '' : '';

                  _this.signindata.automat = res.data.Info.automat ? res.data.Info.automat : { isOpen: false, times: 0, title: "" };
                  _this.signindata.automattitle = res.data.Info.automat ? res.data.Info.automat.title : '';
                  _this.signindata.isBlindBoxDefaultAddress = res.data.Info.address.isBlindBoxDefaultAddress || false;

                  if (res.data.Info.store) {
                    _this.signindata.store_id = res.data.Info.store.store_id || 0;
                    _this.signindata.last_store_id = res.data.Info.store.last_store_id || 0;
                  };
                  var openid = res.data.Info.openid || '';
                  var loginid = res.data.Info.loginid || '';
                  var uid = res.data.Info.uid || '';
                  wx.setStorage({ key: 'signin', data: { openid: openid, loginid: loginid, uid: uid } });
                  callback.onLoadfun();
                  if (res.data.Info.user) {
                    var photoheadphoto = res.data.Info.user.headphoto || '';
                    var namenick = res.data.Info.user.nick || '';
                    if (photoheadphoto != avaurl || namenick != nicname) {
                      _this.logindata(nicname, iconsex, avaurl);
                    };
                  };
                  var qiftr = Dec.Aese('mod=check&operation=city&uid=' + _this.signindata.uid + '&loginid=' + _this.signindata.loginid);
                  wx.request({
                    url: _this.signindata.comurl + 'auth.php' + qiftr,
                    method: 'GET',
                    success: function (res) {
                      if (res.data.ReturnCode == 200) {
                        if (res.data.Info) {
                          _this.signindata.blackCity = res.data.Info.flag;
                          if (res.data.Info.flag) {
                            callback.onLoadfun();
                          };
                        };
                      };
                    }
                  })
                };
                if (res.data.ReturnCode == 201) {
                  var ennicname = encodeURIComponent(nicname)
                  _this.logindata(ennicname, iconsex, avaurl);
                };
              }
            })
          }
        })
      }
    });

  },
  logindata: function (nicname, iconsex, avaurl) {
    var _this = this;
    var qsign = Dec.Aese('mod=info&operation=tpinfo&uid=' + _this.signindata.uid + '&loginid=' + _this.signindata.loginid + '&type=1&nick=' + nicname + '&gender=' + iconsex + '&headphoto=' + avaurl);
    wx.request({
      url: _this.signindata.comurl + 'user.php' + qsign,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {},
      fail: function () { }
    })
  },
  // 跳转商品详情页
  detailspage: function (gid) {
    if (gid) {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + gid
      });
    };
  },
  // 跳转抽签
  limitlottery: function (res) {
    // if (this.signindata.isOpenToyShow) {
    //   wx.navigateTo({
    //     url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
    //   });
    // };
    wx.navigateTo({
      // url: "/page/component/pages/limitlottery/limitlottery"
      // url: "/page/component/pages/limitlotterylist/limitlotterylist"
      url: "/page/component/pages/ocamendment/ocamendment"
      // url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
    });
  },
  onLaunch: function (options) {
    var _this = this;
    if (wx.canIUse('getUpdateManager')) { // 获取小程序更新机制兼容
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {  // 请求完新版本信息的回调
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate() // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () { // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      wx.showModal({  // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    };

    // 适配苹果X
    wx.getSystemInfo({
      success: res => {
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1 || modelmes.search('iPhone XR') != -1) {
          _this.signindata.isIphoneX = true
        };
        _this.signindata.modelData = res.model;
        _this.signindata.systemData = res.system;
        _this.signindata.platformData = res.platform;
        _this.signindata.windowHeight = res.windowHeight;
        // 获取顶部高度
        wx.setStorageSync('statusBarHeightMc', res.statusBarHeight + 44 || 90);
        _this.signindata.statusBarHeightMc = res.statusBarHeight + 44 || 90
        // 判断订阅是否支持
        const version = wx.getSystemInfoSync().SDKVersion
        if (_this.compareVersion(version, '2.8.2') >= 0) {
          _this.signindata.subscribeif = true
        };
        // 判断是ios还是Android  iftriosorand
        if (res.platform == "devtools") {
          _this.signindata.iftriosorand = true;
        } else if (res.platform == "ios") {
          _this.signindata.iftriosorand = true;
        } else if (res.platform == "android") {
          _this.signindata.iftriosorand = false;
        }
      }
    });

  },
  // 判断订阅是否支持
  compareVersion: function (v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
      v1.push('0')
    };
    while (v2.length < len) {
      v2.push('0')
    };
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  // 用户统计   接口1
  // 1.进入小程序未授权的  接口1
  // 2.唤起你自己写的授权界面  接口2(type = 1)
  // 3.点击你自己写的授权界面确认按钮的 接口2(type = 2)
  // 4.唤起微信授权界面  接口2(type = 3)
  // 5.点击微信授权界面的确认按钮接口2(type = 4)

  // 1  splashscreen  开屏
  // 2  index  首页列表
  // 3  shoppingCart 购物车
  // 4  wode  我的页面
  // 5  activitydetailspage  活动详情页
  // 1000 活动分享统计
  // 1001 活动报名二维码统计
  // 1002 活动晒单二维码统计


  // 6  combinationdetail  组合详情页
  // 7  detailspage  商品详情页
  // 8  imdetailspage  商品兑换详情页
  // 9  information  信息页面
  // 10  invitingfriends  邀请页面
  // 11  redenvelopes   红包页面
  // 12  redenvelopesdetails 红包详情页
  // 14  signin 登录页面
  // 16  storehomepage 店铺页面
  // 17  streasurylist 金库排行榜
  // 19  getjigsaw 拼图
  // 20  bargainDetail 砍价
  // 21  hidefun 0元购
  // 22  signinpage 签到
  // 23  turntable 转盘
  // 24  rotaryrecord 转盘奖品列表
  // 25  mingbox 明盒
  // 29  limitlottery 抽签
  // 30  smokebox 抽盒机
  // 31  guessbox 猜盒
  // 32  myothertoydg 我的玩具柜
  // 35  drivetohidehome 开车送隐藏 列表
  // 36  drivetohide 开车送隐藏详情
  // 37  新签到页面
  // 38  orderdetails 订单详情页
  // 39  品牌详情
  // 40  展会福利
  // 41  抽盒机红包进入
  // 42  展会列表
  userstatistics: function (num) {
    var _this = this;
    var num = num || 0
    var abc = Dec.Aese('mod=regist&operation=init&model_id=' + num + '&model=' + _this.signindata.modelData + '&system=' + _this.signindata.systemData + '&platform=' + _this.signindata.platformData + '&type=' + _this.signindata.typeNum);
    wx.request({
      url: _this.signindata.comurl + 'statistics.php' + abc,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.signindata.token = res.data.Info.token || ''
        };
      },
      fail: function () { }
    });
  },
  // 授权
  clicktga: function (num) {
    var _this = this;
    var num = num || 1;
    var abcd = Dec.Aese('mod=regist&operation=dot&type=' + num + '&token=' + _this.signindata.token + '&model=' + _this.signindata.modelData + '&system=' + _this.signindata.systemData + '&platform=' + _this.signindata.platformData);
    wx.request({
      url: _this.signindata.comurl + 'statistics.php' + abcd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { },
      fail: function () { }
    });
  },
  globalData: {
    userInfo: null
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname, imgurl) {
    if (item_type == 0) {
      var url = encodeURIComponent(whref);
      var encodeimgurl = encodeURIComponent(imgurl);
      wx.navigateTo({    // 外部链接
        url: "/page/component/pages/webview/webview?webview=" + url + "&imgurl=" + encodeimgurl,
      }); 
    } else if (item_type == 1) {
      wx.navigateTo({    // 商品详情页
        url: "/pages/detailspage/detailspage?gid=" + whref,
      });
    } else if (item_type == 9003) {
      wx.navigateTo({    // 抽签详情页
        url: "/page/component/pages/limitlottery/limitlottery?gid=" + whref,
      });
    } else if (item_type == 9004) {
      wx.navigateTo({    // 拆明盒详情页
        url: "/page/component/pages/mingbox/mingbox?gid="+ whref,
      });
    } else if (item_type ==9005) {
      wx.navigateTo({    // 抽盒机详情页
        url: "/pages/smokebox/smokebox?gid=" + whref,
      });
    } else if (item_type == 2 || item_type == 3 || item_type == 21) {
      wx.navigateTo({    // 信息流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname,
      });
    } else if (item_type == 4 || item_type == 5 || item_type==22) {
      wx.navigateTo({    // 瀑布流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname,
      });     
    } else if (item_type == 6 || item_type == 7) {
      wx.redirectTo({    // 活动列表
        url: "/pages/activitysharinglist/activitysharinglist",
      });
    } else if (item_type == 8) {
      wx.navigateTo({    // 活动详情页
        url: "/pages/activitydetailspage/activitydetailspage?id=" + whref,
      });    
    } else if (item_type == 9) {
      wx.navigateTo({ 
        url: "/page/component/pages/newsignin/newsignin",
      });  
    } else if (item_type == 9002){
      var imgurl = encodeURIComponent(whref)
      wx.navigateTo({   
        url: "/page/component/pages/savethepicture/savethepicture?imgurl=" + imgurl,
      });      
    } else if (item_type == 12) {
      wx.navigateTo({   
        url: "/pages/combination/combination",
      });
    } else if (item_type == 9003) {
      wx.navigateTo({
        url: "/pages/combination/combination",
      }); 
    } else if (item_type == 9004) {
      wx.navigateTo({
        url: "/pages/activitysharinglist/activitysharinglist",
      }); 
    } else if (item_type == 9005) {
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?" + whref,
      });  
    } else if (item_type == 998) {
      wx.reLaunch({ 
        url: "/pages/index/index?judgeprof=2",
      });
    } else if (item_type == 995) {
      wx.navigateTo({ 
        url: "/page/component/pages/luckaction/luckaction"
      });
    } else if (item_type == 994) {
      wx.navigateTo({
        url: "/page/component/pages/turntable/turntable"
      });
    } else if (item_type == 993) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=6"
      });
    } else if (item_type == 991) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=9",
      });
    } else if (item_type == 990) {
      wx.navigateTo({
        url: "/page/component/pages/mingboxList/mingboxList",
      });
    } else if (item_type == 989) {
      wx.navigateTo({
        url: "/page/component/pages/limitlotterylist/limitlotterylist",
      });
    } else if (item_type == 988) {
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist",
      });
    } else if (item_type == 992) {
      wx.navigateTo({
        url: "/page/component/pages/bargainList/bargainList",
      }); 
    } else if (item_type == 9006) {
      wx.navigateTo({
        url: "/page/component/pages/ocamendment/ocamendment",
      });
    } else if (item_type == 9007) {
      wx.navigateTo({
        url: "/page/component/pages/doubleEleven/doubleEleven",
      });
    } else if (item_type == 9008) {
      wx.navigateTo({
        url: "/page/component/pages/drivetohidehome/drivetohidehome",
      });
    };

  },
  // 中奖提示倒计时
  winningtheprizetime: function (_this) {
    var _this = _this;
    if (_this.data.awardOrder && _this.data.awardOrder.Info && _this.data.awardOrder.Info.overtime) {
      var clock = _this.data.awardOrder.Info.overtime;
      _this.data.wintheprtinterval = setInterval(function () {
        //将时间传如 调用 
        var timestamp = Date.parse(new Date())
        //总的秒数 
        var second = clock - (timestamp / 1000);
        if (second > 0) {
          // 天位    
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          if (dayStr.length == 1) dayStr = '0' + dayStr;
          // 小时位 
          var hr = Math.floor(second / 3600 % 24);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;
          // 分钟位  
          var min = Math.floor(second / 60 % 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;
          // 秒位  
          var sec = Math.floor(second % 60);
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;
          if (day == 0) {
            var h = hrStr + " : " + minStr + " : " + secStr;
          } else {
            var h = dayStr + " 天 " + hrStr + " : " + minStr + " : " + secStr;
          }
          _this.setData({ //正常倒计时        
            winningovertime: h
          });
        } else {
          clearInterval(_this.data.wintheprtinterval);
          _this.setData({ isAwardOrder: false });
        };
      }.bind(_this), 1000);
    };
  },
  jumporder(_this) {
    var _this = _this;
    setTimeout(function () {
      var awardOrder = _this.data.awardOrder || {};
      if (awardOrder.Info) {
        if (awardOrder.Info.url) {
          wx.navigateTo({
            url: awardOrder.Info.url
          });
        } else {
          wx.navigateTo({
            url: "/pages/myorder/myorder?tabnum=" + 0
          });
        };
      } else {
        wx.navigateTo({
          url: "/pages/myorder/myorder?tabnum=" + 0
        });
      };
    }, 100);
  },
  // 统计推送进入
  pushfun: function (_this) {
    var _this = _this;
    var app = this;
    var pushway = Dec.Aese('mod=click&operation=xcxpush&uid=' + _this.data.uid + '&pushWay=' + _this.data.pushWay);
    wx.request({
      url: app.signindata.comurl + 'statistics.php' + pushway,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { }
    });
  },
  // 订阅统计
  subscribefun: function (_this, num, template_id, subscribe_type) {
    var _this = _this;
    var app = this;
    var subscribedata = _this.data.subscribedata || '';
    if (num == 1) {
      var subscribe_id = 0;
    } else {
      var subscribe_id = _this.data.id
    };
    var q1 = Dec.Aese('mod=subscribe&operation=accept&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&subscribe_type=' + subscribe_type + '&template_id=' + template_id + '&subscribe_id=' + subscribe_id);
    wx.request({
      url: app.signindata.comurl + 'statistics.php' + q1,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { }
    });
  },
  comsubscribe: function (_this) {
    var _this = _this;
    var that = this;
    var subscribedata = _this.data.subscribedata || '';
    if (this.signindata.subscribeif && subscribedata && subscribedata.template_id) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                that.subscribefun(_this, 1, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              that.subscribefun(_this, 1, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
        })
      };
    };
  },
  // 倒计时
  countdowntime: function (_this, cdtime) {
    var _this = _this;
    var that = this;
    clearInterval(_this.data.countdowntime);
    var countdowntime = function () {
      var totalSecond = parseInt(cdtime) - Date.parse(new Date()) / 1000;
      // 秒数  
      var second = totalSecond;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      if (dayStr == '00') {
        _this.setData({
          // percountdown: { dayStr: dayStr, hrStr: hrStr, minStr: minStr, secStr: secStr },
          percountdown: hrStr + ':' + minStr + ':' + secStr,
        });
      } else {
        _this.setData({
          // percountdown: { dayStr: dayStr, hrStr: hrStr, minStr: minStr, secStr: secStr },
          percountdown: hrStr + ':' + minStr + ':' + secStr
        });
      }
      totalSecond--;
      if (totalSecond < 0) {
        // 从新调取数据
        clearInterval(_this.data.countdowntime);
        that.signindata.perspcardata = '';
        _this.setData({
          perspcardiftrmin: false
        });
        _this.setData({
          percountdown: '00:00:00',
        });
      }
    };
    _this.data.countdowntime = setInterval(countdowntime, 1000);
  },
  // 中奖分享canvas图片抽盒机商品数据
  activityblindboxfun: function (_this) {
    var _this = _this;
    var app = this;
    var sharedata = Dec.Aese('mod=spread&operation=getActivity&type=2');
    wx.request({
      url: app.signindata.comurl + 'model.php' + sharedata,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          if (res.data.List && res.data.List.activity && res.data.List.activity.blindbox) {
            _this.data.activityblindbox = res.data.List.activity.blindbox;
            app.signindata.activityblindbox = res.data.List.activity.blindbox
          };
        };
      }
    });
  },
  // 云统计
  cloudstatistics: function (tablename,data){
    // wx.cloud.init() // 引入云
    // var _this = this;
    // if(wx.cloud){
    //   wx.cloud.init({ traceUser: true })
    //   var edition = { 'uid': _this.signindata.uid || 0, 'timestamp': Date.parse(new Date()) };
    //   if (data != '') {
    //     var data = JSON.parse((JSON.stringify(edition) + JSON.stringify(data)).replace(/}{/, ','));
    //   } else { var data = edition; };
    //   const db = wx.cloud.database();
    //   db.collection(tablename).add({ data: data }).then(res => { });
    // }
  },
  // 展会跳转
  exhibitionpubjump: function (item_type, jumpid) {
    if (item_type == 0 || item_type == 9002) {
      var url = encodeURIComponent(jumpid);
      wx.navigateTo({ // 外部链接
        url: "/page/component/pages/webview/webview?webview=" + url
      });
    } else if (item_type == 1) {
      wx.navigateTo({ // 商品详情页
        url: "/pages/detailspage/detailspage?gid=" + jumpid
      });
    } else if (item_type == 9003) {
      wx.navigateTo({ // 抽签详情页
        url: "/page/component/pages/limitlottery/limitlottery?gid=" + jumpid
      });
    } else if (item_type == 9004) {
      wx.navigateTo({ // 拆明盒详情页
        url: "/page/component/pages/mingbox/mingbox?gid=" + jumpid
      });
    } else if (item_type == 9005) {
      wx.navigateTo({ // 抽盒机详情页
        url: "/pages/smokebox/smokebox?gid=" + jumpid
      });
    } else if (item_type == 6 || item_type == 7) {
      wx.redirectTo({ // 活动列表
        url: "/pages/activitysharinglist/activitysharinglist"
      });
    } else if (item_type == 8) {
      wx.navigateTo({ // 活动详情页
        url: "/pages/activitydetailspage/activitydetailspage?id=" + jumpid
      });
    } else if (item_type == 9) {
      wx.navigateTo({
        url: "/page/component/pages/newsignin/newsignin"
      });
    } else if (item_type == 12) {
      wx.navigateTo({
        url: "/pages/combination/combination"
      });
    }  else if (item_type == 998) {
      wx.reLaunch({ //签到
        url: "/pages/index/index?judgeprof=2"
      });
    } else if (item_type == 995) {
      wx.navigateTo({ //活动
        url: "/page/component/pages/luckaction/luckaction"
      });
    } else if (item_type == 994) {
      wx.navigateTo({
        url: "/page/component/pages/turntable/turntable"
      });
    } else if (item_type == 993) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=6"
      });
    } else if (item_type == 991) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=9"
      });
    } else if (item_type == 990) {
      wx.navigateTo({
        url: "/page/component/pages/mingboxList/mingboxList"
      });
    } else if (item_type == 989) {
      wx.navigateTo({
        url: "/page/component/pages/limitlotterylist/limitlotterylist"
      });
    } else if (item_type == 988) {
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist"
      });
    } else if (item_type == 992) {
      wx.navigateTo({
        url: "/page/component/pages/bargainList/bargainList"
      });
    } else if (item_type == 9006) {
      wx.navigateTo({
        url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + jumpid
      });
    } else if (item_type == 9007) {
      wx.navigateTo({
        url: "/page/component/pages/doubleEleven/doubleEleven",
      });
    } else if (item_type == 9008) {
      wx.navigateTo({
        url: "/page/component/pages/exhibitionwelfare/exhibitionwelfare"
      });
    } else if (item_type == 9009  || item_type == 9010) {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + jumpid
      });
    };
  },

  //展会页面下面推荐列表的跳转
  jumpexhdetail: function (mtype,id,brandId) {
    var _this = this;
    if (mtype == 1) { // 免单 
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?id=" + id,
      });
    } else if (mtype == 4) { // 抽签
      wx.navigateTo({
        url: "/page/component/pages/limitlottery/limitlottery?id=" + id+'&brandId='+brandId,
      });
    } else if (mtype == 5) { //抽盒机
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + id,
      });
    } else if (mtype == 11) { // 限时抢购
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + id
      });
    } else if (mtype == 12) { //品牌福袋
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + id
      });
    } else if (mtype == 14) { //设计师展示
      wx.navigateTo({
        url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + id
      });
    } else if (mtype == 8) { //设计师展示
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + id,
      });
    } else if (mtype == 9) {
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibitionwelfare/exhibitionwelfare",
      });
    }
  },
  // 直播
  livebroadcast: function (_this, brandId){
    var _this = _this;
    var app = this;
    var that = this;
    var statistics = Dec.Aese('mod=show&operation=liveShow&brandId=' + brandId);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + statistics,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('直播=============',res)
        var list = res.data.List||[];
        for(var i=0;i<list.length;i++){
          list[i].start_time = that.toDatehd(list[i].start_time);
        };
        _this.setData({livebroadcast:list||[]})
      }
    });
  },
  //时间戳转换时间  
  toDatehd: function (number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    if (new Date(number * 1000).toDateString() === new Date().toDateString()) {
      return h + ':' + m;
    } else {
      return M + '.' + D + ' ' + h + ':' + m;
    }
  },
  showToastC:function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      mask:true,
      duration:2000
    });    
  }
})


//  index 首页
//  wode 我的
//  personaldata 个人资料
//  modifythenickname 修改昵称
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
//  storehomepage 店主首页  XXX的解优杂货铺  小C
//  sputforward 我的小金库 提现
//  sbestpartner 最佳合伙人
//  streasurylist  金库排行榜
//  soviceguidance  店铺新手引导
//  invitingfriends  邀请好友 and 邀请拆单
//  shopsquare 解优广场


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
//  ocamcart  闲置潮玩列表购物车
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

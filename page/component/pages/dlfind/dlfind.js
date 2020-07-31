var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    shopnum: 0,
    // tab  0为热门 1为关注
    cat_id: '',
    // 话题id
    topic_id: 0,
    dlfhboteve: [],
    listdata: [],
    page: 1, 
    // 加载提示
    loadprompt: '加载更多.....',
    // 公共默认信息
    defaultinformation: '',
    appNowTime: Date.parse(new Date()),
    nodataiftr: false,
    videoContext: '',
    isProduce: app.signindata.isProduce,
    // 是否开启了分享功能
    isShareFun: true,
    // 拆币数量
    currency_sum: 0,
    // 说明弹框
    dlhintiftr: false,
    hinttxt: '',
    userhead: '',
    iftrputfor: true,
    // 欧气晒单
    qudrying: [],
    // 拆币兑换
    currencyList: [],
    // 隐藏返现广告
    adbanner: [],
    // 隐藏返现数据
    moneyback: [],
    c_title: '发现',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    isExchange: 1,
    exchangeTips: '',
    inputbox: false,
    inputboxheight: 0,
    textconcent: '',
    drying_idnotice: 0,
    commentNumber: 0,
    noticeind: 0,
    windowHeight: app.signindata.windowHeight - 65 - wx.getStorageSync('statusBarHeightMc') || 0,
    signinlayer: false,
    currentSwiper: 0,
    eldataclass:[],
    eldatalist:[],
    mctslist:[],
    brand_name:'',
    elsearch:false,
    brand_id:0,
    id:'',
    subscribedata:[],
    isOpenToyShow:false
  },
  // 跳转打卡
  jumpshopqueque:function(){
    wx.navigateTo({
      url: "../../../../pages/shopsquare/shopsquare",
    }); 
  },
  // 跳转商品详情
  jumpshopdetail:function(w){
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;
    wx.navigateTo({
      url: "../../../../pages/detailspage/detailspage?gid=" + goods_id,
    }); 
  },
  subscrfundom:function(w){
    var _this = this;
    var eldatalist = _this.data.eldatalist;
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    console.log(1,eldatalist[index].goodsInfo[num])
    if(eldatalist&&eldatalist[index]&&eldatalist[index].goodsInfo&&eldatalist[index].goodsInfo[num]){
      _this.setData({
        id:eldatalist[index].goodsInfo[num].id,
        subscribedata:eldatalist[index].goodsInfo[num].toyShowSubscribe
      })
      _this.subscrfunstar()
    }

  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    console.log(2,subscribedata)
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
          complete() {}
        })
      };
    };
  },

  jumpexhdetail: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?type=drying&id=" + id
    });
  },
  jumpsouchtem:function(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    this.setData({
      brand_id: id||0,
    })
    this.jumpsearch();
  },
  elsearchfun:function(){
    this.setData({ elsearch: !this.data.elsearch});
  },
  onFocus: function (w) {
    this.setData({
      brand_name:""
    });
  },
  jumpsearch:function(){
    this.eldatalistfun(0);
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      brand_name: e.detail.value
    });
  },
  changeGoodsSwip: function (detail) {
    this.setData({
      currentSwiper: detail.detail.current
    })
  },

  //监听input获得焦点
  bindfocus: function(e) {
    let that = this;
    that.setData({
      inputboxheight: e.detail.height || 200
    })
  },
  //监听input值改变
  bindinput: function(e) {
    this.setData({
      textconcent: e.detail.value,
    });
  },
  // 失去焦点
  bindblur: function() {
    this.setData({
      inputboxheight: 0,
      autofocus: false
    })
  },
  // 提交评论
  submissionfun: function() {
    var _this = this;
    _this.setData({
      autofocus: false
    });
    _this.setData({
      inputbox: false,
      autofocus: false
    });
    Pub.postRequest(_this, 'addcomment', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      drying_id: _this.data.drying_idnotice,
      content: _this.data.textconcent
    }, function(res) {
      var listdata = _this.data.listdata || [];
      var drying_idnotice = _this.data.drying_idnotice || '';
      var noticeind = _this.data.noticeind || 0;
      _this.setData({
        textconcent: '',
        inputboxheight: 0,
        autofocus: false
      });
      wx.showModal({
        content: '评论成功,内容待审核',
        showCancel: false,
        success: function(res) {}
      });
    });
  },

  // 话题切换
  topicidfun: function(w) {
    var topic_id = w.currentTarget.dataset.topic_id || w.target.dataset.topic_id || 0;
    this.setData({
      topic_id: topic_id
    });
    this.listdata(0);
  },
  // tab 切换
  daltabhfun: function(w) {
    var tab = w.currentTarget.dataset.tab || w.target.dataset.tab || 0;
    this.setData({
      cat_id: tab
    });
    if (tab==2){
      this.eldatalistfun(0);
      this.eldataclassfun();
    }else{
      this.listdata(0);
    }
  },
  // 品牌列表
  eldataclassfun:function(){
    var _this = this;
    var qqq = Dec.Aese('mod=Obtain&operation=brandList&type=1');
    wx.request({
      url: app.signindata.comurl + 'brandDrying.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            eldataclass: res.data.List.brandList
          });
        };
      }
    });
  },
  // 品牌社区列表
  eldatalistfun: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({
        loadprompt: '加载更多.....',
        eldatalist: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        nodataiftr: false,
      });
    };
    Pub.postRequest(_this, 'dryinglist', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      cat_id: _this.data.cat_id,
      brand_name: _this.data.brand_name||'',
      brand_id: _this.data.brand_id || 0,
      page: _this.data.page
    }, function (res) {
      console.log(res);
      var listdata = res.data.List|| [];
      if(listdata.length!=0){
        if (num == 0) {
          _this.setData({
            eldatalist: listdata,
            nodataiftr: true
          });
        } else {
          var ltlist = _this.data.eldatalist.concat(listdata);
          _this.setData({
            eldatalist: ltlist,
            nodataiftr: true
          });
        };
      }else{
        app.showToastC('暂无更多数据');
      }
 
    });
  },  
  // mcts列表
  mctslistfun(num){
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({
        loadprompt: '加载更多.....',
        mctslist: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        nodataiftr: false,
      });
    };
    Pub.postRequest(_this, 'dryinglist', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      cat_id: _this.data.cat_id,
      brand_name: _this.data.brand_name||'',
      brand_id: _this.data.brand_id || 0,
      page: _this.data.page
    }, function (res) {
      console.log(res);
      var listdata = res.data.List|| [];
      if(listdata.length!=0){
        if (num == 0) {
          _this.setData({
            eldatalist: listdata,
            nodataiftr: true
          });
        } else {
          var ltlist = _this.data.eldatalist.concat(listdata);
          _this.setData({
            eldatalist: ltlist,
            nodataiftr: true
          });
        };
      }else{
        app.showToastC('暂无更多数据');
      }
 
    });
  },
  // 关注函数
  followfun: function(w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    var is_follow = w.currentTarget.dataset.is_follow || w.target.dataset.is_follow || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var _this = this;
    Pub.postRequest(_this, 'focuonusers', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      drying_uid: drying_id,
      is_follow: is_follow
    }, function(res) {
      app.showToastC('关注成功');
      if (_this.data.cat_id == 2) {
        var eldatalist = _this.data.eldatalist;
        eldatalist[ind].is_follow = 1;
        _this.setData({
          eldatalist: eldatalist
        })
      } else {
        var listdata = _this.data.listdata;
        listdata[ind].is_follow = 1;
        _this.setData({
          listdata: listdata
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      user_id: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      topic_id: options.topic_id || 0
    });
    if(app.signindata.sceneValue==1154){
        app.signindata.isProduce = true;  
        _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            _this.setData({
              signinlayer: true,
              loginid: app.signindata.loginid,
              uid: app.signindata.uid,
              openid: app.signindata.openid,
              isShareFun: app.signindata.isShareFun
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            this.setData({
              signinlayer: false,
            })
            _this.onLoadfun();
          }
        }
      });
    };
  },

  clicktganone: function() {
    this.setData({
      tgabox: false
    })
  },
  userInfoHandler: function(e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            tgabox: false,
            signinlayer: true,
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              isShareFun: app.signindata.isShareFun
            });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          };
        } else {
          _this.setData({
            tgabox: true
          });
        }
      }
    });
    if (e.detail.detail.userInfo) {} else {
      app.clicktga(8) //用户按了拒绝按钮
    };
  },


  onLoadfun: function() {
    var _this = this;

    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      user_id: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      isShareFun: app.signindata.isShareFun,
      // isOpenToyShow:true
      isOpenToyShow:app.signindata.isOpenToyShow
    });

    if(app.signindata.isOpenToyShow){
      _this.setData({c_title:'MCTS打卡',cat_id:3});
    }else{
      _this.setData({cat_id:2});
    };

    // 晒单分类
    Pub.postRequest(_this, 'topicclass', {
      uid: _this.data.uid,
      loginid: _this.data.loginid
    }, function(res) {
      var dlfhboteve = res.data.List || [];
      var dlinfo = res.data.Info.Explain || '';
      var userhead = res.data.Info.UserHead || app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
      if (res.data.Info) {
        var currency_sum = res.data.Info.currency_sum || 0;
        var isExchange = res.data.Info.isExchange;
        var exchangeTips = res.data.Info.exchangeTips || '';
        var commentNumber = res.data.Info.commentNumber || 0;
        _this.setData({
          currency_sum: currency_sum,
          isExchange: isExchange,
          exchangeTips: exchangeTips,
          commentNumber: commentNumber
        });
      };
      _this.setData({
        dlfhboteve: dlfhboteve,
        hinttxt: dlinfo,
        userhead: userhead
      })
    });

    // 官方推荐
    // Pub.postRequest(_this, 'currencyExchange', {
    //   uid: _this.data.uid,
    //   loginid: _this.data.loginid
    // }, function(res) {
    //   var qudrying = res.data.List.Oudrying || [];
    //   var currencyList = res.data.List.currencyList || [];
    //   var adbanner = res.data.List.AdvertisingMapInfo || [];
    //   var moneyback = res.data.List.MoneyBack || [];
    //   _this.setData({
    //     qudrying: qudrying,
    //     currencyList: currencyList,
    //     adbanner: adbanner,
    //     moneyback: moneyback
    //   })
    // });

    // 晒单列表
    if (this.data.cat_id == 2) {
      _this.eldatalistfun(0);
      _this.eldataclassfun();
    }else if(this.data.cat_id == 3) {
      _this.mctslistfun(0);
    } else {
      _this.listdata(0);
    }
    
    this.selectComponent("#hide").getappData();
    _this.otherdata();

  },
  otherdata: function() {
    var _this = this;
    var qqq = Dec.Aese('operation=info&mod=info');
    // 获取默认信息
    wx.request({
      url: app.signindata.comurl + 'general.php' + qqq,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if (res.data.ReturnCode == 200) {
          _this.setData({
            defaultinformation: res.data.Info,
            wxnum: res.data.Info.cs.wxid || 'meichai666666',
          });
          app.signindata.defaultinformation = res.data.Info || '';
        };
      }
    });
    // 购物车数量显示
    Dec.shopnum(_this,app.signindata.comurl);
    setTimeout(function() {
      wx.getUserInfo({
        success: function(res) {
          // 下载用户头像
          wx.downloadFile({
            url: res.userInfo.avatarUrl,
            success(res) {
              const fs = wx.getFileSystemManager();
              fs.saveFile({
                tempFilePath: res.tempFilePath,
                success(res) {
                  wx.setStorageSync('image_cache', res.savedFilePath)
                }
              });
            },
            fail: function(err) {
              wx.setStorageSync('image_cache', '')
            }
          });
        }
      });
    }, 1000)
  },
  // 晒单列表
  listdata: function(num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({
        loadprompt: '加载更多.....',
        appNowTime: Date.parse(new Date()),
        listdata: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        nodataiftr: false,
        appNowTime: Date.parse(new Date())
      });
    };
    Pub.postRequest(_this, 'dryinglist', {
      uid: _this.data.uid,
      loginid: _this.data.loginid,
      page: _this.data.page,
      cat_id: _this.data.cat_id,
      topic_id: _this.data.topic_id
    }, function(res) {
      var listdata = res.data.List || [];
      if (listdata.length != 0) {
        for (var i = 0; i < listdata.length; i++) {
          listdata[i].iftrvideo = false;
          listdata[i].iftrtip = true;
        };
        if (num == 0) {
          _this.setData({
            listdata: listdata,
            nodataiftr: true
          });
        } else {
          var ltlist = _this.data.listdata.concat(listdata);
          _this.setData({
            listdata: ltlist,
            nodataiftr: true
          });
        };
      } else {
        if (num == 0) {
          _this.setData({
            listdata: [],
            nodataiftr: true
          });
        };
        _this.setData({
          loadprompt: '没有更多数据了',
          nodataiftr: true
        });
      };
    });
  },
  onReady: function() {},

  onShow: function() {},

  onHide: function() {},

  onUnload: function() {},

  onPullDownRefresh: function() {
    if (this.data.cat_id==2) {
      this.eldatalistfun(0);
    } else if(this.data.cat_id == 3){
      this.mctslistfun(0);
    } else {
      this.listdata(0)
    }
  },

  onReachBottom: function() {
    if (this.data.cat_id == 2){
      this.eldatalistfun(1);
    }else if(this.data.cat_id == 3){
      this.mctslistfun(1);
    }else{
      this.listdata(1)
    };
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:_this.data.c_title || '潮玩社交平台',
      query:{}
    }
  },
  onShareAppMessage: function(options) {
    // 发现详情
    var _this = this;
    if (options.from == 'button') {
      var drying_id = options.target.dataset.drying_id;
      var currency_sum = options.target.dataset.currency_sum || '';
      var title = options.target.dataset.title
      var shareimg = options.target.dataset.shareimg || '';
      var topic_name = options.target.dataset.topic_name || '';
      if (currency_sum) {
        title = '拆币X' + currency_sum + ' ' + title;
      };
      if (topic_name) {
        title = topic_name + '#  ' + title;
      };

      if (shareimg) {
        if (shareimg.indexOf("https") < 0) {
          shareimg = shareimg.replace(/http/, 'https');
        };
      };
      Pub.postRequest(_this, 'dryingshare', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        drying_id: drying_id
      }, function(res) {});
      var reshare = {
        title: title || '我在美拆发现一个优质话题，你也快来看看吧!',
        path: 'page/component/pages/dlfinddetails/dlfinddetails?drying_id=' + drying_id,
        imageUrl: shareimg || Pub.dryinglistshare(),
        success: function(res) {},
      };
    } else {
      var reshare = {
        title: '我在美拆发现一个优质话题，你也快来看看吧!',
        path: 'page/component/pages/dlfind/dlfind',
        imageUrl: Pub.dryinglistshare(),
        success: function(res) {},
      };
    };
    return reshare
  },
  // 导航跳转 
  wnews: function() {
    var _this = this
    app.limitlottery(_this);
  },

  // 导航跳转
  whomepage: function() {
    wx.reLaunch({
      url: "../../../../pages/index/index?judgeprof=2"
    })
  },
  wmy: function() {
    wx.reLaunch({
      url: "../../../../pages/wode/wode"
    });
  },
  wshoppingCart: function() {
    wx.reLaunch({
      url: "../../../../pages/shoppingCart/shoppingCart"
    });
  },
  dlfindfun: function() {
    this.setData({
      cat_id: 0,
      topic_id: 0,
    });
    this.data.page = 1;
    this.listdata(0);
  },
  // 跳转详情
  jumpdlfdetail: function(w) {
    var drying_id = w.currentTarget.dataset.drying_id || w.target.dataset.drying_id || 0;
    wx.navigateTo({
      url: "../dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })

  },
  // 点赞
  ispraisefun: function(w) {
    var _this = this;
    var is_praise = w.currentTarget.dataset.is_praise || w.target.dataset.is_praise || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var lid = w.currentTarget.dataset.lid || w.target.dataset.lid || 0;
    if (_this.data.iftrputfor) {
      _this.data.iftrputfor = false;
      Pub.postRequest(_this, 'praiseDrying', {
        uid: _this.data.uid,
        loginid: _this.data.loginid,
        drying_id: lid,
        is_praise: is_praise
      }, function(res) {
        _this.data.iftrputfor = true;
        if (_this.data.cat_id==2){
          var eldatalist = _this.data.eldatalist;
          if (is_praise == 0) {
            eldatalist[ind].is_praise = 1;
            eldatalist[ind].praise_sum = parseInt(eldatalist[ind].praise_sum) + 1;
          } else {
            eldatalist[ind].is_praise = 0;
            eldatalist[ind].praise_sum = parseInt(eldatalist[ind].praise_sum) - 1;
          };          
          _this.setData({
            eldatalist: eldatalist
          })
        }else{
          var listdata = _this.data.listdata;
          if (is_praise == 0) {
            listdata[ind].is_praise = 1;
            listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) + 1;
          } else {
            listdata[ind].is_praise = 0;
            listdata[ind].praise_sum = parseInt(listdata[ind].praise_sum) - 1;
          };
          _this.setData({
            listdata: listdata
          });
        }

      });
    }
  },
  jumpdldlvreate: function() {
    wx.navigateTo({
      url: "../dldlcreate/dldlcreate",
    })
  },
  // 计算图片大小
  imageLoad: function(e) {
    var _this = this;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var ifvideo = e.currentTarget.dataset.ifvideo || e.target.dataset.ifvideo || 0;
    var _this = this;
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    if (ifvideo == 1) {
      var viewHeight = 384, //设置图片显示宽度，
        viewWidth = 384 * ratio;
    } else {
      var viewHeight = 500, //设置图片显示宽度，
        viewWidth = 500 * ratio;
    };
    var listdata = this.data.listdata;
    if (viewWidth > 680) {
      viewWidth = 680;
    };
    if (listdata[ind]) {
      listdata[ind].width = viewWidth;
      _this.setData({
        listdata: listdata
      })
    };
  },
  // 跳转主页
  jumpdlfchlimgdetail: function(w) {
    var _this = this;
    var uid = w.currentTarget.dataset.uid || e.target.dataset.uid || 0;
    var nick = w.currentTarget.dataset.nick || w.target.dataset.nick || '';
    if (_this.data.uid != uid) {
      wx.navigateTo({
        url: "/page/component/pages/dluserhomepage/dluserhomepage?uid=" + uid + "&nick=" + nick,
      });
    } else {
      wx.reLaunch({
        url: "/page/component/pages/dlpersonalhomepage/dlpersonalhomepage",
      });
    };
  },
  dlhintfun: function() {
    this.setData({
      dlhintiftr: !this.data.dlhintiftr
    });
  },
  // 计算图片大小
  imageLoadad: function(e) {
    var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
    var _this = this;
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 104, //设置图片显示宽度，
      viewWidth = 104 * ratio;
    var adbanner = this.data.adbanner;
    if (viewWidth > 680) {
      viewWidth = 680;
    };
    if (adbanner[num]) {
      _this.setData({
        ['adbanner['+num+'].width'] : viewWidth
      })
    };
  },
  jumpdlnotice: function() {
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/dlnotice/dlnotice"
    });
    _this.setData({
      commentNumber: 0
    });
  },

  pullupsignin: function() {
    // '没有授权'
    this.setData({
      tgabox: true
    });
  },


})
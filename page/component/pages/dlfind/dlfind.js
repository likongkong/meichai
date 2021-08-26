var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
var api = require("../../../../utils/api.js");
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
    cat_id: 3,
    // 话题id
    topic_id: 0,
    dlfhboteve: [],
    listdata: [],
    page: 0, 
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
    isOpenToyShow:false,
    isPunchTheClock:1596729599<Date.parse(new Date())/1000&&Date.parse(new Date())/1000<1596988799?true:false,
    wOri:1 , // 1 瀑布流 2 信息流
    testArr:[
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
      {n:'测试',i:'https://cdn.51chaidan.com/images/202001/thumb_img/33084_thumb_G_1578905575726.jpg'},
    ],
    payStatus:[
      {name:'推荐',num:'0'},
      {name:'我的关注',num:'1'},
      {name:'秒杀',num:'2'},
      {name:'抽选',num:'3'},
      {name:'动态',num:'4'},
      {name:'分享',num:'5'}
    ], // 支付状态 
    centerIndex:0,
    brandWhole:false
  },
  // 全部品牌
  brandWholeFun(){
    var _this = this;
    if(!this.data.brandWhole){
      this.brandWholeSeach()  
    };
    this.setData({brandWhole:!this.data.brandWhole});
     
  },
  brandWholeSeach(){
    var _this = this;
    console.log('mod=community&operation=allIps&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&searchValue='+_this.data.brand_name||'')
    var qqq = Dec.Aese('mod=community&operation=allIps&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&searchValue='+_this.data.brand_name||'');
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('全部品牌信息=====',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            brandwhole:res.data.List.brand || [], 
          });
        }else if(res.data.ReturnCode == 300){
          _this.setData({
            brandwhole: []
          });    
          app.showToastC('暂无更多数据')  
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  catchTouchMove:function(res){
    return false
  },
  // 瀑布流信息流切换
  wOriTab(){
    this.setData({
      wOri:(this.data.wOri == 1)?2:1
    })

    if (this.data.wOri==1){
      this.eldatalistfun(0);
      this.eldataclassfun();
    }else{
      this.listdata(0);
    }

  },

  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index || 0;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    })
    that.eldatalistfun(0)
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })
  }, 

  jumpVipPage(){
    wx.navigateTo({  
      url: "/page/secondpackge/pages/vipPage/vipPage"
    })
  },
  finishLoad(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    this.setData({
      ['mctslist[' + ind + '].finishLoadFlag']: true
    })
  },

  // 跳转商品详情
  jumpshopdetail:function(w){
    var goods_id = w.currentTarget.dataset.goods_id || 0;
    var isblindbox = w.currentTarget.dataset.isblindbox || 0;
    var is_calendar = w.currentTarget.dataset.is_calendar || 0;
    var openMember = w.currentTarget.dataset.openmember || false;
    if(is_calendar == 1){
      if(!openMember){
        wx.navigateTo({  
          url: "/page/secondpackge/pages/vipPage/vipPage"
        })
      }else{
        // 跳转日历
        wx.navigateTo({
          url: "/page/secondpackge/pages/calendarList/calendarList"
        }); 
      }
    } else if(isblindbox){
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + goods_id,
      });
    }else{
      wx.navigateTo({
        url: "../../../../pages/detailspage/detailspage?gid=" + goods_id,
      });
    };
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
      url: "/page/secondpackge/pages/brandDetails/brandDetails?type=drying&id=" + id+"&settlement=0"
    });
  },
  jumpsouchtem:function(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    // this.setData({
    //   brand_id: id||0,
    // })
    // this.jumpsearch();
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + id +"&settlement=1"
    });
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
    this.brandWholeSeach();
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
    var qqq = Dec.Aese('mod=community&operation=topInfo&uid='+_this.data.uid+'&loginid='+_this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('新品牌信息=====',res)
        if (res.data.ReturnCode == 200) {
          var salesCalendar = res.data.List.salesCalendar || [];
          _this.setData({
            visitHistory:res.data.List.visitHistory || [], // 最近访问的品牌信息
            salesCalendar: salesCalendar|| [], // 日历信息
            recommendIps:res.data.List.recommendIps || [], // 品牌
            brandSettledLimit:res.data.Info.brandSettledLimit || false
          });
        };
      }
    });
  },
  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
  },

  // 品牌社区列表
  eldatalistfun: function (num) {
    var _this = this;
    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        loadprompt: '加载更多.....',
        communityList: [],
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
    wx.showLoading({
      title: '加载中...',
      mask:true
    })

    var qqq = Dec.Aese('mod=community&operation=info&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&showType='+_this.data.centerIndex+'&pid='+ _this.data.page + '&brand_id=0');
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log('动态瀑布流数据=====',res)
        if (res.data.ReturnCode == 200) {
          var communityList = res.data.List.communityList || [];
          if(communityList.length != 0){
             communityList.forEach(element => {
                element.add_time = _this.toDate(element.add_time || 0);
                element.start_time = _this.toDate(element.start_time || 0);
                element.end_time = _this.toDate(element.end_time || 0);
             });
          }else{
            app.showToastC('暂无更多数据')
          }
          if (num == 0) {
            _this.setData({
              communityList,
              nodataiftr:true
            });
          } else {
            var ltlist = [..._this.data.communityList,...communityList];
            _this.setData({
              communityList: ltlist,
              nodataiftr:true
            });
          };
        };
      }
    });
  }, 

  // 打卡列表
  mctslistfun(num){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    if (num == 0) {
      _this.data.page = 1;
      _this.setData({
        mctslist: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        nodataiftr: false,
      });
    };

    wx.request({
      url: app.signindata.clwcomurl + 'api/brandClockin/index' + '?uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page=' + _this.data.page,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        console.log('打卡数据=======',res.data.List)
        var listdata = res.data.List|| [];
        if(listdata.length!=0){
          if (num == 0) {
            _this.setData({
              mctslist: listdata,
              nodataiftr: true
            });
          } else {
            var ltlist = _this.data.mctslist.concat(listdata);
            _this.setData({
              mctslist: ltlist,
              nodataiftr: true
            });
          };
        } else if(listdata.length==0&&_this.data.page==1){
          _this.setData({
            nodataiftr: true
          });
        } else{
          wx.showToast({
            title: '暂无更多数据',
            icon: 'none',
            duration: 1000
          })
        }
      }
    });
  },

  likeClick(e){
    var _this = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let mctslist = _this.data.mctslist;
    var support= mctslist[index].is_support;
    wx.request({
      url: app.signindata.clwcomurl + 'api/brandClockin/pushSupportForClockin' + '?uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id=' + id,
      method: 'GET',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        console.log('点赞=======',res.data)
        console.log('mctslist=======',_this.data.mctslist)
        console.log(support)
        if(support == 1){
          mctslist[index].support_num++;
          mctslist[index].is_support = 2;
        }else{
          mctslist[index].support_num--;
          mctslist[index].is_support = 1;
        }
        _this.setData({mctslist});
      }
    });
  },


  // 关注 和 点赞 函数
  followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var communityList = _this.data.communityList || [];
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('新品牌信息=====',res)
        if (res.data.ReturnCode == 200) {
          if(type == 0){
            _this.setData({
              ['communityList['+ind+'].is_attention']:true
            }); 
          }else{
            
            if(communityList[ind].is_like){
              var like_number = parseInt(communityList[ind].like_number) - 1  
            }else{
              var like_number = parseInt(communityList[ind].like_number) + 1 
            };
            if(like_number<0){
              like_number = 0;
            };
            _this.setData({
              ['communityList['+ind+'].like_number']:like_number,
              ['communityList['+ind+'].is_like']:!communityList[ind].is_like
            });
          }

        };
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
          if (true) {
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
        if (true) {
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
      defaultinformation:app.signindata.defaultinformation,
      isOpenToyShow:app.signindata.isOpenToyShow
    });
     
    // if(false){
    //   _this.setData({c_title:'MCTS打卡',cat_id:3});
    // }else{
    //   _this.setData({cat_id:2});
    // };

    // 晒单分类
    // Pub.postRequest(_this, 'topicclass', {
    //   uid: _this.data.uid,
    //   loginid: _this.data.loginid
    // }, function(res) {
    //   var dlfhboteve = res.data.List || [];
    //   var dlinfo = res.data.Info.Explain || '';
    //   var userhead = res.data.Info.UserHead || app.signindata.avatarUrl || 'https://static.51chaidan.com/images/headphoto/' + _this.data.uid + '.jpg';
    //   if (res.data.Info) {
    //     var currency_sum = res.data.Info.currency_sum || 0;
    //     var isExchange = res.data.Info.isExchange;
    //     var exchangeTips = res.data.Info.exchangeTips || '';
    //     var commentNumber = res.data.Info.commentNumber || 0;
    //     _this.setData({
    //       currency_sum: currency_sum,
    //       isExchange: isExchange,
    //       exchangeTips: exchangeTips,
    //       commentNumber: commentNumber
    //     });
    //   };
    //   _this.setData({
    //     dlfhboteve: dlfhboteve,
    //     hinttxt: dlinfo,
    //     userhead: userhead
    //   })
    // });

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



    _this.eldataclassfun();
    _this.eldatalistfun(0);

    // 晒单列表
    // if (this.data.cat_id == 2) {
      

    // }else if(this.data.cat_id == 3) {
    //   _this.mctslistfun(0);
    // } else {
    //   _this.listdata(0);
    // }
    
    // this.selectComponent("#hide").getappData();
    // _this.otherdata();

    setTimeout(function(){
      app.indexShareBanner();
    },1000);

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
      console.log('=======',res)
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
      if(res.data.Info){
          _this.setData({
            jurisdiction:res.data.Info.jurisdiction || false
          })
      }
    });
  },
  onReady: function() {},

  onShow: function() {},

  onHide: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  onUnload: function() {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  onPullDownRefresh: function() {
    app.downRefreshFun(() => {
      this.eldataclassfun()
      this.eldatalistfun(0);
    })
    
  },

  onReachBottom: function() {
    this.eldatalistfun(1);
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
      var is_calendar = options.target.dataset.is_calendar || 0;
      var drying_id = options.target.dataset.drying_id;
      var currency_sum = options.target.dataset.currency_sum || '';
      var shareimg = options.target.dataset.shareimg || '';
      var topic_name = options.target.dataset.topic_name || '';
      var pathUrl = '';
      var title = '';
      if(is_calendar == 1){
        title = '这个展会限量版日历太好看了，快来为Ta投票免费拿';
        pathUrl = 'page/secondpackge/pages/calendarList/calendarList?share_uid='+_this.data.uid;
      } else {
        title = options.target.dataset.title;
        if (currency_sum) {
          title = '拆币X' + currency_sum + ' ' + title;
        };
        if (topic_name) {
          title = topic_name + '#  ' + title;
        };
        pathUrl = 'page/component/pages/dlfinddetails/dlfinddetails?drying_id=' + drying_id;
        Pub.postRequest(_this, 'dryingshare', {
          uid: _this.data.uid,
          loginid: _this.data.loginid,
          drying_id: drying_id
        }, function(res) {});
      };



      if (shareimg) {
        if (shareimg.indexOf("https") < 0) {
          shareimg = shareimg.replace(/http/, 'https');
        };
      };
      var reshare = {
        title: title || app.signindata.communityTitleShare,
        path: pathUrl,
        imageUrl: shareimg || app.signindata.communityShareImg,
        success: function(res) {},
      };
    } else {
      var reshare = {
        title: app.signindata.communityTitleShare,
        path: 'page/component/pages/dlfind/dlfind',
        imageUrl: app.signindata.communityShareImg,
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
    var is_calendar = w.currentTarget.dataset.is_calendar || w.target.dataset.is_calendar || 0;
    if(is_calendar == 1){
      // 跳转日历
      wx.navigateTo({
        url: "/page/secondpackge/pages/calendarList/calendarList"
      }); 
    } else if(is_calendar == 2){
      // 展会购票
      wx.navigateTo({
        url: "/page/secondpackge/pages/buyingTickets/buyingTickets"
      }); 
    }else {
      wx.navigateTo({
        url: "../dlfinddetails/dlfinddetails?drying_id=" + drying_id,
      })
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
  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      type = 1;
    }else if(istype == 2){ // 抽选
      type = 9003;
    }else if(istype == 3){ // 动态
      type = 9036;
    }
    app.comjumpwxnav(type,id,'','');
    this.setData({
      isAddNewEventMask:false
    })
  },
  toggleAddNewEventMask(){
    this.setData({
      isAddNewEventMask: !this.data.isAddNewEventMask
    })
  },
  

})
var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    appNowTime: app.signindata.appNowTime,
    // 判断是ios或者android
    iftriosorand: app.signindata.iftriosorand,
    blackCity: app.signindata.blackCity, 
    // 适配苹果X
    isIphoneX: app.signindata.isIphoneX,
    windowHeight:app.signindata.windowHeight,
    // 商品默认图片
    defaultimg:'../images/goods_Item_Default_Image.png',
    movies: [],
    commoddata:[],
    // 分类数据
    classificationlist:[],
    // 页数
    page:0,
    // 购物车显示数据
    shopnum:0,
    // 授权弹框
    tgabox:false,
    // 赠送优惠券数据
    newcoupondata: [],
    // 节日主题
    newcoutitle:'新人礼包',
    // 赠送优惠券弹框是否显示
    newcoupon:false,
    // 限时购倒计时
    timer:'',
    // 判断活动弹框 1 弹 2 不弹
    judgeprof:1,
    // 瀑布流或者信息流
    item_type: 2,
    // 第一次加载不显示暂无数据
    nodataiftr:false,
    // 加载提示
    loadprompt:'加载更多.....',
    // 拆礼物传递参数
    clw:{mc:'mc'},
    scene:'',
    iftrjump:false,
    // 防止swiper卡住
    swiperError: 0,
    goodsIndex: 0,
    preIndex: 0, 
    //公告标题
    notice_title: "",
    //公告链接
    notice_url: "",
    //公告类型
    notice_type: "",
    dayStr: "",
    hrStr: "",
    minStr: "",
    secStr: "",
    defaultinformation: app.signindata.defaultinformation||'',
    jumpdevanningiftr:false,
    // 晒单数量
    dryinglistnum:0,
    isProduce: app.signindata.isProduce,
    npswtab:1, // 1 新品 2 热销
    indexelafra:false,
    elafradata:'',
    c_title: '美拆', // -正品折扣多一点
    c_arrow:false,
    c_backcolor:'#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    index_ela_fra: app.signindata.index_ela_fra,
    // 倒计时时间戳
    perspcardata: '',
    // 倒计时展示数据
    percountdown: '',
    // 倒计时
    countdowntime: '',
    perspcardiftrmin:false,
    automat: app.signindata.automat,
    automatTimes: 0,
    automattitle: '',
    isTodaySign:false,
    currentSwiper:0,
    islive:false,
    // 审核版本 or 不是审核版本
    is_formaldress:false,
  },
  // 临时展会授权
  togation:function(e){
    this.setData({
      tgabox:true
    })
  },  
  doubleEleven: function () {
    wx.navigateTo({
      url: "/page/component/pages/doubleEleven/doubleEleven"
    });
  },
  // 跳转抽盒机
  bblistfun: function () {
    wx.redirectTo({
      url: "/pages/smokeboxlist/smokeboxlist",
    });
  },
  indexelafrafun:function(){
    this.setData({ indexelafra: false, index_ela_fra:false});
    app.signindata.index_ela_fra = false;
  },
  npswtabfun:function(w){
    var npswnum = w.currentTarget.dataset.npswnum || w.target.dataset.npswnum||1;
    this.setData({npswtab: npswnum})
  },
  // 跳转活动详情页
  activitydetailspage: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    _this.setData({ jumpdevanningiftr:true});
    wx.navigateTo({
      url: "/pages/activitydetailspage/activitydetailspage?id=" + id,
      complete:function(){
        _this.setData({ jumpdevanningiftr:false});
      }
    });
  }, 
  //  大图跳转
  comindellistjump:function(w){
    var islist = w.currentTarget.dataset.islist || w.target.dataset.islist||0;
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var detail = w.currentTarget.dataset.detail || w.target.dataset.detail||0;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆';
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname, imgurl);
  },
  // 大图+列表
  imgcomindellistjump:function(w){ 
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;  
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || ''; 
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname, imgurl);
  },
  // 列表跳转
  imgcomindellistjumphuodong: function (w) {
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆';
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    if (item_type == 0) {
      wx.navigateTo({  
        url: "/pages/detailspage/detailspage?gid=" + gid,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9) {
      wx.navigateTo({ 
        url: "/pages/activitydetailspage/activitydetailspage?id=" + gid,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    };
  },
  // 阻止蒙层冒泡
  preventD(){ },   
  // banner 跳转
  jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || ''; 
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname, imgurl);
  },

  // 测试 
  jumpxinxi:function(){
    var _this = this;


    // wx.requestSubscribeMessage({
    //   tmplIds: ['Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0'],
    //   success(res) {
    //       if (res['Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0'] == "accept") {
    //         app.subscribefun(_this, 1, 'Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0', 1);
    //       };
    //   }
    // })
     wx.navigateTo({  
      // url: "/page/component/pages/doubleElevenexh/doubleElevenexh?specialsource=1"
      // url: "/page/component/pages/crowdfunding/crowdfunding?aid=75127"
      // url: "/page/component/pages/drivetohidelist/drivetohidelist"
      // url: "/pages/activitydetailspage/activitydetailspage?id=18376"
      // url: "/pages/activitydetailspage/activitydetailspage?id=18185"
      // url: "/page/component/pages/limitlottery/limitlottery?id=201425",
      // url: "/page/component/pages/drivetohidehome/drivetohidehome"
      // url: "/page/component/pages/exhibition/exhibition"
      // url: "/page/component/pages/exhibitiondetail/exhibitiondetail?id=43161"
      // url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
      // url: "/page/secondpackge/pages/brandDetails/brandDetails?id=140"
      // url: "/pages/detailspage/detailspage?gid=35283"
      // url: "/pages/smokebox/smokebox?gid=331671"
      // url: "/page/component/pages/playgrasslist/playgrasslist"
      // url: "/page/secondpackge/pages/detailSimgEffects/detailSimgEffects?gid=32852"
      // url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=105883"
      // url: "/page/secondpackge/pages/aRewardList/aRewardList"
      // url: "/page/component/pages/hidefun/hidefun"
      // url: "/pages/shopsquare/shopsquare"
      // url: "/pages/dismantlingbox/dismantlingbox"
      // url: "/page/secondpackge/pages/shopsquaretrip/shopsquaretrip"
      // url: "/pages/modifythenickname/modifythenickname"
      // url: "/page/secondpackge/pages/articleList/articleList"
      url: "/page/secondpackge/pages/calendarList/calendarList"
      // url: "/pages/sputforward/sputforward"
      // url: "/page/component/pages/limitlottery/limitlottery?id=201425",





    });
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname, imgurl){
    var imgurl = imgurl || '';
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });

    app.comjumpwxnav(item_type, whref, wname, imgurl)

    _this.setData({ jumpdevanningiftr: false, indexelafra: false, index_ela_fra:false });
    app.signindata.index_ela_fra = false;   
  },
  jumpdouble: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + id,
    });
  },

  // 分类跳转
  jumprecom:function(w){
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name||'';
    // 公共跳转
    this.comjumpwxnav(item_type,whref,wname);
  },
  //时间戳转换时间  
  toDate:function(number) {
    var date = new Date(number * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate()<10?'0'+date.getDate():date.getDate();
    var h = date.getHours()<10?'0'+date.getHours():date.getHours();
    var m = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    var s = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    if (new Date(number*1000).toDateString() === new Date().toDateString()) {
      return h+':'+m; 
    } else if (new Date(number*1000) < new Date()) {
      return   M+'-'+D;
    }    
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
      return M + '.' + D + ' ' + h + ':' + m ;
    }
  },  
  // 搜索跳转
  namefocus:function(){
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.navigateTo({
      url: "/page/component/pages/hotsearchvocabulary/hotsearchvocabulary",
      complete: function () { _this.setData({ jumpdevanningiftr: false }); }
    });

  },
  // 跳转详情页 
  addressmanagement: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.navigateTo({
      url: "/pages/detailspage/detailspage?gid=" + gid,
      complete: function () {
        _this.setData({ jumpdevanningiftr: false });
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 商品列表
  listdata:function(num){  // num=1 下拉 num=2 上拉
    var _this = this;   
    // 商品列表
    if(num==1){
      _this.data.page = 0;
      _this.setData({loadprompt: '加载更多.....', commoddata: [], nodataiftr:false});
      var q = Dec.Aese('mod=getinfo&operation=list&category_id=-1&uid=' + _this.data.uid+'&blackCity='+_this.data.blackCity);
    }else{
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({ loadprompt: '加载更多.....' });
      var q = Dec.Aese('mod=getinfo&operation=list&ltype=more&category_id=-1&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&blackCity=' + _this.data.blackCity);
    }; 
    wx.showLoading({ title: '加载中...',mask:true }) 
    console.log('page===========',_this.data.page)
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('列表===========',res)
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List||[];

          var zdyurl = _this.data.zdyurl || '';
          var regData = app.signindata.reg || /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/ ;

          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (arrlist[i].item_type == 992) {
                for (var li = 0; li < arrlist[i].List.length;li++){
                  if (arrlist[i].List[li]) {
                    arrlist[i].List[li].start_time = _this.toDatehd(arrlist[i].List[li].start_time)
                  };
                }
                _this.setData({islive:true})
              }

              if (arrlist[i].show_type == 2) {
                if (arrlist[i].img != '' && arrlist[i].img){
                  if (!regData.test(arrlist[i].img)) {
                    arrlist[i].img = zdyurl + arrlist[i].img;
                  };
                }else{
                  arrlist[i].img = _this.data.defaultimg;
                };
              } else if (arrlist[i].show_type == 3 || arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                if (arrlist[i].show_type == 3) {
                  if (arrlist[i].img != '' && arrlist[i].img){
                    if (!regData.test(arrlist[i].img)) {
                      arrlist[i].img = zdyurl + arrlist[i].img;
                    };
                  }else{
                    arrlist[i].img = _this.data.defaultimg;
                  };
                };
                if (arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                  if (!regData.test(arrlist[i].icon)) {
                    arrlist[i].icon = zdyurl + arrlist[i].icon;
                  };
                };
                if (arrlist[i].List){
                  for (var ar = 0; ar < arrlist[i].List.length; ar++) {
                    if (arrlist[i].List[ar].img != '' && arrlist[i].List[ar].img){
                      if (!regData.test(arrlist[i].List[ar].img)) {
                        arrlist[i].List[ar].img = zdyurl + arrlist[i].List[ar].img;
                      };
                    }else{
                      arrlist[i].List[ar].img = _this.data.defaultimg;
                    };
                  };
                }
              } else if (arrlist[i].show_type == 103){
                var goodsListdata = arrlist[i].goodsList||[];
                for (var q = 0; q < goodsListdata.length;q++){
                  if (!regData.test(goodsListdata[q].goods_cover)) {
                    goodsListdata[q].goods_cover = zdyurl + goodsListdata[q].goods_cover;
                  };
                };
                var arrpresentList = arrlist[i].presentList || [];
                if (arrpresentList) {
                  for (var v = 0; v < arrpresentList.length; v++) {
                    if (!regData.test(arrpresentList[v].goods_cover)) {
                      arrpresentList[v].goods_cover = zdyurl + arrpresentList[v].goods_cover;
                    };
                  };
                };
                if (!regData.test(arrlist[i].gcover)) {
                  arrlist[i].gcover = zdyurl + arrlist[i].gcover;
                };
              } else if (arrlist[i].show_type == 105) {
                var stop_time = arrlist[i].List[0].stop_time;
                setInterval(function () {
                  //   //将时间传如 调用 
                  _this.dateformat(stop_time);
                }.bind(_this), 1000);
              } else if (arrlist[i].show_type == 1) {
                if (!regData.test(arrlist[i].gcover)) {
                  arrlist[i].gcover = zdyurl + arrlist[i].gcover;
                }
                arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
              };
            };
            if (num == 1) {
              var comdataarr = arrlist||[];
            } else {
              var comdataarr = _this.data.commoddata.concat(arrlist);
            };
            _this.setData({
              commoddata: comdataarr,
              nodataiftr: true
            });
            // 限时购倒计时
            // _this.countdownbfun();
          } else {
            if (num == 1) {
              clearInterval(_this.data.timer);
              _this.setData({
                commoddata: [],
                nodataiftr: true
              });
            } else {
              app.showToastC('没有更多数据了');
              _this.setData({ loadprompt: '没有更多数据了', nodataiftr: true});
            };
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      },
      complete:function(){
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        wx.hideLoading()
      }
    }); 
  },
  onLoadfun: function (){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.data.blackCity = app.signindata.blackCity; 
    _this.data.perspcardata = app.signindata.perspcardata || '';
    if (_this.data.perspcardata) {
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    };
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation||'',
      index_ela_fra: app.signindata.index_ela_fra,
      automat: app.signindata.automat || { isOpen: false, times: 0 },
      automatTimes: app.signindata.automat.times,
      automattitle: app.signindata.automattitle || '',
      isTodaySign: app.signindata.isTodaySign,
      blindboxMoney:app.signindata.blindboxMoney||0
    }); 

    // 节日红包奖励
    var qqqqq = Dec.Aese('mod=coupon&operation=holiday&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);
    wx.request({
      url: app.signindata.comurl + 'user.php' + qqqqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        if (res.data.ReturnCode == 200) {
          if (res.data.Info) {
            _this.setData({
              newcoupon:true,
              newcoupondata: res.data.Info.List,
              newcoutitle: res.data.Info.title
            });
          };
        }else{
          _this.setData({
            newcoupon: false
          });
        };
      },
      fail: function () {}
    });
    setTimeout(function(){
      _this.otherdata();
      app.indexShareBanner();
    },1000);
    if (app.signindata.isAwardOrder) {
      _this.setData({ isAwardOrder: app.signindata.isAwardOrder, awardOrder: app.signindata.awardOrder || false });
      app.winningtheprizetime(_this);
    };

  },
  jumporder: function () {
    var _this = this;
    app.jumporder(_this);
  },
  otherdata:function(){
    var _this = this;
    // 抽盒金
    // if (_this.data.uid) {
    //   var gbm = Dec.Aese('mod=blindBox&operation=getBlindboxMoney&uid='+_this.data.uid);
    //   wx.request({
    //     url: app.signindata.comurl + 'spread.php' + gbm,
    //     method: 'GET',
    //     header: { 'Accept': 'application/json' },
    //     success: function (res) {
    //       if (res.data.ReturnCode == 200) {
    //         _this.setData({
    //           blindboxMoney: res.data.Info.blindbox_money || ""
    //         });
    //         app.signindata.blindboxMoney = res.data.Info.blindbox_money || ""
    //       };
    //     }
    //   })
    // }    
    if (_this.data.defaultinformation == '') {
      // 获取默认信息
      var qqq = Dec.Aese('operation=info&mod=info');
      wx.request({
        url: app.signindata.comurl + 'general.php' + qqq,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          if (res.data.ReturnCode == 200) {
            _this.setData({
              notice_title: res.data.Info.notice.title || "",
              defaultinformation: res.data.Info
            });
            _this.data.notice_url = res.data.Info.notice.url || "";
            _this.data.notice_type = res.data.Info.notice.type || "";
            app.signindata.defaultinformation = res.data.Info || '';
          };
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        }
      })
    } else {
      _this.setData({
        notice_title: _this.data.defaultinformation.notice.title || "",
      });
      _this.data.notice_url = _this.data.defaultinformation.notice.url || "";
      _this.data.notice_type = _this.data.defaultinformation.notice.type || "";
    };
    // 购物车数据显示
    Dec.shopnum(_this,app.signindata.comurl);
    // 调取晒单数量
    Dec.dryingSum(_this, app.signindata.clwcomurl);
    //调取搜索关键词跳转对应列表数据
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/searchNavi.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('搜索关键词跳转对应列表数据======',res.data)
        app.signindata.searchSkipKeyword = res.data;
      }
    })
    //调取热门搜索关键词
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/searchPlaceholder.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('热门搜索关键词数据======',res.data)
        app.signindata.hotKeyword = res.data;
      }
    })



  },
  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();
    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
  },
  // 未授权数据调取
  unauthorized:function(){
    var _this = this;
    _this.setData({newcoupon: false});
    // 调取数据
    // _this.obtaintabfun();         
  },
  // 获取首页数据
  obtaintabfun:function(){
    var _this = this;
    // 判断是正是版本还是审核版本
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/verifyVersion.conf',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.WeChat == app.signindata.versionnumber) {
             _this.setData({is_formaldress : true})
        } else {
             _this.setData({is_formaldress : false})
        };
         _this.auditversion();
      },
      fail: function (res) {}
    });
  },
  // 数据请求
  auditversion:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true }) 
    _this.setData({ loadprompt: '加载更多.....', commoddata: [], nodataiftr:false,page: 0});
    if(Dec.env=='online'){
      if(_this.data.is_formaldress){
        var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/index.json'; // 审核 
      }else{
        var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/Index.json';  // 未审核
      };
    }else{
      var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/test/Index.json';  // 测试 
    };
    wx.request({
      url: url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('版本数据===========', res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
            var List = res.data.List;
            //  商品列表数据
            var arrlist = List.index||[];
            var zdyurl = _this.data.zdyurl || '';
            var regData = app.signindata.reg || /^((https|http|ftp|rtsp|mms|www)?:\/\/)[^\s]+/ ;

            // 分类 首页弹框
            if ( List.indexSpread && List.indexSpread.length != 0 ) {
              var indexnum = Math.floor(Math.random() * List.indexSpread.length) || 0;
              var indexelafra = List.indexSpread[indexnum] || '';
              if ( indexelafra && indexelafra.src ) {
                _this.setData({
                  elafradata: indexelafra,
                  indexelafra: true
                });
                app.signindata.tgaimg = indexelafra.src ||'https://www.51chaidan.com/images/default/openscreen.jpg';
              } else {
                _this.setData({ indexelafra: false, index_ela_fra: false });
                app.signindata.index_ela_fra = false;
              };
            } else {
              _this.setData({ indexelafra: false, index_ela_fra: false });
              app.signindata.index_ela_fra = false;     
            }

            if (arrlist.length != 0) {
              for (var i = 0; i < arrlist.length; i++) {
                if (arrlist[i].item_type == 9014 || arrlist[i].item_type == 989 || arrlist[i].item_type == 9017) {
                  var shouNum = arrlist[i].item_type == 9014||9017?10:6
                  let al = [...arrlist[i].List];
                  if(al.length<=shouNum){
                    let result = [];
                    while (al.length > 0) {
                      let randomIndex = Math.floor(Math.random() * (al.length))
                      result.push(al.splice(randomIndex, 1)[0])
                    }
                    arrlist[i].List = result;
                  }else{
                    let topArrList = [];
                    for(let j=0; j < arrlist[i].List.length; j++){
                      if(arrlist[i].List[j].isTop){
                        topArrList.push(arrlist[i].List[j]);  
                        al.splice(j, 1);
                      }
                    }
                    if(topArrList.length>=shouNum){
                      arrlist[i].List = topArrList;
                    }else{
                      arrlist[i].List = [...topArrList,..._this.makeRandomArr(al,shouNum-topArrList.length)];
                    }
                  }
                }
                if (arrlist[i].item_type == 992) {
                  for (var li = 0; li < arrlist[i].List.length;li++){
                    if (arrlist[i].List[li]) {
                      arrlist[i].List[li].start_time = _this.toDatehd(arrlist[i].List[li].start_time)
                    };
                  }
                  _this.setData({islive:true})
                }

                if (arrlist[i].show_type == 2) {
                  if (arrlist[i].img != '' && arrlist[i].img){
                    if (!regData.test(arrlist[i].img)) {
                      arrlist[i].img = zdyurl + arrlist[i].img;
                    };
                  }else{
                    arrlist[i].img = _this.data.defaultimg;
                  };
                } else if (arrlist[i].show_type == 3 || arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                  if (arrlist[i].show_type == 3) {
                    if (arrlist[i].img != '' && arrlist[i].img){
                      if (!regData.test(arrlist[i].img)) {
                        arrlist[i].img = zdyurl + arrlist[i].img;
                      };
                    }else{
                      arrlist[i].img = _this.data.defaultimg;
                    };
                  };
                  if (arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                    if (!regData.test(arrlist[i].icon)) {
                      arrlist[i].icon = zdyurl + arrlist[i].icon;
                    };
                  };
                  if (arrlist[i].List){
                    for (var ar = 0; ar < arrlist[i].List.length; ar++) {
                      if (arrlist[i].List[ar].img != '' && arrlist[i].List[ar].img){
                        if (!regData.test(arrlist[i].List[ar].img)) {
                          arrlist[i].List[ar].img = zdyurl + arrlist[i].List[ar].img;
                        };
                      }else{
                        arrlist[i].List[ar].img = _this.data.defaultimg;
                      };
                    };
                  }
                } else if (arrlist[i].show_type == 103){
                  var goodsListdata = arrlist[i].goodsList||[];
                  for (var q = 0; q < goodsListdata.length;q++){
                    if (!regData.test(goodsListdata[q].goods_cover)) {
                      goodsListdata[q].goods_cover = zdyurl + goodsListdata[q].goods_cover;
                    };
                  };
                  var arrpresentList = arrlist[i].presentList || [];
                  if (arrpresentList) {
                    for (var v = 0; v < arrpresentList.length; v++) {
                      if (!regData.test(arrpresentList[v].goods_cover)) {
                        arrpresentList[v].goods_cover = zdyurl + arrpresentList[v].goods_cover;
                      };
                    };
                  };
                  if (!regData.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = zdyurl + arrlist[i].gcover;
                  };
                } else if (arrlist[i].show_type == 105) {
                  var stop_time = arrlist[i].List[0].stop_time;
                  setInterval(function () {
                    //   //将时间传如 调用 
                    _this.dateformat(stop_time);
                  }.bind(_this), 1000);
                } else if (arrlist[i].show_type == 1) {
                  if (!regData.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = zdyurl + arrlist[i].gcover;
                  }
                  arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
                };
              };
              var comdataarr = arrlist||[];
            } else {
                clearInterval(_this.data.timer);
                var comdataarr = [];
            };


            var classification = [];
            var banlist = [];
            if (List.category && List.category.length != 0) {
              var num = Math.floor(Math.random() * List.category.length) || 0;
              classification = List.category[num];
              if (classification.length != 0) {
                for (var i = 0; i < classification.length; i++) {
                  if (!regData.test(classification[i].img)) {
                    classification[i].img = zdyurl + classification[i].img;
                  }
                };
              };

              // banner
              banlist = List.banner||[];
              if (banlist.length != 0) {
                for (var i = 0; i < banlist.length; i++) {
                  if (!regData.test(banlist[i].image)) {
                    banlist[i].image = zdyurl + banlist[i].image;
                  }
                };
              };
            }
            _this.setData({
              classificationlist: classification||'',
              commoddata: comdataarr,
              nodataiftr: true,
              movies: banlist||''
            });

        };    
      },
      fail: function (res) {}
    })    
  },
  //随机取出数组中N个不重复的数据
  makeRandomArr(arrList,num){
    if(num>arrList.length){
      return;
    }
    var tempArr=arrList.slice(0);
    var newArrList=[];    
    for(var i=0;i<num;i++){
        var random=Math.floor(Math.random()*(tempArr.length-1));
        var arr=tempArr[random];
        tempArr.splice(random, 1);
        newArrList.push(arr);    
    }
    return newArrList;
  },

  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      path:''
    }
  },
  onLoad: function (options) {
    console.log('options====',options)

    var _this = this;
    wx.showLoading({ title: '加载中...',mask:true })
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    this.setData({
      judgeprof: options.judgeprof||1,
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      defaultinformation: app.signindata.defaultinformation || ''
    }); 
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      _this.data.iftrjump = false;
      _this.data.scene = scene;
    } else {
      _this.data.iftrjump = true;
    };
    // 判断是否通过扫码进入
    app.signindata.channel = options.channel || '';

    // 调取数据
    _this.obtaintabfun();    

    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
     
    // 判断是否授权 
    if(app.signindata.sceneValue==1154){
      _this.setData({
        isProduce: true,
      });    
      console.log(_this.data.isProduce)  
      _this.unauthorized();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
              isProduce: app.signindata.isProduce,
              defaultinformation: app.signindata.defaultinformation||'',
              tgabox: false
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this);
            }
          } else {
            _this.unauthorized();
          }
        }
      });
    }

  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function(){
    Dec.shopnum(this);
    Dec.getdoubleEleven(this, app);
    if (this.data.commoddata.length != 0) {
      this.countdownbfun()
    };
    if(app.signindata.sceneValue!=1154){
      this.setData({
        isProduce: app.signindata.isProduce,
      })
    }
    var _this = this;
    if (app.signindata.perspcardata) {
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: true
      });
      app.countdowntime(_this, _this.data.perspcardata)
    } else {
      clearInterval(this.data.countdowntime);
      _this.setData({
        perspcardiftrmin: false
      });
    };   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
    clearInterval(this.data.countdowntime);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer); 
    clearInterval(this.data.countdowntime);   
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 获取list数据
    this.auditversion();   
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 获取list数据
    this.listdata(2);    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;
    return {
      title: '潮玩社交平台',
      path: 'pages/index/index',
      imageUrl:app.signindata.indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      success: function (res) {}
    }  
  },
  scroll:function(){},  
  whomepage:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.onPullDownRefresh();
  },
  // 导航跳转 
  wnews: function () {
    var _this = this;
    app.limitlottery(_this);
  },  
  wshoppingCart:function(){
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.redirectTo({
      url: "/pages/shoppingCart/shoppingCart",
      complete: function () {_this.setData({ jumpdevanningiftr: false });}
    });
  },
  wmy:function(){
    app.signindata.iftr_mc = true;
    var _this = this;
    _this.setData({ jumpdevanningiftr: true }); 
    wx.redirectTo({
      url: "/pages/wode/wode",
      complete: function () {_this.setData({ jumpdevanningiftr: false });}
    });
  },
  clicktganone:function(){
     this.setData({tgabox:false})
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);     
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            tgabox: false
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
      app.clicktga(8)  //用户按了拒绝按钮
    };

  },
  // 图片自适应
  imageLoad: function (e) {
    var $width = e.detail.width,  
      $height = e.detail.height,
      ratio = $width / $height;   
    var viewWidth =500,          
      viewHeight = 500 / ratio-20; 
    var image = this.data.images;
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight
    }
    this.setData({
      images: image
    })
  }, 
  // 新人获取优惠券弹框
  swfcanimgcou: function () {
    this.setData({
      newcoupon: !this.data.newcoupon
    });   
  },  
  // 倒计时
  countdownbfun:function(){
    var _this = this;
    clearInterval(_this.data.timer);
    var commoddata = _this.data.commoddata;
    var len = commoddata.length;
    function nowTime() {
      var iftrins = 1;
      var iftrcomb = 1;
      for (var i = 0; i < len; i++) {
        if (commoddata[i].show_type==5){
      　  var nowTime = new Date();
  　　　　var nowTime = Date.parse(nowTime);//当前时间戳
         var lastTime = commoddata[i].stop_time*1000;
  　　　　var differ_time = lastTime - nowTime;//时间差：
  　　　　if (differ_time >= 0) {
    　　　　　　var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
    　　　　　　var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
    　　　　　　var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
    　　　　　　var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
    　　　　　　if (differ_day.toString().length < 2) {differ_day = "0" + differ_day;};
    　　　　　　if (differ_hour.toString().length < 2) {differ_hour = "0" + differ_hour;};
    　　　　　　if (differ_minute.toString().length < 2) {differ_minute = "0" + differ_minute;};
               if (s.toString().length < 2) {s = "0" + s;};    
    　　　　　　var str = differ_day + '天' + differ_hour + '时' + differ_minute + '分' + s;
              commoddata[i].day = differ_day;
              commoddata[i].hour = differ_hour;
              commoddata[i].minute = differ_minute;
              commoddata[i].second = s;
  　　　　} else {
               commoddata[i].day = '00'
               commoddata[i].hour='00';
               commoddata[i].minute = '00';
               commoddata[i].second = '00';
  　　　　};
         if (commoddata[i].day!='00'||commoddata[i].hour!='00'||commoddata[i].minute!='00'||commoddata[i].second!='00'){
           iftrins = 0;
         };
        };
        if (commoddata[i].show_type ==103){
          if (commoddata[i].isLimitTime==1){
            // 获取现在的时间
            var nowTime = new Date();
            var nowTime = Date.parse(nowTime);//当前时间戳
            var lastTime = commoddata[i].promotion_stop * 1000;
            var differ_time = lastTime - nowTime;//时间差：
            if (differ_time >= 0) {
              var differ_day = Math.floor(differ_time / (3600 * 24 * 1e3));
              var differ_hour = Math.floor(differ_time % (3600 * 1e3 * 24) / (1e3 * 60 * 60));
              var differ_minute = Math.floor(differ_time % (3600 * 1e3) / (1000 * 60));
              var s = Math.floor(differ_time % (3600 * 1e3) % (1000 * 60) / 1000);
              if (differ_day.toString().length < 2) { differ_day = "0" + differ_day; };
              if (differ_hour.toString().length < 2) { differ_hour = "0" + differ_hour; };
              if (differ_minute.toString().length < 2) { differ_minute = "0" + differ_minute; };
              if (s.toString().length < 2) { s = "0" + s; };
              var str = differ_day + '天' + differ_hour + '时' + differ_minute + '分' + s;
              commoddata[i].day = differ_day;
              commoddata[i].hour = differ_hour;
              commoddata[i].minute = differ_minute;
              commoddata[i].second = s;
            } else {
              commoddata[i].day = '00'
              commoddata[i].hour = '00';
              commoddata[i].minute = '00';
              commoddata[i].second = '00';
            };
            if (commoddata[i].day != '00' || commoddata[i].hour != '00' || commoddata[i].minute != '00' || commoddata[i].second != '00') {
              iftrcomb = 0;
            };            
          }
        }
      };
      _this.setData({
        commoddata: commoddata
      });
      if (iftrins==1 && iftrcomb==1){
        clearInterval(_this.data.timer);
      };
    }
    if(_this.data.commoddata.length!=0){
      nowTime();
      clearInterval(_this.data.timer);
      _this.data.timer=setInterval(nowTime, 1000);
    };

  },
  // 加入购物车
  addtocart: function (w) {
    var _this = this;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var adtocar = [{ 'goods_id': gid, 'color_id': 0, 'size_id': 0, 'count': 1 }];
    var adtocarleng = adtocar.length;
    adtocar = JSON.stringify(adtocar);
    var qformid = Dec.Aese('mod=cart&operation=add&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gcount=' + adtocarleng + '&ginfo=' + adtocar);
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qformid,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          app.showToastC('已成功加入购物车');
          Dec.shopnum(_this,app.signindata.comurl);
        } else if (res.data.ReturnCode == 802) {
          wx.navigateTo({   
            url: "/pages/detailspage/detailspage?gid=" + gid
          });
        } else if (res.data.ReturnCode == 805) {
          app.showToastC('库存不足');
        } else if (res.data.ReturnCode == 201) {
          app.showToastC('添加失败');
        } else if (res.data.ReturnCode == 302) {
          app.showToastC('无效信息');
        }
      },
      fail: function () { }
    });
  },   
  newhbfun:function(){
    this.setData({
      newcoupon: !this.data.newcoupon
    });
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      if (detail.detail.current == 0) {
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { 
          console.error(this.data.swiperError)
          this.setData({ goodsIndex: this.data.preIndex });
          this.setData({ swiperError: 0 })
        }
      } else {
        this.setData({ preIndex: detail.detail.current });
        this.setData({ swiperError: 0 })
      }
    }
    this.setData({
      currentSwiper: detail.detail.current
    })
  },
  //公告跳转
  jumpnotice: function () {
    var _this = this
    if (_this.data.notice_type == 1) {
      var url = encodeURIComponent(_this.data.notice_url + "?uid=" + _this.data.uid)
      wx.navigateTo({
        url: "/page/component/pages/webview/webview?webview=" + url,
      });
    } else {
      wx.navigateTo({
        url: "/pages/detailspage/detailspage?gid=" + _this.data.notice_url
      })
    }
  },
  dateformat: function (micro_second) {
    var _this = this
    var timestamp = Date.parse(new Date())
    //总的秒数 
    var second = micro_second - (timestamp / 1000);
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
        _this.setData({
          dayStr: 0,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      } else {
        _this.setData({
          dayStr: dayStr,
          hrStr: hrStr,
          minStr: minStr,
          secStr: secStr,
        })
      }
    } else {
      _this.setData({
        dayStr: 0,
        hrStr: "00",
        minStr: "00",
        secStr: "00",
      })
    };
  },
  jumpdevanning: function (w) {
    var _this = this;
    this.setData({ jumpdevanningiftr:true});
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    wx.navigateTo({   
      url: "/page/component/pages/devanning/devanning?id=" + id,
      complete: function () { _this.setData({ jumpdevanningiftr: false }); }
    });
  },
  dlfindfun: function () {
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.reLaunch({
      url: "/page/component/pages/dlfind/dlfind",
      complete: function () { _this.setData({ jumpdevanningiftr: false }); }
    })
  },
  // 跳转详情
  jumpdlfdetail: function (w) {
    var drying_id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })
  },
  newpsellwellfun:function(w){
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var href = w.currentTarget.dataset.href || w.target.dataset.href || 0;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    var imgurl = '';
    // 公共跳转
    this.comjumpwxnav(item_type, href, title, imgurl);

  },
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var indexnum = e.currentTarget.dataset.indexnum || e.target.dataset.indexnum || 0;
    if (indexnum == 5) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 200,
        viewWidth = 200 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 240) {
        viewWidth = 240;
      };
      if (commoddata[ind]) {
        if (commoddata[ind]) {
          commoddata[ind].width = viewWidth;
          _this.setData({
            ['commoddata[' + ind + '].width']: viewWidth
          });
        };
      };

    } else if (indexnum == 3) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 100,
        viewWidth = 100 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata['+ind+'].List['+num+'].width']: viewWidth
          })
        };
      };
    } else if (indexnum == 4) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 147,
        viewWidth = 147 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata['+ind+'].List['+num+'].width'] : viewWidth
          })
        };
      };
    } else if (indexnum == 989) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 119,
        viewWidth = 119 * ratio;
      var commoddata = this.data.commoddata;
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata['+ind+'].List['+num+'].width'] : viewWidth
          })
        };
      };
    } else if (indexnum == 7) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 177,
        viewWidth = 177 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata[' + ind + '].List[' + num + '].width']: viewWidth
          })
        };
      };
    } else if (indexnum == 2) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 240,
        viewWidth = 240 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata['+ind+'].List['+num+'].width'] : viewWidth
          })
        };
      };
    } else if (indexnum == 6) {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 348,
        viewWidth = 348 * ratio;
      var commoddata = this.data.commoddata;
      if (commoddata[ind]) {
        if (commoddata[ind].List && commoddata[ind].List[num]) {
          commoddata[ind].List[num].width = viewWidth;
          _this.setData({
            ['commoddata[' + ind + '].List[' + num + '].width']: viewWidth
          })
        };
      };
    } else {
      var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
      var num = e.currentTarget.dataset.num || e.target.dataset.num || 0;
      var $width = e.detail.width,
        $height = e.detail.height,
        ratio = $width / $height;
      var viewHeight = 104,
        viewWidth = 104 * ratio;
      var commoddata = this.data.commoddata;
      if (viewWidth > 680) {
        viewWidth = 680;
      };
      if (commoddata[ind]) {
        if (commoddata[ind].banner && commoddata[ind].banner[num]) {
          commoddata[ind].banner[num].width = viewWidth;
          _this.setData({
            ['commoddata['+ind+'].banner['+num+'].width'] : viewWidth
          })
        };
      };
    };
  },
  // 跳转活动详情页
  jumpopenbox: function (event) {
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var hreftype = event.currentTarget.dataset.hreftype || event.target.dataset.hreftype || "normal";
    console.log(hreftype)
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    if(hreftype == "openedList"){
      wx.navigateTo({
        url: "/page/component/pages/initiateopenboxeslist/initiateopenboxeslist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    }else{
      wx.navigateTo({
        url: "/page/component/pages/mingbox/mingbox?gid=" + gid,
        complete: function () {_this.setData({ jumpdevanningiftr: false });}
      });
    }

  },
  jumpdlflottery: function (event){
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    wx.navigateTo({
      url: "/page/component/pages/limitlottery/limitlottery?id=" + id,
      complete: function () {_this.setData({ jumpdevanningiftr: false });}
    });   
  },
  // 在线抽盒机
  bbevebox: function (event) {
    var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
    var _this = this;
    wx.navigateTo({
      url: "/pages/smokebox/smokebox?gid=" + id
    });
  }, 
  // 车队详情
  driveDetail: function (event) {
    var id = event.currentTarget.dataset.id || event.target.dataset.id;
    var _this = this;
    wx.navigateTo({
      url: "/page/component/pages/drivetohide/drivetohide?id=" + id
    });
  }, 
  myordertoyind: function (event){
    var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({
      url: "/page/component/pages/myothertoydg/myothertoydg?ownerId=" + id,
    });  
  }
})

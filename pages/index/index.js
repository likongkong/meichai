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
    headhidden:true,
    // 商品默认图片
    defaultimg:'../images/goods_Item_Default_Image.png',
    movies: [],
    commoddata:[],
    // 分类数据
    classificationlist:[],
    // 页数
    page:0,
    // 头部搜索值
    topsousuo:'搜索',
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
    scrollwidth:0,
    scrollwidthiftr:true,
    // 点击请求判断防止多次提交
    clicktherequestiftr:true, 
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
    snapshot: "",
    devaname: "",
    devaid: 0,
    jumpdevanningiftr:false,
    // 晒单数量
    dryinglistnum:0,
    isStore: app.signindata.isStore,
    isProduce: app.signindata.isProduce,
    ceshilist:[],
    npswtab:1, // 1 新品 2 热销
    indexelafra:false,
    elafradata:'',
    c_title: '美拆', // -正品折扣多一点
    c_arrow:false,
    c_backcolor:'#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    index_ela_fra: app.signindata.index_ela_fra,
    loadmoreiftr:true,
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
    judgeLoadData:true
  },
  doubleEleven: function () {
    var _this = this;
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
    var wname = '';
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
      // url: "/page/component/pages/crowdfunding/crowdfunding?aid=47947"
      // url: "/page/component/pages/drivetohidelist/drivetohidelist"
      // url: "/pages/activitydetailspage/activitydetailspage?id=18376"
      // url: "/pages/activitydetailspage/activitydetailspage?id=18185"
      // url: "/page/component/pages/limitlottery/limitlottery?id=76302",
      // url: "/page/component/pages/drivetohidehome/drivetohidehome"
      // url: "/page/component/pages/exhibition/exhibition"
      // url: "/page/component/pages/exhibitiondetail/exhibitiondetail?id=43161"
      url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
      // url: "/pages/detailspage/detailspage?gid=33309"
      // url: "/pages/detailspage/detailspage?gid=331603"
      // url: "/page/component/pages/playgrasslist/playgrasslist"
      
    });
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname, imgurl){
    var imgurl = imgurl || '';
    var _this = this;
    _this.setData({ jumpdevanningiftr: true });
    if (item_type == 0) {
      var url = encodeURIComponent(whref);
      var encodeimgurl = encodeURIComponent(imgurl);
      wx.navigateTo({    // 外部链接
        url: "/page/component/pages/webview/webview?webview=" + url + "&imgurl=" + encodeimgurl,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      }); 
    } else if (item_type == 1) {
      wx.navigateTo({    // 商品详情页
        url: "/pages/detailspage/detailspage?gid=" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9003) {
      wx.navigateTo({    // 抽签详情页
        url: "/page/component/pages/limitlottery/limitlottery?gid=" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9004) {
      wx.navigateTo({    // 拆明盒详情页
        url: "/page/component/pages/mingbox/mingbox?gid="+ whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type ==9005) {
      wx.navigateTo({    // 抽盒机详情页
        url: "/pages/smokebox/smokebox?gid=" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 2 || item_type == 3 || item_type == 21) {
      wx.navigateTo({    // 信息流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });  
    } else if (item_type == 4 || item_type == 5 || item_type==22) {
      wx.navigateTo({    // 瀑布流
        url: "/pages/classificationpage/classificationpage?" + whref + '&wtype=' + item_type + '&wname=' + wname,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });     
    } else if (item_type == 6 || item_type == 7) {
      wx.redirectTo({    // 活动列表
        url: "/pages/activitysharinglist/activitysharinglist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 8) {
      wx.navigateTo({    // 活动详情页
        url: "/pages/activitydetailspage/activitydetailspage?id=" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });    
    } else if (item_type == 9) {
      wx.navigateTo({ 
        url: "/page/component/pages/newsignin/newsignin",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      }); 
    } else if (item_type == 9002){
      var imgurl = encodeURIComponent(whref)
      wx.navigateTo({   
        url: "/page/component/pages/savethepicture/savethepicture?imgurl=" + imgurl,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });     
    } else if (item_type == 12) {
      wx.navigateTo({   
        url: "/pages/combination/combination",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9003) {
      wx.navigateTo({
        url: "/pages/combination/combination",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      }); 
    } else if (item_type == 9004) {
      wx.navigateTo({
        url: "/pages/activitysharinglist/activitysharinglist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      }); 
    } else if (item_type == 9005) {
      wx.navigateTo({
        url: "/pages/activitydetailspage/activitydetailspage?" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      }); 
    } else if (item_type == 998) {
      wx.reLaunch({    //签到
        url: "/pages/index/index?judgeprof=2",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 995) {
      wx.navigateTo({    //活动
        url: "/page/component/pages/luckaction/luckaction",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });

    } else if (item_type == 994) {
      wx.navigateTo({
        url: "/page/component/pages/turntable/turntable",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 993) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=6",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 991) {
      wx.navigateTo({
        url: "/page/component/pages/dlfind/dlfind?topic_id=9",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 990) {
      wx.navigateTo({
        url: "/page/component/pages/mingboxList/mingboxList",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 989) {
      wx.navigateTo({
        url: "/page/component/pages/limitlotterylist/limitlotterylist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 988) {
      wx.navigateTo({
        url: "/pages/smokeboxlist/smokeboxlist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 992) {
      wx.navigateTo({
        url: "/page/component/pages/bargainList/bargainList",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9006) {
      wx.navigateTo({
        url: "/page/component/pages/ocamendment/ocamendment",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9007) {
      wx.navigateTo({
        url: "/page/component/pages/doubleEleven/doubleEleven",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9008) {
        wx.navigateTo({
          url: "/page/component/pages/drivetohidehome/drivetohidehome",
          complete: function () {
            _this.setData({ jumpdevanningiftr: false });
          }
        });
    } else if (item_type == 9011) {
      wx.navigateTo({
        url: "/page/secondpackge/pages/exhibition/exhibition?type=15",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9012) {  // 种草
      wx.navigateTo({
        url: "/page/component/pages/playgrasslist/playgrasslist",
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    } else if (item_type == 9013) {  // 种草详情
      wx.navigateTo({
        url: "/page/component/pages/crowdfunding/crowdfunding?aid=" + whref,
        complete: function () {
          _this.setData({ jumpdevanningiftr: false });
        }
      });
    };

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
    if(_this.data.judgeLoadData){
      _this.data.judgeLoadData = false;
      if(num==1){
        _this.data.page = 0;
        _this.setData({ headhidden: false, loadmoreiftr:false, loadprompt: '加载更多.....', commoddata: [], nodataiftr:false});
        var q = Dec.Aese('mod=getinfo&operation=list&category_id=-1&uid=' + _this.data.uid+'&blackCity='+_this.data.blackCity);
      }else{
        var pagenum = parseInt(_this.data.page)
        _this.data.page = ++pagenum;
        _this.setData({ headhidden: false, loadmoreiftr:false, loadprompt: '加载更多.....' });
        var q = Dec.Aese('mod=getinfo&operation=list&ltype=more&category_id=-1&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&blackCity=' + _this.data.blackCity);
      }; 
      wx.showLoading({ title: '加载中...', }) 
      console.log('page===========',_this.data.page)
      wx.request({
        url: app.signindata.comurl + 'goods.php' + q,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log('列表===========',res)
          if (res.data.ReturnCode == 200) {
            var arrlist = res.data.List||[];
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
                if (i>6){
                  arrlist[i].showiftr = false;
                }else{
                  arrlist[i].showiftr = true;
                };
                if (arrlist[i].show_type == 2) {
                  if (arrlist[i].img != '' && arrlist[i].img){
                    if (!app.signindata.reg.test(arrlist[i].img)) {
                      arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                    };
                  }else{
                    arrlist[i].img = _this.data.defaultimg;
                  };
                } else if (arrlist[i].show_type == 3 || arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                  if (arrlist[i].show_type == 3) {
                    if (arrlist[i].img != '' && arrlist[i].img){
                      if (!app.signindata.reg.test(arrlist[i].img)) {
                        arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                      };
                    }else{
                      arrlist[i].img = _this.data.defaultimg;
                    };
                  };
                  if (arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                    if (!app.signindata.reg.test(arrlist[i].icon)) {
                      arrlist[i].icon = _this.data.zdyurl + arrlist[i].icon;
                    };
                  };
                  if (arrlist[i].List){
                    for (var ar = 0; ar < arrlist[i].List.length; ar++) {
                      if (arrlist[i].List[ar].img != '' && arrlist[i].List[ar].img){
                        if (!app.signindata.reg.test(arrlist[i].List[ar].img)) {
                          arrlist[i].List[ar].img = _this.data.zdyurl + arrlist[i].List[ar].img;
                        };
                      }else{
                        arrlist[i].List[ar].img = _this.data.defaultimg;
                      };
                    };
                  }
                } else if (arrlist[i].show_type == 103){
                  var goodsListdata = arrlist[i].goodsList||[];
                  for (var q = 0; q < goodsListdata.length;q++){
                    if (!app.signindata.reg.test(goodsListdata[q].goods_cover)) {
                      goodsListdata[q].goods_cover = _this.data.zdyurl + goodsListdata[q].goods_cover;
                    };
                  };
                  var arrpresentList = arrlist[i].presentList || [];
                  if (arrpresentList) {
                    for (var v = 0; v < arrpresentList.length; v++) {
                      if (!app.signindata.reg.test(arrpresentList[v].goods_cover)) {
                        arrpresentList[v].goods_cover = _this.data.zdyurl + arrpresentList[v].goods_cover;
                      };
                    };
                  };
                  if (!app.signindata.reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  };
                } else if (arrlist[i].show_type == 105) {
                  var stop_time = arrlist[i].List[0].stop_time;
                  setInterval(function () {
                    //   //将时间传如 调用 
                    _this.dateformat(stop_time);
                  }.bind(_this), 1000);
                } else if (arrlist[i].show_type == 1) {
                  if (!app.signindata.reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
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
          _this.setData({ loadmoreiftr: true});
          // 判断非200和登录
          Dec.comiftrsign(_this, res, app);
        },
        complete:function(){
          // 刷新完自带加载样式回去
          wx.stopPullDownRefresh()
          _this.data.clicktherequestiftr = true;
          _this.setData({ headhidden: true});
          wx.hideLoading()
          _this.data.judgeLoadData = true;
        }
      }); 

    }  
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
      isStore: app.signindata.isStore,
      isProduce: app.signindata.isProduce,
      defaultinformation:app.signindata.defaultinformation||'',
      headhidden: true,
      index_ela_fra: app.signindata.index_ela_fra,
      automat: app.signindata.automat || { isOpen: false, times: 0 },
      automatTimes: app.signindata.automat.times,
      automattitle: app.signindata.automattitle || '',
      isTodaySign: app.signindata.isTodaySign
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
    // 调取数据
    _this.obtaintabfun(); 
    setTimeout(function(){
      _this.otherdata();
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
    _this.obtaintabfun();         
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
             _this.data.is_formaldress = true;
        } else {
             _this.data.is_formaldress = false;
        };
         _this.auditversion();
      },
      fail: function (res) {}
    });
  },
  // 数据请求
  auditversion:function(){
    var _this = this;
    _this.setData({ headhidden: false, loadmoreiftr:false, loadprompt: '加载更多.....', commoddata: [], nodataiftr:false,page: 0});
    if(Dec.env=='online'){
      if(_this.data.is_formaldress){
        var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/index.json'; // 审核 
      }else{
        var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/Index.json';  // 未审核
      };
    }else{
      var url = 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/test/Index.json';  // 测试 
    };
    console.log(url)
    wx.request({
      url: url,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('版本数据===========', res)
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        _this.data.clicktherequestiftr = true;
        _this.setData({ headhidden: true});
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
            var List = res.data.List;
            //  商品列表数据
            var arrlist = List.index||[];
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
                if (i>6){
                  arrlist[i].showiftr = false;
                }else{
                  arrlist[i].showiftr = true;
                };
                if (arrlist[i].show_type == 2) {
                  if (arrlist[i].img != '' && arrlist[i].img){
                    if (!app.signindata.reg.test(arrlist[i].img)) {
                      arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                    };
                  }else{
                    arrlist[i].img = _this.data.defaultimg;
                  };
                } else if (arrlist[i].show_type == 3 || arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                  if (arrlist[i].show_type == 3) {
                    if (arrlist[i].img != '' && arrlist[i].img){
                      if (!app.signindata.reg.test(arrlist[i].img)) {
                        arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                      };
                    }else{
                      arrlist[i].img = _this.data.defaultimg;
                    };
                  };
                  if (arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                    if (!app.signindata.reg.test(arrlist[i].icon)) {
                      arrlist[i].icon = _this.data.zdyurl + arrlist[i].icon;
                    };
                  };
                  if (arrlist[i].List){
                    for (var ar = 0; ar < arrlist[i].List.length; ar++) {
                      if (arrlist[i].List[ar].img != '' && arrlist[i].List[ar].img){
                        if (!app.signindata.reg.test(arrlist[i].List[ar].img)) {
                          arrlist[i].List[ar].img = _this.data.zdyurl + arrlist[i].List[ar].img;
                        };
                      }else{
                        arrlist[i].List[ar].img = _this.data.defaultimg;
                      };
                    };
                  }
                } else if (arrlist[i].show_type == 103){
                  var goodsListdata = arrlist[i].goodsList||[];
                  for (var q = 0; q < goodsListdata.length;q++){
                    if (!app.signindata.reg.test(goodsListdata[q].goods_cover)) {
                      goodsListdata[q].goods_cover = _this.data.zdyurl + goodsListdata[q].goods_cover;
                    };
                  };
                  var arrpresentList = arrlist[i].presentList || [];
                  if (arrpresentList) {
                    for (var v = 0; v < arrpresentList.length; v++) {
                      if (!app.signindata.reg.test(arrpresentList[v].goods_cover)) {
                        arrpresentList[v].goods_cover = _this.data.zdyurl + arrpresentList[v].goods_cover;
                      };
                    };
                  };
                  if (!app.signindata.reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  };
                } else if (arrlist[i].show_type == 105) {
                  var stop_time = arrlist[i].List[0].stop_time;
                  setInterval(function () {
                    //   //将时间传如 调用 
                    _this.dateformat(stop_time);
                  }.bind(_this), 1000);
                } else if (arrlist[i].show_type == 1) {
                  if (!app.signindata.reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  }
                  arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
                };
              };
              var comdataarr = arrlist||[];
            } else {
                clearInterval(_this.data.timer);
                var comdataarr = [];
            };
            // 分类 首页弹框
            if(List.indexSpread&&List.indexSpread.length!=0){
              var indexnum = Math.floor(Math.random() * List.indexSpread.length) || 0;
              var indexelafra = List.indexSpread[indexnum] || [];
              if (indexelafra) {
                _this.setData({
                  elafradata: indexelafra,
                  indexelafra: true
                });
                app.signindata.tgaimg = indexelafra.src ||'https://www.51chaidan.com/images/default/openscreen.jpg';
              } else {
                _this.setData({ indexelafra: false, index_ela_fra: false });
                app.signindata.index_ela_fra = false;
              };
            }else{
              _this.setData({ indexelafra: false, index_ela_fra: false });
              app.signindata.index_ela_fra = false;     
            }
            if(List.category&&List.category.length!=0){
              var num = Math.floor(Math.random() * List.category.length) || 0;
              var classification = List.category[num];
              if (classification.length != 0) {
                for (var i = 0; i < classification.length; i++) {
                  if (!app.signindata.reg.test(classification[i].img)) {
                    classification[i].img = _this.data.zdyurl + classification[i].img;
                  }
                };
              };
              // banner
              var banlist = List.banner||[];
              if (banlist.length != 0) {
                for (var i = 0; i < banlist.length; i++) {
                  if (!app.signindata.reg.test(banlist[i].image)) {
                    banlist[i].image = _this.data.zdyurl + banlist[i].image;
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
  // 一天只显示一次 商品推荐弹框
  indexelafradatefun:function(){
    var STORAGE_KEY = 'INDEX_ELA_FRA';
    var _this = this;
    let cache = wx.getStorageSync(STORAGE_KEY);
    console.log(new Date(cache).toDateString(), new Date().toDateString())
    if (cache) {
      if (new Date(cache).toDateString() === new Date().toDateString()) {
        return false;
      } else {
        wx.setStorage({
          key: STORAGE_KEY,
          data: +new Date,
        });
        this.setData({
          indexelafra: true
        });
      }
    } else {
      // 没显示过，则进行展示
      wx.setStorage({
        key: STORAGE_KEY,
        data: +new Date,
      });
      this.setData({
        indexelafra: true
      });
    }
  },
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中...', })
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    this.setData({
      headhidden: false,
      judgeprof: options.judgeprof||1,
      uid: app.signindata.uid,
      isStore: app.signindata.isStore,
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
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            isStore: app.signindata.isStore,
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
          // app.userstatistics(2);
          // wx.request({
          //   url: 'https://api.51chaidan.com/config/verifyVersion.conf',
          //   method: 'GET',
          //   header: { 'Accept': 'application/json' },
          //   success: function (res) {
          //     console.log(res.data.WeChat, app.signindata.versionnumber)
          //     if (res.data.WeChat == app.signindata.versionnumber) { } else {
          //       app.userstatistics(2);
          //       _this.setData({
          //         tgabox: true
          //       });
          //     }
          //   },
          //   fail: function (res) {
          //     app.userstatistics(2);
          //     _this.setData({
          //       tgabox: true
          //     });
          //   }
          // })

        }
      }
    });
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
    this.setData({
      isProduce: app.signindata.isProduce,
    })
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
    var reshare = Dec.sharemc();
    return reshare
  },
  scroll:function(){},
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    };
  },   
  whomepage:function(){
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    // 防止多次提交
    if (this.data.clicktherequestiftr){
      this.data.clicktherequestiftr = false;
      this.onPullDownRefresh();
    };
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
  moreJigsaw: function (w) {
    var type = w.currentTarget.dataset.type || w.target.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: "/page/component/pages/jigsawList/jigsawList"
      })
    } else {
      wx.navigateTo({
        url: "/page/component/pages/bargainList/bargainList"
      })
    };
  },
  jumpDetail: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    var meichai_jigsaw = w.currentTarget.dataset.meichai_jigsaw || w.target.dataset.meichai_jigsaw;
    if (meichai_jigsaw == 1) {
      wx.navigateTo({
        url: "/page/component/pages/jigsawDetail/jigsawDetail?goods_id=" + id,
      })
    } else {
      wx.navigateToMiniProgram({
        appId: 'wxfe253b7309e29868',
        path: "/pages/jigsawDetail/jigsawDetail?goods_id=" + id,
        extraData: {foo: 'bar'},
        envVersion: 'release',
        success(res) {}
      })
    }
  },
  jumpbargain: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id;
    wx.navigateTo({
      url: "/page/component/pages/bargainDetail/bargainDetail?goods_id=" + id
    })
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
  showImg:function(){
    var _this = this;   
    let commoddata = _this.data.commoddata;
    let height = parseInt(_this.data.windowHeight) * 2;
    wx.createSelectorQuery().selectAll('.imgiftr').boundingClientRect((ret) => {
      ret.forEach((item, index) => {
        if (item.top <= height) {
          if (commoddata[item.dataset.imgiftr]) {
            commoddata[item.dataset.imgiftr].showiftr = true
          };
        }
      })
      _this.setData({
        commoddata: commoddata
      })
    }).exec()
  },
  onPageScroll() { 
    if(this.data.loadmoreiftr) {
      this.showImg()
    };
  },
  // 跳转详情
  jumpdlfdetail: function (w) {
    var drying_id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    wx.navigateTo({
      url: "/page/component/pages/dlfinddetails/dlfinddetails?drying_id=" + drying_id,
    })
  },
  newpsellwellfun:function(w){
    var href = w.currentTarget.dataset.href || w.target.dataset.href || 0;
    var title = w.currentTarget.dataset.title || w.target.dataset.title || '';
    wx.navigateTo({
      url: "/page/component/pages/newpsellwell/newpsellwell?" + href + '&title=' + title,
    })
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
        url: "/page/component/pages/mingboxList/mingboxList",
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

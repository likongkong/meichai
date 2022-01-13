var Dec = require('../../common/public.js');
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,  
    commoddata:[],
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,    
    // 刷新
    downgid:'',
    wcate:'',
    wcate_id:'',
    wcid:'',
    wtype:'',
    // 上拉加载数据
    page: 0,
    name:'',
    // banner 
    movies:[],
    iftrgetindes:'',
    desc:'',
    // 滚动条高度
    nemscrollTop: 0,
    // 获取tab距离顶部距离
    nemscrollTopjisun:12,
    //  tab 图片判断
    tabbotimg: '-1',
    // tab 数据
    scrdata: [],  
    // 限时购倒计时
    timer: '', 
    // 瀑布流或者信息流
    item_type:2,
    // 第一次加载不显示暂无数据
    nodataiftr: false,
    // tab 数据
    scrolllefthq: 0,
    scrollleft: 1,
    scrollwidth: 0,
    scrollwidthiftr: true,
    // 加载提示
    loadprompt: '加载更多.....', 
    // 点击请求判断防止多次提交
    clicktherequestiftr: true, 
    // 用户拆币
    integrals:0,
    c_title: '每日一拆',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),  
  },
  //时间戳转换时间  
  toDate: function (number) {
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
      return  M+'-'+D;
    }

  },
  // 商品详情
  addressmanagement: function (event){
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid; 
    app.comjumpwxnav(1,gid,'');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    // 调取基础数据
    this.floaddata();
  },
  onLoad: function (w) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    }); 
    app.signindata.suap = 8;
    var mername = w.wname || '每日一拆';
    var wcate = w.cate ||'';
    var wcate_id = w.cate_id || '';
    var wcid = w.cid || ''; 
    var wtype = w.wtype;
    this.setData({      
      wcate: wcate,
      wcate_id: wcate_id,
      wcid: wcid,
      wtype: wtype,
      name: mername,
      item_type: wtype||2,
      c_title: mername
    });
    wx.setNavigationBarTitle({
      title: mername
    });
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };
    // 判断是否授权 
    wx.getSetting({
      success: res => {
        if (true) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          }
        } else {

          wx.getUserInfo({
            success: res => {
              // 判断是否登录
              if (_this.data.loginid != '' && _this.data.uid != '') {
                _this.onLoadfun();
              } else {
                app.signin(_this);
              }
            },
            fail: res => {
              wx.navigateTo({
                url: "/pages/signin/signin"
              });
            }
          });
        }
      }
    });    
     
  },
  // 商品列表
  listdata: function (num) {  // num=1 下拉 num=2 上拉
    var _this = this;
    if (num == 1) {
      _this.setData({ page:0 });
      var qq = Dec.Aese('mod=getinfo&operation=categoods&category_id=' + _this.data.tabbotimg +'&cate=' + _this.data.wcate + '&cate_id=' + _this.data.wcate_id + '&cid=' + _this.data.wcid+'&uid='+_this.data.uid);
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.setData({ page: ++pagenum });
      var qq = Dec.Aese('mod=getinfo&operation=categoods&ltype=more&category_id=' + _this.data.tabbotimg + '&cate=' + _this.data.wcate + '&cate_id=' + _this.data.wcate_id + '&cid=' + _this.data.wcid + '&pid=' + _this.data.page + '&uid=' + _this.data.uid);
    };
    _this.setData({
      loadprompt: '加载更多.....'
    });  
    wx.showLoading({ title: '加载中...', })  
    wx.request({
      url: app.signindata.comurl + 'goods.php' + qq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
  
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (res.data.Info){
            var resint = res.data.Info.integrals || 0;
            _this.setData({
              integrals: resint
            })
          }
          if (arrlist){
            if (arrlist.length!=0){
              for (var i = 0; i < arrlist.length; i++) {
                if (arrlist[i].show_type == 2) {
                  if (!app.signindata.reg.test(arrlist[i].img)) {
                    arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                  };
                } else if (arrlist[i].show_type == 3 || arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                  if (arrlist[i].show_type == 3) {
                    if (!app.signindata.reg.test(arrlist[i].img)) {
                      arrlist[i].img = _this.data.zdyurl + arrlist[i].img;
                    };
                  };
                  if (arrlist[i].show_type == 4 || arrlist[i].show_type == 5) {
                    if (!app.signindata.reg.test(arrlist[i].icon)) {
                      arrlist[i].icon = _this.data.zdyurl + arrlist[i].icon;
                    };
                  };
                  if (arrlist[i].List) {
                    for (var ar = 0; ar < arrlist[i].List.length; ar++) {
                      if (!app.signindata.reg.test(arrlist[i].List[ar].img)) {
                        arrlist[i].List[ar].img = _this.data.zdyurl + arrlist[i].List[ar].img;
                      };
                    };
                  }
                } else {
                  if (!app.signindata.reg.test(arrlist[i].gcover)) {
                    arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
                  }
                  arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);
                };

              };
              if (num == 1) {
                var comdataarr = arrlist || [];
              } else {
                if (_this.data.commoddata.length > 560) {
                  _this.data.commoddata.splice(20, 460)
                  var comdataarr = _this.data.commoddata.concat(arrlist);
                } else {
                  var comdataarr = _this.data.commoddata.concat(arrlist);
                };
              };
              _this.setData({
                commoddata: comdataarr
              });
              // 限时购倒计时
              _this.countdownbfun();              
            } else {
              if (num == 1) {
                clearInterval(_this.data.timer);
                _this.setData({
                  commoddata: []
                });
              } else {
                app.showToastC('没有更多数据了');
                _this.setData({ loadprompt: '没有更多数据了' });
              };
            };


          }
            
          }else{
            if (num == 1) {
              _this.setData({
                commoddata: []
              });
            } else {
              app.showToastC('没有更多数据了');
            };             
          };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        _this.setData({
          nodataiftr: true
        });
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
      }
    });
  },  
  // 基础信息调取数据
  floaddata: function () {  
    var _this = this;
    // 获取分类列表中的基础信息
    var q = Dec.Aese('mod=getinfo&operation=catebase&cate=' + _this.data.wcate + '&cate_id=' + _this.data.wcate_id + '&cid=' + _this.data.wcid);
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if (res.data.ReturnCode == 200) {
          var basicsInfo = res.data.Info;
          var basicsList = res.data.List;
          // 标题 描述
          if (basicsInfo) {
            if (basicsInfo.title) {
              wx.setNavigationBarTitle({
                title: basicsInfo.title || _this.data.name
              });
              _this.setData({
                iftrgetindes: basicsInfo.title || _this.data.name,
                c_title: basicsInfo.title || _this.data.name  
              });              
            };
            if (basicsInfo.desc) {
              _this.setData({
                desc: basicsInfo.desc.replace(/\\n/g, '\n') || ''
              });
            };

            // 描述
            var getindes = basicsInfo.desc || '';
            getindes = decodeURIComponent(getindes.replace(/\+/g, ' '));
            WxParse.wxParse('article', 'html', getindes, _this, 0);
          };

          // banner 数据
          var banlist = basicsList.banner||[];
          if (banlist.length != 0) {
            for (var j = 0; j < banlist.length; j++) {
              if (!app.signindata.reg.test(banlist[j].img)) {
                banlist[j].img = _this.data.zdyurl + banlist[j].img;
              };
            };
            _this.setData({
              movies: banlist
            });
          };
          // tab 导航
          var category = basicsList.category || [];
          if (category) {
            _this.setData({
              scrdata: category
            });
            if (category.length != 0) {
              _this.setData({
                tabbotimg: category[0].cat_id,
                item_type: category[0].item_type
              });
            }            
          };
        };
        // 商品列表
        _this.listdata(1);
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
        wx.hideLoading()
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();
        // 获取 tab 距离顶部的距离
        _this.queryMultipleNodes();        
      }
    });
  },
  // tab切换
  tabbotdata: function (w) {
    var _this = this;
    var cat_id = w.currentTarget.dataset.cat_id || w.target.dataset.cat_id || 0;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    _this.setData({
      tabbotimg: cat_id,
      item_type: item_type
    });
    // 获取list数据
    this.listdata(1);
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#q' + cat_id).boundingClientRect();
    query.exec(function (res) {
        if (res && res[0] ){
          _this.setData({
            scrollleft: w.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth / 2 + (res[0].width / 2)
          });
        };
    });
  },
  //  获取滚动条位置
  scrollleftf: function (event) {
    this.setData({
      scrolllefthq: event.detail.scrollLeft,
      scrollwidth: event.detail.scrollWidth
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    this.setData({
      nemscrollTop: e.scrollTop
    });
  },   
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.queryMultipleNodes();
  }, 
  // 获取DOM距离顶部距离
  queryMultipleNodes: function() {
    var _this = this;
    var query = wx.createSelectorQuery()
    query.select('#the_id').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      if (res && res[0]){
        _this.setData({
          nemscrollTopjisun: res[0].top || 12
        });
      };
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.commoddata.length != 0) {
      this.countdownbfun()
    };     
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);     
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.listdata(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.listdata(2);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    return {
      title: _this.data.iftrgetindes || '享受拆着买的极简生活，快来美拆和我一起拆吧',
      path: 'pages/classificationpage/classificationpage?cate=' + _this.data.wcate + '&cate_id=' + _this.data.wcate_id + '&cid=' + _this.data.wcid + '&wname=' + _this.data.name + '&wtype=' + _this.data.wtype,
      success: function (res) {

      }
    }    
  },
  // banner 跳转
  jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '';
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname, imgurl);
  },

  // 跳转首页
  frontpagebutton: function () {
    app.comjumpwxnav(998,'','');
  },
  // 公共跳转
  comjumpwxnav: function (item_type, whref, wname, imgurl) {
    var imgurl = imgurl||'';
    app.comjumpwxnav(item_type, whref, wname, imgurl)
  },   
  //  大图跳转
  comindellistjump: function (w) {
    var islist = w.currentTarget.dataset.islist || w.target.dataset.islist || 0;
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var detail = w.currentTarget.dataset.detail || w.target.dataset.detail || 0;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆';

    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);

  },
  // 大图+列表
  imgcomindellistjump: function (w) {
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆';
    // 公共跳转
    this.comjumpwxnav(item_type, whref, wname);
  },
  // 列表跳转
  imgcomindellistjumphuodong: function (w) {
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆';
    if (item_type == 0) {
      app.comjumpwxnav(1,gid,'');
    } else if (item_type == 9) {
      wx.navigateTo({ 
        url: "/pages/activitydetailspage/activitydetailspage?id=" + gid
      });
    };
  },
  // 倒计时
  countdownbfun: function () {
    var _this = this;
    clearInterval(_this.data.timer);
    var commoddata = _this.data.commoddata;
    var len = commoddata.length;//时间数据长度

    function nowTime() {//时间函数
      var iftrins = true;
      for (var i = 0; i < len; i++) {
        if (commoddata[i].show_type == 5) {
          // 获取现在的时间
          var nowTime = new Date();
          var nowTime = Date.parse(nowTime);//当前时间戳
          var lastTime = commoddata[i].stop_time * 1000;
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
            iftrins = false;
          };
        };

      };
      _this.setData({
        commoddata: commoddata
      });
      if (iftrins) {
        clearInterval(_this.data.timer);
      };
    }
    if (_this.data.commoddata.length != 0) {
      nowTime();
      clearInterval(_this.data.timer);
      _this.setData({
        timer: setInterval(nowTime, 1000)
      });
    };

  },
  // 加入购物车
  addtocart: function (w) {  
    var _this = this;
    if (_this.data.clicktherequestiftr){
      _this.setData({ clicktherequestiftr:false});

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
          _this.setData({ clicktherequestiftr: true });
          if (res.data.ReturnCode == 200) {
            app.showToastC('已成功加入购物车');
          } else if (res.data.ReturnCode == 802) {
            app.comjumpwxnav(1,gid,'');
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
    };

  },
  // 跳转签到 
  jumpsigin:function(){
    app.comjumpwxnav(9,'','');
  },
  imdetailspagejum:function(w){
    var goods_id = w.currentTarget.dataset.goods_id || w.target.dataset.goods_id || 0;
    wx.navigateTo({
      url: "/page/component/pages/imdetailspage/imdetailspage?goods_id=" + goods_id
    });
  },    

  recommend: function (w) {
    var gid = w.currentTarget.dataset.gid || w.target.dataset.gid;
    var _this = this
    // 统计新用户
    var qqqqq = Dec.Aese('mod=share&operation=dotactivity' + '&referee=' + _this.data.uid + '&activity_id=' + gid + '&type=3');
    wx.request({
      url: app.signindata.comurl + 'statistics.php' + qqqqq,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {

      },
      fail: function () { }
    });
  },      
})
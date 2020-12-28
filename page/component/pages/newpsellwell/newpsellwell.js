var Dec = require('../../../../common/public.js');//aes加密解密js
const app = getApp();
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
    // 上拉加载数据
    page: 0,
    category_id:'',

    c_title: '',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    ifOrWf:2
  },
  // 商品详情
  addressmanagement: function (event){
    var gid = event.currentTarget.dataset.gid || event.target.dataset.gid;
    wx.navigateTo({ 
      url: "/pages/detailspage/detailspage?gid=" +gid
    });
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    // 调取基础数据
    this.listdata(1);
  },
  onLoad: function (w) {
    var _this = this;
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      category_id: w.category_id||'',
      c_title: w.title || '',
    }); 
    // 推送统计
    _this.data.push_id = w.push_id || 0;
    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      // 判断是否授权 
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
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
            _this.onLoadfun();
          }
        }
      });  
    };  
    // if (_this.data.loginid != '' && _this.data.uid != '') {
    //   _this.onLoadfun();
    //   return false;
    // };
     
  },
  listdata: function (num) {  // num=1 下拉 num=2 上拉
    var _this = this;
    // 商品列表
    if (num == 1) {
      _this.data.page = 0;
      _this.setData({ headhidden: false, loadprompt: '加载更多.....', commoddata: [] });
      var q = Dec.Aese('mod=getinfo&operation=list&category_id=' + _this.data.category_id +'&uid=' + _this.data.uid + '&push_id='+_this.data.push_id);
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({ headhidden: false, loadprompt: '加载更多.....' });
      var q = Dec.Aese('mod=getinfo&operation=list&ltype=more&category_id=' + _this.data.category_id+'&pid=' + _this.data.page + '&uid=' + _this.data.uid + '&push_id='+_this.data.push_id);
    };
    wx.showLoading({ title: '加载中...', })
    wx.request({
      url: app.signindata.comurl + 'goods.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        _this.data.push_id =  0;
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh()
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          var arrlist = res.data.List;
          if (arrlist.length != 0) {
            for (var i = 0; i < arrlist.length; i++) {
              if (!app.signindata.reg.test(arrlist[i].gcover)) {
                arrlist[i].gcover = _this.data.zdyurl + arrlist[i].gcover;
              }
              arrlist[i].gpublish = _this.toDate(arrlist[i].gpublish);

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
              commoddata: comdataarr,
              nodataiftr: true
            });
          } else {
            if (num == 1) {
              clearInterval(_this.data.timer);
              _this.setData({
                commoddata: [],
                nodataiftr: true
              });
            } else {
              app.showToastC('没有更多数据了');
              _this.setData({ loadprompt: '没有更多数据了', nodataiftr: true });
            };
          };
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    });
  }, 
  // 计算图片大小
  imageLoadad: function (e) {
    var _this = this;
    var ind = e.currentTarget.dataset.ind || e.target.dataset.ind || 0;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;
    var viewHeight = 200,           //设置图片显示宽度，
      viewWidth = 200 * ratio;
    var commoddata = this.data.commoddata;
    if (viewWidth > 240) {
      viewWidth = 240;
    };
    if (commoddata[ind]) {
        _this.setData({
          ['commoddata[' + ind + '].width']: viewWidth
        })
    };
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
      return M + '-' + D;
    };
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
    return app.sharemc()
  },   
  onShareTimeline:function(){
    return {
      title:'潮玩社交平台',
      query:{}    
    }
  },
     
})
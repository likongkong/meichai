var Dec = require('../../common/public.js');//aes加密解密js
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
    openid: app.signindata.openid,
    // 商铺id
    store_id: '',  
    // 提现金额
    putforwardnumdata:[1],
    putforwardnum:1, 
    // 流水tab切换
    tabind:0,
    // 是否显示流水  是否显示提现
    flowingwaterputforward:false,
    comdata:{},
    page: 0,
    listdata:[],
    numiftr:true,
    txt:'用户昵称XX购买\n商品名称XXX*2\n商品名称XXX*3\n',
    nodataiftr:false,
    B: false, C: false,
    temporary_store_id: 0,
    // 公共默认信息
    defaultinformation: '',
    // 提示框
    comtipiftr:false,
    ifcomtipiftr:2,
    tips:'',
    // 提现防止多次点击判断
    iftrputfor:true,
    // 提现提示
    trompt:'100 立即提现',
    // 拆币不足提示
    is_cbb:false,
    // 是否是解锁
    iftrlock:true,
    // 手机号授权弹框
    ishowphone:false,
    c_title: '我的小金库',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
  },
  // 金额显示隐藏
  numiftrfun:function(){
    this.setData({ numiftr: !this.data.numiftr});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      store_id: app.signindata.store_id,
      temporary_store_id: options.store_id||0
    });
    // 判断是否授权
    this.tograntauthorization();
  },
  onLoadfun:function(){
    //  我的订单数据
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      store_id: app.signindata.store_id
    });
    if (app.signindata.store_id > 0) {
      _this.setData({ B: true, C: false });
    } else {
      _this.setData({ C: true, B: false });
    };

    wx.showLoading({ title: '加载中...', })
    var q = Dec.Aese('mod=info&operation=baseinfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'wallet.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
   
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          var rdiw = res.data.Info.wallet;
          var numdata = res.data.List.gear||[];
          if (numdata){
            if (numdata[0]){
              if (numdata[0].enable == 0){
                _this.setData({ trompt: numdata[0].point + ' 解锁' + numdata[0].value + '元提现档位', iftrlock: true })
              }else{
                _this.setData({ trompt: parseInt(numdata[0].value) * 100 + ' 立即提现', iftrlock:false });
              };
            };
            var iftrblock = true;
            for (var i = 0; i < numdata.length;i++){
              if (numdata[i].enable == 1 || iftrblock){
                numdata[i].iftr = true;
                if (numdata[i].enable == 0) { iftrblock = false; };
              }else{
                numdata[i].iftr = false;
              };
            };
            _this.setData({ putforwardnumdata: numdata})
          };
          if (rdiw){
            _this.setData({ comdata: rdiw});
          };
          if (_this.data.listdata.length==0){
            _this.listdata(1);
          };
        } else { 
          app.showToastC(res.data.Msg);
        };
      }
    });
    _this.listdata(1);
    // 活动提示语 
    var qhd = Dec.Aese('operation=info&mod=info');
    wx.request({
      url: app.signindata.comurl + 'general.php' + qhd,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        
        if (res.data.ReturnCode == 200) {
          var tips = res.data.Info.store.withdrawTip;
          if (tips){
            tips = decodeURIComponent(tips.replace(/\+/g, ' '));
            tips = tips.replace(/\\n/g, '\n');
            _this.setData({
              defaultinformation: res.data.Info,
              tips: tips,
              wxnum: res.data.Info.cs.wxid || 'meichai666666',
            });
          }

        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);
      }
    }); 
  },
  // 授权
  tograntauthorization: function () {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({ tgabox: false });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid;
          _this.data.openid = app.signindata.openid;
          _this.setData({
            uid: app.signindata.uid,
            store_id: app.signindata.store_id
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
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
              })
            }
          });




        }
      }
    });
  },





  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if (!this.data.flowingwaterputforward) {
      this.listdata(1);
    }else{
      // 刷新完自带加载样式回去
      wx.stopPullDownRefresh();
    };    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.flowingwaterputforward) {
      this.listdata(2);
    };    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    var _this = this;
    if (ops.from === 'button') {
      return {
        title: '开一家自己的解优杂货铺吧，分享赚钱，限时免费。',
        path: 'pages/storehomepage/storehomepage?referee=' + _this.data.store_id,
        success: function (res) {

        }
      }
    }else{
      return {
        title: '开一家自己的解优杂货铺吧，分享赚钱，限时免费。',
        path: 'pages/sputforward/sputforward',
        success: function (res) {

        }
      }     
    };     
  },
  // 获取提取钱数
  getnm:function(w){

    var _this = this;
    var putforwardnumdata = _this.data.putforwardnumdata;
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 1;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    if (putforwardnumdata[ind].enable==0){
      _this.setData({ trompt: putforwardnumdata[ind].point + ' 解锁' + num + '元提现档位', iftrlock:true});
    }else{
      _this.setData({ trompt: parseInt(num) * 100 + ' 立即提现', iftrlock:false });
    };
    this.setData({ putforwardnum: num});
  },
  // 提取金钱
  extractingmoney:function(){
    var _this = this;
    wx.showLoading({ title: '加载中...', })
    if (_this.data.iftrputfor){
      _this.data.iftrputfor = false;
      var putforwardnumdata = _this.data.putforwardnumdata;
      var putforwardnum = _this.data.putforwardnum;
      var iftrnum = '';
      for (var i = 0; i < putforwardnumdata.length;i++){
        if (putforwardnum == putforwardnumdata[i].value){
           iftrnum = putforwardnumdata[i].enable;
        }
      };
      if (iftrnum==0){
        
        var q = Dec.Aese('mod=operate&operation=opengear&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gear=' + _this.data.putforwardnum)
        wx.request({
          url: app.signindata.comurl + 'wallet.php' + q,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
           
            wx.hideLoading()
            if (res.data.ReturnCode == 200) {
              app.showToastC('解锁成功');
              var putforwardnumdata = _this.data.putforwardnumdata;
              var putforwardnum = _this.data.putforwardnum;
              var iftrnum = '';
              var iftrblock = true;
              for (var i = 0; i < putforwardnumdata.length; i++) {
                if (putforwardnum == putforwardnumdata[i].value) {
                  putforwardnumdata[i].enable = 1;
                  iftrnum = i;
                };
                if (putforwardnumdata[i].enable == 1 || iftrblock) {
                  putforwardnumdata[i].iftr = true;
                  if (putforwardnumdata[i].enable == 0) { iftrblock = false;}
                } else {
                  putforwardnumdata[i].iftr = false;
                };

              };

              _this.setData({
                putforwardnumdata: putforwardnumdata
              })
              if (putforwardnumdata[iftrnum].enable == 0) {
                _this.setData({ trompt: putforwardnumdata[iftrnum].point + ' 解锁' + putforwardnumdata[iftrnum].value + '元提现档位', iftrlock: true })
              } else {
                _this.setData({ trompt: parseInt(putforwardnumdata[iftrnum].value) * 100 + ' 立即提现', iftrlock: false });
              };
            } else {
              if (res.data.ReturnCode == 1251){
                _this.setData({
                  is_cbb: true
                });
              }else{
                app.showToastC(res.data.Msg);
              };

            };
            wx.hideLoading()
            _this.data.iftrputfor = true;
          }
        });        
      }else{
        // 已解锁
        
        var q = Dec.Aese('mod=operate&operation=withdraw&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&money=' + _this.data.putforwardnum.toFixed(2))
        wx.request({
          url: app.signindata.comurl + 'wallet.php' + q,
          method: 'GET',
          header: { 'Accept': 'application/json' },
          success: function (res) {
           
            wx.hideLoading()
            if (res.data.ReturnCode == 200) {
              app.showToastC('提现成功，请注意查收');
              _this.onLoadfun();
            } else {
              if (res.data.ReturnCode == 1251) {
                _this.setData({
                  is_cbb: true
                });
              } else if (res.data.ReturnCode == 1212){
                _this.setData({
                  ishowphone:true
                });
              } else {
                app.showToastC(res.data.Msg);
              };
            };
            wx.hideLoading()
            _this.data.iftrputfor = true;
          }
        });
      };

    };
     
  },
  // 手机号授权弹框
  dialogClick:function(){
    this.setData({
      ishowphone: !this.data.ishowphone
    });
  },

  getPhoneNumber: function (e) {
    var _this = this
    
    if (e.detail.errMsg == 'getPhoneNumber: ok' || e.detail.errMsg == "getPhoneNumber:ok") {  //授权通过执行跳转
      wx.login({
        success: function (res) {
          if (res.code) {
            var encryptedData = e.detail.encryptedData||'';
            var iv = e.detail.iv||'';
            var code = res.code||'';
            //发起网络请求
            
            var q = Dec.Aese('mod=info&operation=bindinfo&key=phone&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&code=' + code + '&iv=' + iv + '&encryptedData=' + encryptedData)
            wx.request({
              url: app.signindata.comurl + 'user.php' + q,
              method: 'GET',
              header: { 'Accept': 'application/json' },
              success: function (res) {
          
                if (res.data.ReturnCode == 200) {
                  _this.setData({ ishowphone: false});
                  _this.extractingmoney();
                } else if (res.data.ReturnCode == 1251) {
                  _this.setData({ ishowphone: false});
                } else {
                  _this.setData({ ishowphone: false });
                  app.showToastC(res.data.Msg);
                };
              }
            });
          } else {
        
          }
        }
      });




    } else { 






    };

  },

  // tab 切换
  sshpofboxtab: function (w) {
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    this.setData({
      tabind: ind
    });
    if (!this.data.flowingwaterputforward) {
      this.listdata(1);
    };    
  }, 
  //  流水和提现页面切换
  fwpffun:function(){
    this.setData({ flowingwaterputforward: !this.data.flowingwaterputforward});
    if (!this.data.flowingwaterputforward){
      this.listdata(1);
    };
  },
  // 流水
  listdata:function(num){
    var _this = this;
    if (num == 1) {
      _this.setData({listdata: [] });
      _this.data.page = 0;
    } else {
      var pagenum = parseInt(_this.data.page);
      _this.data.page = ++pagenum;
    };     
    wx.showLoading({ title: '加载中...', })
    var q = Dec.Aese('mod=info&operation=record&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&status=' + _this.data.tabind + '&page=' + _this.data.page)
    wx.request({
      url: app.signindata.comurl + 'wallet.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
     
        _this.setData({ nodataiftr:true });
        wx.hideLoading()
        // 刷新完自带加载样式回去
        wx.stopPullDownRefresh();        
        if (res.data.ReturnCode == 200) {
          var listdata = res.data.List.record;
          if (listdata && listdata.length!=0){
            for (var i = 0; i < listdata.length; i++) {
              listdata[i].record_time = _this.toDate(listdata[i].record_time);
            };
            if (num == 1) {
              var rdldata = listdata;
            } else {
              var rdldata = _this.data.listdata.concat(listdata);
            };            
            _this.setData({ listdata: rdldata });
          }else{
            if (num == 1){
              _this.setData({ listdata: [] })
            };
            app.showToastC('暂无更多数据');            
          };
          
        } else {
          app.showToastC(res.data.Msg);
        };
      }
    });
  },
  // 金库排行榜
  bestput:function(){
    wx.navigateTo({
      url: "/pages/streasurylist/streasurylist"
    });
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
      return Y + '-' +M + '-' + D;
    }
  },  
  // 提示说明
  tipputsm:function(){
    this.setData({
      comtipiftr:true
    });
  },
  hidcomtip: function () {
    this.setData({
      comtipiftr: false
    });
  },
  apphidcomtip:function(){
    this.setData({
      is_cbb:false
    });
  },
  jumptask:function(){    
    wx.navigateTo({    //签到
      url: "/page/component/pages/newsignin/newsignin"
    }); 
    this.setData({
      is_cbb: false
    });       
  }  




})
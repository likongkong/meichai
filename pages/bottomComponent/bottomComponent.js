// pages/bottomComponent/bottomComponent.js
var Dec = require('../../common/public.js');//aes加密解密js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isProduce: {
      type: Boolean,
      value: false,
    }, 
    isIphoneX:{
      type: Boolean,
      value: false,
    },
    shopnum:{
      type: Number,
      value: 0,
    },
    dryinglistnum:{
      type: Number,
      value: 0,
    },
    whomepage: {
      type: Boolean,
      value: false,
    },
    dlfind: {
      type: Boolean,
      value: false,
    },
    wnews: {
      type: Boolean,
      value: false,
    },
    wCart: {
      type: Boolean,
      value: false,
    },
    wmy: {
      type: Boolean,
      value: false,
    },
    isChar: {
      type: Boolean,
      value: true,
    },
    fashionShow: {
      type: Boolean,
      value: false,
    }   
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,

    exhdata:'',
    subscribedata:{
      template_id:['Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0'],
      subscribe_type:['15']
    },
    exhtipbox:false,
    subscribeCouponTip:'',
    is_show_modal:true,
    isOpenToyShow:1596729599<Date.parse(new Date())/1000&&Date.parse(new Date())/1000<1596988799?true:false,
    // isOpenToyShow:1596104581<Date.parse(new Date())/1000<1596988799?true:false
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 导航跳转
    whomepage: function (e) {
      var _this = this
      if (_this.properties.whomepage) {
        this.triggerEvent("run");
        return;
      }
      wx.reLaunch({
        url: "/pages/index/index"
      });
    },
    // 潮玩展
    fashionShow:function(){
      var _this = this;
      if (_this.properties.fashionShow) {
        this.triggerEvent("run");
        return;
      }; 

      var timestamp = Date.parse(new Date()) / 1000;
      if(app.signindata.isOpenToyShow){
        wx.navigateTo({
          url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
        });
      }else if(timestamp>=1618588800){
        wx.navigateTo({
          url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
        });
      }else{
        if(app.signindata.loginid!='' && app.signindata.uid!=''){
          _this.data.is_show_modal = true;
          wx.navigateTo({
            url: "/pages/dismantlingbox/dismantlingbox"
          });

          // if(_this.data.exhdata){
          //   _this.exhtiphidden();
          // }else{
          //   wx.request({
          //     url: 'https://cdn.51chaidan.com/common/toyShowAlert.json',
          //     method: 'GET',
          //     header: { 'Accept': 'application/json' },
          //     success: function (res) {
          //         console.log(res)
          //         if(res.data.ReturnCode==200){
          //           _this.setData({
          //             exhdata:res.data,
          //             subscribedata:res.data.subscribe
          //           })
          //           _this.exhtiphidden();
          //         };
          //     },
          //     fail: function (res) {}
          //   });
          // };
        }else{
          this.triggerEvent("runex",true);
        }
      }
    },
    // 导航跳转 
    wnews: function () {
      var _this = this;
      if (_this.properties.wnews) {
        this.triggerEvent("run");
        return;
      }

      if(app.signindata.isYiFanShang){
        wx.redirectTo({  // 一番赏
          url: "/page/secondpackge/pages/aRewardList/aRewardList"
        });
      }else{
        app.showToastC('暂未开放敬请期待');
      }      
      
    },
    wshoppingCart: function () {
      var _this = this;
      if (_this.properties.wCart) {
        return;
      }
      wx.redirectTo({
        url: "/pages/shoppingCart/shoppingCart",
        complete: function () { }
      });
    },
    wmy: function () {
      var _this = this;
      if (_this.properties.wmy) {
        return;
      }
      wx.redirectTo({
        url: "/pages/wode/wode",
      });
    },
    dlfindfun: function () {
      var _this = this;
      if (_this.properties.dlfind) {
        this.triggerEvent("run");
        return;
      }
      wx.reLaunch({
        url: "/page/component/pages/dlfind/dlfind",
      })
    },
    // 新增
    // 订阅
    comsubscribetip:function(){
      var _this = this;
      _this.subscrfun(_this)
    },
    // 图片跳转
    jumpimg:function(w){
      var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
      var url = w.currentTarget.dataset.url || w.target.dataset.url || 0;
      app.comjumpwxnav(type,url,'');
    },
    exhtiphidden:function(){
      this.setData({
        exhtipbox:!this.data.exhtipbox
      })
    },
    // 拉起订阅
    subscrfun: function () {
      var _this = this;
      // this.setData({
      //   exhtipbox:false
      // })
      var subscribedata = _this.data.subscribedata || '';
      if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
        if (subscribedata.template_id instanceof Array) {
          wx.requestSubscribeMessage({
            tmplIds: subscribedata.template_id || [],
            success(res) {
              for (var i = 0; i < subscribedata.template_id.length; i++) {
                if (res[subscribedata.template_id[i]] == "accept") {
                  _this.subscribefun(_this, 1, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                };
              };
            },
            complete() { }
          })
        } else {
          wx.requestSubscribeMessage({
            tmplIds: [subscribedata.template_id || ''],
            success(res) {
              if (res[subscribedata.template_id] == "accept") {
                _this.subscribefun(_this, 1, subscribedata.template_id, subscribedata.subscribe_type);
                _this.subshowmodalfun();
              };
            }
          })
        };
      };
    },
    // 订阅统计
    subscribefun: function (_this, num, template_id, subscribe_type){
      var _this = _this;
      var subscribedata = _this.data.subscribedata || '';
      if (num == 1) {
        var subscribe_id = 0;
      } else {
        var subscribe_id = _this.data.id
      };
      var q1 = Dec.Aese('mod=subscribe&operation=accept&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid + '&subscribe_type=' + subscribe_type + '&template_id=' + template_id + '&subscribe_id=' + subscribe_id);
      wx.request({
        url: app.signindata.comurl + 'statistics.php' + q1,
        method: 'GET',
        header: { 'Accept': 'application/json' },
        success: function (res) {
          console.log(res)
          if(res.data.ReturnCode==202){
            _this.data.subscribeCouponTip = res.data.Msg||'';
          }
          if (_this.data.is_show_modal) {
            _this.subshowmodalfun();
            _this.data.is_show_modal = false;
          };
        }
      });
    },
    subshowmodalfun: function () {
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '订阅成功',
        showCancel: false,
        success: function (res) {
          _this.setData({
            subscribeCouponTip:''
          })
        }
      })
    },







  }
})

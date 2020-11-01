const app = getApp();
var Dec = require('../../common/public.js');//aes加密解密js
Component({
  properties: {    
    // 标题名称  
    title: {
      type: String,
      value: ''
    }
  },
  data: {
    // 是否显示万圣节悬浮标签
    isHalloween:false,
    halloweenScore:app.signindata.halloweenScore,
    is_show_modal:true,
    subscribedata:{
      template_id:['Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0'],
      subscribe_type:['15']
    },
    btTimg:Date.parse(new Date())/1000<1604246399?true:false,

  },
  ready:function(){
    var _this = this;
    _this.setData({
      halloweenScore:app.signindata.halloweenScore
    });
    wx.request({
      url:'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/wsjStartTime.txt',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        
        if (res.data) {
          var time = Date.parse(new Date())/1000;
          console.log('是否开启万圣节活动',time>=res.data,res)
          if(time>=res.data){
            _this.setData({
              isHalloween:true
            });            
          }else{
            _this.setData({
              isHalloween:false
            });             
          };
        };  
      },
      fail: function (res) {}
    })

  },
  methods: {
    // 返回上一页
    gateback: function () {
      wx.navigateTo({
        url: "/pages/modifythenickname/modifythenickname"
      });
    },
    // 万圣节南瓜数量
    indexShareBanner:function(){
      var _this = this;
      setTimeout(function(){
          var q = Dec.Aese('mod=festival&operation=scoreWSJ&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid);
          console.log(Dec.comurl() + 'spread.php?'+'mod=festival&operation=scoreWSJ&uid=' + app.signindata.uid + '&loginid=' + app.signindata.loginid)
          wx.request({
            url: Dec.comurl() + 'spread.php' + q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              console.log('万圣节南瓜数量',res)
              if (res.data.ReturnCode == 200) {
                if(res.data.Info&&res.data.Info.festival){
                  _this.setData({
                    halloweenScore : res.data.Info.festival.score||0
                  })
                  app.signindata.halloweenScore = res.data.Info.festival.score||0;
                }
              };  
            },
            fail: function (res) {}
          }) 
      },1500);
   
    },

    // 拉起订阅
    subscrfun: function () {
      var _this = this;
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
    }



  },

  



})
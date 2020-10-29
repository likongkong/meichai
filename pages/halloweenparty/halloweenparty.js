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
    isHalloween:app.signindata.isHalloween,
    halloweenScore:app.signindata.halloweenScore
  },
  ready:function(){
    var _this = this;
    _this.setData({
      // 是否显示万圣节悬浮标签
      isHalloween:app.signindata.isHalloween,
      halloweenScore:app.signindata.halloweenScore
    });
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
   
    }

  },



})
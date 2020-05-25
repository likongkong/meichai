const app = getApp();
var Dec = require('../../common/public.js'); //aes加密解密js

Component({

  lifetimes: {
    attached() {
      var _this = this
      if (!app.signindata.awardOrder){
        return;
      }
      if (app.signindata.awardOrder && app.signindata.awardOrder.Info && app.signindata.awardOrder.Info.overtime && typeof(app.signindata.awardOrder.Info.overtime) !="undefined") {
          _this.data.interval = setInterval(function() {
            //将时间传如 调用 
            // var clock = _this.dateformat(app.signindata.freeOvertime);
              var clock = _this.dateformat(app.signindata.awardOrder.Info.overtime);
              if (clock <= 0) {
                clearInterval(this.data.interval)
              }
              _this.setData({ //正常倒计时        
                overtime: clock
              });
          }.bind(_this), 1000);

          _this.setData({
            isAwardOrder: app.signindata.isAwardOrder,
            awardOrder: app.signindata.awardOrder
          })
      };
    },

    detached() {
      // 在组件实例被从页面节点树移除时执行
      clearInterval(this.data.interval)
    },
  },

  properties: {

  },

  data: {
    isAwardOrder: false,
    awardOrder: false,
    overtime: '',
    interval: '',
  },

  methods: {
    // 这里是一个自定义方法
    customMethod() {},

    getappData() {
      var _this = this

      if (!app.signindata.awardOrder) {
        return;
      }
      if (app.signindata.awardOrder && app.signindata.awardOrder.Info && app.signindata.awardOrder.Info.overtime && typeof(app.signindata.awardOrder.Info.overtime) != "undefined") {
        _this.data.interval = setInterval(function() {
          //将时间传如 调用 
          // var clock = _this.dateformat(app.signindata.freeOvertime);
          var clock = _this.dateformat(app.signindata.awardOrder.Info.overtime);
          if (clock <= 0) {
            clearInterval(this.data.interval)
          }
          _this.setData({ //正常倒计时        
            overtime: clock
          });
        }.bind(_this), 1000);

        _this.setData({
          isAwardOrder: app.signindata.isAwardOrder,
          awardOrder: app.signindata.awardOrder
        });
      };
    },

    jumporder() {
      var _this = this;
      setTimeout(function() {
        var awardOrder = _this.data.awardOrder ||{};
        if (awardOrder.Info){
          if (awardOrder.Info.url){
            wx.navigateTo({
              url: awardOrder.Info.url
            });
          }else{
            wx.navigateTo({
              url: "/pages/myorder/myorder?tabnum=" + 0
            });
          };
        }else{
          wx.navigateTo({
            url: "/pages/myorder/myorder?tabnum=" + 0
          });
        };
      }, 100);
    },

    // 时间格式化输出，将时间戳转为 倒计时时间
    dateformat(micro_second) {

      var timestamp = Date.parse(new Date())
      //总的秒数 
      var second = micro_second - (timestamp / 1000);
      if (second > 0) {

        var hr = Math.floor(second / 3600);
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
        return hrStr + ":" + minStr + ":" + secStr;
      } else {
        return 0;
      }
    }
  }


})
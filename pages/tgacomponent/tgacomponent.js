const app = getApp();
Component({
  properties: {},
  data: {
    tgaimg: ''
  },
  ready:function(){
    var _this = this;
    wx.request({
      url: 'http://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/openScreen.json',
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        if(res.data && res.data.List && res.data.List.openscreen){
          var openscreen = res.data.List.openscreen || [];
          var imgnum = Math.floor(Math.random() * openscreen.length) || 0;
          if(openscreen[imgnum]){
            var nowTime = Date.parse(new Date());//当前时间戳
            var imgUrl = openscreen[imgnum]+'?time=' + nowTime;
            _this.setData({
              tgaimg: imgUrl
            });
          }
        };    
      },
      fail: function (res) {}
    }) 

  },
  methods: {
    clicktga:function() {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      this.triggerEvent("run", myEventDetail);
    },
    userInfoHandler:function(e){
      const myEventDetail = e;
      this.triggerEvent("userinfo", myEventDetail);
    },
    tgatipnone:function(){
      this.triggerEvent("tgnone");
    }
  },



})
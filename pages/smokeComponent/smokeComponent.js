var Dec = require('../../common/public.js'); //aes加密解密js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    colortitle: { // 属性名
      type: String,
      value: "#fff"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 接口地址
    comurl: app.signindata.comurl,
    // 图片地址
    zdyurl: Dec.zdyurl(),

    dataList: []
  },

  lifetimes: {

    attached: function() {
      var _this = this;
      setTimeout(function(){
          wx.request({
            url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/recommedBlindbox.json?time='+app.signindata.appNowTime,
            method: 'GET',
            header: {'Accept': 'application/json'},
            success: function(res) {
              if(res.data.ReturnCode == 200){
                console.log('smokeComponent=============Json',res)
                if(res.data.List){
                  if(res.data.List.activity){
                    var actArr = res.data.List.activity || [];
                    if(actArr && actArr.length !=0){
                      if(actArr.length <= 5){
                        _this.setData({
                          dataList:actArr,
                        });
                      }else{
                        _this.setData({
                          dataList: app.getRandomArrayElements(actArr,4) || [],
                        });
                      };
                    };
                  }
                }
              }
            }
          });
      },500);
    },
    moved: function() {},
    detached: function() {},
  },

  methods: {
    // 在线抽盒机
    bbevebox: function(event) {
      var id = event.currentTarget.dataset.gid || event.target.dataset.gid;
      var _this = this;
      wx.navigateTo({
        url: "/pages/smokebox/smokebox?gid=" + id
      });
    },

    jumplist: function() {
      app.comjumpwxnav(988,'','');
    }
  },

})
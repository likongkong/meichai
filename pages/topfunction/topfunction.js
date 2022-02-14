const app = getApp();
Component({
  properties: {    
    // 标题名称  
    title: {
      type: String,
      value: ''
    },
    arrow:{
      type: Boolean,
      value: true      
    }, 
    // 分享进入不显示箭头
    is_share: {
      type: Boolean,
      value: false
    },
    backcolor:{
      type:String,
      value:'#ff2742'
    },
    txtcolor:{
      type:String,
      value:'#ffffff'
    },
    previewData:{
      type:Object,
      observer(newVal){
        console.log(newVal)
      }
    }
  },
  data: {
    topheight:130,
  },
  ready:function(){
    console.log(1111111111,this.data.previewData)
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          topheight : res.statusBarHeight+44 || 90
        });

      }
    })
  },
  methods: {
    // 返回上一页
    gateback: function () {
      let pages = getCurrentPages();
      let prevpage = pages[pages.length - 2];
      if (prevpage) {
        wx.navigateBack();
        console.log(this.data.previewData)
        if(this.data.previewData){
          prevpage.data.id = this.data.previewData.setGoodsStatusData.id;
          prevpage.data.callbackPreview = true;
        }
      } else {
        //获取当前时间戳  
        var timestamp = Date.parse(new Date()) / 1000; 
        if(timestamp>=1588175999 && timestamp<1588607999){
          wx.reLaunch({
            url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
          })
        }else{
          app.comjumpwxnav(998,'','');
        };

      };
    },
    jumphomepage:function(){
      //获取当前时间戳  
      var timestamp = Date.parse(new Date()) / 1000; 
      if(timestamp>=1588175999 && timestamp<1588607999){
        wx.reLaunch({
          url: "/page/secondpackge/pages/exhibitionlist/exhibitionlist"
        })
      }else{
        app.comjumpwxnav(998,'','');
      };      

    },
  },



})
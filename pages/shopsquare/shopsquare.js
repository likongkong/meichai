
var COS = require('../../common/cos-wx-sdk-v5.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '一番赏', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,  
    movies:[
      {
        href: "33817", 
        image: "https://cdn.51chaidan.com//data/afficheimg/33817.jpg", 
        type: "1", 
        title: "咪咪嘎嘎吊卡", 
        item_type: "1"
      }
    ],
    dateDate:[{'id':1,name:'8月7日'},{'id':2,name:'8月8日'},{'id':3,name:'8月9日'}],
    checkid:1,
    imgdata:[
      {
        src:'https://cdn.51chaidan.com//images/hiddenFragments/1580710232.png',
        name:'08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/34325_5_1594984147.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/33719_56_1588063522.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/202007/thumb_img/34326_thumb_G_1594969369893.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/34325_5_1594984147.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/33719_56_1588063522.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/202007/thumb_img/34326_thumb_G_1594969369893.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/34325_5_1594984147.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/33719_56_1588063522.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/202007/thumb_img/34326_thumb_G_1594969369893.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/34325_5_1594984147.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/33719_56_1588063522.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/202007/thumb_img/34326_thumb_G_1594969369893.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/34325_5_1594984147.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/spread/blindBox/33719_56_1588063522.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      },
      {
        src:'https://cdn.51chaidan.com/images/202007/thumb_img/34326_thumb_G_1594969369893.jpg',
        name:'08.17 18:00抽签08.17 18:00抽签08.17 18:00抽签'
      }
    ]
  },
  clickcheck:function(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    this.setData({
      checkid:id
    })
  },
  // banner 跳转
  jumpbanner: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type||0;
    var imgurl = w.currentTarget.dataset.imgurl || w.target.dataset.imgurl || '';
    var wname = w.currentTarget.dataset.title || w.target.dataset.title || '美拆'; 
    // 公共跳转
    app.comjumpwxnav(item_type, whref, wname, imgurl);

  },
  upload: function(){
    var _this = this;
    var cos = new COS({
      SecretId: 'AKIDmY0RxErYIm2TfkckG8mEYbcNA4wYsPbe',
      SecretKey: '4WkpgJ5bJlU4B6wNuCG4EDyVnGWUFhw1',
    });

    // 先选择文件，得到临时路径
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图original还是压缩图compressed，默认用原图
      sourceType: ['camera'], // 'album'相册  camera 相机
      success: function (res) {
          console.log(res)
          var filePath = res.tempFiles[0].path;

          //获取最后一个.的位置
          var index= filePath.lastIndexOf(".");
          //获取后缀
          var ext = filePath.substr(index+1);

          var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
          console.log('filename====',filename,'filePath=====',filePath,'ext=====',ext);
          console.log('图片地址===','toyshow/sign/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext)
          cos.postObject(
              {
                Bucket: 'meichai-1300990269',
                Region: 'ap-beijing',
                Key: 'toyshow/sign/'+ new Date().getTime() +'_'+ app.signindata.uid+ '.'+ext,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(JSON.stringify(info));
                }
              },
              function (err, data) {
                  console.log(err || data);
              }
          );
      }
    });



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // 判断是否授权
      this.activsign();
  },
  onLoadfun:function(){
    var _this = this;
    // '已经授权'
    _this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      avatarUrl: app.signindata.avatarUrl,
      isShareFun: app.signindata.isShareFun,
      isProduce: app.signindata.isProduce
    });
    
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          _this.activsign();
          // 确认授权用户统计
          app.clicktga(4);          
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8)  //用户按了拒绝按钮
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // '已经授权'
          _this.setData({
            loginid: app.signindata.loginid,
            uid: app.signindata.uid,
            openid: app.signindata.openid,
            avatarUrl: app.signindata.avatarUrl,
            isShareFun: app.signindata.isShareFun,
            isProduce: app.signindata.isProduce,
            signinlayer: true,
            tgabox: false
          });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this);
          }
        } else {
          console.log(11111111111111111111111111111)
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(42);
          _this.onLoadfun();
        }
      }
    });      
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
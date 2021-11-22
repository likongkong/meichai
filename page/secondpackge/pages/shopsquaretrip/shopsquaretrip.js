
var COS = require('../../../../common/cos-wx-sdk-v5.js');

var Dec = require('../../../../common/public.js'); //aes加密解密js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: 'MCTS打卡福利', 
    c_arrow: false,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,  
    movies:[],
    pid:0,
    page:0,
    timedata:'',
    rewardbox:false,
    rewardbdata:{},
    // 防止重复提交
    pmc:true,
    audit_tips:'',
    mapImgDisplay:false,
    sormUrl:'',
    bid:'' , // 品牌id
  },
  // 图片预览
  previewImg: function (w) {
    var index = 0;
    var sormUrl = this.data.sormUrl||'https://cdn.51chaidan.com/images/sign/toyShowBrandPosition.jpg';
    var imgArr = [sormUrl];
    wx.previewImage({
      current: imgArr[index],    
      urls: imgArr,               
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  mapImgDisplayfun:function(w){
    var type = w.currentTarget.dataset.type || w.target.dataset.type||1;
    var sormUrl = ''
    if(type=='map'){
      sormUrl = 'https://cdn.51chaidan.com/images/sign/toyShowBrandPosition.jpg?';
    }else{
      sormUrl = 'https://cdn.51chaidan.com/images/spread/toyShow/daka_explain.jpg'
    }
    this.setData({
      mapImgDisplay:!this.data.mapImgDisplay,
      sormUrl:sormUrl
    })
  },
  // 跳转详情
  jumpdetail:function(){
     if(this.data.rewardbdata&&this.data.rewardbdata.is_goods==2){
       var gid = this.data.rewardbdata.goods_id || '';
        app.detailspage(gid)
     };
  },
  // 领取奖励
  receiverewards:function(w){
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    
    wx.showModal({
      title:'打卡奖励',
      content:_this.data.rewardbdata.draw_tips_two,
      showCancel:true,
      cancelText:'领取成功',
      cancelColor:'#ff2840',
      confirmText:'未领取',
      confirmColor:'#ccc',
      success: function (res) {
          if (res.cancel){
              if(_this.data.pmc){
                _this.data.pmc = false;
                var q1 = Dec.Aese('mod=brandsignin&operation=collectGifts&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gift_id=' + id + '&time='+ _this.data.timedata);

                console.log('mod=brandsignin&operation=collectGifts&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&gift_id=' + id + '&time='+ _this.data.timedata)
                wx.showLoading({ title: '加载中...', })
                wx.request({
                  url: app.signindata.comurl + 'spread.php' + q1,
                  method: 'GET',
                  header: {'Accept': 'application/json'},
                  success: function(res) {
                    wx.hideLoading()
                    _this.data.pmc = true;
                    console.log('获取礼物=====',res)
                    wx.showModal({
                      content: res.data.Msg || res.data.msg,
                      success: function (res) {
                        _this.getlist(1);
                        _this.rewardboxhidden();
                      }
                    });
                  },

                })
              }
          };
      }
    });




  },
  clickcheck:function(w){
    // var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    // this.setData({
    //   timedata:id
    // })
    // this.getlist(1);
    // this.allpunchrecords(1);
  },
  rewardboxhidden:function(){
    this.setData({
      rewardbox:false
    })
  },
  rewardboxfun:function(w){
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var rewardbdata = this.data.giftList[ind] || [];
    this.setData({
      rewardbdata:rewardbdata,
      rewardbox:true
    });
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

  uploaddata:function(w){
    var _this = this;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var examine_status = w.currentTarget.examine_status || w.target.dataset.examine_status || 0;
    if(examine_status==0){
          wx.showModal({
            title:'提示',
            content:_this.data.audit_tips,
            showCancel:true,
            cancelText:'重新上传',
            cancelColor:'#ff2840',
            confirmText:'取消',
            confirmColor:'#ccc',
            success: function (res) {
                if (res.cancel) {
                    _this.upload(ind,id)
                };
            }
          });
    }else{
      _this.upload(ind,id)
    };
  },

  upload: function(ind,id){
    
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
  
          wx.showLoading({
            title: '加载中...',
          })
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
                  console.log(data);
                  if(data){
                      if(_this.data.pmc){
                          _this.data.pmc = false;                      
                          var q1 = Dec.Aese('mod=brandsignin&operation=addSignIn&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&brandid=' + id +'&clockin_img=' +data.Location + '&time='+ _this.data.timedata);

                          console.log('mod=brandsignin&operation=addSignIn&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&brandid=' + id +'&clockin_img=' +data.Location + '&time='+ _this.data.timedata)

                          wx.request({
                            url: app.signindata.comurl + 'spread.php' + q1,
                            method: 'GET',
                            header: {'Accept': 'application/json'},
                            success: function(res) {
                              wx.hideLoading();
                              _this.data.pmc = true;
                              console.log('上传图片=====',res)
                              wx.showModal({
                                content: res.data.Msg || res.data.msg,
                                showCancel:false,
                                success: function (res) {
                                  _this.getlist(1)
                                }
                              });
                            },
                          })
                      }
                  }else{
                    wx.hideLoading()
                  };
                  console.log('err============',err)
                  if(err){
                      wx.showModal({
                        content: err,
                        showCancel:false,
                        success: function (res) {}
                      });
                  }



              }
          );
      }
    });



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this;
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      _this.data.bid = _this.getSearchString('bid', scene) || 0;
      // 推送统计
      this.data.push_id = _this.getSearchString('push_id', scene) || 0;
    } else {
      this.data.bid = options.bid||0;
      // 推送统计
      this.data.push_id = options.push_id || 0;
    }

    if(app.signindata.sceneValue==1154){
      this.onLoadfun();
    }else{
      // 判断是否授权
      this.activsign();
    }

  },

  //key(需要检错的键） url（传入的需要分割的url地址）
  getSearchString: function (key, Url) {
    // 获取URL中?之后的字符
    var str = Url;
    var arr = str.split("&");
    var obj = new Object();

    // 将每一个数组元素以=分隔并赋给obj对象 
    for (var i = 0; i < arr.length; i++) {
      var tmp_arr = arr[i].split("=");
      obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
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
    
    _this.getlist(1);
    _this.allpunchrecords(1)
  },
  // 所有打卡记录
  allpunchrecords:function(num){

    var _this = this
    wx.showLoading({
      title: '加载中...',
    })

    if (num==1){
      _this.data.page = 0;
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=brandsignin&operation=allClockinList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + _this.data.page +'&time='+ _this.data.timedata);

    console.log('mod=brandsignin&operation=allClockinList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + _this.data.page +'&time='+ _this.data.timedata)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('所有打卡记录=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
          if(num==1){
            var allClockinListNum = res.data.List.allClockinList || [];
          }else{
            var liveList = res.data.List.allClockinList || [];
            console.log('品牌信息=======2',res)
            var allClockinListNum = _this.data.allClockinList.concat(liveList);
            if(res.data.List.allClockinList.length==0){
              app.showToastC('没有更多数据了');
            }
          };
          _this.setData({
            allClockinList:allClockinListNum
          })
       };
      },
    })
  },
  // 品牌列表
  getlist: function(num) {
    var _this = this
    wx.showLoading({
      title: '加载中...',
    })

    if (num==1){
      _this.data.pid = 0;
    }else{
      var pagenum = _this.data.pid;
      _this.data.pid = ++pagenum;
    };

    var q1 = Dec.Aese('mod=brandsignin&operation=brandList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + _this.data.pid +'&time='+ _this.data.timedata+ '&push_id='+_this.data.push_id);
    
    console.log('mod=brandsignin&operation=brandList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + "&pid=" + _this.data.pid +'&time='+ _this.data.timedata+ '&push_id='+_this.data.push_id)

    wx.request({
      url: app.signindata.comurl + 'spread.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        _this.data.push_id =  0;
        console.log('listdata=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading()
        if (res.data.ReturnCode == 200) {
           var expoList = res.data.List.expoList || [];
           var timeTab = res.data.List.timeTab || [];
           var myClockinList = res.data.List.myClockinList || {};
           var giftList = res.data.List.giftList || [];
           var RotationList = res.data.List.RotationList || [];
           var timedata = '';
           var audit_tips = res.data.List.audit_tips || '';
           if(timeTab&&timeTab.length!=0){
             for( var i=0; i<timeTab.length; i++ ){
                if(timeTab[i].status==1){
                  timedata = timeTab[i].data_time
                };
             };
           };
           _this.setData({
              expoList:expoList,
              timeTab:timeTab,
              myClockinList:myClockinList,
              giftList:giftList,
              timedata:timedata,
              movies:RotationList,
              audit_tips:audit_tips
           });
        };
      },

    })
  },
  // 点击登录获取权限
  userInfoHandler: function (e) {
    var _this = this;
    wx.getSetting({
      success: res => {
        if (true) {
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
        if (true) {
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
    this.getlist(1);
    this.allpunchrecords(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.allpunchrecords(2);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      var _this = this;
      var movies = _this.data.movies;
      var img = 'https://cdn.51chaidan.com/images/default/shareImg.jpg'
      if(movies&&movies[0]){
        img = movies[0].image || 'https://cdn.51chaidan.com/images/default/shareImg.jpg'
      }
      return {
        title: '',
        imageUrl: img
      }    
  },
  onShareTimeline:function(){
    var _this = this;
    var movies = _this.data.movies;
    var img = 'https://cdn.51chaidan.com/images/default/shareImg.jpg'
    if(movies&&movies[0]){
      img = movies[0].image || 'https://cdn.51chaidan.com/images/default/shareImg.jpg'
    }
    return {
      title:'Bilibiliworld x MCTS 8.7~8.9 不见不散，打卡送超多奖励',
      imageUrl: img
    }
  },  
  clicktganone: function () {
    this.setData({ tgabox: false })
  },  
})
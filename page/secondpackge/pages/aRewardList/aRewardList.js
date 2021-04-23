var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '一番赏', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    page: 0,
    loadprompt:false,
    nodata:false,
    // 适配苹果X
    isIphoneX: false,
    isProduce: app.signindata.isProduce,
    datalist:[],
    swiperdata:[],
    classifyIndex:0,
    scrollleft:0,
    classifyName:'',
    classifyArr:[],
    ClassifyTabW:0, //分类tab宽
    animationData:{},
    scene:'',
    isredpacket:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        scene:options,
      })
    } 
    app.signindata.suap = 14;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid,
      openid: app.signindata.openid,
      isProduce: app.signindata.isProduce
    });
    this.gitList();
  },
  activsign: function () {
    // 判断是否授权 
    var _this = this;
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
      return false;
    };    

    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
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
            _this.setData({
              tgabox: false,
              signinlayer: false
            })
            // '没有授权 统计'
            app.userstatistics(43);
            _this.onLoadfun();
          }
        }
      });  
    };    
  },
  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
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

  getWelfare(e){
    this.setData({
      welfare:e.detail.welfare
    })
  },
  redpagshareimage(e){
    console.log(e.detail,"111111")
    this.setData({
      redpagshareimg:e.detail
    })
  },

  gitList(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    if(_this.data.page ==0){
      this.setData({datalist:[]})
    };
    var exh = Dec.Aese('mod=yifanshang&operation=list&pid='+_this.data.page+'&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    console.log("一番赏活动列表接口地址 ===== "+app.signindata.comurl + 'mod=yifanshang&operation=list&pid='+_this.data.page+'&uid='+app.signindata.uid+'&loginid='+app.signindata.loginid)
    wx.request({
      url: app.signindata.comurl + 'spread.php' + exh,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('一番赏列表 =========== ',res)
        if (res.data.ReturnCode == 200) {
          if(res.data.List.activity.length == 0 && _this.data.page == 0){
            _this.setData({ nodata : true})
          }else{
            let alldata = [..._this.data.datalist,...res.data.List.activity];
            // console.log(alldata)
            _this.setData({datalist : alldata,rewardswiperData:res.data.List.topicActivity,consumemessageData:res.data.List.record,classifyArr:res.data.List.classifyList,countWelfare:res.data.Info.countWelfare})
            _this.setData({
              isredpacket:true
            })
            //创建节点选择器
            // var query = wx.createSelectorQuery();
            // query.select('#ele'+_this.data.classifyIndex).boundingClientRect();
            // query.exec(function(res) {
            //   console.log(res[0])
            //   _this.animationFun(_this,res[0].left,res[0].width);
            // })
          }
        } else if (res.data.ReturnCode == 201){
          _this.setData({loadprompt : true })
        } else {
          app.showToastC(res.data.msg);
        }
      },
      fail: function () { }
    });
  },
  //跳转详情
  toaRewarddeyails(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({   
      url: "/page/secondpackge/pages/aRewardDetails/aRewardDetails?id=" + id
    });
  },
  reset(){
    this.setData({page:0,datalist:[],loadprompt:false})
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 调用重置刷新
    app.resetdownRefresh();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    app.downRefreshFun(() => {
      this.reset();
      this.gitList();  
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({page:++this.data.page})
      this.gitList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options ) {
    var _this = this
    var share = {
      imageUrl:  "https://cdn.51chaidan.com/images/sign/yifanshangLisSharet.jpg"
    }
    if( options.from == 'button' ){
      var info = _this.data.welfare
      var xilie = _this.data.welfare.roleName != "" ? "-" : ""
      var title = ""
      if(info.welfareType == 1){
        title = "我抽到了"+ xilie + info.roleName + "，隐藏红包送给你们。"
      } else if(info.welfareType == 2){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了"+ xilie + info.roleName + "，幸运值红包送给你们。"
        } else {
          title = "我抽到了"+ xilie + info.roleName + "，幸运值红包送给你们。"
        }
      }else if(info.welfareType == 3){
        if (info.userId && info.userId != _this.data.uid) {
          title = info.nick + "抽到了"+ xilie + info.roleName + "，抽盒金红包送给你们。"
        } else {
          title = "我抽到了"+ xilie + info.roleName + "，抽盒金红包送给你们。"
        }
      }
      var share = {
        title: title,
        imageUrl: _this.data.redpagshareimg,
        path: "/page/secondpackge/pages/aRewardList/aRewardList?id=" + _this.data.scene.id + '&referee=' + _this.data.uid + '&gid=' + _this.data.scene.gid + '&welfareid=' + _this.data.scene.welfareid + '&isredpag=1',
        success: function (res) {}
      }
    }

    return share;
  },
  onShareTimeline:function(){
    var _this = this;
    return {
      title:'来美拆一番赏，一发入魂，抢战最终手办大赏',
      query:{},
      imageUrl: 'https://cdn.51chaidan.com/images/sign/yifanshangShareImg.jpg'
    }
  },
  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let ele = '#ele' + index;
    that.setData({
      classifyIndex:index,
      classifyName:index != 0?name:'',
      loadprompt:false
    })
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      console.log(res[0])
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })

      // that.animationFun(that,e.currentTarget.offsetLeft,res[0].width);
    })
  },
  animationFun(that,offsetLeft,width){
    // 创建一个动画实例
    var animation  = wx.createAnimation({
        duration:300,
        timingFunction:'linear'
    })

    animation.translateX(offsetLeft+(width-width*0.8)/2).width(width*0.8).step()
    that.setData({
      animationData: animation.export()
    })
  }
})

var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '关联图鉴',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    pid:0,
    dataList:[],
    listIndex:0,
    noData:false,
    loadprompt:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.listIndex = options.index;
    this.data.brand_id = options.brand_id;
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.getData();
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
  reset(){
    this.setData({pid:0,dataList:[],loadprompt:false})
  },
  // 获取图鉴列表
  getData(){
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let data = `mod=community&operation=showActivityIllustrated&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${this.data.brand_id}&showType=2&pid=${this.data.pid}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        if(res.data.ReturnCode == 200){
          let List =res.data.List;
          if(that.data.pid==0 && List.length == 0){
            that.setData({
              noData:true
            })
          }else if(that.data.pid!=0 && List.length == 0){
            that.setData({
              loadprompt:true
            })
            app.showToastC('暂无更多数据了',1500);
          }else{
            that.setData({
              dataList:[...that.data.dataList,...List]
            })
          }
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
        wx.stopPullDownRefresh();
      }
    });
  },
  chooseFieldGuide(e){
    let title = e.currentTarget.dataset.title;
    let id = e.currentTarget.dataset.id;
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length-2];

    console.log(prevPage.data.obj);
    console.log(prevPage.data.dynamicData);
    // return false;
    prevPage.setData({
      [`dynamicData[1].value`]:prevPage.data.obj.dynamicContent,
      [`dynamicData[2].imageList`]:prevPage.data.obj.dynamicPic,
      [`dynamicData[${this.data.listIndex}].value`]:title,
      [`dynamicData[4].value`]:prevPage.data.obj.allowComment,
    })
    prevPage.data.dynamicData[this.data.listIndex].value=title;
    prevPage.data.obj.fieldGuideName=title;
    prevPage.data.obj.fieldGuideId=id;
    console.log(prevPage.data.obj)
    wx.navigateBack({
      delta: 1
    })
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
    this.reset();
    this.getData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.loadprompt == false){
      this.setData({limitprame:++this.data.pid})
      this.getData();
    }else{
      app.showToastC('暂无更多数据了',1500);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
})

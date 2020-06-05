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
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
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
    datalist:[
      // {
      //   id:1,
      //   cover:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1591076527694&di=00dd5497b5330da26d7568be4f02a4f2&imgtype=0&src=http%3A%2F%2Fwww.xiaot.com%2Fdata%2Fattachment%2Fportal%2F201801%2F08%2F215325k41ap1g56cg60x4m.jpg',
      //   betterGoods:[
      //     {gear:'A', suplus:1, limit:1},
      //     {gear:'B', suplus:1, limit:2},
      //     {gear:'C', suplus:6, limit:6},
      //     {gear:'D', suplus:6, limit:6},
      //   ],
      //   limitGoods:80,
      //   suplusGoods:64,
      //   name:'一番赏鬼灭之刃限定周边',
      //   shopPrice:50
      // },
      // {
      //   id:2,
      //   cover:'https://cdn.51chaidan.com//images/brand/1587535959_16/1/goods/banner/1587535963.jpg',
      //   betterGoods:[
      //     {gear:'A', suplus:1, limit:1},
      //     {gear:'B', suplus:1, limit:2},
      //     {gear:'C', suplus:6, limit:6},
      //     {gear:'D', suplus:6, limit:6},
      //   ],
      //   limitGoods:50,
      //   suplusGoods:25,
      //   name:'一番赏鬼灭之刃限定周边',
      //   shopPrice:50
      // },
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gitList();
  },
  gitList(){
    var _this = this;
    wx.showLoading({title: '加载中...',})
    var exh = Dec.Aese('mod=yifanshang&operation=list&pid='+_this.data.page)
    console.log("一番赏活动列表接口地址 ===== "+app.signindata.comurl + 'mod=yifanshang&operation=list&pid='+_this.data.page)
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
            _this.setData({datalist : alldata})
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
    this.gitList();
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
  onShareAppMessage: function () {

  }
})
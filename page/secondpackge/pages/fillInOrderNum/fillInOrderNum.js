var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    c_title: '回寄信息', 
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc'),
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    signinlayer: true,
    tgabox:false,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    listData:[
      {
        isRequired:true,
        type:'text',
        subtitle:'寄回快递单号',
        placeholder:'请输入寄回快递单号',
        value:'',
        name:'orderNum',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'寄回留言',
        placeholder:'请输入寄回留言',
        value:'',
        name:'describe',
        borderbottom1:'show',
        margintop0:true,
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'寄回凭证',
        name:'pic',
        imageList:[],
        margintop0:true,
        mode:'multiple',
        storagelocation:'images/goods'
      },
    ],
    obj:{
      orderNum:'',
      describe:'',
      pic:''
    },
    oid:'',
    type:0,
  },
  // 获取表单数据
  bindchange(e){
    let value = e.detail.value; 
    let key=e.detail.name;
    this.data.obj[key]=value;
    console.log(this.data.obj)
  },
  getInfo(){
    wx.showLoading({ title: '加载中...'})
    var _this = this;
    let oid = _this.data.oid;
    var q = Dec.Aese('mod=operate&operation=addSalesReturnInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=show&oid='+oid);
    console.log(app.signindata.comurl + 'order.php?' +'mod=operate&operation=addSalesReturnInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=show&oid='+oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('详情数据====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          let info = res.data.Info;
          let obj = _this.data.obj;
          _this.setData({
            [`listData[0].value`]:info.shipping_number,
            [`listData[1].value`]:info.message,
            [`listData[2].imageList`]:info.describe_img,
          })

          obj.orderNum = info.shipping_number;
          obj.describe = info.message;
          obj.pic = info.describe_img;


        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }) 
  },
  submit(){
    let obj = this.data.obj;
    if(!obj.orderNum || obj.orderNum == ''){
      this.selectComponent('#settledForm').scrollto('orderNum');
      app.showToastC('请输入寄回快递单号',1500);
      return false;
    }
    // if(!obj.describe || obj.describe == ''){
    //   this.selectComponent('#settledForm').scrollto('describe');
    //   app.showToastC('请输入寄回留言',1500);
    //   return false;
    // }
    // if(!obj.pic || obj.pic == ''){
    //   this.selectComponent('#settledForm').scrollto('pic');
    //   app.showToastC('请上传照片',1500);
    //   return false;
    // }
    
    wx.showLoading({ title: '加载中...'})
    var _this = this;
    var q = Dec.Aese('mod=operate&operation=addSalesReturnInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=set&shipping_number='+obj.orderNum+'&message='+obj.describe+'&describe_img='+obj.pic+'&oid='+this.data.oid);
    console.log(app.signindata.comurl + 'order.php?' +'mod=operate&operation=addSalesReturnInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&type=set&shipping_number='+obj.orderNum+'&message='+obj.describe+'&describe_img='+obj.pic+'&oid='+this.data.oid)
    wx.request({
      url: app.signindata.comurl + 'order.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('提交====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          app.showToastC('提交成功')
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          prevPage.onLoadfun();
          setTimeout(function(){
            wx.navigateBack()
          },1500)
        }else{
          app.showToastC(res.data.Msg)
        }
      }
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.data.share_uid = options.share_uid || 0
    _this.setData({
      uid: app.signindata.uid,
      loginid:app.signindata.loginid,
      isProduce: app.signindata.isProduce,
      oid: options.oid,
      type: options.type || 0,
    });  
    if(options.type == 1){
      this.getInfo();
    }
    // 判断是否授权
    this.activsign();
  },
  onLoadfun:function(){
    var _this = this;
    // _this.setData({
    //   uid: app.signindata.uid,
    //   loginid:app.signindata.loginid,
    //   isProduce: app.signindata.isProduce,
    // });  
    // this.getInfo();
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
          _this.setData({
            tgabox: false,
            signinlayer: false
          })
          console.log()
          // '没有授权 统计'
          app.userstatistics(48);
          _this.onLoadfun();
        }
      }
    });      
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
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  }, 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var reshare = app.sharemc();
    return reshare
  },
})
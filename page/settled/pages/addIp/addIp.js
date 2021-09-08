
var Dec = require('../../../../common/public');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '添加新IP',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    enterpriseData:[
      {
        isRequired:true,
        type:'text',
        subtitle:'IP名称',
        placeholder:'请输入IP名称',
        value:'',
        name:'ipName'
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'IP logo（建议上传比例1:1）',
        name:'ipLogo',
        src:'',
        storagelocation:'brandinfo/logo'
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'IP 形象图（建议上传比例16:9）',
        name:'ipImage',
        src:'',
        storagelocation:'brandinfo/banner'
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'IP介绍',
        placeholder:'请输入IP介绍',
        value:'',
        name:'introduce',
      }
    ],
    obj:{
      ipImage:'',
      introduce:''
    },
    num:4,
    brandInfo:{}, //品牌信息
    isSampleGraphMask:false
  },

  toggleSampleGraphMask(){
    this.setData({
      isSampleGraphMask:!this.data.isSampleGraphMask
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;

    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    }
  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //返回n页
  navigateBack(e){
    let num = e.currentTarget.dataset.num;
    app.navigateBack(num)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    app.comjumpwxnav(type,num)
  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },

  //提交审核
  submitAudit(){
    let obj = this.data.obj;
    if(!obj.ipName || obj.ipName == ''){
      this.selectComponent('#settledForm').scrollto('ipName');
      app.showToastC('请输入IP名称',1500);
      return false;
    }
    if(!obj.ipLogo || obj.ipLogo == ''){
      this.selectComponent('#settledForm').scrollto('ipLogo');
      app.showToastC('请上传IP LOGO',1500);
      return false;
    }
   
    let data = `mod=community&operation=setIpData&uid=${this.data.uid}&loginid=${this.data.loginid}&ip_name=${obj.ipName}&ip_logo=${obj.ipLogo}&ip_img=${obj.ipImage}&ip_introduce=${obj.introduce}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('提交审核====',res)
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
          wx.showModal({
            title: '提交成功',
            content: '24小时之内会通知您审核结果，请耐心等待',
            showCancel:false,
            confirmText:'关闭',
            confirmColor:'#02BB00',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                let pages = getCurrentPages();
                let prevPage = pages[pages.length -2];//上一页
                prevPage.getData();
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }else{
          app.showToastC(res.data.Nsg,2000);
        }
       
      },
      fail: function () {},
      complete:function(){
      }
    });
  }
})

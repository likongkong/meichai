
var Dec = require('../../../../common/public');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '完善资料',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    enterpriseData:[
      {
        isRequired:true,
        type:'text',
        subtitle:'IP名称',
        placeholder:'请输入IP联系人',
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
        isRequired:true,
        type:'uploadImg',
        subtitle:'IP 形象图（建议上传比例16:9）',
        name:'ipImage',
        src:'',
        storagelocation:'brandinfo/banner'
      },{
        isRequired:true,
        type:'textarea',
        subtitle:'IP介绍',
        placeholder:'请输入IP介绍',
        value:'',
        name:'introduce',
      },{
        isRequired:false,
        type:'title',
        subtitle:'第三方链接',
        borderbottom1:'hide'
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'小助手微信二维码',
        name:'WeChatCode',
        src:'',
        storagelocation:'brandinfo/WeChat',
        borderbottom1:'hide',
        isEdit:'hide',
        paddingL80:'paddingL80'
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'公众号二维码',
        name:'officialAccounts',
        src:'',
        storagelocation:'brandinfo/official_accounts',
        borderbottom1:'hide',
        isEdit:'hide',
        paddingL80:'paddingL80'
      },{
        isRequired:false,
        type:'text',
        subtitle:'小红书ID',
        placeholder:'请输入小红书ID',
        value:'',
        name:'redBookId',
        borderbottom1:'hide',
        isEdit:'hide',
        paddingL80:'paddingL80'
      },{
        isRequired:false,
        type:'text',
        subtitle:'微博',
        placeholder:'请输入微博昵称',
        value:'',
        name:'microblog', 
        borderbottom1:'hide',
        isEdit:'hide',
        paddingL80:'paddingL80'
      }
    ],
    obj:{},
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
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    console.log(options)
    this.setData({
      // num:options.num,
      barnd_id:options.id || 0
    })
    this.getBrandInfo()
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
  //获取品牌信息
  getBrandInfo(){
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=brandCertification&operation=info&uid=${this.data.uid}&loginid=${this.data.loginid}&showType=2&brand_id=${this.data.barnd_id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('品牌信息====',res)
        if(res.data.ReturnCode == 200){
          let brandInfo = res.data.Info;
          this.data.obj = {
            ipName:brandInfo.ip_name,
            ipLogo:brandInfo.ip_logo,
            ipImage:brandInfo.ip_img,
            introduce:brandInfo.ip_introduce,
          };
          this.setData({
            [`enterpriseData[0].value`]:brandInfo.ip_name,
            [`enterpriseData[1].src`]:brandInfo.ip_logo,
            [`enterpriseData[2].src`]:brandInfo.ip_img,
            [`enterpriseData[3].value`]:brandInfo.ip_introduce,
            id:brandInfo.id
          })

        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        wx.hideLoading()
      }
    });
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
    if(!obj.ipImage || obj.ipImage == ''){
      this.selectComponent('#settledForm').scrollto('ipImage');
      app.showToastC('请上传IP 形象图',1500);
      return false;
    }
    if(!obj.introduce || obj.introduce == ''){
      this.selectComponent('#settledForm').scrollto('introduce');
      app.showToastC('请输入IP 介绍',1500);
      return false;
    }
    if(!obj.WeChatCode || obj.WeChatCode == ''){
      obj.WeChatCode=''
    }
    if(!obj.officialAccounts || obj.officialAccounts == ''){
      obj.officialAccounts=''
    }
    if(!obj.redBookId || obj.redBookId == ''){
      obj.redBookId=''
    }
    if(!obj.microblog || obj.microblog == ''){
      obj.microblog=''
    }
    let data = `mod=brandCertification&operation=perfect&uid=${this.data.uid}&loginid=${this.data.loginid}&ip_name=${obj.ipName}&ip_logo=${obj.ipLogo}&ip_img=${obj.ipImage}&ip_introduce=${obj.introduce}&helper_wechat_number=${obj.WeChatCode}&official_accounts=${obj.officialAccounts}&red_book_id=${obj.redBookId}&microblog=${obj.microblog}&id=${this.data.id}&brand_id=${this.data.barnd_id}`
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
          let pages = getCurrentPages();    //获取当前页面信息栈
          let prevPage = pages[pages.length-2];
          prevPage.onLoadfun();
          wx.showModal({
            title: '提交成功',
            content: '恭喜您，您的IP信息已经展示在发现广场内，您可以通过小程序内的管理后台创建活动，发布商品啦，还有更多活动补贴等你来拿。',
            showCancel:false,
            confirmText:'确认',
            confirmColor:'#02BB00',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
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

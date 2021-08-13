
var Dec = require('../../../../common/public');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '修改资料',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    enterpriseData:[
      {
        isRequired:true,
        type:'text',
        subtitle:'企业名称',
        placeholder:'请输入企业名称',
        value:'',
        name:'enterpriseName'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业联系人',
        placeholder:'请输入企业联系人',
        value:'',
        name:'enterpriseContact'
      },{
        isRequired:true,
        type:'text',
        subtitle:'联系方式',
        placeholder:'请输入联系方式',
        value:'',
        name:'enterprisePhone'
      },{
        isRequired:true,
        type:'text',
        subtitle:'微信号',
        placeholder:'请输入微信号',
        value:'',
        name:'wechatID'
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'企业营业执照或与IP相关凭证',
        name:'businessLicense',
        src:'',
        storagelocation:'brandinfo/voucher'
      },{
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
        placeholder:'请输入专区介绍',
        value:'',
        name:'introduce',
        borderbottom1:'hide'
      },
    ],
    obj:{},
    num:1,  //进度
    brandInfo:{}, //品牌信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    this.setData({
      num:options.num,
      id:options.id || 0
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
    let data = `mod=brandCertification&operation=info&uid=${this.data.uid}&loginid=${this.data.loginid}&showType=1&id=${this.data.id}`
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
            enterpriseName:brandInfo.firm_name,
            enterpriseContact:brandInfo.firm_linkman,
            enterprisePhone:brandInfo.firm_tel,
            wechatID:brandInfo.wechat_number,
            businessLicense:brandInfo.certificate_img,
            ipName:brandInfo.ip_name,
            ipLogo:brandInfo.ip_logo,
            ipImage:brandInfo.ip_img,
            introduce:brandInfo.ip_introduce,
          };
          this.setData({
            [`enterpriseData[0].value`]:brandInfo.firm_name,
            [`enterpriseData[1].value`]:brandInfo.firm_linkman,
            [`enterpriseData[2].value`]:brandInfo.firm_tel,
            [`enterpriseData[3].value`]:brandInfo.wechat_number,
            [`enterpriseData[4].src`]:brandInfo.certificate_img,
            [`enterpriseData[5].value`]:brandInfo.ip_name,
            [`enterpriseData[6].src`]:brandInfo.ip_logo,
            [`enterpriseData[7].src`]:brandInfo.ip_img,
            [`enterpriseData[8].value`]:brandInfo.ip_introduce,
          })

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
  //提交审核
  submitAudit(){
    let obj = this.data.obj;
    let phoneNum = /^1[3456789]\d{9}$/;

    if(!obj.enterpriseName || obj.enterpriseName == ''){
      app.showToastC('请输入企业名称',1500);
      return false;
    }
    if(!obj.enterpriseContact || obj.enterpriseContact == ''){
      app.showToastC('请输入企业联系人',1500);
      return false;
    }
    if(!obj.enterprisePhone || obj.enterprisePhone == ''){
      app.showToastC('请输入联系方式',1500);
      return false;
    }else if(!phoneNum.test(obj.enterprisePhone)){
      app.showToastC('手机号有误请重新填写',2000);
      return false;
    }
    if(!obj.wechatID || obj.wechatID == ''){
      app.showToastC('请输入微信号',1500);
      return false;
    }
    if(!obj.businessLicense || obj.businessLicense == ''){
      app.showToastC('请上传企业营业执照或与IP相关凭证',1500);
      return false;
    }
    if(!obj.ipName || obj.ipName == ''){
      app.showToastC('请输入IP联系人',1500);
      return false;
    }
    if(!obj.ipLogo || obj.ipLogo == ''){
      app.showToastC('请上传IP LOGO',1500);
      return false;
    }
    if(!obj.ipImage || obj.ipImage == ''){
      obj.ipImage = ''
    }
    if(!obj.introduce || obj.introduce == ''){
      obj.introduce = ''
    }

    let data = `mod=brandCertification&operation=initial&uid=${this.data.uid}&loginid=${this.data.loginid}&firm_name=${obj.enterpriseName}&firm_linkman=${obj.enterpriseContact}&firm_tel=${obj.enterprisePhone}&wechat_number=${obj.wechatID}&certificate_img=${obj.businessLicense}&ip_name=${obj.ipName}&ip_logo=${obj.ipLogo}&ip_img=${obj.ipImage}&ip_introduce=${obj.introduce}&id=${this.data.id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) { 
        console.log('提交审核====',res)
        if(res.data.ReturnCode == 200){
          wx.showModal({
            title: '提交成功',
            content: '24小时之内会有工作人员加您微信，请耐心等待。',
            showCancel:false,
            confirmText:'关闭',
            confirmColor:'#02BB00',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                let pages = getCurrentPages();
                let prevPage = pages[pages.length -2];//上一页
                prevPage.getBrandInfo();
                wx.navigateBack({
                  delta: 1
                })
              }
            }
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
  }
})


var Dec = require('../../../../common/public');//aes加密解密js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '申请入驻',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    uid:'',
    loginid:'',
    enterpriseData:[
      {
        type:'subtitle',
        subtitle:'企业信息',
        backgroundColor:'#F5F5F5',
        color:'#101010'
      },
      {
        isRequired:true,
        type:'text',
        subtitle:'企业名称',
        placeholder:'请输入企业名称',
        value:'',
        borderbottom1:'show',
        name:'enterpriseName'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业联系人',
        placeholder:'请输入企业联系人',
        value:'',
        borderbottom1:'show',
        name:'enterpriseContact'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业联系人电话',
        placeholder:'请输入企业联系人电话',
        value:'',
        borderbottom1:'show',
        name:'enterprisePhone'
      }
      // ,{
      //   isRequired:true,
      //   type:'text',
      //   subtitle:'微信号',
      //   placeholder:'请输入微信号',
      //   value:'',
      //   name:'wechatID'
      // }
      ,{
        isRequired:true,
        type:'uploadImg',
        subtitle:'企业营业执照复印件',
        name:'businessLicense',
        src:'',
        storagelocation:'images/brandSettled/certification'
      },{
        type:'subtitle',
        subtitle:'品牌信息',
        backgroundColor:'#F5F5F5',
        color:'#101010'
      },{
        isRequired:true,
        type:'text',
        subtitle:'品牌名称',
        placeholder:'请输入品牌名称',
        value:'',
        borderbottom1:'show',
        name:'ipName'
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'品牌主图（建议上传比例1:1）',
        name:'ipLogo',
        src:'',
        borderbottom1:'show',
        storagelocation:'images/brandSettled/logo'
      },{
      
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'品牌简介',
        placeholder:'请输入品牌简介',
        value:'',
        name:'introduce',
      },
    ],
    personData:[
      {
        type:'subtitle',
        subtitle:'个人信息',
        backgroundColor:'#F5F5F5',
        color:'#101010'
      },{
        isRequired:true,
        type:'text',
        subtitle:'企业名称',
        placeholder:'请输入企业名称',
        value:'',
        borderbottom1:'show',
        name:'enterpriseName'
      }
    ],
    IPData:[{
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
        storagelocation:'images/brandSettled/logo'
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'IP 形象图（建议上传比例16:9）',
        name:'ipImage',
        src:'',
        storagelocation:'images/brandSettled/banner'
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'IP介绍',
        placeholder:'请输入IP介绍',
        value:'',
        name:'introduce',
        borderbottom1:'hide'
      },
    ],
    obj:{},
    num:1,  //进度
    id:0,
    brandInfo:{}, //品牌信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    console.log(options)
    this.setData({
      settledType:options.settledType,
      num:options.num,
      msg:options.msg,
      from:options.from || '',
      id:options.id || 0
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          contentHeight:(res.windowHeight - this.data.statusBarHeightMc)-85,
        });
      }
    });
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
    console.log(_this.data.loginid,_this.data.uid)
    if(_this.data.num==2 || _this.data.num==4){
      this.getBrandInfo()
    }
    if(_this.data.num==4){
      this.setData({
        brandSettledReturnMsg:_this.data.msg
      })
    }
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
    if(this.data.num==2 || this.data.num==4){
      this.getBrandInfo()
    }else{
      wx.stopPullDownRefresh();
    }
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
  changeSettledType(e){
    let type = e.currentTarget.dataset.type;
    console.log(type)
    this.setData({
      settledType:type
    })
  },
  //返回n页
  navigateBack(e){
    let num = e.currentTarget.dataset.num;
    app.navigateBack(num)
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    let whref = `id=${this.data.id}&num=${num}&from=${this.data.from}`
    app.comjumpwxnav(type,whref)
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
            wechatID:brandInfo.wechat_number || '',
            businessLicense:brandInfo.certificate_img,
            ipName:brandInfo.ip_name,
            ipLogo:brandInfo.ip_logo,
            ipImage:brandInfo.ip_img,
            introduce:brandInfo.ip_introduce,
          };
          if(this.data.from=='zhuanqu'){
            this.setData({
              [`IPData[0].value`]:brandInfo.ip_name,
              [`IPData[1].src`]:brandInfo.ip_logo,
              [`IPData[2].src`]:brandInfo.ip_img,
              [`IPData[3].value`]:brandInfo.ip_introduce.split('hc').join('\n'),
            })
          }else{
            this.setData({
              [`enterpriseData[1].value`]:brandInfo.firm_name,
              [`enterpriseData[2].value`]:brandInfo.firm_linkman,
              [`enterpriseData[3].value`]:brandInfo.firm_tel,
              [`enterpriseData[4].value`]:brandInfo.wechat_number,
              [`enterpriseData[5].src`]:brandInfo.certificate_img,
              [`enterpriseData[7].value`]:brandInfo.ip_name,
              [`enterpriseData[8].src`]:brandInfo.ip_logo,
              [`enterpriseData[9].src`]:brandInfo.ip_img,
              [`enterpriseData[10].value`]:brandInfo.ip_introduce.split('hc').join('\n'),
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
  //提交审核
  submitAudit(){
    let _this = this;
    let obj = this.data.obj;
    let phoneNum = /^1[3456789]\d{9}$/;

    if(!obj.enterpriseName || obj.enterpriseName == ''){
      this.selectComponent('#settledForm').scrollto('enterpriseName');
      app.showToastC('请输入企业名称',1500);
      return false;
    }
    if(!obj.enterpriseContact || obj.enterpriseContact == ''){
      this.selectComponent('#settledForm').scrollto('enterpriseContact');
      app.showToastC('请输入企业联系人',1500);
      return false;
    }
    if(!obj.enterprisePhone || obj.enterprisePhone == ''){
      this.selectComponent('#settledForm').scrollto('enterprisePhone');
      app.showToastC('请输入企业联系人电话',1500);
      return false;
    }else if(!phoneNum.test(obj.enterprisePhone)){
      this.selectComponent('#settledForm').scrollto('enterprisePhone');
      app.showToastC('手机号有误请重新填写',2000);
      return false;
    }
    // if(!obj.wechatID || obj.wechatID == ''){
    //   this.selectComponent('#settledForm').scrollto('wechatID');
    //   app.showToastC('请输入微信号',1500);
    //   return false;
    // }
    if(!obj.businessLicense || obj.businessLicense == ''){
      this.selectComponent('#settledForm').scrollto('businessLicense');
      app.showToastC('请上传企业营业执照复印件',1500);
      return false;
    }
    if(!obj.ipName || obj.ipName == ''){
      this.selectComponent('#settledForm').scrollto('ipName');
      app.showToastC('请输入品牌名称',1500);
      return false;
    }
    if(!obj.ipLogo || obj.ipLogo == ''){
      this.selectComponent('#settledForm').scrollto('ipLogo');
      app.showToastC('请上传品牌主图',1500);
      return false;
    }
    if(!obj.ipImage || obj.ipImage == ''){
      obj.ipImage = ''
    }
    if(!obj.introduce || obj.introduce == ''){
      obj.introduce = ''
    }
    let id = this.data.id;
    let introduce = encodeURIComponent(obj.introduce.split('\n').join('hc'));
    let data = `mod=brandCertification&operation=initial&uid=${this.data.uid}&loginid=${this.data.loginid}&firm_name=${obj.enterpriseName}&firm_linkman=${obj.enterpriseContact}&firm_tel=${obj.enterprisePhone}&wechat_number=${obj.wechatID}&certificate_img=${obj.businessLicense}&ip_name=${obj.ipName}&ip_logo=${obj.ipLogo}&ip_img=${obj.ipImage}&ip_introduce=${introduce}&id=${id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('提交审核====',res)
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
          wx.showModal({
            title: '提交成功',
            content: id == 0?'24小时之内会有工作人员加您微信，请留意您的微信消息。':'24小时之内会有工作人员和您联系，请留意您的微信消息。',
            showCancel:false,
            confirmText:'关闭',
            confirmColor:'#02BB00',
            success (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                if(id == 0){
                  wx.navigateBack({
                    delta: 2
                  })
                }else{
                  if(_this.data.from=='zhuanqu'){
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length -2];//上一页
                    prevPage.getData();
                  }
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            }
          })
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
      }
    });
  }
})

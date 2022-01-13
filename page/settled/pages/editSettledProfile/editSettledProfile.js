var Dec = require('../../../../common/public');//aes加密解密js
var utils = require("../../../../utils/util.js");
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
    uid:'',
    loginid:'',
    enterpriseData:[
      {
        type:'h1',
        value:'企业信息'
      },{
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
        subtitle:'联系方式',
        placeholder:'请输入手机号',
        value:'',
        borderbottom1:'show',
        name:'enterprisePhone'
      },
      // {
      //   isRequired:true,
      //   type:'text',
      //   subtitle:'微信号',
      //   placeholder:'请输入微信号',
      //   value:'',
      //   borderbottom1:'show',
      //   name:'wechatID'
      // },
      {
        isRequired:true,
        type:'uploadImg',
        subtitle:'企业营业执照或与IP相关凭证',
        name:'businessLicense',
        src:'',
        borderbottom1:'show',
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
        
      },
      {
        isRequired:false,
        type:'textarea',
        subtitle:'品牌介绍',
        placeholder:'请输入品牌介绍',
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
        type:'settledCertification',
        subtitle:'实名认证',
        placeholder:'',
        value:'',
        borderbottom1:'show',
        certificationInfo:'',
        name:'certification'
      },{
        isRequired:true,
        type:'text',
        subtitle:'联系人电话',
        placeholder:'请输入联系人电话',
        value:'',
        borderbottom1:'show',
        name:'personPhone'
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
        name:'personIpName'
      },{
        isRequired:true,
        type:'uploadImg',
        subtitle:'品牌主图（建议上传比例1:1）',
        name:'personIpLogo',
        src:'',
        borderbottom1:'show',
        storagelocation:'images/brandSettled/logo'
      },{
      
      },{
        isRequired:false,
        type:'textarea',
        subtitle:'品牌简介',
        placeholder:'选填，入驻成功后可继续编辑',
        value:'',
        name:'personIntroduce',
      },
    ],
    IPData:[{
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
      },
      // {
      //   isRequired:false,
      //   type:'uploadImg',
      //   subtitle:'IP 形象图（建议上传比例16:9）',
      //   name:'ipImage',
      //   src:'',
      //   borderbottom1:'show',
      //   storagelocation:'images/brandSettled/banner'
      // },
      {
        isRequired:false,
        type:'textarea',
        subtitle:'品牌介绍',
        placeholder:'请输入品牌介绍',
        value:'',
        name:'introduce',
        borderbottom1:'show'
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
    var _this = this;
    this.data.uid = app.signindata.uid;
    this.data.loginid = app.signindata.loginid;
    console.log(options)
    this.setData({
      num:options.num,
      from:options.from || '',
      id:options.id || 0,
      settledType:options.settledType || 0,
    })
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
  // 实名认证
  authentication(){
    let _this = this;
    let obj = this.data.obj;
    if(!obj.realname || obj.realname == ''){
      app.showToastC('请输入真实姓名',1500);
      return false;
    }
    if(!obj.realidcard || obj.realidcard == ''){
      app.showToastC('请输入身份证号码',1500);
      return false;
    }
    let data = `mod=address&operation=verifyIdentityCard&uid=${this.data.uid}&loginid=${this.data.loginid}&idcard=${this.data.obj.realidcard}&username=${this.data.obj.realname}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'user.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log('实名认证====',res)
        wx.hideLoading()
        if(res.data.ReturnCode == 200){
          app.showToastC('认证成功',1500);
          this.setData({
            isCertification:true,
            isCertificationMask:false,
            [`personData[1].placeholder`]:'',
            [`personData[1].certificationInfo.name`]:utils.plusXing(obj.realname,1,0),
            [`personData[1].certificationInfo.idcard`]:utils.plusXing(obj.realidcard,4,5),
          })
        }else{
          app.showToastC(res.data.Message,2000);
        }
      },
      fail: function () {},
      complete:function(){
      }
    });
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
          if(this.data.settledType == 0){  //企业入驻
            this.data.obj = {
              enterpriseName:brandInfo.firm_name,
              enterpriseContact:brandInfo.firm_linkman,
              enterprisePhone:brandInfo.firm_tel,
              wechatID:brandInfo.wechat_number || '',
              businessLicense:brandInfo.certificate_img,
              ipName:brandInfo.ip_name,
              ipLogo:brandInfo.ip_logo,
              // ipImage:brandInfo.ip_img,
              introduce:brandInfo.ip_introduce,
            };
          }else{
            this.data.obj = {
              realname:brandInfo.firm_linkman,
              realidcard:brandInfo.certificate_img,
              personPhone:brandInfo.firm_tel,
              personIpName:brandInfo.ip_name,
              personIpLogo:brandInfo.ip_logo,
              // ipImage:brandInfo.ip_img,
              personIntroduce:brandInfo.ip_introduce,
            };
          }
          if(this.data.from=='zhuanqu'){
            this.setData({
              isCertification:true,
              [`IPData[0].value`]:brandInfo.ip_name,
              [`IPData[1].src`]:brandInfo.ip_logo,
              [`IPData[2].src`]:brandInfo.ip_img,
              [`IPData[3].value`]:brandInfo.ip_introduce.split('hc').join('\n'),
            })
            if(this.data.settledType == 1){
              this.setData({
                [`IPData[0].name`]:'personIpName',
                [`IPData[1].name`]:'personIpLogo',
                [`IPData[2].name`]:'personIntroduce',
              })
            }
          }else{
            if(this.data.settledType == 0){  //企业入驻
              this.setData({
                [`enterpriseData[1].value`]:brandInfo.firm_name,
                [`enterpriseData[2].value`]:brandInfo.firm_linkman,
                [`enterpriseData[3].value`]:brandInfo.firm_tel,
                // [`enterpriseData[4].value`]:brandInfo.wechat_number,
                [`enterpriseData[4].src`]:brandInfo.certificate_img,
                [`enterpriseData[6].value`]:brandInfo.ip_name,
                [`enterpriseData[7].src`]:brandInfo.ip_logo,
                // [`enterpriseData[7].src`]:brandInfo.ip_img,
                [`enterpriseData[9].value`]:brandInfo.ip_introduce.split('hc').join('\n'),
              })
            }else{
              this.setData({
                isCertification:true,
                [`personData[1].placeholder`]:this.data.num==4?'':'已认证',
                [`personData[1].certificationInfo.name`]:utils.plusXing(brandInfo.firm_linkman,1,0),
                [`personData[1].certificationInfo.idcard`]:utils.plusXing(brandInfo.certificate_img,4,5),
                [`personData[2].value`]:brandInfo.firm_tel,
                [`personData[4].value`]:brandInfo.ip_name,
                [`personData[5].src`]:brandInfo.ip_logo,
                [`personData[7].value`]:brandInfo.ip_introduce,
              })
            }
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
    let obj = this.data.obj;
    let phoneNum = /^1[3456789]\d{9}$/;

    if(this.data.settledType == 0){      //企业验证
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
    }else{   //个人验证
      if(!this.data.isCertification){
        this.selectComponent('#settledForm1').scrollto('certification');
        app.showToastC('请先实名认证',1500);
        return false;
      }
      if(!obj.personPhone || obj.personPhone == ''){
        this.selectComponent('#settledForm1').scrollto('personPhone');
        app.showToastC('请输入联系人电话',1500);
        return false;
      }else if(!phoneNum.test(obj.personPhone)){
        this.selectComponent('#settledForm1').scrollto('personPhone');
        app.showToastC('手机号有误请重新填写',2000);
        return false;
      }
      if(!obj.personIpName || obj.personIpName == ''){
        this.selectComponent('#settledForm1').scrollto('personIpName');
        app.showToastC('请输入品牌名称',1500);
        return false;
      }
      if(!obj.personIpLogo || obj.personIpLogo == ''){
        this.selectComponent('#settledForm1').scrollto('personIpLogo');
        app.showToastC('请上传品牌主图',1500);
        return false;
      }
      if(!obj.personIntroduce || obj.personIntroduce == ''){
        obj.personIntroduce = ''
      }
    }
    let id = this.data.id;
    let data;
    if(this.data.settledType == 0){      //企业验证
      let introduce = encodeURIComponent(obj.introduce.split('\n').join('hc'));
      data = `mod=brandCertification&operation=initial&uid=${this.data.uid}&loginid=${this.data.loginid}&firm_name=${obj.enterpriseName}&firm_linkman=${obj.enterpriseContact}&firm_tel=${obj.enterprisePhone}&wechat_number=${obj.wechatID}&certificate_img=${obj.businessLicense}&ip_name=${obj.ipName}&ip_logo=${obj.ipLogo}&ip_img=${obj.ipImage}&ip_introduce=${introduce}&id=${id}&type=0`
    }else{
      let personIntroduce = encodeURIComponent(obj.personIntroduce.split('\n').join('hc'));
      data = `mod=brandCertification&operation=initial&uid=${this.data.uid}&loginid=${this.data.loginid}&firm_linkman=${obj.realname}&certificate_img=${obj.realidcard}&firm_tel=${obj.personPhone}&ip_name=${obj.personIpName}&ip_logo=${obj.personIpLogo}&ip_introduce=${personIntroduce}&id=${id}&type=1`
    }

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
            title: '修改成功',
            content: '24小时之内会通知您审核结果，请耐心等待',
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
      }
    });
  },
  showrule: function () {
    wx.navigateTo({
      url: "/page/secondpackge/pages/gbaPage/gbaPage?webview=https://meichai-1300990269.cos.ap-beijing.myqcloud.com/activity_rules.json&from=settledAgreement",
    });
  },
})

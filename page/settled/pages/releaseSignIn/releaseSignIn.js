
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
    c_title: '发布签到',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    dynamicData:[
      {
        isRequired:false,
        type:'actionSheet',
        groups:[],
        subtitle:'关联IP',
        value:'点击关联',
        disabled:true,
        name:'associationIp'
      },{
        isRequired:false,
        type:'radio',
        subtitle:'允许签到对象',
        radioArr:['所有人可签到','指定群成员签到'],
        value:0,
        index:0,
        direction:'Y',
        explain:true,
        explainTxt:'所有人可签到：所有人可分享并且签到。\n指定群成员签到：只有管理员可分享，并且用户只可以通过分享链接签到。',
        name:'isCanShare',
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'签到分享图(推荐尺寸5:4)',
        name:'shareImg',
        src:'',
        storagelocation:'images/activity/brandSign',
      }
    ],
    
    obj:{},

  },
  /**
   * 生命周期函数--监听页面加载
   */
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options)
    this.setData({
      id:options.id||1102,
      type:options.type==2?3:options.type==3?2:1,
      name:options.name||'林川',
      // url:decodeURIComponent(options.img),
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
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.getIp();
    // this.getSignActivity();
  },

  // getSignActivity(){

  // },
  // 获取用户下所有的品牌id
  getIp(){
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=community&operation=showIp&uid=${this.data.uid}&loginid=${this.data.loginid}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        if(res.data.ReturnCode == 200){
          let groups = `dynamicData[0].groups`;
          this.setData({
            [groups]:res.data.List.brandInfoList,
          })
          if(this.data.id!=0){
            this.getSignActivity();
          }else{
            wx.hideLoading()
            wx.stopPullDownRefresh();
            this.setData({
              [`dynamicData[0].value`]:res.data.List.brandInfoList[0].name,
            })
            this.data.obj.associationIp = res.data.List.brandInfoList[0].brand_id;
          }
        }else{
          wx.hideLoading()
          wx.stopPullDownRefresh();
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {},
      complete:function(){
        
      }
    });
  },
  getSignActivity(){
    let data = `mod=community&operation=getSignActivity&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${this.data.id}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(res.data.ReturnCode == 200){
          this.setData({
            integralAward:res.data.Info.activity.integralAward,
            activity:res.data.Info.activity,
          })

          let activity = res.data.Info.activity;
          // let List = res.data.List;
          let obj = this.data.obj;
          let name;
          for(var i=0;i<this.data.dynamicData[0].groups.length;i++){
            if(this.data.dynamicData[0].groups[i].brand_id == activity.brandId){
              name = this.data.dynamicData[0].groups[i].name;
              break;
            } 
          }
          this.setData({
            [`dynamicData[0].value`]:name,
            [`dynamicData[1].index`]:activity.detail,
            [`dynamicData[2].src`]:activity.cover,
          })
          obj.associationIp = activity.brandId;
          obj.isCanShare = activity.detail;
          obj.shareImg = activity.cover;
          // obj.dynamicPic = info.imgArr;
          // obj.fieldGuideId = List.illustratedInfo.id;
          // // obj.allowComment = info.allow_comment_type;
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
  // 发布
  submitAudit(){
    let obj = this.data.obj;
    let status = this.data.type==1||this.data.type==2?2:3;
    let that = this;
    // console.log(this.data.type)
    // return false;
    wx.showLoading({
      title: '加载中',
    })
    console.log(obj)
    // let data = `mod=community&operation=establish&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${obj.associationIp}&title=${obj.dynamicContent}&illustrated_id=${obj.fieldGuideId?obj.fieldGuideId:''}&imgArr=${obj.dynamicPic}&allowComment=${obj.allowComment}&id=${this.data.id}`
    let data = `mod=community&operation=setSignActivity&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${obj.associationIp}&status=${status}&isCanShare=${obj.isCanShare}&cover=${obj.shareImg}`
    var q = Dec.Aese(data);
    console.log(`${app.signindata.comurl}?${data}`)
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: (res) => { 
        console.log(res);
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if(res.data.ReturnCode == 200){
          if(that.data.type==1){
            app.showToastC('发布成功',1500);
          }else if(that.data.type==2){
            app.showToastC('开启成功',1500);
          }else if(that.data.type==3){
            app.showToastC('关闭成功',1500);
          }
          setTimeout(function(){
            let pages = getCurrentPages();    //获取当前页面信息栈
            let prevPage = pages[pages.length-2];
            prevPage.onLoadfun();
            that.navigateBack();
          },1000)
        }else{
          app.showToastC(res.data.Msg,2000);
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.stopPullDownRefresh();
      },
      complete:function(){
      }
    });

  },
  // 获取表单数据
  bindchange(e){
    let key=e.detail.name;
    this.data.obj[key]=e.detail.value;
    console.log(this.data.obj)
  },
  // 修改IP数据
  showActionSheet(e){
    let that= this;
    let index = e.detail.index;
    let groups = this.data.dynamicData[index].groups;
    let arr = [];
    for(var i=0;i<groups.length;i++){
      arr.push(groups[i].name);
    }
    wx.showActionSheet({
      itemList: arr,
      success (res) {
        that.setData({
          [`dynamicData[${index}].value`]:groups[res.tapIndex].name
        })
        that.data.obj.associationIp = groups[res.tapIndex].brand_id;
        console.log(that.data.obj)
      },
      fail (res) {
        console.log(res.errMsg)
      }
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
    var share = {
      title: `【开启签到】${this.data.name}邀请你来签到`,
      imageUrl: this.data.activity.cover?this.data.activity.cover:this.data.activity.banner,
      path: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + this.data.id +"&referee="+this.data.uid,
      success: function (res) { }
    }
    return share;
  },
  navigateBack(){
    wx.navigateBack({
      delta: 1
    })  
  },
  comjumpwxnav(e){
    let type = e.currentTarget.dataset.type;
    let whref = e.currentTarget.dataset.whref;
    app.comjumpwxnav(type,whref)
  },
})


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
    c_title: '发布动态',
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
        disabled:false,
        subtitle:'关联IP',
        value:'点击关联',
        name:'associationIp'
      },{
        isRequired:true,
        type:'textarea',
        subtitle:'动态内容',
        placeholder:'请输入动态内容',
        value:'',
        name:'dynamicContent'
      },{
        isRequired:false,
        type:'uploadImg',
        subtitle:'添加图片（最多上传九张，建议上传比例1:1)',
        name:'dynamicPic',
        imageList:[],
        mode:'multiple',
        storagelocation:'images/dynamic'
      },
      // {
      //   isRequired:false,
      //   type:'uploadVideo',
      //   subtitle:'添加视频',
      //   name:'dynamicVideo',
      //   src:'',
      //   storagelocation:'images/video'
      // },
      {
        isRequired:false,
        type:'link',
        brand_id:'',
        selectedArr:[],
        jumpType:2,
        pagetype:1,
        item_type:9034,
        subtitle:'关联图鉴',
        value:'点击关联',
        name:'associationActivity',
      },
      // {
      //   isRequired:false,
      //   type:'radio',
      //   subtitle:'允许评论对象',
      //   radioArr:['所有人可评论','指定群评论'],
      //   value:0,
      //   name:'allowComment'
      // },
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
    wx.hideShareMenu();
    // 判断是否授权
    this.activsign();
    this.setData({
      id:options.id||0
    })
  },
  onLoadfun:function(){
    this.setData({
      loginid: app.signindata.loginid,
      uid: app.signindata.uid
    });
    this.getIp();
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
  // 获取用户下所有的品牌id
  getIp(){
    wx.showLoading({
      title: '加载中',
    })
    let data = `mod=community&operation=showIp&uid=${this.data.uid}&loginid=${this.data.loginid}&type=4`
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
            this.getData();
            this.setData({
              [`dynamicData[0].disabled`]:true
            })
          }else{
            wx.hideLoading()
            wx.stopPullDownRefresh();
            this.setData({
              [`dynamicData[0].value`]:res.data.List.brandInfoList[0].name,
              [`dynamicData[3].brand_id`]:res.data.List.brandInfoList[0].brand_id,
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
  getData(){
    let data = `mod=community&operation=showDynamicInfo&uid=${this.data.uid}&loginid=${this.data.loginid}&drying_id=${this.data.id}`
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
          let info = res.data.Info;
          let List = res.data.List;
          let obj = this.data.obj;
          this.setData({
            [`dynamicData[0].value`]:info.brandName,
            [`dynamicData[1].value`]:info.title.split('hc').join('\n'),
            [`dynamicData[2].imageList`]:info.imgArr,
            [`dynamicData[3].value`]:List.illustratedInfo?List.illustratedInfo[0].title:'',
            [`dynamicData[3].selectedArr`]:List.illustratedInfo?JSON.stringify(List.illustratedInfo):'',
            [`dynamicData[3].brand_id`]:info.brand_id,
          // [`dynamicData[4].value`]:info.allow_comment_type,
            
          })
          obj.associationIp = info.brand_id;
          obj.dynamicContent = info.title;
          obj.dynamicPic = info.imgArr;
          obj.fieldGuideId = List.illustratedInfo?List.illustratedInfo[0].id:'';
          // obj.allowComment = info.allow_comment_type;
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
    let that = this;
    if(!obj.dynamicContent || obj.dynamicContent == ''){
      this.selectComponent('#settledForm').scrollto('dynamicContent');
      app.showToastC('请输入动态内容',1500);
      return false;
    }
    // if(!obj.dynamicPic || obj.dynamicPic.length == 0){
    //   this.selectComponent('#settledForm').scrollto('dynamicPic');
    //   app.showToastC('请添加图片',1500);
    //   return false;
    // }
    // if(!obj.allowComment){
    //   obj.allowComment = 0
    // }
    wx.showLoading({
      title: '加载中',
    })
    console.log(obj)
    // let data = `mod=community&operation=establish&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${obj.associationIp}&title=${obj.dynamicContent}&illustrated_id=${obj.fieldGuideId?obj.fieldGuideId:''}&imgArr=${obj.dynamicPic}&allowComment=${obj.allowComment}&id=${this.data.id}`

    let title = encodeURIComponent(obj.dynamicContent.split('\n').join('hc'));
    let data = `mod=community&operation=establish&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${obj.associationIp}&title=${title}&illustrated_id=${obj.fieldGuideId?obj.fieldGuideId:''}&imgArr=${obj.dynamicPic}&allowComment=0&id=${this.data.id}`
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
          if(this.data.id!=0){
            app.showToastC('修改成功',1500);
            setTimeout(function(){
              let pages = getCurrentPages();    //获取当前页面信息栈
              let prevPage = pages[pages.length-2];
              prevPage.getData();
              that.navigateBack();
            },1000)
          }else{
            app.showToastC('发布成功',1500);
            setTimeout(function(){
              that.navigateBack();
            },1000)
          }
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

        if(that.data.dynamicData[0].value != groups[res.tapIndex].name){
          // if(that.data.dynamicData[3].value != '点击关联'){
          //   app.showToastC('由于您更换了关联IP，请重新选择关联图鉴。',2500);
          // }
          that.setData({
            [`dynamicData[3].value`]:'点击关联',
            [`dynamicData[3].selectedArr`]:[],
            [`dynamicData[3].brand_id`]:groups[res.tapIndex].brand_id,
          })
          that.data.obj.fieldGuideName = '';
          that.data.obj.fieldGuideId = '';
        }

        that.setData({
          [`dynamicData[${index}].value`]:groups[res.tapIndex].name,
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

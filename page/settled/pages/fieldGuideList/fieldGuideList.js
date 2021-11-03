
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
    loadprompt:false,
    showType:1 // 2 图鉴 3 动态 1 活动
  },
  /**
   * 生命周期函数--监听页面加载
   */
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.listIndex = options.index || 0;
    this.data.brand_id = options.brand_id;
    this.data.pagetype = options.pagetype || 0
    var showType = options.type || '';

    if(showType == 1){
      var c_title = '关联活动';
    }else if(showType == 2){
      var c_title = '关联图鉴';
    }else if(showType == 3){
      var c_title = '关联动态';
    };
    
    this.setData({
      c_title: c_title,
      showType:showType
    })
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
    let data = `mod=community&operation=showActivityIllustrated&uid=${this.data.uid}&loginid=${this.data.loginid}&brand_id=${this.data.brand_id}&showType=${this.data.showType}&pid=${this.data.pid}`
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
            if(that.data.showType == 1){
               for(var i=0; i<List.length; i++){
                  List[i].end_time = util.toDate(List[i].end_time,2);
               };
            };
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
  navigateBack(){
    wx.navigateBack({
      delta: 1
    })  
  },

  // 选中数据
  selectData(e){
    var id = e.currentTarget.dataset.id;
    var dataList = this.data.dataList || [];
    var index = e.currentTarget.dataset.index || 0;
    if(this.data.showType == 1 || this.data.showType == 3){ // 活动/动态  多选
      this.setData({
        ['dataList['+index+'].is_select']:!this.data.dataList[index].is_select
      })
    }else{  // 图鉴单选
      for(var i = 0 ; i < dataList.length ; i++){
        if(dataList[i].id == id){
            if(dataList[i].is_select){
              dataList[i].is_select = false;
              this.data.selectTitle = '';
              this.data.selectId = '';
              this.data.relationType = '';
            }else{
              dataList[i].is_select = true;
              this.data.selectTitle = e.currentTarget.dataset.title;
              this.data.selectId = e.currentTarget.dataset.id;
              this.data.relationType = dataList[i].type || '';
            };
        }else{
            dataList[i].is_select = false;
        };
      };
      this.setData({
        dataList
      });
    };



  },
  chooseFieldGuide(e){
    let title = this.data.selectTitle;
    let id = this.data.selectId;
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length-2];

    console.log(prevPage.data.obj);
    console.log(prevPage.data.dynamicData);
    // return false;
    if(this.data.pagetype == 1){  // 动态页面  关联图鉴
      prevPage.setData({
        [`dynamicData[1].value`]:prevPage.data.obj.dynamicContent,
        [`dynamicData[2].imageList`]:prevPage.data.obj.dynamicPic,
        [`dynamicData[${this.data.listIndex}].value`]:title,
        [`dynamicData[4].value`]:prevPage.data.obj.allowComment,
      })
      prevPage.data.dynamicData[this.data.listIndex].value=title;
      prevPage.data.obj.fieldGuideName=title;
      prevPage.data.obj.fieldGuideId=id;
    }else{
      if(this.data.showType == 1 || this.data.showType == 3){  // 关联活动/动态
          var selectArr = [];
          this.data.dataList.forEach(element => {
            if(element.is_select){
              selectArr.push({
                 relevance_id:element.id,
                 name:element.title,
                 relation_type:element.type
              })
            }
          });
          // prevPage.setData({
          //   [`fieldGuideData2[0].value`]:this.data.selectTitle,
          // })
          console.log(selectArr)
          prevPage.data.obj.associationActivity=selectArr;
          // prevPage.data.obj.relationType = this.data.relationType;
      }else{
        prevPage.setData({
          [`fieldGuideData2[0].value`]:this.data.selectTitle,
        })
        prevPage.data.obj.associationActivity=this.data.selectId;
        prevPage.data.obj.relationType = this.data.relationType;
      }

    }
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

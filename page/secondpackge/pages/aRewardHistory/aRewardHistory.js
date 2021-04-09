var Dec = require('../../../../common/public.js'); //aes加密解密js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activityid: {
      type: Number,
      value: 'default value',
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    page:0,
    history:[],
    todayActivity:[], //今日完成活动集合
    nodata:false,
    loadprompt:false
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached(){
      this._gitList()
    },
    moved: function () { },
    detached: function () { },
  },
  methods:{
    _gitList(){
      var _this = this;
      var exh = Dec.Aese('mod=yifanshang&operation=history&id='+this.data.activityid+'&pid='+this.data.page)
      // wx.showLoading({title: '加载中...',})
      console.log("一番赏历史记录接口地址 ===== "+app.signindata.comurl + 'mod=yifanshang&operation=history&id='+this.data.activityid+'&pid='+this.data.page)
      wx.request({
        url: app.signindata.comurl + 'spread.php' + exh,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          // wx.hideLoading();
          wx.stopPullDownRefresh();
          console.log('一番赏历史记录 =========== ',res)
          if ( res.data.ReturnCode == 200 ) {
              if(res.data.List.history.length == 0 && _this.data.page == 0){
                _this.setData({ nodata : true})
              }else{
                if(res.data.List.history.length == 0 && _this.data.page != 0){
                  wx.showToast({
                    title: '没有更多记录了',
                    icon: 'none',
                    duration: 1000
                  })
                  _this.setData({loadprompt : true })
                }else{
                  let alldata = [..._this.data.history,...res.data.List.history];
                  console.log('记录===============',alldata)
                  _this.setData({history : alldata})
                }
              }
              // _this.setData({
              //   todayActivity:res.data.List.todayActivity
              // })
          } else {
            app.showToastC(res.data.msg);
          }
        },
        fail: function () { }
      });
    },
    _toARewardHistoryPage(e){
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({   
        url: "/page/secondpackge/pages/aRewardHistory/aRewardHistory?id=" + id
      });
    },
    _reset(){
      this.setData({page:0,history:[],loadprompt:false,nodata:false})
    },
    // 监听页面加载
    _onPullDownRefresh () {
        this._reset();
        this._gitList();
    },
    // 页面上拉触底事件的处理函数
    _onReachBottom () {
      if(this.data.loadprompt == false){
        this.setData({page:++this.data.page})
      }
      this._gitList();
    },
  },
})
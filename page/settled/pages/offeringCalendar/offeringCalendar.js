
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '发售日历',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    detailData:{},
    movies:[
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986673.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986197.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986516.jpg',
      'https://cdn.51chaidan.com/images/202106/source_img/38364_P_1624887986766.jpg'
    ],
    dateArr:[
      {id:1},
      {id:2},
      {id:3},
      {id:4},
      {id:5},
      {id:6},
      {id:7},
      {id:8},
      {id:9},
      {id:10},
      {id:11},
      {id:12}
    ],
    scrollleftTop:0,
    dateid:1,
    page:0,
    year:2021,
    isReverseSort:0, // 是否反着 翻页  下拉请求数据
    isSpecialCurrentMonth:0, // 当月是否是特殊月份
  }, 
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      year: e.detail.value
    })
  },
  
  scrollViewTop(e){
    var dateid = e.currentTarget.dataset.dateid || 0;
    this.setData({
      dateid:dateid
    });
    this.data.isSpecialCurrentMonth = 0;
    this.getData();
    let that = this;
    let top = '#top' + dateid;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(top).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollleftTop:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.hideShareMenu();
    
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.orderid = options.orderid;

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

    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1);

    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
      dateid:M
    });

    let top = '#top' + M;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(top).boundingClientRect();
    query.exec(function(res) {
      _this.setData({
        scrollleftTop:res[0].left - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })

    _this.getData()
  },
  // 获取数据
  getData(num=0){
    var _this = this;

    if (num == 0) {
      _this.data.page = 0;
      _this.setData({
        loadprompt: '加载更多.....',
        dataList: [],
        nodataiftr: false
      });
    } else {
      var pagenum = parseInt(_this.data.page)
      _this.data.page = ++pagenum;
      _this.setData({
        loadprompt: '加载更多.....',
        nodataiftr: false,
      });
    };


    console.log(_this.data.isReverseSort, _this.data.isSpecialCurrentMonth)

    console.log('mod=community&operation=calendarList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&year='+_this.data.year+'&month='+_this.data.dateid+'&isReverseSort='+_this.data.isReverseSort+'&isSpecialCurrentMonth='+_this.data.isSpecialCurrentMonth+'&pageId='+_this.data.page)

    var q1 = Dec.Aese('mod=community&operation=calendarList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&year='+_this.data.year+'&month='+_this.data.dateid+'&isReverseSort='+_this.data.isReverseSort+'&isSpecialCurrentMonth='+_this.data.isSpecialCurrentMonth+'&pageId='+_this.data.page);

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('日历数据=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            if(num == 0){
              var dataList = res.data.List || [];
            }else{
              var dataList = _this.dataprocessing(_this.data.dataList,res.data.List);
            };
            _this.setData({
              dataList:dataList
            })
        }else if(res.data.ReturnCode == 201){
          //   201时会返回
          _this.data.isSpecialCurrentMonth = 1;
          _this.data.isReverseSort = 1;
          if(num == 0){
            var dataList = res.data.List || [];
          }else{
            var dataList = _this.dataprocessing(_this.data.dataList,res.data.List);
          };
          _this.setData({
            dataList:dataList
          });

        }else if(res.data.ReturnCode == 300){
           app.showToastC('暂无更多数据')
        }else{
          wx.showModal({
            content: res.data.Msg || res.data.msg,
            showCancel:false,
            success: function (res) {}
          });          
        };
      },

    })
 },  
  // 数据处理
  dataprocessing: function (arrlist,newArr){
    var arrlist = arrlist || [];
    var newArr = newArr || [];
    for (var q = 0; q < arrlist.length; q++) {
      for (var w = 0; w < newArr.length; w++) {
        if (arrlist[q].year == newArr[w].year && arrlist[q].day == newArr[w].day && arrlist[q].month == newArr[w].month) {
          console.log(arrlist[q].year,arrlist[q].month,arrlist[q].day)
          arrlist[q].listItem = [...arrlist[q].listItem,...newArr[w].listItem];
          newArr[w].listItem = [...arrlist[q].listItem,...newArr[w].listItem]
        };
      };
    };
    var dataList = [...arrlist,...newArr];
    if(this.data.isReverseSort == 1){
        dataList.sort(this.compare('day'))
        console.log('排序=====',dataList)
        this.data.isReverseSort = 0;
    };
    // 去重
    var charr = this.distinct(dataList);

    return charr;
  },
  compare(day){
    return function(a,b){
        var value1 = a[day];
        var value2 = b[day];
        return value1 - value2;
    }
  },

  //  数组去重
  distinct:function(arr){
    var arr = arr,i,j,len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
          if (arr[i].year == arr[j].year && arr[i].month == arr[j].month && arr[i].day == arr[j].day){
              arr.splice(j,1);
              len--;
              j--;
          }
        }
    }
    return arr;
  },
  toDate(number,num) {
    var date = new Date(number * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + '/' + M + '/' + D +' ' + h + ':' + m + ':' +s;
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

    var date = new Date();
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1);
    // isSpecialCurrentMonth 不是特殊月份
    if(Y ==this.data.year && this.data.dateid == M && this.data.isSpecialCurrentMonth == 0){
      // isReverseSort 下拉==1 不是特殊月份并且是当前月
      this.data.isReverseSort = 1;
    }else{
      this.data.isReverseSort = 0;
    };    

    app.downRefreshFun(() => {
      if(this.data.isReverseSort == 1){
        this.getData(1)
      }else{
        this.getData()
      };
    })  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getData(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    return {
      title:app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！',
      path: 'pages/index/index',
      imageUrl:indexShareImg || 'https://www.51chaidan.com/images/background/zhongqiu/midautumn_share.jpg',
      success: function (res) {}
    } 
  },
  details(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    if(type == 4){
      app.comjumpwxnav(9003,id,'','')
    }else if(type == 9035){
      app.comjumpwxnav(9035,id,'','')
    }else{
      app.comjumpwxnav(1,id,'','')
    };
  },
  // 跳转品牌详情
  jumpexhdetail: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    wx.navigateTo({
      url: "/page/secondpackge/pages/brandDetails/brandDetails?id=" + id + "&settlement=0",
    });
  },
  // 拉起订阅
  subscrfun: function (w) {
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    var _this = this;
    _this.data.id = id;
    var subscribedata = {
        "template_id":[
          "Q0tWM7kOihw1TilTeR3YmLzWp5tS0McgyOeJx2xX-B0",
          "_z_6MxJrZ2PvD5gdjIQ1dP_-d7IAug7xeRzdmcg2ols"
        ],
        "subscribe_type":[
          "10",
          "10"
        ]
    };
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            var is_show_modal = true;
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
                if (is_show_modal) {
                  _this.subshowmodalfun();
                  is_show_modal = false;
                };
              };
            };
          },
          complete() { }
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
              _this.subshowmodalfun();
            };
          }
        })
      };
    };
  },
  subshowmodalfun: function () {
    var _this = this;
    wx.showModal({
      title: '提示',
      content:'订阅成功,开售前通过微信发送提醒',
      showCancel: false,
      success: function (res) {
        _this.setData({
          isSubscribeCoupon:false
        })
      }
    })
  },

})


var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '全部IP',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    ordername:'',
    seckillOrDraw : 4, // -1 正常商品 4 抽选
    umid:1,
    bankname:'',
    brandwhole:[],
    enlargez:-1110,
    enlargeL:'',
    lastX: 0,
    lastY: 0,
    iftrue:true,
    parentJ:0,
    timestamp:0,
    arrTouchBarPosition:[]
  },
  jumpsouchtem:function(w){
    var bankcode = w.currentTarget.dataset.bankcode || w.target.dataset.bankcode || 0;
    var bankName = w.currentTarget.dataset.bankname || w.target.dataset.bankname || 0;
    let pages = getCurrentPages();    //获取当前页面信息栈
    let prevPage = pages[pages.length-2];
    prevPage.setData({
      [`enterpriseData[2].value`]:bankName
    })
    prevPage.data.obj.bankdeposit = bankcode;

    prevPage.getProvince()
    wx.navigateBack({
      delta: 1
    })
  },

  onFocus: function (w) {
    this.setData({
      bankname:""
    });
  },
  jumpsearch:function(){
    this.getData();
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      bankname: e.detail.value
    });
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
    // 判断是否登录
    if (_this.data.loginid != '' && _this.data.uid != '') {
      _this.onLoadfun();
    } else {
      app.signin(_this)
    };

  },
  onLoadfun(){
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.setData({
      uid: app.signindata.uid,
      windowHeight: app.signindata.windowHeight - wx.getStorageSync('statusBarHeightMc')||0,
    });

    this.getData();
  },
  getData(){
     var _this = this;
     console.log('mod=account&operation=listBank&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&bankName='+_this.data.bankname||'')
     var qqq = Dec.Aese('mod=account&operation=listBank&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&bankName='+_this.data.bankname||'');
     wx.showLoading({
       title: '加载中...',
       mask:true
     })
     wx.request({
       url: app.signindata.comurl + 'pingan.php' + qqq,
       method: 'GET',
       header: {'Accept': 'application/json'},
       success: function (res) {
         wx.hideLoading()
         console.log('银行列表=====',res)
         if (res.data.ReturnCode == 200) {
          _this.setData({
            listBank:res.data.List.bank
          },()=>{
            wx.createSelectorQuery()
              .selectAll('.letterBoxEve')
              .boundingClientRect()
              .exec(function(res) {
                 console.log('arrTouchBarPosition=====',res[0])
                  _this.data.arrTouchBarPosition = res[0];  // 需要预先定义arrTouchBarPosition
              });
          });
         }else{
           app.showToastC(res.data.Msg)  
         };
       }
     });
  },
  touchmove(e) {
      var _this = this;
      // 节流，需要预先定义timestamp
      let now = new Date().getTime();
      if (now - _this.data.timestamp < 150) {
          return;
      }
      _this.data.timestamp = now;

      // 无意触发
      if (e.touches.length > 1) {
          return;
      }

      let clientY = e.touches[0].clientY;
      for (let item of _this.data.arrTouchBarPosition) {
          // 如果已经在目标位置，则不执行
          if (clientY >= item.top && clientY <= item.bottom) {
              if (item.dataset.index == this.data.enlargeL) {
                  break;
              }

              this.setData({
                 enlargeL: item.dataset.index,
                 enlargez: item.top - _this.data.parentJ - 25 + 10,
              });
              break;
          }
      }
  },
  // 关注 和 点赞 函数
  followfun: function(w) {
    var _this = this;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('关注接口=====',res)
        if (res.data.ReturnCode == 200) {
          if(type == 0){
            var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || false;
            _this.setData({
              ['brandwhole['+index+'].listBrand['+ num +'].isFocus']:!istype
            }); 
          }

        };
      }
    });
  },
  jumpLetter(w){

    var _this = this;
    wx.createSelectorQuery().select('#boxtext').boundingClientRect(function(rect){
      _this.setData({
        parentJ:rect.top,
      })
    }).exec()


    console.log('w=========',w)
    
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;
    var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
    
    this.setData({
      enlargez:w.currentTarget.offsetTop - 25 + 9,
      enlargeL:index,
      num
    })
    // var query = wx.createSelectorQuery();
    // query.select('#jump' + index).boundingClientRect();
    // query.selectViewport().scrollOffset();
    // query.exec(function(res) {
    //   if (res && res[0] && res[1]) {
    //     wx.pageScrollTo({
    //        scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||99,
    //        duration:300,
    //     })
    //   }
    // });   
  },


  touchMove(event){
    var _this = this;
    let now = new Date().getTime();
    if (now - _this.data.timestamp < 150) {
      return;
    }
    _this.data.timestamp = now;





    // if(this.data.iftrue){
    //   this.data.iftrue = false
    //    setTimeout(()=>{
          
          
          var num = _this.data.num;
          var brandwhole = _this.data.brandwhole;
          var index = _this.data.enlargeL;
      
          // console.log(event)
          let currentX = event.touches[0].pageX
          let currentY = event.touches[0].pageY
          let tx = currentX - _this.data.lastX
          let ty = currentY - _this.data.lastY
          var text = ''
          //上下方向滑动
          console.log('=============ty',ty)
          if (ty < 0){
            // text = "向上滑动"
            text = true
            if(num >= 0){
              index = brandwhole[num].initial;
              _this.data.num =  num - 1;
            }else{
              num = 0;
              index = brandwhole[num].initial;
            };
          } else if (ty > 0){
            // text = "向下滑动"
            text = true
            console.log('=================')
            if(num <= brandwhole.length-1){
              index = brandwhole[num].initial;
              _this.data.num =  num + 1
              console.log(_this.data.num,'=============')
            }else{
              num = brandwhole.length-1;
              index = brandwhole[num].initial;
            };
          }
          console.log(num,index)
          _this.data.iftrue = true
          


          wx.createSelectorQuery().select('#qq'+index).boundingClientRect(function(rect){
              console.log(rect)
               console.log(rect.top , _this.data.parentJ)
              _this.setData({
                enlargez:rect.top - _this.data.parentJ - 25 + 10,
                enlargeL:index,
              })
          }).exec()
      
          var query = wx.createSelectorQuery();
          query.select('#jump' + index).boundingClientRect();
          query.selectViewport().scrollOffset();
          query.exec(function(res) {
            if (res && res[0] && res[1]) {
              wx.pageScrollTo({
                scrollTop:res[0].top+res[1].scrollTop-app.signindata.statusBarHeightMc||99,
                duration:300,
              })
            }
          }); 
      
          //将当前坐标进行保存以进行下一次计算
          _this.data.lastX = currentX
          _this.data.lastY = currentY



    //    },150)
    // }



  },
  touchendFn(){
    console.log('结束')
    this.setData({
      enlargez:-199999
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
    app.downRefreshFun(() => {
      this.getData()
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var _this = this;

    var indexShare = app.signindata.indexShare || [];
    var indexShareNum = Math.floor(Math.random() * indexShare.length) || 0;
    var indexShareImg = '';
    if(indexShare.length!=0 && indexShare[indexShareNum]){
      indexShareImg = indexShare[indexShareNum]+'?time=' + Date.parse(new Date());
    };
    var title = app.signindata.titleShare?app.signindata.titleShare:'你喜欢的潮玩都在这里！'
    var onshareUrl = 'pages/index/index';
    var onshareImg = indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg';

    return {
      title: title ,
      path: onshareUrl,
      imageUrl:onshareImg,
      success: function (res) {}
    };

  },

})

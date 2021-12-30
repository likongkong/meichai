
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '售后服务',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    ordername:'',
    payStatus:[
      {name:'售后申请',num:'1'},
      // {name:'处理中',num:'2'},
      {name:'申请记录',num:'3'},
      {name:'客服消息',num:'4'}
    ], 
    centerIndex:'1',

    order:[],
    nodataiftr:false,
    is_search:false,
    conversationList:[]

  },

  // 售后详情
  afterSalesDetails(w){
    let iid = w.currentTarget.dataset.iid || '';
    wx.navigateTo({
      url: "/page/settled/pages/AfterSalesDetails/AfterSalesDetails?oid="+iid+'&bou=2'
    });
  },  
  classifyChange(e){
    let that = this;
    let index = e.currentTarget.dataset.index || 0;
    let ele = '#ele' + index;
    that.setData({
      centerIndex:index,
    });

    if(this.data.centerIndex == 4){
      this.getDataTim();
    }else if(this.data.centerIndex == 3){
      this.getDataRecord()
    }else{
      this.getData();
    };
    
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select(ele).boundingClientRect();
    query.exec(function(res) {
      that.setData({
        scrollleft:e.currentTarget.offsetLeft - wx.getSystemInfoSync().windowWidth/2 + (res[0].width/2)
      })
    })
  },  
  is_searchfun(){
    this.setData({
      is_search:!this.data.is_search
    })
  },
  // input 值改变
  inputChange: function (e) {
    this.setData({
      ordername: e.detail.value
    });
  },
  jumpsearch:function(){
    // this.eldatalistfun(0);
    if(this.data.centerIndex == 4){
      this.getDataTim();
    }else if(this.data.centerIndex == 3){
      this.getDataRecord()
    }else{
      this.getData();
    };

  },
  onFocus: function (w) {
    this.setData({
      ordername:""
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
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });

    if(this.data.centerIndex == 4){
      this.getDataTim();
    }else if(this.data.centerIndex == 3){
      this.getDataRecord()
    }else{
      this.getData();
      this.getDataTim();
    };
    
  },
  // 售后申请 获取数据
  getData(num=1){
    var _this = this;
    if (num==1){
      _this.setData({order : [],page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=saleAfterList&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&search='+_this.data.ordername);

    console.log('mod=saleAfterList&operation=list&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&search='+_this.data.ordername)

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'order.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('订单列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            var order = res.data.List || [];
            if (num==1){
                _this.setData({
                  order,
                  nodataiftr:true
                });
            }else{
              if(order && order.length !=0){
                _this.setData({
                  order:[..._this.data.order,...order]
                });
              }else{
                app.showToastC('暂无更多数据');
              };
            };
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
  // 申请记录 获取数据
  getDataRecord(num=1){
    var _this = this;
    if (num==1){
      _this.setData({order : [],page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=saleAfterList&operation=applyList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&search='+_this.data.ordername);

    console.log('mod=saleAfterList&operation=applyList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&search='+_this.data.ordername)

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'order.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('申请记录=列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            var order = res.data.List || [];
            if (num==1){
                _this.setData({
                  order,
                  nodataiftr:true
                });
            }else{
              if(order && order.length !=0){
                _this.setData({
                  order:[..._this.data.order,...order]
                });
              }else{
                app.showToastC('暂无更多数据');
              };
            };
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

  // 获取数据
  getDataTim(num=1){
    var _this = this;

    if (num==1){
      _this.setData({countOrder:0,conversationList : [],page : 1,nodataiftr:false});
    }else{
      var pagenum = _this.data.page;
      _this.data.page = ++pagenum;
    };

    var q1 = Dec.Aese('mod=userSig&operation=newsList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&type=2');

    console.log('mod=userSig&operation=newsList&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&page='+_this.data.page+'&type=2')

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'im.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('消息列表=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
            var conversationList = res.data.List.info || [];
            if (num==1){
                var is_read = res.data.List.is_read;
                var no_read = res.data.List.no_read;
                console.log(1111111111)
                _this.setData({
                  is_read,
                  no_read,
                  conversationList,
                  nodataiftr:true
                });
            }else{
              console.log(22222222)
              if(conversationList && conversationList.length !=0){
                _this.setData({
                  conversationList:[..._this.data.conversationList,...conversationList]
                });
              }else{
                app.showToastC('暂无更多数据');
              };
            };
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
      if(this.data.centerIndex == 4){
          this.getDataTim(1);
      }else if(this.data.centerIndex == 3){
          this.getDataRecord(1);
      }else{
          this.getData(1);
      };
    })   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.centerIndex == 4){
        this.getDataTim(2);
    }else if(this.data.centerIndex == 3){
        this.getDataRecord(2);
    }else{
        this.getData(2);
    };
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
      imageUrl:indexShareImg || 'https://cdn.51chaidan.com/images/default/shareImg.jpg',
      success: function (res) {}
    } 
  },
  // 复制单号
  copyCart(w){
    var cart = w.currentTarget.dataset.cart || w.target.dataset.cart || '';
    wx.setClipboardData({
      data: cart || '',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
  },
  // 复制单号
  copyCartAddess(w){
    var add = w.currentTarget.dataset.add || w.target.dataset.add || '';
    wx.setClipboardData({
      data: add || '',
      success: function (res) {
        app.showToastC('复制成功');
      }
    });
  },
  handleTouchMove(e) {
    if (!this.lock) {
      this.last = e.detail.x
      this.lock = true
    }
    if (this.lock && e.detail.x - this.last < -5) {
      this.setData({
        xScale: -75,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    } else if (this.lock && e.detail.x - this.last > 5) {
      this.setData({
        xScale: 0,
      })
      setTimeout(() => {
        this.lock = false
      }, 2000)
    }
  },

  // 跳转详情
  jumpTimDetail(e){
    if(e.currentTarget.dataset.fid == app.signindata.uid){
      var id = e.currentTarget.dataset.tid;
    }else{
      var id = e.currentTarget.dataset.fid;
    };
    var num = e.currentTarget.dataset.num || 0;
    var comdata = this.data.order[num];
    var order = {
      order_id: comdata.oid || '',
      order_name: comdata.goods_name || '',
      photo_url: comdata.goods_img || '',
      price: comdata.order_amount || '',
      style: comdata.goods_role_name || '',
    }
    wx.navigateTo({ 
      url: `/page/settled/pages/timHomePage/timHomePage?id=${id}&order=${JSON.stringify(order)}`
    });
  },
  // 跳转详情
  jumpTimDetailList(e){
    if(e.currentTarget.dataset.fid == app.signindata.uid){
      var id = e.currentTarget.dataset.tid;
    }else{
      var id = e.currentTarget.dataset.fid;
    };
    var groupid = e.currentTarget.dataset.groupid || 0;
    wx.navigateTo({ 
      url: `/page/settled/pages/timHomePage/timHomePage?id=${id}&groupid=${groupid}`
    });
  },
  // 取消申请
  withdraw(e){
    var iid = e.currentTarget.dataset.iid || 0;
    var ind = e.currentTarget.dataset.ind || 0;
    var _this = this;
    wx.showModal({
      title:'取消申请',
      content: '你确定要取消售后申请吗？',
      confirmColor:'#02BB00',
      success: (res) => {
        if (res.confirm) {
          var q1 = Dec.Aese('mod=saleAfterList&operation=refundOperation&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id='+iid+'&type='+ind);
          console.log('mod=saleAfterList&operation=refundOperation&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&id='+iid+'&type='+ind)
          wx.showLoading({title: '加载中...',mask:true})
          wx.request({
            url: app.signindata.comurl + 'order.php' + q1,
            method: 'GET',
            header: {'Accept': 'application/json'},
            success: function(res) {
              console.log('取消申请=====',res)
              wx.hideLoading();
              if (res.data.ReturnCode == 200) {
                  wx.showModal({
                    content: res.data.Msg || res.data.msg,
                    showCancel:false,
                    success: function (res) {}
                  }); 
                  _this.getDataRecord();
              }else{
                wx.showModal({
                  content: res.data.Msg || res.data.msg,
                  showCancel:false,
                  success: function (res) {}
                });          
              };
            },
      
          })
        };
      },
    })
  },
  deleteConversation(e) {
    var _this = this;
    // var id = e.currentTarget.dataset.id || 0;
    // var num = e.currentTarget.dataset.num || 0;
    // console.log(id,num)
    wx.showModal({
      content: '确认删除会话？',
      success: (res) => {
        if (res.confirm) {
            if(e.currentTarget.dataset.fid == app.signindata.uid){
              var id = e.currentTarget.dataset.tid;
            }else{
              var id = e.currentTarget.dataset.fid;
            };
            var q1 = Dec.Aese('mod=userSig&operation=del&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&from_userid='+id);
            wx.showLoading({title: '加载中...',mask:true})
            wx.request({
              url: app.signindata.comurl + 'im.php' + q1,
              method: 'GET',
              header: {'Accept': 'application/json'},
              success: function(res) {
                console.log('删除会话=====',res)
                wx.hideLoading();
                if (res.data.ReturnCode == 200) {
                    _this.getDataTim();
                }else{
                  wx.showModal({
                    content: res.data.Msg || res.data.msg,
                    showCancel:false,
                    success: function (res) {}
                  });          
                };
              },

            })
        };
      },
    })
  },
  // 申请售后
  refund: function (e) {
    var oid = e.currentTarget.dataset.oid || 0;
    var ind = e.currentTarget.dataset.ind || 0; // 0 创建 1 修改
    wx.navigateTo({
      url: "../../../secondpackge/pages/refund/refund?oid="+oid+'&type='+ind
    });
  },
  // 寄回信息填写
  returnMessage(e){
    var oid = e.currentTarget.dataset.oid || 0;
    var ind = e.currentTarget.dataset.ind || 0; // 0 创建 1 修改
    wx.navigateTo({
      url: "/page/secondpackge/pages/fillInOrderNum/fillInOrderNum?oid="+oid+'&type='+ind
    });
  },
  // 寄回物流
  sendBackLogistics:function(w){
    var id = w.target.dataset.id || w.currentTarget.dataset.id;
    var gcover = w.target.dataset.gcover || w.currentTarget.dataset.gcover;
    wx.navigateTo({  
      url:'/page/settled/pages/sendBackLogistics/sendBackLogistics?id='+id+'&gcover='+gcover
    })
  },
  jump: function (w) {
    var whref = w.currentTarget.dataset.href || w.target.dataset.href;
    var item_type = w.currentTarget.dataset.item_type || w.target.dataset.item_type || 0;
    var wname = w.currentTarget.dataset.name || w.target.dataset.name || '美拆';
    app.comjumpwxnav(item_type,whref,wname)
  },
})

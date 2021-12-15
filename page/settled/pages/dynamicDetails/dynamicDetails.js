
var Dec = require('../../../../common/public');//aes加密解密js
var tcity = require("../../../../common/citys.js");
var api = require("../../../../utils/api.js");
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '动态',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    detailData:{},
    illustrated_id:'',
    textconcent:'',
    placeholderTxt:'评论一下~'
  },
  // 删除图鉴 
  del_illustrated(){
    var _this = this;

    var qqq = Dec.Aese('mod=community&operation=del_illustrated&uid='+_this.data.uid+'&loginid='+_this.data.loginid + '&id=' + _this.data.drying_id + '&type=2');
    console.log('mod=community&operation=del_illustrated&uid='+_this.data.uid+'&loginid='+_this.data.loginid + '&id=' + _this.data.drying_id + '&type=2')
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('删除动态=====',res)
        if (res.data.ReturnCode == 200) {
          wx.showModal({
            content: '删除成功',
            showCancel: false,
            success: function(res) {
              let pages = getCurrentPages();
              let prevpage = pages[pages.length - 2];
              if (prevpage) {
                wx.navigateBack();
                prevpage.onLoadfun()
              } else {
                wx.redirectTo({
                  url: "/pages/index/index"
                });
              };
            }
          });
  
        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });
  },
  // 更新用户信息
  getUserProfileCom(w){
    console.log(1111111)
    app.getUserProfile((res,userInfo) => {
      this.inputboxfun(w);
    },'',1)
  },
  inputboxfun:function(w){
    console.log(w)
    var comment_id = w.currentTarget.dataset.comment_id || w.target.dataset.comment_id || 0;
    var _this = this;
    var name = w.currentTarget.dataset.name || w.target.dataset.name || 0;
    if(name){
      var placeholderTxt = '回复@'+name;
    }else{
      var placeholderTxt = '评论一下~';
    }
    _this.setData({ inputbox: true, comment_id: comment_id,placeholderTxt:placeholderTxt});
    setTimeout(function(){
      _this.setData({autofocus: true})
    },600)
  }, 

  //监听input获得焦点
  bindfocus: function (e) {
    let that = this;
    that.setData({
      inputboxheight: e.detail.height||200
    })
  },
  //监听input值改变
  bindinput: function (e) {
    this.setData({
      textconcent: e.detail.value || '',
    });
  },
  inputboxbgfun:function(){
    this.setData({ inputbox:false})
  },
  // 失去焦点
  bindblur:function(){
    this.setData({
      inputboxheight: 0,
      autofocus: false
    })
  },

  jumpdetail(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || '';
    var type = w.currentTarget.dataset.type || w.target.dataset.type || '';
    if(type == 1){
      var item_type = 1;
    }else if(type == 2){
      var item_type = 9003;
    }else if(type == 4){
      var item_type = 9032;
      id = 'id='+id
    }
    app.comjumpwxnav(item_type, id, '', '')

  },

  subscrfundom:function(w){
    var _this = this;
    var sellList = _this.data.sellList;
    var index = w.currentTarget.dataset.index || w.target.dataset.index || 0;

    if(sellList&&sellList[index]&&sellList[index].subscribeList){
      _this.setData({
        id:sellList[index].id,
        subscribedata:sellList[index].subscribeList
      })
      _this.subscrfunstar()
    }

  },
  // 拉起订阅
  subscrfunstar: function () {
    var _this = this;
    console.log(2,subscribedata)
    var subscribedata = _this.data.subscribedata || '';
    if (subscribedata && subscribedata.template_id && app.signindata.subscribeif) {
      if (subscribedata.template_id instanceof Array) {
        wx.requestSubscribeMessage({
          tmplIds: subscribedata.template_id || [],
          success(res) {
            for (var i = 0; i < subscribedata.template_id.length; i++) {
              if (res[subscribedata.template_id[i]] == "accept") {
                app.subscribefun(_this, 0, subscribedata.template_id[i], subscribedata.subscribe_type[i]);
              };
            };
          },
        })
      } else {
        wx.requestSubscribeMessage({
          tmplIds: [subscribedata.template_id || ''],
          success(res) {
            if (res[subscribedata.template_id] == "accept") {
              app.subscribefun(_this, 0, subscribedata.template_id, subscribedata.subscribe_type);
            };
          },
          complete() {}
        })
      };
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // wx.hideShareMenu();
    
    // '已经授权'
    _this.data.loginid = app.signindata.loginid;
    _this.data.uid = app.signindata.uid;
    _this.data.orderid = options.orderid,
    _this.setData({
      drying_id:options.did || 0
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
    _this.setData({
      uid: app.signindata.uid,
      avatarUrl: app.signindata.avatarUrl,
      isProduce: app.signindata.isProduce,
      isBlindBoxDefaultAddress: app.signindata.isBlindBoxDefaultAddress,
    });
    this.getData();
    this.getComments();
  },
  // 获取数据
  getData(){
    var _this = this;

    var q1 = Dec.Aese('mod=community&operation=showDynamicInfo&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&drying_id='+_this.data.drying_id);

    wx.showLoading({title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + q1,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function(res) {
        console.log('动态详情=====',res)
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          res.data.Info.title = res.data.Info.title.split('hc').join('\n');
           _this.setData({
             dataInfo:res.data.Info,
             illustratedInfo:res.data.List.illustratedInfo
           })
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
 // 关注 和 点赞 函数
 followfun: function(w) {
    var _this = this;
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    console.log('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id)
    var qqq = Dec.Aese('mod=community&operation=likeAttention&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&setType=' + type + '&id=' + id);
    wx.showLoading({ title: '加载中...',mask:true})
    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('同款想要=====',res)
        wx.hideLoading();
        if (res.data.ReturnCode == 200) {
          if(type == 7){
            // var h = w.currentTarget.dataset.h || w.target.dataset.h || 0;
            // var num = w.currentTarget.dataset.num || w.target.dataset.num || 0;
            // var ind = w.currentTarget.dataset.ind || w.target.dataset.ind || 0;
            // if(h == 1){
            //   if(!_this.data.commentlist[num].isPraise){
            //     var praise = parseInt(_this.data.commentlist[num].praise) + 1;
            //   }else{
            //     var praise = parseInt(_this.data.commentlist[num].praise) - 1;
            //   };
            //   _this.setData({
            //     ['commentlist[' + num + '].isPraise'] : !_this.data.commentlist[num].isPraise,
            //     ['commentlist[' + num + '].praise'] : praise
            //   })
            // }else if(h == 2){
            //   if(!_this.data.commentlist[num].secondLevelCommentList[ind].isPraise){
            //     var praise = parseInt(_this.data.commentlist[num].secondLevelCommentList[ind].praise) + 1;
            //   }else{
            //     var praise = parseInt(_this.data.commentlist[num].secondLevelCommentList[ind].praise) - 1;
            //   };
            //   _this.setData({
            //     ['commentlist[' + num + '].secondLevelCommentList['+ ind +'].isPraise'] : !_this.data.commentlist[num].secondLevelCommentList[ind].isPraise,
            //     ['commentlist[' + num + '].secondLevelCommentList['+ ind +'].praise']:praise
            //   })
            // }else{
             
            // };
            _this.getComments();
          }else{
            _this.getData();
          }
            
        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });
  },
  // 获取评论
  getComments: function(num=1) {
    var _this = this;

    if (num==1){
      _this.setData({pid : 0});
    }else{
      var pagenum = _this.data.pid;
      _this.data.pid = ++pagenum;
    };

    console.log('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.drying_id + '&type=1');

    var qqq = Dec.Aese('mod=community&operation=showComment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.pid + '&id=' + _this.data.drying_id + '&type=1');

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('获取评论=====',res)
        if (res.data.ReturnCode == 200) {
            if(num == 1){
              _this.setData({
                commentNumber:res.data.Info.commentNumber || 0,
                commentlist:res.data.List
              })
            }else{
              if(res.data.List && res.data.List.length !=0){
                var list = [...res.data.List,_this.data.commentlist]
                _this.setData({
                  commentlist:list
                })
              }else{
                app.showToastC('暂无更多数据');
              }
            }


        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });
  },

  // 提交评论
  submissionfun:function(){
    var _this = this;

    _this.setData({ inputbox: false, autofocus: false });
    
    if(_this.data.textconcent == ''){
       app.showToastC('评论内容不能为空');
       return false;
    }

    console.log('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.drying_id + '&type=1&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataInfo.brand_id)

    var qqq = Dec.Aese('mod=community&operation=addcomment&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&pid=' + _this.data.comment_id + '&id=' + _this.data.drying_id + '&type=1&comment='+ _this.data.textconcent +'&brand_id='+_this.data.dataInfo.brand_id);

    wx.request({
      url: app.signindata.comurl + 'toy.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('发布评论=====',res)
        if (res.data.ReturnCode == 200) {
          _this.setData({
            textconcent:'',
            inputboxheight:0,
            autofocus: false,
            placeholderTxt:'评论一下~'
          });
          _this.getComments();
        }else{
          if(res.data.Msg){
            wx.showModal({
              content: res.data.Msg || '',
              showCancel: false,
              success: function(res) {}
            });
          };
        };
      }
    });


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
    app.downRefreshFun(() => {
      this.getData()
    })  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getComments(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var _this = this;
    var reshare = {
      title: _this.data.dataInfo.title && _this.data.dataInfo.title!=''?_this.data.dataInfo.title:'发布了一条新的动态',
      path: 'page/settled/pages/dynamicDetails/dynamicDetails?did='+_this.data.drying_id,
      imageUrl: _this.data.dataInfo.imgArr[0],
      success: function(res) {},
    };
    return reshare
  },
  // 跳转日历
  jumpoffering(w){
    var id = w.currentTarget.dataset.id || w.target.dataset.id || 0;
    var type = w.currentTarget.dataset.type || w.target.dataset.type || 0;
    var istype = w.currentTarget.dataset.istype || w.target.dataset.istype || 0;
    if(istype == 1){ // 秒杀
      type = 1;
    }else if(istype == 2){ // 抽选
      type = 9003;
    }else if(istype == 3){ // 动态
      type = 9036;
    }
    app.comjumpwxnav(type,id,'','')
  } 
})

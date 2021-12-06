
var Dec = require('../../../../common/public');//aes加密解密js
var api = require("../../../../utils/api.js");
const util = require('../../../../utils/util');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    c_title: '取件信息',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,
    uid:'',
    loginid:'',
    isExplain:false,
    isPhone:false,
    isPhone1:false,
    isVisitTtime:false,
    goodsInfo:{
      kgNumber:1,  //重量信息
      pieceNumber:1,  //件数
      goodsArr:[{name:'玩具',id:0},{name:'日用品',id:1},{name:'服饰',id:2}],
      selectedGoodsArrIndex:0, //选中的物品类型
      textareaInput:'',  //备注
    },
    tipbacktwo:false,
    receivingaddress:false,
    phone:'',  //取件
    tipphone:'',//取件
    tipaid:'',//取件
    phone1:'',  //收件
    tipphone1:'',//收件
    tipaid1:'',//收件
    isModification:false,
    takePhone:util.plusXing('13055554444',3,4),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    // '已经授权'
    this.data.loginid = app.signindata.loginid;
    this.data.uid = app.signindata.uid;
    this.data.status  = options.status;
    this.data.sendBackId  = options.sendBackId || 0;
    // 判断是否登录
    if (this.data.loginid != '' && this.data.uid != '') {
      this.onLoadfun();
    } else {
      app.signin(this)
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
    // if(this.data.status==1){
      this.setData({
        status: this.data.status,
      });
      this.getShowSendBack();
    // }
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

  },
  makePhoneCall(){
    wx.makePhoneCall({
      phoneNumber: '13055554444'
    })
  },
   // 查看详情
   getShowSendBack(){
    var _this = this;
    console.log('mod=send_back&operation=show_send_back&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&id='+this.data.sendBackId)
    var qqq = Dec.Aese('mod=send_back&operation=show_send_back&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&id='+this.data.sendBackId);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('查看详情===',res)
        // if (res.data.ReturnCode == 200) {
          _this.data.order_id = res.data.List.order_id;
          if(_this.data.status == 1){
            if(!_this.data.isModification){
              _this.data.savedStart_time = res.data.List.StartTime;
              _this.data.savedEnd_date = res.data.List.EndTime;
              _this.data.skyName = res.data.List.skyName;
              _this.data.id = res.data.List.id;
              for(var i=0;i<_this.data.goodsInfo.goodsArr.length;i++){
                if(_this.data.goodsInfo.goodsArr[i].name == res.data.List.GoodsName){
                  _this.setData({
                    [`goodsInfo.selectedGoodsArrIndex`]:i
                  })
                  break;
                }
              }
              _this.setData({
                [`goodsInfo.kgNumber`]:res.data.List.GoodsWeight,
                [`goodsInfo.kgNumber`]:res.data.List.GoodsWeight,
                [`goodsInfo.textareaInput`]:res.data.List.Remark,
                tipname:res.data.List.senderInfo.consignee,
                tipphone:res.data.List.senderInfo.mobile,
                phone:util.plusXing(res.data.List.senderInfo.mobile,3,4),
                tipaddress:res.data.List.senderInfo.address,
                deliveryType:res.data.List.type,
                audit_status:res.data.List.audit_status
              })
              _this.data.tipaid = res.data.List.senderInfo.address_id;
              if(res.data.List.exchangeGoodsInfo){
                _this.setData({
                  tipname1:res.data.List.exchangeGoodsInfo.consignee,
                  tipphone1:res.data.List.exchangeGoodsInfo.mobile,
                  phone1:util.plusXing(res.data.List.exchangeGoodsInfo.mobile,3,4),
                  tipaddress1:res.data.List.exchangeGoodsInfo.address,
                })
                _this.data.tipaid1 = res.data.List.exchangeGoodsInfo.address_id;
              }
              _this.getShowShipmentsTime();
            }else{
              _this.data.isModification=false;
              app.showToastC(res.data.Msg,3000);
              // setTimeout(()=>{
              //   wx.navigateBack({
              //     delta: 1
              //   })  
              // },2000)
            }
          }else{
            _this.setData({
              deliveryType:res.data.List.type
            })
          }
          _this.nextpagediao();
        // }else{
        if(res.data.ReturnCode != 200){
          app.showToastC(res.data.Msg,3000)  
        };
      }
    });
  },
  // 返回上一页
  goback(){
    wx.navigateBack({
      delta: 1
    })  
  },
  // 取消上门取件
  cancel(){
    var _this = this;
    console.log('mod=send_back&operation=cancel&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&id='+this.data.sendBackId)
    var qqq = Dec.Aese('mod=send_back&operation=cancel&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&id='+this.data.sendBackId);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        wx.hideLoading()
        console.log('取消===',res)
        if (res.data.ReturnCode == 200) {
          app.showToastC('取消成功',1500);
          setTimeout(()=>{
            let pages = getCurrentPages();    //获取当前页面信息栈
            let prevPage = pages[pages.length-2];
            prevPage.onLoadfun();
            wx.navigateBack({
              delta: 1
            })  
          },1500)
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  // 获取上门时间
  getShowShipmentsTime(){
    var _this = this;
    console.log('mod=send_back&operation=show_shipments_time&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&aid='+_this.data.tipaid+'&order_id='+_this.data.order_id)
    var qqq = Dec.Aese('mod=send_back&operation=show_shipments_time&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&aid='+_this.data.tipaid+'&order_id='+_this.data.order_id);
    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log('获取上门时间===',res)
        if (res.data.ReturnCode == 200) {
          let timeList = res.data.List.timeList;
          let flag = false;
          if(_this.data.status == 1){
            for(var i=0;i<timeList[_this.data.skyName].time.length;i++){
              console.log(_this.data.savedStart_time,timeList[_this.data.skyName].time[i].StartTime)
              console.log(_this.data.savedEnd_date,timeList[_this.data.skyName].time[i].EndTime)
              if(timeList[_this.data.skyName].time[i].StartTime == _this.data.savedStart_time && timeList[_this.data.skyName].time[i].EndTime == _this.data.savedEnd_date){
                timeList[_this.data.skyName].time[i].selectedTime=true;
                _this.setData({
                  timeIndex:i,
                  endtime:timeList[_this.data.skyName].time[i].EndTime,
                  startime:timeList[_this.data.skyName].time[i].StartTime,
                  end_time:timeList[_this.data.skyName].time[i].end_time,
                  start_time:timeList[_this.data.skyName].time[i].start_time,
                })
              }
            }
            _this.setData({
              timeIndex:_this.data.skyName,
              timeList:timeList,
              selectedName:timeList[_this.data.skyName].name,
              selectedTimeList:timeList[_this.data.skyName].time,
            })
          }else{
            for(var i=0;i<timeList.length;i++){
              if(flag){
                break;
              }
              for(var j=0;j<timeList[i].time.length;j++){
                if(!timeList[i].time[j].is_finish){
                  timeList[i].time[j].selectedTime=true;
                  _this.setData({
                    timeIndex:i,
                    endtime:timeList[i].time[j].EndTime,
                    startime:timeList[i].time[j].StartTime,
                    end_time:timeList[i].time[j].end_time,
                    start_time:timeList[i].time[j].start_time,
                  })
                  flag = true;
                  break;
                }
              }
            }
            _this.setData({
              timeList:timeList,
              selectedName:timeList[0].name,
              selectedTimeList:timeList[0].time,
            })
          }
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  submitBtn(){
    console.log(this.data.tipaid1)
    console.log(this.data.tipaid)
    console.log(this.data.startime)
    console.log(this.data.endtime)
    console.log(this.data.goodsInfo.kgNumber)
    console.log(this.data.goodsInfo.goodsArr[this.data.goodsInfo.selectedGoodsArrIndex].name)
    console.log(this.data.goodsInfo.textareaInput)
    var _this = this;
    let id = _this.data.status==1?_this.data.id:'';
    console.log('提交请求===','mod=send_back&operation=shipping_order&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&order_id='+_this.data.order_id +'&aid='+this.data.tipaid+'&exchange_goods_aid='+this.data.tipaid1+'&StartTime='+this.data.startime+'&EndTime='+this.data.endtime+'&GoodsWeight='+this.data.goodsInfo.kgNumber+'&GoodsName='+this.data.goodsInfo.goodsArr[this.data.goodsInfo.selectedGoodsArrIndex].name+'&Remark='+this.data.goodsInfo.textareaInput+'&id='+id)
    var qqq = Dec.Aese('mod=send_back&operation=shipping_order&uid='+_this.data.uid+'&loginid='+_this.data.loginid+'&order_id='+_this.data.order_id +'&aid='+this.data.tipaid+'&exchange_goods_aid='+this.data.tipaid1+'&StartTime='+this.data.startime+'&EndTime='+this.data.endtime+'&GoodsWeight='+this.data.goodsInfo.kgNumber+'&GoodsName='+this.data.goodsInfo.goodsArr[this.data.goodsInfo.selectedGoodsArrIndex].name+'&Remark='+this.data.goodsInfo.textareaInput+'&id='+id);
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.request({
      url: app.signindata.comurl + 'order.php' + qqq,
      method: 'GET',
      header: {'Accept': 'application/json'},
      success: function (res) {
        console.log(res)
        if (res.data.ReturnCode == 200) {
          // if(_this.data.status!=1){
            wx.hideLoading()
            app.showToastC(res.data.Msg,2000);
            setTimeout(()=>{
              let pages = getCurrentPages();    //获取当前页面信息栈
              let prevPage = pages[pages.length-2];
              prevPage.onLoadfun();
              wx.navigateBack({
                delta: 1
              })  
            },2000)
          // }else{
          //   _this.data.isModification = true;
          //   setTimeout(()=>{
          //     _this.getShowSendBack();
          //   },4000)
          // }
        }else{
          app.showToastC(res.data.Msg)  
        };
      }
    });
  },
  modification(){
    this.data.isModification = true;
    setTimeout(()=>{
      this.submitBtn();
    },4000)
  },
  //显示隐藏上们取件时间
  toggleVisitTtime(){
    this.setData({
      isVisitTtime:!this.data.isVisitTtime
    })
  },
  // 天改变
  timeChange(e){
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let timeList = this.data.timeList;
    for(var i=0;i<timeList.length;i++){
      if(timeList[i].name == name){
        this.setData({
          timeIndex:index,
          selectedName:timeList[i].name,
          selectedTimeList:timeList[i].time,
        })
      }
    }
  },
  // 时间选择
  selectedTimeBtn(e){
    let index = e.currentTarget.dataset.index;
    let endtime = e.currentTarget.dataset.endtime;
    let startime = e.currentTarget.dataset.startime;
    let end_time = e.currentTarget.dataset.end_time;
    let start_time = e.currentTarget.dataset.start_time;
    let isfinish = e.currentTarget.dataset.isfinish;
    if(!isfinish){
      for(var i=0;i<this.data.selectedTimeList.length;i++){
        this.setData({
          [`selectedTimeList[${i}].selectedTime`]:false,
        })
      }
      for(var i=0;i<this.data.timeList.length;i++){
        for(var j=0;j<this.data.timeList[i].time.length;j++){
          this.setData({
            [`timeList[${i}].time[${j}].selectedTime`]:false,
          })
        }
      }
      this.setData({
        sonTimeIndex:index,
        endtime,
        startime,
        end_time,
        start_time,
        [`selectedTimeList[${index}].selectedTime`]:true,
      })
      console.log(this.data.startime,this.data.endtime,this.data.timeIndex)
    }
  },
  toggleExplain(){
    // let explaintxt = e.currentTarget.dataset.explaintxt;
    this.setData({
      isExplain:!this.data.isExplain
    })
  },
  hideExplain(){
    this.setData({
      isExplain:false
    })
  },
  showPhone(e){
    let type = e.currentTarget.dataset.type;
    if(type == 1){
      this.setData({
        phone:this.data.tipphone,
        isPhone:true
      })
    }else{
      this.setData({
        phone1:this.data.tipphone1,
        isPhone1:true
      })
    }
  },
  hidePhone(e){
    let type = e.currentTarget.dataset.type;
    if(type == 1){
      this.setData({
        phone:util.plusXing(this.data.tipphone,3,4),
        isPhone:false
      })
    }else{
      this.setData({
        phone1:util.plusXing(this.data.tipphone1,3,4),
        isPhone1:false
      })
    }
  },
  // 下一页返回调取
  nextpagediao:function(){
    var _this = this;
    //  调取收货地址
    var q = Dec.Aese('mod=address&operation=getlist&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)
    wx.request({
      url: app.signindata.comurl + 'user.php'+q,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('收货地址======nextpagediao=======',res)
        if (res.data.ReturnCode == 200){
          console.log(_this.data.status)
            var rdl = res.data.List;
            if(_this.data.status != 1){
              var tptipadi = '';
              var tptipadd = '';
              var tipphone = '';
              var tipname = '';
              var phone = '';
              var tipphone1 = '';
              var tipname1 = '';
              var phone1 = '';
              if (rdl.length != 0) {
                for (var i = 0; i < rdl.length; i++) {
                  if (rdl[i].isdefault == 1) {
                    tptipadi = rdl[i].aid;
                    tptipadd = rdl[i].address;
                    tipphone = rdl[i].phone;
                    phone = util.plusXing(rdl[i].phone,3,4);
                    tipname = rdl[i].consignee;
                    tipphone1 = rdl[i].phone;
                    phone1 = util.plusXing(rdl[i].phone,3,4);
                    tipname1 = rdl[i].consignee;
                  }
                };
                _this.data.tipaid = tptipadi;
                _this.data.tipaid1 = tptipadi;
                _this.setData({
                  addressdata: rdl,
                  tipname,
                  tipphone,
                  phone,
                  tipaddress: tptipadd,
                  tipname1,
                  tipphone1,
                  phone1,
                  tipaddress1: tptipadd,
                })
                _this.getShowShipmentsTime();
              }
            }
            if (rdl.length != 0) {
              for (var i = 0; i < rdl.length; i++) {
                if (rdl[i].isdefault == 1) {
                  rdl[i].checked = true;
                } else {
                  rdl[i].checked = false;
                }
              };
            }
            _this.setData({
              addressdata: rdl,
            })
            app.signindata.receivingAddress = rdl;

          
        };
        // 判断非200和登录
        Dec.comiftrsign(_this, res, app);         
      }
    });
  },

   // 隐藏收货地址弹框
   receivingaddressfun:function(){
    this.setData({
      receivingaddress: false,
      tipbacktwo:false,
    })
  },
  // 收货地址弹框
  seladdressfun:function(e){
    this.setData({
      type:e.currentTarget.dataset.type,
      receivingaddress:true,
      tipbacktwo:true,
    });
  },
  // 修改收货地址
  revisethereceivingaddress:function(w){
    var tipaid = w.currentTarget.dataset.tipaid || w.target.dataset.tipaid;
    var tipadd = w.currentTarget.dataset.tipadd || w.target.dataset.tipadd;
    var ind = w.currentTarget.dataset.ind || w.target.dataset.ind||0;
    var data = this.data.addressdata;
    if(this.data.type == 1){
      this.data.tipaid = tipaid;
      this.setData({
        tipphone: data[ind].phone,
        phone: data[ind].phone,
        tipname: data[ind].consignee,
        tipaddress: tipadd,
      });
    }else{
      this.data.tipaid1 = tipaid;
      this.setData({
        tipphone1: data[ind].phone,
        phone1: data[ind].phone,
        tipname1: data[ind].consignee,
        tipaddress1: tipadd,
      });
    }
    this.setData({
      receivingaddress: false,
      tipbacktwo: false,
    });
  },
  // 删除地址
  deladdress: function (event){
    var _this = this;
    var dat = this.data.addressdata;
    var indid = event.target.dataset.ind;
    var num = '';
    var iftrdefault = false;
    for (var i = 0; i < dat.length; i++) {
      if (dat[i].aid == indid) {
        num = i;
        if (dat[i].isdefault == 1) {
          iftrdefault = true;
        }
      }
    };
    if (iftrdefault) {
      app.showToastC('默认地址不能删除');
      return false;
    };
    wx.showModal({
      content: '您确定要删除这个地址吗？',
      success: function (res) {
        if (res.confirm) {
          var q = Dec.Aese('mod=address&operation=delete&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid + '&aid=' + indid)
          wx.request({
            url: app.signindata.comurl + 'user.php'+q,
            method: 'GET',
            header: { 'Accept': 'application/json' },
            success: function (res) {
              if (res.data.ReturnCode == 200){
                dat.splice(num, 1);
                _this.setData({
                  addressdata: dat
                });
                app.signindata.receivingAddress = dat;
              };
              if (res.data.ReturnCode == 908) {
                app.showToastC('aid和uid不匹配');
              };              
              // 判断非200和登录
              Dec.comiftrsign(_this, res, app);              
            }
          })
        }
      }
    })
  },
    // 编辑地址
    jumpeditaddress: function (event){
      var aid = event.target.dataset.aid || event.currentTarget.dataset.aid;
      var address = event.target.dataset.address || event.currentTarget.dataset.address;
      var city = event.target.dataset.city || event.currentTarget.dataset.city;
      var consignee = event.target.dataset.consignee || event.currentTarget.dataset.consignee;
      var district = event.target.dataset.district || event.currentTarget.dataset.district;
      var idcard = event.target.dataset.idcard || event.currentTarget.dataset.idcard;
      var phone = event.target.dataset.phone || event.currentTarget.dataset.phone;
      var province = event.target.dataset.province || event.currentTarget.dataset.province;
      wx.navigateTo({ 
        url: "/pages/shippingAddress/shippingAddress?aid=" + aid + '&address=' + address + '&city=' + city + '&consignee=' + consignee + '&district=' + district + '&idcard=' + idcard + '&phone=' + phone + '&province=' + province
      })
    },
  // 跳转增加新地址
  jumpaddress:function(){
    wx.navigateTo({ 
      url: "/pages/newreceivingaddress/newreceivingaddress"
    })     
  },

  comjumpwxnav(e){
    console.log(this.data.goodsInfo)
    let whref =e.currentTarget.dataset.whref;
    let type = e.currentTarget.dataset.type;
    app.comjumpwxnav(type,whref)
  },
})

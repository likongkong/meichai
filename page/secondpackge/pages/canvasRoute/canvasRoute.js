// page/component/pages/myothertoydg/myothertoydg.js
var Pub = require('../../common/mPublic.js'); //aes加密解密js
var Dec = require('../../../../common/public.js'); //aes加密解密js
const app = getApp();
var WxParse = require('../../../../wxParse/wxParse.js');

var astar = require('../../../../utils/astar.js'); 

import Poster from '../../../../pages/wxa_plugin_canvas/poster/poster';

Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 接口地址
    comurl: app.signindata.comurl,
    loginid: app.signindata.loginid,
    uid: app.signindata.uid,
    openid: app.signindata.openid,
    avatarUrl: app.signindata.avatarUrl,
    appNowTime: Date.parse(new Date()),
    // 适配苹果X 
    isIphoneX: app.signindata.isIphoneX,
    defaultinformation: '',
    wxnum: '',
    shopnum: 0,
    dryinglistnum: 0,
 
    // 授权弹框
    tgabox: false,

    c_title: '专属逛展地图',
    c_arrow: true,
    c_backcolor: '#ff2742',
    statusBarHeightMc: wx.getStorageSync('statusBarHeightMc')|| 90,

    listdata:[],

    appNowTime: Date.parse(new Date()),
    map_data:[],
    // 选中品牌数据
    selectData:[],
    selectDataTip:false,
    coordArr:[],
    showPictures:false,
    brand_name:'',
  },
  showPicturesFun:function(){
    this.setData({
      showPictures:false
    })
  },

  onFocus: function (w) {
    this.setData({
      brand_name:""
    });
  },
  // input 值改变
  inputChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      brand_name: e.detail.value
    });
    if(e.detail.value == ''){
      this.jumpsearch();
    }
  },
  seltDatTipFun:function(){
    this.setData({
      selectDataTip:!this.data.selectDataTip
    });
  },
  // 下移
  downGo:function(w) {
    var _this = this;
    var selectData = _this.data.selectData || [];
    var index = w.currentTarget.dataset.index || 0;
    if(index!=selectData.length-1){
      selectData[index] = selectData.splice(index+1, 1, selectData[index])[0];
        _this.setData({
          selectData:selectData
        });
    };
  },
  // 上移
  upGo:function(w){
      var _this = this;
      var selectData = _this.data.selectData || [];
      var index = w.currentTarget.dataset.index || 0;
      console.log(index)
      if(index != 0){
        selectData[index] = selectData.splice(index-1, 1, selectData[index])[0];
          _this.setData({
            selectData:selectData
          });
      };
  },

  // 删除选中数据
  delSelData:function(w){
    var ind = w.currentTarget.dataset.ind || 0;
    var bid = w.currentTarget.dataset.bid || 0;
    var selectData = this.data.selectData || [];
    var listdata = this.data.listdata || [];
    for(var i=0; i<listdata.length; i++){
       if(listdata[i].id == bid){
          listdata[i].isCheck = false;
       };
    };
    selectData.splice(ind, 1);
    this.setData({
      selectData:selectData,
      listdata:listdata
    })
  },
  // 取消 选中
  identitysel:function(w){

    var ind = w.currentTarget.dataset.ind || 0;
    var listdata = this.data.listdata || []; 
    var selectData = this.data.selectData;
    if(listdata[ind].isCheck){
      listdata[ind].isCheck = false;
      for(var i=0; i<selectData.length; i++){
        if(selectData[i].id == listdata[ind].id){
          selectData.splice(i,1);
        };
     };    
    }else{
      listdata[ind].isCheck = true;
    };
    
    for(var i=0; i<listdata.length; i++){
       if(listdata[i].isCheck){
         selectData.push(listdata[i])
       };
    };
    selectData = this.distinct(selectData)
    this.setData({
      listdata:listdata,
      selectData:selectData
    });    

  },
  //  数组去重
  distinct:function(arr){
    var arr = arr,i,j,len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
          if (arr[i].id == arr[j].id){
              arr.splice(j,1);
              len--;
              j--;
          }
        }
    }
    return arr;
  },
  dataProc:function(arr){
    var arra = [];
    for( var i=0 ; i < arr.length ; i++ ){
       if(i!=(arr.length-1)){
         arra.push({
           'start':arr[i].arr,
           'end':arr[i+1].arr,
           'logo':arr[i+1].logo
         });
       }
    };
    return arra;
  },
  /**
   * 异步生成海报
   */
  // 图片预览
  previewImg: function (w) {
    var _this = this;
    var ind = w.currentTarget.dataset.ind || 0;
    if(ind == 1){
      var imgUrl = 'https://cdn.51chaidan.com/images/toyShow3/zhanhuiditu.png';
    }else{
      var imgUrl = _this.data.savepic;
    };
    wx.previewImage({
      current:imgUrl,     //当前图片地址
      urls: [imgUrl],               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  // 生成专属图片
  genExPictures:function(){
     var _this = this;
     var selectData = _this.data.selectData || [];
     if(selectData && selectData.length != 0){
        var coordArr = [{arr:[50,53],logo:''}];
        for(var i=0;i<selectData.length;i++){
            if(selectData[i].coordinate){
              coordArr.push({
                arr:selectData[i].coordinate,
                logo:selectData[i].logo || ''
              });
            };
        };
        _this.setData({
            coordArr:coordArr
        });
        _this.onCreatePoster();
     }else{
        _this.comshowmodal('请选择商家')
     };
  },
  onCreatePoster() {
    var that = this;

    wx.showLoading({
      title: '生成中...',
      mask:true
    })
    
    // 格子宽度和高度
    var width = 20;
    var height = 20;
    var lineWidth = 10; // 线的宽度
    var offset_box = (width - lineWidth) / 2;
    var lineColor = ['red'];
    // 偏移量
    var offset_x = 734 + offset_box;
    var offset_y = 732 + offset_box;

    var start = '';
    var end = '';  
    var result = '';  

    var astarVar = astar;
    var map_data = that.data.map_data || [];

    var busCoorArr = that.data.coordArr;
    for(var m=0;m<busCoorArr.length;m++){
        var bcr = busCoorArr[m].arr;
        map_data[bcr[0]][bcr[1]] = 1;
    };


    // 1 可以走 0 不可以走 
    var graph = new astarVar.Graph(map_data);

    console.log(graph)

    var arrData = that.dataProc(busCoorArr);

    console.log('arrData===',arrData)
    
    // 线
    var lineArr = [];
    var lineArrEve = [];
    // 终点圆形
    var blocks = [];
    var texts = [{
        x:150,
        y:2203 ,
        baseLine: 'middle',
        text:'生成你的专属地图',
        fontSize: 52,
        textAlign: 'left',
        color: '#fff',
        zIndex:5,
    }];
    // 图片
    var imgArr = [{
      x:0,
      y:0,
      // url: 'https://cdn.51chaidan.com/images/toyShow3/zhanhuiditu.png?time=1',
      url: 'https://cdn.51chaidan.com/images/toyShow3/zhanhuiditu1.png?time=3',
      width: 3600,
      height: 2421,
      zIndex: 1,
      borderRadius:0,
    },{
      x:152,
      y:1753,
      url: 'https://cdn.51chaidan.com/images/toyShow3/toyShowList.jpg?time=' + that.data.appNowTime,
      width: 400,
      height: 400,
      zIndex: 2,
      borderRadius:0,
    }];
    for(var a=0 ; a < arrData.length ; a++){

        console.log([arrData[a].start[0]],[arrData[a].start[1]],[arrData[a].end[0]],[arrData[a].end[1]])

        start = graph.grid[arrData[a].start[0]][arrData[a].start[1]];
        end = graph.grid[arrData[a].end[0]][arrData[a].end[1]];

        result = astarVar.astar.search(graph, start, end);

        lineArrEve = [];
        for(var i=0; i< result.length; i++){
          if(lineArrEve.length!=0){
           
            if(result[i].x == 1){
              var sx = offset_x + result[i-1].y*width + offset_box + (lineWidth/2);
              var sy = offset_y + result[i-1].x*width;
              var ex = offset_x + result[i].y*width + offset_box + (lineWidth/2);              
              var ey = offset_y + result[i].x*width; 
            }else{
              var sx = offset_x + result[i-1].y*width;
              var sy = offset_y + result[i-1].x*width;
              var ex = offset_x + result[i].y*width;              
              var ey = offset_y + result[i].x*width; 
            };

            if(sx==ex){
               if(sy > ey){
                 sy = sy + lineWidth/2;
               }else{
                 sy = sy - lineWidth/2;
               };
            }else if(sy == ey){
               if(sx > ex){
                  sx = sx + lineWidth/2;
               }else{
                  sx = sx - lineWidth/2;
               };
            };
            lineArrEve.push({
              startX: sx,
              startY: sy,
              endX:ex,
              endY:ey,
              width:lineWidth,
              color:lineColor[0],
              zIndex:2
            })
          }else{
            lineArrEve.push({
              startX:offset_x + result[i].y*width,
              startY:offset_y + result[i].x*width,
              endX:offset_x + result[i].y*width,
              endY:offset_y + result[i].x*width,
              width:lineWidth,
              color:lineColor[0],
              zIndex:2
            })
          };
        };

        console.log(lineArrEve)

        if(lineArrEve&&lineArrEve.length!=0){
            // 圆球
            blocks.push({
              x:lineArrEve[lineArrEve.length-1].endX-18,
              y:lineArrEve[lineArrEve.length-1].endY-18,
              width:36,
              height:36,
              backgroundColor:lineColor[0],
              zIndex: 3,
              borderRadius: 36,
              // boxSetShadow:{a:10,b:10,c:10,d:'#e0e0e0'}
            });
            if((a+1)<10){
                var left_x = lineArrEve[lineArrEve.length-1].endX-6;
            }else{
                var left_x = lineArrEve[lineArrEve.length-1].endX-13;
            }
            texts.push({
                x:left_x,
                y: lineArrEve[lineArrEve.length-1].endY,
                baseLine: 'middle',
                text:a+1,
                fontSize: 24,
                textAlign: 'left',
                color: '#fff',
                zIndex:5,
            });
            if(arrData[a].logo){
              imgArr.push({
                x:parseInt(lineArrEve[lineArrEve.length-1].endX)-67,
                y:parseInt(lineArrEve[lineArrEve.length-1].endY)-67,
                url: arrData[a].logo,
                width: 56,
                height: 56,
                zIndex: 6,
                borderRadius:10,
              })
            }

        };
        lineArr = lineArr.concat(lineArrEve);
    };

    console.log(lineArr)

    // setData配置数据
    that.setData({
      posterConfig: {
        width: 3600,
        height: 2421,
        debug: false,
        // pixelRatio: 1000,
        preload: false,
        hideLoading: false,
        backgroundColor: '#fff',
        blocks: blocks,
        lines:lineArr,
        texts:texts,
        images: imgArr
      }
    }, () => {
      Poster.create();
    });
  },
  onPosterFail(e){
    wx.hideLoading()

  },
  onPosterSuccess(e) {
    wx.hideLoading();
    this.seltDatTipFun();
    const {
      detail
    } = e;
    console.log(detail)
    this.setData({
      savepic: detail,
      showPictures:true
    });
  },
  savetoA() {
    var that = this;

    this.showPicturesFun();

    wx.getSetting({
      success(res) {
        wx.hideLoading();
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //请求授权
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              //获得授权，开始下载
              that.downloadfile()
            },
            fail() {
              wx.showModal({
                title: '',
                content: '保存到系统相册需要授权',
                confirmText: '授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(res) {
                        if (res.authSetting['scope.writePhotosAlbum'] === true) {
                          that.downloadfile()
                        }
                      }
                    })
                  }
                },
                fail() {
                  app.showToastC('打开设置页失败')
                }
              })
            }
          })
        } else {
          //已有授权
          that.downloadfile()
        }
      },
      fail() {
        wx.hideLoading();
        app.showToastC('获取授权失败')
      }
    })
  },
  downloadfile() {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.savepic,
      success(res) {
        app.showToastC("保存至相册成功");
      },
      fail() {
        app.showToastC("保存至相册失败");
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断是否授权  
    var _this = this;
    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    app.signindata.referee = options.referee || 0;
    app.signindata.activity_id = options.aid || 0;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      id:options.aid,
      wft: options.wft||0,
      referee:options.referee || 0,
      sid: options.sid||0
    });


    if(app.signindata.sceneValue==1154){
      app.signindata.isProduce = true;  
      _this.onLoadfun();
    }else{
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // '已经授权'
            _this.data.loginid = app.signindata.loginid;
            _this.data.openid = app.signindata.openid;
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
              signinlayer: true,
              tgabox: false
            });
            // 判断是否登录
            if (_this.data.loginid != '' && _this.data.uid != '') {
              _this.onLoadfun();
            } else {
              app.signin(_this)
            }
          } else {
            wx.hideLoading()
            app.userstatistics(32);
            _this.setData({
              tgabox: false,
              signinlayer: false
            });
            _this.onLoadfun();
          }
        }
      });
    };
  },
  pullupsignin: function () {
    // // '没有授权'
    this.setData({
      tgabox: true
    });
  },

  // 授权点击统计
  clicktga: function () {
    app.clicktga(2)
  },
  clicktganone: function () {
    this.setData({ tgabox: false })
  },
  userInfoHandler: function (e) {
    // 判断是否授权 
    var _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 确认授权用户统计
          app.clicktga(4);
          _this.setData({
            signinlayer: true,
            tgabox: false
          });
          // '已经授权'
          _this.data.loginid = app.signindata.loginid,
            _this.data.openid = app.signindata.openid,
            _this.setData({
              uid: app.signindata.uid,
              avatarUrl: app.signindata.avatarUrl,
              isProduce: app.signindata.isProduce,
            });
          // 判断是否登录
          if (_this.data.loginid != '' && _this.data.uid != '') {
            _this.onLoadfun();
          } else {
            app.signin(_this)
          };
        } else {
          _this.setData({
            tgabox: false,
            signinlayer: false
          });
        }
      }
    });
    if (e.detail.detail.userInfo) { } else {
      app.clicktga(8) //用户按了拒绝按钮
    };

  },

  onLoadfun: function () {
    var _this = this

    wx.hideLoading()

    _this.data.loginid = app.signindata.loginid;
    _this.data.openid = app.signindata.openid;
    _this.setData({
      uid: app.signindata.uid,
      isProduce: app.signindata.isProduce,
      avatarUrl: app.signindata.avatarUrl,
      defaultinformation:app.signindata.defaultinformation,
    });

    _this.getData();
    
  },
  jumpsearch:function(){
      var _this = this;
      wx.showLoading({
        title: '加载中...',
        mask:true
      });

      var qqq = Dec.Aese('mod=subscription&operation=showBrandCoordinate&searchKey=' + _this.data.brand_name +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid);

      console.log('mod=subscription&operation=showBrandCoordinate&searchKey=' + _this.data.brand_name +'&uid=' + _this.data.uid + '&loginid=' + _this.data.loginid)

      wx.request({
        url: app.signindata.comurl + 'toy.php' + qqq,
        method: 'GET',
        header: {'Accept': 'application/json'},
        success: function (res) {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          console.log('展会列表===',res)
          if (res.data.ReturnCode == 200) {

            var selectData = _this.data.selectData || [];
            var listdata = res.data.List.shareInfo || [];
            if(selectData && selectData.length !=0 && listdata && listdata.length !=0){
              for(var i=0 ;i<selectData.length;i++){
                 for(var j=0 ; j<listdata.length;j++){
                   if(selectData[i].id == listdata[j].id){
                      listdata[j].isCheck = true;
                   };
                 };
              };
            };
            _this.setData({
                listdata:listdata || []
            });
          }else{
            _this.comshowmodal(res.data.Msg)
          };
        }
      });
  },
  getData:function(){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    // 展会商家数据
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyShowBoothInfo.json?time='+_this.data.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        console.log('展会商家数据===',res)
        var selectData = _this.data.selectData || [];
        var listdata = res.data || [];
        if(selectData && selectData.length !=0 && listdata && listdata.length !=0){
          for(var i=0 ;i<selectData.length;i++){
             for(var j=0 ; j<listdata.length;j++){
               if(selectData[i].id == listdata[j].id){
                  listdata[j].isCheck = true;
               };
             };
          };
        };

        _this.setData({
          listdata:listdata || []
        });
      }
    });    
    // 展会路径格子
    wx.request({
      url: 'https://meichai-1300990269.cos.ap-beijing.myqcloud.com/produce/toyShowCoord.json?time='+_this.data.appNowTime,
      method: 'GET',
      header: { 'Accept': 'application/json' },
      success: function (res) {
        console.log('展会路径格子===',res)
        _this.setData({
          map_data:res.data.map_data || []
        });
      }
    });
  },

  comshowmodal:function(title){
    if(title){
      wx.showModal({
        title: '提示',
        content: title,
        showCancel: false,
        success: function (res) { }
      });
    };
  },
  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.getData();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShow: function () {},
  onShareAppMessage: function (options) {
    var _this = this
    return {
      title: '我在美拆生成了专属逛展地图，你也快来生成专属于自己的逛展地图吧',
      imageUrl:'https://cdn.51chaidan.com/images/toyShow3/mapShare.jpg',
      success: function (res) {}
    }  
  },

})
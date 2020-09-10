const app = getApp();
Component({
  properties: {},
  data: {
    tgaimg: app.signindata.tgaimg||'https://www.51chaidan.com/images/default/openscreen.jpg'
  },
  ready:function(){

    var imgnum = Math.floor(Math.random() * app.signindata.imgUrlNum) || 0;
    var imgUrl = 'https://cdn.51chaidan.com/images/openscreen/openscreen'+imgnum+'.jpg';

    this.setData({
      tgaimg: imgUrl || 'https://www.51chaidan.com/images/default/openscreen.jpg'
    })
  },
  methods: {
    clicktga:function() {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      this.triggerEvent("run", myEventDetail);
    },
    userInfoHandler:function(e){
      const myEventDetail = e;
      this.triggerEvent("userinfo", myEventDetail);
    },
    tgatipnone:function(){
      this.triggerEvent("tgnone");
    }
  },



})
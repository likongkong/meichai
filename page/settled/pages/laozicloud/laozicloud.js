import * as AMRT from 'libs/weapp.js'
let viewer
Page({
    data: {

    },
    onLoad: function () {
        let that = this;
        wx.getSystemInfo({
          success (res) {
            console.log(res.model)
            console.log(res.pixelRatio)
            console.log(res.windowWidth)
            console.log(res.windowHeight)
            console.log(res.language)
            console.log(res.version)
            console.log(res.platform)
            that.setData({
              windowWidth:res.windowWidth,
              windowHeight:res.windowHeight,
            })
          }
        })
        wx.createSelectorQuery()
            .select('#c')
            .node()
            .exec((res) => {
                //注册canvas
                const canvas = AMRT.global.registerCanvas(res[0].node)
                //初始化视图
                this.initViewer(canvas)
            })
    },
    /**
     * 初始化3D视图
     * @param {Canvas}} canvas 
     */
    initViewer(canvas) {
        //开发者凭证参数
        const param = {
            appkey: 'FrqWfwKjBAml',
            appsecret: '6zFbSMTvkEPonJGfweyRistNhg3uXjVB'
        }
        //创建视图
        const viewer = new AMRT.Viewer(canvas, param, this)

        viewer.validate().then(() => {

            viewer.loadModel('1490934128034582528', {
                onLoad: () => {
                    console.log('模型加载完成')
                }
            })
        }).catch(err => {
            console.log('老子云appKey验证失败', err)
        })
    },
    
    onUnload(){
        //销毁视图
        viewer.dispose()
    }
})
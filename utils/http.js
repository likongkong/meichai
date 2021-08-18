var Dec = require('../common/public.js');


const request = (url, options) => {
    var access_token = wx.getStorageSync('access_token') || '';
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: `${Dec.comUrlNew()}${url}`,
            method: options.method,
            data: options.data,
            header: {
                'content-type': options.isObj ? 'application/json' : 'application/x-www-form-urlencoded',
                // 'x-token': 'x-token',  // 看自己是否需要
                'app-version': Dec.versionnumber,
                'Accept': 'application/x.mcts.v1+json',
                'app-source':3,
                'Authorization': 'Bearer ' + access_token
            },
            success(request) {
              wx.hideLoading();
              if(request.statusCode == 401){  // access_token 过期 重新登陆
                let pages = getCurrentPages();
                var currPage = pages[pages.length - 1];
                console.log('============pages',pages)
                wx.removeStorageSync('access_token') // 同步删除缓存
                currPage.onLoad();
              } else if(request.data.status_code == 200){
                resolve(request);
                if(request.header.Authorization){
                    console.log('换取新token=====',request.header.Authorization)
                    wx.setStorageSync('access_token', request.header.Authorization);
                }                
              } else {
                resolve(request)
                if(request.header.Authorization){
                   console.log('换取新token=====',request.header.Authorization)
                   wx.setStorageSync('access_token', request.header.Authorization);
                };
              }
            },
            fail(error) {
              console.log(error);
              if(error){      
                let pages = getCurrentPages();
                console.log('============pages',pages)
              }
              reject(error.data)
              wx.hideLoading();
            }, complete: () => {
              wx.hideLoading();
            }
        })
    })
}
 
const get = (url, options = {}) => {
    return request(url, { method: 'GET', data: options })
}
 
//post对象
const postObj = (url, options) => {
    return request(url, { method: 'POST', data: options, isObj: false })
}
//post参数
const post = (url, options) => {
    return request(url, { method: 'POST', data: options, isObj: true })
}
 
const put = (url, options) => {
    return request(url, { method: 'PUT', data: options })
}
 
// 不能声明DELETE（关键字）
const remove = (url, options) => {
    return request(url, { method: 'DELETE', data: options })
}
 
module.exports = {
    get,
    post,
    put,
    remove,
    postObj
}

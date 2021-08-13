var Dec = require('../common/public');

 
const request = (url, options) => {
    console.log(url,options)
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: `${Dec.comurl()}${url}`,
            method: options.method,
            data: options.data,
            header: {
                'content-type': options.isObj ? 'application/json' : 'application/x-www-form-urlencoded',
                // 'x-token': 'x-token'  // 看自己是否需要
            },
            success(request) {
              wx.hideLoading();
              console.log(request);
              // resolve(request)
              if (request.data.code == 0) {
                  resolve(request)
              } else {
                  reject(request)
              }
            },
            fail(error) {
              console.log(error);
              reject(error.data)
              wx.hideLoading();
            }, complete: () => {
              console.log('请求完成')
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
    return request(url, { method: 'POST', data: options, isObj: true })
}
//post参数
const post = (url, options) => {
    return request(url, { method: 'POST', data: options, isObj: false })
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
    postObj,
}

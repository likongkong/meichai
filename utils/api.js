import apiResquest from './http.js'
//POST 请求案例

// ---------------------------------------- 公共-----------------------------------------
// 登录
export const login = (query) => {
	return apiResquest.post('login',query)
}
//申请入驻提交审核
export const brandCertification = (query) => {
    return apiResquest.postObj(
        'toy.php',
        query
    )
}

// ---------------------------------------- 订单管理 -----------------------------------------
// 获取收据
export const oMgetData = (query) => {
    return apiResquest.get('brand/orderlist',query)
}
// 修改地址
export const modifyAddress = (url,query) => {
    return apiResquest.post('brand/changeAddress/' + url,query)
}
// 添加物流
export const addLogistics = (url,query) => {
    return apiResquest.post('brand/delivery/' + url,query)
}
// 导入信息
export const brandImport = (query) => {
    return apiResquest.post('brand/syncShippingCode',query)
}
// 导出信息
export const exportOrder = (query) => {
    return apiResquest.get('brand/exportorder',query)
}
// 退款
export const brandRefund = (query) => {
    return apiResquest.post('brand/acceptRefund',query)
}
// 查询时候分账
export const checkOrderRefund = (query) => {
    return apiResquest.post('brand/checkOrderRefund',query)
}
// ---------------------------------------- 订单详情 -----------------------------------------
export const oMbrandInfo = (url,query) => {
    return apiResquest.get('brand/info/' + url,query)
}




// login(data).then(res => {
//   console.log(res)
// }).catch(err => {
//   util.showToast(err,1500);
//   console.log(err)
// })


// GET 请求案例可以传递参数也可以不传递
// export const validateCode  = (query) => {
// 	let str = query
// 	return apiResquest({
// 		url: `您的API地址 ?${str}`,
// 		method: 'GET'
// 	})
// }
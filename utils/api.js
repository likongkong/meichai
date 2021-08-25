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

//---------------------------------------- 我的钱包 ----------------------------------
// 获取订单列表
export const settledWithCashList = (query) => {
    return apiResquest.get('brand/settled_with/settled_with_cash/list',query)
}
// 获取账号列表
export const getAccountNumberList = (query) => {
    return apiResquest.get('brand/settled_with/settled_with_cash/get_account_number_list',query)
}
// 设置默认账号
export const setDefaultAccount = (url,query) => {
    return apiResquest.get(`brand/settled_with/settled_with_cash/set_default_account/${url}`,query)
}
// 申请提现
export const executionApplicationWithdrawal = (query) => {
    return apiResquest.get(`brand/settled_with/settled_with_cash/execution_application_withdrawal`,query)
}
// 钱包余额、提现判断
export const getLumpsumAndWithdraw = (query) => {
    return apiResquest.get('brand/settled_with/settled_with_cash/get_lumpsum_and_withdraw',query)
}
// 订单详情
export const settledWithCashDetail = (url,query) => {
    return apiResquest.get(`brand/settled_with/settled_with_cash/detail/${url.id}/${url.type}`,query)
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
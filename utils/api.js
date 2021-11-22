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
    return apiResquest.get('brand/brand_withdraw/brand_withdraw_cash/list',query)
}
// 获取账号列表
export const getAccountNumberList = (query) => {
    return apiResquest.get('brand/brand_withdraw/brand_withdraw_cash/select_withdrawal_account_list',query)
}
// 设置默认账号
export const setDefaultAccount = (id,query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/set_default_account/${id}`,query)
}
// 申请提现
export const executionApplicationWithdrawal = (query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/execution_application_withdrawal`,query)
}
// 钱包余额、提现判断
export const getLumpsumAndWithdraw = (query) => {
    return apiResquest.get('brand/brand_withdraw/brand_withdraw_cash/get_the_amount',query)
}
// 钱包余额、提现判断
export const getLumpsumAndWithdraw1 = (query) => {
    return apiResquest.get('brand/settled_with/settled_with_cash/get_lumpsum_and_withdraw',query)
}
// 订单详情
export const settledWithCashDetail = (url,query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/detail/${url.id}/${url.detail_type}`,query)
}
// 绑定银行卡
export const addAccountNumber = (query) => {
    return apiResquest.post(`brand/brand_withdraw/brand_withdraw_cash/add_account_number`,query)
}
// 银行卡列表
export const bankCardList = (query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/bank_card_list`,query)
}
// 解绑银行卡
export const bankUntie = (id,query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/bank_untie/${id}`,query)
}
// 查看提现信息
export const viewWithdrawalInformation = (query) => {
    return apiResquest.get(`brand/brand_withdraw/brand_withdraw_cash/view_withdrawal_information`,query)
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
// 删除订单
export const emptyLogistics = (url,query) => {
    return apiResquest.get('brand/emptyLogistics/' + url,query)
}
// ---------------------------------------- 订单详情 -----------------------------------------
export const oMbrandInfo = (url,query) => {
    return apiResquest.get('brand/info/' + url,query)
}
// ---------------------------------------- 商品管理 -----------------------------------------
// 列表数据
export const settledGoodsList = (query) => {
    return apiResquest.get('brand/settled_goods/list',query)
}
// 删除商品
export const brandSettledGoodsStopSale = (query) => {
    return apiResquest.post('brand/settled_goods/stopSale',query)
}
// ---------------------------------------- 发布商品 -----------------------------------------
// 发布商品
export const settledGoodsSetGoods = (query) => {
    return apiResquest.post('brand/settled_goods/setGoods',query)
}
// 发布抽选商品
export const settledGoodsSetActivity = (query) => {
    return apiResquest.post('brand/settled_goods/setActivity',query)
}
// 查看商品信息
export const settledGoodsInfoGoods = (url,query) => {
    return apiResquest.get('brand/settled_goods/infoGoods/' + url,query)
}
// 查看抽选商品信息
export const settledGoodsInfoActivity = (type,id,query) => {
    return apiResquest.get('brand/settled_goods/infoActivity/' + type + '/' + id,query)
}
// 品牌列表
export const settledGoodsBrandlist = (query) => {
    return apiResquest.get('brand/settled_goods/brandlist',query)
}

// ---------------------------------------- 销售效果 -----------------------------------------
// 销售效果数据
export const salesResult = (url,query) => {
    return apiResquest.get('brand/settled_goods/salesResult/' + url,query)
}
// ---------------------------------------- 任务返利 -----------------------------------------




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
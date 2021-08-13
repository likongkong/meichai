import  apiResquest  from './http.js'

// 登录
export const login = (query) => {
    return apiResquest.post(
        url='login/aaa',
        {query: {...query}}
    )
}
//申请入驻提交审核
export const brandCertification = (query) => {
    return apiResquest.postObj(
        'toy.php',
        query
    )
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
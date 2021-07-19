import { apiResquest } from './http.js'

//POST 请求案例

// 登录
export const login = (query) => {
	return apiResquest.post({
    url: 'login/aaa',
    query: {...query}
	})
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
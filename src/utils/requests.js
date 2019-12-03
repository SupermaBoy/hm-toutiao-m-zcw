import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store/index.js'
import router from '@/router/index.js'
const instance = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  transformResponse: [data => {
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]

})

instance.interceptors.request.use(config => {
  if (store.state.info.token) {
    config.headers.Authorization = `Baerer ${store.state.info.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(res => {
  try {
    return res.data.data
  } catch (e) {
    return res
  }
},
async err => {
  const loginConfig = { path: '/login', query: { redirectUrl: router.currentRoute.path } }
  const { info } = store.state
  if (err.response && err.response.status === 401) {
    if (!info.token || !info.refresh_token) {
      router.push(loginConfig)
      return Promise.reject(err)
    }
    try {
      const res = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${info.refresh_token}`
        }
      })
      store.commit('setUser', {
        token: res.data.data.token,
        refresh_token: info.refresh_token
      })
      return instance(err.config)
    } catch (e) {
      router.push(loginConfig)
      return Promise.reject(e)
    }
  }
  return Promise.reject(err)
})

// 返回一个可调用的函数
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}

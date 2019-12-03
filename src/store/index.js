
import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息（包含token）
    info: auth.getUser()
  },
  mutations: {
    // 修改用户信息 user对象
    setUser (state, info) {
      // 修改state
      state.info = info
      // 更新本地 (当你刷新页面的时候，默认获取的是本地的用户信息)
      auth.setUser(info)
    },
    // 清除用户信息
    delUser (state) {
      state.info = {}
      auth.delUser()
    }
  },
  actions: {
  }
})

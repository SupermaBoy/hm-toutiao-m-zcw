import request from '@/utils/requests.js'

export const login = (loginForm) => {
  return request('/app/v1_0/authorizations', 'post', loginForm)
}

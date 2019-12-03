import request from '@/utils/requests.js'
export const getMyChannels = () => {
  return request('/app/v1_0/user/channels', 'get')
}


const USER_KEY = 'hm-toutiao-m-user-85'

export const getUser = () => {
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
export const setUser = (info) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(info))
}

export const delUser = () => {
  window.localStorage.removeItem(USER_KEY)
}

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const relTime = (strDate) => {
  return dayjs().locale('zh-cn').from(strDate)
}
const $sleep = function () {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 1200)
  })
}
export default {
  install (Vue) {
    Vue.prototype.$sleep = $sleep
    Vue.filter('relTime', relTime)
  }
}

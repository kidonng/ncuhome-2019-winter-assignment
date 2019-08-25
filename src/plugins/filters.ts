import Vue from 'vue'
import pangu from 'pangu'

Vue.filter('spacing', (text: string) => pangu.spacing(text))

Vue.filter('format', (timeStr: string) => {
  const time = new Date(timeStr)

  const now = new Date()
  const seconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (seconds < 60) return '刚刚'
  else if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
  else if (time.getTime() >= today.getTime())
    return `${Math.floor(seconds / 3600)} 小时前`
  else if (time.getTime() >= today.setDate(today.getDate() - 1)) return '昨天'
  else if (time.getTime() >= today.setDate(today.getDate() - 1)) return '前天'
  else if (time.getFullYear() === now.getFullYear())
    return `${time.getMonth() + 1} 月 ${time.getDate()} 日`
  else
    return `${time.getFullYear()} 年 ${time.getMonth() +
      1} 月 ${time.getDate()} 日`
})

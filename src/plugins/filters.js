import Vue from 'vue'
import pangu from 'pangu'

Vue.filter('spacing', text => pangu.spacing(text))

Vue.filter('post', post =>
  pangu
    .spacing(post.content)
    .split(post.jobTitle)
    .join(`“${post.jobTitle}”`)
)

Vue.filter('format', time => {
  time = new Date(time)

  const now = new Date()
  const seconds = Math.floor((now - time) / 1000)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (seconds < 60) return '刚刚'
  else if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`
  else if (time >= today) return `${Math.floor(seconds / 3600)} 小时前`
  else if (time >= today.setDate(today.getDate() - 1)) return '昨天'
  else if (time >= today.setDate(today.getDate() - 1)) return '前天'
  else if (time.getFullYear() === now.getFullYear())
    return `${time.getMonth() + 1} 月 ${time.getDate()} 日`
  else
    return `${time.getFullYear()} 年 ${time.getMonth() +
      1} 月 ${time.getDate()} 日`
})

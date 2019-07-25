import normalize from './normalize'

// Categorize position by date
export default raw => {
  const data = {}

  raw.forEach(position => {
    let time = new Date(position.createdAt || position.date)
    let now = new Date()

    if (position.jobsArray) {
      position.jobsArray.forEach(job => (job.title = normalize(job.title)))

      time.setDate(time.getDate() + 1)
      now.setHours(0, 0, 0, 0)

      if (time >= now) time = '今天'
      else if (time >= now.setDate(now.getDate() - 1)) time = '昨天'
      else
        time = `${time.getFullYear()} 年 ${time.getMonth() +
          1} 月 ${time.getDate()} 日`
    } else {
      if (time.getFullYear() === now.getFullYear())
        time = `${time.getMonth() + 1} 月 ${time.getDate()} 日`
      else
        time = `${time.getFullYear()} 年 ${time.getMonth() +
          1} 月 ${time.getDate()} 日`
    }

    if (data[time]) data[time].push(position)
    else data[time] = [position]
  })

  return data
}

import normalize from './normalize'

// Categorize positions by date
export default positions => {
  const data = []

  positions.forEach(position => {
    const isJobs = !!position.createdAt
    const time = new Date(isJobs ? position.createdAt : position.date)
    const now = new Date()
    let date

    if (isJobs) {
      position.jobTitle = normalize(position.jobTitle)
      position.jobsArray.forEach(job => (job.title = normalize(job.title)))

      time.setDate(time.getDate() + 1)
      now.setHours(0, 0, 0, 0)

      if (time >= now) date = '今天'
      else if (time >= now.setDate(now.getDate() - 1)) date = '昨天'
      else
        date = `${time.getFullYear()} 年 ${time.getMonth() +
          1} 月 ${time.getDate()} 日`
    } else {
      if (time.getFullYear() === now.getFullYear())
        date = `${time.getMonth() + 1} 月 ${time.getDate()} 日`
      else
        date = `${time.getFullYear()} 年 ${time.getMonth() +
          1} 月 ${time.getDate()} 日`
    }

    const target = data.find(item => item.date === date)

    if (target) target.positions.push(position)
    else data.push({ date, positions: [position] })
  })

  return data
}

import { normalize } from '@/utils'
import { Brief, CategorizedData, Position } from '@/types'

const categorizeJobs = (positions: Position[]) => {
  const data: CategorizedData<Position> = {}

  if (positions)
    for (const position of positions) {
      const time = new Date(position.createdAt)
      const now = new Date()
      let date: string

      position.jobTitle = normalize(position.jobTitle)
      position.jobsArray.forEach(job => (job.title = normalize(job.title)))

      time.setDate(time.getDate() + 1)
      now.setHours(0, 0, 0, 0)

      if (time >= now) date = '今天'
      else if (time.getTime() >= now.setDate(now.getDate() - 1)) date = '昨天'
      else
        date = `${time.getFullYear()} 年 ${time.getMonth() +
          1} 月 ${time.getDate()} 日`

      if (data[date]) data[date].push(position)
      else data[date] = [position]
    }

  return data
}

const categorizeBrief = (brief: Brief[]) => {
  const data: CategorizedData<Brief> = {}

  for (const position of brief) {
    const time = new Date(position.date)
    const now = new Date()
    let date: string

    if (time.getFullYear() === now.getFullYear())
      date = `${time.getMonth() + 1} 月 ${time.getDate()} 日`
    else
      date = `${time.getFullYear()} 年 ${time.getMonth() +
        1} 月 ${time.getDate()} 日`

    if (data[date]) data[date].push(position)
    else data[date] = [position]
  }

  return data
}

export { categorizeJobs, categorizeBrief }

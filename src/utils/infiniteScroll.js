import { value, computed, watch, onUnmounted } from 'vue-function-api'
import api from './api'

export default (url, lastCursor, refs) => {
  const isJobs = url() === '/api/jobs'
  const topics = value([])

  // Default pageSize is 20
  let totalItems = 20 + 1

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const res = await api(url(), {
          lastCursor: lastCursor()
        })

        totalItems = res.totalItems

        if (isJobs)
          res.data.forEach(item => {
            const target = topics.value.find(({ date }) => date === item.date)

            target
              ? (target.positions = [...target.positions, ...item.positions])
              : topics.value.push(item)
          })
        else topics.value = [...topics.value, ...res.data]
      }
    }
  )

  const source = isJobs
    ? computed(() => topics.value.map(item => item.positions))
    : topics
  watch(
    source,
    () => {
      if (totalItems > refs.topic.length)
        observer.observe([...refs.topic].pop())
    },
    { lazy: true }
  )

  onUnmounted(() => observer.disconnect())

  return { topics, observer }
}

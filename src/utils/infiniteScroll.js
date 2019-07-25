import { value, computed, watch, onUnmounted } from 'vue-function-api'
import api from './api'
import categorize from './categorize'
import merge from 'lodash/merge'

export default (url, lastCursor, refs) => {
  const isJobs = url() === '/api/jobs'
  const topics = value(isJobs ? {} : [])

  const observer = new IntersectionObserver(async ([entry]) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target)

      const { data, pageSize } = await api(url(), {
        lastCursor: lastCursor()
      })

      if (data.length === pageSize) {
        if (isJobs) topics.value = merge({}, topics.value, categorize(data))
        else topics.value = [...topics.value, ...data]
      }
    }
  })

  const valueToWatch = isJobs
    ? computed(() => Object.values(topics.value))
    : topics
  watch(valueToWatch, () => observer.observe([...refs.topic].pop()), {
    lazy: true
  })

  onUnmounted(() => observer.disconnect())

  return { topics, observer }
}

import { watch, onUnmounted } from '@vue/composition-api'
import api from './api'

export default (topics, refs, route, lastCursor) => {
  // Default `pageSize` is 20, need `totalItems > refs.topic.length`
  let totalItems = 21

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const res = await api(route.value, {
          lastCursor: lastCursor.value
        })

        totalItems = res.totalItems

        if (route.value === 'jobs')
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

  watch(() => {
    if (refs.value && refs.value.length < totalItems)
      observer.observe([...refs.value].pop())
  })

  onUnmounted(() => observer.disconnect())

  return observer
}

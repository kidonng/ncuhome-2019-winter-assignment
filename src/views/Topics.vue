<template>
  <div>
    <article class="topic" v-for="topic in topics" ref="topic">
      <h2>
        <router-link :to="{ name: 'topic', params: { id: topic.id } }">
          {{ topic.title | spacing }}
        </router-link>
        <time class="meta">{{ topic.createdAt | format }}</time>
      </h2>

      <div class="summary">
        {{ topic.summary | spacing }}
      </div>
    </article>
  </div>
</template>

<script>
import { value, watch, onMounted, onUnmounted } from 'vue-function-api'
import api from '../utils/api'

export default {
  setup(props, context) {
    const topics = value([])

    // Infinite scroll
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)

        const { data } = await api('/api/topic', {
          lastCursor: [...topics.value].pop().order
        })

        topics.value = [...topics.value, ...data]
      }
    })

    // Load new topics every half minute
    const refresh = setInterval(async () => {
      const { count } = await api('/api/topic/newCount', {
        latestCursor: topics.value[0].order
      })

      if (count) {
        const { data } = await api('/api/topic', { pageSize: count })

        topics.value = [...data, ...topics.value]
      }
    }, 30000)

    watch(topics, () => observer.observe([...context.refs.topic].pop()), {
      lazy: true
    })

    onMounted(async () => {
      const { data } = await api('/api/topic')
      topics.value = data
    })

    onUnmounted(() => {
      observer.disconnect()
      clearInterval(refresh)
    })

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.meta
  font-weight initial
  margin-left xxs
</style>

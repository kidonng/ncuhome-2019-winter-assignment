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

export default {
  setup(props, context) {
    const topics = value([])

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)

        const { data } = await context.root
          .ky('/api/topic', {
            searchParams: { lastCursor: [...topics.value].pop().order }
          })
          .json()

        topics.value = [...topics.value, ...data]
      }
    })

    watch(topics, topics => {
      if (topics.length) {
        observer.observe([...context.refs.topic].pop())
      }
    })

    // Load new topics every half minute
    const interval = setInterval(async () => {
      const { count } = await context.root
        .ky('/api/topic/newCount', {
          searchParams: { latestCursor: topics.value[0].order }
        })
        .json()

      if (count) {
        const { data } = await context.root
          .ky('/api/topic', { searchParams: { pageSize: count } })
          .json()

        topics.value = [...data, ...topics.value]
      }
    }, 30000)

    onMounted(
      async () =>
        (topics.value = (await context.root.ky('/api/topic').json()).data)
    )
    onUnmounted(() => {
      observer.disconnect()
      window.clearInterval(interval)
    })

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
@import "../styles/variables.styl"

.meta
  font-weight initial
  margin-left xxs
</style>

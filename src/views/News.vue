<template>
  <div>
    <article class="topic" v-for="entry in topics" ref="topic">
      <h2>
        <a :href="entry.url" target="_blank">
          {{ entry.title | spacing }}
        </a>
      </h2>

      <div class="summary" v-if="entry.summaryAuto">
        {{ entry.summaryAuto | spacing }}
      </div>

      <div class="meta">
        {{
          entry.authorName &&
          entry.authorName !== '新浪科技' &&
          entry.authorName !== '新浪科技综合' &&
          entry.authorName !== 'www.qq.com'
            ? `${entry.siteName} - ${entry.authorName}`
            : entry.siteName
        }}
        <time>{{ entry.publishDate | format }}</time>
      </div>
    </article>
  </div>
</template>

<script>
import { value, watch, onUnmounted } from 'vue-function-api'
import api from '../utils/api'

export default {
  setup(props, context) {
    const topics = value([])

    // Infinite scroll
    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)

        const { data } = await api(`/api/${context.root.$route.name}`, {
          lastCursor: Date.parse([...topics.value].pop().publishDate)
        })
        topics.value = [...topics.value, ...data]
      }
    })

    watch('$route', async $route => {
      observer.disconnect()

      const { data } = await api(`/api/${$route.name}`)
      topics.value = data
    })

    watch(topics, () => observer.observe([...context.refs.topic].pop()), {
      lazy: true
    })

    onUnmounted(() => observer.disconnect())

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
@import '../styles/variables.styl'

.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

<template>
  <div>
    <article class="topic" v-for="entry in topics">
      <h2>
        <a :href="entry.url" target="_blank">{{ entry.title | spacing }}</a>
      </h2>

      <div class="summary" v-if="entry.summary">
        {{
          entry.summary.endsWith('，')
            ? `${entry.summary.substring(0, entry.summary.length - 1)}...`
            : entry.summary.endsWith('。')
            ? entry.summary
            : `${entry.summary}...` | spacing
        }}
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

export default {
  setup(props, context) {
    const topics = value([])

    const observer = new IntersectionObserver(async ([entry]) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target)

        const { data } = await context.root
          .ky(`/api/${context.root.$route.name}`, {
            searchParams: {
              lastCursor: Date.parse([...topics.value].pop().publishDate)
            }
          })
          .json()

        topics.value = [...topics.value, ...data]
      }
    })

    watch(topics, topics => {
      if (topics.length) {
        observer.observe(document.querySelector('.topic:last-child'))
      }
    })

    watch('$route', async () => {
      const { data } = await context.root
        .ky(`/api/${context.root.$route.name}`)
        .json()
      topics.value = data
    })

    onUnmounted(() => observer.disconnect())

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
@import "../styles/variables.styl"

.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

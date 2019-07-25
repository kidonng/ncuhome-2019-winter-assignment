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
import { watch } from 'vue-function-api'
import api from '../utils/api'
import infiniteScroll from '../utils/infiniteScroll'

export default {
  setup(props, { refs, root }) {
    const { topics, observer } = infiniteScroll(
      () => `/api/${root.$route.name}`,
      () => Date.parse([...topics.value].pop().publishDate),
      refs
    )

    watch('$route', async $route => {
      observer.disconnect()

      const { data } = await api(`/api/${$route.name}`)
      topics.value = data
    })

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

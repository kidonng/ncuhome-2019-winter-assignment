<template>
  <div>
    <article
      class="topic"
      v-for="{
        url,
        title,
        summaryAuto,
        authorName,
        siteName,
        publishDate
      } in topics"
      :key="url"
      ref="topic"
    >
      <h2>
        <a :href="url" target="_blank" rel="noreferrer noopener">
          {{ title | spacing }}
        </a>
      </h2>

      <div class="summary" v-if="summaryAuto">
        {{ summaryAuto | spacing }}
      </div>

      <div class="meta">
        {{
          authorName &&
          authorName !== '新浪科技' &&
          authorName !== '新浪科技综合' &&
          authorName !== 'www.qq.com'
            ? `${siteName} - ${authorName}`
            : siteName
        }}
        <time>{{ publishDate | format }}</time>
      </div>
    </article>
  </div>
</template>

<script>
import { watch } from 'vue-function-api'
import api from '../utils/api'
import infiniteScroll from '../utils/infiniteScroll'

export default {
  setup(props, { root, refs }) {
    const { topics, observer } = infiniteScroll(
      () => `/api/${root.$route.name}`,
      () => Date.parse([...topics.value].pop().publishDate),
      refs
    )

    watch('$route', async ({ name }) => {
      observer.disconnect()
      ;({ data: topics.value } = await api(`/api/${name}`))
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

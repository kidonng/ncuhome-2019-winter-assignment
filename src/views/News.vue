<template>
  <div>
    <article
      class="topic"
      v-for="({ url, title, summaryAuto, authorName, siteName, publishDate },
      i) in topics"
      :key="url"
      :ref="
        (el) => {
          if (i === topics.length - 1) lastItem = el
        }
      "
    >
      <h2>
        <a :href="url">
          {{ spacing(title) }}
        </a>
      </h2>

      <div class="summary" v-if="summaryAuto">
        {{ spacing(summaryAuto) }}
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
        <time>{{ format(publishDate) }}</time>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { watch, defineComponent, computed, ComputedRef } from 'vue'
import { api } from '../utils/api'
import { useList } from '../utils/list'
import last from 'lodash-es/last'
import { Data, UseList } from '../types/misc'
import { router } from '../plugins/router'
import { spacing, format } from '../plugins/filters'

export default defineComponent({
  name: 'News',
  setup() {
    const route = computed(() => router.currentRoute.value.name) as ComputedRef<
      string
    >
    const lastCursor = computed(() =>
      Date.parse(last(topics.value).publishDate)
    )
    const { topics, lastItem, observer, loadMore } = useList(
      route,
      lastCursor
    ) as UseList<News>

    watch(route, async () => {
      if (
        route.value === 'news' ||
        route.value === 'technews' ||
        route.value === 'blockchain'
      ) {
        observer.disconnect()
        loadMore()
      }
    })

    return { topics, lastItem, spacing, format }
  },
})
</script>

<style lang="stylus" scoped>
@import '../variables'

.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

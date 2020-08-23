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

<script setup lang="ts">
import { watchEffect, computed, ComputedRef } from 'vue'
import { api } from '../utils/api'
import { useList } from '../utils/list'
import { last } from 'lodash-es'
import { Data, UseList } from '../types/misc'
import { router } from '../plugins/router'

const route = computed(() => router.currentRoute.value.name) as ComputedRef<
  string
>
const lastCursor = computed(() => Date.parse(last(topics.value).publishDate))
const { topics, lastItem, observer, load } = useList(
  route,
  lastCursor
) as UseList<News>

watchEffect(async () => {
  observer.disconnect()
  load()
})

export { topics, lastItem }
export { spacing, format } from '../plugins/filters'
</script>

<style lang="stylus" scoped>
@import '../variables'

.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

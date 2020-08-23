<template>
  <div>
    <article
      class="topic"
      v-for="({ id, title, createdAt, summary }, i) in topics"
      :key="id"
      :ref="
        (el) => {
          if (i === topics.length - 1) lastItem = el
        }
      "
    >
      <h2>
        <router-link :to="{ name: 'topic', params: { id } }">
          {{ spacing(title) }}
        </router-link>
        <time class="meta">{{ format(createdAt) }}</time>
      </h2>

      <div class="summary">
        {{ spacing(summary) }}
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { api } from '../utils/api'
import { useList } from '../utils/list'
import { last } from 'lodash-es'
import { Data, UseList } from '../types/misc'

const lastCursor = computed(() => last(topics.value).order)
const { topics, lastItem, load } = useList('topic', lastCursor) as UseList<
  Topic
>

onMounted(load)

// Refresh topics
const refresh = setInterval(async () => {
  const { count } = await api('topic/newCount', {
    searchParams: { latestCursor: topics.value[0].order },
  }).json<NewTopicCount>()

  if (count) {
    const { data } = await api('topic', {
      searchParams: { pageSize: count },
    }).json<Data<Topic>>()

    topics.value = [...data, ...topics.value]
  }
}, 30 * 1000)

onUnmounted(() => clearInterval(refresh))

export { topics, lastItem }
export { spacing, format } from '../plugins/filters'
</script>

<style lang="stylus" scoped>
@import '../variables'

.meta
  font-weight initial
  margin-left xxs
</style>

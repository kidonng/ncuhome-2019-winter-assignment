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

<script lang="ts">
import { onUnmounted, defineComponent, computed } from 'vue'
import { api } from '../utils/api'
import { useList } from '../utils/list'
import last from 'lodash-es/last'
import { spacing, format } from '../plugins/filters'
import { Data, UseList } from '../types/misc'

export default defineComponent({
  name: 'Topics',
  setup() {
    const lastCursor = computed(() => last(topics.value).order)
    const { topics, lastItem } = useList('topic', lastCursor) as UseList<Topic>

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

    return { topics, lastItem, spacing, format }
  },
})
</script>

<style lang="stylus" scoped>
@import '../variables'

.meta
  font-weight initial
  margin-left xxs
</style>

<template>
  <div>
    <article
      class="topic"
      v-for="{ id, title, createdAt, summary } in topics"
      :key="id"
      ref="refs"
    >
      <h2>
        <router-link :to="{ name: 'topic', params: { id } }">
          {{ title | spacing }}
        </router-link>
        <time class="meta">{{ createdAt | format }}</time>
      </h2>

      <div class="summary">
        {{ summary | spacing }}
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { onUnmounted, defineComponent } from '@vue/composition-api'
import { api } from '@/utils/api'
import { useList } from '@/utils/list'
import { last } from 'lodash-es'
import { Data, UseList } from '@/types/misc'

export default defineComponent({
  setup() {
    const lastCursor = () => last(topics.value)!.order
    const { topics, refs } = useList('topic', lastCursor) as UseList<Topic>

    // Refresh topics
    const refresh = setInterval(async () => {
      const { count } = await api('topic/newCount', {
        searchParams: { latestCursor: topics.value[0].order }
      }).json<NewTopicCount>()

      if (count) {
        const { data } = await api('topic', {
          searchParams: { pageSize: count }
        }).json<Data<Topic>>()

        topics.value = [...data, ...topics.value]
      }
    }, 30 * 1000)

    onUnmounted(() => clearInterval(refresh))

    return { topics, refs }
  }
})
</script>

<style lang="stylus" scoped>
.meta
  font-weight initial
  margin-left xxs
</style>

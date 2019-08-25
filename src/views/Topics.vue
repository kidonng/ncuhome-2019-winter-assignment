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
import { onUnmounted, createComponent } from '@vue/composition-api'
import { api, useList } from '@/utils'
import { Data, ListReturn } from '@/types'

export default createComponent({
  setup() {
    const lastCursor = () => topics.value.slice(-1)[0].order
    const { topics, refs } = useList('topic', lastCursor) as ListReturn<Topic[]>

    // Refresh topics
    const refresh = setInterval(async () => {
      const { count } = (await api('topic/newCount', {
        latestCursor: topics.value[0].order
      })) as TopicNewCount

      if (count) {
        const { data } = (await api('topic', { pageSize: count })) as Data<
          Topic[]
        >

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

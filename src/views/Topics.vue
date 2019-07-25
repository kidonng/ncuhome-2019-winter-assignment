<template>
  <div>
    <article class="topic" v-for="topic in topics" ref="topic">
      <h2>
        <router-link :to="{ name: 'topic', params: { id: topic.id } }">
          {{ topic.title | spacing }}
        </router-link>
        <time class="meta">{{ topic.createdAt | format }}</time>
      </h2>

      <div class="summary">
        {{ topic.summary | spacing }}
      </div>
    </article>
  </div>
</template>

<script>
import { onMounted, onUnmounted } from 'vue-function-api'
import api from '../utils/api'
import infiniteScroll from '../utils/infiniteScroll'

export default {
  setup(props, { refs }) {
    const { topics } = infiniteScroll(
      () => '/api/topic',
      () => [...topics.value].pop().order,
      refs
    )

    // Load new topics every half minute
    const refresh = setInterval(async () => {
      const { count } = await api('/api/topic/newCount', {
        latestCursor: topics.value[0].order
      })

      if (count) {
        const { data } = await api('/api/topic', { pageSize: count })

        topics.value = [...data, ...topics.value]
      }
    }, 30000)

    onMounted(async () => {
      const { data } = await api('/api/topic')
      topics.value = data
    })

    onUnmounted(() => clearInterval(refresh))

    return { topics }
  }
}
</script>

<style lang="stylus" scoped>
.meta
  font-weight initial
  margin-left xxs
</style>

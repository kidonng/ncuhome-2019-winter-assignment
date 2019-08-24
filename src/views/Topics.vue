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

<script>
import { ref, computed, onMounted, onUnmounted } from '@vue/composition-api'
import api from '../utils/api'
import useInfiniteScroll from '../utils/infiniteScroll'

export default {
  setup() {
    const topics = ref([])
    const refs = ref(null)
    const route = ref('topic')
    const lastCursor = computed(() => [...topics.value].pop().order)
    useInfiniteScroll(topics, refs, route, lastCursor)

    // Refresh topics
    const refresh = setInterval(async () => {
      const { count } = await api('topic/newCount', {
        latestCursor: topics.value[0].order
      })

      if (count) {
        const { data } = await api('topic', { pageSize: count })

        topics.value = [...data, ...topics.value]
      }
    }, 30 * 1000)

    onMounted(async () => ({ data: topics.value } = await api('topic')))

    onUnmounted(() => clearInterval(refresh))

    return { topics, refs }
  }
}
</script>

<style lang="stylus" scoped>
.meta
  font-weight initial
  margin-left xxs
</style>

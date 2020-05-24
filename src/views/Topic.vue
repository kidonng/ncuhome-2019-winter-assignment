<template>
  <article v-if="topic">
    <h2>{{ spacing(topic.title) }}</h2>
    <time class="meta">{{ format(topic.createdAt) }}</time>
    <div class="summary">
      {{ spacing(topic.summary) }}
    </div>

    <section>
      <h3>媒体报道</h3>
      <ul>
        <li v-for="{ url, title, siteName } in topic.newsArray" :key="url">
          <a :href="url">
            {{ spacing(title) }}
          </a>
          <span class="meta">{{ siteName }}</span>
        </li>
      </ul>
    </section>

    <section v-if="topic.timeline && topic.timeline.topics">
      <h3>
        {{ topic.timeline.commonEntities.length ? '事件追踪' : '相关事件' }}
      </h3>
      <ul class="timeline">
        <li v-for="{ id, title, createdAt } in topic.timeline.topics" :key="id">
          <router-link :to="{ name: 'topic', params: { id } }">
            {{ spacing(title) }}
          </router-link>
          <span class="meta">{{ format(createdAt) }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from 'vue'
import { api } from '../utils/api'
import { router } from '../plugins/router'
import { spacing, format } from '../plugins/filters'

export default defineComponent({
  name: 'Topic',
  setup() {
    const topic = ref<FullTopic>()

    watch(
      router.currentRoute,
      async (route) => {
        if (route) {
          const { timeline, ...data } = await api(
            `topic/${route.params.id}`
          ).json<FullTopic>()

          // Remove current topic
          if (timeline && timeline.topics) timeline.topics.shift()

          topic.value = { timeline, ...data }
          document.title = `${spacing(data.title)} - Readhub`
        }
      },
      { immediate: true }
    )

    return { topic, spacing, format }
  },
})
</script>

<style lang="stylus" scoped>
@import '../variables'

.summary
  margin-top xxs

li
  & .meta
    display block

    @media (min-width: 768px)
      &
        display initial
        margin-left xxs
</style>

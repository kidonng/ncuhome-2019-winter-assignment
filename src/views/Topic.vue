<template>
  <article v-if="topic">
    <h2>{{ topic.title | spacing }}</h2>
    <time class="meta">{{ topic.createdAt | format }}</time>
    <div class="summary">
      {{ topic.summary | spacing }}
    </div>

    <section>
      <h3>媒体报道</h3>
      <ul>
        <li v-for="{ url, title, siteName } in topic.newsArray" :key="url">
          <a :href="url" target="_blank" rel="noreferrer noopener">
            {{ title | spacing }}
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
            {{ title | spacing }}
          </router-link>
          <span class="meta">{{ createdAt | format }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import { value, watch } from 'vue-function-api'
import api from '../utils/api'
import pangu from 'pangu'

export default {
  setup() {
    const topic = value(null)

    watch('$route', async ({ params: { id } }) => {
      const data = await api(`/api/topic/${id}`)

      // Remove current topic
      if (data.timeline && data.timeline.topics) data.timeline.topics.shift()

      topic.value = data
      document.title = `${pangu.spacing(data.title)} - Readhub`
    })

    return { topic }
  }
}
</script>

<style lang="stylus" scoped>
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

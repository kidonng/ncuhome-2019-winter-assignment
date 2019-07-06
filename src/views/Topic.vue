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
        <li v-for="news in topic.newsArray">
          <a :href="news.url" target="_blank">
            {{ news.title | spacing }}
          </a>
          <span class="meta">{{ news.siteName }}</span>
        </li>
      </ul>
    </section>

    <section v-if="topic.timeline && topic.timeline.topics">
      <h3>
        {{ topic.timeline.commonEntities.length ? '事件追踪' : '相关事件' }}
      </h3>
      <ul class="timeline">
        <li v-for="topic in topic.timeline.topics">
          <router-link :to="{ name: 'topic', params: { id: topic.id } }">
            {{ topic.title | spacing }}
          </router-link>
          <span class="meta">{{ topic.createdAt | format }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>

<script>
import pangu from 'pangu'

export default {
  data: () => ({
    topic: null
  }),
  created() {
    this.load()
  },
  watch: {
    $route: 'load'
  },
  methods: {
    load() {
      ;(async () => {
        this.topic = await this.api(`topic/${this.$route.params.id}`).json()
        document.title = `${pangu.spacing(this.topic.title)} - Readhub`
      })()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../styles/base"

.summary
  margin-top xxs

li
  & .meta
    display block

    @media (min-width 768px)
      &
        display initial
        margin-left xxs

  // Hide current topic
  .timeline &:first-child
    display none
</style>

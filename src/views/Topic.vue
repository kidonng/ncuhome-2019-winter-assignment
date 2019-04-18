<template lang="pug">
  article(v-if="topic")
    h2 {{ topic.title | spacing }}
    time.meta {{ topic.createdAt | format }}

    .summary {{ topic.summary | spacing }}

    section
      h3 媒体报道

      ul: li(v-for="news in topic.newsArray")
        a(:href="news.url" target="_blank") {{ news.title | spacing }}
        span.meta {{ news.siteName }}

    section(v-if="topic.timeline && topic.timeline.topics")
      h3 {{ topic.timeline.commonEntities.length ? '事件追踪' : '相关事件' }}

      ul.timeline: li(v-for="topic in topic.timeline.topics")
        router-link(:to="{ name: 'topic', params: { id: topic.id } }") {{ topic.title | spacing }}
        span.meta {{ topic.createdAt | format }}
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

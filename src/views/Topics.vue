<template lang="pug">
  div: article.topic(v-for="topic in topics")
    h2
      router-link(:to="{ name: 'topic', params: { id: topic.id } }") {{ topic.title | spacing }}
      time.meta {{ topic.createdAt | format }}

    .summary {{ topic.summary | spacing }}
</template>

<script>
export default {
  data: () => ({
    topics: null,
    loading: false,
    refresher: null
  }),
  created() {
    ;(async () => (this.topics = (await this.api('topic').json()).data))()

    addEventListener('scroll', this.scroll)

    this.refresher = setInterval(async () => {
      this.loading = true

      const count = (await this.api('topic/newCount', {
        searchParams: {
          latestCursor: this.topics[0].order
        }
      }).json()).count
      if (count)
        this.topics = (await this.api('topic', {
          searchParams: {
            pageSize: count
          }
        }).json()).data.concat(this.topics)

      this.loading = false
    }, 30000)
  },
  beforeDestroy() {
    removeEventListener('scroll', this.scroll)
    clearInterval(this.refresher)
  },
  methods: {
    scroll() {
      if (
        scrollY + innerHeight + 200 > document.body.clientHeight &&
        !this.loading
      )
        (async () => {
          this.loading = true

          this.topics = this.topics.concat(
            (await this.api('topic', {
              searchParams: {
                lastCursor: this.topics.slice(-1)[0].order
              }
            }).json()).data
          )

          this.loading = false
        })()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "../styles/base"

.meta
  font-weight initial
  margin-left xxs
</style>

<template>
  <div>
    <article class="topic" v-for="entry in news">
      <h2>
        <a :href="entry.url" target="_blank">{{ entry.title | spacing }}</a>
      </h2>

      <div class="summary" v-if="entry.summary">
        {{
          entry.summary.endsWith('，')
          ? `${entry.summary.substring(0, entry.summary.length - 1)}...`
          : entry.summary.endsWith('。')
          ? entry.summary
          : `${entry.summary}...` | spacing
        }}
      </div>

      <div class="meta">
        {{
          entry.authorName &&
          entry.authorName !== '新浪科技' &&
          entry.authorName !== '新浪科技综合' &&
          entry.authorName !== 'www.qq.com'
          ? `${entry.siteName} - ${entry.authorName}`
          : entry.siteName
        }}
        <time>{{ entry.publishDate | format }}</time>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  data: () => ({
    news: null,
    loading: false
  }),
  created() {
    this.load()

    addEventListener('scroll', this.scroll)
  },
  beforeDestroy() {
    removeEventListener('scroll', this.scroll)
  },
  watch: {
    $route: 'load'
  },
  methods: {
    load() {
      ;(async () =>
        (this.news = (await this.api(this.$route.name).json()).data))()
    },
    scroll() {
      if (
        scrollY + innerHeight + 200 > document.body.clientHeight &&
        !this.loading
      )
        (async () => {
          this.loading = true

          this.news = this.news.concat(
            (await this.api(this.$route.name, {
              searchParams: {
                lastCursor: Date.parse(this.news.slice(-1)[0].publishDate)
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

.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

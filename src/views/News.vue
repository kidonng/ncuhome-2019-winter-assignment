<template>
  <div>
    <article
      class="topic"
      v-for="{
        url,
        title,
        summaryAuto,
        authorName,
        siteName,
        publishDate
      } in topics"
      :key="url"
      ref="refs"
    >
      <h2>
        <a :href="url">
          {{ title | spacing }}
        </a>
      </h2>

      <div class="summary" v-if="summaryAuto">
        {{ summaryAuto | spacing }}
      </div>

      <div class="meta">
        {{
          authorName &&
          authorName !== '新浪科技' &&
          authorName !== '新浪科技综合' &&
          authorName !== 'www.qq.com'
            ? `${siteName} - ${authorName}`
            : siteName
        }}
        <time>{{ publishDate | format }}</time>
      </div>
    </article>
  </div>
</template>

<script>
import { ref, computed, watch } from '@vue/composition-api'
import api from '../utils/api'
import useInfiniteScroll from '../utils/infiniteScroll'

export default {
  setup(props, { root }) {
    const topics = ref([])
    const refs = ref(null)
    const route = computed(() => root.$route.name)
    const lastCursor = computed(() =>
      Date.parse([...topics.value].pop().publishDate)
    )
    const observer = useInfiniteScroll(topics, refs, route, lastCursor)

    watch(async () => {
      observer.disconnect()
      ;({ data: topics.value } = await api(root.$route.name))
    })

    return { topics, refs }
  }
}
</script>

<style lang="stylus" scoped>
.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

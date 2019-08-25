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

<script lang="ts">
import { watch, createComponent } from '@vue/composition-api'
import { api, useList } from '@/utils'
import { RouteName, ListReturn, Data } from '@/types'

export default createComponent<{}>({
  setup(props, { root }) {
    const route = () => root.$route.name as RouteName
    const lastCursor = () => Date.parse(topics.value!.slice(-1)[0].publishDate)
    const { topics, refs, observer, total } = useList(
      route,
      lastCursor
    ) as ListReturn<News[]>

    watch(
      route,
      async () => {
        observer.disconnect()
        const { data, totalItems } = (await api(route)) as Data<News[]>
        topics.value = data
        total.value = totalItems
      },
      { lazy: true }
    )

    return { topics, refs }
  }
})
</script>

<style lang="stylus" scoped>
.summary
  margin-bottom xxs

time
  margin-left xxs
</style>

import { ref, watch, onMounted, onUnmounted } from '@vue/composition-api'
import { api } from '@/utils'
import { RouteName, List, ListData } from '@/types'

export function useList(
  route: RouteName | (() => RouteName),
  lastCursor: () => number
) {
  const topics = ref<List>()
  const refs = ref<Element[]>()
  const total = ref<number>()

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const { data } = (await api(route, {
          lastCursor: lastCursor()
        })) as ListData

        // @ts-ignore
        topics.value.push(...data)
      }
    }
  )

  watch(
    refs,
    () => {
      if (refs.value!.length < total.value!)
        observer.observe(refs.value!.slice(-1)[0])
    },
    { lazy: true }
  )

  onMounted(
    async () =>
      ({ data: topics.value, totalItems: total.value } = (await api(
        route
      )) as ListData)
  )

  onUnmounted(() => observer.disconnect())

  return { topics, refs, observer, total }
}

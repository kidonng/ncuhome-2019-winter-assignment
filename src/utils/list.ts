import { ref, watch, onMounted, onUnmounted } from '@vue/composition-api'
import { api } from '@/utils/api'
import { last } from 'lodash-es'
import { ListItem } from '@/types/list'
import { ListData } from '@/types/data'

// TODO: Add correct return type
function useList(
  route: Parameters<typeof api>[0],
  lastCursor: () => number
) {
  const topics = ref<ListItem[]>([])
  const refs = ref<Element[]>([])
  const total = ref(0)

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const { data } = await api<ListData>(route, {
          lastCursor: lastCursor()
        })

        topics.value.push(...data)
      }
    }
  )

  watch(() => {
    if (refs.value.length < total.value) observer.observe(last(refs.value)!)
  })

  onMounted(
    async () =>
      ({ data: topics.value, totalItems: total.value } = await api<ListData>(
        route
      ))
  )

  onUnmounted(() => observer.disconnect())

  return { topics, refs, observer, total }
}

export { useList }

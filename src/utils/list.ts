import { ref, watch, onMounted, onUnmounted } from 'vue'
import { api } from '../utils/api'
import last from 'lodash-es/last'
import { Input } from 'ky'
import { DataType, Data } from '../types/misc'

function useList(route: Input | (() => Input), lastCursor: () => number) {
  const topics = ref<DataType[]>([])
  const refs = ref<Element[]>([])
  const total = ref(0)

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        if (typeof route === 'function') route = route()
        const { data } = await api(route, {
          searchParams: { lastCursor: lastCursor() },
        }).json<Data<DataType>>()

        topics.value.push(...data)
      }
    }
  )

  watch(refs, () => {
    if (refs.value.length < total.value) observer.observe(last(refs.value)!)
  })

  onMounted(async () => {
    if (typeof route === 'function') route = route()
    const { data, totalItems } = await api(route).json<Data<DataType>>()
    topics.value = data
    total.value = totalItems
  })

  onUnmounted(() => observer.disconnect())

  return { topics, refs, observer, total }
}

export { useList }

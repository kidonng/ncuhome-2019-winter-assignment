import {
  ref,
  watch,
  onMounted,
  onUnmounted,
  Ref,
  isRef,
  ComputedRef,
} from 'vue'
import { api } from '../utils/api'
import { Input } from 'ky'
import { DataType, Data } from '../types/misc'

export function useList(
  route: Input | Ref<Input>,
  lastCursor: ComputedRef<number>
) {
  const topics = ref<DataType[]>([])
  const lastItem = ref<HTMLElement>()
  const total = ref(0)

  const loadMore = async () => {
    const { data, totalItems } = await api(
      isRef(route) ? route.value : route
    ).json<Data<DataType>>()
    topics.value = data
    total.value = totalItems
  }

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const { data } = await api(isRef(route) ? route.value : route, {
          searchParams: { lastCursor: lastCursor.value },
        }).json<Data<DataType>>()

        topics.value.push(...data)
      }
    }
  )

  watch(
    () => topics.value.length,
    () => {
      if (topics.value.length < total.value) observer.observe(lastItem.value)
    }
  )

  onMounted(loadMore)

  onUnmounted(() => observer.disconnect())

  return { topics, lastItem, observer, loadMore }
}

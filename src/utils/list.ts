import { ref, watchEffect, onUnmounted, Ref, unref, ComputedRef } from 'vue'
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

  const load = async () => {
    const { data, totalItems } = await api(unref(route)).json<Data<DataType>>()
    topics.value = data
    total.value = totalItems
  }

  const observer = new IntersectionObserver(
    async ([{ isIntersecting, target }]) => {
      if (isIntersecting) {
        observer.unobserve(target)

        const { data } = await api(unref(route), {
          searchParams: { lastCursor: lastCursor.value },
        }).json<Data<DataType>>()

        topics.value.push(...data)
      }
    }
  )

  watchEffect(() => {
    if (topics.value.length < total.value) observer.observe(lastItem.value!)
  })

  onUnmounted(() => observer.disconnect())

  return { topics, lastItem, observer, load }
}

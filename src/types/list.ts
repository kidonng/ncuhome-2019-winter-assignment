import { useList } from '@/utils'
import { Ref } from '@vue/composition-api'
import { Position } from '@/types'

type ListItem = Topic | News | Position

interface UseList<T extends ListItem> extends ReturnType<typeof useList> {
  topics: Ref<T[]>
}

export { ListItem, UseList }

import { useList } from '@/utils/list'
import { Ref } from '@vue/composition-api'
import { Position } from '@/types/jobs'

type ListItem = Topic | News | Position

interface UseList<T extends ListItem> extends ReturnType<typeof useList> {
  topics: Ref<T[]>
}

export { ListItem, UseList }

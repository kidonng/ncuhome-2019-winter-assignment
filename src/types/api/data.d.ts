import { useList } from '@/utils'
import { Ref } from '@vue/composition-api'
import { Brief, Position } from '@/types'

interface BasicData<T> {
  data: T
}

interface Data<T> extends BasicData<T> {
  pageSize: number
  totalItems: number
  totalPage: number
}

type List = Topic[] | News[] | Position[]
type ListData = Data<Topic[]> | Data<News[]> | Data<Position[]>
interface ListReturn<T extends List> extends ReturnType<typeof useList> {
  topics: Ref<T>
}

type APIResponse = ListData | BasicData<Brief[]> | FullTopic | TopicNewCount

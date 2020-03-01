import { Position } from '@/types/jobs'
import { RequireAtLeastOne } from 'type-fest'

interface BasicData<T> {
  data: T[]
}

type Data<T> = BasicData<T> &
  Record<'pageSize' | 'totalItems' | 'totalPage', number>

type ListData = Data<Topic> | Data<News> | Data<Position>

type CategorizedData<T> = Record<string, T[]>

type SearchParams = RequireAtLeastOne<
  Record<'latestCursor' | 'lastCursor' | 'pageSize', number>
>

export { BasicData, Data, ListData, CategorizedData, SearchParams }

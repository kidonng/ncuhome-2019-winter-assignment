import { useList } from '../utils/list'
import { Ref } from 'vue'

type DataType = Topic | News | Position

interface BasicData<T extends DataType | Brief> {
  data: T[]
}

type Data<T extends DataType> = BasicData<T> &
  Record<'pageSize' | 'totalItems' | 'totalPage', number>

type CategorizedData<T extends Position | Brief> = Record<string, T[]>

// TypeScript can't infer types from circular references
// We need to use `as UseList<T>` every time we call `useList()`
interface UseList<T extends DataType> extends ReturnType<typeof useList> {
  topics: Ref<T[]>
}

export { BasicData, Data, CategorizedData, DataType, UseList }

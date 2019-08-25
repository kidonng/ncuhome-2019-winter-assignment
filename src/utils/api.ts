import ky from 'ky'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { SearchParams } from '@/types'

NProgress.configure({ showSpinner: false })

async function api<T>(
  url: string | (() => string),
  searchParams?: SearchParams
) {
  NProgress.start()

  if (typeof url === 'function') url = url()
  const res: T = await ky(url, {
    prefixUrl: '/api',
    searchParams
  }).json()

  NProgress.done()

  return res
}

export { api }

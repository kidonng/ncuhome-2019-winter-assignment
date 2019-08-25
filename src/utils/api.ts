import ky from 'ky'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { APIResponse } from '@/types'

NProgress.configure({ showSpinner: false })

export async function api(
  url: string | (() => string),
  searchParams?: Record<string, number>
) {
  NProgress.start()

  const res: APIResponse = await ky(typeof url === 'string' ? url : url(), {
    prefixUrl: '/api',
    searchParams
  }).json()

  NProgress.done()

  return res
}

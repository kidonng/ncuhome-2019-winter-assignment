import ky from 'ky'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import categorize from './categorize'

NProgress.configure({ showSpinner: false })

export default async (url, searchParams) => {
  NProgress.start()

  const res = await ky(url, {
    prefixUrl: '/api',
    searchParams
  }).json()
  if (url.startsWith('jobs')) res.data = categorize(res.data)

  NProgress.done()

  return res
}

import ky from 'ky'
import NProgress from 'nprogress'

NProgress.configure({ showSpinner: false })

export default async (url, searchParams) => {
  NProgress.start()

  const res = await ky(url, { searchParams }).json()

  NProgress.done()

  return res
}

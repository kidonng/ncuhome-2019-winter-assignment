import ky from 'ky'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// searchParams: Record<'latestCursor' | 'lastCursor' | 'pageSize', number>
const api = ky.extend({
  prefixUrl: '/api',
  hooks: {
    beforeRequest: [
      () => {
        NProgress.start()
      }
    ],
    afterResponse: [
      () => {
        NProgress.done()
      }
    ]
  }
})

export { api }

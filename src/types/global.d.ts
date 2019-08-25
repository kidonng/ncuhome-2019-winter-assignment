import { RouteConfig } from 'vue-router'

type RouteName =
  | 'topics'
  | 'topic'
  | 'news'
  | 'technews'
  | 'blockchain'
  | 'jobs'
type Category = Partial<Record<RouteName, string>>
interface Route extends RouteConfig {
  name?: RouteName
}

interface Item {
  id: string
  title: string
}

interface BasicTopic extends Item {
  createdAt: string
}

interface Topic extends BasicTopic {
  eventData: []
  extra: { instantView: boolean }
  instantView: boolean
  hasInstantView: boolean
  newsArray: NewsItem[]
  order: number
  publishDate: string
  summary: string
  timeline: string
  updatedAt: string
}

interface FullTopic extends BasicTopic {
  entityEventTopics: []
  entityTopics: EntityTopic[]
  hasInstantView: boolean
  newsArray: NewsItem[]
  order: number
  publishDate: string
  summary: string
  timeline: Timeline | null
  updatedAt: string
}

interface Timeline {
  commonEntities: []
  id: string
  topics: BasicTopic[]
}

interface NewsItem extends Item {
  // [sic]
  autherName: string
  duplicateId: number
  language: string
  mobileUrl: string
  publishDate: string
  siteName: string
  statementType: number
  url: string
}

interface EntityTopic {
  entityId: string
  entityName: string
  entityType: string
  entityUniqueId: string
  finance: null
  nerName: string
  weight: number
}

interface TopicNewCount {
  count: number
}

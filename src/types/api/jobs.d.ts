interface CategorizedData<T> {
  date: string
  positions: T[]
}

export interface Position {
  cities: Record<string, number>
  companyCount: number
  createdAt: string
  experienceLower: number
  experienceUpper: number
  id: number
  jobCount: number
  jobTitle: string
  jobsArray: Job[]
  publishDate: string
  salaryLower: number
  salaryUpper: number
  sources: Record<string, number>
  uuid: string
}

interface Job {
  city: string
  company: string
  experienceLower: number
  experienceUpper: number
  id: number
  salaryLower: number
  salaryUpper: number
  siteName: string
  sponsor: boolean
  title: string
  url: string
}

interface Brief {
  content: string
  date: string
  jobTitle: string
}

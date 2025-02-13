import axios from 'axios'

interface ImageFormat {
  name: string
  hash: string
  ext: string
  mime: string
  path: null
  width: number
  height: number
  size: number
  sizeInBytes: number
  url: string
}

interface Image {
  id: number
  documentId: string
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: {
    thumbnail: ImageFormat
    medium?: ImageFormat
    small: ImageFormat
    large?: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: null
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface DatabaseItem {
  id: number
  documentId: string
  title: string
  use: string
  setup: string
  pricing: string
  license: string
  averageTimeToGenerate: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  Image: Image
}

interface ApiResponse {
  data: DatabaseItem[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export function useDatabase() {
  const items: Ref<DatabaseItem[]> = ref([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDatabaseItems() {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<ApiResponse>('https://aiupd8-backend-production.up.railway.app/api/tools?populate=*')
      items.value = response.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch database items'
      console.error('Error fetching database items:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    error,
    fetchDatabaseItems
  }
}
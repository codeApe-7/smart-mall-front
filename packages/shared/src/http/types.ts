export interface RequestConfig {
  baseURL: string
  withAdminToken?: boolean
  onUnauthorized?: () => void
}

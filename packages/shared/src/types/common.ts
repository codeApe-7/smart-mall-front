export interface ResponseVO<T> {
  status: string
  code: number
  info: string
  data: T
}

export interface ApiResponse<T> extends ResponseVO<T> {
  msg?: string
}

export interface PageResultVO<T> {
  pageNo: number
  pageSize: number
  totalCount: number
  totalPages: number
  records: T[]
}

export type PageResult<T> = PageResultVO<T>

export interface OptionItem {
  label: string
  value: string | number | boolean
}

export interface StatusOption extends OptionItem {
  color?: string
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export type Dictionary = Record<string, unknown>

export const currency = (value?: string | number | null) => {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

export const formatDateTime = (value?: string | number | Date | null) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export const joinAddress = (...parts: Array<string | null | undefined>) =>
  parts.filter(Boolean).join(' ')

export const formatCurrency = currency

export const ensureArray = <T>(value: T[] | null | undefined) => value ?? []

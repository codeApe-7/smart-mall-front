export const orderStatusMap: Record<string, string> = {
  CREATED: '待支付',
  PAID: '待发货',
  SHIPPED: '待收货',
  FINISHED: '已完成',
  CANCELLED: '已取消',
  CLOSED: '已关闭',
}

export const refundStatusMap: Record<string, string> = {
  APPLIED: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
  REFUNDED: '已退款',
}

export const pickStatusTone = (status: string | number | boolean | null | undefined) => {
  if (status === null || status === undefined) return 'info'
  const normalized = String(status).toUpperCase()
  if (status === 1 || normalized === '1' || normalized.includes('SUCCESS') || normalized.includes('PAID') || normalized.includes('FINISHED') || normalized.includes('APPROVED')) {
    return 'success'
  }
  if (status === 0 || normalized === '0' || normalized.includes('PENDING') || normalized.includes('CREATED') || normalized.includes('APPLIED') || normalized.includes('PROCESS')) {
    return 'warning'
  }
  if (normalized.includes('FAIL') || normalized.includes('ERROR') || normalized.includes('REJECT') || normalized.includes('CANCEL') || normalized.includes('CLOSE')) {
    return 'danger'
  }
  return 'info'
}

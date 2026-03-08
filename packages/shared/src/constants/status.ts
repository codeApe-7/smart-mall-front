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

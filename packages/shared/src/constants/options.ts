import type { StatusOption } from '@shared/types/common';

export const ORDER_STATUS_OPTIONS: StatusOption[] = [
  { label: '待支付', value: 0, tone: 'warning' },
  { label: '待发货', value: 10, tone: 'info' },
  { label: '待收货', value: 20, tone: 'info' },
  { label: '已完成', value: 30, tone: 'success' },
  { label: '已取消', value: 40, tone: 'danger' },
  { label: '退款中', value: 50, tone: 'warning' }
];

export const ACCOUNT_STATUS_OPTIONS: StatusOption[] = [
  { label: '启用', value: 1, tone: 'success' },
  { label: '禁用', value: 0, tone: 'danger' }
];

export const NOTICE_TYPE_OPTIONS: StatusOption[] = [
  { label: '系统公告', value: 'SYSTEM', tone: 'info' },
  { label: '订单消息', value: 'ORDER', tone: 'warning' },
  { label: '活动通知', value: 'MARKETING', tone: 'success' }
];

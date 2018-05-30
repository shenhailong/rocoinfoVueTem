// 订单状态
export const ORDER_STATUS_PENDING_PAID = { text: '待付款', label: '待付款', value: 'PENDING_PAID' }
export const ORDER_STATUS_PENDING_DELIVER = { text: '待发货', label: '待发货', value: 'PENDING_DELIVER' }
export const ORDER_STATUS_PENDING_RECEIVE = { text: '待收货', label: '待收货', value: 'PENDING_RECEIVE' }
export const ORDER_STATUS_COMPLETED = { text: '交易完成', label: '交易完成', value: 'COMPLETED' }
export const ORDER_STATUS_CANCELED = { text: '已取消', label: '已取消', value: 'CANCELED' }
export const ORDER_STATUS_REFUNDED = { text: '已退款', label: '已退款', value: 'REFUNDED' }
export const ORDER_STATUS_EVALUATED = { text: '交易完成', label: '交易完成', value: 'EVALUATED' }


export default {
  PENDING_PAID: ORDER_STATUS_PENDING_PAID,
  PENDING_DELIVER: ORDER_STATUS_PENDING_DELIVER,
  PENDING_RECEIVE: ORDER_STATUS_PENDING_RECEIVE,
  COMPLETED: ORDER_STATUS_COMPLETED,
  CANCELED: ORDER_STATUS_CANCELED,
  REFUNDED: ORDER_STATUS_REFUNDED,
  EVALUATED: ORDER_STATUS_EVALUATED
}


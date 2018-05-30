
export const AFTER_SALES_TYPE_PACKAGE_DAMAGED = { text: '包装破损', label: '包装破损', value: 'PACKAGE_DAMAGED' }
export const AFTER_SALES_TYPE_SEND_LESS = { text: '少发漏发', label: '少发漏发', value: 'SEND_LESS' }
export const AFTER_SALES_TYPE_SEND_WRONG = { text: '卖家发错货', label: '卖家发错货', value: 'SEND_WRONG' }
export const AFTER_SALES_TYPE_DISLIKE = { text: '不喜欢了', label: '不喜欢了', value: 'DISLIKE' }
export const AFTER_SALES_TYPE_OTHERS = { text: '其它', label: '其它', value: 'OTHERS' }

export default [
  AFTER_SALES_TYPE_PACKAGE_DAMAGED,
  AFTER_SALES_TYPE_SEND_LESS,
  AFTER_SALES_TYPE_SEND_WRONG,
  AFTER_SALES_TYPE_DISLIKE,
  AFTER_SALES_TYPE_OTHERS
]

export const AFTER_SALES_TYPE = {
  PACKAGE_DAMAGED: AFTER_SALES_TYPE_PACKAGE_DAMAGED,
  SEND_LESS: AFTER_SALES_TYPE_SEND_LESS,
  SEND_WRONG: AFTER_SALES_TYPE_SEND_WRONG,
  DISLIKE: AFTER_SALES_TYPE_DISLIKE,
  OTHERS: AFTER_SALES_TYPE_OTHERS
}

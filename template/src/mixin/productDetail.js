
export default {
  methods: {
    $_goDetail(item) {
      console.log('去商品详情', item)
      // 优先用skuId没有用id
      let query = { skuId: item.skuId || item.id }
      if (item.type === 'TIME_LIMITED') {
        // 限时购
        query.placeOrderType = 'TIME_LIMITED'
      }else if(item.type === 'QUANTITY_LIMITED') {
        // 限量试用
        query.placeOrderType = 'CART'
      }
      this.$router.push({
        path: '/product/' + item.productId,
        query
        // query: {
        //   skuId: item.skuId || item.id,
        //   placeOrderType: item.type
        // }
      })
    }
  }
}

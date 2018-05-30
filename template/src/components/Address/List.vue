<template>
  <div class="wrap wrap-address-select">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{computedTitle}}</div>
    </div>
    <div class="content">
      <template v-if="isEmpty">
        <div class="tips-box">
          <div class="tips-no-result">
            <div class="icon-area">
              <i class="icon icon-no-address">icon</i>
            </div>
            <p>暂无收货地址</p>
            <p>你可以新建地址以方便收货</p>
            <router-link :to="computedAddRouter" href="javascript:;" class="btn-normal btn-primary btn-xl _solid">新增收货地址</router-link>
          </div>
        </div>
      </template>
      <template v-else>
        <template v-for="(address, $index) in lists">
          <div :key="address.id">
            <div class="card card-address">
              <div @click="selectHandler(address)" class="card-body">
                <div class="item-user-info">
                  <span>{{address.receiverName}}</span>
                  <span>{{address.receiverMobile}}</span>
                </div>
                <div class="item-address">
                  {{`${address.provinceLabel} ${address.cityLabel} ${address.districtLabel} ${address.detail}`}}
                </div>
              </div>
              <div class="card-footer _border-top">
                <div class="item-left">
                  <label class="label-checkbox">
                    <input @change="defaultHandler(address, $index, $event)" :value="address.id" v-model="defaultId" type="radio" name="my-radio">
                    <i class="icon icon-form-checkbox">icon</i>
                    设为默认地址
                  </label>
                </div>
                <div class="item-right">
                  <router-link :to="{name:computedEditRouterName, params:{aid: address.id}}" class="links-edit">
                    <svg class="svg-edit">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-edit"></use>
                    </svg>
                    编辑
                  </router-link>
                  <a @click="deleteHandler(address, $index)" href="javascript:;" class="links-del">
                    <svg class="svg-trash">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-trash"></use>
                    </svg>
                    删除
                  </a>
                </div>
              </div>
            </div>
            <div class="space-20"></div>
          </div>
        </template>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="circles">
          <span slot="no-results" style="display:none;"></span>
          <div class="tips-txt" slot="no-more" style="padding:0;margin:0;height:0;">
            <!-- <img class="tips-nolist" src="static/images/img-footer.png" alt="加载到底图片"> -->
          </div>
        </infinite-loading>
        <div class="button-block">
          <router-link :to="computedAddRouter" href="javascript:;" class="btn-normal btn-primary btn-xl _solid">新增收货地址</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '@/configs/axios'
import InfiniteLoading from 'vue-infinite-loading'
import CODE_SUCCESS from '@/constants/responseCode'
import { Toast, Modal } from 'rocoui'
import routerMixin from '@/mixin/router'
import * as ORDER_TYPE from '@/store/types/order'
export default {
  components: {
    InfiniteLoading
  },
  mixins: [routerMixin],
  data() {
    return {
      lists: [],
      offset: 0,
      limit: 10,
      total: 0,
      isEmpty: false,
      defaultId: ''
    }
  },
  methods: {
    onInfinite: function() {
      axios
        .get(this.computedApi, {
          offset: this.offset,
          limit: this.limit
        })
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            if (res.data.data.rows.length) {
              this.total = res.data.data.total
              // 没有读取到默认id就遍历读取到的数组
              if (!this.defaultId) {
                res.data.data.rows.forEach((row) => {
                  if (row.isDefault === true) {
                    this.defaultId = row.id
                    return false
                  }
                })
              }
              this.lists = this.lists.concat(res.data.data.rows)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              this.offset += this.limit
              if (this.offset >= this.total) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
              this.isEmpty = false
            } else if (this.lists.length) {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            } else {
              this.isEmpty = true
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
            }
          } else {
            Toast.fail(res.data.message)
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        })
    },
    deleteHandler(address, index) {
      Modal.confirm({
        title: '删除此收货地址？',
        okText: '删除',
        cancelText: '取消',
        okCb: () => {
          let promise = axios
            .get(`/api/wap/memberAddress/${address.id}/delete`)
            .then((res) => {
              if (res.data.code === CODE_SUCCESS) {
                this.lists.splice(this.lists.indexOf(address), 1)
                if (this.lists.length === 0) {
                  this.isEmpty = true
                  if (this.$route.name === 'OrderAddressList') {
                    this.$store.commit(ORDER_TYPE.ORDER_SET_HAS_ADDRESS, false)
                  }
                }
                if (this.$route.name === 'OrderAddressList') {
                  if (this.address && this.address.id === address.id) {
                    this.$store.commit(ORDER_TYPE.ORDER_SET_ADDRESS, null)
                  }
                }
                Toast.success('删除成功')
              }
            })
          Toast.loading('正在删除', promise)
        }
      })
    },
    defaultHandler(address, index, event) {
      if (!address.isDefault) {
        let promise = axios
          .get(`/api/wap/memberAddress/${address.id}/default`)
          .then((res) => {
            if (res.data.code === CODE_SUCCESS) {
              this.defaultId = address.id
              address.isDefault = true
            }
          })
          .catch(() => {
            address.isDefault = false
          })
        Toast.loading('设置默认地址', promise)
      }
    },
    selectHandler(address) {
      // 只在CartAddressList路由下起作用
      // 设置到store中的address 的isdefault无效
      if (this.$route.name === 'OrderAddressList') {
        this.$store.commit(ORDER_TYPE.ORDER_SET_ADDRESS, address)
        this.$router.back()
      }
    }
  },
  computed: {
    ...mapState({
      address: (state) => state.order.address
    }),
    computedApi() {
      return '/api/wap/memberAddress'
    },
    computedIsOrder() {
      return this.$route.name === 'OrderAddressList'
    },
    computedTitle() {
      return this.computedIsOrder ? '选择地址' : '我的地址'
    },
    computedAddRouter() {
      return { name: `${this.$route.meta.suffix}AddressAdd` }
    },
    computedEditRouterName() {
      return `${this.$route.meta.suffix}AddressEdit`
    }
  }
}
</script>

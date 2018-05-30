<template>
  <nav :class="classObj" class="bar bar-tab">
    <a href="javascript:;" class="bar-item" :class="{'_active': isIndex}" @click='changePage("index.html")'>
      <span class="tab-icon">
        <svg class="svg-home">
          <use xlink:href="#svg-home" />
        </svg>
        <span class="tab-text">首页</span>
      </span>
    </a>
    <a href="javascript:;" class="bar-item" :class="{'_active': isCommunity}" @click='changePage("community.html")'>
      <span class="tab-icon">
        <svg class="svg-community">
          <use xlink:href="#svg-community" />
        </svg>
        <span class="tab-text">社群</span>
      </span>
    </a>
    <a href="javascript:;" class="bar-item" :class="{'_active': isVip}" @click='changePage("vip.html")'>
      <span class="tab-icon">
        <svg class="svg-vip">
          <use xlink:href="#svg-vip" />
        </svg>
        <span class="tab-text">VIP会员</span>
      </span>
    </a>
    <a href="javascript:;" class="bar-item bar-cart" :class="{'_active': isCart, 'scale':numChange}" @click='changePage("cart.html")'>
      <span class="tab-icon">
        <svg class="svg-cart">
          <use xlink:href="#svg-cart" />
        </svg>
        <span class="tab-text">购物车</span>
      </span>
      <span class="badge" v-if="cartQuantity > 0">{{cartNum}}</span>
    </a>
    <a href="javascript:;" class="bar-item" :class="{'_active': isUser}" @click='changePage("user.html")'>
      <span class="tab-icon">
        <svg class="svg-mine">
          <use xlink:href="#svg-mine" />
        </svg>
        <span class="tab-text">我的</span>
      </span>
    </a>
  </nav>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
import NavType from '@/constants/navType'
export default {
  props: {
    type: {
      type: String,
      required: true
    },
    bottom: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      numChange: false,
      numChangeTimer: null
    }
  },
  computed: {
    ...mapState({
      cartQuantity: (state) => state.cart.quantity
    }),
    cartNum() {
      return this.cartQuantity > 99 ? '99+' : this.cartQuantity
    },
    isIndex() {
      return this.type === NavType.INDEX
    },
    isCommunity() {
      return this.type === NavType.COMMUNITY
    },
    isVip() {
      return this.type === NavType.VIP
    },
    isCart() {
      return this.type === NavType.CART
    },
    isUser() {
      return this.type === NavType.USER
    },
    classObj() {
      return { 'bar-absolute-bottom': this.bottom }
    }
  },
  methods: {
    changePage(href) {
      window.location.href = href
    }
  }
}
</script>


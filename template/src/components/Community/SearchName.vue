<template>
  <div class="popup-add-product-name _in">
    <div class="bar bar-nav _border">
      <a href="javascript:;" class="bar-item item-arrow" @click="$emit('filterBack')">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{isName ? '请填写商品名称' : '请填写功效'}}</div>
    </div>

    <form action="" class="form-normal" @submit.prevent="back">
      <div class="input-cloumn">
        <div class="item-input">
          <input type="text" placeholder="请填写商品名称" :maxlength="50" v-model="comName" v-if="isName" ref="nameInput">
          <!-- <textarea placeholder="请填写功效" v-model="effect" v-else ></textarea> -->
          <input type="text" placeholder="请填写功效" :maxlength="100" v-model="comEffect" v-else />
        </div>
        <a href="javascript:;" class="btn-normal  btn-lg _solid" :class="isOk ? ' btn-primary' : ''" @click="back">确定</a>
      </div>
      <div class="list-search-result">
        <div class="item" v-for="items in lists" :key="items.id" @click="selectName(items)">
          {{items.name}}
        </div>
      </div>

    </form>
  </div>
</template>

<script type="text/ecmascript-6">
import CODE_SUCCESS from '@/constants/responseCode'
import axios from 'axios'
// import { Toast } from 'rocoui'
export default {
  props: {
    isName: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ''
    },
    effect: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      skuId: '',
      comName: this.name, // 组件的name
      comEffect: this.effect, // 组件的effect
      lists: [] // 查询出来的列表
    }
  },
  mounted() {

  },
  methods: {
    back() {
      if (!this.isOk) {
        return false
      }
      if (this.comName && this.comName.trim() === '' && this.isName) {
        return false
      }
      if (this.comEffect && this.comEffect.trim() === '' && !this.isName) {
        return false
      }
      this.$emit('filterBack', {
        name: this.comName,
        effect: this.comEffect,
        skuId: this.skuId
      })
    },
    selectName(val) {
      this.comName = val.name
      this.comEffect = val.subtitle
      this.skuId = val.id
    }
  },
  computed: {
    isOk() {
      if (this.isName && this.comName.trim() !== '') {
        return true
      } else if (!this.isName && this.comEffect.trim() !== '') {
        return true
      }
      return false
    }
  },
  watch: {
    comName(val) {
      this.$refs.nameInput.style.display = 'block'
      if (this.isName && val) {
        this.lists = []
        axios.get('/api/wap/product/getSkus?limit=50&keyword=' + val).then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            this.lists = res.data.data.rows
          }
        })
      } else if (this.isName && !val) {
        this.lists = []
      }
    }
  }
}
</script>


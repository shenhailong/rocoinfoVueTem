<template>
  <div class="wrap wrap-add-invoice">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">填写发票类型</div>
    </div>
    <div class="content">
      <form @submit.prevent="submitHandler" class="form-normal form-add-invoice">
        <div class="input-cloumn border-no">
          <div class="item-label item-label-special">
            发票类型
          </div>
          <div class="item-input">
            <span class="text">电子普通发票</span>
          </div>
        </div>
        <div class="space-20"></div>
        <div class="input-cloumn input-cloumn-tag">
          <div @click="typeHandler(NONE)" :class="classNONE" class="tag tag-xl">不要发票</div>
          <div @click="typeHandler(PERSONAGE)" :class="classPERSONAGE" class="tag tag-xl">个人</div>
          <div @click="typeHandler(COMPANY)" :class="classCOMPANY" class="tag tag-xl">单位</div>
        </div>
        <div v-show="computedPersonage">
          <div class="input-cloumn">
            <div class="item-label ">
              <em>*</em>发票抬头
            </div>
            <div class="item-input">
              <span class="text">个人</span>
            </div>
          </div>
          <div class="input-cloumn">
            <div class="item-label">
              发票内容
            </div>
            <div class="item-input">
              <span class="text">商品明细</span>
            </div>
          </div>
          <div class="input-cloumn">
            <div class="item-label">
              发票金额
            </div>
            <div class="item-input">
              <span class="text">￥{{$route.query.money}}</span>
            </div>
          </div>
          <div class="input-cloumn border-no">
            <div class="input-text-state">保税区商品不可开发票，发票金额不含保税区商品</div>
          </div>
          <div class="space-20"></div>
          <div class="input-cloumn">
            <div class="item-label">
              <em>*</em>收票邮箱
            </div>
            <div class="item-input">
              <input v-model.trim="personageForm.mail" type="text" placeholder="请输入邮箱">
            </div>
          </div>
        </div>
        <div v-show="computedCompany">
          <div class="input-cloumn">
            <div class="item-label ">
              <em>*</em>发票抬头
            </div>
            <div class="item-input">
              <input v-model.trim="form.invoiceHeader" maxlength="50" type="text" placeholder="请输入单位名称">
            </div>
            <svg @click="arrowHandler" :class="classArrow" class="svg-arrow">
              <use xlink:href="#svg-arrow" />
            </svg>
          </div>
          <div v-show="listVisible" class="list-search-result">
            <div v-for="invoice in list" :key="invoice.id" @click="invoiceHandler(invoice)" class="item">
              {{invoice.invoiceHeader}}
            </div>
          </div>
          <div v-show="computedCompany" class="input-cloumn">
            <div class="item-label">
              <em>*</em>发票税号
            </div>
            <div class="item-input">
              <input v-model.trim="form.taxNo" maxlength="50" type="text" placeholder="请输入纳税人识别码">
            </div>
          </div>
          <div class="input-cloumn">
            <div class="item-label">
              发票内容
            </div>
            <div class="item-input">
              <span class="text">商品明细</span>
            </div>
          </div>
          <div class="input-cloumn">
            <div class="item-label">
              发票金额
            </div>
            <div class="item-input">
              <span class="text">￥{{$route.query.money}}</span>
            </div>
          </div>
          <div class="input-cloumn border-no">
            <div class="input-text-state">保税区商品不可开发票，发票金额不含保税区商品</div>
          </div>
          <div class="space-20"></div>
          <div class="input-cloumn">
            <div class="item-label">
              <em>*</em>收票邮箱
            </div>
            <div class="item-input">
              <input v-model.trim="form.mail" type="text" placeholder="请输入邮箱">
            </div>
          </div>
        </div>
        <div class="button-block">
          <button :disabled="submitting" :class="computedBtnClass" class="btn-normal _solid btn-xxl">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import axios from '@/configs/axios'
import CODE_SUCCESS from '@/constants/responseCode'
import { Toast } from 'rocoui'
import routerMixin from '@/mixin/router'
import * as ORDER_TYPE from '@/store/types/order'
import validators from '@/validators'
import { NONE, PERSONAGE, COMPANY } from '@/constants/invoiceType'
import { mapState } from 'vuex'
export default {
  mixins: [routerMixin],
  data() {
    return {
      PERSONAGE,
      COMPANY,
      NONE,
      personageForm: {
        id: '',
        memberId: '',
        type: PERSONAGE,
        invoiceHeader: '个人',
        mail: ''
      },
      form: {
        id: '',
        memberId: '',
        type: COMPANY,
        invoiceHeader: '',
        taxNo: '',
        mail: ''
      },
      list: null,
      listVisible: false,
      type: NONE,
      submitting: false
    }
  },
  created() {
    this.type = this.invoiceType || NONE
    this.fetchList(this.type)
  },
  methods: {
    fetchList(type) {
      if (type === PERSONAGE && !this.personageForm.id) {
        let promise = axios
          .get(`/api/wap/invoices/${type}/findByType`)
          .then((res) => {
            if (res.data.code === CODE_SUCCESS && res.data.data) {
              if (res.data.data.length > 0) {
                const invoice = res.data.data[0]
                this.personageForm = { ...invoice }
              }
            }
          })
        Toast.loading('正在加载', promise)
      } else if (type === COMPANY && !this.list) {
        let promise = axios
          .get(`/api/wap/invoices/${type}/findByType`)
          .then((res) => {
            if (res.data.code === CODE_SUCCESS) {
              if (this.invoice && this.type === this.invoiceType) {
                this.form = { ...this.invoice }
              }
              this.list = res.data.data
            }
          })
        Toast.loading('正在加载', promise)
      }
    },
    submitHandler() {
      if (this.computedNone) {
        this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE, null)
        this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE_TYPE, NONE)
        this.$router.back()
      } else if (this.computedPersonage) {
        if (!validators.email(this.personageForm.mail)) {
          Toast.info('请填写正确邮箱格式', 1, null, false)
          return false
        }
        this.submitting = true
        let promise = axios
          .post('/api/wap/invoices/edit', { ...this.personageForm })
          .then((res) => {
            if (res.data.code === CODE_SUCCESS) {
              this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE, {
                ...this.personageForm
              })
              this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE_TYPE, this.type)
              this.$router.back()
            }
          })
          .finally(() => {
            this.submitting = false
          })
        Toast.loading('正在保存', promise)
      } else if (this.computedCompany) {
        if (this.form.invoiceHeader === '') {
          Toast.info('请填写发票抬头', 1, null, false)
          return false
        }
        if (this.form.taxNo === '' && this.computedCompany) {
          Toast.info('请填写发票税号', 1, null, false)
          return false
        }
        if (!validators.email(this.form.mail)) {
          Toast.info('请填写正确邮箱格式', 1, null, false)
          return false
        }
        this.submitting = true
        let promise = axios
          .post('/api/wap/invoices/edit', { ...this.form })
          .then((res) => {
            if (res.data.code === CODE_SUCCESS) {
              this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE, { ...this.form })
              this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE_TYPE, this.type)
              this.$router.back()
            }
          })
          .finally(() => {
            this.submitting = false
          })
        Toast.loading('正在保存', promise)
      }
    },
    typeHandler(type) {
      // 同类型不响应
      if (this.type !== type) {
        this.type = type
        // this.$store.commit(ORDER_TYPE.ORDER_SET_INVOICE_TYPE, type)
        this.fetchList(type)
      }
    },
    arrowHandler() {
      this.listVisible = !this.listVisible
    },
    invoiceHandler(invoice) {
      this.form = { ...invoice }
    }
  },
  computed: {
    ...mapState({
      invoiceType: (state) => state.order.invoiceType,
      invoice: (state) => state.order.invoice
    }),
    computedBtnClass() {
      return {
        'btn-disabled': this.submitting,
        'btn-primary': !this.submitting
      }
    },
    computedNone() {
      return this.type === NONE
    },
    computedPersonage() {
      return this.type === PERSONAGE
    },
    computedCompany() {
      return this.type === COMPANY
    },
    classNONE() {
      return { 'tag-primary': this.computedNone }
    },
    classPERSONAGE() {
      return { 'tag-primary': this.computedPersonage }
    },
    classCOMPANY() {
      return { 'tag-primary': this.computedCompany }
    },
    classArrow() {
      return {
        _up: this.listVisible,
        _down: !this.listVisible
      }
    }
  }
}
</script>

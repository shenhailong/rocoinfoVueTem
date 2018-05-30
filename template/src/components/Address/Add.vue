<template>
  <div class="wrap wrap-add-adress">
    <div class="bar bar-nav _border bar-absolute-top">
      <a @click="routerBack" href="javascript:;" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{computedTitle}}</div>
    </div>
    <!--/.bar-nav-->
    <div class="content">
      <form @submit.prevent="submitHandler" class="form-normal form-add-address">
        <div class="input-cloumn">
          <div class="item-label">
            收货人
          </div>
          <div class="item-input">
            <input v-model.trim="form.receiverName" maxlength="30" type="text" placeholder="收货人姓名">
          </div>
        </div>
        <div class="input-cloumn">
          <div class="item-label">
            联系电话
          </div>
          <div class="item-input">
            <input v-model.trim="form.receiverMobile" maxlength="13" type="tel" placeholder="手机号码">
          </div>
        </div>
        <a @click="addressHandler" href="javascript:;" class="input-cloumn">
          <div class="item-label">
            所在地区
          </div>
          <div class="item-input">
            <input :class="{'disabled': computedAddress !== ''}" disabled type="text" :value="computedAddress" placeholder="选择所在城市">
            <PopupPicker v-if="pickerData" title="选择省市区" v-model="popupSelected" :visible.sync="pickerVisible" :cols="3" :data="pickerData"></PopupPicker>
          </div>
          <svg class="svg-arrow _right">
            <use xlink:href="#svg-arrow" />
          </svg>
        </a>
        <div class="input-cloumn flex-align-start">
          <div class="item-label">
            详细地址
          </div>
          <div class="item-input">
            <textarea v-model.trim="form.detail" maxlength="100" class="item-textarea" placeholder="小区/写字楼详细地址"></textarea>
          </div>

        </div>
        <div class="input-cloumn">
          <div class="item-label">
            <label class="label-checkbox">
              <input v-model="form.isDefault" value="1" type="checkbox" name="my-radio">
              <i class="icon icon-form-checkbox">icon</i>
              设为默认地址
            </label>
          </div>
        </div>
        <div class="button-block">
          <button :disabled="submitting" :class="computedBtnClass" class="btn-normal _solid btn-xxl">保存收货地址</button>
        </div>
      </form>
    </div>
  </div>

</template>
<script>
import axios from '@/configs/axios'
import routerMixin from '@/mixin/router'
import { PopupPicker, Toast } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
import * as ORDER_TYPE from '@/store/types/order'
export default {
  components: {
    PopupPicker
  },
  mixins: [routerMixin],
  data() {
    return {
      form: {
        id: '',
        receiverName: '',
        receiverMobile: '',
        detail: '',
        isDefault: ''
      },
      submitting: false,
      pickerVisible: false,
      pickerData: null,
      popupSelected: []
    }
  },
  created() {
    axios.get('static/data.json').then((res) => {
      this.pickerData = res.data
    })
    if (this.computedIsEdit) {
      this.fetchAddress()
    }
  },
  methods: {
    fetchAddress() {
      let promise = axios
        .get(`/api/wap/memberAddress/${this.$route.params.aid}/get`)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            let data = res.data.data
            this.form.id = data.id
            this.form.receiverName = data.receiverName
            this.form.receiverMobile = data.receiverMobile
            this.form.detail = data.detail
            this.form.isDefault = data.isDefault
            this.popupSelected.push({
              label: data.provinceLabel,
              value: data.provinceValue
            })
            this.popupSelected.push({
              label: data.cityLabel,
              value: data.cityValue
            })
            this.popupSelected.push({
              label: data.districtLabel,
              value: data.districtValue
            })
          }
        })
      Toast.loading('正在加载', promise)
    },
    submitHandler() {
      if (this.form.receiverName === '') {
        Toast.info('请填写收货人', 2, false)
        return false
      }
      if (this.form.receiverName.length > 30) {
        Toast.info('收货人内容不能超过30个字符', 2, false)
        return false
      }
      if (!/(^1[3|4|5|7|8|9][0-9]\d{8}$)/.test(this.form.receiverMobile)) {
        Toast.info('请填写正确手机格式', 2, false)
        return false
      }
      if (this.form.detail === '') {
        Toast.info('请填写详细地址', 2, false)
        return false
      }
      if (this.form.detail.length > 100) {
        Toast.info('详细地址不能超过100个字符', 2, false)
        return false
      }
      if (this.popupSelected.length < 3) {
        Toast.info('请选择所在城市', 2, false)
        return false
      }

      let data = { ...this.form }
      data.provinceValue = this.popupSelected[0].value
      data.provinceLabel = this.popupSelected[0].label
      data.cityValue = this.popupSelected[1].value
      data.cityLabel = this.popupSelected[1].label
      data.districtValue = this.popupSelected[2].value
      data.districtLabel = this.popupSelected[2].label
      this.submitting = true
      let promise = axios
        .post(this.computedApi, data)
        .then((res) => {
          if (res.data.code === CODE_SUCCESS) {
            // 订单新增地址路由并且马上使用为true的
            if (
              this.$route.name === 'OrderAddressAdd' &&
              this.$route.query.use === true
            ) {
              this.$store.commit(ORDER_TYPE.ORDER_SET_ADDRESS, res.data.data)
              this.$store.commit(ORDER_TYPE.ORDER_SET_HAS_ADDRESS, true)
            }
            Toast.success(
              '保存成功',
              2,
              () => {
                this.$router.back()
              },
              false
            )
          }
        })
        .finally(() => {
          this.submitting = false
        })
      Toast.loading('正在保存地址', promise)
    },
    addressHandler() {
      this.pickerVisible = true
    }
  },
  computed: {
    computedAddress() {
      let array = this.popupSelected.map((item) => {
        return item.label
      })
      return array.join(' ')
    },
    computedBtnClass() {
      return {
        'btn-disabled': this.submitting,
        'btn-primary': !this.submitting
      }
    },
    computedIsEdit() {
      return !!this.$route.params.aid
    },
    computedApi() {
      return this.computedIsEdit
        ? `/api/wap/memberAddress/modify`
        : `/api/wap/memberAddress/create`
    },
    computedTitle() {
      return this.computedIsEdit ? '编辑地址' : '新建地址'
    }
  }
}
</script>

<template>
  <div class="wrap wrap-logistics-info">
    <div class="bar bar-nav _border bar-absolute-top">
      <a href="javascript:;" @click="routerBack" class="bar-item item-arrow">
        <svg class="svg-arrow _left">
          <use xlink:href="#svg-arrow" />
        </svg>
      </a>
      <div class="bar-item">{{ $route.query.type === 'REFUNDED' ? '退款' : '售后' }}进度</div>
    </div>
    <!--/.bar-nav-->
    <!-- 售后进度-填写物流信息 -->
    <div class="content">
      <div class="logistics-info">
        <div class="item"><span class="text-grey-light">
          {{ $route.query.type === 'REFUNDED' ? '退款' : '售后' }}类型：</span>{{ progressInfo.type }}
        </div>
        <div class="item">{{ progressInfo.reason }}</div>
          <div class="media-multiple">
            <div class="item-media">
              <img v-if="progressInfo.imgs.length <= 0" src="static/images/m/img348x348.jpg" alt="商品图片">
              <img v-else v-for="(img, idx) in progressInfo.imgs" :key="idx" v-lazy="{
                  src: img.path ? img.path : 'static/images/m/img348x348.jpg',
                  loading: 'static/images/m/img348x348.jpg',
                  error: 'static/images/m/img348x348.jpg'
                }" alt="商品图片" class="lazy-img-fadein">
            </div>
          </div>
      </div>
      <div class="space-20"></div>
      <div class="steps-column">
        <div v-for="(item, index) in progressInfo.records" :key="index"
          class="item" :class="{'_current': index === progressInfo.records.length-1}">
          <div class="steps-time">
            <p>{{ item.optTime }}</p>
          </div>
          <div class="steps-icon">
            <div class="svg-wrap">
              <svg class="svg-check">
                <use xlink:href="#svg-check" />
              </svg>
            </div>
          </div>
          <div class="steps-text">
            <p v-if="index === 0 || index === 1">订单：{{ progressInfo.orderCode }}</p>
            <p v-html="item.optContent"></p>
          </div>
        </div>
      </div>
      <!-- /.steps-column -->
      <template v-if="progressInfo.express">
        <div class="logistics-info">
          <span class="item">上传物流信息</span>
        </div>
        <form action="" @submit.prevent="submitHandler" class="form-normal form-logistics">
          <div @click="visible = true" class="input-cloumn">
            <div class="item-input">
              <span class="text" :class="{'text-grey-light':!curLogistics.length}">
                {{ curLogistics.length ? curLogistics[0].label : '选择物流公司' }}
              </span>
            </div>
            <svg class="svg-arrow _down">
              <use xlink:href="#svg-arrow"></use>
            </svg>
            <PopupPicker v-if="logisticsCompanyInfo"
              title="选择物流公司" v-model="curLogistics" :visible.sync="visible" :cols="1"
              :data="logisticsCompanyInfo"></PopupPicker>
          </div>
          <div class="input-cloumn">
            <div class="item-input">
              <input type="text" v-model="transportNo" placeholder="填写快递单">
            </div>
          </div>
          <div class="button-block">
            <button v-if="transportNo.length > 0 && curLogistics.length" class="btn-normal btn-primary _solid btn-xxl">提交</button>
            <button type="button" v-else class="btn-normal _solid btn-xxl">提交</button>
          </div>
        </form>
      </template>
    </div>
    <!-- /.content -->
  </div>
  <!-- /.wrap -->
</template>

<script>
import routerMixin from '@/mixin/router'
import axios from '@/configs/axios'
import { PopupPicker, Toast } from 'rocoui'
import CODE_SUCCESS from '@/constants/responseCode'
export default {
  mixins: [routerMixin],
  data () {
    return {
      curOrderId: null,
      progressInfo: {
        imgs: []
      },
      visible: false,
      logisticsCompanyInfo: [], // 物流公司列表
      curLogistics: [],
      transportNo: ''
    }
  },
  components: {
    PopupPicker
  },
  created () {
    // 获取当前订单id
    this.curOrderId = this.$route.params.orderId
    // 获取售后进度
    this.getAfterSaleProgress()
  },
  methods: {
    // 获取售后进度
    getAfterSaleProgress () {
      let promise = axios.get(`/api/wap/aftersale/${this.curOrderId}/get`).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.progressInfo = res.data.data
          // 获取物流公司名称
          if (this.progressInfo.express) {
            this.getLogisticsCompany()
          }
        }
      })
      Toast.loading('加载中...', promise)
    },
    // 获取物流公司名称
    getLogisticsCompany () {
      axios.get(`/api/wap/express`).then(res => {
        if (res.data.code === CODE_SUCCESS) {
          this.logisticsCompanyInfo = res.data.data
          this.logisticsCompanyInfo.forEach(item => {
            item.value = item.id
            item.label = item.name
          })
        }
      })
    },
    // 提交物流信息
    submitHandler () {
      axios.post(`/api/wap/aftersale/${this.curOrderId}/express`,
      { expressId: this.curLogistics[0].value, transportNo: this.transportNo })
      .then(res => {
        if (res.data.code === CODE_SUCCESS) {
          Toast.success('提交成功', 2)
          // 再次获取售后进度
          this.getAfterSaleProgress()
        }
      })
    }
  }
}
</script>


<template>
  <canvas ref="canvas" class="swiper-note-canvas"></canvas>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: '填写商品名称'
    },
    effect: {
      type: String,
      default: '填写商品功效'
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      width: 0, // 画布实际宽度
      height: 0, // 画布实际高度
      context: null, // 🖌️
      ratio: 1, // 倍数
      defaultWidth: 750, // 宽度基准
      startX: 0, // canvas画图的开始起点x轴
      startY: 0, // canvas画图的开始起点Y轴
      minWidth: this.isEdit ? 170 : 50, // 文本最小宽度，用于动态设置横线长度和X关闭按钮位置
      maxWidth: 580, // 文本最大宽度，用于动态设置横线长度和X关闭按钮位置
      actualWidth: 0, // 实际最后算出的横线宽度
      actualNameWidth: 0, // 实际name的宽度 name下面的横线的长度要和name保持一样
      actuaEffectlWidth: 0 // 实际effect的宽度 effect下面的横线长度要和effect保持一样
    }
  },
  created() { },
  mounted() {
    let swiperContent = document.querySelector('.swiper-wrapper')
    // console.log(window.devicePixelRatio)
    this.$nextTick(() => {
      // 获取屏幕的宽度也就是外层swiperContent的宽度，就是为了获取canvas实际渲染的宽度
      // 获取swiperContent的高度，就是为了获取canvas实际渲染的高度
      this.width = window.screen.width
      this.height = swiperContent.offsetHeight
      this.ratio = (this.width * window.devicePixelRatio) / this.defaultWidth
      this.$refs.canvas.width = this.width * window.devicePixelRatio // 画布实际宽度和高度
      this.$refs.canvas.height = this.height * window.devicePixelRatio
      this.$refs.canvas.style.width = `${this.width}px` // 在浏览器中被渲染的高度和宽度
      this.$refs.canvas.style.height = `${this.height}px`
      let canvas = this.$refs.canvas
      let ctx = canvas.getContext('2d')
      this.context = ctx
      this.$refs.canvas.addEventListener('click', this.clickImg, false)
      this.drawCanvas()
    })
  },
  methods: {
    drawCanvas() {
      let startX = 50 * this.ratio // 50 是距离左侧的距离
      let startY = this.$refs.canvas.height - (60 * this.ratio) // 60 是距离下边的距离
      let radius = 10 * this.ratio // 半径
      this.startX = startX
      this.startY = startY
      this.context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      this.context.save()
      // 绘制标签的圆点
      this.context.globalAlpha = 0.5
      this.context.beginPath()
      // 外层黑色圆
      this.context.arc(startX, startY, radius * 2, 0, Math.PI * 2)
      this.context.fillStyle = 'black'
      this.context.strokeStyle = 'black'
      this.context.fill()
      this.context.stroke()
      /* -添加阴影效果为了如果是白色图片也可以看到文字- */
      this.context.shadowColor = 'rgba(0, 0, 0, 0.5)'
      // 将阴影向右移动2px，向上移动2px
      this.context.shadowOffsetX = 2
      this.context.shadowOffsetY = 2
      // 轻微模糊阴影
      this.context.shadowBlur = 10
      this.context.globalAlpha = 1
      this.context.beginPath()
      this.context.fillStyle = 'white'
      this.context.strokeStyle = 'white'

      // 必须先获取文本长度，计算需要的长度
      // 绘制标签文字
      // 字体大小按照20px计算
      let fontSize = 20 * this.ratio
      this.context.font = `bold ${fontSize}px 宋体`
      let measureNameWidth = this.context.measureText(this.name).width // 计算出canvas渲染出name的宽度，是小数
      let measureEffectWidth = this.context.measureText(this.effect).width // 计算出canvas渲染出effect的宽度，是小数
      let sName = this.name // 后面要用到，如果过长会截取
      let sEffect = this.effect // 后面要用到，如果过长会截取
      if (this.name === '') {
        sName = '填写商品名称'
      }
      if (this.effect === '') {
        sEffect = '填写商品功效'
      }
      if ((this.effect === '' || this.effect === '填写商品功效' || this.effect === undefined) && !this.isEdit) {
        sEffect = ''
      }
      let nameArray = this.name.split('') // 把name截取成数组，
      let effectArray = this.effect.split('') // 把effect截取成数组，
      let emptyName = '...' // 由于name后面过长会显示... 所以先计算在内
      let emptyEffect = '...' // 由于effect后面过长会显示... 所以先计算在内
      let nameCount = this.name.length // name的需要截取的位置
      let effectCount = this.effect.length // effect的需要截取的位置
      // 计算name横线
      if (measureNameWidth <= this.minWidth * this.ratio) {
        // 这里是name宽度都小于等于最小宽度的情况。name横线的长度度就是最小宽度
        this.actualNameWidth = this.minWidth * this.ratio + 25 * this.ratio
      } else if (measureNameWidth >= this.maxWidth * this.ratio) {
        // 这里是name的宽度大于最大宽度的情况，实际宽度就是最大宽度  （第一步先是确定宽度）
        // （第二步还要判断过长的还要截取）
        this.actualNameWidth = this.maxWidth * this.ratio
        let base = Math.round((this.actualNameWidth - 25 * this.ratio)) // 基础宽度是线的宽度 - 前面的空白
        // 如果name 过长
        // 一个一个加起来去判断直到匹配到
        for (let i = 0; i < nameArray.length; i++) {
          emptyName += nameArray[i]
          let min = Math.round(this.context.measureText(emptyName).width) - fontSize // 由于计算出的是小数，不精确，所以先取整，再给一个一个字体大小的范围区间，
          let max = Math.round(this.context.measureText(emptyName).width) + fontSize
          if (min <= base && base <= max) {
            nameCount = i // 找到需要截取的位置
            break
          }
        }
        sName = this.name.slice(0, nameCount) + '...'
      } else {
        this.actualNameWidth = measureNameWidth + 25 * this.ratio
      }

      // 计算effect横线
      if (measureEffectWidth <= this.minWidth * this.ratio) {
        // 这里是effect宽度小于等于最小宽度的情况。effect横线的长度就是最小宽度
        // 详情的情况，为0这时不画横线
        this.actuaEffectlWidth = (!this.isEdit && measureEffectWidth === 0) ? 0 : (this.minWidth * this.ratio + 25 * this.ratio)
      } else if (measureEffectWidth >= this.maxWidth * this.ratio) {
        // 这里是effect的宽度大于最大宽度的情况，effect实际宽度就是最大宽度  （第一步先是确定宽度）
        // （第二步还要判断过长的还要截取）
        this.actuaEffectlWidth = this.maxWidth * this.ratio
        let base = Math.round((this.actuaEffectlWidth - 25 * this.ratio)) // 基础宽度是线的宽度 - 前面的空白
        // 如果name 过长
        // 一个一个加起来去判断直到匹配到
        for (let i = 0; i < effectArray.length; i++) {
          emptyEffect += effectArray[i]
          let min = Math.round(this.context.measureText(emptyEffect).width) - fontSize
          let max = Math.round(this.context.measureText(emptyEffect).width) + fontSize
          if (min <= base && base <= max) {
            effectCount = i
            break
          }
        }
        sEffect = this.effect.slice(0, effectCount) + '...'
      } else {
        this.actuaEffectlWidth = measureEffectWidth + 25 * this.ratio
      }

      this.context.fillText(sName, startX + 25 * this.ratio, startY - 60 * this.ratio)
      this.context.fillText(sEffect, startX + 25 * this.ratio, startY - 10 * this.ratio)

      // 画线
      this.context.lineWidth = 2 * this.ratio
      // 画name的竖线
      this.context.moveTo(startX, startY)
      this.context.lineTo(startX, startY - 50 * this.ratio)
      // 画name的横线
      this.context.moveTo(startX, startY - 50 * this.ratio)
      this.context.lineTo(startX + this.actualNameWidth, startY - 50 * this.ratio)
      // 画功效的横线
      this.context.moveTo(startX, startY)
      this.context.lineTo(startX + this.actuaEffectlWidth, startY)

      // 画X 详情页面不用
      if (this.isEdit) {
        this.context.moveTo(startX + this.actualNameWidth, startY - 75 * this.ratio)
        this.context.lineTo(startX + (this.actualNameWidth / this.ratio + 25) * this.ratio, startY - 100 * this.ratio)

        this.context.moveTo(startX + this.actualNameWidth, startY - 100 * this.ratio)
        this.context.lineTo(startX + (this.actualNameWidth / this.ratio + 25) * this.ratio, startY - 75 * this.ratio)
      }


      this.context.fill()
      this.context.stroke()
      // 内层白色圆
      this.context.globalAlpha = 1
      this.context.beginPath()
      this.context.arc(startX, startY, radius, 0, Math.PI * 2)
      this.context.fillStyle = 'white'
      this.context.strokeStyle = 'white'
      this.context.fill()
      this.context.stroke()
      this.context.restore()
    },
    clickImg(e) {
      // 从上到下 数值越大
      let offsetX = e.offsetX * window.devicePixelRatio
      let offsetY = e.offsetY * window.devicePixelRatio
      let ratio = this.ratio
      if (offsetX >= this.startX && offsetX <= this.startX + this.actualNameWidth && offsetY >= this.startY - 50 * ratio - 50 * ratio && offsetY <= this.startY - 50 * ratio) {
        // console.log('点中了名称')
        this.$emit('searchName', true)
      }

      if (offsetX >= this.startX && offsetX <= this.startX + this.actuaEffectlWidth && offsetY >= this.startY - 50 * ratio && offsetY <= this.startY) {
        // console.log('点中了功效')
        this.$emit('searchName', false)
      }

      if (offsetX >= this.startX + this.actualNameWidth && offsetX <= this.startX + this.actualNameWidth + 25 * ratio && offsetY >= this.startY - 50 * ratio - 25 * ratio - 25 * ratio && offsetY <= this.startY - 50 * ratio - 25 * ratio) {
        // console.log('点中了X')
        this.$emit('removeLabel')
      }
    }
  },
  beforeDestroy() {
    this.$refs.canvas.removeEventListener('click', this.clickImg)
  },
  watch: {
    name(val) {
      this.drawCanvas()
    },
    effect(val) {
      this.drawCanvas()
    }
  }
}
</script>


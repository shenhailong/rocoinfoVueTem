<template>
  <canvas v-once ref="canvas" class="swiper-note-canvas"></canvas>
</template>
<script>
import {isIOS, isAndroid} from '@/utils/env'

// function randomFromTo(from, to) {
//   return Math.floor(Math.random() * (to - from + 1) + from)
// }
function Label(x, y, radius, color, text) {
  this.x = x // 坐标X
  this.y = y // 坐标Y
  this.radius = radius // 半径
  this.color = color // 颜色
  this.isSelected = false // 是否是当前选中，拖动标签时用
  this.text = text // 标签文字
}

// 键值对Dictionary
function Dictionary() {
  this.data = []
  this.put = function(key, value) {
    this.data[key] = value
  }
  this.get = function(key) {
    return this.data[key]
  }
}

var images = new Dictionary()

export default {
  data() {
    return {
      width: 0,
      height: 0,
      currentimgsrc: null,
      flag: null,
      images: [],
      context: null,
      ratio: 1,
      defaultWidth: 750
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      if(isIOS){
        this.width = window.screen.width * window.devicePixelRatio
        this.height = window.screen.width * window.devicePixelRatio
        this.$refs.canvas.width = this.width
        this.$refs.canvas.height = this.width
        this.ratio = (this.width) / this.defaultWidth
      }else if(isAndroid){
        this.width = window.screen.width
        this.height = window.screen.width
        this.$refs.canvas.width = this.width * window.devicePixelRatio
        this.$refs.canvas.height = this.width * window.devicePixelRatio
        this.ratio = (this.width * window.devicePixelRatio) / this.defaultWidth
      }

      this.$refs.canvas.style.width = `${this.width}px`
      this.$refs.canvas.style.height = `${this.height}px`

      let canvas = this.$refs.canvas
      let ctx = canvas.getContext('2d')
      this.context = ctx
      this.$refs.canvas.addEventListener('click', this.clickImg, false)
    })
  },
  methods: {
    drawCanvas() {
      this.context.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)

      this.context.save()
      for (var i = 0; i < images.get(this.flag).length; i++) {
        var onelabel = images.get(this.flag)[i]
        // 绘制标签的圆点
        this.context.globalAlpha = 0.5
        this.context.beginPath()

        this.context.arc(onelabel.x, onelabel.y, onelabel.radius + 10, 0, Math.PI * 2)
        this.context.fillStyle = 'black'
        this.context.strokeStyle = 'black'
        this.context.fill()
        this.context.stroke()

        this.context.globalAlpha = 1
        this.context.beginPath()
        this.context.arc(onelabel.x, onelabel.y, onelabel.radius, 0, Math.PI * 2)
        this.context.fillStyle = onelabel.color
        this.context.strokeStyle = 'white'
        this.context.fill()
        this.context.stroke()
        // 选中的标签变粗，以便区分(标签拖动)
        if (onelabel.isSelected) {
          this.context.lineWidth = 2 * this.ratio
        } else {
          this.context.lineWidth = 1 * this.ratio
        }
        // 绘制圆点与文字之间的折线
        this.context.moveTo(onelabel.x, onelabel.y)
        this.context.lineTo(onelabel.x + 15 * this.ratio, onelabel.y - 20 * this.ratio)
        this.context.moveTo(onelabel.x + 15 * this.ratio, onelabel.y - 20 * this.ratio)
        this.context.lineTo(onelabel.x + 30 * this.ratio, onelabel.y - 20 * this.ratio)
        this.context.fill()
        this.context.stroke()
        // 绘制标签文字
        this.context.font = isIOS ? `bold ${20 * this.ratio}px 宋体` : `bold ${20 * this.ratio}px 宋体`
        this.context.fillText(onelabel.text, onelabel.x + 33 * this.ratio, onelabel.y - 15 * this.ratio)
      }
      this.context.restore()
    },
    addLabel(e) {
      var radius = 10
      // sidelength是canvas的边长(canvas是个正方形)
      if(isIOS){
        var x = e.offsetX
        var y = e.offsetY
      }else {
        x = e.offsetX * window.devicePixelRatio
        y = e.offsetY * window.devicePixelRatio
      }

      // var x = randomFromTo(0, this.$refs.canvas.width - 30 * this.ratio)
      // var y =  randomFromTo(0, this.$refs.canvas.width - 30 * this.ratio)
      var text = '唇部护理,唇妆,彩妆,唇膏/口红,口红'
      // 创建一个新标签
      var lab = new Label(x, y, radius, 'white', text)

      // 把它保存在数组中
      if (images.get(this.flag) === undefined) {
        // 还记得前面的flag变量吧
        var a = []
        a.push(lab)
        images.put(this.flag, a)
      } else {
        images.get(this.flag).push(lab)
      }
      // 重新绘制画布
      this.drawCanvas()
    },
    clickImg(e) {
      console.log(e)
      // 全局变量，记录当前操作的图片src
      // this.currentimgsrc = e.target.src
      // 全局变量，记录当前操作的图片顺序标识
      this.flag = 'aa'
      // 核心方法，将所选图片及其所有标签绘到①区
      // this.drawCanvas()
      this.addLabel(e)
    }
  },
  beforeDestroy(){
    this.$refs.canvas.removeEventListener('click', this.clickImg)
  }
}
</script>


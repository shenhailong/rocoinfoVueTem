<template>
  <!--
      注意：
      当标签列表超过两行时是隐藏状态，需要展开列表的时候，
      请在content-block-title后加class[switch-shrink]
     -->
  <div class="filter-box wrap-flex-column">
    <div class="content-column">
      <div class="filter-column" v-if="catalogs&&catalogs.length">
        <div class="content-block-title switch-shrink">
          <div class="title">分类</div>
          <!-- 大于6个显示 -->
          <div v-if="catalogs.length>6" @click="toggle('catalogsSvg')">
            {{catalogsSvg==='_up'?'收起':'展开'}}
            <svg class="svg-triangle" :class="catalogsSvg">
              <use xlink:href="#svg-triangle" />
            </svg>
          </div>
        </div>
        <!-- /.content-block-title -->
        <div class="tag-block columns3">
          <!-- 下标 小于6 或者  大于5并且是展开状态显示 -->
          <span class="tag tag-lg _ellipsis" v-for="(item,index) in catalogs" :class="{_active:item.active}" :key="item.id" @click="toggleTag(item)" v-show="index<6||(index>5&&catalogsSvg==='_up')">{{item.name}}</span>
        </div>
        <!-- /.tag-block -->
      </div>
      <!-- /.filter-column -->
      <div class="filter-column" v-if="useGroups&&useGroups.length">
        <div class="content-block-title switch-shrink">
          <div class="title">使用人群</div>
          <!-- 大于6个显示 -->
          <div v-if="useGroups.length>6" @click="toggle('useSvg')">
            {{useSvg==='_up'?'收起':'展开'}}
            <svg class="svg-triangle" :class="useSvg">
              <use xlink:href="#svg-triangle" />
            </svg>
          </div>
        </div>
        <!-- /.content-block-title -->
        <div class="tag-block columns3">
          <!-- 下标 小于6 或者  大于5并且是展开状态显示 -->
          <span class="tag tag-lg _ellipsis" v-for="(item,index) in useGroups" :class="{_active:item.active}" :key="index" @click="toggleTag(item)" v-show="index<6||(index>5&&useSvg==='_up')">{{item.name}}</span>
        </div>
        <!-- /.tag-block -->
      </div>
      <!-- /.filter-column -->
      <div class="filter-column" v-if="tags&&tags.length">
        <div class="content-block-title">
          <div class="title">功效</div>
          <!-- 大于6个显示 -->
          <div v-if="tags.length>6" @click="toggle('effectSvg')">
            {{effectSvg==='_up'?'收起':'展开'}}
            <svg class="svg-triangle" :class="effectSvg">
              <use xlink:href="#svg-triangle" />
            </svg>
          </div>
        </div>
        <!-- /.content-block-title -->
        <div class="tag-block columns3">
          <!-- 下标 小于6 或者  大于5并且是展开状态显示 -->
          <span class="tag tag-lg _ellipsis" v-for="(item,index) in tags" :class="{_active:item.active}" :key="index" @click="toggleTag(item)" v-show="index<6||(index>5&&effectSvg==='_up')">{{item.name}}</span>
        </div>
        <!-- /.tag-block -->
      </div>
      <!-- /.filter-column -->
    </div>

    <div class="bar bar-button bar-absolute-bottom">
      <a class="flex-item btn-normal _solid" href="javascript:;" @click="reset">重置</a>
      <!-- 做筛选 -->
      <a class="flex-item btn-normal _solid btn-primary" href="javascript:;" @click="$emit('doFilter')">确定</a>
      <!-- <button class="btn-normal btn-primary _solid btn-xxl">下一步</button> -->
    </div>
    <!--/.bar-button -->
  </div>
</template>
<script>
export default {
  props: ['catalogs', 'useGroups', 'tags'],
  data() {
    return {
      catalogsSvg: '_down',
      useSvg: '_down',
      effectSvg: '_down'
    }
  },
  methods: {
    // 收起展开
    toggle(key) {
      if (this[key] === '_up') {
        this[key] = '_down'
      } else {
        this[key] = '_up'
      }
    },
    // toggle标签选中
    toggleTag(item) {
      item.active = !item.active
    },
    // 重置
    reset() {
      ['catalogs', 'useGroups', 'tags'].forEach(key => {
        this[key] && this[key].forEach(item => {
          item.active = false
        })
      })
    }
  }
}
</script>

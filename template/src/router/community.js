import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/community/Index'
import Search from '@/pages/community/Search'
import SearchResult from '@/pages/community/SearchResult'
import TopicDetail from '@/pages/community/TopicDetail'
import PersonalUser from '@/pages/community/PersonalUser'
import EditTopic from '@/pages/community/EditTopic'
import AddLabel from '@/pages/community/AddLabel'
import Comment from '@/pages/community/Comment'
import FocusAuthor from '@/pages/community/FocusAuthor'
import PersonalOthers from '@/pages/community/PersonalOthers'
import EditDraft from '@/pages/community/EditDraft'
Vue.use(Router)

export default new Router({
  routes: [
    // { path: '/', redirect: '/Index' },
    // { path: '*', redirect: '/Index' },
    {
      path: '/Index',
      name: 'Index',
      component: Index,
      meta: { index: 1 }
    },
    {
      path: '/FocusAuthor',
      name: 'FocusAuthor',
      meta: { index: 1 },
      component: FocusAuthor
    },
    {
      path: '/Index/Search',
      name: 'Search',
      meta: { index: 2 },
      component: Search
    },
    {
      path: '/Index/Search/SearchResult',
      name: 'SearchResult',
      meta: { index: 3 },
      component: SearchResult
    },
    {
      path: '/Index/topicDetail', // 详情页面
      name: 'TopicDetail',
      meta: { index: 4 },
      component: TopicDetail
    },
    {
      path: '/Index/topicDetail/comment', // 评论/回复
      name: 'Comment',
      meta: { index: 5 },
      component: Comment
    },
    {
      path: '/Index/EditTopic',
      name: 'EditTopic',
      meta: { index: 2 },
      component: EditTopic
    },
    {
      path: '/Index/EditTopic/AddLabel',
      name: 'AddLabel',
      meta: { index: 3 },
      component: AddLabel
    },
    {
      path: '/Index/personalOthers', // 他人个人主页
      name: 'PersonalOthers',
      meta: { index: 5 },
      component: PersonalOthers
    },
    {
      path: '/Index/personalUser', // 当前用户个人主页
      name: 'PersonalUser',
      meta: { index: 5 },
      component: PersonalUser
    },
    {
      path: '/Index/personalUser/editDraft', // 编辑草稿
      name: 'EditDraft',
      meta: { index: 6 },
      component: EditDraft
    }
  ]
})

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/Index')
const Question = () => import('@/views/question/Index')
const Video = () => import('@/views/video/Index')
const User = () => import('@/views/user/Index')
const UserProfile = () => import('@/views/user/Profile')
const UserChat = () => import('@/views/user/Chat')
const Login = () => import('@/views/user/Login')
const Search = () => import('@/views/search/Index')
const SearchResult = () => import('@/views/search/Result')
const Article = () => import('@/views/home/Article')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  component: Layout,
  children: [{
    path: '/',
    name: 'home',
    component: Home,
    meta: { keepAlive: true }
  },
  {
    path: '/question',
    name: 'question',
    component: Question
  },
  {
    path: '/video',
    name: 'video',
    component: Video
  },
  {
    path: '/user',
    name: 'user',
    component: User
  }
  ]
},
{
  path: '/user/profile',
  name: 'user-profile',
  component: UserProfile
},
{
  path: '/user/chat',
  name: 'user-chat',
  component: UserChat
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/search',
  name: 'search',
  component: Search
},
{
  path: '/search/result',
  name: 'search-result',
  component: SearchResult
},
{
  path: '/article',
  name: 'article',
  component: Article,
  meta: { keepAlive: true }
}
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // eslint-disable-next-line no-unused-vars
  const { info } = store.state

  if (!info.token && to.path.startsWith('/user')) {
    next({ path: '/login', query: { 'redirect': to.path } })
  }
  next()
})
export default router

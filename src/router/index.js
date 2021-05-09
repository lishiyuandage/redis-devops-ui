import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 导入page
const About = () => import('../views/about/Index.vue')
const Database = () => import('../views/database/Index.vue')
const Redis = () => import('../views/redis/Index.vue')

// 路由
const routes = [
  {
    path: '',
    redirect: { name: 'Database' }
  },
  {
    path: '/database',
    name: 'Database',
    component: Database
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/redis',
    name: 'Redis',
    component: Redis
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

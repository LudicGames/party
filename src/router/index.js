import Vue from 'vue'
import Router from 'vue-router'
import GamePage from '@/pages/GamePage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GamePage',
      component: GamePage
    }
  ]
})

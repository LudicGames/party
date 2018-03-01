// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import Ludic from 'ludic'
import LudicVue from 'ludic-vue'
import {Box2D} from 'ludic-box2d'

Vue.config.productionTip = false
Vue.use(LudicVue)

/* eslint-disable no-new */

Box2D.then(()=>{
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })
})

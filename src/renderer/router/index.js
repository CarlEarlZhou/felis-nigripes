import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/AddFile',
      name: 'add-file',
      component: require('@/components/AddFile').default
    },
    {
      path: '/EditTag',
      name: 'edit-tag',
      component: require('@/components/EditTag').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

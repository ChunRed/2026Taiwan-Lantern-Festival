import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import IntroView from '../views/IntroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'normal',
      component: IntroView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/intro',
      name: 'intro',
      component: IntroView,
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/LibraryView.vue'),
    },
    {
      path: '/gen-choose',
      name: 'gen-choose',
      component: () => import('../views/Gen-chooseVeiw.vue'),
    },

    {
      path: '/practice',
      name: 'practice',
      component: () => import('../views/PracticeView.vue'),
    },

    {
      path: '/lineinfo',
      name: 'lineinfo',
      component: () => import('../views/LineInfoView.vue'),
    },

    {
      path: '/information',
      name: 'information',
      component: () => import('../views/DeerInformationView.vue'),
    },

    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/404View.vue') },


  ],
})

export default router

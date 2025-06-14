import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect:'/main/home'
    },
    {
      path:'/main',
      component:()=>import('@/layout/index.vue'),
      children:[
        {
          name:'Home',
          path:'home',
          component:()=>import('@/pages/home.vue')
        },
        {
          name:'ImageSortRename',
          path:'image-sort-rename',
          component:()=>import('@/pages/image-sort-rename.vue')
        }
      ]
    }
  ],
})
export default router;
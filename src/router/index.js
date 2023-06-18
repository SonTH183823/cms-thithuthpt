import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'
import LayoutChild from '@/layout/layout-child'
import config from "@/utils/config"

Vue.use(Router)

const baseRouter = [
  {
    path: '/',
    redirect: '/dashboard',
    component: Layout,
    children: [{
      path: 'dashboard',
      name: 'Trang chủ',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Trang chủ',
        icon: 'dashboard',
      },
    }]
  },
  {
    path: '/', component: Layout, children: [{
      path: '/nguoi-dung-cms',
      name: 'Người dùng cms',
      component: () => import('@/views/system/user/index'),
      meta: { title: 'Người dùng CMS', icon: 'user', authorize: [config.roleConfig.ADMIN] },
    }]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  {
    path: '/quan-ly-tin-tuc',
    component: Layout,
    meta: {
      title: 'Quản lý tin tức',
      icon: 'el-icon-tickets',
      authorize: [config.roleConfig['NEWS']]
    },
    children: [{
      path: 'loai-tin-tuc',
      name: 'Loại tin tức',
      component: () => import('@/views/manageNews/newsType/index'),
      meta: {
        title: 'Loại tin tức',
        icon: 'el-icon-tickets',
        authorize: [config.roleConfig['NEWS']]
      },
    }, {
      path: 'tags',
      name: 'Tags',
      component: () => import('@/views/manageNews/newsTags/index'),
      meta: { title: 'Tags', icon: 'el-icon-tickets', authorize: [config.roleConfig['NEWS']] },
    }, {
      path: 'tin-tuc',
      name: 'Danh sách tin tức',
      component: () => import('@/views/manageNews/index'),
      meta: { title: 'Danh sách tin tức', icon: 'el-icon-tickets', authorize: [config.roleConfig['NEWS']] },
    }, {
      path: 'tin-tuc/:id',
      name: 'Biểu mẫu tin tức',
      component: () => import('@/views/manageNews/newsForm/index'),
      meta: {
        authorize: [config.roleConfig['NEWS']]
      },
      hidden: true
    }]
  },
  {
    path: '/quan-ly-mon-hoc',
    component: Layout,
    children: [
      {
        path: 'danh-sach',
        name: 'Quản lý môn học',
        component: () => import('@/views/managerSubject/index.vue'),
        meta: { title: 'Quản lý môn học', icon: 'lead_sell', authorize: [config.roleConfig['ADMIN']] },
      },
      {
        path: 'danh-sach-cac-phan',
        name: 'Quản lý chuyên đề môn học',
        component: () => import('@/views/managerSubject/partSubject/index.vue'),
        meta: {
          title: 'Quản lý chuyên đề môn học',
          icon: 'el-icon-tickets',
          authorize: [config.roleConfig['ADMIN']],
          activeMenu: '/quan-ly-mon-hoc/danh-sach'
        },
        hidden: true
      },
    ]
  },
  {
    path: '/quan-ly-toeic', component: Layout, children: [
      {
        path: 'danh-sach',
        name: 'Quản lý Toeic',
        component: () => import('@/views/manageToeic/index'),
        meta: { title: 'Quản lý Toeic', icon: 'lead_sell', authorize: [config.roleConfig['TOEIC']] },
      },
      {
        path: 'de-thi/:id',
        name: 'Biên tập đề thi Toeic',
        component: () => import('@/views/manageToeic/form/index.vue'),
        meta: {
          title: 'Biên tập đề thi Toeic',
          icon: 'el-icon-tickets',
          authorize: [config.roleConfig['TOEIC']],
          activeMenu: '/quan-ly-toeic/danh-sach'
        },
        hidden: true
      }]
  },
  {
    path: '/quan-ly-de-thi',
    component: Layout,
    children: [
      {
        path: 'danh-sach',
        name: 'Quản lý đề thi',
        component: () => import('@/views/manageExam/index'),
        meta: { title: 'Quản lý đề thi', icon: 'el-icon-tickets', authorize: [config.roleConfig['EXAMTEST']] },
      },
      {
        path: 'de-thi/:id',
        name: 'Biên tập đề thi',
        component: () => import('@/views/manageExam/form/index'),
        meta: {
          authorize: [config.roleConfig['EXAMTEST']],
          activeMenu: '/quan-ly-de-thi/danh-sach'
        },
        hidden: true
      },
      {
        path: 'cau-hoi/:id',
        name: 'Biên tập câu hỏi đề thi',
        component: () => import('@/views/manageExam/question/index'),
        meta: {
          authorize: [config.roleConfig['EXAMTEST']],
          activeMenu: '/quan-ly-de-thi/danh-sach'
        },
        hidden: true
      }
    ]
  },
  {
    path: '/danh-gia', component: Layout, children: [{
      path: 'danh-sach',
      name: 'Quản lý đánh giá',
      component: () => import('@/views/managerRating/index'),
      meta: { title: 'Quản lý đánh giá', icon: 'star' },
    }]
  },
  {
    path: '/gioi-thieu', component: Layout, children: [{
      path: 'danh-sach',
      name: 'Quản lý giới thiệu',
      component: () => import('@/views/manageIntro/index'),
      meta: { title: 'Quản lý giới thiệu', icon: 'lead_buy', authorize: [config.roleConfig.INTRODUCTION] },
    }]
  },
  {
    path: '/', component: Layout, children: [{
      path: '/nguoi-dung',
      name: 'Người dùng Website',
      component: () => import('@/views/manageUser/index'),
      meta: { title: 'Người dùng Website', icon: 'user', authorize: [config.roleConfig.ADMIN] },
    }]
  },
]

function genRouterList() {
  const u = localStorage.getItem(config.userKey) ? JSON.parse(localStorage.getItem(config.userKey)) : {}
  return baseRouter.map(item => {
    const authorize = item?.meta?.authorize
    if (authorize && authorize.length && !checkAuthor(u.roles, authorize)) {
      item.hidden = true
    }
    if (item.children && item.children.length) {
      item.children.forEach(i => {
        if (i.meta) {
          const { authorize } = i.meta
          if (authorize && authorize.length && !checkAuthor(u.roles, authorize)) {
            i.hidden = true
          }
          return i
        }
      })
      return item
    }

    return item
  })
}

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }), routes: genRouterList(),
})

const router = createRouter()

function checkAuthor(arrRoles, baseRoles) {
  return (arrRoles || []).some(x => baseRoles.includes(x))
}

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta
  const currentUser = localStorage.getItem(config.userKey) ? JSON.parse(localStorage.getItem(config.userKey)) : {}
  if (authorize) {
    if (!currentUser.token) {
      // not logged in so redirect to login page with the return url
      return next({ path: '/login', query: { returnUrl: to.path } })
    }

    // check if route is restricted by role
    if (authorize.length && !checkAuthor(currentUser.roles, authorize)) {
      // role not authorised so redirect to home page
      return next({ path: '/' })
    }
  }

  next()
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

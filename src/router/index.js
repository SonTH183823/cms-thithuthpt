import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import LayoutChild from '@/layout/layout-child'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

export const constantRoutes = [
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
    path: '/',
    name: 'Biên tập nội dung',
    redirect: '/dashboard',
    meta: { title: 'Biên tập nội dung' },
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'Trang chủ',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Trang chủ', icon: 'dashboard' }
      },
      {
        path: '/quan-tri',
        component: LayoutChild,
        meta: { title: 'Quản trị hệ thống', icon: 'settings' },
        children: [
          {
            path: 'nguoi-dung',
            name: 'Người dùng cms',
            component: () => import('@/views/system/user/index'),
            meta: { title: 'Người dùng CMS', icon: 'user' }
          },
          {
            path: 'role-manage',
            name: 'Role',
            component: () => import('@/views/role-manage/index'),
            meta: { title: 'Phân quyền', icon: 'information1' },
            children: [
              {
                path: 'resource',
                name: 'Resource',
                component: () => import('@/views/role-manage/resource/index'),
                meta: { title: 'Tài nguyên', icon: 'el-icon-s-cooperation' }
              },
              {
                path: 'permission',
                name: 'Permission',
                component: () => import('@/views/role-manage/permission/index'),
                meta: { title: 'Quyền hạn', icon: 'el-icon-s-finance' }
              },
              {
                path: 'role',
                name: 'Role1',
                component: () => import('@/views/role-manage/role/index'),
                meta: { title: 'Phân vai', icon: 'el-icon-s-custom' }
              },
              {
                path: 'group',
                name: 'Group',
                component: () => import('@/views/role-manage/group/index'),
                meta: { title: 'Nhóm quyền', icon: 'el-icon-s-custom' }
              },
            ]
          }
        ]
      },
      {
        path: '/quan-ly-popup',
        component: LayoutChild,
        children: [
          {
            path: 'danh-sach',
            name: 'Quản lý Popup',
            component: () => import('@/views/managePopup/index'),
            meta: { title: 'Quản lý Popup', icon: 'Image' },
          },
          {
            path: 'chi-tiet/:id',
            name: 'Chi tiết Popup',
            component: () => import('@/views/managePopup/formPopup/index'),
            meta: { activeMenu: '/quan-ly-popup/danh-sach' },
            hidden: true,
          }
        ]
      },
      {
        path: '/quan-ly-banner',
        component: LayoutChild,
        children: [
          {
            path: 'vi-tri',
            name: 'Quản lý banner',
            component: () => import('@/views/manageBanner/index'),
            meta: { title: 'Quản lý banner', icon: 'Image' },
          },
          {
            path: 'danh-sach-banner',
            name: 'Danh sách banner',
            component: () => import('@/views/manageBanner/banner/index'),
            meta: { activeMenu: '/quan-ly-banner/vi-tri' },
            hidden: true,
          },
          {
            path: 'banner/:id',
            name: 'Chi tiết Banner',
            component: () => import('@/views/manageBanner/banner/formBanner/index'),
            meta: { activeMenu: '/quan-ly-banner/vi-tri' },
            hidden: true,
          }
        ]
      },
      {
        path: '/quan-ly-tin-tuc',
        component: LayoutChild,
        meta: { title: 'Quản lý tin tức', icon: 'el-icon-tickets' },
        children: [
          {
            path: 'loai-tin-tuc',
            name: 'Loại tin tức',
            component: () => import('@/views/manageNews/newsType/index'),
            meta: { title: 'Loại tin tức', icon: 'el-icon-tickets' },
          },
          {
            path: 'tags',
            name: 'Tags',
            component: () => import('@/views/manageNews/newsTags/index'),
            meta: { title: 'Tags', icon: 'el-icon-tickets' },
          },
          {
            path: 'tin-tuc',
            name: 'Danh sách tin tức',
            component: () => import('@/views/manageNews/index'),
            meta: { title: 'Danh sách tin tức', icon: 'el-icon-tickets' },
          },
          {
            path: 'tin-tuc/:id',
            name: 'Biểu mẫu tin tức',
            component: () => import('@/views/manageNews/newsForm/index'),
            hidden: true
          },
        ]
      },
      {
        path: '/quan-ly-doi-tac',
        component: LayoutChild,
        children: [
          {
            path: 'doi-tac',
            name: 'Quản lý đối tác',
            component: () => import('@/views/managePartner/index'),
            meta: { title: 'Quản lý đối tác', icon: 'el-icon-tickets' },
          },
          {
            path: 'doi-tac/:id',
            name: 'Chi tiết đối tác',
            component: () => import('@/views/managePartner/partnerForm/index'),
            hidden: true
          },
        ]
      },
      {
        path: '/chinh-sach-ban-hang',
        component: LayoutChild,
        children: [
          {
            path: 'danh-sach',
            name: 'Chính sách bán hàng',
            component: () => import('@/views/manageSalesPolicy/index'),
            meta: { title: 'Chính sách bán hàng', icon: 'el-icon-tickets' },
          },
          {
            path: 'chi-tiet/:id',
            name: 'Chi tiết chính sách',
            component: () => import('@/views/manageSalesPolicy/form/index'),
            meta: { activeMenu: '/chinh-sach-ban-hang/danh-sach' },
            hidden: true
          },
        ]
      },
      {
        path: '/thong-tin-thong-ke',
        component: LayoutChild,
        children: [
          {
            path: 'danh-sach',
            name: 'Thông tin thống kê',
            component: () => import('@/views/manageStatistical/index'),
            meta: { title: 'Thông tin thống kê', icon: 'statistic' },
          }
        ]
      },
      {
        path: '/quan-ly-thong-bao',
        component: LayoutChild,
        meta: { title: 'Quản lý thông báo', icon: 'bell-bold' },
        children: [
          // {
          //   path: 'danh-sach',
          //   name: 'Danh sách thông báo',
          //   component: () => import('@/views/manageNotification/index'),
          //   meta: { title: 'Danh sách', icon: 'listCar' },
          // },
          {
            path: 'template',
            name: 'Template thông báo',
            component: () => import('@/views/manageNotification/templateNotification/index'),
            meta: { title: 'Template thông báo', icon: 'bell-bold' },
          },
          // {
          //   path: 'thong-bao/:id',
          //   name: 'Chi tiết thông báo',
          //   component: () => import('@/views/manageNotification/formNotify/index'),
          //   meta: { activeMenu: '/quan-ly-thong-bao/danh-sach' },
          //   hidden: true
          // },
        ]
      },
      {
        path: '/danh-gia',
        component: LayoutChild,
        children: [
          {
            path: 'danh-sach',
            name: 'Quản lý đánh giá',
            component: () => import('@/views/managerRating/index'),
            meta: { title: 'Quản lý đánh giá', icon: 'star' },
          }
        ]
      },
      {
        path: '/faq',
        component: LayoutChild,
        children: [
          {
            path: 'danh-sach',
            name: 'FAQ',
            component: () => import('@/views/FAQ/index'),
            meta: { title: 'FAQ', icon: 'el-icon-tickets' },
          },
          // {
          //   path: 'chi-tiet/:id',
          //   name: 'Chi tiết FAQ',
          //   component: () => import('@/views//partnerForm/index'),
          //   hidden: true
          // },
        ]
      },
      {
        path: '/quan-ly-seo',
        component: LayoutChild,
        children: [
          {
            path: 'SEO',
            name: 'Quản lý SEO',
            component: () => import('@/views/manageSEO/index'),
            meta: { title: 'Quản lý SEO', icon: 'el-icon-c-scale-to-original' },
          },
          {
            path: 'chi-tiet-seo/:id',
            name: 'Chi tiết SEO',
            component: () => import('@/views/manageSEO/ownSEOForm/index'),
            meta: { activeMenu: '/quan-ly-seo/SEO' },
            hidden: true,
          }
        ]
      },
      {
        path: '/quan-ly-tuyen-dung',
        component: LayoutChild,
        meta: { title: 'Quản lý tuyển dụng', icon: 'lead_customer' },
        children: [
          {
            path: 'danh-sach-linh-vuc',
            name: 'Danh sách lĩnh vực',
            component: () => import('@/views/managerRecruitment/newsRecruitment/index'),
            meta: { title: 'Danh sách lĩnh vực', icon: 'el-icon-tickets' },
          },
          {
            path: 'tin-tuyen-dung',
            name: 'Tin tuyển dụng',
            component: () => import('@/views/managerRecruitment/index'),
            meta: { title: 'Tin tuyển dụng', icon: 'recruitment' },
          },
          {
            path: 'danh-sach-ho-so',
            name: 'Hồ sơ ứng tuyển',
            component: () => import('@/views/managerRecruitment/fileRecruit/index'),
            meta: { title: 'Hồ sơ ứng tuyển', icon: 'listCar' },
          },
          {
            path: 'tin-tuyen-dung/:id',
            name: 'Biểu mẫu tin tuyển dụng',
            component: () => import('@/views/managerRecruitment/recruitmentForm/index'),
            hidden: true
          },
        ],
      },
    ]
  },

  {
    path: '/quan-ly-khach-hang',
    name: 'Quản lý KH và lead KH mua bán xe',
    meta: { title: 'Quản lý KH và lead KH mua bán xe' },
    component: Layout,
    children: [
      {
        path: 'nguoi-dung',
        name: 'Người dùng',
        component: () => import('@/views/manageUser/index'),
        meta: { title: 'Người dùng', icon: 'el-icon-user-solid' }
      },
      {
        path: 'nguoi-dung/:id',
        name: 'Chi tiết người dùng',
        component: () => import('@/views/manageUser/details/index'),
        meta: { activeMenu: '/quan-ly-khach-hang/nguoi-dung' },
        hidden: true
      },
      {
        path: 'lich-su/:id',
        name: 'Lịch sử người dùng',
        component: () => import('@/views/manageUser/history/index'),
        meta: { activeMenu: '/quan-ly-nguoi-dung/nguoi-dung' },
        hidden: true
      },
      {
        path: 'phien/:id',
        name: 'Chi tiết phiên đăng nhập',
        component: () => import('@/views/manageUser/session/index'),
        meta: { activeMenu: '/quan-ly-khach-hang/nguoi-dung' },
        hidden: true
      },
      {
        path: 'danh-sach-ban-xe',
        name: 'Khách hàng bán xe',
        component: () => import('@/views/manageCustomer/carSaleCustomer/index'),
        meta: { title: 'Khách hàng bán xe', icon: 'lead_sell' },
      },
      {
        path: 'thong-ke-danh-sach-ban-xe',
        name: 'Thống kê khách hàng bán xe',
        component: () => import('@/views/manageCustomer/carSaleCustomer/statisticalSaleCar'),
        meta: { activeMenu: '/quan-ly-khach-hang/danh-sach-ban-xe', title: 'Thống kê khách hàng bán xe' },
        hidden: true
      },
      {
        path: 'danh-sach-mua-xe',
        name: 'Khách hàng mua xe',
        component: () => import('@/views/manageCustomer/carBuyers/index'),
        meta: { title: 'Khách hàng mua xe', icon: 'lead_buy' },
      },
      {
        path: 'thong-ke-danh-sach-mua-xe',
        name: 'Thống kê khách hàng mua xe',
        component: () => import('@/views/manageCustomer/carBuyers/statisticalBuyCar'),
        meta: { activeMenu: '/quan-ly-khach-hang/danh-sach-mua-xe', title: 'Thống kê khách hàng mua xe' },
        hidden: true
      },
      {
        path: 'khach-hang-de-lai-mail',
        name: 'Khách hàng để lại mail',
        component: () => import('@/views/manageCustomer/customerWithMail/index'),
        meta: { title: 'Khách hàng để lại mail', icon: 'email' },
      },
    ]
  },

  {
    path: '/xe',
    meta: { title: 'Quản lý xe' },
    component: Layout,
    children: [
      {
        path: '/quan-ly-xe',
        component: LayoutChild,
        meta: { title: 'Quản lý xe', icon: 'car' },
        children: [
          {
            path: 'danh-sach',
            name: 'Danh sách xe',
            component: () => import('@/views/manageCar/index'),
            meta: { title: 'Danh sách xe', icon: 'listCar' },
          },
          {
            path: 'danh-sach-xe-ao',
            name: 'Danh sách xe ảo',
            component: () => import('@/views/manageCar/carVirtual/index'),
            meta: { title: 'Danh sách xe ảo', icon: 'listCar' }
          },
          {
            path: 'danh-sach-xe-odoo',
            name: 'Danh sách xe Odoo',
            component: () => import('@/views/manageCar/carOdoo/index'),
            meta: { title: 'Danh sách xe Odoo', icon: 'listCar', activeMenu: '/quan-ly-xe/danh-sach' },
            hidden: true
          },
          {
            path: 'them-media-xe-odoo/:id',
            name: 'Thêm mới Media xe từ Odoo',
            component: () => import('@/views/manageCar/carForm/formCarMedia'),
            meta: { activeMenu: '/quan-ly-xe/danh-sach' },
            hidden: true
          },
          {
            path: 'chi-tiet-xe-odoo/:id',
            name: 'Cập nhật xe từ Odoo',
            component: () => import('@/views/manageCar/carForm/formCarOdoo'),
            meta: { activeMenu: '/quan-ly-xe/danh-sach' },
            hidden: true
          },
          {
            path: 'kiem-dinh-xe/:id',
            name: 'Kiểm định xe',
            component: () => import('@/views/manageCar/checkCarForm/index'),
            meta: { title: 'Kiểm định xe' },
            hidden: true
          },
          {
            path: 'chi-tiet-xe/:id',
            name: 'Chi tiết xe',
            component: () => import('@/views/manageCar/carForm/index'),
            meta: { activeMenu: '/quan-ly-xe/danh-sach-xe-ao' },
            hidden: true
          },
          {
            path: 'trang-thai',
            name: 'Trạng thái xe ảo',
            component: () => import('@/views/manageCar/statusCar/index'),
            meta: { title: 'Trạng thái xe ảo', icon: 'status' }
          },
          {
            path: 'tag',
            name: 'Tag',
            component: () => import('@/views/manageCar/tagCar/index'),
            meta: { title: 'Tag', icon: 'price-tag' }
          },
        ]
      },
      {
        path: '/quan-ly-model-xe',
        component: LayoutChild,
        children: [
          {
            path: 'model-xe',
            name: 'Quản lý model xe',
            component: () => import('@/views/manageModel/index'),
            meta: { title: 'Quản lý model xe', icon: 'model' }
          },
          {
            path: 'model-xe/:id',
            name: 'Chi tiết model xe',
            component: () => import('@/views/manageModel/modalForm/index'),
            hidden: true
          },
        ]
      },
      {
        path: '/quan-ly-thuoc-tinh',
        component: LayoutChild,
        meta: { title: 'Thuộc tính của xe', icon: 'properties' },
        children: [
          {
            path: 'hang-xe',
            name: 'Quản lý hãng xe',
            component: () => import('@/views/manageProperties/Manufacturer'),
            meta: { title: 'Hãng xe', icon: 'Manufacturer' },
          },
          {
            path: 'hang-xe/:id',
            name: 'Chi tiết hãng xe',
            component: () => import('@/views/manageProperties/ManufacturerForm'),
            meta: { activeMenu: '/quan-ly-thuoc-tinh/hang-xe' },
            hidden: true
          },
          {
            path: 'dong-xe',
            name: 'Dòng xe',
            component: () => import('@/views/manageProperties/Brand'),
            meta: { title: 'Dòng xe', icon: 'brand' },
          },
          {
            path: 'mau-xe',
            name: 'Màu xe',
            component: () => import('@/views/manageProperties/CarColor'),
            meta: { title: 'Màu xe', icon: 'color' },
          },
          {
            path: 'kieu-dang-xe',
            name: 'Kiểu dáng xe',
            component: () => import('@/views/manageProperties/Figure'),
            meta: { title: 'Kiểu dáng xe', icon: 'typeCar' },
          },
          {
            path: 'nhien-lieu',
            name: 'Nhiên liệu',
            component: () => import('@/views/manageProperties/Fuel'),
            meta: { title: 'Nhiên liệu', icon: 'fuel' },
          },
          {
            path: 'dan-dong',
            name: 'Dẫn động',
            component: () => import('@/views/manageProperties/Drive'),
            meta: { title: 'Dẫn động', icon: 'drive-car' },
          },
          {
            path: 'xuat-xu',
            name: 'Xuất xứ',
            component: () => import('@/views/manageProperties/Origin'),
            meta: { title: 'Xuất xứ', icon: 'origin' },
          },
          {
            path: 'hop-so',
            name: 'Hộp số',
            component: () => import('@/views/manageProperties/Gear'),
            meta: { title: 'Hộp số', icon: 'gear' },
          },
        ]
      },
      {
        path: '/quan-ly-kiem-dinh',
        component: LayoutChild,
        meta: { title: 'Kiểm định xe', icon: 'check_car' },
        children: [
          {
            path: 'vi-tri',
            name: 'Danh sách vị trí',
            component: () => import('@/views/manageCheckCar/position'),
            meta: { title: 'Danh sách vị trí', icon: 'position' },
          },
          {
            path: 'diem-kiem-dinh',
            name: 'Danh sách điểm',
            component: () => import('@/views/manageCheckCar/point'),
            meta: { title: 'Danh sách điểm', icon: 'listCar' },
          },
        ]
      },
    ]
  },
  {
    path: '/popup-forums',
    component: Layout,
    children: [
      {
        path: 'danh-sach',
        name: 'Quản lý Popup Forums',
        component: () => import('@/views/managePopupForums/index'),
        meta: { title: 'Popup Forums', icon: 'Image' },
      },
      {
        path: 'chi-tiet/:id',
        name: 'Chi tiết Popup Forums',
        component: () => import('@/views/managePopupForums/formPopup/index'),
        meta: { activeMenu: '/quan-ly-popup-forums/danh-sach' },
        hidden: true,
      }
    ]
  },
  {
    path: '/popup-vetc',
    component: Layout,
    children: [
      {
        path: 'danh-sach',
        name: 'Quản lý popup VETC',
        component: () => import('@/views/PopupVETC/index'),
        meta: { title: 'Quản lý popup VETC', icon: 'Image' },
      },
      {
        path: 'chi-tiet/:id',
        name: 'Chi tiết popup VETC',
        component: () => import('@/views/PopupVETC/formPopup/index'),
        meta: { title: 'Chi tiết popup VETC', icon: 'Image' },
        hidden: true
      },
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

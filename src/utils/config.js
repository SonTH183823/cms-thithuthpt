const domainAuth = process.env['VUE_APP_AUTH_API'] || 'http://127.0.0.1:8003'
const domainPartner = process.env['VUE_APP_PARTNER_API'] || 'http://192.168.11.42:8009'
const domainPopupForums = process.env['VUE_APP_PARTNER_API'] || 'http://192.168.11.42:8061'
const domainUpload = process.env['VUE_APP_UPLOAD_API'] || 'https://images-cdn.carpla.dev'
const domainUploadFile = process.env['VUE_APP_UPLOAD_FILE_API'] || 'https://files-cdn.carpla.dev/dev-carpla-tc'
const domainDecorate = process.env['VUE_APP_DECORATE_API'] || 'http://192.168.11.42:8009'
const domainCustomer = process.env['VUE_APP_CUSTOMER_API'] || 'http://192.168.11.42:8003'
const domainNews = process.env['VUE_APP_NEWS_API'] || 'http://192.168.11.42:8006'
const domainTypeCar = process.env['VUE_APP_TYPE_CAR_API'] || 'http://192.168.11.42:8023'
const domainSeo = process.env['VUE_APP_SEO_API'] || 'http://192.168.11.42:8013'
const domainCar = process.env['VUE_APP_CAR'] || 'http://192.168.11.42:8027'
const userTransaction = process.env['VUE_APP_USER_TRANSACTION'] || 'http://192.168.11.42:8028'
const domainFaq = process.env['VUE_APP_FAQ'] || 'http://192.168.11.42:8029'
const domainMinIO = process.env['VUE_APP_MINIO'] || 'http://192.168.11.42:8050'
const domainRecruitment = process.env['VUE_APP_RECRUITMENT'] || 'http://192.168.11.42:8032'
const domainPointCar = process.env['VUE_APP_POINT_CAR'] || 'http://192.168.11.42:8014'
const domainSalePolicy = process.env['VUE_APP_SALE_POLICY'] || 'http://192.168.11.42:8033'
const domainNotification = process.env['VUE_APP_NOTIFICATION'] || 'http://192.168.11.42:8017'
const domainPopupVETC = process.env['VUE_APP_POPUP_VETC'] || 'http://192.168.11.42:8060'

const config = {
  blobNamePreview: "temp-preview0x273asfds13FDAFASFASdxx31912",
  userKey: 'userinfo',
  tokenKey: 'access-token',
  permissionKey: 'permission',
  api: {
    domainUpload,
    domainSalePolicy,
    domainPointCar,
    domainCar,
    domainFaq,
    domainUploadFile,
    domainStatistic: domainPartner,
    domainUser: domainCustomer,
    userTransaction,
    domainRecruitment,
    popupVETC: `${domainPopupVETC}/campaign`,
    popupVETCUpload: `${domainPopupVETC}`,
    popup: `${domainPartner}/popup`,
    popupForums: `${domainPopupForums}/popups`,
    notification: `${domainNotification}/notification`,
    notificationTemplate: `${domainNotification}/notificationTemplate`,
    rating: `${domainDecorate}/rate`,
    minio: `${domainMinIO}/presignedUrl`,
    auth: `${domainAuth}/userCMS`,
    upload: `${domainUpload}`,
    user: `${domainAuth}/userCMS`,
    domainNews,
    news: `${domainNews}/news`,
    partner: `${domainPartner}/partner`,
    menu: `${domainDecorate}/menu`,
    customer: `${domainCustomer}/cms/user`,
    banner: `${domainDecorate}/banner`,
    seo: `${domainSeo}/seo`,
    typeCar: `${domainTypeCar}/typeCar`,
    car: `${domainCar}/car`
  },
  httpCode: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    TOKEN_EXPIRED: 409,
    UNKNOWN_ERROR: 520,
    FORBIDDEN: 403,
    UNAUTHORIZED: 401,
    ADMIN_REQUIRE: 406
  },
  eventName: {
    UPDATE_KANBAN_BOARD: 'updateKanbanBoard'
  },
  taxonomyType: {
    CHUC_VU: 1,
    DON_VI: 2,
    CAP_BAC: 3,
  },
  fileType: {
    1: 'excel',
    2: 'csv'
  },
  numberMap: {
    1: 'Có',
    0: 'Không'
  },
  genderMap: {
    0: 'Nam',
    1: 'Nữ'
  },
  active: [
    {
      value: 0,
      label: 'CHƯA KÍCH HOẠT',
      typeTag: 'info'
    },
    {
      value: 1,
      label: 'ĐANG KÍCH HOẠT',
      typeTag: 'primary'
    }
  ],
  isActive: [
    {
      value: 0,
      label: 'CHƯA KÍCH HOẠT',
      typeTag: 'info'
    },
    {
      value: 1,
      label: 'ĐANG KÍCH HOẠT',
      typeTag: 'success'
    }
  ],
  isLocked: [
    {
      value: 1,
      label: 'ĐANG CHẶN',
      typeTag: 'info'
    },
    {
      value: 0,
      label: 'ĐANG KÍCH HOẠT',
      typeTag: 'success'
    }
  ],
  isOnline: [
    {
      value: 0,
      label: 'OFFLINE',
      typeTag: 'info'
    },
    {
      value: 1,
      label: 'ONLINE',
      typeTag: 'success'
    }
  ],
  state: [
    {
      value: 1,
      typeTag: 'warning',
      label: 'CHỜ TIẾP NHẬN'
    },
    {
      value: 2,
      typeTag: 'success',
      label: 'CHỜ XỬ LÝ'
    },
    {
      value: 3,
      typeTag: 'info',
      label: 'ĐANG XỬ LÝ'
    },
    {
      value: 4,
      typeTag: 'success',
      label: 'HOÀN THÀNH'
    },
    {
      value: 5,
      typeTag: 'danger',
      label: 'HỦY'
    },
  ],
  stateCarSale: [
    {
      value: 1,
      typeTag: 'primary',
      label: 'ĐANG BÁN'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'ĐÃ BÁN'
    },
    {
      value: 3,
      typeTag: 'danger',
      label: 'HỦY'
    },
  ],
  //nguồn tài khoản
  provider: [
    {
      value: 1,
      typeTag: 'success',
      label: 'Số điện thoại'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'Tài khoản Google'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'Tài khoản Facebook'
    },
  ],
  //nguồn nhận lead
  from: [
    {
      value: 1,
      typeTag: 'info',
      label: 'Liên hệ ngay'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'Đăng ký lái thử'
    },
    {
      value: 3,
      typeTag: 'info',
      label: 'Gọi cho tôi'
    },
    {
      value: 4,
      typeTag: 'info',
      label: 'KH cần tư vấn tài chính'
    },
    {
      value: 5,
      typeTag: 'info',
      label: 'Form mua xe'
    },
    {
      value: 6,
      typeTag: 'info',
      label: 'Form RSA'
    },
    {
      value: 7,
      typeTag: 'info',
      label: 'Liên hệ khi xe về'
    },
    {
      value: 8,
      typeTag: 'info',
      label: 'Liên hệ khi xe hết cọc'
    },
    {
      value: 9,
      typeTag: 'info',
      label: 'Tìm xe tương tự'
    }
  ],
  status: [
    {
      value: 1,
      typeTag: 'info',
      label: 'Đã mua'
    },
    {
      value: 2,
      typeTag: 'success',
      label: 'Đang sửa chữa'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'Hoàn thành sửa chữa'
    },
    {
      value: 4,
      typeTag: 'danger',
      label: 'Có thể bán'
    },
    {
      value: 5,
      typeTag: 'primary',
      label: 'Đang bán'
    },
    {
      value: 6,
      typeTag: 'info',
      label: 'Đã bán'
    },
  ],
  statusMyCar: [
    {
      value: 1,
      typeTag: 'info',
      label: 'Sắp bán'
    },
    {
      value: 2,
      typeTag: 'success',
      label: 'Đang bán'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'Đã nhận cọc'
    },
    {
      value: 4,
      typeTag: 'danger',
      label: 'Đã bán'
    },
  ],
  statusColorMap: {
    total: 'info',
    complete: 'success',
    processing: 'primary',
    expire: 'danger',
    warning: 'warning'
  },
  localKeys: {
    fields: 'FIELDS_CONFIG'
  },
  methodAPI: ['get', 'post', 'put', 'delete'],
  specType: {
    manufacturer: 1,
    brand: 2,
    color: 3,
    figure: 4,
    fuel: 5,
    drive: 6,
    origin: 7,
    gear: 8
  },
  tagCar: [
    {
      value: 1,
      typeTag: 'danger',
      label: 'Nổi bật'
    },
    {
      value: 2,
      typeTag: 'warning',
      label: 'Xem nhiều'
    },
    {
      value: 3,
      typeTag: 'success',
      label: 'Biển đẹp'
    },
    {
      value: 4,
      typeTag: 'success',
      label: 'Biển Hà Nội đẹp'
    },
    {
      value: 5,
      typeTag: 'success',
      label: 'Biển HCM đẹp'
    },
  ],
  //danh sach de muc
  category: [
    {
      value: 1,
      typeTag: 'primary',
      label: 'Mua xe'
    },
    {
      value: 2,
      typeTag: 'warning',
      label: 'Bán xe'
    },
    {
      value: 3,
      typeTag: 'danger',
      label: 'Q&A'
    },
    {
      value: 4,
      typeTag: 'info',
      label: 'Chung'
    },
  ],
  //danh sach man hinh carpla
  listScreens: [
    {
      value: 1,
      label: 'Trang chủ'
    },
    {
      value: 2,
      label: 'Danh sách xe'
    },
    {
      value: 3,
      label: 'Chi tiết xe'
    },
    {
      value: 4,
      label: 'Đăng bán xe'
    },
    {
      value: 5,
      label: 'Chi tiết tin tức'
    },
    {
      value: 6,
      label: 'Tuyển dụng'
    },
    {
      value: 7,
      label: 'FAQ'
    },
    {
      value: 8,
      label: 'Trang Login'
    },
    {
      value: 9,
      label: 'Trang Chứng chỉ chất lượng'
    },
    {
      value: 10,
      label: 'Trang Hãng xe'
    },
    {
      value: 11,
      label: 'Trang Chính sách bán hàng'
    },
  ],
  listScreensForums: [
    {
      value: 1,
      label: 'Trang chủ'
    },
  ],
  historyType: [
    {
      value: 1,
      typeTag: 'success',
      label: 'LOGIN'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'LOGOUT'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'BLOCK'
    },
    {
      value: 4,
      typeTag: 'primary',
      label: 'UNBLOCK'
    },
    {
      value: 5,
      typeTag: 'danger',
      label: 'KICK'
    },
  ],
  deviceTypes: [
    {
      value: 1,
      typeTag: 'success',
      label: 'ANDROID'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'IOS'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'WEB'
    },
  ],
  fromStatistical: [
    {
      value: 1,
      typeTag: 'warning',
      label: 'Trang chủ'
    },
    {
      value: 2,
      typeTag: 'danger',
      label: 'Trang bán xe'
    },
    {
      value: 3,
      typeTag: 'success',
      label: 'Trang Chứng chỉ chất lượng'
    },
  ],
  workingForm: [
    {
      value: 1,
      typeTag: 'warning',
      label: 'Part-time'
    },
    {
      value: 2,
      typeTag: 'danger',
      label: 'Full-time'
    },
    {
      value: 3,
      typeTag: 'primary',
      label: 'Cộng tác viên'
    },
    {
      value: 4,
      typeTag: 'success',
      label: 'Thực tập sinh'
    },

  ],
  statusCV: [
    {
      value: 1,
      typeTag: 'warning',
      label: 'Chờ tiếp nhận'
    },
    {
      value: 2,
      typeTag: 'success',
      label: 'Đã tiếp nhận'
    },
  ],
  listScreenSEO: [
    {
      value: 1,
      typeTag: 'info',
      label: 'Trang chủ'
    },
    {
      value: 2,
      typeTag: 'info',
      label: 'Bán xe'
    },
    {
      value: 3,
      typeTag: 'info',
      label: 'Mua xe'
    },
    {
      value: 4,
      typeTag: 'info',
      label: 'Dịch vụ'
    },
    {
      value: 5,
      typeTag: 'info',
      label: 'Trang chính tin tức'
    },
    {
      value: 6,
      typeTag: 'info',
      label: 'Giới thiệu'
    },
    {
      value: 7,
      typeTag: 'info',
      label: 'Tại sao chọn Carpla'
    },
    {
      value: 8,
      typeTag: 'info',
      label: 'Tuyển dụng'
    },
    {
      value: 9,
      typeTag: 'info',
      label: 'Danh sách xe yêu thích'
    },
    {
      value: 10,
      typeTag: 'info',
      label: 'Trang cá nhân'
    },
  ],
  qualityConfig: {
    PASS: 1, ERROR: 2, NA: 3
  },
  inspectedCar: [
    {
      value: 0,
      typeTag: 'danger',
      label: 'Chưa kiểm định'
    },
    {
      value: 1,
      typeTag: 'primary',
      label: 'Đã kiểm định'
    },
  ],
  typeNotificationConfig: [
    {
      value: 1,
      typeTag: 'danger',
      label: 'LEAD'
    },
    {
      value: 2,
      typeTag: 'success',
      label: 'SELL CAR'
    },
    {
      value: 3,
      typeTag: 'info',
      label: 'OWN LEAD'
    },
    {
      value: 4,
      typeTag: 'warning',
      label: 'OWN SELL CAR'
    },
    {
      value: 5,
      typeTag: '',
      label: 'CAR INTERESTED CHANGE'
    },
  ]
}

export default config

const domainAuth = process.env['VUE_APP_AUTH_API'] || 'http://127.0.0.1:8003' + '/cms'
const domain = process.env['VUE_APP_DOMAIN_API'] || 'http://127.0.0.1:8003' + '/cms'
const domainUpload = process.env['VUE_APP_UPLOAD_API'] || 'http://127.0.0.1:8003' + '/uploads'
const domainPartner = process.env['VUE_APP_PARTNER_API'] || 'http://192.168.11.42:8009'
const domainPopupForums = process.env['VUE_APP_PARTNER_API'] || 'http://192.168.11.42:8061'
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
    domain,
    domainUpload,
    rating: `${domain}/rate`,
    exam: `${domain}/exam`,
    document: `${domain}/document`,
    toeic: `${domain}/examToeic`,
    question: `${domain}/question`,
    subject: `${domain}/partSubject`,
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
    minio: `${domainMinIO}/presignedUrl`,
    auth: `${domainAuth}/userCMS`,
    upload: `${domain}/upload`,
    uploadMultiple: `${domain}/uploadMany`,
    user: `${domainAuth}/userCMS`,
    domainNews,
    news: `${domainAuth}/news`,
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
  ],
  roleConfig: {
    NEWS: 1,
    DOCUMENT: 2,
    TOEIC: 3,
    EXAMTEST: 4,
    INTRODUCTION: 5,
    ADMIN: 6
  },
  roleConfigMap: [
    {
      label: 'Tin tức',
      value: 1
    },
    {
      label: 'Tài liệu ôn tập',
      value: 2
    },
    {
      label: 'Toeic',
      value: 3
    },
    {
      label: 'Đề thi',
      value: 4
    },
    {
      label: 'Giới thiệu',
      value: 5
    },
    {
      label: 'Admin',
      value: 6
    },
  ],
  subjectConfig: [
    {
      value: 1,
      label: 'Toán Học'
    },
    {
      value: 2,
      label: 'Vật Lý'
    },
    {
      value: 3,
      label: 'Hóa Học'
    },
    {
      value: 4,
      label: 'Sinh Học'
    },
    {
      value: 5,
      label: 'Tiếng Anh'
    },
    {
      value: 6,
      label: 'Lịch Sử'
    },
    {
      value: 7,
      label: 'Địa Lý'
    },
    {
      value: 8,
      label: 'GDCD'
    },
    {
      value: 9,
      label: 'Toeic'
    },
  ],
  subToanList: [
    'Bất Phương Trình',
    'Cấp Số Cộng - Số Nhân',
    'Hàm Số - Giới Hạn',
    'Hàm Số - Đồ Thị',
    'Hình Học Giải Tích',
    'Hình Học Không Gian',
    'Mũ - Lũy Thừa',
    'Số Phức',
    'Tích Phân - Đạo Hàm',
    'Tổ Hợp - Xác Suất',
    'Loại Khác'
  ],
  answerConfig: {
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4
  },
  levelConfig: [
    {
      value: 1,
      label: 'Cơ bản'
    },
    {
      value: 2,
      label: 'Trung bình'
    },
    {
      value: 3,
      label: 'Nâng cao'
    },
    {
      value: 4,
      label: 'Khó'
    }
  ],
  cateToeicConfig: [
    {
      value: 1,
      label: 'Bộ đề'
    },
    {
      value: 2,
      label: 'Đề rút gọn'
    },
  ]
}

export default config

const domain = process.env['VUE_APP_DOMAIN_API'] || 'http://127.0.0.1/cms'
const domainUpload = process.env['VUE_APP_UPLOAD_API'] || 'http://127.0.0.1/uploads'

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
    minio: `${domain}/presignedUrl`,
    auth: `${domain}/userCMS`,
    upload: `${domain}/upload`,
    uploadMultiple: `${domain}/uploadMany`,
    user: `${domain}/userCMS`,
    news: `${domain}/news`,
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
      typeTag: 'success',
      label: 'Toán Học'
    },
    {
      value: 2,
      typeTag: 'primary',
      label: 'Vật Lý'
    },
    {
      value: 3,
      typeTag: 'warning',
      label: 'Hóa Học'
    },
    {
      value: 4,
      typeTag: 'danger',
      label: 'Sinh Học'
    },
    {
      value: 5,
      typeTag: 'info',
      label: 'Tiếng Anh'
    },
    {
      value: 6,
      typeTag: 'success',
      label: 'Lịch Sử'
    },
    {
      value: 7,
      typeTag: 'warning',
      label: 'Địa Lý'
    },
    {
      value: 8,
      typeTag: 'danger',
      label: 'GDCD'
    },
  ],
  caeToeicConfig: [
    {
      value: 1,
      typeTag: 'warning',
      label: 'Bộ đề'
    },
    {
      value: 2,
      typeTag: 'danger',
      label: 'Đề rút gọn'
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

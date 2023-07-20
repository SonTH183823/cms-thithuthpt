import Vue from 'vue'
import { Upload, Button } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/vi' // lang i18n

import '../element-variables.scss'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import VueCompositionAPI from '@vue/composition-api'

import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/third_party/embedly.min'
import 'froala-editor/js/third_party/font_awesome.min'
import 'froala-editor/js/third_party/spell_checker.min'
import 'froala-editor/js/third_party/image_tui.min'
import 'froala-editor/js/languages/vi.js'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import VueFroala from 'vue-froala-wysiwyg'

Vue.use(VueFroala)
Vue.use(VueCompositionAPI)
Vue.use(Upload)
Vue.use(Button)

import '@/icons' // icon
import '@/permission' // permission control

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

const eventBus = new Vue()
Vue.prototype.$bus = eventBus

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

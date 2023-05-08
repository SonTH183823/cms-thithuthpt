<template>
  <div @focusout="handleProcess">
    <froala id="edit" v-model="model" :tag="'textarea'" :config="config"/>
  </div>
</template>

<script>
import 'froala-editor/js/languages/vi.js'
import MinIOAPI from "@/api/minioApi"
import config from "@/utils/config"

export default {
  name: 'EditorComponent',
  props: {
    content: {
      type: String,
      default: ''
    },
    typeForm: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      config: {
        imageAllowedTypes: ['jpeg', 'jpg', 'png'],
        toolbarSticky: false,
        placeholderText: 'Nhập nội dung',
        events: {
          urlImgMinIO: undefined,
          urlImgEditor: undefined,
          urlVideoMinIO: undefined,
          urlVideoEditor: undefined,
          'image.beforeUpload': async function(images) {
            const file = images[0]
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name || `imgPaste${file.size}${file.type}` })
            const blob = new Blob([file], { type: file.type })
            await MinIOAPI.upload(data.url, blob)
            this.urlImgMinIO = `${config.api.domainUpload}/${data.path}`
            const html = this.html.get().toString()
            const regex = new RegExp(`${this.urlImgEditor}`)
            this.html.set(html.replace(regex, this.urlImgMinIO))
          },
          'image.inserted': async function($img) {
            this.urlImgEditor = $img[0].currentSrc.toString()
          },
          'image.replaced': function($img) {
            this.urlImgEditor = $img[0].currentSrc.toString()
          },
          'video.beforeUpload': async function(videos) {
            const file = videos[0]
            const data = await MinIOAPI.getPreUrlUpload({ name: file.name })
            const blob = new Blob([file], { type: file.type })
            await MinIOAPI.upload(data.url, blob)
            this.urlVideoMinIO = `src="${config.api.domainUploadFile}/dev-carpla-tc/${data.path}"`
            const html = this.html.get().toString()
            const regex = new RegExp(`${this.urlVideoEditor}`)
            this.html.set(html.replace(regex, this.urlVideoMinIO))
          },
          'video.inserted': function($video) {
            const list = $video[0].innerHTML.split(" ")
            this.urlVideoEditor = list[1]
          },
          'video.replaced': function($video) {
            const list = $video[0].innerHTML.split(" ")
            this.urlVideoEditor = list[1]
          },
        },
        charCounterCount: true,
        entities: '',
        spellcheck: false,
        toolbarButtons: {
          'moreText': {
            'buttons': ['undo', 'redo', 'bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'subscript', 'superscript', 'inlineClass', 'inlineStyle', 'clearFormatting'],
            'buttonsVisible': 8
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'lineHeight', 'outdent', 'indent', 'paragraphStyle', 'quote'],
            'buttonsVisible': 10
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'specialCharacters', 'embedly', 'insertHR'],
            'buttonsVisible': 9
          },
          'moreMisc': {
            'buttons': ['fullscreen', 'selectAll', 'help'],
            'align': 'right',
            'buttonsVisible': 3
          },
        },
        toolbarButtonsMD: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
            'buttonsVisible': 3
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOLSimple', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
            'buttonsVisible': 4
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],
            'buttonsVisible': 2
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'selectAll', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        },
        toolbarButtonsSM: {
          'moreText': {
            'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'],
            'buttonsVisible': 2
          },
          'moreParagraph': {
            'buttons': ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'],
            'buttonsVisible': 2
          },
          'moreRich': {
            'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR'],
            'buttonsVisible': 0
          },
          'moreMisc': {
            'buttons': ['undo', 'redo', 'fullscreen', 'selectAll', 'help'],
            'align': 'right',
            'buttonsVisible': 2
          }
        }
      },
      model: this.content,
    }
  },
  methods: {
    handleProcess() {
      this.$emit('content-html-change', this.model)
    },
  }
}
</script>

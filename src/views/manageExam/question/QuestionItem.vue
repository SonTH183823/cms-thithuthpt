<template>
  <div>
    <el-row>
      <el-col :xl="12" :md="12">
        <div>
          <div v-if="question.content" style="position: relative">
            <img
              :src="`${config.api.domainUpload}/${question.content}`"
              style="object-fit: contain; width: 50% ; border-radius: 5px"
              alt=""
            >
            <span class="icon-remove-img" @click="onRemoveFile()"><el-icon name="error"/></span>
          </div>
          <img
            v-else
            alt=""
            src="../../../assets/images/image_placeholder.png"
            style="width: 50%"
            @click="dialogFormVisible=true"
          >
          <div class="el-row--flex">
            <el-button type="text" @click="dialogFormVisible=true">Thêm ảnh</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import config from "@/utils/config"
import vueFilePond, {setOptions} from 'vue-filepond'
import 'filepond/dist/filepond.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import UploadAPI from "@/api/uploadApi";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageTransform,
  FilePondPluginImageResize
)

setOptions({
  styleLoadIndicatorPosition: "center top",
  styleProgressIndicatorPosition: "right top",
  styleButtonRemoveItemPosition: "left top",
  styleButtonProcessItemPosition: "right top",
  labelFileProcessing: 'Đang tải',
  labelTapToCancel: 'Bấm để hủy',
  labelTapToUndo: '',
  labelFileProcessingComplete: 'Thành công',
})

export default {
  components: {
    FilePond
  },
  props: {
    question: {
      type: Object,
      required: true,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      required: true
    },
  },
  data() {
    return {
      config,
      dialogFormVisible: false,
      innerVisible: false,
      imgFile: [],
      server: {
        process: async (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
          if (!file.name.includes(config.blobNamePreview)) {
            const data = await UploadAPI.uploadFile(file)
            this.oneImage.path = data.filename
          } else {
            progress(1024, 1024, 1024)
          }
          return load(file)
        },
        revert: null
      },
      onePoint: {
        _id: '',
        quality: 1,
        images: []
      },
      oneImage: {
        path: '',
        reason: ''
      },
      formRules: {
        path: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy chọn ảnh'
        }],
        reason: [{
          required: true,
          trigger: 'blur',
          message: 'Hãy nhập lý do/ vị trí'
        }],
      }
    }
  },
  methods: {
    checkAddNewQuestion() {
      return !(this.question?.content && this.question?.answer)
    },
    onRemoveFile() {
      this.question.content = ''
      this.imgFile = []
    },
  }
}
</script>

<style lang="scss" scoped>

</style>

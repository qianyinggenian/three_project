<template>
  <div v-loading="Loading" class="app_detail">
    <el-form ref="form" :rules="rules" :model="appDetail" label-width="80px">
      <el-form-item prop="name" label="应用名称">
        <el-input v-model="appDetail.name" style="width: 360px"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
            v-model="appDetail.appClassificationID"
            style="width: 360px"
            placeholder="选择应用分类"
        >
          <template v-for="item in classes">
            <el-option
                v-if="item.parentAppClassificationID"
                :key="item.appClassificationID"
                :label="item.appClassificationName"
                :value="item.appClassificationID"
            ></el-option>
          </template>
        </el-select>
        <div class="inputdesc">为了适应前台展示，应用只能属于二级分类</div>
      </el-form-item>
      <el-form-item label="所属组织">
        <el-select
            v-model="appDetail.orgID"
            placeholder="请选择所属组织"
            style="width: 360px"
        >
          <el-option
              v-for="item in myorgs"
              :key="item.orgID"
              :label="item.name"
              :value="item.orgID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tags" label="标签">
        <el-select
            v-model="appDetail.tags"
            multiple
            filterable
            style="width: 360px"
            placeholder="请输入或选择应用标签"
        >
          <el-option
              v-for="item in existTags"
              :key="item"
              :label="item"
              :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="8" class="appsFrom">
          <el-form-item
              label="应用Logo"
              ref="uploadpic"
              class="el-form-item-cen"
              prop="logo"
          >
            <el-upload
                class="avatar-uploader"
                :action="uploadConfig.api"
                :with-credentials="true"
                :headers="uploadConfig.headers"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-error="handleAvatarError"
                :before-upload="beforeAvatarUpload"
            >
              <img v-if="appDetail.logo" :src="appDetail.logo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              <i
                  v-if="appDetail.logo"
                  class="el-icon-delete"
                  @click.stop="() => handleRemove()"
              ></i>
            </el-upload>
            <span style="color: #999999; font-size: 12px">
              建议上传 100*100 比例的Logo
            </span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item prop="desc" label="应用简介">
        <el-input
            type="textarea"
            v-model="appDetail.desc"
            :rows="3"
            style="width: 360px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="introduction" label="应用详情">
        <div style="border: 1px solid #ccc; ">
          <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editor"
              :defaultConfig="toolbarConfig"
              :mode="mode"
              class="barStyle"
          />
          <Editor
              style="height: 500px; overflow-y: hidden;"
              v-model="appDetail.introduction"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="onCreated"
              class="editorStyle"
          />
        </div>
      </el-form-item>
    </el-form>
    <el-button
        class="save_btn"
        type="primary"
        @click="onSubmit"
        :loading="commitLoading"
    >保存</el-button
    >
  </div>
</template>

<script>
import { updateApp } from '@/api/app';
import { getStoreAvailableTags } from '@/api/appStore';
import { getToken } from '@/utils/auth';
import axios from 'axios';
import { errorHandle } from '../../../../utils/error';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, DomEditor, IEditorConfig } from '@wangeditor/editor';
export default {
  name: 'BasicInfo',
  components: { Editor, Toolbar },
  props: {
    appDetail: {
      type: Object
    },
    marketID: {
      type: String
    },
    Loading: Boolean
  },
  data () {
    var baseDomain = process.env.BASE_API;
    if (baseDomain == '/') {
      baseDomain = window.location.origin;
    }
    const isChinese = (temp) => {
      return /^[\u4e00-\u9fa5]+$/i.test(temp);
    };
    const tagValidate = (rule, value, callback) => {
      let checked = true;
      value.map((tag) => {
        if (tag.length < 2) {
          callback('每个标签至少两个字符');
          checked = false;
          return;
        }
        if (isChinese(tag) && tag.length > 5) {
          callback('中文标签字数应处于2-5个之间');
          checked = false;
          return;
        }
        if (Number(tag) > 0) {
          callback('标签不能为纯数字组成');
          checked = false;
        }
      });
      if (checked) {
        callback();
      }
    };
    return {
      editor: null,
      toolbarConfig: {
        excludeKeys: ['uploadVideo', 'fullScreen', 'emotion', 'insertTable']
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          uploadImage: {
            customUpload: this.uploadImg
          }
        }
      },
      mode: 'default', // or 'simple'
      commitLoading: false,
      classes: [],
      existTags: [],
      appPublishTypes: [
        {
          value: 'public',
          label: '免费公开'
        },
        {
          value: 'integral',
          label: '金额销售'
        },
        {
          value: 'private',
          label: '私有'
        },
        {
          value: 'show',
          label: '展览'
        }
      ],
      uploadConfig: {
        api: `${baseDomain}/app-server/uploads/picture`,
        headers: {
          Authorization: getToken()
        }
      },
      editorOption: {},
      rules: {
        name: [
          { required: true, message: '应用名称不能为空', trigger: 'blur' },
          { min: 2, message: '至少两个字符', trigger: 'blur' },
          { max: 24, message: '应用名称建议不超过24个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '应用简介不能为空', trigger: 'blur' },
          { min: 10, message: '至少10个字符', trigger: 'blur' },
          { max: 82, message: '描述最多82个字符', trigger: 'blur' }
        ],
        introduction: [
          { max: 10140, message: '描述最多10240个字符', trigger: 'blur' }
        ],
        tags: [{ validator: tagValidate, trigger: 'change' }]
      }
    };
  },
  created () {
    this.fetchStoreAppClassList();
    this.fetchStoreAppTags();
  },
  computed: {
    myorgs () {
      return this.$store.state.user.userOrgs;
    }
  },

  methods: {
    uploadImg (file, insertFn) {
      const imgData = new FormData();
      imgData.append('file', file);
      axios({
        url: this.uploadConfig.api,
        method: 'post',
        data: imgData
      }).then((response) => {
        insertFn(response.data.FileURL);
      });
    },
    onCreated (editor) {
      this.editor = Object.seal(editor);
    },
    fetchStoreAppTags () {
      getStoreAvailableTags({
        marketID: this.marketID,
        size: -1
      })
        .then((res) => {
          if (res && res.tags) {
            const tags = [];
            res.tags.map((item) => {
              tags.push(item.name);
            });
            this.existTags = tags;
          }
        })
        .catch((err) => {
          this.Loading = false;
        });
    },
    fetchStoreAppClassList () {
      this.$store
        .dispatch('GetStoreAppClassificationList', {
          marketID: this.marketID,
          disableTree: true
        })
        .then((res) => {
          if (res) {
            this.classes = res;
          }
        })
        .catch(() => {});
    },
    fetchUserOrgs () {
      this.$store
        .dispatch('GetUserOrgList')
        .then((res) => {
          if (res) {
            this.myorgs = res;
          }
        })
        .catch(() => {});
    },
    markdownContentUpdate (md, render) {
      this.appData.introduction_html = render;
    },
    markdownImgAdd (pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData();
      formdata.append('file', $file);
      axios({
        url: this.api,
        method: 'post',
        data: formdata,
        headers: this.Token
      }).then((re) => {
        if (re && re.data && re.data.data) {
          this.$refs.md.$img2Url(pos, re.data.data);
        }
      });
    },
    handleAvatarSuccess (res, file) {
      this.appDetail.logo = res.FileURL;
    },
    handleAvatarError (re) {
      if (re.code == 10024) {
        this.$message.warning(
          '上传图片类型不支持，请上传以.png .jpg .jpeg 结尾的图片'
        );
        return;
      }
      this.$message.warning('上传失败!');
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isPng = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPng) {
        this.$message.warning('上传Logo图片只能是JPG、PNG格式!');
      }
      if (!isLt2M) {
        this.$message.warning('上传头像图片大小不能超过 2MB!');
      }
      return (isJPG || isPng) && isLt2M;
    },
    handleRemove () {
      this.$confirm('是否删除logo', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.appDetail.logo = '';
      });
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    changeSelectApp_type_id (value) {
      this.appData.app_type_id = value;
      this.$forceUpdate();
    },
    changeSelectPublish_type (value) {
      this.appData.publish_type = value;
      this.$forceUpdate();
    },
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.commitLoading = true;
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              updateApp(this.appDetail)
                .then((res) => {
                  this.$message.success('应用信息更新成功');
                  this.commitLoading = false;
                })
                .catch((err) => {
                  errorHandle(err);
                  this.commitLoading = false;
                });
            })
            .catch(() => {
              this.commitLoading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped >
.app_detail {
  position: relative;
  padding-bottom: 20px;
  .save_btn {
    margin-left: 80px;

  }
  .el-select {
    width: 100%;
  }
}
.editorStyle{
  /deep/ .w-e-text-container>.w-e-scroll>div ol li{
    list-style: auto ;
  }
  /deep/ .w-e-text-container>.w-e-scroll>div ul li{
    list-style: disc ;
  }
  /deep/ .w-e-text-placeholder{
    top:7px;
  }

}
.barStyle{
  /deep/ .w-e-bar-item{
    padding:2.5px
  }
  /deep/ .w-e-bar-item > button >.title{
    border-left:0 !important;
  }
}
</style>
<style src="@wangeditor/editor/dist/css/style.css" >
.inputdesc {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
}
.app_detail img {
  width: auto;
}
.app_detail .ql-formats {
  line-height: 22px;
}
</style>

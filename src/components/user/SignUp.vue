<template>
  <div>
    <Header :select-keys="selectKeys"/>
    <a-layout>
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '24px',
          minHeight: '680px',
          width: '90%',
          margin: 'auto',
          marginTop: '1rem',
          marginBottom: '1rem',
        }"
      >
        <a-row :style="{ marginTop: '30px' }"></a-row>
        <a-row>
          <a-col
            :xs="{ span: 20, offset: 2 }"
            :sm="{ span: 20, offset: 1 }"
            :md="{ span: 18, offset: 2 }"
            :lg="{ span: 16, offset: 2 }"
            :xl="{ span: 10, offset: 5 }"
          >
            <a-form :form="form" @submit="handleSubmit">
              <a-form-item v-bind="formItemLayout">
                <span slot="label">
                  用户名
                </span>
                <a-input
                  v-decorator="[
                    'username',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入你的用户名!',
                          whitespace: true,
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>

              <a-form-item v-bind="formItemLayout" label="邮箱地址">
                <a-input
                  v-decorator="[
                    'email',
                    {
                      rules: [
                        {
                          type: 'email',
                          message: '邮箱格式不合法!',
                        },
                        {
                          required: true,
                          message: '请输入你的邮箱!',
                        },
                      ],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item v-bind="formItemLayout" label="密码" has-feedback>
                <a-input
                  v-decorator="[
                    'password',
                    {
                      rules: [
                        {
                          required: true,
                          message: '密码长度不能小于6!',
                          min: 6,
                        },
                        {
                          validator: validateToNextPassword,
                        },
                      ],
                    },
                  ]"
                  type="password"
                />
              </a-form-item>
              <a-form-item
                v-bind="formItemLayout"
                label="确认密码"
                has-feedback
              >
                <a-input
                  v-decorator="[
                    'confirm',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请确认你的密码',
                        },
                        {
                          validator: compareToFirstPassword,
                        },
                      ],
                    },
                  ]"
                  type="password"
                  @blur="handleConfirmBlur"
                />
              </a-form-item>

              <a-form-item label="性别" v-bind="formItemLayout">
                <a-select
                  v-decorator="[
                    'gender',
                    {
                      rules: [
                        { required: true, message: '请输入选择你的性别!' },
                      ],
                    },
                  ]"
                  placeholder="Select your gender"
                >
                  <a-select-option value="男">
                    男
                  </a-select-option>
                  <a-select-option value="女">
                    女
                  </a-select-option>
                  <a-select-option value="secret">
                    秘密
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="学院" v-bind="formItemLayout">
                <a-select
                  v-decorator="[
                    'academy',
                    { rules: [{ required: true, message: '请选择你的学院!' }] },
                  ]"
                  placeholder="Select your academy"
                >
                  <a-select-option
                    v-for="academy in academies"
                    :value="academy"
                    :key="academy"
                  >
                    {{ academy }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="年级" v-bind="formItemLayout">
                <a-select
                  v-decorator="[
                    'grade',
                    { rules: [{ required: true, message: '请选择你的年级!' }] },
                  ]"
                  placeholder="Select your grade"
                >
                  <a-select-option
                    v-for="grade in grades"
                    :value="grade"
                    :key="grade"
                  >
                    {{ grade }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item v-bind="tailFormItemLayout">
                <a-button
                  type="primary"
                  html-type="submit"
                  :style="{ float: 'right' }"
                >
                  注册
                </a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
    <Footer />
  </div>
</template>

<script>
import Footer from "../common/Footer";
import Header from "../common/Header";
import qs from "qs";

export default {
  name: "SignUp",
  components: { Footer, Header },
  data() {
    return {
      selectKeys: [],
      confirmDirty: false,
      autoCompleteResult: [],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
      academies: ["电院", "安泰管理学院"], // 可以动态请求
      grades: ["大一", "大二", "大三", "大四", "其他"],
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  mounted(){
this.set_academy()
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
          this.$axios
            .post(
              "/api/user/signup/",
              qs.stringify({
                username: values.username,
                email: values.email,
                password: values.password,
                gender: values.gender,
                academy: values.academy,
                grade: values.grade,
              })
            )
            .then((res) => {
              if (res.data.status === 200) {
                this.$message.success(res.data.message);
                this.$router.push("/");
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => console.log(err));
        }
      });
    },
    handleConfirmBlur(e) {
      const value = e.target.value;
      this.confirmDirty = this.confirmDirty || !!value;
    },
    compareToFirstPassword(rule, value, callback) {
      const form = this.form;
      if (value && value !== form.getFieldValue("password")) {
        callback("两次输入的密码不一致!");
      } else {
        callback();
      }
    },
    validateToNextPassword(rule, value, callback) {
      const form = this.form;
      if (value && this.confirmDirty) {
        form.validateFields(["confirm"], { force: true });
      }
      callback();
    },
    set_academy(){
      return new Promise((resolve, reject)=>{
        this.$axios.get("/api/course/get_all_school").then(res=>{
          this.academies = res.data.map(value=> value.school)
          resolve()
        }).catch(err=>{
          console.log(err)
          reject()
        })
      })
    }
  },
};
</script>

<template>
  <div class="login-container">
    <!-- 
          潘家成模板:结构的布局大多数采用的element-ui里面的组件
          el-form:element-ui里面组件,经常与el-form-item一起使用,他们两者是一对CP
       -->
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!--顶部标题的结构-->
      <div class="title-container">
        <h3 class="title">后台管理系统</h3>
      </div>

      <!--el-form-item:经常结合form组件一起使用,它代表的是一个表单域(经常放置的是表单元素)-->
      <!--用户名的结构-->
      <el-form-item prop="username">
        <!--用户名左侧小图标-->
        <span class="svg-container">
          <!-- 这是潘家成帮我们封装好的图标的全局组件 -->
          <svg-icon icon-class="tree" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请你输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!--密码的结构-->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请你输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <!--密码右侧眼睛切换  -->
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
      </el-form-item>

      <!-- 登录按钮 -->
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >

      <div class="tips">
        <span style="margin-right: 20px">用户名: admin</span>
        <span>密码: any</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
//表单验证规则函数
//用户名验证规则函数
const validateUsername = (rule, value, callback) => {
  //rule:人家注入的参数,验证规则对象没啥用
  //value:用户输入文本内容
  //callBack:函数,放行函数
  if (value.length >= 5) {
    //验证成功
    callback();
  } else {
    //验证失败
    callback(new Error('用户名的长度需要大于等于5位'))
  }
};
//密码验证规则的函数
const validatePassword = (rule, value, callback) => {
       if(value.length>=6){
         callback();
       }else{
         callback(new Error('用户密码长度需要6位以上'))
       }
};
export default {
  name: "Login",
  data() {
    return {
      //收集用户名与密码的属性
      loginForm: {
        username: "admin",
        password: "111111",
      },
      //表单验证规则
      loginRules: {
        //验证用户名规则
        //require:true,代表用户名这个表单数据必须要验证
        //trigger:'blur',什么时间段去进行表单验证 blur：失却焦点  change:当文本发生变化就会立即进行表单验证
        //validator：校验器含义
        username: [
          { required: true, trigger: "change", validator: validateUsername },
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword },
        ],
      },
      //控制按钮是否加载的数据
      loading: false,
      //控制密码右侧眼睛睁开|还是闭上
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    //右侧眼睛切换类名的事件回调
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      //点击眼睛的时候,要保证el-input聚焦状态
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    //登录的业务
    handleLogin() {
      //点击登录按钮的时候,获取el-form组件实例,在发请求之前,表单全部的内容都要进行校验
      this.$refs.loginForm.validate((valid) => {
        //全部表单内容复合校验规则
        if (valid) {
          //开始让按钮的loading开始转动
          this.loading = true;
          //派发action
          this.$store.dispatch("user/login", this.loginForm).then(() => {
              //登录成功
              this.$router.push({ path: this.redirect || "/" });
              //登录成功以后loading效果消失
              this.loading = false;
            })
            .catch(() => {
              //登录失败loading效果消失
              this.loading = false;
            });
        } else {
        //表单元素出现不符合条件校验规则
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url(~@/assets/bg.png);
  background-color: #2d3a4b;
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<template>
  <div>
    <!-- 添加品牌的按钮 -->
    <el-button
      type="primary"
      size="default"
      icon="el-icon-plus"
      @click="addTradeMark"
      >添<i class="el-icon-s-data"></i>加</el-button
    >
    <!-- table表格:展示品牌数据
        el-table:element-ui里面提供表格组件 
                 -- border属性,给表格添加边框
                 --data,这个属性的作用代表的是table需要展示的数据,务必是数组
        el-table-column:组件一起使用,代表是一列
                 --label:设置每一列的标题
                 --width:设置每一列站的宽度
                 --align:可以设置每一列文字对齐方式  默认数值left center right
                 --prop:当前这一列展示数据的字段[K的名字]
                 --type:index,代表的是显示的索引值从数字1开始  selection/index/expand
       -->
    <el-table border style="margin: 20px 0px" :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width></el-table-column>
      <el-table-column label="品牌LOGO" width>
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" width="100px" height="100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width>
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-popconfirm
            confirm-button-text="我确定删除"
            cancel-button-text="考虑"
            icon="el-icon-delete"
            icon-color="hotpink"
            :hide-icon="false"
            @onConfirm="deleteTradeMark(row.id)"
            :title="`你确定删除${row.tmName}?`"
          >
            <el-button
              slot="reference"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              style="margin: 0px 10px"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
        el-pagination:element-ui提供分页器组件
          ---current-page:代表分页器当前页码
          ---page-size:代表的是一页展示几条数据
          ---page-sizes:设置下拉框数据[可以设置一页展示多少条数据]
          ---total:分页器一共需要展示多少条数据
          ---background:设置页码背景颜色
          ---pager-count:代表是分页器连续页码数
          ---layout:调整分页器，子组件布局的
          ---将分页器的英语换成中文：去入口文件把潘家成的中文打开、英语关闭就显示中文了
          background:background='true'
      -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 9]"
      :total="total"
      background
      :pager-count="9"
      prev-text="上一页"
      next-text="下一页"
      layout="prev, pager, next,jumper,->,total,sizes"
      @current-change="getTradeMarkList"
      @size-change="sizeHandler"
    >
    </el-pagination>
    <!--对话框组件
        el-dialog组件:
                ---title:设置对话框的标题的
                ---visible:控制对话框显示与隐藏的 [真：显示对话框,假不显示对话框]
        el-form:表单组件
            el-form-item
                       ---label:标签文本
                       ---label-width:设置标签文本的宽度
    -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- el-form
           model:代表的是表单数据收集到那个对象的身上,如果你想进行表单验证，model一般需要添加上
           rules:表单验证的规则设置
       -->
      <el-form :model="tmForm" :rules="rules" ref="box">
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--el-upload
               ---action:上传图片的地址,替换为学校的真实服务器地址,如果你不添加/dev-api,post请求代理服务器不工作
               ---show-file-list:是否显示已上传文件列表
               ---on-success:上传图片成功的钩子函数
               ---before-upload:上传图片成功之前的钩子
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <!-- img标签:展示图片 -->
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-upload avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//校验规则函数---品牌名字
const validatorTmName = (rule, value, callBack) => {
  //rule:校验规则对象---没啥用
  //value:校验字段数值
  //callBack放行函数
  if (
    /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/.test(
      value
    )
  ) {
    callBack();
  } else {
    callBack(new Error("亲爱的品牌的名字为手机号码"));
  }
};

//品牌LOGO
const validatorLogoUrl = (rule, value, callBack) => {
  if (value) {
    callBack();
  } else {
    callBack(new Error("请你上传图片"));
  }
};

export default {
  name: "",
  data() {
    return {
      //代表当前第几页
      page: 1,
      //每一页展示多少条数据
      limit: 3,
      //将来存储品牌的数据
      records: [],
      //品牌数据的总条数
      total: 0,
      //控制对话框的显示与隐藏
      dialogFormVisible: false,
      //收集品牌的数据,就来带给服务器的参数
      tmForm: {
        //收集品牌名称
        tmName: "",
        //收集品牌的图片地址
        logoUrl: "",
      },
      //表单验证规则书写的地方
      //数组里面是书写校验规则的,每一个校验规则都是一个配置对象[配置对象的K不能瞎写]
      rules: {
        tmName: [
          //required:代表当前字段必须要检验的，前面会出现五角星
          //min:代表字段长度最小是多少
          //max:代表字段长度最多时候多少
          //message:是错误的提示信息
          //trigger:触发校验事件  blur|change
          //下面校验规则写法好吗？认为不好?想验证邮箱|身份证号|手机号根本没办法验证！！！
          // {
          //   required: true,
          //   min: 3,
          //   max: 5,
          //   message: "亲爱的长度在3~5为",
          //   trigger: "blur",
          // },
          //自定义校验规则---王者
          { trigger: "blur", validator: validatorTmName, required: true },
        ],
        logoUrl: [
          // { required: true, message: "亲爱的请你选择一个图片" }
          { required: true, validator: validatorLogoUrl },
        ],
      },
    };
  },
  //当组件挂载完毕的时候,先获取一次品牌的数据
  mounted() {
    this.getTradeMarkList();
  },
  methods: {
    //获取品牌的方法
    async getTradeMarkList(pager = 1) {
      //整理参数
      this.page = pager;
      //发请求，获取品牌的数据:获取品牌的接口，需要两个参数page|limit
      const { page, limit } = this;
      let result = await this.$ajax.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //品牌的数据
        this.records = result.data.records;
        //保存总条数
        this.total = result.data.total;
      }
    },
    //当每一条展示的数据发生变化的时候会触发
    sizeHandler(limit) {
      //整理参数
      this.limit = limit;
      //再次发请求
      this.getTradeMarkList();
    },
    //添加品牌按钮的回调
    addTradeMark() {
      //显示对话框
      this.dialogFormVisible = true;
      //清空数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
      //每一次显示dialog除了清空数据，还需要把错误提示信息重置
      //nextTick:当数据发生变化的时候,获取更新的DOM结构
      this.$nextTick(() => {
        this.$refs.box.resetFields();
      });
    },
    //图片上传成功的钩子
    handleAvatarSuccess(res, file) {
      //res:服务器返回的数据,其中包含学校服务器远程上传这张图片的远程地址
      //file:上传图片信息
      //收集图片的地址[res.data----即为图片远程地址]
      this.tmForm.logoUrl = res.data;
    },
    //图片上传成功之前的钩子
    beforeAvatarUpload(file) {
      //file:上传这张图片的信息
      //注意:上传图片jpg|png|gif等等
      //判断上传图片是不是jpg
      const isJPG = file.type === "image/jpeg" || "image/png";
      //约束上传图片的大小，小于2M
      const isLt2M = file.size / 1024 / 1024 < 4;
      //提示:上传并非是jpg图片
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加或者修改品牌确定按钮回调
    addOrUpdateTradeMark() {
      //通过tmForm携带给服务器参数，是否有ID区分添加还是修改
      //第一步：整理参数
      //第二步:发请求
      //第三步:成功与失败的判断
      //保证全部的表单元素验证通过以后在发请求
      this.$refs.box.validate(async (success) => {
        //如果全部表单验证通过
        if (success) {
          try {
            //添加|修改品牌发请求地方
            await this.$ajax.trademark.reqAddOrUpdateTradeMark(this.tmForm);
            //隐藏对话框
            this.dialogFormVisible = false;
            //添加|修改品牌成功的提示
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            //再次获取最新的全部品牌的数据
            //如果是修改：分页器留在当前页,如果是新增，分页器留在第一页
            this.getTradeMarkList(this.tmForm.id ? this.page : 1);
          } catch (error) {
            this.$message({
              message: this.tmForm.id ? "修改品牌失败" : "添加品牌失败",
              type: "warning",
            });
          }
        } else {
          //有字段验证失败的判断
          console.log("error submit!!");
          return false;
        }
      });
    },
    //修改某一个品牌的数据按钮的回调
    //row：即为用户修改的品牌
    updateTradeMark(row) {
      //需要展示对话框
      this.dialogFormVisible = true;

      //修改按钮重置错误提示信息
      this.$nextTick(() => {
        //resetFields:永远设置为起始数值
        this.$refs.box.resetFields();
        //将修改的品牌的数据赋值给tmForm
        this.tmForm = {
          ...row,
        };
      });
    },
    async deleteTradeMark(id) {
      //整理参数
      //发请求，删除请求
      //成功干什么
      //失败干什么
      try {
        await this.$ajax.trademark.reqDeleteById(id);
        //提示
        this.$message({
          message: "删除品牌成功",
          type: "success",
        });
        //再次获取最新的品牌的数据
        //删除品牌的数据的时候:如果已有品牌的个数大于1留在当前页
        //如果已有品牌的个数小于等于1，删除完毕应该回到上一页
        this.getTradeMarkList(
          this.records.length > 1 ? this.page : this.page - 1
        );
      } catch (error) {
        this.$message({
          message: "删除品牌失败",
          type: "error",
        });
      }
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="addTrademark">添加</el-button>

    <!-- 表格内容 -->
    <el-table align="center" :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <el-table-column width="80" type="index" align="center" label="序号"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTrademark(row)">修改</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTrademark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination @size-change="handleSizeChange" @current-change="getTrademarkList" :current-page="page" :pager-count="5" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" style="text-align: center">
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="isShowDialog">
      <el-form :model="tmForm" style="width: 80%">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      isShowDialog: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      try {
        let result = await this.$API.trademark.getTradeMarkList(
          this.page,
          this.limit
        );
        if (result.code == 200) {
          this.$message.success("获取品牌列表成功");
          this.trademarkList = result.data.records;
          this.total = result.data.total;
        }
      } catch (error) {
        this.$message.error("获取品牌列表失败");
      }
    },
    // handleCurrentChange(page) {
    //   this.page = page;
    //   this.getTrademarkList();
    // },
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      let typeArr = ["image/jpeg", "image/png"];
      const isJPGOrPNG = typeArr.indexOf(file.type) != -1;
      const isLt500K = file.size / 1024 < 500;
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPGOrPNG) {
        this.$message.error("上传图片只能是JPG或PNG格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传图片大小不能超过500KB!");
      }
      return isJPGOrPNG && isLt500K;
    },
    async addOrUpdateTrademark() {
      try {
        let result = await this.$API.trademark.addAndUpdate(this.tmForm);
        this.isShowDialog = false;
        if (result.code == 200) {
          this.$message.success(
            this.tmForm.id ? "修改品牌数据成功" : "添加品牌数据成功"
          );
          this.getTrademarkList(this.tmForm.id ? this.page : 1);
        }
      } catch (error) {
        this.$message.error(
          this.tmForm.id ? "修改品牌数据失败" : "添加品牌数据失败"
        );
      }
    },
    addTrademark() {
      this.isShowDialog = true;
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    updateTrademark(row) {
      this.isShowDialog = true;
      this.tmForm = { ...row };
    },
    async deleteTrademark(row){
      this.$confirm(`您确定要删除${row.tmName}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            let result = await this.$API.trademark.deleteBrand(row.id)
            if(result.code==200){
              this.$message({
                type: 'success',
                message: '删除品牌数据成功'
              });
              // 如果删除的数据在当前页只有一条数据则返回上一页,否则留在当前页
              console.log(this.trademarkList.length)
              this.getTrademarkList(this.trademarkList.length>1? this.page:this.page-1)
            }
          } catch (error) {
            this.$message({
              type: 'error',
              message: '删除品牌数据失败'
            });
          }
        })
        .catch(action => {
          this.$message({
            type: 'info',
            message:'已取消删除品牌数据'
          })
        });
    }
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

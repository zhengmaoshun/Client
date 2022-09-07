<template>
  <div>
    <div>
      <Category @changeCategory="changeCategory" />
    </div>
    <el-card style="margin-top: 20px">
      <el-button type="primary">添加</el-button>
      <el-table style="width: 100%">
        <el-table-column prop="prop" label="label" width="width">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data() {
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[]
    }
  },
  methods:{
    changeCategory({categoryId,level}){
      if(level==1){
        this.category1Id = categoryId;

        // 重新选择一级分类,父组件要清空二级三级id以及属性列表
        this.category2Id='';
        this.category3Id='';
        this.attrList=[];

      }else if(level==2){
        this.category2Id = categoryId;

        // 重新选择二级分类,父组件要清空三级id以及属性列表
        this.category3Id='';
        this.attrList=[];

      }else{
        this.category3Id = categoryId;
        // 点完三级分类发请求获取属性列表数据
        this.getAttrList()
      }
    },
    async getAttrList(){
      let {category1Id,category2Id,category3Id} = this;
      try {
        let result = await this.$API.attr.reqAttrList(category1Id,category2Id,category3Id);
        if(result.code==200){
          this.attrList = result.data;
        }else{
          this.$message.error("获取属性列表失败")
        }
      } catch (error) {
        this.$message({
          message:'请求属性列表失败',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
</style>

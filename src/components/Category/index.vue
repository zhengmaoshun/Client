<template>
  <div>
    <el-card>
      <el-form :inline="true" :model="cForm" class="demo-form-inline">
        <el-form-item label="一级分类列表">
          <el-select v-model="cForm.category1Id" placeholder="请输入" @change="handlerCategory1">
            <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in category1List" :key="c1.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类列表">
          <el-select v-model="cForm.category2Id" placeholder="请输入" @change="handlerCategory2">
            <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in category2List" :key="c2.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类列表">
          <el-select v-model="cForm.category3Id" placeholder="请输入" @change="handlerCategory3">
            <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in category3List" :key="c3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Category',
  data(){  
    return{
      cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:'',
      },
      category1List:[],
      category2List:[],
      category3List:[]
    }        
  },
  mounted() {
   this.getCategory1List() //获取一级分类列表
  },
  methods: {
    // 页面挂载完成,请求获取一级分类列表
    async getCategory1List(){
      try {
        let result = await this.$API.category.getCategorys1();
        if(result.code==200){
          this.category1List=result.data
        }
      } catch (error) {
        this.$message.error("请求获取一级分类列表失败")
      }
    },
    // 选中一级分类,获取对应的二级分类的值
    async handlerCategory1(category1Id){

      // 一级分类重新选择的时候清空二级三级分类列表数据和收集的id
      this.cForm.category2Id = '';
      this.cForm.category3Id = '';
      this.category2List = [];
      this.category3List = [];

      // 给父页面分发1id,用来获取属性列表数据
      this.$emit('changeCategory',{categoryId:category1Id,level:1})

      try {
        let result = await this.$API.category.getCategorys2(category1Id);
        if(result.code==200){
          this.category2List=result.data
        }
      } catch (error) {
        this.$message.error("请求获取一级分类列表失败")
      }
    },
    // 选中二级分类,获取对应的三级分类的值
    async handlerCategory2(category2Id){

      // 二级分类重新选择的时候清空三级分类列表数据和收集的id
      this.cForm.category3Id = '';
      this.category3List = [];

      // 给父页面分发2id,用来获取属性列表数据
      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      try {
        let result = await this.$API.category.getCategorys3(category2Id);
        if(result.code==200){
          this.category3List=result.data
        }
      } catch (error) {
        this.$message.error("请求获取一级分类列表失败")
      }
    },
    // 选中三级分类,请求列表全部数据
    handlerCategory3(category3Id){
      // 给父页面分发3id,用来获取属性列表数据
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
    }
  },        
}
</script>

<style>

</style>

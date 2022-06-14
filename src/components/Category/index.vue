<template>
  <div>
    <!--
        卡片组件:带有阴影的盒子
         el-card:
              shadow:设置阴影的时机  always / hover / never
              body-style:设置内容的样式
        el-form:
              ---inline,设置为true,行内form!!!一行可以放置多个item
        el-select:
              ---multiple:多选
              ---disabled:禁用
              ---clearable:清空选项
              ---placeholder:占位符
              ---change事件：当选中的数值发生变化的时候出发
      -->
    <el-card shadow="hover" :body-style="{ padding: '20px' }">
      <!--表单元素经常进行表单验证,表单验证model rule结合使用-->
      <el-form :inline="true" :model="attrForm">
        <el-form-item label="一级分类">
          <el-select
            placeholder="请选择分类"
            v-model="attrForm.c1Id"
            @change="c1Handler"
          >
            <!--下拉框显示内容的设置 value:将来select收集的数据-->
            <el-option
              :label="c1.name"
              :value="c1.id"
              v-for="(c1, index) in c1Arr"
              :key="c1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            placeholder="请选择分类"
            v-model="attrForm.c2Id"
            @change="c2Handler"
          >
            <!--下拉框显示内容的设置-->
            <el-option
              :label="c2.name"
              :value="c2.id"
              v-for="(c2, index) in c2Arr"
              :key="c2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select placeholder="请选择分类" v-model="attrForm.c3Id" @change="c3Handler">
            <!--下拉框显示内容的设置-->
            <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in c3Arr" :key="c3.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      //一级分类的数据数组
      c1Arr: [],
      //二级分类的数据数组
      c2Arr: [],
      //三级分类的数据数组
      c3Arr:[],
      //表单收集数据
      attrForm: {
        c1Id: "",
        c2Id: "",
        c3Id:''
      },
    };
  },
  mounted() {
    //获取一级分类的数据
    this.getCategory1();
  },
  methods: {
    //获取一级分类的函数
    async getCategory1() {
      //一级分类请求函数:不需要携带任何参数
      let result = await this.$ajax.attr.reqGetCategory1();
      if (result.code == 200) {
        this.c1Arr = result.data;
      }
    },
    //一级分类select的change事件,获取二级分类的数据
    async c1Handler() {
      //子给父传递数据:传递一级分类的ID
      this.$emit('getCategoryId',{id:this.attrForm.c1Id,flag:'一级'});
      //收集的数据ID清除(二、三级ID),下拉框中间显示文字消失了
      this.attrForm.c2Id = '';
      this.attrForm.c3Id = '';
      //清空数组的数据，option使用的数据
      this.c2Arr = [];
      this.c3Arr = [];
      let result = await this.$ajax.attr.reqGetCategory2(this.attrForm.c1Id);
      if (result.code == 200) {
        this.c2Arr = result.data;
      }
    },
    //二级分类select的chang事件,获取三级分类的数据
    async c2Handler() {
      //触发自定义事件，给父组件传递数据
      this.$emit('getCategoryId',{id:this.attrForm.c2Id,flag:'二级'});
      this.attrForm.c3Id = '';
      this.c3Arr = [];
      //获取三级分类的数据
      let result = await this.$ajax.attr.reqGetCategory3(this.attrForm.c2Id);
       if(result.code==200){
         this.c3Arr = result.data;
       }
    },
    //三级分类select的change事件
    c3Handler(){
         this.$emit('getCategoryId',{id:this.attrForm.c3Id,flag:'三级'});
    }
  },
};
</script>

<style scoped>
</style>

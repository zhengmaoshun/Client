<template>
  <div>
    <!--当前平台属性组件的子组件:三级分类子组件-->
    <Category @getCategoryId="getCategoryId"></Category>
    <el-card
      shadow="always"
      :body-style="{ padding: '20px' }"
      style="margin: 20px 0px"
    >
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          round
          :disabled="c3 ? false : true"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border stripe style="margin: 20px 0px" :data="attrArr">
          <el-table-column label="序号" width="80" align="center" type="index">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="120">
          </el-table-column>
          <el-table-column label="属性值" width>
            <template slot-scope="{ row, $index }">
              <!---属性值地方-->
              <el-tag
                style="margin: 5px"
                hit
                effect="dark"
                :type="attrValue.id % 2 == 0 ? 'success' : 'warning'"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                circle
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene == 1">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="属性名">
            <el-input
              placeholder="属性名"
              size="normal"
              prefix-icon="el-icon-mouse"
              v-model="attrForm.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="attrForm.attrName ? false : true"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table
          border
          stripe
          style="margin: 20px 0px"
          :data="attrForm.attrValueList"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          ></el-table-column>
          <el-table-column label="属性名称" width>
            <template slot-scope="{ row, $index }">
              <!--编辑模式的input
                    blur：失却焦点
                    change:键盘事件,自定义事件
                    @keydown.native.enter原生DOM事件
               -->
              <el-input
                :ref="$index"
                v-model="row.valueName"
                size="mini"
                v-if="row.show"
                @blur="toLook(row)"
                @keydown.native.enter="toLook(row)"
              ></el-input>
              <div v-else @click="toEdit(row,$index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width>
            <template slot-scope="{row,$index}">
               <el-button type="danger" size="mini" icon="el-icon-delete" @click="attrForm.attrValueList.splice($index,1)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          size="default"
          icon="el-icon-office-building"
          :disabled="attrForm.attrValueList.length ? false : true"
          @click="save"
          >保存</el-button
        >
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入
import uniqBy from "lodash/unionBy";
//深拷贝函数
import cloneDeep from 'lodash/cloneDeep'
//下面这种写法:全部引入
// import  _ from 'lodash';
export default {
  name: "",
  data() {
    return {
      //一级、二级、三级分类ID
      c1: "",
      c2: "",
      c3: "",
      //存储分类下面属性与属性值
      attrArr: [],
      //控制场景切换属性
      scene: 0, //0 显示button、table  1代表显示form
      //需要携带给服务器的参数
      attrForm: {
        attrName: "",
        attrValueList: [],
        categoryId: "", //三级分类的ID
        categoryLevel: 3, //代表的是三级分类
      },
    };
  },
  methods: {
    //子组件自定义事件的回调
    getCategoryId({ id, flag }) {
      //父亲接受子组件传递过来的一级、二级、三级分类的ID
      switch (flag) {
        case "一级":
          this.c1 = id;
          //把下一级数据清空
          this.c2 = "";
          this.c3 = "";
          break;
        case "二级":
          this.c2 = id;
          //把下一级清空
          this.c3 = "";
          break;
        case "三级":
          this.c3 = id;
          //把获取某一个分类的属性与属性值封装一个函数
          this.getAttrList();
          break;
      }
    },
    //当父组件拥有三级分类的ID的时候，发请求获取相应的属性与属性值
    async getAttrList() {
      //整理参数
      const { c1, c2, c3 } = this;
      //发请求获取某一个三级分类的属性与属性值
      let result = await this.$ajax.attr.reqAttrList(c1, c2, c3);
      if (result.code == 200) {
        //这行代码在干什么:数组替换,vue能检测到数据变化->响应式数据
        this.attrArr = result.data;
        console.log(this.attrArr);
      }
    },
    //添加属性
    addAttr() {
      this.scene = 1;
      //点击添加属性按钮收集id
      // this.attrForm.categoryId = this.c3;
      //清空数据:清空属性的名字与属性值
      this.attrForm = {
        attrName: "",
        attrValueList: [],
        categoryId: this.c3,
        categoryLevel: 3,
      };
    },
    //取消按钮的回调
    cancel() {
      this.scene = 0;
    },
    //添加属性值按钮的回调
    addAttrValue() {
      //点击添加属性值按钮的时候,向咱们收集参数对象attrForm.attrValueList添加元素[新增的属性值]
      this.attrForm.attrValueList.push({
        valueName: "", //收集新增属性的属性值
        show: true, //给每一个新增的属性值对象,添加一个标记,控制自己的编辑模式与切换模式
      });

      //注意:数组添加的元素[对象],身上的属性[valueName、show]都是响应式数据！！！ 响应式数据->【数据发生变化，视图跟这变化】
      //为什么数组push元素都是响应式数据那? 数组的替换与变更
      //vue框架中数组的响应式数据只有两种手段:替换、变更[push|pop|shift|unshif|reverse|splice|sort]
      this.$nextTick(()=>{
       //获取input：点击添加属性值按钮以后新增的el-input一定是在最后位置 ref:数组长度减去1 
       this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });

    },
    async save() {
      //保存按钮：发请求之前,需要把不合理的参数处理一下
      //不合理的参数1:属性值当中包含空格的字符串，不应该带给服务器
      this.attrForm.attrValueList = this.attrForm.attrValueList.filter(
        (attrValue) => {
          //过滤出属性值有东西的参数
          return attrValue.valueName;
        }
      );
      //不合理参数2:有提示但是看不见，属性值有重复的
      this.attrForm.attrValueList = uniqBy(
        this.attrForm.attrValueList,
        "valueName"
      );
      //整理参数
      //发请求
      //成功干什么
      //失败干什么
      try {
        await this.$ajax.attr.reqAddOrUpdateAttr(this.attrForm);
        //切换场景为零
        this.scene = 0;
        this.$notify({
          title: "成功",
          message: this.attrForm.id ? "修改属性成功" : "添加属性成功",
          type: "success",
          position: "bottom-left",
          showClose: false,
        });
        //获取最新的全部的属性与属性值
        this.getAttrList();
      } catch (error) {
        this.$notify({
          title: "失败",
          message: this.attrForm.id ? "修改属性失败" : "添加属性失败",
          type: "error",
        });
      }
    },
    //el-input失却焦点事件，变为查看模式
    toLook(row) {
      //第一种非法情况:如果新增的属性值为空的字符串，不能展示div
      if (row.valueName.trim() == "") {
        //提示信息
        this.$message({
          type: "warning",
          message: "豪哥提示:属性的属性值不能为空的",
        });
        //遇见return后面的语句不在执行,也就展示不出div了
        return;
      }

      //第二种非法的情况:属性值重复了不应该出现  find查找数组的方法
      let repeat = this.attrForm.attrValueList.find((item) => {
        //查找是否重复的属性值，需要把自身抛出去
        if (item != row) {
          return item.valueName === row.valueName;
        }
      });

      //如果出现重复的：后面语句不在执行
      if (repeat) {
        this.$message({
          type: "warning",
          message: `豪哥提示:${repeat.valueName}重复了`,
        });
        return;
      }
      row.show = false; //失却焦点的时候,隐藏input，展示div
    },
    //div的点击事件,变为编辑模式
    toEdit(row,$index) {
      row.show = true;
      //当你点击div的时候,获取相应的el-input组件实例,让他聚焦
      //获取对应的el-input组件实例:this.$refs对象
      this.$nextTick(()=>{
        //focus:是el-input组件实例VC的一个方法可以让这个组件实现聚焦
         this.$refs[$index].focus();
      })
    },
    //修改已有的属性与属性值
    updateAttr(row){
      //点击修改按钮切换场景为1 
      this.scene = 1;
      //已有的属性与属性值需要展示出来
      //收集的参数[添加属性|修改属性携带的参数]进行赋值
      //将已有的属性与属性值赋值给attrForm->携带给服务器参数,由于属性值里面没有show字段，因此没有编辑与查看模式的切换!!!!
      //取消的时候:深拷贝数据
      //由于数据attrValueList，右侧是一个数组，引用类型数据{...row} 浅拷贝
      //lodash cloneDeep 深拷贝
      this.attrForm =cloneDeep(row);

      //赋值完毕以后,给每一个属性值追加一个show字段
      //数组的响应式检测检测:替换  变更:push|pop|shift|unshift|reverse|sort|splice
      this.attrForm.attrValueList.forEach(item=>{
             //这种追加的属性并非响应式属性
             //item.show = true!!!!!
             /*
                向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
                它必须用于向 响应式对象 上添加新 property，因为 Vue 无法探测普通的新增 property (
                $set:第一个参数,响应式对象  第二参数:给响应式对象追加的新增响应式属性名字   第三参数:响应式属性的数值
             */
            this.$set(item,'show',false);
      });


      //上面的写法能不能换成别的写法:数组的替换
      // this.attrForm.attrValueList =  this.attrForm.attrValueList.map(item=>{
      //       return {
      //          ...item,
      //          show:false
      //       }
      // });




    }
  },
};
</script>

<style scoped>
</style>

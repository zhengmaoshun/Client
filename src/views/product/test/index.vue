<template>
  <div>
    <div v-if="show" @click="handler">我是盒子div:点击div获取input</div>
    <input type="text" v-else ref="cur">
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      show:true,
    }
  },
  methods: {
    handler(){
       //当你点击div之前:input标签是没有的
       //当你点击div的时候,input----DOM结构才有【DOM结构是需要渲染时间】，不可能获取input
       this.show = false;
       //$nextTick:当数据发生修改以后，可以获取更新后的DOM
       this.$nextTick(()=>{
          console.log(this.$refs.cur);
       })
    }
  },
}
</script>

<style scoped>

</style>

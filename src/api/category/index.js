import request from '@/utils/request'
export default {
  // 查找一级列表
  getCategorys1(){
    return request.get('/admin/product/getCategory1')
  },
  // 查找二级列表
  getCategorys2(category1Id){
    return request.get('/admin/product/getCategory2/'+category1Id)
  },
  // 查找三级列表
  getCategorys3(category2Id){
    return request.get('/admin/product/getCategory3/' + category2Id)
  }
}
//平台属性接口
import request from '@/utils/request'
// 一级分类的接口
export const reqGetCategory1 = ()=>request({url:`/admin/product/getCategory1}`,method:'get'})
// 二级分类的接口
export const reqGetCateGory2 = (category1Id)=>request({url:`/admin/product/getCateGory2/${category1Id}`,method:'get'})
// 三级分类的接口
export const reqGetCateGory3 = (category2Id)=>request({url:`/admin/product/getCateGory3/${category2Id}`,method:'get'})
// 获取某一个三级分类下的全部的属性与属性值
export const reqAttrList = (category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// 添加属性/修改属性
export const reqAddOrUpdateAttr = (data)=>request({url:`/admin/product/saveAttrInfo`,method:'post',data})
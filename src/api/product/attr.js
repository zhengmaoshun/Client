//平台属性接口
import request from '@/utils/request'
// 获取某一个三级分类下的全部的属性与属性值
export const reqAttrList = (category1Id,category2Id,category3Id) =>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
// 添加属性/修改属性
export const reqAddOrUpdateAttr = (data)=>request({url:`/admin/product/saveAttrInfo`,method:'post',data})
// 删除品牌属性
export const reqDelete = (attrId)=>request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})

import request from "@/utils/request"

export default {
	// 删除某一个品牌的接口函数
	delete(id){
		return request.delete(`/admin/product/baseTrademark/remove/${id}`)
	},

	// 获取品牌列表数据接口(带分页)
	getTradeMarkList(page,limit){
		return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
	},

	// 添加品牌与修改品牌
	addAndUpdate(tradeMark){
		if(tradeMark.id){
			return request.put(`/admin/product/baseTrademark/update/${tradeMark}`)
		}else{
			return request.post(`/admin/product/baseTradeMark/save/${tradeMark}`)
		}
	}
}


	
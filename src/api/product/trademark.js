//品牌管理模块接口函数
import request from '@/utils/request';

//接口函数:获取品牌的列表数据接口
//admin/product/baseTrademark/{page}/{limit}  GET
//page:代表当前页码  limit:代表一页展示几条数据
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//接口函数:添加品牌与修改品牌:请求体携带的参数
export const reqAddOrUpdateTradeMark = (data) => {
    //如果请求参数中携带,修改接口
    if (data.id) {
        return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data })
    } else {
        //添加的接口
        return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data })
    }
}


//删除某一个品牌的接口函数
export const reqDeleteById = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'});
//index:将四个模块函数统一对外暴露
//品牌管理全部的接口函数引入
import * as trademark from './trademark'
import * as attr from './attr';
import * as spu from './spu';
import * as sku from './sku';

//统一对外暴露
export default {
    trademark,
    attr,
    spu,
    sku
}

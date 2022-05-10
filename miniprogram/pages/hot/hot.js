// pages/hot/hot.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
getData(){
    db.collection("demolist")
    .where({
        zan:_.gte(50)
    })
    .get()
    .then(res=>{
        dataList:res.data
    })
}
})
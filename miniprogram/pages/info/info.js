Page({
onLoad: function (options) {
this.setData({
    mid:options.id
})
    
    wx.request({
        url:"http://locaihost:80/item/中南民族大学"+options.id,
        method:"GET",
        data:{
       x:1,y:2
        },
        header:{

        },
        succes:function(res){
            console.log(res)
            if(res.statusCode==200){

                that.setData({
                    movie:res.data
                })
                wx.hideNavigationBarLoading({
                    title:res.data.rating.average + "分：" +res.data.title,
                })
                
            }
        },
        fail:function(){

        },
        complete:function(){

        }
    })
    wx.showNavigationBarLoading()
}
})
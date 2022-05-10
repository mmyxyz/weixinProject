// index.js
let itemWidth = 0;
const db = wx.cloud.database();
const _ =db.command;
var app = getApp();
Page({
  onLoad:function(options){
    this.getData()
         },
  onReachBottom:function(){
    var page=this.data.dataList.length
    console.log(page)
    this.getData(3,page)
  },


onShow(){
  console.log(app.globalData.userInfo)
},
    /**
     * 页面的初始数据
     */
      data:{
        dataObj:" ",
        dataList:[]
      },

  //获取数据
//   getData(){
//     db.collection("demolist").orderBy("zan","desc")
//  .get()
// .then(res=>{
//   this.setData({
//     dataList:res.data
//   })
// }) 
// },
 //筛选数据
      searchData(){
        db.collection('demolist').where({
          username:"张三"
        }).get().then(res=>{
          console.log(res)
          this.setData({
            dataObj:res.data
          })
         })
        // var currentID=event.currentTarget.dataset.id;
        // wx.navigateTo({
        //   url: '/pages/info/info?id='+currentID,
        // })
      },
             //插入数据、
             addData(){
               wx.showLoading({
                 title:'数据加载中...',
                 mask:true
               })
               db.collection("demolist").add({
               data:{
                   title:"ceshi",
                   userid:"2",
                   username:"李四",
                   site:"武汉"
               }
              }).then(res=>{
                console.log(res)
                wx.hideLoading()
              })
             },
          //    onLoad:function(options){
          //     this.getData();
          //     db.collection("demolist").watch({
          //     onChange:res=>{
          //         this.setData({
          //             dataArr:res.docs
          //         })
          //     },
          //     onError:err => {
          //         console.log(err)
          //     }
          // })
          // }

       
            getData(num=5,page=0){
              wx.cloud.callFunction({
                name:"getData",
                data:{
                  num:num,
                  page:page
                }
              }).then(res=>{
                var oldData=this.data.dataList
                var newData=oldData.concat(res.result.data);
              
                this.setData({
                  dataList:newData
                })
              })
            },
          })

        
    
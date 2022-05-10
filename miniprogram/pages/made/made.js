// pages/made/made.js
const db = wx.cloud.database();
var urlArr=[];
var filePath=[];
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hasUserInfo: false,
        tempImg: [],
    fileIDs: [],
    },
    
      /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //取用全局变量
  
        const that=this;
        wx.getStorage({
         key: 'hasUserInfo',
         success (res) {
           console.log(res)
           wx.getStorage({
             key:'userInfo',
             success(res){
               that.setData({
                 userInfo:JSON.parse(res.data) ,
                 hasUserInfo: true,
               })
             }
           })
         },
         fail(){
          console.log("请登录")
       }
        })
         },

      
//上传图片 获取临时路径
clickBtn(){
  wx.chooseImage({
    success:res=>{
      console.log(res.tempFilePaths)
      this.setData({
        arr:res.tempFilePaths
      })
      filePath=res.tempFilePaths
    }
  })
},
//提交图片入库函数 得到真实路径 待调用
cloudFile(filename,path){
  wx.showLoading({
    title: '上传中',
  })
  wx.cloud.uploadFile({
    //上传要有两个参数，路径文件名
    cloudPath:filename+".jpg",
    //临时路径filepath
    filePath:path
  }).then(res=>{
    urlArr.push(res.fileID)
    if(filePath.length==urlArr.length){
      this.setData({
        urlArr
      })
    }
    app.globalData.fileID=  urlArr
    console.log(app.globalData.fileID)
    wx.hideLoading()
  })
},

//提交表单到数据库
btnSub(res){
    var title =res.detail.value.title;
    var content =res.detail.value.content;
    let fileID=app.globalData.fileID
    let userInfo=JSON.parse(app.globalData.userInfo)
    filePath.forEach((item,idx)=>{
      var filename=Date.now()+"_"+idx;
      this.cloudFile(filename,item)
    })
    db.collection("demolist").add({
        data:{
            title :title,
            content:content,
            fileID:fileID,
            avatarUrl:userInfo.avatarUrl,
            nickName:userInfo.nickName,
            createTime: db.serverDate() //服务端的时间
        }
    }).then(res=>{
        console.log(res)
    })
},
showToast(){
    wx.showToast({
      title: '提交成功',
      icon: 'success',
      duration: 2000//持续的时间
    })
   this.setData({
       title:"",
       content:"",
       arr:""
   })
  },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
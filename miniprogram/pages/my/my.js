const db = wx.cloud.database();
var myVlu = "";
var app = getApp();
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },
  bindGetUserInfo(e) {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
 wx.getStorage({
  key: 'hasUserInfo',
  success (res) {
    wx.getStorage({
      key:'userInfo',
      success(res){
        app.globalData.userInfo=res.data

        that.setData({
          userInfo:JSON.parse(res.data) ,
          hasUserInfo: true,
        })
      }
    })
  },
  fail(){
    if (wx.getUserProfile) {
      that.setData({
        canIUseGetUserProfile: true,
      })
    }
}
 })
  },
  
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.userInfo=res.userInfo
  
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
        wx.cloud.callFunction({    //调用云函数获取openid
          name:"getOpenid",
          complete:res=>{
            db.collection("demouser").where({
              _openid:res.result.openid   //进行筛选
            }).get({
              success:res=>{  
                if(res.data.length==0){
                  //通过判断data数组长度是否为0来进行下一步的逻辑处理
                  wx.cloud.database().collection('demouser').add({
                    data:{
                  avatarUrl:app.globalData.userInfo.avatarUrl,
                  nickName:app.globalData.userInfo.nickName
                    },
                    success(res){
                      console.log(app.globalData.userInfo)
                    }
                  })
                }
              }
            })
          }
        }) 
        wx.setStorageSync('userInfo', JSON.stringify(res.userInfo))
        wx.setStorageSync('hasUserInfo', JSON.stringify(true))
      },
    })
  },
  loginOut(){
    var that=this
    app.globalData.userInfo=null
    that.setData({
      userInfo:null,
      hasUserInfo:false,
      canIUseGetUserProfile:true
    })
    wx.getStorage({
      key:'userInfo',
      success(res){
        that.setData({
          userInfo:null
        })
      }
    })
  },
  // //获取输入的内容
  myIpt(res) {
    var vlu = res.detail.value;
    myVlu = vlu;
  },
  delData() {
    db.collection("demolist")
      .doc(myVlu)
      .remove()
      .then(res => {
        console.log(res)
      })
  },
  //获取记录个数
  btnNum() {
    db.collection("demolist").count()
      .then(res => {
        console.log(res)
      })
  },
  // getData(){
  //     db.collection('demolist').orderBy("time","desc").where({
  //         username:"张三"
  //       }).get().then(res=>{
  //         console.log(res)
  //         this.setData({
  //           dataObj:res.data
  //         })
  //        })
  //     },

  // //生命周期函数-监听页面加载
  // onLoad:function(options){
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

 })
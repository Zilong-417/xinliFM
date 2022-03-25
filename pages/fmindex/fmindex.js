// pages/fmindex/fmindex.js
const app = getApp();
var util = require('../../util/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    part1: [],
    marqueePace: 1, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    marquee_margin: 30,
    size: 14,
    interval: 20, // 时间间隔
    hist_hidden:true,
    play:app.globalData.play
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var part1 = []
    console.log(app.globalData.history)
    that.setData({
      cover: app.globalData.cover,
      speak: app.globalData.speak,
      title: app.globalData.title,
      url: app.globalData.url,
      id: app.globalData.id,
      history:app.globalData.history,
      play:app.globalData.play
    })
    console.log(app.globalData.cover + '/' + app.globalData.speak + '/' + app.globalData.title)
    //平静舒压模块
    util.getfm('压力', (res) => {
      console.log(res)
      part1.push({
        id: 1,
        item: res
      })
      that.setData({
        items1: res,
        part1: part1
      });
      console.log(that.data.part1)
    });
    //情绪管理模块
    util.getfm('情绪', (res) => {
      console.log(res)
      part1.push({
        id: 2,
        item: res
      })
      that.setData({
        items2: res,
        part1: part1
      });
    });
    //正念生活模块
    util.getfm('生活', (res) => {
      console.log(res)
      part1.push({
        id: 3,
        item: res
      })
      that.setData({
        items3: res,
        part1: part1
      });
    });
    //助眠冥想模块
    util.getfm('冥想', (res) => {
      console.log(res)
      part1.push({
        id: 4,
        item: res
      })
      that.setData({
        items4: res,
        part1: part1
      });
    });
    //音乐模块
    util.getfm('晚安', (res) => {
      console.log(res)
      part1.push({
        id: 5,
        item: res
      })
      that.setData({
        items5: res,
        part1: part1
      });
    });
    //旅行故事模块
    util.getfm('治愈', (res) => {
      console.log(res)
      part1.push({
        id: 6,
        item: res
      })
      that.setData({
        items6: res,
        part1: part1
      });
    });
    var that = this
    console.log(app.globalData.id)
    console.log(app.globalData.url)
    //获取播放历史
    try {
      var value = wx.getStorageSync('history')
      console.log(value)
      that.setData({
        history: value
      })
    } catch (e) {
      console.log('失败')
    }
    if(app.globalData.history!=[]){
      that.setData({
        hist_hidden:true
      })
    }else if(app.globalData.history.length==[]){
      that.setData({
        hist_hidden:false
      })
    }
  },
  //前往更多界面
  gomore(e) {
    console.log(e)
    var that = this
    console.log(that.data.part1)
    var part1 = JSON.stringify(that.data.part1);
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '/pages/moreitem/moreitem?part=' + encodeURIComponent(part1) + '&num=' + num,
    })
  },
  //前往播放界面
  gofm_item(e) {
    var that = this
    console.log(e)
    var fmurl = e.currentTarget.dataset.url
    var fmid = e.currentTarget.dataset.id
    var cover = e.currentTarget.dataset.cover
    var title = e.currentTarget.dataset.title
    var speak = e.currentTarget.dataset.speak
    var viewnum = e.currentTarget.dataset.viewnum
    console.log(fmid)
    console.log(viewnum)
    wx.navigateTo({
      url: '/pages/fmplayer/fmplayer?cover=' + cover + '&fmid=' + fmid + '&spaek=' + speak + '&title=' + title +'&viewnum=' + viewnum + '&fmurl=' + fmurl 
    })
  },
  //关闭声音
  pause(e) {
    console.log(e)
    var that = this
    if (!that.data.play) {
      app.globalData.music_on = true;
      app.globalData.music_playing = false;
      app.globalData.audioCxt.pause();
      app.globalData.play=false
      that.setData({
        play:!app.globalData.play,
      })
    } else {
    app.globalData.music_on = true;
    app.globalData.music_playing = true;
      app.globalData.audioCxt.play();
      app.globalData.play=true
      that.setData({
        play:!app.globalData.play,
      })
    }

  },
  //前往搜索界面
  gosearch(){
    wx.navigateTo({
      url: '../../pages/fmsearch/fmsearch'
    })
  },
  //删除历史记录
  delhist(){
    var that=this
    wx.removeStorage({
      key: 'history',
      success (res) {
        console.log(res)
        app.globalData.history=[]
        that.setData({
          history:''
        })
    }})

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
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
/*fmplay.js */
//InnerAudioContext实例
const app = getApp();
var audioCxt;
//动画
var audioAnimation;
audioCxt = wx.createInnerAudioContext();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    audioAnimation: null,
    //音乐是不是开始
    music_on: true,
    //音乐是不是在播放
    music_playing: false,
    //显示的时间
    musicTime: '00:00',
    sliderValue: 0
  },
  onLoad: function (options) {
    var that = this
    console.log(options)
    console.log(options.fmurl)
    console.log(options.fmid)
    console.log(options.cover)
    console.log(options.viewnum)
    this.setData({
      url: options.fmurl,
      id: options.fmid,
      cover: options.cover,
      speak: options.speak,
      title: options.title,
      viewnum: options.viewnum
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var that = this
    audioCxt.src = that.data.url + '?id=' + that.data.id + 'flag=0'
    //音乐播放结束触发
    audioCxt.onEnded((res) => {
        //修改属性。去除css状态
        app.globalData.data.music_on = false;
        this.setData({
          music_on: this.data.music_on
        })
        //重新播放
        audioCxt.seek(0);
        this.setData({
          musicTime: '00:00',
          sliderValue: 0
        })
      }),
      //在播放状态，绑定播放进度更新事件。然后控制进度条和时间显示
      audioCxt.onPlay((res) => {
        audioCxt.onTimeUpdate(this.timeUpdate)
      })
  },

  //播放按钮事件
  playMusic: function () {
    var that = this
    if (!that.data.hidden) {
      console.log(that.data.viewnum)
      app.globalData.music_on = true;
      app.globalData.music_playing = true;
      app.globalData.url = that.data.url,
        app.globalData.id = that.data.id,
        app.globalData.cover = that.data.cover,
        app.globalData.speak = that.data.speak,
        app.globalData.title = that.data.title,
        app.globalData.viewnum = that.data.viewnum
      app.globalData.audioCxt = audioCxt
      audioCxt.play();
      console.log('这里' + app.globalData.title)
      console.log(app.globalData.history)
      //存放播放历史
      var hist = app.globalData.history
      //是否收藏
      app.globalData.hidden=true
      hist.unshift({
        fmurl: that.data.url,
        fmid: that.data.id,
        cover: that.data.cover,
        title: that.data.title,
        speak: that.data.speak,
        viewnum: that.data.viewnum
      })
      app.globalData.history = hist
      //图片添加css样式，旋转样式
      this.setData({
        hidden:app.globalData.hidden,
        music_on: app.globalData.music_on,
        music_playing: app.globalData.music_playing
      })
      console.log(that.data.hidden)
      //将播放历史存进本地
      try {
        wx.setStorageSync('history', app.globalData.history)
      } catch (e) {}
    } else {
      app.globalData.music_on = true;
      app.globalData.music_playing = false;
      //是否收藏
      app.globalData.hidden=false
      audioCxt.pause();
      this.setData({
        hidden:app.globalData.hidden,
        music_on: app.globalData.music_on,
        music_playing: app.globalData.music_playing
      })
      console.log(that.data.hidden)
    }
  },


  //停止按钮事件
  stopMusic: function () {
    audioCxt.stop();
    app.globalData.music_on = false;
    this.setData({
      music_on: app.globalData.music_on
    })
  },

  //进度条改变后触发事件
  audioChange: function (e) {
    var length = audioCxt.duration;
    var percent = e.detail.value;
    //用进度条百分比 *　整个音乐长度
    var musicTime = Math.round(length / 100 * percent);
    audioCxt.seek(musicTime);

    //因为在拖动进度条时，去除了时间绑定，所以进度改变后重新绑定
    audioCxt.onTimeUpdate(this.timeUpdate);

    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },
  //进度条拖动过程中触发事件
  audioChanging: function (e) {
    //因为在进度条拖动的时候，还会在timeUpdate里面修改进度条的value，倒置拖动受影响，所以当拖动的时候需要取消绑定
    audioCxt.offTimeUpdate();

    //拖动时修改时间显示
    var length = audioCxt.duration;
    var percent = e.detail.value;
    var musicTime = Math.round(length / 100 * percent);
    this.setData({
      musicTime: this.musicTimeFormat(musicTime)
    })
  },

  //将秒钟转化为mm：ss的时间格式
  musicTimeFormat: function (time) {
    var second = Math.floor(time % 60);
    if (second < 10) {
      second = '0' + second;
    }
    var minute = Math.floor(time / 60);
    if (minute < 10) {
      minute = '0' + minute;
    }
    return minute + ':' + second;
  },

  //播放的时候，更新进度条和时间显示
  timeUpdate: function () {
    var time = app.globalData.audioCxt.currentTime;
    var percent = Math.round(time / app.globalData.audioCxt.duration * 100);
    this.setData({
      musicTime: this.musicTimeFormat(time),
      sliderValue: percent
    })
  },
  //页面刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    setTimeout(function (res) {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
      that.onLoad();
    }, 1500);
  },
})
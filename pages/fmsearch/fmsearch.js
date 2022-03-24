// pages/fmsearch/fmsearch.js
const app = getApp()
var util = require('../../util/util.js');
//获取录音管理器对象
var rm = wx.getRecorderManager();
var plugin = requirePlugin("WechatSI")
// 获取**全局唯一**的语音识别管理器**recordRecoManager**
let manager = plugin.getRecordRecognitionManager()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startX: 0, //开始坐标
        startY: 0,
        page: 1,
        search_value: '',
        part1: [],
        items: '',
        yuyinhidden:true
    },
    touchE: function (e) {
        // console.log(e);
        var that = this
        if (e.changedTouches.length == 1) {
            //手指移动结束后触摸点位置的X坐标
            var endX = e.changedTouches[0].clientX;
            //触摸开始与结束，手指移动的距离
            var disX = that.data.startX - endX;
            var delBtnWidth = that.data.delBtnWidth;
            //如果距离小于删除按钮的1/2，不显示删除按钮
            var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";

            //获取手指触摸的是哪一项
            var index = e.currentTarget.dataset.index;
            var list = that.data.list;
            list[index].txtStyle = txtStyle;
            //更新列表的状态
            that.setData({
                list: list
            });
        }
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.list.forEach(function (v, i) {
            if (v.isTouchMove) //只操作为true的
                v.isTouchMove = false;
        })
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            list: this.data.list
        })
    },
    //滑动事件处理
    touchmove: function (e) {
        var that = this,
            index = e.currentTarget.dataset.index, //当前索引
            startX = that.data.startX, //开始X坐标
            startY = that.data.startY, //开始Y坐标
            touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
            //获取滑动角度
            angle = that.angle({
                X: startX,
                Y: startY
            }, {
                X: touchMoveX,
                Y: touchMoveY
            });
        that.data.list.forEach(function (v, i) {
            v.isTouchMove = false
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false
                else //左滑
                    v.isTouchMove = true
            }
        })
        //更新数据
        that.setData({
            list: that.data.list
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
        var _X = end.X - start.X,
            _Y = end.Y - start.Y
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        //获取搜索历史
        try {
            var value = wx.getStorageSync('searchhistory')
            console.log(value)
            that.setData({
                list: value
            })
        } catch (e) {
            console.log('失败')
        }
        //录音
        //有新的识别内容返回，则会调用此事件
        manager.onRecognize = function (res) {
            console.log("current result", res.result)
        }
        manager.onStop = function (res) {
            console.log('识别开始');
            var result = res.result;
            if (result == '') {
                wx.showToast({
                    icon: 'error',
                    title: '没听清！'
                })
            } else {
                var s = result.indexOf('。') //找到第一次出现下划线的位置
                result = result.substring(0, s) //取下划线前的字符
                var searchType = that.data.searchType;
                that.setData({
                    search_value: result
                })
                wx.showToast({
                    title: result,
                })
            }
        }
        //识别错误事件
        manager.onError = function (res) {
            console.log('manager.onError')
            console.log(res) //报错信息打印
            wx.showToast({
                title: '识别失败！',
                icon: 'error',
            })
            // UTIL.log("error msg", res.msg)
        }
    },
    //获取输入框焦点
    inputfouse(e) {
        var that = this
        that.setData({
            bottom_val: e.detail.height
        })
    },
    //失去输入框焦点
    inputblur(e) {
        var that = this
        that.setData({
            bottom_val: 0
        })
    },
    //取消返回上一级事件
    cancel() {
        wx.navigateBack({
            delta: 1
        })
    },
    //获取输入框内容
    getvalue(e) {
        console.log(e)
        var that = this
        that.setData({
            search_value: e.detail.value
        })
    },
    //清空输入框
    empty() {
        var that = this
        that.setData({
            search_value: ''
        })
    },
    //前往搜索界面
    search(e) {
        var that = this
        //存放历史搜索
        var hist = app.globalData.search_history
        hist.unshift({
            search_name: that.data.search_value
        })
        app.globalData.search_history = hist
        //将历史存进本地历史搜索
        try {
            wx.setStorageSync('searchhistory', app.globalData.search_history)
        } catch (e) {}
        //查询相关
        console.log(that.data.search_value)
        util.getfm(that.data.search_value, (res) => {
            console.log(res)
            that.setData({
                items: res
            });
            var items = JSON.stringify(that.data.items);
            wx.navigateTo({
                url: '/pages/fmlist/fmlist?items=' + encodeURIComponent(items)
            })
        });
    },
    //删除指定缓存记录
    delBtn(e) {
        console.log(e)
        console.log(e.currentTarget.dataset.index)
        //先取再改后存
        var value = wx.getStorageSync('searchhistory')
        console.log(value)
        value.splice(e.currentTarget.dataset.index, 1)
        console.log(value)
        try {
            wx.setStorageSync('searchhistory', value)
          } catch (e) {
           
           }
           this.onLoad()
    },
    //点击语音事件
    yuyin(){
        var that=this
        that.setData({
            yuyinhidden:!that.data.yuyinhidden
        })
    },
    // 点击录音按钮
    onRecordClick: function () {
        wx.getSetting({
            success: function (t) {
                console.log(t.authSetting), t.authSetting["scope.record"] ? console.log("已授权录音") : (console.log("未授权录音"),
                    wx.openSetting({
                        success: function (t) {
                            console.log(t.authSetting);
                        }
                    }));
            }
        });
    },
    //长按按钮录音开始
    recordStart: function (e) {
        var that = this
        // UTIL.stopTTS();
        manager.start({
            duration: 30000,
            lang: "zh_CN"
        }), that.setData({
            touchStart: e.timeStamp,
            isTouchStart: true,
            isTouchEnd: false,
            showPg: true,
        })
        var a = 15,
            o = 10;
        this.timer = setInterval(function () {
            that.setData({
                value: that.data.value - 100 / 1500
            }), (o += 10) >= 1e3 && o % 1e3 == 0 && (a--, console.log(a), a <= 0 && (rm.stop(),
                clearInterval(that.timer), that.animation2.scale(1, 1).step(), that.setData({
                    animationData: that.animation2.export(),
                    showPg: false,
                })));
        }, 10);
    },
    //松开按钮录音结束
    recordTerm: function (e) {
        console.log(e)
        //结束录音
        var searchType = e.currentTarget.dataset.type;
        this.setData({
            isTouchEnd: true,
            isTouchStart: false,
            touchEnd: e.timeStamp,
            showPg: false,
            value: 100,
            searchType: searchType,
            background: "#ED6C00",
            yysb: "长按语音识别"
        }), clearInterval(this.timer);

        manager.stop();
        wx.showToast({
            title: '正在识别……',
            icon: 'loading',
            duration: 5000
        })
    },
    //点击历史搜索记录
    searchby(e){
        console.log(e)
        var that=this
        var searchname=e.currentTarget.dataset.searchname
        util.getfm(searchname, (res) => {
            console.log(res)
            that.setData({
                items: res
            });
            var items = JSON.stringify(that.data.items);
            wx.navigateTo({
                url: '/pages/fmlist/fmlist?items=' + encodeURIComponent(items)
            })
        });
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
        this.onLoad()
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
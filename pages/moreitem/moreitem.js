//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navData: [{
                text: '平静舒压'
            },
            {
                text: '情绪管理'
            },
            {
                text: '正念生活'
            },
            {
                text: '助眠冥想'
            },
            {
                text: '空耳音乐'
            },
            {
                text: '暖心故事'
            }
        ],
        currentTab: '',
        navScrollLeft: 0
    },
    //事件处理函数
    onLoad: function (options) {
        console.log(options)
        var part = JSON.parse(decodeURIComponent(options.part))
        var num=options.num
        console.log(part)
        var that = this;
        that.setData({
            yxlist: part,
            currentTab:num
        })
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    pixelRatio: res.pixelRatio,
                    windowHeight: res.windowHeight,
                    windowWidth: res.windowWidth
                })
            },
        })
    },
    switchNav(event) {
        var cur = event.currentTarget.dataset.current;
        //每个tab选项宽度占1/5
        var singleNavWidth = this.data.windowWidth / 5;
        //tab选项居中                            
        this.setData({
            navScrollLeft: (cur - 2) * singleNavWidth
        })
        if (this.data.currentTab == cur) {
            return false;
        } else {
            this.setData({
                currentTab: cur
            })
        }
    },
    switchTab(event) {
        var cur = event.detail.current;
        var singleNavWidth = this.data.windowWidth / 5;
        this.setData({
            currentTab: cur,
            navScrollLeft: (cur - 2) * singleNavWidth
        });
    },
    //前往播放界面
    gofm_item(e) {
        console.log(e)
        var fmurl = e.currentTarget.dataset.url
        var fmid = e.currentTarget.dataset.id
        var cover = e.currentTarget.dataset.cover
        var title = e.currentTarget.dataset.title
        console.log(fmid)
        wx.navigateTo({
            url: '/pages/fmplayer/fmplayer?cover=' + cover + '&fmid=' + fmid + '&title='+title+'&fmurl=' + fmurl
        })
    },
})
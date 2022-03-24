// pages/fmlist/fmlist.js
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options)
        var items = JSON.parse(decodeURIComponent(options.items))
        this.setData({
            items: items
        })
    },
    //前往播放界面
    gofm_item(e) {
        console.log(e)
        var fmurl = e.currentTarget.dataset.url
        var fmid = e.currentTarget.dataset.id
        var cover = e.currentTarget.dataset.cover
        console.log(fmid)
        wx.navigateTo({
            url: '/pages/fmplayer/fmplayer?cover=' + cover + '&fmid=' + fmid + '&fmurl=' + fmurl
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
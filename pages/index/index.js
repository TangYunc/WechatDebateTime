// pages/index/index.js
Page({
  leftMove: 0,
  rightMove: 0,
  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    actionSheetItems: [],
    title: "",
    desc: "",
    voice: 0,
    leftAnimationData: {},
    rightAnimationData: {},
    leftTime: 0,
    rightTime: 0,
    src: '/assets/sound/countdown.mp3',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var configs = wx.getStorageSync('configs');
    var actionSheetItems = [];
    var first = true;
    for (var i in configs) {
      var config = configs[i];
      if (config.state) {
        if (first) {
          var desc = config.desc.replace(/@/g, config.time + "秒");
          this.setData({
            title: config.name,
            desc: desc,
            leftTime: config.time,
            rightTime: config.time,
            voice: config.voice
          });
          first = false;
        }
        actionSheetItems.push({
          name: config.name,
          id: config.id
        });
      }
    }
    this.setData({
      actionSheetItems: actionSheetItems
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  actionSheetTap: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindItemTap: function(e) {
    this.leftStop();
    this.rightStop();
    var id = e.target.id;
    var configs = wx.getStorageSync('configs');
    var config = configs[id];
    var desc = config.desc.replace(/@/g, config.time + "秒");
    this.setData({
      title: config.name,
      desc: desc,
      actionSheetHidden: true,
      leftTime: config.time,
      rightTime: config.time,
      voice: config.voice
    });
  },
  leftStop: function() {
    clearInterval(this.leftInterval);
    this.leftInterval = 0;
    this.audioPause();
  },
  rightStop: function() {
    clearInterval(this.rightInterval);
    this.rightInterval = 0;
    this.audioPause();
  },
  leftStart: function() {
    this.rightStop();
    if (this.leftInterval && this.leftInterval != 0) {
      this.leftStop();
      return;
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.rotate(this.leftMove += 100).step();
    this.setData({
      leftAnimationData: animation.export()
    })
    var page = this;
    var leftInterval = setInterval(function() {
      if (page.data.leftTime <= 0) {
        page.leftStop();
        return;
      }
      if (page.data.leftTime <= page.data.voice) {
        page.audioPlay();
      }
      animation.rotate(page.leftMove += 100).step();
      page.setData({
        leftAnimationData: animation.export()
      });
      page.setData({
        leftTime: page.data.leftTime - 1
      });
    }, 1000);
    this.leftInterval = leftInterval;

  },
  rightStart: function() {
    this.leftStop();
    if (this.rightInterval && this.rightInterval != 0) {
      this.rightStop();
      return;
    }
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.rotate(this.rightMove += 100).step();
    this.setData({
      rightAnimationData: animation.export()
    });
    var page = this;
    var rightInterval = setInterval(function() {
      if (page.data.rightTime <= 0) {
        page.rightStop();
        return;
      }
      if (page.data.rightTime <= page.data.voice) {
        page.audioPlay();
      }
      animation.rotate(page.rightMove += 100).step();
      page.setData({
        rightAnimationData: animation.export()
      });
      page.setData({
        rightTime: page.data.rightTime - 1
      });
    }, 1000);
    this.rightInterval = rightInterval;
  },
  audioPlay: function() {
    this.setData({
      action: {
        method: 'play'
      }
    })
  },
  audioPause: function() {
    this.setData({
      action: {
        method: 'pause'
      }
    })
  }
})
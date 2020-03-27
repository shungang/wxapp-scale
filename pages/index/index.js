// pages/index/index.js
Page({
  data: {
    weight: 50,
    height: 80,
    styles: {
      line: '#C2D7E7',
      bginner: '#fbfbfb',
      bgoutside: '#EBF6FF',
      font: '#A8BBCA',
      fontColor: '#A8BBCA',
      fontSize: 15
    }
  },
  onShow() {
    let cuScale = this.selectComponent('#cuScale')
    let showAge = true
    if (cuScale) {
      if (showAge)
        cuScale.init({
          min: 18,
          max: 108,
          int: true,
          active: 38,
          unit: '岁'
        })
      else
        cuScale.hidden()
    }
  }
})